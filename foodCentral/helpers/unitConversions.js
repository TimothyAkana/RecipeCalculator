const volumeOptions = {
  tsp: 'teaspoon',
  teaspoon: 'teaspoon',
  tbsp: 'tablespoon',
  tablespoon: 'tablespoon',
  cup: 'cup',
  cups: 'cup',
  oz: 'fluidOunce',
  onz: 'fluidOunce',
  pint: 'pint',
  pnt: 'pint',
  qurt: 'quart',
  quart: 'quart',
  ltr: 'liter',
  l: 'liter',
  liter: 'liter',
  ml: 'milliliter',
  milliliter: 'milliliter',
  glln: 'gallon',
  gallon: 'gallon',
}

const tspConversions = {
  gallon: 768,
  liter: 202.884,
  quart: 192,
  pint: 96,
  cup: 48,
  fluidOunce: 6,
  milliliter: 4.92892,
  tablespoon: 3,
  teaspoon: 1,
}

module.exports.foodNutrition = (foodPortionData) => {
  for (var i = 0; i < foodPortionData.length; i++) {
    let item = foodPortionData[i];
    if (item.portionDescription.indexOf('1 cup') > -1) {
      return item.gramWeight;
    }
    if (item.portionDescription.indexOf('1 fl oz') > -1) {
      return item.gramWeight * 8;
    }
    if (item.portionDescription.indexOf('1 tablespoon') > -1) {
      return item.gramWeight * 16
    }
    if (item.portionDescription.indexOf('1 teaspoon') > -1) {
      return item.gramWeight * 48
    }
  }
  return undefined
}

module.exports.branded = (servingSize, servingUnit, householdText) => {
  let split = householdText.split(' ');
  let unit;
  if (split[0].indexOf('/') > -1) {
    let fraction = split[0].split('/');
    unit = Number(fraction[0]) / Number(fraction[1])
  } else {
    unit = split[0];
  }
  if (volumeOptions[split[1]]) {
    const converted = volumeOptions[split[1]]
    const cups = (unit * tspConversions[converted]) / tspConversions['cup'];
    return Number(servingSize) / Number(cups);
  } else {
    return undefined
  }
}

