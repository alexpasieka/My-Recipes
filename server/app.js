// imports
const http = require('http');
const url = require('url');
const clientHandler = require('./clientHandler.js');
const methodHandler = require('./methodHandler.js');

// port definition
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// struct for GET requests
const getStruct = {
	'/': clientHandler.getIndex,
	'/style.css': clientHandler.getStyle,
	'/transpiledScript.js': clientHandler.getScript,
	default: clientHandler.getIndex,

	'/getRecipe': methodHandler.getRecipe,
	'/getAllRecipes': methodHandler.getAllRecipes,
	notFound: methodHandler.notFound
};

// struct for HEAD requests
const headStruct = {
	'/getRecipe': methodHandler.getRecipeMeta,
	'/getAllRecipes': methodHandler.getAllRecipesMeta,
	notFound: methodHandler.notFoundMeta
};

// struct for POST requests
const postStruct = {
	'/addRecipe': methodHandler.addRecipe
};

// callback function for server requests
const onRequest = (request, response) => {
	// parsing url
	const parsedUrl = url.parse(request.url);

	// based on request method, run method according to respective struct
	switch (request.method) {
		case 'GET':
			if (getStruct[parsedUrl.pathname]) {
				getStruct[parsedUrl.pathname](request, response);
			}
			else {
				getStruct.default(request, response);
			}
			break;
		case 'HEAD':
			headStruct[parsedUrl.pathname](request, response);
			break;
		case 'POST':
			postStruct[parsedUrl.pathname](request, response);
			break;
	}
};

// creating server instance
http.createServer(onRequest).listen(port);
