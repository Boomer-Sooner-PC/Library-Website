const fs = require("fs");
const path = require("path");
const e = require("../../operations/accountParsing");
module.exports = function (query, res) {
    console.log("here")
    config = JSON.parse(fs.readFileSync("./config.json"));
    json = JSON.parse(fs.readFileSync("./data/logins.json", 'utf-8'));
    if (query) {
        query = JSON.parse(query.replace(/%3A/g, ":").replace(/%2F/g, "/").replace(/%2B/g, "+").replace(/%22/g, '"'));
        //checks if the password is correct
        if (query["password"] === config["password"]) {

            res.writeHead(200, {
                'Set-Cookie': 'admin=12345678',
                'Content-Type': 'text/html'
            })

            json.push(query["visitorId"]);
            fs.writeFileSync("./data/logins.json", JSON.stringify(json));
            let string = fs.readFileSync("./pages/admin_portal/admin_portal.html", 'utf-8');
            //if yes show admin portal

            res.end(string);
        }
        else {
            //else show login again
            let string = fs.readFileSync(__dirname + "/login.html", 'utf-8');
            res.end(string);
        }
    }
    else {
        let string = fs.readFileSync(__dirname + "/login.html", 'utf-8');
        res.end(string);
    }
};