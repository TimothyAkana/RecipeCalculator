import React, { useState } from 'react';
import { useInput } from '../hooks/input.js';
import measurementOptions from '../helpers/measurementOptions.js';

export default function RecipeForm(props) {
  const [ recipe, setRecipe ] = useState('');
  const [ ingredients, setIngredients] = useState([]);
  const { value:recipeName, bind:bindRecipeName, reset:resetRecipeName } = useInput('');
  const { value:ingredient, bind:bindIngredient, reset:resetIngredient } = useInput('');
  const { value:quantity, bind:bindQuantity, reset:resetQuantity } = useInput('');
  const { value:measurement, bind:bindMeasurement, reset:resetMeasurement } = useInput('');

  const handleRecipeName = (event) => {
    event.preventDefault();
    setRecipe(recipeName);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setIngredients((prevIngredients) => {
      return [...prevIngredients, {ingredient: ingredient, quantity: quantity, measurement: measurement}]
    });
    resetIngredient();
    resetQuantity();
    resetMeasurement();
  }

  return (
    <div>
      <h2>Create A New Recipe</h2>
      <form onSubmit={handleRecipeName}>
        <label>Recipe Name:<input type="text" {...bindRecipeName}/></label>
        <input type="submit" value="Start Recipe" />
      </form>
      <form onSubmit={handleSubmit}>
        <label>Ingredient:<input type="text" {...bindIngredient}/></label>
        <label>Quantity:<input type="number" {...bindQuantity}/></label>
        <label>Measurement:
          <select>
            {measurementOptions.map((measurement) => {
              return (
                <option value={measurement} key={measurement}>{measurement}</option>
              )
            })}
          </select>
        </label>
        <input type="submit" value="Add Ingredient" />
      </form>
      <h3>{recipe}</h3>
      {ingredients.map((item, index)=>{
        return (
          <div key={index}>
            <div>{item.ingredient}: {item.quantity} {item.measurement}</div>
          </div>
        )
      })}
    </div>
  )
}