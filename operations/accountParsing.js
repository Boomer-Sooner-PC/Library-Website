const fs = require("fs");
function parse() {
    //gets csv data and turns it into list
    const path = "./data/accounts.csv";
    let str = fs.readFileSync(path, "utf-8");
    let array = str.split(/\n/);
    array.shift();

    // makes a list of objects containing csv information
    let obj = [];
    for (row of array) {
        row = row.split(",");
        i = {
            number: row[0],
            pin: row[1],
            name: row[2],
            contact: row[3],
            books: row[4],
            numberOut: row[5]

        };
        obj.push(i);
    }
    return obj
}

function stringify(obj) {
    //adds csv header
    str = 'number,pin,name,contact,books,numberOut\n';

    for (row of obj) {
        values = Object.values(row); // gets the values from the row object
        values = values.join(','); //joins them together with a comma
        str += values + "\n"; //then adds that to a string with a line break at the end/
    }
    str = str.slice(0, -1); // remove the unnecessary line break at the end
    return str;

}

function addAccount (obj, number, pin, name, contact, books, numberOut) {
    let i = {number, pin, name, contact, books, numberOut};
    obj.push(i);
    let string = stringify(obj);
    fs.writeFileSync("./data/accounts.csv", string);
}

module.exports = {
    parse, stringify, addAccount
}