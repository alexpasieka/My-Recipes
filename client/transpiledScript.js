'use strict';

// add a new recipe
var addRecipe = function addRecipe(e, form) {
	// get recipe information from sent form
	var name = form.querySelector('#name-field');
	var image = form.querySelector('#image-field');
	var ingredients = form.querySelector('#ingredients-field');
	var instructions = form.querySelector('#instructions-field');

	// send a new XHR
	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/addRecipe');

	// when the new recipe gets added, update the recipes page
	xhr.onload = function () {
		return getAllRecipes();
	};

	// data to send with XHR
	var formData = 'name=' + name.value + '&image=' + image.value + '&instructions=' + instructions.value + '\n\t\t\t\t\t&ingredients=' + ingredients.value.replace('\n', ',');

	// send XHR with form data
	xhr.send(formData);

	// close the modal
	var newRecipeModal = document.querySelector('#new-recipe-modal');
	newRecipeModal.style.display = "none";

	form.reset();

	// prevent the browser from sending the form on its own
	e.preventDefault();
	// prevent the browser from refreshing or changing the page
	return false;
};

// get specified recipe
var getRecipe = function getRecipe(recipeName) {
	// send a new XHR
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/getRecipe?name=' + recipeName);

	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Accept', 'application/json');

	// when all the recipes load, add each to the recipes page
	xhr.onload = function () {
		var recipeModal = document.querySelector('#selected-recipe-modal');
		recipeModal.style.display = "flex";

		document.querySelector('#selected-recipe-name').innerHTML = JSON.parse(xhr.response).name;
		document.querySelector('#selected-recipe-image').src = JSON.parse(xhr.response).image;
		document.querySelector('#instructions').innerHTML = JSON.parse(xhr.response).instructions;

		var ingredientsArray = JSON.parse(xhr.response).ingredients.split(',');
		document.querySelector('#ingredients').innerHTML = '';
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = ingredientsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var ingredient = _step.value;

				document.querySelector('#ingredients').innerHTML += '<li>' + ingredient + '</li>';
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	};

	// send XHR
	xhr.send();
};

// get all saved recipes
var getAllRecipes = function getAllRecipes() {
	// send a new XHR
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/getAllRecipes');

	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Accept', 'application/json');

	// when all the recipes load, add each to the recipes page
	xhr.onload = function () {
		var recipesView = document.querySelector('#recipes');
		// parse received JSON object
		var allRecipes = JSON.parse(xhr.response).recipes;
		// resetting the recipes view
		recipesView.innerHTML = '';

		// creating recipe modules
		for (var recipe in allRecipes) {
			// creating container
			var container = document.createElement('button');
			container.className = 'recipe';
			container.id = allRecipes[recipe].name;

			// creating module header
			var header = document.createElement('h2');
			header.className = 'recipe-header';
			header.innerHTML = allRecipes[recipe].name;
			container.appendChild(header);

			// creating module image
			var image = document.createElement('img');
			image.src = allRecipes[recipe].image;
			image.id = 'thumbnail';
			container.appendChild(image);

			// adding it to the recipe view
			recipesView.appendChild(container);
		}

		// open recipe modal based on recipe id
		var allRecipeModules = document.querySelectorAll('.recipe');

		var _loop = function _loop(_recipe) {
			var getSavedRecipe = function getSavedRecipe() {
				return getRecipe(_recipe.id);
			};
			_recipe.addEventListener('click', getSavedRecipe);
		};

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = allRecipeModules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var _recipe = _step2.value;

				_loop(_recipe);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	};

	// send XHR
	xhr.send();
};

// app initialization
var init = function init() {
	// get all saved recipes
	getAllRecipes();

	// new recipe elements
	var newRecipeButton = document.querySelector('#new-recipe-button');
	var newRecipeModal = document.querySelector('#new-recipe-modal');

	var selectedRecipeModal = document.querySelector('#selected-recipe-modal');

	// show new recipe modal on click
	newRecipeButton.onclick = function () {
		newRecipeModal.style.display = "flex";
	};

	// form for adding new recipe
	var newRecipeForm = document.querySelector('#new-recipe-form');
	var newRecipe = function newRecipe(e) {
		return addRecipe(e, newRecipeForm);
	};
	newRecipeForm.addEventListener('submit', newRecipe);

	// if the user clicks the cancel button in the modal, close it
	var cancelButton = document.querySelector('#cancel-button');
	cancelButton.onclick = function () {
		newRecipeModal.style.display = "none";
	};

	// if the user clicks the close button in the modal, close it
	var closeButton = document.querySelector('#close-button');
	closeButton.onclick = function () {
		selectedRecipeModal.style.display = "none";
	};

	// if the user clicks outside the modal, close it
	window.onclick = function (e) {
		if (e.target.className === 'modal') {
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = document.querySelectorAll('.modal')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var modal = _step3.value;

					modal.style.display = "none";
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}
	};
};

window.onload = init;
