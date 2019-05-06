function createRow (number, name, container, amount) {
    return  '<tr>' +
                '<td>' + number + '</td>' +
                '<td>' + name + '</td>' +
                '<td>' + container + '</td>' +
                '<td>' + amount + '</td>' +
            '</tr>';
}

function createEmptyRow () {
    return  '<tr>' +
                '<td>' + '0' +  '</td>' +
                '<td>' + '</td>' +
                '<td>' + '</td>' +
                '<td>' + '</td>' +
            '</tr>';
}