const fs = require("fs");
const Canvas = require("canvas");
const JsBarcode = require("jsbarcode");
const { addBook } = require("../../operations/addBook");
module.exports = function (query) {
    if (!query) query = " ";
    if (query.length > 5) {
        //parses query
        query = query.replace(/%3A/g, ":").replace(/%2F/g, "/").replace(/%2B/g, "+").replace(/\+/g, " ").replace(/%20/g, " ").replace(/%22/g, '"');
        obj = JSON.parse(query)
        
        // make the book number
        json = JSON.parse(fs.readFileSync("./data/usedNumbers.json", "utf-8"));
        id = json["bookNumber"] + 1;
        json["bookNumber"] = id;
        fs.writeFileSync("./data/usedNumbers.json", JSON.stringify(json));

        // make barcode image
        let canvas = Canvas.createCanvas();
		JsBarcode(canvas, id);
		let b64image = canvas.toDataURL();
		let data = b64image.replace(/^data:image\/\w+;base64,/, "");
		let buf = new Buffer.from(data, 'base64');
		fs.writeFileSync(`./css/images/book_barcodes/${id}.png`, buf);
        
        //make the output canvas
        const width = 425;
        const hight = 200;
        canvas = Canvas.createCanvas(width, hight);
        const context = canvas.getContext('2d');
        
        // draw background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, hight);
        
        // write out text
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = '#000000'
        context.font = 'bold 26pt Menlo'
        context.fillText(obj["Name"].replace(/\+/g, " "), 212.5, 0);
        context.font = 'bold 20pt Menlo'
        context.fillText(obj["Category"].replace(/\+/g, " "), 212.5, 33)
        
        Canvas.loadImage(`./css/images/book_barcodes/${id}.png`).then(image => { // draw the barcode image
            x = canvas.width / 2 - image.width / 2
            y = 60
            context.drawImage(image, x, y);
            
            //write image to file
            b64image = canvas.toDataURL();
            data = b64image.replace(/^data:image\/\w+;base64,/, "");
            buf = new Buffer.from(data, 'base64');
            fs.writeFileSync(`./css/images/book_barcodes/${id}.png`, buf);
        })

        //adds the book to a csv file
        addBook(id, obj["Name"], obj["Category"], obj["Author"], obj["Description"], obj["Age"], obj["ImageURL"]);

        //write the html
        let str = fs.readFileSync("./pages/addbook/image.html", "utf-8");
        str = str.replace("{barcode number}", id);
        return(str);
    }
    else {
        let str = fs.readFileSync(__dirname + "/addbook.html");
        return(str);
    }
}
