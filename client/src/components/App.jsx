import React, { useState } from 'react';
import axios from 'axios';
import conversions from '../helpers/conversions.js';
import IngredientForm from './IngredientForm.jsx';
import RecipeForm from './RecipeForm.jsx';

export default function App(props) {
  return (
    <div className="container">
      {/* <IngredientForm /> */}
      <RecipeForm />
    </div>
  )
}
