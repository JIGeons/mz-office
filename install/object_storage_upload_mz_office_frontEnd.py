import base64
import hashlib
import os
import pathlib
import shutil
import subprocess
import json
import boto3
import botocore.exceptions

# 🟢 JSON 파일 로드 함수
def load_config(file_path):
    try:
        with open(file_path, "r") as config_file:
            config = json.load(config_file)  # JSON 파일을 Python 딕셔너리로 변환
        return config
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

project_path = str(pathlib.Path(__file__).parent.parent.absolute())
build_folder_name = "dist"
build_folder_path = project_path + "/" + build_folder_name
object_folder = "mz-office/"

# ✅ CORS 설정 JSON (정확한 포맷 유지)
cors_configuration = {
    "CORSRules": [
        {
            "AllowedOrigins": ["*"],  # 모든 도메인 허용
            "AllowedMethods": ["GET", 'PUT', "HEAD"],  # 허용할 메서드
            "AllowedHeaders": ["*"],  # 모든 헤더 허용
            "ExposeHeaders": ["ETag"],  # 노출할 응답 헤더
            "MaxAgeSeconds": 3000  # 캐시 유지 시간
        }
    ]
}

print(f"ENDPOINT_URL: {ENDPOINT_URL}")
print(f"ACCESS_KEY: {ACCESS_KEY}")
print(f"SECRET_KEY: {SECRET_KEY}")
print(f"BUCKET_NAME: {BUCKET_NAME}")
print(f"REGION: {REGION}")

print(f"Build path: {build_folder_path}")


# --------------- STS, S3 설정 --------------- #
### S3 클라이언트 생성 (NCP Object Storage 업로드용)
try:
    s3_client = boto3.client(
        "s3",
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY
    )

    try:
        s3_client.put_bucket_acl(
            Bucket=BUCKET_NAME,
            ACL="public-read"  # 또는 "public-read-write" 또는 "private"
        )
        print("✅ ACL 설정이 변경되었습니다!")
    except Exception as e:
        print(f"❌ ACL 설정 변경 실패: {e}")

    try:
        acl_response = s3_client.get_bucket_acl(Bucket=BUCKET_NAME)
        print("✅ 현재 버킷의 권한 목록:")
        for grant in acl_response["Grants"]:
            grantee = grant.get("Grantee", {}).get("ID", "Unknown")
            permission = grant.get("Permission", "Unknown")
            print(f"📌 사용자: {grantee} | 권한: {permission}")
    except Exception as e:
        print(f"❌ 권한 조회 실패: {e}")
    
    try:
        policy_response = s3_client.get_bucket_policy(Bucket=BUCKET_NAME)
        print("✅ 현재 버킷 정책:", policy_response["Policy"])
    except botocore.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchBucketPolicy":
            print("⚠️  현재 버킷에는 정책이 없습니다. (NoSuchBucketPolicy)")
        else:
            print(f"❌ 버킷 정책 조회 실패: {e}")
    except Exception as e:
        print(f"❌ 버킷 정책 조회 중 알 수 없는 오류 발생: {e}")
        
except Exception as e:
    print(f"❌ Object Storage 연결 실패: {e}")
    # exit(1) # Object Storage 연결 실패 시 종료


# --------------- 함수 정의 --------------- #
### 1. React 프로젝트 빌드 실행
def build_react_app():
    print("\n🚀 Step 1: React 빌드 시작...")
    try:
        subprocess.run([r"npm", "run", "build"], check=True)
        print("✅ Step 1 완료: React 빌드 완료!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Step 1 실패: React 빌드 실패: {e}")
        exit(1)

