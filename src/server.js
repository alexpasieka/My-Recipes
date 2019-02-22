const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlHandler.js');
const methodHandler = require('./methodHandler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const getStruct = {
	'/': htmlHandler.getIndex,
	'/style.css': htmlHandler.getStyle,
	default: htmlHandler.getIndex,

	'/getRecipes': methodHandler.getRecipes,
	'/notFound': methodHandler.notFound
};

const headStruct = {
	'/getRecipes': methodHandler.getRecipesMeta,
	'/notFound': methodHandler.notFoundMeta
};

const postStruct = {
	'/addRecipe': methodHandler.addRecipe
};

const onRequest = (request, response) => {
	const parsedUrl = url.parse(request.url);

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

http.createServer(onRequest).listen(port);
