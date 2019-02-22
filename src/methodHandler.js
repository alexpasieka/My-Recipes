const query = require('querystring');

const recipes = {};

const respondJSON = (request, response, status, object) => {
	response.writeHead(status, { 'Content-Type': 'application/json' });
	response.write(JSON.stringify(object));
	response.end();
};

const respondJSONMeta = (request, response, status) => {
	response.writeHead(status, { 'Content-Type': 'application/json' });
	response.end();
};

const getRecipes = (request, response) => {
	const responseJSON = {
		recipes,
	};
	respondJSON(request, response, 200, responseJSON);
};

const getRecipesMeta = (request, response) => {
	respondJSONMeta(request, response, 200);
};

const addRecipe = (request, response) => {
	const body = [];

	request.on('error', (err) => {
		console.dir(err);
		response.statusCode = 400;
		response.end();
	});

	request.on('data', (chunk) => {
		body.push(chunk);
	});

	request.on('end', () => {
		const bodyString = Buffer.concat(body).toString();
		const bodyParams = query.parse(bodyString);

		const responseJSON = {
			message: 'Name and age are both required.',
		};

		if (!bodyParams.name || !bodyParams.ingredients || !bodyParams.instructions) {
			responseJSON.id = 'missingParams';
			return respondJSON(request, response, 400, responseJSON);
		}

		let responseCode = 201;

		if (recipes[bodyParams.name]) {
			responseCode = 204;
		}
		else {
			recipes[bodyParams.name] = {};
		}

		recipes[bodyParams.name].name = bodyParams.name;
		recipes[bodyParams.name].ingredients = bodyParams.ingredients;
		recipes[bodyParams.name].instructions = bodyParams.instructions;

		if (responseCode === 201) {
			responseJSON.message = 'Created Successfully';
			return respondJSON(request, response, responseCode, responseJSON);
		}
		return respondJSONMeta(request, response, responseCode);
	});
};

const notFound = (request, response) => {

};

const notFoundMeta = (request, response) => {

};

module.exports = {
	getRecipes,
	notFound,
	getRecipesMeta,
	notFoundMeta,
	addRecipe
};
