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
      {/* Search Bar Form */}
      <form className="d-flex" onSubmit={handleSearch}>
        <input className="form-control me-2" type="search" placeholder="Search For Ingredients" aria-label="Search" value={search} onChange={() => setSearch(event.target.value)}/>
        <button className="btn btn-outline-success" data-toggle="modal" data-target="#exampleModalCenter" type="submit">Search</button>
      </form>
      <hr />
      <br />
      {/* Ingredient Select Modal */}
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalCenterTitle">Ingredients</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {searchOptions.map((item)=>{
                return (
                  <div key={item.id} data-dismiss="modal" onClick={() => handleLookup(event, item.id)}>{item.id}  /  {item.item}  /  {item.brand}</div>
                )
              })}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>



      {/* Ingredient Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-12">
            <label>Ingredient:</label>
              <input className="form-control" type="text" value={ingredient} onChange={() => setIngredient(event.target.value)}/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-4">
              <label>Quantity:</label>
              <input className="form-control" type="number" value={quantity} onChange={() => setQuantity(Number(event.target.value))}/>
            </div>
            <div className="form-group col-2">
              <label>Measurement:</label>
              <select className="form-select form-control" value={measurement} onChange={() => setMeasurement(event.target.value)}>
                  {measurements.mixed.map((measurement) => {
                    return (
                      <option value={measurement} key={measurement}>{measurement}</option>
                    )
                  })}
              </select>
            </div>
          <div className="form-group col-6">
            <label>Cost (in $):</label>
            <input className="form-control" type="number" value={cost} onChange={() => setCost(Number(event.target.value))}/>
          </div>


        </div>
        <div className="form-row">
          <div className="form-group col-12">
            <h4>Conversion Factor:</h4>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-3">
            <label>Volume:</label>
            <input className="form-control" type="number" value={volumeQuantity} onChange={() => setVolumeQuantity(event.target.value)}/>
          </div>
          <div className="form-group col-2">
            <label>Measurement:</label>
            <select className="form-select form-control" value={volumeUnit} onChange={() => setVolumeUnit(event.target.value)}>
              {measurements.volume.map((measurement) => {
                return (
                <option value={measurement} key={measurement}>{measurement}</option>
              )
              })}
            </select>
          </div>
          <div className="form-group col-2">
            <label></label>
            <h2 className="text-center">=</h2>
          </div>
          <div className="form-group col-3">
            <label>Weight:</label>
            <input className="form-control" type="number" value={weightQuantity} onChange={() => setWeightQuantity(event.target.value)}/>
          </div>
          <div className="form-group col-2">
            <label>Measurement:</label>
            <select className="form-select form-control" value={weightUnit} onChange={() => setWeightUnit(event.target.value)}>
              {measurements.weight.map((measurement) => {
                return (
                  <option value={measurement} key={measurement}>{measurement}</option>
                )
              })}
            </select>
          </div>
        </div>
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
