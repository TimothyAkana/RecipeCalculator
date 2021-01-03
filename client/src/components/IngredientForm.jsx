import React, { useState, useEffect } from 'react';
import measurements from '../helpers/measurements.js';
import conversions from '../helpers/conversions.js';
import axios from 'axios';

export default function IngredientForm(props) {
  //Ingredient Search Form
  const [ searchOptions, setSearchOptions ] = useState([]);
  const [ search, setSearch ] = useState('');

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
  //Filter Search Results
  const [ filter, setFilter ] = useState('');
  const filterWords = (event) => {
    event.preventDefault();
    let filtered = searchOptions.filter(entry => {
      return entry.item.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    })
    setSearchOptions(filtered);
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

  //inline styling
  const containerHeight = {
    height: "100vh"
  }
  const overflowBox = {
    height: "60vh",
    overflowY: "auto"
  }
  const overflowModal = {
    maxHeight: "50vh",
    overflowY: "auto"
  }

  return (
    <div>
      <div className="col-12">
        <h2>Ingredients</h2>
        {/* Search Bar Form */}
        <form className="d-flex" onSubmit={handleSearch}>
          <input className="form-control me-2" type="search" placeholder="Search For Ingredients to auto-populate name and conversion factor" aria-label="Search" value={search} onChange={() => setSearch(event.target.value)}/>
          <button className="btn btn-outline-success" data-toggle="modal" data-target="#exampleModalCenter" type="submit">Search</button>
        </form>
        <hr />

        {/* Ingredient Select Modal */}
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog"  aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ingredients</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={overflowModal}>
                <div className="list-group">
                  {searchOptions.map((item) =>{
                    return (
                      <button type="button" className="list-group-item list-group-item-action" key={item.id} data-dismiss="modal" onClick={() => handleLookup(event, item.id)}>{item.item}</button>
                    )
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <form className="d-flex">
                  <input className="form-control me-2" type="search" placeholder="Filter" value={filter} onChange={() => setFilter(event.target.value)}aria-label="Search" />
                  <button className="btn btn-outline-success" type="submit" onClick={filterWords}>Filter</button>
                </form>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side is Ingredient Form */}
      <div className="parent-container d-flex col-6">
        <form onSubmit={handleSubmit} className="col-12">
          <div className="form-row">
            <div className="form-group col-12">
              <label>Ingredient:</label>
                <input className="form-control" type="text" value={ingredient} onChange={() => setIngredient(event.target.value)}/>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-3">
                <label>Quantity:</label>
                <input className="form-control" type="number" value={quantity} onChange={() => setQuantity(Number(event.target.value))}/>
              </div>
              <div className="form-group col-3">
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
            <div className="form-group col-2">
              <label>Volume:</label>
              <input className="form-control" type="number" value={volumeQuantity} onChange={() => setVolumeQuantity(event.target.value)}/>
            </div>
            <div className="form-group col-3">
              <label>Unit:</label>
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
            <div className="form-group col-2">
              <label>Weight:</label>
              <input className="form-control" type="number" value={weightQuantity} onChange={() => setWeightQuantity(event.target.value)}/>
            </div>
            <div className="form-group col-3">
              <label>Unit:</label>
              <select className="form-select form-control" value={weightUnit} onChange={() => setWeightUnit(event.target.value)}>
                {measurements.weight.map((measurement) => {
                  return (
                    <option value={measurement} key={measurement}>{measurement}</option>
                  )
                })}
              </select>
            </div>
          </div>
          <input type="submit" value="Submit Ingredient" />
        </form>

        {/* Right Side is List of purchased Ingredients */}
        <div className="container col-12" style={containerHeight}>
          <div className="col-lg-12">
            <h2>Ingredient Inventory</h2>
            <div style={overflowBox}>
              <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Ingredient Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody>
                {purchased.map((item)=>{
                  return (
                    // <div key={item.id}>
                    //   <div>{item.name}  /  {item.quantity}  /  {item.measurement}  /  ${item.cost} / Cost Per Gram: ${item.costpergram} / Grams Per Cup: {item.gramspercup} </div>
                    // </div>
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.quantity} {item.measurement}</td>
                      <td>${item.cost}</td>
                    </tr>
                  )
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
