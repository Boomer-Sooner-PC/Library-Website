const fs = require('fs');
function parseCSV(path) {
    let txt = fs.readFileSync(path, 'utf-8');
    let lst = txt.split("\n");
    let parsed = [];

    index = lst.indexOf("");
    if (index > -1) {
        lst.splice(index, 1);
    }
    index = lst.indexOf("ID,Name,Category,Author,Description,Age,Image URL,checkedOut,due\n");
    if (index > -1) {
        lst.splice(index, 1);
    }

    for (book of lst) {
        book = book.split(",");
        data = {
            id: book[0],
            name: book[1],
            category: book[2],
            author: book[3],
            description: book[4],
            age: book[5],
            imageURL: book[6],
            checkedOut: book[7],
            due: book[8]
        };
        parsed.push(data);
    };
    return parsed;
}
function stringify(parsed) {
    let csv = 'ID,Name,Category,Author,Description,Age,Image URL,checkedOut,due\n';
    for (data of parsed) {
        if (data['id'] === 'ID') continue;
        csv = `${csv}${data['id']},${data['name']},${data['category']},${data['author']},${data['description']},${data['age']},${data['imageURL']},${data['checkedOut']},${data['due']}\n`;
    };
    return csv;
}
module.exports = { parseCSV, stringify };