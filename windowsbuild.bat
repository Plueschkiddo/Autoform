@echo off
::CALL phonegap plugin remove cordova-plugin-pdfcreate
::CALL phonegap plugin add C:\Users\User\Documents\phonegapprojects\PDFCreatePlugin
CALL phonegap build android
scp -P 2222 C:\Users\User\Documents\phonegapprojects\Autoform\platforms\android\app\build\outputs\apk\debug\app-debug.apk 192.168.2.104:~/SDCard/Documents/
echo on