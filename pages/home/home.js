const fs = require("fs");
module.exports = function (query) {
    let htmlString = fs.readFileSync((__dirname + "/home.html"), "utf-8");

    return(htmlString);
}