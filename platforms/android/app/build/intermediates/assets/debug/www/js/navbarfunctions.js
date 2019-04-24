
// Wait for the page to load first
window.onload = function() {

    var homeLink = document.getElementById("update");
    homeLink.onclick = function () {
        app.validateInv();
        app.initiateTable();
        return false;
    };

    var newsLink = document.getElementById("add");
    newsLink.onclick = function () {
        navigator.notification.alert(
            'Add Option was clicked',
            function () {},
            'Something happened!',
            'OK'
        );
        return false;
    };

    var contactLink = document.getElementById("contact");
    contactLink.onclick = function () {
        navigator.notification.alert(
            'Contact Option was clicked',
            function () {},
            'Something happened!',
            'OK'
        );
        return false;
    };
};