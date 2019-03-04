// add a new recipe
const addRecipe = (e, form) => {
	// get recipe information from sent form
	const name = form.querySelector('#name-field');
	const image = form.querySelector('#image-field');
	const ingredients = form.querySelector('#ingredients-field');
	const instructions = form.querySelector('#instructions-field');

	// send a new XHR
	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/addRecipe');

	// when the new recipe gets added, update the recipes page
	xhr.onload = () => getAllRecipes();

	// data to send with XHR
	let formData = `name=${name.value}&image=${image.value}&instructions=${instructions.value}
					&ingredients=${ingredients.value.replace('\n', ',')}`;

	// send XHR with form data
	xhr.send(formData);

	// close the modal
	const newRecipeModal = document.querySelector('#new-recipe-modal');
	newRecipeModal.style.display = "none";

	form.reset();

	// prevent the browser from sending the form on its own
	e.preventDefault();
	// prevent the browser from refreshing or changing the page
	return false;
};

// get specified recipe
const getRecipe = (recipeName) => {
	// send a new XHR
	const xhr = new XMLHttpRequest();
	xhr.open('GET', `/getRecipe?name=${recipeName}`);

	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader ('Accept', 'application/json');

	// when all the recipes load, add each to the recipes page
	xhr.onload = () => {
		const recipeModal = document.querySelector('#selected-recipe-modal');
		recipeModal.style.display = "flex";

		document.querySelector('#selected-recipe-name').innerHTML = JSON.parse(xhr.response).name;
		document.querySelector('#selected-recipe-image').src = JSON.parse(xhr.response).image;
		document.querySelector('#instructions').innerHTML = JSON.parse(xhr.response).instructions;

		const ingredientsArray = (JSON.parse(xhr.response).ingredients).split(',');
		document.querySelector('#ingredients').innerHTML = '';
		for (let ingredient of ingredientsArray) {
			document.querySelector('#ingredients').innerHTML += `<li>${ingredient}</li>`;
		}
	};

	// send XHR
	xhr.send();
};

// get all saved recipes
const getAllRecipes = () => {
	// send a new XHR
	const xhr = new XMLHttpRequest();
	xhr.open('GET', '/getAllRecipes');

	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader ('Accept', 'application/json');

	// when all the recipes load, add each to the recipes page
	xhr.onload = () => {
		const recipesView = document.querySelector('#recipes');
		// parse received JSON object
		let allRecipes = JSON.parse(xhr.response).recipes;
		// resetting the recipes view
		recipesView.innerHTML = '';

		// creating recipe modules
		for (let recipe in allRecipes) {
			// creating container
			const container = document.createElement('button');
			container.className = 'recipe';
			container.id = allRecipes[recipe].name;

			// creating module header
			const header = document.createElement('h2');
			header.className = 'recipe-header';
			header.innerHTML = allRecipes[recipe].name;
			container.appendChild(header);

			// creating module image
			const image = document.createElement('img');
			image.src = allRecipes[recipe].image;
			image.id = 'thumbnail';
			container.appendChild(image);

			// adding it to the recipe view
			recipesView.appendChild(container);
		}

		// open recipe modal based on recipe id
		const allRecipeModules = document.querySelectorAll('.recipe');
		for (let recipe of allRecipeModules) {
			const getSavedRecipe = () => getRecipe(recipe.id);
			recipe.addEventListener('click', getSavedRecipe);
		}
	};

	// send XHR
	xhr.send();
};

// app initialization
const init = () => {
	// get all saved recipes
	getAllRecipes();

	// new recipe elements
	const newRecipeButton = document.querySelector('#new-recipe-button');
	const newRecipeModal = document.querySelector('#new-recipe-modal');

	const selectedRecipeModal = document.querySelector('#selected-recipe-modal');

	// show new recipe modal on click
	newRecipeButton.onclick = function() {
		newRecipeModal.style.display = "flex";
	};

	// form for adding new recipe
	const newRecipeForm = document.querySelector('#new-recipe-form');
	const newRecipe = (e) => addRecipe(e, newRecipeForm);
	newRecipeForm.addEventListener('submit', newRecipe);

	// if the user clicks the cancel button in the modal, close it
	const cancelButton = document.querySelector('#cancel-button');
	cancelButton.onclick = function() {
		newRecipeModal.style.display = "none";
	};

	// if the user clicks the close button in the modal, close it
	const closeButton = document.querySelector('#close-button');
	closeButton.onclick = function() {
		selectedRecipeModal.style.display = "none";
	};

	// if the user clicks outside the modal, close it
	window.onclick = function(e) {
		if (e.target.className === 'modal') {
			for (let modal of document.querySelectorAll('.modal')) {
				modal.style.display = "none";
			}
		}
	};
};

window.onload = init;
