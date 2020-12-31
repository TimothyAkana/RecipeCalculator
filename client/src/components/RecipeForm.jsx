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
    <div>
      <h2>Create A New Recipe</h2>
      <form onSubmit={handleSubmit}>

        <label>Recipe Name:
          <input type="text" value={recipeName} onChange={() => setRecipeName(event.target.value)}/>
        </label>

        <label>Recipe Description:
          <input type="text" value={recipeDescription} onChange={() => setRecipeDescription(event.target.value)}/>
        </label>


        <h3>{recipeName}</h3>
        <h5>{recipeDescription}</h5>
        {ingredientList.map((item, index)=>{
          return (
            <div key={index}> {item.ingredientName}: {item.quantity} {item.measurement} {item.costPerGram} {item.gramsPerCup} {item.cost} COST = {item.totalIngredientCost}</div>
          )
        })}
        <div>TOTAL COST: {totalCost}</div>


        <label>Ingredient:
          <select value={ingredientName} onChange={() => {
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
            {ingredientDropdown.map((item) => {
              return (
                <option value={item.name} key={item.id}>{item.name}</option>
              )
            })}
          </select>
        </label>

        <label>Quantity:
          <input type="number" value={quantity} onChange={() => setQuantity(event.target.value)}/>
        </label>

        <label>Measurement:
          <select value={measurement} onChange={() => setMeasurement(event.target.value)}>
            {measurements.mixed.map((measurement) => {
              return (
                <option value={measurement} key={measurement}>{measurement}</option>
              )
            })}
          </select>
        </label>
        <input type="submit" value="Add Ingredient" />
      </form>
      <button onClick={handleButton}>CREATE RECIPE</button>
    </div>
  )
}