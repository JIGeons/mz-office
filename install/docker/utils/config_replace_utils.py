# import os
# import re
#
# def replaceConfig(projectFolder, certFolder, endPointPath):
#     print('### start replaceConfig')
#
#     # cert replacement.
#     originalCertPath = projectFolder + certFolder
#     targetCertPath = projectFolder + '/src/client/cert/'
#     os.system('cp -rf ' + originalCertPath + ' ' + targetCertPath)
#
#     # web end point replacement.
#     originalEndPointPath = projectFolder + endPointPath
#     targetEndPointPath = projectFolder + '/src/client/react/common/ServerUrl.js'
#
#     #   Read in the original file
#     with open(originalEndPointPath) as f:
#         urlContent = f.read()
#
#     #   Read in the file
#     with open(targetEndPointPath, 'r') as file :
#         filedata = file.read()
#
#     #   Replace the target string
#     filedata = re.sub('const ServerUrl = \'https(.*?);', urlContent, filedata)
#     #   Write the file out again
#     with open(targetEndPointPath, 'w') as file:
#         file.write(filedata)
#
#
#     print('### close replaceConfig')