const db = require('./connection.js');
const format = require('pg-format');

module.exports = {
  // Ingredient CRUD Operations
  addIngredient: (req, res) => {
    const text = 'INSERT INTO recipe.ingredients (name, costpergram, quantity, measurement, cost, gramspercup) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [req.body.ingredient, req.body.costPerGram, req.body.quantity, req.body.measurement, req.body.cost, req.body.gramsPerCup];
    db.query(text, values, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.json(data.rows)}
    })
  },
  getIngredient: (req, res) => {
    db.query('SELECT * FROM recipe.ingredients', (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.json(data.rows)}
    })
  },
  patchIngredient: (req, res) => {
    const text = 'UPDATE recipe.ingredients SET name = ($2), costpergram = ($3), quantity = ($4), measurement = ($5), cost = ($6), gramspercup = ($7) WHERE id = ($1)';
    const values = [req.body.id, req.body.ingredient, req.body.costPerGram, req.body.quantity, req.body.measurement, req.body.cost, req.body.gramsPerCup];
    db.query(text, values, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.send(req.body)}
    })
  },
  deleteIngredient: (req, res) => {
    const text = 'DELETE FROM recipe.ingredients WHERE id = ($1)';
    const value = [req.body.id];
    db.query(text, value, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.sendStatus(200)}
    })
  },

  // Full Recipe CRUD
  getRecipe: (req, res) => {
    db.query(`SELECT d.id recipeId, d.name recipeName, d.description, i.name ingredientname, i.costPerGram, i.gramsPerCup, q.id quantityid, q.ingredientQuantity, q.ingredientMeasurement FROM recipe.ingredients i, recipe.details d, recipe.quantities q WHERE d.id = q.recipeId AND q.ingredientId = i.id AND d.id = ${req.params.recipeId}`, (err, data) => {
      if (err) {console.log(err.stack)}
      else {
        res.json(data.rows)}
    })
  },


  // Recipe Details CRUD Operations
  addRecipeDetails: (req, res) => {
    const text = 'INSERT INTO recipe.details (name, description) VALUES ($1, $2) RETURNING *';
    const values = [req.body.recipeName, req.body.recipeDescription];
    db.query(text, values, (err, data) => {
      if (err) {console.log(err.stack)}
      else {
        res.json(data.rows)}
    })
  },
  getRecipeDetails: (req, res) => {
    db.query('SELECT * FROM recipe.details', (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.json(data.rows)}
    })
  },
  patchRecipeDetails: (req, res) => {
    const text = 'UPDATE recipe.details SET name = ($2), description = ($3) WHERE id = ($1)';
    const values = [req.body.id, req.body.name, req.body.details];
    db.query(text, values, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.send(req.body)}
    })
  },
  deleteRecipeDetails: (req, res) => {
    const text = 'DELETE FROM recipe.details WHERE id = ($1)';
    const value = [req.body.id];
    db.query(text, value, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.sendStatus(200)}
    })
  },

  // Recipe Quantities CRUD Operations
  addRecipeQuantities: (req, res) => {
    const values = [];
    req.body.ingredients.forEach(ingredient => {
      values.push([req.body.recipeId, ingredient.ingredientId, ingredient.quantity, ingredient.measurement]);
    })
    var sql = format('INSERT INTO recipe.quantities (recipeid, ingredientid, ingredientquantity, ingredientmeasurement) VALUES %L RETURNING *', values);
    console.log(values);
    db.query(sql, (err, data) => {
      if (err) {console.log(err.stack)}
      else {
        console.log(data.rows);
        res.json(data.rows)}
    })
  },
  deleteRecipeQuantities: (req, res) => {
    const text = 'DELETE FROM recipe.quantities WHERE id = ($1)';
    const value = [req.body.id];
    db.query(text, value, (err, data) => {
      if (err) {console.log(err.stack)}
      else {res.sendStatus(200)}
    })
  }
}