### 2. 'dist' 폴더 안의 모든 파일을 Object Storage로 업로드
def upload_folder_to_s3(folder_path, bucket_name):
    if not os.path.exists(folder_path):
        print(f"⚠️ Step 2 중단: '{folder_path}' 폴더가 존재하지 않습니다.")
        exit(1)

    print("\n🚀 Step 2: 파일 업로드 시작...")

    success_count = 0
    fail_count = 0
    failed_files = []

    try:
        # s3_client.put_object(Bucket=bucket_name, Key=object_folder)

        for root, _, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.normpath(os.path.join(root, file))  # ✅ 경로 정규화
                object_name = os.path.relpath(file_path, folder_path).replace("\\", "/")  # ✅ 업로드 경로 변환

                try:
                    s3_client.upload_file(
                        file_path, bucket_name, object_name,
                        ExtraArgs={'ACL': 'public-read'}  # ✅ 업로드 ACL 추가
                    )
                    print(f"✅ 업로드 완료: {object_name}")
                    success_count += 1
                except botocore.exceptions.ClientError as e:
                    error_code = e.response["Error"]["Code"]
                    error_message = e.response["Error"]["Message"]
                    print(f"❌ 업로드 실패: {file_path}")
                    print(f"   🚨 오류 코드: {error_code}")
                    print(f"   🛑 오류 메시지: {error_message}")

                    failed_files.append({"files": object_name, "error": error_message})
                    fail_count += 1
                except Exception as e:
                    print(f"❌ 알 수 없는 오류 발생: {file_path}, 오류: {e}")
                    failed_files.append({"files": object_name, "error": str(e)})
                    fail_count += 1

        print(f"\n📊 업로드 완료: 성공 {success_count}개, 실패 {fail_count}개")
        if fail_count > 0:
            print("\n🚨 업로드 실패 목록:")
            for failed in failed_files:
                print(f"❌ 파일: {failed['files']}, 오류: {failed['error']}")

        if success_count == 0:
            print("⚠️ Step 2 실패: 모든 파일 업로드 실패. 로컬 빌드 폴더를 삭제하지 않습니다.")
            exit(1)

    except KeyboardInterrupt:
        print("\n🛑 업로드 중단됨 (Ctrl+C). 빌드 폴더 삭제를 방지합니다.")
        exit(1)
    except Exception as e:
        print(f"\n❌ 파일 업로드 실패: {object_folder}, 오류: {e}")
        exit(1)

### 3. 정적 웹사이트 호스팅이 이미 설정되었는지 확인 후, 최초 1회만 실행
def check_and_enable_static_website(bucket_name):
    try:
        response = s3_client.get_bucket_website(Bucket=bucket_name)
        print("✅ 정적 웹사이트 호스팅이 이미 활성화되어 있습니다. 설정을 건너뜁니다.")
        print(f"🌍 웹사이트 URL: https://{bucket_name}.kr.object.ncloudstorage.com")
    except botocore.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchWebsiteConfiguration":
            print("\n🚀 Step 3: 정적 웹사이트 호스팅이 설정되지 않음. 활성화 중...")
            website_configuration = {
                "IndexDocument": {"Suffix": "index.html"},
                "ErrorDocument": {"Key": "404.html"}    # 404 페이지 사용 가능
            }
            try:
                s3_client.put_bucket_website(Bucket=bucket_name, WebsiteConfiguration=website_configuration)
                print(f"✅ Step 3 완료: 정적 웹사이트 호스팅이 설정되었습니다!")
                print(f"🌍 웹사이트 URL: https://{bucket_name}.kr.object.ncloudstorage.com")
            except Exception as e:
                print(f"❌ Step 3 실패: 정적 웹사이트 설정 오류: {e}")
                exit(1)
        else:
            print(f"❌ Step 3 실패: 웹사이트 설정 확인 오류: {e}")
            exit(1)

    try:
        s3_client.put_bucket_website(Bucket=bucket_name, WebsiteConfiguration=website_configuration)
        print(f"✅ Step 3 완료: 정적 웹사이트 호스팅이 설정되었습니다!")
        print(f"🌍 웹사이트 URL: https://{bucket_name}.kr.object.ncloudstorage.com")
    except Exception as e:
        print(f"❌ Step 3 실패: 정적 웹사이트 설정 오류: {e}")
        exit(1)

