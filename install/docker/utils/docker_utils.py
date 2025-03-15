
import os
from utils import ssh_utils as sshUtils



def makeImageTarFile(dockerImageName, dockerImageVersion, projectFolder, tarFilePath):
    # make docker image. [local]
    print('### cd ' + projectFolder + '; docker build --platform linux/amd64 --tag ' + dockerImageName + ':' + dockerImageVersion + ' ./ ')
    os.system('cd ' + projectFolder + '; docker build --platform linux/amd64 --tag ' + dockerImageName + ':' + dockerImageVersion + ' ./ ')

    # make .tar file. [local]
    print('### cd ' + projectFolder + '; docker save -o ' + tarFilePath + ' ' + dockerImageName)
    os.system('cd ' + projectFolder + '; docker save -o ' + tarFilePath + ' ' + dockerImageName)


def dockerUpdateSshCertAuth(
    sshIP, id, certPath, sshPassword,
    localTarFilePath, remoteTarFilePath, 
    dockerContainerName, dockerImageName, dockerImageVersion, remoteDockerPath, 
    destServicePort, innorServicePort, 
    destSslPort, innorSslPort, 
    destSshPort, innorSshPort, 
    remoteServerVolumePath, volumeDataPath):
    # connect [remote server]
    print('### connect ssh')
    ssh = sshUtils.get_ssh_cert(sshIP, id, certPath, sshPassword)

    dockerUpdateBySSH(ssh,
                "",
                localTarFilePath, remoteTarFilePath, 
                dockerContainerName, dockerImageName, dockerImageVersion, remoteDockerPath, 
                destServicePort, innorServicePort, 
                destSslPort, innorSslPort, 
                destSshPort, innorSshPort, 
                remoteServerVolumePath, volumeDataPath)


def dockerUpdateBySshPasswordAuth(
    sshIP, sshPort, id, password,
    localTarFilePath, remoteTarFilePath, 
    dockerContainerName, dockerImageName, dockerImageVersion, remoteDockerPath, 
    destServicePort, innorServicePort, 
    destSslPort, innorSslPort, 
    destSshPort, innorSshPort, 
    remoteServerVolumePath, volumeDataPath):

    # connect [remote server]
    print('### connect ssh')
    ssh = sshUtils.get_ssh(sshIP, sshPort, id, password)

    dockerUpdateBySSH(ssh,
                password,
                localTarFilePath, remoteTarFilePath, 
                dockerContainerName, dockerImageName, dockerImageVersion, remoteDockerPath, 
                destServicePort, innorServicePort, 
                destSslPort, innorSslPort, 
                destSshPort, innorSshPort, 
                remoteServerVolumePath, volumeDataPath)
    

def dockerUpdateBySSH(ssh,
                password,
                localTarFilePath, remoteTarFilePath, 
                dockerContainerName, dockerImageName, dockerImageVersion, remoteDockerPath, 
                destServicePort, innorServicePort, 
                destSslPort, innorSslPort, 
                destSshPort, innorSshPort, 
                remoteServerVolumePath, volumeDataPath):
    # connect [remote server]

    # get shell 
    channel = sshUtils.get_shell(ssh)

    # ps 출력 -> sudo 
    sshUtils.ssh_shell_execute(channel, "sudo docker ps")
    if password != '':
        sshUtils.ssh_shell_password(channel, password)

    # delete remote file
    sshUtils.ssh_shell_execute(channel, 'sudo rm ' + remoteTarFilePath)

    # .tar file upload. [remote]
    print('### upload .tar file')
    sftp = sshUtils.get_sftp(ssh)
    sshUtils.file_upload(sftp, localTarFilePath, remoteTarFilePath)

    # stop container [remote]
    sshUtils.ssh_shell_execute(channel, 'sudo docker stop ' + dockerContainerName)
    if password != '':
        sshUtils.ssh_shell_password(channel, password)

    # remove container [remote]
    sshUtils.ssh_shell_execute(channel, 'sudo docker rm ' + dockerContainerName)

    # remove image [remote]
    sshUtils.ssh_shell_execute(channel, 'sudo docker rmi ' + dockerImageName+ ':' + dockerImageVersion)

    # .tar file to image [remote]
    sshUtils.ssh_shell_execute(channel, 'cd ' + remoteDockerPath)
    sshUtils.ssh_shell_execute(channel, 'pwd ')
    sshUtils.ssh_shell_execute(channel, 'sudo docker load < ' + dockerImageName + '.tar')

    # # create container by image [remote]
    # ssh_shell_execute(channel, 'sudo docker create --name ' + dockerContainerName + ' -p ' + dockerContainerdestPort1 + ':' + dockerContainerinnorPort1 + ' ' + ' -p ' + dockerContainerdestPort2 + ':' + dockerContainerinnorPort2 + ' ' + dockerImageName + ':' + dockerImageVersion)

    # # start container [remote]
    # ssh_shell_execute(channel, 'sudo docker start ' + dockerContainerName)

    # run container by image [remote]
    sshUtils.ssh_shell_execute(
        channel, 
        'sudo docker run -itd --name ' + dockerContainerName + 
        ' -p ' + destServicePort + ':' + innorServicePort + ' ' + 
        ' -p ' + destSslPort + ':' + innorSslPort + ' ' + 
        ' -p ' + destSshPort + ':' + innorSshPort + 
        ' -v ' + remoteServerVolumePath + ':' + volumeDataPath + ' ' + dockerImageName + ':' + dockerImageVersion)


    # close shell
    print('### close shell')
    sshUtils.close_shell(channel)

    # close ssh
    print('### close ssh')
    sshUtils.close_ssh(ssh)

    # close sftp
    print('### close sftp')
    sshUtils.close_sftp(sftp)

    # delete .tar file
    print('### delete '+ localTarFilePath +' file' )
    os.system('rm ' + localTarFilePath)


