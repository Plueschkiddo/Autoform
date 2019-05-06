
// Wait for the page to load first
window.onload = function() {

    var resetLink = document.getElementById("reset");
    resetLink.onclick = function () {
        initializeIndex();
    };

    var addLink = document.getElementById("add");
    addLink.onclick = function () {
        document.getElementById('id01').style.display = 'block';
    };

    var askallLink = document.getElementById("askall");
    askallLink.onclick = function () {
        document.getElementById('queryItemName').innerText = getNextItem();
        document.getElementById('id03').style.display = 'block';
    };

    var printlink = document.getElementById("print");
    printlink.onclick = function () {
        app.doMagicPlease();
        navigator.notification.alert(
            'Was geschehen ist, ist geschehen...',
            function () {},
            'PDF Dokument erstellt!',
            'OK'
        );
    };
};