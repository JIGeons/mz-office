import json
import os
import pathlib
import boto3
import hashlib
import botocore.exceptions

# 🟢 JSON 파일 로드 함수
def load_config(file_path):
    try:
        with open(file_path, "r") as config_file:
            config = json.load(config_file)  # JSON 파일을 Python 딕셔너리로 변환
        return config
    except FileNotFoundError:
        print(f"❌ 설정 파일을 찾을 수 없습니다: {file_path}")
        exit(1)
    except json.JSONDecodeError:
        print(f"❌ JSON 파일 형식 오류: {file_path}")
        exit(1)
    except Exception as e:
        print(f"❌ 설정 파일 로드 실패: {e}")
        exit(1)

# 🟢 설정 파일 로드
config_name = "/config/config_sep_mz-office.json"  # JSON 파일 경로
config_folder = str(pathlib.Path(__file__).parent.absolute())
config_path = config_folder + config_name
config = load_config(config_path)

# --------------- difine ---------------

# 🟢 NCP Object Storage 설정
ENDPOINT_URL = config["endPointURL"]
ACCESS_KEY = config["ncpAccessKeyId"]
SECRET_KEY = config["ncpSecretAccessKey"]
BUCKET_NAME = config["bucketName"]  # 생성한 버킷 이름
REGION = config["region"]
LOCAL_FOLDER = config["localFolder"]

try:
    # ✅ NCP Object Storage 클라이언트 생성
    s3_client = boto3.client(
        "s3",
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY
    )
except botocore.exceptions.NoCredentialsError:
    print("❌ AWS 인증 정보가 없습니다. ACCESS_KEY 및 SECRET_KEY를 확인하세요.")
    exit(1)
except botocore.exceptions.EndpointConnectionError:
    print(f"❌ Object Storage 엔드포인트에 연결할 수 없습니다: {ENDPOINT_URL}")
    exit(1)
except Exception as e:
    print(f"❌ 클라이언트 생성 실패: {e}")
    exit(1)

# ✅ 1️⃣ S3에 있는 기존 파일 목록 가져오기
def get_s3_files(bucket_name):
    existing_files = {}
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if "Contents" in response:
            for obj in response["Contents"]:
                existing_files[obj["Key"]] = obj["ETag"].strip('"')  # ✅ ETag 값 저장 (파일 해시값 역할)
        print("✅ S3 파일 목록 조회 완료")
    except botocore.exceptions.ClientError as e:
        print(f"❌ S3 파일 목록 조회 실패: {e}")
        return {}  # 오류 발생 시 빈 딕셔너리 반환하여 프로그램이 계속 실행되도록 함
    return existing_files


# ✅ 2️⃣ 로컬 파일 목록 및 해시값 계산
def get_local_files(folder_path):
    local_files = {}
    if not os.path.exists(folder_path):
        print(f"❌ 로컬 폴더가 존재하지 않습니다: {folder_path}")
        exit(1)
    try:
        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                object_key = os.path.relpath(file_path, folder_path).replace("\\", "/")  # ✅ S3 업로드 경로 변환

                # ✅ 파일 해시값 계산 (ETag와 비교)
                with open(file_path, "rb") as f:
                    file_hash = hashlib.md5(f.read()).hexdigest()
                local_files[object_key] = {"path": file_path, "hash": file_hash}
        print("✅ 로컬 파일 목록 조회 완료")
    except Exception as e:
        print(f"❌ 로컬 파일 목록 조회 실패: {e}")
        exit(1)
    return local_files


# ✅ 3️⃣ 변경된 파일만 업로드 (기존 파일 덮어쓰기)
def upload_updated_files(bucket_name, local_files, existing_files):
    uploaded_files = 0
    for object_key, info in local_files.items():
        file_path = info["path"]
        file_hash = info["hash"]

        # ✅ S3에 같은 해시값을 가진 파일이 있으면 업로드 건너뜀
        if object_key in existing_files and existing_files[object_key] == file_hash:
            print(f"🔹 변경 없음 (스킵): {object_key}")
            continue

        try:
            s3_client.upload_file(file_path, bucket_name, object_key)
            print(f"✅ 업로드 완료: {object_key}")
            uploaded_files += 1
        except botocore.exceptions.ClientError as e:
            print(f"❌ 업로드 실패: {file_path}, 오류 코드: {e.response['Error']['Code']}")
        except Exception as e:
            print(f"❌ 업로드 실패: {file_path}, 오류: {e}")

    if uploaded_files == 0:
        print("⚠️ 새로운 파일이 없거나 모든 업로드가 실패했습니다.")


# ✅ 4️⃣ S3에만 존재하는 파일 삭제 (로컬에 없는 파일 정리)
def delete_removed_files(bucket_name, local_files, existing_files):
    to_delete = [key for key in existing_files if key not in local_files]

    if not to_delete:
        print("🔹 삭제할 파일이 없습니다.")
        return

    try:
        delete_objects = {"Objects": [{"Key": key} for key in to_delete]}
        s3_client.delete_objects(Bucket=bucket_name, Delete=delete_objects)
        print(f"🗑️ 삭제 완료: {to_delete}")
    except botocore.exceptions.ClientError as e:
        print(f"❌ 파일 삭제 실패: 오류 코드: {e.response['Error']['Code']}")
    except Exception as e:
        print(f"❌ 파일 삭제 실패: {e}")


# ✅ 실행 순서
if __name__ == "__main__":
    print("\n🚀 Object Storage 업데이트 시작...")
    
    # ✅ 1. 기존 파일 목록 가져오기
    existing_files = get_s3_files(BUCKET_NAME)
    
    # ✅ 2. 로컬 파일 목록 가져오기
    local_files = get_local_files(LOCAL_FOLDER)

    # ✅ 3. 변경된 파일만 업로드
    upload_updated_files(BUCKET_NAME, local_files, existing_files)

    # ✅ 4. Object Storage에서 삭제된 파일 정리
    delete_removed_files(BUCKET_NAME, local_files, existing_files)

    print("🎉 Object Storage 업데이트 완료!")
