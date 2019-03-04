const url = require('url');
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

// get selected recipe
const getRecipe = (request, response) => {
	const parsedUrl = url.parse(request.url);
	const queryString = parsedUrl.query;

	const recipeName = query.parse(queryString).name;
	respondJSON(request, response, 200, recipes[recipeName]);
};

// return a 200 status code
const getRecipeMeta = (request, response) => {
	respondJSONMeta(request, response, 200);
};

const getAllRecipes = (request, response) => {
	const responseJSON = {
		recipes,
	};
	respondJSON(request, response, 200, responseJSON);
};

// return a 200 status code
const getAllRecipesMeta = (request, response) => {
	respondJSONMeta(request, response, 200);
};

const addRecipe = (request, response) => {
	const body = [];

	request.on('error', () => {
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

		if (!bodyParams.name || !bodyParams.image ||
!bodyParams.ingredients || !bodyParams.instructions) {
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

		recipes[bodyParams.name].image = bodyParams.image;

		recipes[bodyParams.name].ingredients = bodyParams.ingredients;

		recipes[bodyParams.name].instructions = bodyParams.instructions;

		if (responseCode === 201) {
			//responseJSON.message = 'Created Successfully';
			//responseJSON.message = recipes[bodyParams.name].name;
			//console.log("hello");
			//console.log(JSON.stringify(recipes));
			return respondJSON(request, response, responseCode, recipes);
		}
		return respondJSONMeta(request, response, responseCode);
	});
};

module.exports = {
	getRecipe,
	getRecipeMeta,
	getAllRecipes,
	getAllRecipesMeta,
	addRecipe
};
