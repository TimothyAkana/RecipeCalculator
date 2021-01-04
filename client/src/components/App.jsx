import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';
import IngredientForm from './IngredientForm.jsx';
import RecipeForm from './RecipeForm.jsx';
import Recipes from './Recipes.jsx';

export default function App(props) {
  const [ signedIn, setSignedIn ] = useState(false);
  const [ page, setPage ] = useState('recipes');
  return (
    <div className="container">
      <Navbar setPage={setPage} setSignedIn={setSignedIn} signedIn={signedIn} />
      {page ==='recipes' ? <Recipes /> : null}
      {page ==='ingredientform' ? <IngredientForm /> : null}
      {page ==='recipeform' ? <RecipeForm /> : null}
    </div>
  )
}
