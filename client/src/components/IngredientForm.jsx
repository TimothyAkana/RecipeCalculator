import React, { useState, useEffect } from 'react';
import measurements from '../helpers/measurements.js';
import conversions from '../helpers/conversions.js';
import axios from 'axios';

export default function IngredientForm(props) {
  //Ingredient Search Form
  const [searchOptions, setSearchOptions] = useState([]);
  const [search, setSearch] = useState('');

  //Ingredient Purchase Info
  const [ingredient, setIngredient] = useState('');
  const [quantity, setQuantity] = useState('');
  const [measurement, setMeasurement] = useState('gram');
  const [cost, setCost] = useState('');

  //Ingredient Convertion Info
  const [volumeQuantity, setVolumeQuantity] = useState('');
  const [volumeUnit, setVolumeUnit] = useState('cup');
  const [weightQuantity, setWeightQuantity] = useState('');
  const [weightUnit, setWeightUnit] = useState('gram');

  //Populate Page with previously created ingredient info
  const [purchased, setPurchased] = useState([]);
  useEffect(() => {
    axios.get('/ingredient')
      .then((res) => {
        setPurchased(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //Search API for an ingredient
  const handleSearch = (event) => {
    event.preventDefault();
    axios.get(`/foodCentral/search/${search}`)
      .then((result) => setSearchOptions(result.data))
      .catch((err) => console.log(err));
  }

  //Lookup Ingredient details from database
  const handleLookup = (event, itemId) => {
    event.preventDefault();
    axios.get(`/foodCentral/info/${itemId}`)
      .then((result) => {
        setSearchOptions([]);
        setSearch('');
        setIngredient(result.data.name);
        setVolumeQuantity(1);
        setVolumeUnit('cup');
        setWeightQuantity(result.data.gramsPerCup);
        setWeightUnit('gram');
      })
      .catch((err) => console.log(err));
  }

  //Submitting a fully-filled in ingredient
  const handleSubmit = (event) => {
    event.preventDefault();
    const gramsPerCup = conversions.gramsPerCup(volumeQuantity, volumeUnit, weightQuantity, weightUnit)
    const costPerGram = conversions.costPerGram(quantity, measurement, cost, gramsPerCup);
    const newIngredient = {ingredient, costPerGram, quantity, measurement, cost, gramsPerCup};
    axios.post('/ingredient', newIngredient)
      .then((res) => setPurchased([...purchased, ...res.data]))
      .then(() => {
        setIngredient('');
        setQuantity('');
        setCost('');
        setVolumeQuantity('');
        setWeightQuantity('');
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <h2>Ingredient Form</h2>
      <form onSubmit={handleSearch}>
        <label>Search for Ingredient: <input type="text" value={search} onChange={() => setSearch(event.target.value)}/></label>
        <input type="submit" value="Search" />
      </form>

      {searchOptions.map((item)=>{
        return (
          <div key={item.id} onClick={() => handleLookup(event, item.id)}>{item.id}  /  {item.item}  /  {item.brand}</div>
        )
      })}



      <form onSubmit={handleSubmit}>
        <label>Ingredient:
          <input type="text" value={ingredient} onChange={() => setIngredient(event.target.value)}/>
        </label>
        <label>Quantity:
          <input type="number" value={quantity} onChange={() => setQuantity(Number(event.target.value))}/>
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
        <label>Cost (in $):
          <input type="number" value={cost} onChange={() => setCost(Number(event.target.value))}/>
        </label>



        <label>Conversion Factor:</label>
        <label>Amount:
          <input type="number" value={volumeQuantity} onChange={() => setVolumeQuantity(event.target.value)}/>
        </label>
        <label>Volume:
          <select value={volumeUnit} onChange={() => setVolumeUnit(event.target.value)}>
            {measurements.volume.map((measurement) => {
              return (
                <option value={measurement} key={measurement}>{measurement}</option>
              )
            })}
          </select>
        </label>
        =
        <label>Amount:
          <input type="number" value={weightQuantity} onChange={() => setWeightQuantity(event.target.value)}/>
        </label>
        <label>Weight:
          <select value={weightUnit} onChange={() => setWeightUnit(event.target.value)}>
            {measurements.weight.map((measurement) => {
              return (
                <option value={measurement} key={measurement}>{measurement}</option>
              )
            })}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>


      {purchased.map((item)=>{
        return (
          <div key={item.id}>
            <div>{item.name}  /  {item.quantity}  /  {item.measurement}  /  ${item.cost} / Cost Per Gram: ${item.costpergram} / Grams Per Cup: {item.gramspercup} </div>
          </div>
        )
      })}
    </div>
  )
}
