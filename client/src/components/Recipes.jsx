import React, { useState, useEffect } from 'react';
import axios from 'axios';
import conversions from "../helpers/conversions.js";

export default function Recipes(props) {
  //Populate List of Recipes initially
  const [ recipes, setRecipes] = useState([]);
  useEffect(() => {
    axios.get('/recipeDetails')
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [ loadedRecipe, setLoadedRecipe ] = useState([]);
  const loadRecipe = (event, recipeId) => {
    event.preventDefault();
    axios.get(`/recipe/${recipeId}`)
      .then((result) => setLoadedRecipe(result.data))
      .catch((err) => console.log(err));
  }

  //inline styling
  const containerHeight = {
    height: "100vh"
  }
  const overflowBox = {
    height: "70vh",
    overflowY: "auto"
  }

  return (
    <div className="parent-container d-flex col-6">
      {/* Left Side is a list of Recipes */}
      <div className="col-12" style={containerHeight}>
      <h3>Recipes:</h3>
      <ul className="list-group" style={overflowBox}>
        {recipes.map(recipe => {
          return (
            <button type="button" className="list-group-item list-group-item-action" key={recipe.id} value={recipe.id} onClick={() => loadRecipe(event, recipe.id)}>{recipe.name}</button>
          )
        })}
      </ul>
      </div>
      {/* Right side is the currently loaded recipe */}
      <div className="col-12">
        <h3>{loadedRecipe[0] ? loadedRecipe[0].recipename : null}</h3>
        <h5>{loadedRecipe[0] ? loadedRecipe[0].description : null}</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Quantity</th>
              <th scope="col">Ingredient</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            {loadedRecipe.map((ingredient) => {
              return (
                <tr key={ingredient.ingredientname}>
                  <td>{ingredient.ingredientquantity} {ingredient.ingredientmeasurement}</td>
                  <td>{ingredient.ingredientname}</td>
                  <td>{'$' + (Math.round((conversions.totalCost(ingredient.ingredientquantity, ingredient.ingredientmeasurement, ingredient.costpergram, ingredient.gramspercup)) * 100 + Number.EPSILON) / 100).toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td className="text-right">TOTAL COST:</td>
              <td>${(
                loadedRecipe.reduce((accumulator, current) => {
                  return accumulator + conversions.totalCost(current.ingredientquantity, current.ingredientmeasurement, current.costpergram, current.gramspercup)
                }, 0)).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}