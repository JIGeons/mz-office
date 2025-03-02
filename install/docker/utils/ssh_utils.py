import paramiko, time
import os
import platform

# sftp 상에 경로를 생성한다.
# remote 경로가 directory이면, is_dir에 True를 전달한다.
def mkdir_p(sftp, remote, is_dir=False):
    dirs_ = []
    if is_dir:
        dir_ = remote
    else:
        dir_, basename = os.path.split(remote)
    while len(dir_) > 1:
        dirs_.append(dir_)
        dir_, _  = os.path.split(dir_)

    if len(dir_) == 1 and not dir_.startswith("/"):
        dirs_.append(dir_) # For a remote path like y/x.txt

    while len(dirs_):
        dir_ = dirs_.pop()
        try:
            sftp.stat(dir_)
        except:
            print("making ... dir",  dir_)
            sftp.mkdir(dir_)

# sftp 상에 파일을 업로드한다.
# src_path에 dest_path로 업로드한다. 두개 모두 file full path여야 한다.

def process(transferred, toBeTransferred):
    print("Transferred: {0}KB\t Out of: {1}KB".format((transferred/1024), (toBeTransferred/1024)), end='\r')

def file_upload(sftp, src_path, dest_path):
    mkdir_p(sftp, dest_path)
    try:
        sftp.put(src_path, dest_path, callback=process)
    except Exception as e:
        print("fail to upload " + src_path + " ==> " + dest_path)
        raise e
    print("success to upload " + src_path + " ==> " + dest_path)

# sftp 상에 directory를 업로드한다.
# src_directory, dest_directory 모두 directory 경로여야 한다.
# dest_directory에 src_directory가 포함되어 복사된다.
# 즉, src_directory에 CTRL+C, dest_directory에 CTRL+V한 효과가 있다.
def directory_upload(sftp, src_directory, dest_directory):
    mkdir_p(sftp, dest_directory, True)
    cwd = os.getcwd()
    os.chdir(os.path.split(src_directory)[0])
    parent=os.path.split(src_directory)[1]
    is_window=(platform.system() == "Windows")
    for walker in os.walk(parent):
        try:
            for file in walker[2]:
                pathname=os.path.join(dest_directory, walker[0], file)
                if (True == is_window):
                    pathname=pathname.replace('\\', '/')
                    file_upload(sftp, os.path.join(walker[0],file), pathname)
        except Exception as e:
            print(e)
            raise e

# ssh 명령을 수행한다.
# exit status를 리턴한다.
def ssh_execute(ssh, command, is_print=True):
    print('>>> ' + command)

    # ssh 명령의 결과로 exit status를 구하는게 쉽지 않다.
    # 따라서, 명령의 끝에 "mark=$?"를 출력하여,
    # 최종 exit statud를 구할 수 있도록 한다.
    exit_status=0
    mark="ssh_helper_result_mark!!@@="
    command=command+";echo " + mark + "$?"

    try:
        stdin, stdout, stderr = ssh.exec_command(command, get_pty=True)
    except Exception as e:
        print(e)
        raise e

    for line in stdout:
        msg=line.strip('\n')
        if (msg.startswith(mark)):
            exit_status=msg[len(mark):]
        else:
            if (True == is_print):
                print('<<< ' + line.strip('\n'))

    return int(exit_status)

def waitStrems(chan): 
    outdata = errdata = ""
    status='Normal'
    while status!='End':
        time.sleep(1)
        resp = chan.recv(65535).decode("utf-8")
        print('<<< ' + resp)
        if chan.recv_ready():
            outdata += resp 

        if chan.recv_stderr_ready(): 
            errdata += resp

        if (resp.count(" %") > 0): 
            status='End'

        if (resp.count("Password:") > 0): 
            status='End'
        
        if (resp.count("]#") > 0): 
            status='End'

        if (resp.count("]$") > 0): 
            status='End'
            
    return outdata, errdata

def ssh_shell_execute(channel, command):

    mark="ssh_helper_result_mark"
    command = command + " ; echo " + mark
    
    print('>>> ' + command)

    channel.send(command + "\n")
    outdata, errdata = waitStrems(channel)
    print('')
    print('')

def ssh_shell_password(channel, password):    
    print('>>> ' + password)
    channel.send(password + "\n")
    outdata, errdata = waitStrems(channel)

def get_ssh(host_ip, port, id, pw):
    try:
        # ssh client 생성
        ssh = paramiko.SSHClient()

        # ssh 정책 설정
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # connect
        ssh.connect(hostname=host_ip, port=port, username=id, password=pw)
    except Exception as e:
        print(e)
        raise e

    return ssh

def get_ssh_cert(path, id, certPath, pw):
    try:
        # ssh client 생성
        ssh = paramiko.SSHClient()

        # ssh 정책 설정
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        # connect
        ssh.connect(path, username=id, password=pw, key_filename=certPath)
    except Exception as e:
        print(e)
        raise e

    return ssh


def get_shell(ssh):
    channel = ssh.invoke_shell()
    # channel.settimeout(9999)
    return channel

def get_sftp(ssh):
    try:
        sftp = paramiko.SFTPClient.from_transport(ssh.get_transport())
    except Exception as e:
        print(e)
        raise e
    return sftp

def close_ssh(ssh):
    ssh.close()

def close_sftp(sftp):
    sftp.close()

def close_shell(channel):
    channel.close()