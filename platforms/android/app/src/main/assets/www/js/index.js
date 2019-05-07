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
        document.addEventListener("backbutton", app.onBackKeyDown, false);
        app.validateInv();
        sortInventory();
        app.updateTable();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    },

    onBackKeyDown : function () {
        document.getElementById('id01').style.display='none';
        document.getElementById('id02').style.display='none';
        document.getElementById('id03').style.display='none';
    },

    doMagicPlease : function () {
        var fileName = "Bestellliste.pdf";

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

        pdf.fromData(app.inventoryToHTML() , options)
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
                'Bestehendes Inventar gefunden!',
                'OK'
            );
        } else {
            app.gelosinv = GELOS;
            window.localStorage.setItem('GELOS', JSON.stringify(GELOS));
            navigator.notification.alert(
                'Kein Inventar gefunden. Standardinventar angelegt!',
                function () {},
                'Validated Inventory',
                'OK'
            );
        }
    },

    storeInv : function () {
        window.localStorage.setItem('GELOS', JSON.stringify(app.gelosinv));
    },

    updateTable : function() {
        var inventorytable = document.getElementById("inventorytable");
        var inventorytable2 = document.getElementById("inventoryALFtable");
        var i;

        // clear tables
        for (i = inventorytable.rows.length - 1; i >= 0; i--) {
            inventorytable.deleteRow(i);
        }

        for (i = inventorytable2.rows.length - 1; i >= 0; i--) {
            inventorytable2.deleteRow(i);
        }

        for (i = 0; i < app.gelosinv.inventory.length; i++){
            // Insert a row at the end of the table
            var newRow = inventorytable.insertRow(-1);

            // var numberCell = newRow.insertCell(0);
            // Insert a cell in the row at index 0
            var containerCell = newRow.insertCell(0);
            var nameCell = newRow.insertCell(1);
            var amountCell = newRow.insertCell(2);

            // Append a text node to the cell
            var nameText = document.createTextNode(app.gelosinv.inventory[i].name);
            nameCell.appendChild(nameText);

            // if(app.gelosinv.inventory[i].number){
            //     var numberText = document.createTextNode(app.gelosinv.inventory[i].number.toString());
            //     numberCell.appendChild(numberText);
            // }
            // else {
            //     numberCell.appendChild(document.createTextNode(""));
            // }

            if(app.gelosinv.inventory[i].container) {
                var containerText = document.createTextNode(app.gelosinv.inventory[i].container);
                containerCell.appendChild(containerText);
            } else {
                containerCell.appendChild(document.createTextNode(""));
            }

            var amountText = document.createTextNode(app.gelosinv.inventory[i].amount);
            amountCell.appendChild(amountText);

            newRow.onclick = function(){
                var invObjIndex = getObjectIndex(0, this.cells[1].innerText);

                document.getElementById('editItemName').innerText = this.cells[1].innerText;
                document.getElementById('frm2').elements[1].value = app.gelosinv.inventory[invObjIndex].name;
                document.getElementById('frm2').elements[2].value = app.gelosinv.inventory[invObjIndex].number;
                document.getElementById('frm2').elements[3].value = app.gelosinv.inventory[invObjIndex].container;
                document.getElementById('frm2').elements[4].value = app.gelosinv.inventory[invObjIndex].amount;
                document.getElementById('inventory_type').value = 'alcohol';
                document.getElementById('id02').style.display='block';
            };
        }

        for (i = 0; i < app.gelosinv.inventoryALF.length; i++){
            // Insert a row at the end of the table
            var newRow2 = inventorytable2.insertRow(-1);

            // Insert a cell in the row at index 0
            // var numberCell2 = newRow2.insertCell(0);
            var containerCell2 = newRow2.insertCell(0);
            var nameCell2 = newRow2.insertCell(1);
            var amountCell2 = newRow2.insertCell(2);

            // Append a text node to the cell
            var nameText2 = document.createTextNode(app.gelosinv.inventoryALF[i].name);
            nameCell2.appendChild(nameText2);

            // if(app.gelosinv.inventoryALF[i].number){
            //     var numberText2 = document.createTextNode(app.gelosinv.inventoryALF[i].number.toString());
            //     numberCell2.appendChild(numberText2);
            // }
            // else {
            //     numberCell2.appendChild(document.createTextNode(""));
            // }

            if(app.gelosinv.inventoryALF[i].container) {
                var containerText2 = document.createTextNode(app.gelosinv.inventoryALF[i].container);
                containerCell2.appendChild(containerText2);
            } else {
                containerCell2.appendChild(document.createTextNode(""));
            }

            var amountText2 = document.createTextNode(app.gelosinv.inventoryALF[i].amount);
            amountCell2.appendChild(amountText2);

            // newRow2.onclick = function(){
            //     navigator.notification.alert(
            //         this.cells[1].innerText,
            //         function(){},
            //         "Table Row Clicked!",
            //         "OK"
            //     );
            // };

            newRow2.onclick = function(){
                var invObjIndex = getObjectIndex(1, this.cells[1].innerText);

                document.getElementById('editItemName').innerText = this.cells[1].innerText;
                document.getElementById('frm2').elements[1].value = app.gelosinv.inventoryALF[invObjIndex].name;
                document.getElementById('frm2').elements[2].value = app.gelosinv.inventoryALF[invObjIndex].number;
                document.getElementById('frm2').elements[3].value = app.gelosinv.inventoryALF[invObjIndex].container;
                document.getElementById('frm2').elements[4].value = app.gelosinv.inventoryALF[invObjIndex].amount;
                document.getElementById('inventory_type').value = 'nonalcohol';
                document.getElementById('id02').style.display='block';
            };
        }
    },

    inventoryToHTML : function () {
        var i = 0;
        var invLen = app.gelosinv.inventory.length;
        var invALFLen = app.gelosinv.inventoryALF.length;
        var inventoryHTML =
            '<html>' +
            '<head>' +
                '<meta charset="UTF-8">' +
                '<title>Title</title>' +
                '<style>' +
                    'table {font-family: arial, sans-serif;border-collapse: collapse;}' +
                    'td {font-size: 12px;border: 1px solid #000000;text-align: left;padding: 5px;}' +
                    'th {font-size: 13px;border: 2px solid #000000;text-align: left;padding: 5px;}' +
                    'tr:nth-child(even){background: #dddddd;}' +
                    '#contact {font-weight: bold;}' +
                    '#table1 {display: inline-block;}' +
                    '#table2 {display: inline-block;}' +
                    '#table3 {display: inline-block;}' +
                    '#table4 {display: inline-block;}' +
                    '#group {border-width: 1px 1px 2px 1px;}' +
                '</style>' +
            '</head>' +
                '<body>' +
                    '<div id="contact">' +
                    'Telefax GELOS: 03520542444 // Gelos-Annahme' +
                    'Tel.: 0352054266 // Zettel 1.// Kd.-Nr.:180233 <br>' +
                    'Liefertermin: Mittwoch // Spätshop bei fragen' +
                    'bitte an ……………………………………wenden.' +
                    '</div>' +
                    '<div id="table1">' +
                        '<table>' +
                            '<tr>' +
                                '<th>Art. Nr.</th>' +
                                '<th>Artikelbezeichnung</th>' +
                                '<th>Gebinde</th>' +
                                '<th>Menge</th>' +
                            '</tr>';

        for (; i < 38 && i < invLen + invALFLen; i++){
            if(i < app.gelosinv.inventory.length){
                inventoryHTML += createRow(app.gelosinv.inventory[i].number,
                                           app.gelosinv.inventory[i].name,
                                           app.gelosinv.inventory[i].container,
                                           app.gelosinv.inventory[i].amount);
            } else {
                inventoryHTML += createRow(app.gelosinv.inventoryALF[i - invLen].number,
                                           app.gelosinv.inventoryALF[i - invLen].name,
                                           app.gelosinv.inventoryALF[i - invLen].container,
                                           app.gelosinv.inventoryALF[i - invLen].amount);
            }
        }

        inventoryHTML +=
                        '</table>' +
                    '</div>'+
                    '<div id="table2">' +
                        '<table>' +
                            '<tr>' +
                                '<th>Art. Nr.</th>' +
                                '<th>Artikelbezeichnung</th>' +
                                '<th>Gebinde</th>' +
                                '<th>Menge</th>' +
                            '</tr>';

        for (; i < 76 && i < invLen + invALFLen; i++){
            if(i < app.gelosinv.inventory.length){
                inventoryHTML += createRow(app.gelosinv.inventory[i].number,
                    app.gelosinv.inventory[i].name,
                    app.gelosinv.inventory[i].container,
                    app.gelosinv.inventory[i].amount);
            } else {
                inventoryHTML += createRow(app.gelosinv.inventoryALF[i - invLen].number,
                    app.gelosinv.inventoryALF[i - invLen].name,
                    app.gelosinv.inventoryALF[i - invLen].container,
                    app.gelosinv.inventoryALF[i - invLen].amount);
            }
        }

        inventoryHTML +=
                        '</table>' +
                    '</div>' +
                    '<div id="contact">' +
                    'Telefax GELOS: 03520542444 // Kevin Ulma Tel.: 015207947767 // Zettel 2. // Kd.-Nr.:180233 ' +
                    'Liefertermin: Mittwoch // Spätshop bei fragen bitte an ………………………………… wenden.' +
                    '</div>' +
                    '<div id="table3">' +
                        '<table>' +
                            '<tr>' +
                                '<th>Art. Nr.</th>' +
                                '<th>Artikelbezeichnung</th>' +
                                '<th>Gebinde</th>' +
                                '<th>Menge</th>' +
                            '</tr>';

        for(; i < 106 && i < invLen + invALFLen; i++) {
            if(i < app.gelosinv.inventory.length){
                inventoryHTML += createRow(app.gelosinv.inventory[i].number,
                    app.gelosinv.inventory[i].name,
                    app.gelosinv.inventory[i].container,
                    app.gelosinv.inventory[i].amount);
            } else {
                inventoryHTML += createRow(app.gelosinv.inventoryALF[i - invLen].number,
                    app.gelosinv.inventoryALF[i - invLen].name,
                    app.gelosinv.inventoryALF[i - invLen].container,
                    app.gelosinv.inventoryALF[i - invLen].amount);
            }
        }

        inventoryHTML +=
                        '</table>' +
                    '</div>' +
                    '<div id="table4">' +
                        '<table>' +
                            '<tr>' +
                                '<th>Art. Nr.</th>' +
                                '<th>Artikelbezeichnung</th>' +
                                '<th>Gebinde</th>' +
                                '<th>Menge</th>' +
                            '</tr>';

        for(; i < 136 && i < invLen + invALFLen; i++) {
            if(i < app.gelosinv.inventory.length){
                inventoryHTML += createRow(app.gelosinv.inventory[i].number,
                    app.gelosinv.inventory[i].name,
                    app.gelosinv.inventory[i].container,
                    app.gelosinv.inventory[i].amount);
            } else {
                inventoryHTML += createRow(app.gelosinv.inventoryALF[i - invLen].number,
                    app.gelosinv.inventoryALF[i - invLen].name,
                    app.gelosinv.inventoryALF[i - invLen].container,
                    app.gelosinv.inventoryALF[i - invLen].amount);
            }
        }

        for (; i < 136; i++) {
            inventoryHTML += createEmptyRow();
        }

        inventoryHTML +=
                        '</table>' +
                    '</div>' +
                '</body>' +
            '</html>';

        return inventoryHTML;
    }
};
