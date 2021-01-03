CREATE DATABASE bestbuds;

\connect bestbuds;

CREATE SCHEMA IF NOT EXISTS recipe;

CREATE TYPE measurementOptions AS ENUM ('pound', 'ounce', 'kilogram', 'gram', 'gallon', 'liter', 'quart', 'pint', 'cup', 'fluidOunce', 'tablespoon', 'teaspoon');

CREATE TABLE recipe.ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  costPerGram REAL NOT NULL,
  quantity REAL NOT NULL,
  measurement measurementOptions NOT NULL,
  cost REAL NOT NULL,
  gramsPerCup REAL
);

CREATE TABLE recipe.details (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL,
  description TEXT
);

CREATE TABLE recipe.quantities (
  id SERIAL PRIMARY KEY,
  recipeId INT NOT NULL,
  ingredientId INT NOT NULL,
  ingredientQuantity REAL NOT NULL,
  ingredientMeasurement measurementOptions NOT NULL,
  CONSTRAINT recipeId
    FOREIGN KEY (recipeId)
      REFERENCES recipe.details(id),
  CONSTRAINT ingredientId
    FOREIGN KEY (ingredientId)
      REFERENCES recipe.ingredients(id)
);
