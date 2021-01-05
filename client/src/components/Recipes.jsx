import React, { useState, useEffect } from 'react';
import axios from 'axios';
import conversions from "../helpers/conversions.js";
import measurements from "../helpers/measurements.js"

export default function Recipes(props) {
  // List of Completed Recipes, Populates Initial list of recipes from DB on mount
  const [ recipes, setRecipes] = useState([]);
  useEffect(() => {
    axios.get('/recipeDetails')
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Currently Selected Recipe, Loads recipe details from selected recipe
  const [ loadedRecipe, setLoadedRecipe ] = useState([]);
  const loadRecipe = (event, recipeId) => {
    event.preventDefault();
    axios.get(`/recipe/${recipeId}`)
      .then((result) => setLoadedRecipe(result.data))
      .catch((err) => console.log(err));
  }

  // Modifying details for a quantity of a particular ingredient
  const [ modifiedIndex, setModifiedIndex ] = useState('');
  const [ quantity, setQuantity ] = useState('');
  const [ measurement, setMeasurement ] = useState('gram');
  const modifyIngredient = () => {
    // Set the new details
    let newRecipe = loadedRecipe;
    newRecipe[modifiedIndex].ingredientquantity = quantity;
    newRecipe[modifiedIndex].ingredientmeasurement = measurement;
    setLoadedRecipe(newRecipe);
    // Reset the fields
    setQuantity('');
    setMeasurement('gram');
  }

  // Inline styling
  const containerHeight = {
    height: "100vh"
  }
  const overflowBox = {
    height: "70vh",
    overflowY: "auto"
  }

  return (
    <div className="parent-container d-flex col-6">
      {/* Left Side Column is a list of Completed Recipes */}
      <div className="col-12" style={containerHeight}>
      <h3>Recipes:</h3>
      <ul className="list-group" style={overflowBox}>
        {recipes.map(recipe => {
          return (
            <button
              // type="button"
              className="list-group-item list-group-item-action"
              key={recipe.id}
              value={recipe.id}
              onClick={() => loadRecipe(event, recipe.id)}
              > {recipe.name} </button>
          )
        })}
      </ul>
      </div>

      {/* Right Side Column is the currently loaded recipe */}
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
            {loadedRecipe.map((ingredient, index) => {
              return (
                <tr key={index}>
                  <td data-toggle="modal" data-target="#quantityModal" onClick={() => setModifiedIndex(index)}>{ingredient.ingredientquantity} {ingredient.ingredientmeasurement}</td>
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

      {/* Change Quantity Modal */}
      <div className="modal fade" id="quantityModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modify Quantity of {loadedRecipe[modifiedIndex] ? loadedRecipe[modifiedIndex].ingredientname : null}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div>Currently set to: {loadedRecipe[modifiedIndex] ? `${loadedRecipe[modifiedIndex].ingredientquantity} ${loadedRecipe[modifiedIndex].ingredientmeasurement}` : null}</div>
              <div className="form-row">
              <div className="form-group col-4">
                  <label>New Quantity:</label>
                  <input className="form-control" type="number" value={quantity} onChange={() => setQuantity(Number(event.target.value))}/>
                </div>
                <div className="form-group col-4">
                  <label>New Measurement:</label>
                  <select className="form-select form-control" value={measurement} onChange={() => setMeasurement(event.target.value)}>
                      {measurements.mixed.map((measurement) => {
                        return (
                          <option value={measurement} key={measurement}>{measurement}</option>
                        )
                      })}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={modifyIngredient}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}