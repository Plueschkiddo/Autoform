function addDialogueConfirm () {
    var form = document.getElementById("frm1");

    var itemName = form.elements[0].value;
    var itemNumber = form.elements[1].value;
    var itemContainer = form.elements[2].value;
    var itemCategory = form.elements[3].value;

    if(itemCategory === 'alcohol'){
        addObject(0, itemName, itemNumber, itemContainer);
    } else if (itemCategory === 'nonalcohol') {
        addObject(1, itemName, itemNumber, itemContainer);
    } else {
        console.log("Reached impossible destination at addDialogueConfirm");
    }
    document.getElementById('id01').style.display='none';
}

function editDialoqueConfirm () {
    var form = document.getElementById("frm2");

    var itemName = form.elements[1].value;
    var itemNumber = form.elements[2].value;
    var itemContainer = form.elements[3].value;
    var itemAmount = form.elements[4].value;
    var itemCategory = form.elements[5].value;

    if(itemCategory === 'alcohol'){
        editObject(0, document.getElementById('editItemName').innerText,  itemName, itemNumber, itemContainer, itemAmount);
    } else if (itemCategory === 'nonalcohol') {
        editObject(1, document.getElementById('editItemName').innerText, itemName, itemNumber, itemContainer, itemAmount);
    } else {
        console.log(itemCategory);
        console.log("Reached impossible destination at editDialogueConfirm");
    }
    document.getElementById('id02').style.display='none';
}

function queryDialogueConfirm () {

}

function openDeleteDialogue () {
    var itemName = document.getElementById("editItemName").innerText;
    document.getElementById('id02').style.display='none';

    navigator.notification.confirm("Möchtest du " + itemName + " wirklich löschen?",
                                   deleteItemConfirm,
                                   "Achtung!",
                                   ["OK", "Zurück"]);
}

function deleteItemConfirm(choice) {
    if(choice === 1){
        var itemName = document.getElementById("editItemName").innerText;
        deleteObject(itemName);
    } else {
        console.log("Der Dialog wurde weggedrückt");
    }
}

function valueChanged(){
    var lastInputName = document.getElementById('queryItemName').innerText;
    var lastInputAmount = document.getElementById('queryItemCount').value;
    var newName = getNextItem();
    var newNameInvIndex = getObjectInventoryIndex(newName);

    editItemAmount(lastInputName, lastInputAmount);

    document.getElementById('lastinput').innerText =
        lastInputName + " x " + lastInputAmount;
    document.getElementById('queryItemName').innerText = newName;
    document.getElementById('queryItemCount').value = '';
}