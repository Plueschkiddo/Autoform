function addObject (inventoryIndex, nameString, numberInt, containerString) {
    if (inventoryIndex === 0) {
        app.gelosinv.inventory.push({name: nameString, number: numberInt, container: containerString, amount: 0});
    } else if (inventoryIndex === 1) {
        app.gelosinv.inventoryALF.push({name: nameString, number: numberInt, container: containerString, amount: 0});
    } else {
        console.log("Invalid inventory index for addObject");
    }
    sortInventory();
    app.updateTable();
    app.storeInv();
}

function deleteObject (nameString) {
    var inventoryIndex = getObjectInventoryIndex(nameString);
    var objectIndex = getObjectIndex(inventoryIndex, nameString);

    if (inventoryIndex === 0) {
        app.gelosinv.inventory.splice(objectIndex, 1);
    } else if (inventoryIndex === 1) {
        app.gelosinv.inventoryALF.splice(objectIndex, 1);
    } else {
        console.log("Invalid inventory index for deleteObject");
    }
    app.updateTable();
    app.storeInv();
}

function editObject (inventoryIndex, oldNameString, newNameString, numberInt, containerString, amountString) {
    var articleIndex = getObjectIndex(inventoryIndex, oldNameString);

    if (inventoryIndex === 0) {
        app.gelosinv.inventory[articleIndex].name = newNameString;
        app.gelosinv.inventory[articleIndex].number = numberInt;
        app.gelosinv.inventory[articleIndex].container = containerString;
        app.gelosinv.inventory[articleIndex].amount = amountString;
    } else if (inventoryIndex === 1) {
        app.gelosinv.inventoryALF[articleIndex].name = newNameString;
        app.gelosinv.inventoryALF[articleIndex].number = numberInt;
        app.gelosinv.inventoryALF[articleIndex].container = containerString;
        app.gelosinv.inventoryALF[articleIndex].amount = amountString;
    } else {
        console.log("Invalid Inventory index for editObject");
    }
    sortInventory();
    app.updateTable();
    app.storeInv();
}

function getObjectIndex (inventoryIndex, nameString) {
    var counter = 0;
    if (inventoryIndex === 0) {
        for (;counter < app.gelosinv.inventory.length; counter++) {
            if (app.gelosinv.inventory[counter].name === nameString) {
                return counter;
            }
        }
        console.log("Couldn't find object index of " + nameString + " in inventory");
    } else if (inventoryIndex === 1) {
        for (;counter < app.gelosinv.inventoryALF.length; counter++) {
            if (app.gelosinv.inventoryALF[counter].name === nameString) {
                return counter;
            }
        }
        console.log("Couldn't find object index of " + nameString + " in inventoryALF");
    } else {
        console.log("Invalid inventory index for getObjectIndex");
        return null;
    }
}

function getObjectInventoryIndex (nameString) {
    var counter = 0;

    for (; counter < app.gelosinv.inventory.length; counter++){
        if (app.gelosinv.inventory[counter].name === nameString) {
            return 0;
        }
    }

    counter = 0;

    for (; counter < app.gelosinv.inventoryALF.length; counter++){
        if (app.gelosinv.inventoryALF[counter].name === nameString) {
            return 1;
        }
    }

    return null;
}

function initializeIndex () {
    app.gelosinv.currentIndex = 0;
}

function getNextItem () {
    var arr;

    if (app.gelosinv.currentIndex < app.gelosinv.inventory.length){
        arr = app.gelosinv.inventory[app.gelosinv.currentIndex].name;
    } else if (app.gelosinv.currentIndex < app.gelosinv.inventory.length + app.gelosinv.inventoryALF.length) {
        arr = app.gelosinv.inventoryALF[app.gelosinv.currentIndex - app.gelosinv.inventory.length].name;
    } else {
        arr = 'Ende Gelände';
    }
    app.gelosinv.currentIndex = app.gelosinv.currentIndex + 1;
    return arr;
}

function editItemAmount (nameString, amount) {
    var inventoryIndex = getObjectInventoryIndex(nameString);
    var objectIndex = getObjectIndex(inventoryIndex, nameString);

    if (inventoryIndex === 0){
        app.gelosinv.inventory[objectIndex].amount = amount;
    } else if (inventoryIndex === 1){
        app.gelosinv.inventoryALF[objectIndex].amount = amount;
    } else {
        console.log("Reached impossible Index at editItemAmount");
    }
    app.updateTable();
    app.storeInv();
}

function sortInventory() {
    app.gelosinv.inventory.sort((a, b) => (a.name > b.name) ? 1 : -1);
    app.gelosinv.inventoryALF.sort((a, b) => (a.name > b.name) ? 1 : -1);
};