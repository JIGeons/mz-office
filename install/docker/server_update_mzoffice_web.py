import os
import paramiko
import pathlib
from scp import SCPClient


## Define
REACT_PROJECT_PATH = str(pathlib.Path(__file__).parent.parent.parent.absolute())
BUILD_DIR = "dist"
SERVER_HOST = "101.79.8.115"
SERVER_USER = "root"
SERVER_PASSWORD = "U7%-%2q-fmc"
REMOTE_PATH = "/var/www/mz-office"

def build_react_project():
    """React 프로젝트를 빌드하는 함수"""
    os.chdir(REACT_PROJECT_PATH)
    # os.system("npm install")
    os.system("npm run build")

def create_ssh_client():
    """SSH 클라이언트 생성"""
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(SERVER_HOST, username=SERVER_USER, password=SERVER_PASSWORD)
    return client

def upload_build_files():
    """빌드된 파일을 서버로 업로드"""
    client = create_ssh_client()
    scp = SCPClient(client.get_transport())

    local_build_path = os.path.join(REACT_PROJECT_PATH, BUILD_DIR)  # 로컬 빌드 디렉토리
    remote_build_path = os.path.join(REMOTE_PATH, BUILD_DIR)    # 서버 빌드 디렉토리 경로

    print(f"🚀 {local_build_path} → {remote_build_path} 업로드 중...")

    # 기존 build 폴더 삭제 후 업로드
    client.exec_command(f"rm -rf {remote_build_path}")  # 기존 빌드 폴더 삭제
    scp.put(local_build_path, recursive=True, remote_path=REMOTE_PATH)  # 새로운 빌드 업로드
    
    scp.close()
    client.close()

if __name__ == "__main__":
    print("🔧 React 프로젝트 빌드 시작...")
    build_react_project()
    
    print("🚀 서버로 빌드된 디렉토리 업로드 중...")
    upload_build_files()
    
    print("✅ 배포 완료!")