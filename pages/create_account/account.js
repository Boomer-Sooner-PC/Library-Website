const fs = require("fs");
const JsBarcode = require('jsbarcode');
const Canvas = require("canvas");
const { addAccount, parse } = require("../../operations/accountParsing");

module.exports = function (query) {
    string = fs.readFileSync(__dirname + "/account.html", 'utf-8');
    if (query) {
		//parse query
		query = query.replace(/%3A/g, ":").replace(/%2F/g, "/").replace(/%2B/g, "+").replace(/%22/g, '"');
		query = JSON.parse(query);
		json = JSON.parse(fs.readFileSync("./data/usedNumbers.json", "utf-8"));

		//make library number and pin
		let libNumber = genLibNumber(json);
		let pin = genPin(json);
		json["libNumbers"].push(libNumber);
		json["pins"].push(pin);
		fs.writeFileSync("./data/usedNumbers.json", JSON.stringify(json, null, 4));

		//make barcode image
		let canvas = Canvas.createCanvas();
		JsBarcode(canvas, libNumber.toString());
		let b64image = canvas.toDataURL();
		let data = b64image.replace(/^data:image\/\w+;base64,/, "");
		let buf = new Buffer.from(data, 'base64');
		fs.writeFileSync(`./css/images/barcode_images/${libNumber}.png`, buf);

		//create canvas
		const width = 1586
		const hight = 1000
		canvas = Canvas.createCanvas(width, hight);
		const context = canvas.getContext('2d')

		//makes the background black, draws a rounded rectangle using roundRect(), then puts a grey box on the canvas
		context.fillStyle = "#000000";
		context.fillRect(0, 0, width, hight);
		context.fillStyle = "#ffffff";
		roundRect(context, 0, 0, width, hight, 60, true);
		context.fillStyle = "#D8D8D8";
		context.fillRect(850, 200, 627, 415);

		//write out name
		context.font = 'bold 60pt Menlo';
		context.textAlign = 'left';
		context.textBaseline = 'top';
		context.fillStyle = "#000000";
		context.fillText(query["name"].replace(/%20/g, " "), 50, 50);

		//write out information
		context.font = 'bold 40pt Menlo';
		context.fillText(`Library Number`, 880, 225);
		context.fillText(`Pin`, 880, 350);
		context.fillText(`Contact`, 880, 465);
		context.font = 'bold 36pt Menlo'
		context.fillStyle = "#2D2D2D";
		context.fillText(libNumber, 880, 290);
		context.fillText(pin, 880, 405);
		context.fillText(query["contact"], 880, 520);

		//draw the barcode image and white out the numbers under it
		Canvas.loadImage(`./css/images/barcode_images/${libNumber}.png`).then(image => {
		context.drawImage(image, 50, 350, 800, 550);
		context.fillStyle = "#ffffff";
		context.fillRect(160, 800, 500, 150)

		//write image to file
		b64image = canvas.toDataURL();
		data = b64image.replace(/^data:image\/\w+;base64,/, "");
		buf = new Buffer.from(data, 'base64');
		fs.writeFileSync(`./css/images/card_images/${libNumber}.png`, buf);

		})
		string = fs.readFileSync(__dirname + "/image.html", 'utf-8');
		string = string.replace("{card number}", libNumber);

		addAccount(parse(), libNumber, pin, query["name"].replace(/%20/g, " "), query["contact"], false, 0);
    };
  	return (string);

};

function genLibNumber(json) {
  libNumb = Math.floor(Math.random() * 99999999) + 1;
  if (json["libNumbers"].includes(libNumb) || libNumb < 10000000) libNumb = genLibNumber(json);
  return libNumb;
}
function genPin(json) {
  pin = Math.floor(Math.random() * 9999) + 1;
  if (json["pins"].includes(pin) || pin < 1000) pin = genPin(json);
  return pin;
}
//code taken from stackoverflow: https://stackoverflow.com/a/3368118/15033012
function roundRect(context, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  context.beginPath();
  context.moveTo(x + radius.tl, y);
  context.lineTo(x + width - radius.tr, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  context.lineTo(x + width, y + height - radius.br);
  context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  context.lineTo(x + radius.bl, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  context.lineTo(x, y + radius.tl);
  context.quadraticCurveTo(x, y, x + radius.tl, y);
  context.closePath();
  if (fill) {
    context.fill();
  }
  if (stroke) {
    context.stroke();
  }

}