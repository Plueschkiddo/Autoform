/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.gelosinv = null;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    doMagicPlease : function () {
        var fileName = "myPdfFile.pdf";

        var options = {
            documentSize: 'A4',
            type: 'base64'
        };

        var pdfhtml =
            '<html>' +
            '<body style="font-size:120%">' +
            'This is the pdf content <br>' +
            '</body>' +
            '</html>';

        pdf.fromData(pdfhtml , options)
            .then(function(base64){
                // To define the type of the Blob
                var contentType = "application/pdf";

                // if cordova.file is not available use instead :
                // var folderpath = "file:///storage/emulated/0/Download/";
                var folderpath = cordova.file.externalRootDirectory + "Documents/"; //you can select other folders
                app.savebase64AsPDF(folderpath, fileName, base64, contentType);
            })
            .catch((err)=>console.log(err));
    },

        b64toBlob : function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    },

    savebase64AsPDF : function (folderpath,filename,content,contentType) {
    // Convert the base64 string in a Blob
        var DataBlob = app.b64toBlob(content, contentType);

        console.log("Starting to write the file :3");

        window.resolveLocalFileSystemURL(folderpath, function (dir) {
            console.log("Access to the directory granted successfully");
            dir.getFile(filename, {create: true}, function (file) {
                console.log("File created successfully.");
                file.createWriter(function (fileWriter) {
                    console.log("Writing content to file");
                    fileWriter.write(DataBlob);
                }, function () {
                    alert('Unable to save file in path ' + folderpath);
                });
            });
        });
    },

    validateInv : function() {
        var storageData  = window.localStorage.getItem('GELOS');

        if (storageData){
            app.gelosinv = JSON.parse(storageData);
            navigator.notification.alert(
                'Everything OK',
                function () {},
                'Validated Inventory',
                'OK'
            );
        } else {
            app.gelosinv = GELOS;
            window.localStorage.setItem('GELOS', JSON.stringify(GELOS));
            navigator.notification.alert(
                'Initiated standard Inventory',
                function () {},
                'Validated Inventory',
                'OK'
            );
        }
    },

    initiateTable : function() {
        var inventorytable = document.getElementById("inventorytable");
        var inventorytable2 = document.getElementById("inventoryALFtable");
        var i;

        for (i = 0; i < app.gelosinv.inventory.length; i++){
            // Insert a row at the end of the table
            var newRow = inventorytable.insertRow(-1);

            // Insert a cell in the row at index 0
            var numberCell = newRow.insertCell(0);
            var nameCell = newRow.insertCell(1);
            var containerCell = newRow.insertCell(2);
            // var amountCell = newRow.insertCell(3);

            // Append a text node to the cell
            var nameText = document.createTextNode(app.gelosinv.inventory[i].name);
            nameCell.appendChild(nameText);

            if(app.gelosinv.inventory[i].number){
                var numberText = document.createTextNode(app.gelosinv.inventory[i].number.toString());
                numberCell.appendChild(numberText);
            }
            else {
                numberCell.appendChild(document.createTextNode(""));
            }

            if(app.gelosinv.inventory[i].container) {
                var containerText = document.createTextNode(app.gelosinv.inventory[i].container);
                containerCell.appendChild(containerText);
            } else {
                containerCell.appendChild(document.createTextNode(""));
            }

            // var amountText = document.createTextNode(app.gelosinv.inventory[i]);
            // amountCell.appendChild(amountText);
        }

        for (i = 0; i < app.gelosinv.inventoryALF.length; i++){
            // Insert a row at the end of the table
            var newRow2 = inventorytable2.insertRow(-1);

            // Insert a cell in the row at index 0
            var numberCell2 = newRow2.insertCell(0);
            var nameCell2 = newRow2.insertCell(1);
            var containerCell2 = newRow2.insertCell(2);
            // var amountCell2 = newRow2.insertCell(3);

            // Append a text node to the cell
            var nameText2 = document.createTextNode(app.gelosinv.inventoryALF[i].name);
            nameCell2.appendChild(nameText2);

            if(app.gelosinv.inventoryALF[i].number){
                var numberText2 = document.createTextNode(app.gelosinv.inventoryALF[i].number.toString());
                numberCell2.appendChild(numberText2);
            }
            else {
                numberCell2.appendChild(document.createTextNode(""));
            }

            if(app.gelosinv.inventoryALF[i].container) {
                var containerText2 = document.createTextNode(app.gelosinv.inventoryALF[i].container);
                containerCell2.appendChild(containerText2);
            } else {
                containerCell2.appendChild(document.createTextNode(""));
            }

            // var amountText2 = document.createTextNode(app.gelosinvALF.inventory[i]);
            // amountCell2.appendChild(amountText2);

            newRow2.onclick = function(){
                navigator.notification.alert(
                    this.cells[1].innerText,
                    function(){},
                    "Table Row Clicked!",
                    "OK"
                );
            };
        }
    }
};
