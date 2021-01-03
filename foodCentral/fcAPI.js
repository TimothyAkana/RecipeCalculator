const API_KEY = require('./foodCentralAPI.js');
const axios = require('axios');
const gramConversion = require('./helpers/gramConversion.js');

module.exports = {
  //Ingredient Methods
  searchIngredients: (req, res) => {
    axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=+"(${req.params.ingredient})"&pageSize=200&dataType=Survey%20(FNDDS)&api_key=${API_KEY}`)
      .then((results) => {
        let formattedData = results.data.foods.map((food) => {
          return {id: food.fdcId, item: food.description}
        })
        res.json(formattedData);
      })
      .catch((err) => console.log(err));
  },
  getIngredientInfo: (req, res) => {
    axios.get(`https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${API_KEY}`)
    .then((results) => {
      let info = {
        fdcId: results.data.fdcId,
        name: results.data.description,
        gramsPerCup: gramConversion(results.data.foodPortions)
      }
      res.json(info);
    })
    .catch((err) => console.log(err));
  }
}