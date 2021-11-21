const { parseCSV, stringify } = require('./csvParsing')
const fs = require('fs');
function addBook(id, name, category, author, description, age, imageURL) {
    let csv = parseCSV('./data/books.csv');
    data = {
        id, name, category, author, description, age, imageURL,
        checkedOut: false,
        due: false
    };
    csv.push(data);
    string = stringify(csv);
    const pieces = string.split("+");
    string = pieces.join(" ");
    fs.writeFileSync("./data/books.csv", string);
}

module.exports = { addBook }