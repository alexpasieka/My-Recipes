// import file system module
const fs = require('fs');

// load static files synchronously
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);
const script = fs.readFileSync(`${__dirname}/../client/script.js`);

// get index HTML
const getIndex = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'text/html' });
	response.write(index);
	response.end();
};

// get index CSS
const getStyle = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'text/css' });
	response.write(style);
	response.end();
};

// get index JS
const getScript = (request, response) => {
	response.writeHead(200, { 'Content-Type': 'application/javascript' });
	response.write(script);
	response.end();
};

module.exports = {
	getIndex,
	getStyle,
	getScript
};