### 버킷 목록 조회
def get_bucket_list():
    print("\n✅ 버킷 리스트 조회")
    try:
        bucketList = s3_client.list_buckets()

        for index, bucket in enumerate(bucketList.get('Buckets',[]), start=1):
            bucketName = bucket.get('Name')
            bucket_info = f"{index}. {bucketName}"

            if bucketName == BUCKET_NAME:
                bucket_info += " ✅"

            print(bucket_info)
    except Exception as e:
        print("버킷 리스트가 존재 하지 않음.")


### ACL 설정
def put_owner_object_acl():
    print("1234")

# ✅ CORS 설정 적용 함수
def apply_cors_settings(bucket_name):
    print(f"\n🚀 {bucket_name}에 CORS 설정 적용 중..")

    try:    
        # 🔹 JSON 데이터를 정렬된 문자열로 변환 (들여쓰기 포함, 사람이 읽기 쉬운 형식)
        cors_config_json = json.dumps(cors_configuration, indent=4)  # ✅ JSON 문자열 변환
        cors_config_bytes = cors_config_json.encode("utf-8")  # ✅ 바이트 변환

        # 🔹 MD5 해시값 생성 (Base64 인코딩)
        md5_hash = hashlib.md5(cors_config_bytes).digest()
        content_md5 = base64.b64encode(md5_hash).decode("utf-8")  # ✅ Base64 인코딩된 MD5 해시

        # 🔹 `put_bucket_cors()` 호출 (ContentMD5 추가)
        s3_client.put_bucket_cors(
            Bucket=bucket_name,
            CORSConfiguration=json.loads(cors_config_json),  # ✅ JSON을 파싱하여 전달
            ContentMD5=content_md5  # ✅ 필수 Content-MD5 추가
        )

        corsResult = s3_client.get_bucket_cors(Bucket=BUCKET_NAME)
        print(f"✅ CORS 설정이 성공적으로 적용되었습니다! ({bucket_name})\n{corsResult['CORSRules']}")
    except botocore.exceptions.ClientError as e:
        error_code = e.response["Error"]["Code"]
        error_message = e.response["Error"]["Message"]
        print(f"❌ CORS 설정 실패: {error_code} - {error_message}")
        exit(1)
    except Exception as e:
        print(f"❌ 알 수 없는 오류 발생: {e}")

### Cors 설정 조회
def check_cors_settings(bucket_name):
    try:
        response = s3_client.get_bucket_cors(Bucket=bucket_name)
        print("✅ 현재 CORS 설정:")
        print(json.dumps(response["CORSRules"], indent=4))
    except botocore.exceptions.ClientError as e:
        error_code = e.response["Error"]["Code"]
        if error_code == "NoSuchCORSConfiguration":
            print("❌ 현재 CORS 설정이 없습니다.")
        else:
            print(f"❌ CORS 설정 조회 실패: {error_code} - {e.response['Error']['Message']}")
    except Exception as e:
        print(f"❌ 알 수 없는 오류 발생: {e}")

### 4. 로컬 'dist' 폴더 삭제
def delete_build_folder(folder_path):
    if os.path.exists(folder_path):
        print("\n🗑️ Step 4: 로컬 빌드 폴더 삭제 중...")
        shutil.rmtree(folder_path)
        print("✅ Step 4 완료: 로컬 빌드 폴더 삭제 완료!")
    else:
        print("⚠️ 'dist/' 폴더가 존재하지 않습니다.")

## 실행 순서
if __name__ == "__main__":
    get_bucket_list()   # 버킷 리스트 조회
    check_cors_settings(BUCKET_NAME)
    # apply_cors_settings(BUCKET_NAME)   # cors 설정 적용

    build_react_app()   # Step 1: React 빌드 실행
    upload_folder_to_s3(build_folder_path, BUCKET_NAME)  # Step 2: Object Storage 업로드
    check_and_enable_static_website(BUCKET_NAME)  # Step 3: 정적 웹사이트 호스팅 활성화
    delete_build_folder(build_folder_path)   # Step 4: 로컬 빌드 폴더 삭제
