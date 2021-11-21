const fs = require("fs");
module.exports = function (query) {
    json = JSON.parse(fs.readFileSync("./data/logins.json", 'utf-8'));
    let string = fs.readFileSync(__dirname + "/admin_portal.html", 'utf-8');
    return (string);
};