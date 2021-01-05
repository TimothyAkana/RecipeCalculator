const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dbController = require('../db/controller.js');
const foodCentral = require('../foodCentral/fcAPI.js');

const PORT = 3000;
const PATH = path.join(__dirname, '/../client/dist');
const app = express();

app.use('/', express.static(PATH));
app.use(bodyParser.json());

// Database - Ingredient Routes
app.post('*/ingredient', dbController.addIngredient);
app.get('*/ingredient', dbController.getIngredient);
app.patch('*/ingredient', dbController.patchIngredient);
app.delete('*/ingredient', dbController.deleteIngredient);

// Database - Recipe Details Routes
app.post('*/recipeDetails', dbController.addRecipeDetails);
app.get('*/recipeDetails', dbController.getRecipeDetails);
app.patch('*/recipeDetails', dbController.patchRecipeDetails);
app.delete('*/recipeDetails', dbController.deleteRecipeDetails);

// Database - Recipe Quantities Routes
app.post('*/recipeQuantities', dbController.addRecipeQuantities);
app.delete('*/recipeQuantities', dbController.deleteRecipeQuantities);

// Database - Full Recipe Route
app.get('*/recipe/:recipeId', dbController.getRecipe);

// FoodCentral API - Routes
app.get('*/foodCentral/search/:ingredient', foodCentral.searchIngredients);
app.get('*/foodCentral/info/:id', foodCentral.getIngredientInfo);

app.listen(PORT, () => console.log('server is listening on port ', PORT));
