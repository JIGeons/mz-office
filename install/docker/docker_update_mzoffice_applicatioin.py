# -*- coding: utf-8 -*-
import pathlib
from utils import config_replace_utils as configReplaceUtils
from utils import docker_utils as dockerUtils

#------------------------------------------- define ----------------------------------------------------------

# remote server IP Address
remoteServerIP = "101.79.8.115"
remoteServerUser = "root"
remoteServerPassword = 'U7%-%2q-fmc'

# myconect server project folder
projectFolder = str(pathlib.Path(__file__).parent.parent.parent.absolute())
print(projectFolder)
tarFolder = str(pathlib.Path(__file__).parent.parent.parent.parent.absolute())
print(tarFolder)

# docker image name
dockerImageName = "mzoffice_web"
dockerImageVersion = "0.0.1"

# docker container name
dockerContainerName = "NODE_SERVER_MZOFFICE_WEB"
dockerContainerinnorPort1 = "80"
dockerContainerdestPort1 = "8450"
dockerContainerinnorPort2 = "443"
dockerContainerdestPort2 = "8493"
dockerContainerinnorPort3 = "22"
dockerContainerdestPort3 = "8472"

# local tar file path
localTarFilePath = tarFolder + '/' + dockerImageName +'.tar'

# remote docker path
remoteDockerPath = "/Users/mzoffice/Documents/docker"

# remote tar file path
remoteTarFilePath = remoteDockerPath + '/' + dockerImageName +'.tar'

# docker volume path
remoteServerVolumePath = "/Users/mzoffice/volume"
volumeDataPath = "/data"


#------------------------------------------- run ----------------------------------------------------------

# config replacement.
# configReplaceUtils.replaceConfig(
#     projectFolder,
#     '/install/cert/dev.myconect.net/',
#     '/install/docker/holich/config/server_url_holich_guest_application.js')

# make image .tar file. [local]
dockerUtils.makeImageTarFile(dockerImageName, dockerImageVersion, projectFolder, localTarFilePath)

# update and restart
dockerUtils.dockerUpdateBySshPasswordAuth(
    remoteServerIP,
    22,
    remoteServerUser,
    remoteServerPassword,
    localTarFilePath,
    remoteTarFilePath,
    dockerContainerName,
    dockerImageName,
    dockerImageVersion,
    remoteDockerPath,
    dockerContainerdestPort1,
    dockerContainerinnorPort1,
    dockerContainerdestPort2,
    dockerContainerinnorPort2,
    dockerContainerdestPort3,
    dockerContainerinnorPort3,
    remoteServerVolumePath,
    volumeDataPath)