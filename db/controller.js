const db = require('./connection.js');

module.exports = {
  //Ingredient Methods
  addIngredient: (req, res) => {
    const text = 'INSERT INTO recipe.ingredients (name, quantity, measurement, cost) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [req.body.ingredient, req.body.quantity, req.body.measurement, req.body.cost];
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
    const text = 'UPDATE recipe.ingredients SET name = ($2), quantity = ($3), measurement = ($4), cost = ($5) WHERE id = ($1)';
    const values = [req.body.id, req.body.ingredient, req.body.quantity, req.body.measurement, req.body.cost];
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
  }
}