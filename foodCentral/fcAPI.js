const API_KEY = require('./foodCentralAPI.js');
const axios = require('axios');
const unitConversions = require('./helpers/unitConversions.js');

module.exports = {
  searchIngredients: (req, res) => {
    axios.get(`https://api.nal.usda.gov/fdc/v1/foods/search?query=+"(${req.params.ingredient})"&pageSize=500&dataType=Branded,Survey%20(FNDDS)&api_key=${API_KEY}`)
      .then((results) => {
        let formattedData = results.data.foods.map((food) => {
          return {id: food.fdcId, item: food.lowercaseDescription, brand: food.brandOwner}
        })
        res.json(formattedData);
      })
      .catch((err) => console.log(err));
  },
  getIngredientInfo: (req, res) => {
    axios.get(`https://api.nal.usda.gov/fdc/v1/food/${req.params.id}?api_key=${API_KEY}`)
    .then((results) => {
      let info;
      //If Food ID is from 'Branded' Database
      if (results.data.dataType === 'Branded') {
        info = {
          fdcId: results.data.fdcId,
          name: results.data.description.toLowerCase(),
          gramsPerCup: unitConversions.branded(results.data.servingSize, results.data.servingSizeUnit, results.data.householdServingFullText),
          gramsPerServing: Number(results.data.servingSize)
        }
      } else {
      //If Food ID is from 'Nutrition' Database
        info = {
          fdcId: results.data.fdcId,
          name: results.data.description.toLowerCase(),
          gramsPerCup: unitConversions.foodNutrition(results.data.foodPortions)
        }
      }
      res.json(info);
    })
    .catch((err) => console.log(err));
  }
}