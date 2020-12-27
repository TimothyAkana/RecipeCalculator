const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dbController = require('../db/controller.js');

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

app.listen(PORT, () => console.log('server is listening on port ', PORT));
