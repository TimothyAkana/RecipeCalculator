import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div>
      {recipes.map(recipe => {
        return <div key={recipe.id} value={recipe.id} onClick={() => loadRecipe(event, recipe.id)}>{recipe.name}, {recipe.description} {recipe.id}</div>
      })}
      <h2>CURRENT RECIPE: </h2>
      <h3>{loadedRecipe[0] ? loadedRecipe[0].recipename : null}</h3>
      <h5>{loadedRecipe[0] ? loadedRecipe[0].description : null}</h5>
      {loadedRecipe.map(ingredient => {
        return (
          <div>{ingredient.ingredientname} {ingredient.ingredientquantity} {ingredient.ingredientmeasurement}</div>
        )
      })}
    </div>
  )
}