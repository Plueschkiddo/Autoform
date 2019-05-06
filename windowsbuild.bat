@echo off
::CALL phonegap plugin remove cordova-plugin-pdfcreate
::CALL phonegap plugin add C:\Users\User\Documents\phonegapprojects\PDFCreatePlugin
CALL phonegap build android
scp -P 2222 C:\Users\User\Documents\phonegapprojects\Autoform\platforms\android\app\build\outputs\apk\debug\app-debug.apk 172.24.70.107:~/SDCard/Documents/
echo on

::E10909::
::B44C32::
::9EB6AD::
::F4F4F4::
::0C1C23::

::k1,k2 Produkte
::p1,p2,p3,p4 Tabellen

::i = 0;

::while (i < k1.length) {
::	if (i >= p1.length) {
::		p2[i - p1.length] = k1[i];
::	} else if (i >= 2 * p1.length) {
::		p3[i - 2 * p1.length] = k1[i];
::	} else if (i >= 2 * p1.length + p3.length) {
::		p4[i - (2 * p1.length + p3.length)] = k1[i];
::	} else {
::		p1[i] = k1[i];
::	}
::	i++;
::}

::while (i - k1.length < k2.length) {
::	if (i + 2 >= p1.length) {
::		p2[i + 2 - p1.length] = k2[i - k1.length];
::	} else if (i + 2 >= 2 * p1.length) {
::		p3[i + 2 - 2 * p1.length] = k2[i - k1.length];
::	} else if (i + 2 >= 2 * p1.length + p3.length) {
::		p4[i + 2 - (2 * p1.length + p3.length)] = k2[i - k1.length];
::	} else {
::		p1[i + 2] = k2[i - k1.length];
::	}
::	i++;
::}