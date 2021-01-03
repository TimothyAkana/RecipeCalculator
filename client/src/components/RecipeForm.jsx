import React, { useState, useEffect } from 'react';
import axios from 'axios';
import measurements from '../helpers/measurements.js';
import conversions from '../helpers/conversions.js';

export default function RecipeForm(props) {
  //Printout of in-progress recipe
  const [ recipeName, setRecipeName ] = useState('');
  const [ recipeDescription, setRecipeDescription ] = useState('');
  const [ ingredientList, setIngredientList ] = useState([]);

  //Ingredient Creation Form Fields
  const [ ingredientName, setIngredientName ] = useState('');
  const [ quantity, setQuantity ] = useState('');
  const [ measurement, setMeasurement] = useState('gram');
  //TESTING
  const [ totalCost, setTotalCost ] = useState(0);
  const [ costPerGram, setCostPerGram ] = useState('');
  const [ gramsPerCup, setGramsPerCup ] = useState('');
  const [ ingredientId, setIngredientId] = useState('');

  //Populate List of Ingredients in Dropdown with ingredients from database
  const [ ingredientDropdown, setIngredientDropdown] = useState([]);
  const [ ingredientCosts, setIngredientCosts] = useState({});
  useEffect(() => {
    axios.get('/ingredient')
      .then((res) => {
        setIngredientDropdown(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //Updates total Cost when ingredientList changes
  useEffect(() => {
    let total = 0;
    for (var i = 0; i < ingredientList.length; i++) {
      total += ingredientList[i].totalIngredientCost;
    }
    setTotalCost(total);
  }, [ingredientList]);

  //Adds Ingredient to Recipe-in-progress
  const handleSubmit = (event) => {
    event.preventDefault();
    const totalIngredientCost = conversions.totalCost(quantity, measurement, costPerGram, gramsPerCup);
    setTotalCost(totalIngredientCost);
    setIngredientList([...ingredientList, {ingredientId, ingredientName, quantity, measurement, gramsPerCup, costPerGram, totalIngredientCost}])
    setIngredientName('');
    setQuantity('');
    setMeasurement('');
  }

  const handleButton = (event) => {
    event.preventDefault();
    let recipeId;
    axios.post('/recipeDetails', {recipeName, recipeDescription})
      .then((result) => result.data[0].id)
      .then((recipeId) => {
        axios.post('/recipeQuantities', {recipeId: recipeId, ingredients: ingredientList})
        .then((results) => console.log(results.data))
        .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="parent-container d-flex col-6">
      <form onSubmit={handleSubmit} className="col-12">
        <h3><em>Create A New Recipe</em></h3>
          <div className="form-group mb-3">
            <label className="form-label">Recipe Name</label>
            <input type="text" className="form-control" value={recipeName} onChange={() => setRecipeName(event.target.value)}/>
          </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="3" value={recipeDescription} onChange={() => setRecipeDescription(event.target.value)}></textarea>
        </div>
        <hr />
        <div className="form-group mb-3">
        <label>Ingredient:</label>
          <select className="form-select form-control" value={ingredientName} onChange={() => {
            setIngredientName(event.target.value)
            for (var i = 0; i < ingredientDropdown.length; i++) {
              if (ingredientDropdown[i].name === event.target.value) {
                setCostPerGram(ingredientDropdown[i].costpergram);
                setGramsPerCup(ingredientDropdown[i].gramspercup);
                setIngredientId(ingredientDropdown[i].id);
                return;
              }
            }
          }}>
            <option selected>Select an ingredient</option>
            {ingredientDropdown.map((item) => {
              return (
                <option value={item.name} key={item.id}>{item.name}</option>
              )
            })}
          </select>
        </div>
        <div className="form-row">
          <div className="col-6">
          <label>Quantity:</label>
            <input className="form-select form-control mb-1" type="number" value={quantity} onChange={() => setQuantity(event.target.value)}/>
          </div>
          <div className="col-6">
            <label>Measurement:</label>
            <select className="form-select form-control" value={measurement} onChange={() => setMeasurement(event.target.value)}>
              {measurements.mixed.map((measurement) => {
                return (
                  <option value={measurement} key={measurement}>{measurement}</option>
                )
              })}
            </select>
          </div>
        </div>
        <input type="submit" value="Add Ingredient" />
      </form>

      {/* Right Side of Page: Recipe Preview */}
      <div className="container col-12">
        <div className="col-lg-12">
          <h2>{recipeName === '' ? 'New Recipe Name' : recipeName}</h2>
            <h5>{recipeDescription === '' ? 'Short description of the new recipe!' : recipeDescription}</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Quantity</th>
                  <th scope="col">Ingredient</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody>
                {ingredientList.map((item, index)=>{
                  return (
                    <tr key={index}>
                      <td>{item.quantity} {item.measurement}</td>
                      <td>{item.ingredientName}</td>
                      <td>{'$' + (Math.round( item.totalIngredientCost * 100 + Number.EPSILON) / 100).toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td className="text-right">TOTAL COST:</td>
                  <td>${totalCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          <button className="float-right" onClick={handleButton}>CREATE RECIPE</button>
        </div>
      </div>
    </div>
  )
}