import React, { useState } from 'react';
import { useInput } from '../hooks/input.js';
import measurementOptions from '../helpers/measurementOptions.js';

export default function IngredientForm(props) {
  const [purchased, setPurchased] = useState([]);
  const {value:ingredient, bind:bindIngredient, reset:resetIngredient } = useInput('');
  const {value:quantity, bind:bindQuantity, reset:resetQuantity } = useInput('');
  const {value:measurement, bind:bindMeasurement, reset:resetMeasurement } = useInput('');
  const {value:cost, bind:bindCost, reset:resetCost } = useInput('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setPurchased((prevPurchased) => {
      return [...prevPurchased, {ingredient: ingredient, quantity: quantity, measurement: measurement, cost: cost}]
    });
    resetIngredient();
    resetQuantity();
    resetMeasurement();
    resetCost();
  }

  return (
    <div>
      <h2>Ingredient Form</h2>
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
        <label>Cost (in $):<input type="number" {...bindCost}/></label>
        <input type="submit" value="Submit" />
      </form>
      {purchased.map((item, index)=>{
        return (
          <div key={index}>
            <div>{item.ingredient}</div>
            <div>{item.quantity} {item.measurement} purchased at ${item.cost}</div>
          </div>
        )
      })}
    </div>
  )
}
