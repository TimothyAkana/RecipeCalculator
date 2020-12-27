import React, { useState, useEffect } from 'react';
import { useInput } from '../hooks/input.js';
import measurementOptions from '../helpers/measurementOptions.js';
import axios from 'axios';

export default function IngredientForm(props) {
  const [purchased, setPurchased] = useState([]);
  const {value:ingredient, bind:bindIngredient, reset:resetIngredient } = useInput('');
  const {value:quantity, bind:bindQuantity, reset:resetQuantity } = useInput('');
  const {value:measurement, bind:bindMeasurement, reset:resetMeasurement } = useInput('pound');
  const {value:cost, bind:bindCost, reset:resetCost } = useInput('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newIngredient = {ingredient, quantity, measurement, cost};
    axios.post('/ingredient', newIngredient)
      .then((res) => setPurchased([...purchased, ...res.data]))
      .then(() => {
        resetIngredient();
        resetQuantity();
        resetMeasurement();
        resetCost();
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    axios.get('/ingredient')
      .then((res) => {
        setPurchased(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>Ingredient Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Ingredient:<input type="text" {...bindIngredient}/></label>
        <label>Quantity:<input type="number" {...bindQuantity}/></label>
        <label>Measurement:
          <select {...bindMeasurement}>
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
            <div>{item.name}  /  {item.quantity}  /  {item.measurement}  /  ${item.cost}</div>
          </div>
        )
      })}
    </div>
  )
}
