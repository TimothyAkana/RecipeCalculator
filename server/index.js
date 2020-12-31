const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dbController = require('../db/controller.js');
const foodCentral = require('../foodCentral/fcAPI.js');

const PORT = 3000;
const PATH = path.join(__dirname, '/../client/dist');
const app = express();

app.use(morgan('dev'));
app.use('/', express.static(PATH));
app.use(bodyParser.json());

//Ingredient Routes
app.post('*/ingredient', dbController.addIngredient);
app.get('*/ingredient', dbController.getIngredient);
app.patch('*/ingredient', dbController.patchIngredient);
app.delete('*/ingredient', dbController.deleteIngredient);

//Recipe Name
app.post('*/recipeDetails', dbController.addRecipeDetails);
app.get('*/recipeDetails', dbController.getRecipeDetails);
app.patch('*/recipeDetails', dbController.patchRecipeDetails);
app.delete('*/recipeDetails', dbController.deleteRecipeDetails);

//Recipe Quantities
app.post('*/recipeQuantities', dbController.addRecipeQuantities);
app.delete('*/recipeQuantities', dbController.deleteRecipeQuantities);

//Recipes
app.get('*/recipe/:recipeId', dbController.getRecipe);

//FoodCentral API routes
app.get('*/foodCentral/search/:ingredient', foodCentral.searchIngredients);
app.get('*/foodCentral/info/:id', foodCentral.getIngredientInfo);

app.listen(PORT, () => console.log('server is listening on port ', PORT));
