const http = require('http');
const fs = require("fs");

const server = http.createServer(function (req, res) { // creates the server
    console.log("request was made: " + req.url);
    
    //separates the query and request URL
    let reqUrl = (req.url.split("?")[0]);
    if (reqUrl.length > 2) reqUrl = reqUrl.replace("/admin/admin/", "/admin/");
    let query = req.url.split("?")[1];

    //if its a css request then follow the path to the css file
    if (reqUrl.includes("/css")) {
        res.writeHead(200, { "Content-type": 'text/css' });
        if (reqUrl.includes("/images/")) res.writeHead(200, { "Content-type": 'image/png' });
        fs.createReadStream(__dirname + reqUrl).pipe(res); // return the data
    }

    else {
        //if its an admin request, then check the cookies. If it does not have the password, then send them to the login page
        if (reqUrl.includes("/admin/")) {
            cookies = parseCookies(req);
            if (cookies["admin"] !== "12345678") {
                const fn = require("./pages/login/login");
                fn(query, res);
                return;
            }
        }

        res.writeHead(200, { "Content-type": 'text/html' });

        //gets a function from a file based on url request. using the function it reads an html file, sometimes does other stuff, then returns the html as a string
        if (reqUrl === "/home" || reqUrl === "/") {
            const fn = require("./pages/home/home");
            str = fn(query);
            res.end(str)
        }
        else if (reqUrl === "/admin/addbook") {
            const fn = require("./pages/addbook/addbook");
            str = fn(query);
            res.end(str);
        }
        else if (reqUrl === "/admin/admin_portal") {
            const fn = require("./pages/admin_portal/portal");
            str = fn(query);
            res.end(str);
        }
        else if (reqUrl === "/admin/create_account") {
            const fn = require("./pages/create_account/account");
            str = fn(query);
            res.end(str);
        }
        else if (reqUrl === "/login") {
            const fn = require("./pages/login/login");
            fn(query, res);
        }
    }

});


function parseCookies(request) { // idk I got the code from stackoverflow
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

server.listen(1234, "192.168.86.28");
console.log("online")