def foreverSrcUpdateBySshPasswordAuth(
    sshIP, sshPort, id, password,
    sourceFolder, destFolerParent, destFoler,
    sourceZipFile, destZipFile):
    # sample code
    ssh = sshUtils.get_ssh(sshIP, sshPort, id, password)
    # Forever list 확인.
    sshUtils.ssh_execute(ssh, "forever list")
    # racos_kiosk_server 중지
    sshUtils.ssh_execute(ssh, "forever stop racos_kiosk_server")
    # 8082 포트 선택하여 프로세스 정지.
    sshUtils.ssh_execute(ssh, "kill -9 $(lsof -t -i:8082)")
    # upload source file.
    srcUpdate(ssh, sourceFolder, destFolerParent, destFoler, sourceZipFile, destZipFile)
    # Forever 실행.
    sshUtils.ssh_execute(ssh, "cd " + destFoler + "; forever start --uid racos_kiosk_server -a -c 'npm run server' ./")
    # close ssh
    print('### close ssh')
    sshUtils.close_ssh(ssh)


def dockerRestartBySshCertAuth(
    sshIP, id, certPath, certPassword, dockerContainerName):
    
    ssh = sshUtils.get_ssh_cert(sshIP, id, certPath, certPassword)
    # get shell 
    channel = sshUtils.get_shell(ssh)

    sshUtils.ssh_shell_execute(channel, "sudo docker ps")

    sshUtils.ssh_shell_execute(channel, 'sudo docker restart ' + dockerContainerName)

    # close ssh
    print('### close ssh')
    sshUtils.close_ssh(ssh)


def dockerRestartBySshPasswordAuth(
    sshIP, sshPort, id, password, dockerContainerName):
    ssh = sshUtils.get_ssh(sshIP, sshPort, id, password)
    # get shell 
    channel = sshUtils.get_shell(ssh)

    sshUtils.ssh_shell_execute(channel, "sudo docker ps")
    if password != '':
        sshUtils.ssh_shell_password(channel, password)

    sshUtils.ssh_shell_execute(channel, 'sudo docker restart ' + dockerContainerName)

    # close ssh
    print('### close ssh')
    sshUtils.close_ssh(ssh)


def dockerSrcUpdateBySshPasswordAuth(
    sshIP, sshPort, id, password,
    projectFolder, sourceFolder, destFolerParent, destFoler,
    sourceZipFile, destZipFile, dockerContainerName):
    # sample code
    ssh = sshUtils.get_ssh(sshIP, sshPort, id, password)
    # get shell     
    channel = sshUtils.get_shell(ssh)

    # upload source file.
    srcUpdate(ssh, projectFolder, sourceFolder, destFolerParent, destFoler, sourceZipFile, destZipFile)

    # close shell
    print('### close shell')
    sshUtils.close_shell(channel)
    
    # close ssh
    print('### close ssh')
    sshUtils.close_ssh(ssh)

def srcUpdate(ssh, projectFolder, sourceFolder, destFolerParent, destFoler, sourceZipFile, destZipFile):
    # 빌드한다.
    os.system('cd '+projectFolder+'/; npm run build;')
    # zip 파일을 만든다.
    os.system('cd '+sourceFolder+'/; zip -r '+sourceFolder+'/dist.zip ./;')
    # 안에있는 원본 삭제.
    sshUtils.ssh_execute(ssh, "cd " + destFolerParent + "; rm -rf dist")
    # zip 파일을 업로드 한다.
    sftp = sshUtils.get_sftp(ssh)
    sshUtils.file_upload(sftp,sourceZipFile,destZipFile)
    # 원격 zip 압풀파일을 푼다.
    sshUtils.ssh_execute(ssh, "cd " + destFoler + "; unzip dist.zip")
    # 원격 zip 파일을 삭제한다.
    sshUtils.ssh_execute(ssh, "cd " + destFoler + "; rm -rf dist.zip")
    #sftp 닫음
    sshUtils.close_sftp(sftp)
    # zip 파일 삭제.
    os.system('cd '+sourceFolder+'/; rm -rf dist.zip')
