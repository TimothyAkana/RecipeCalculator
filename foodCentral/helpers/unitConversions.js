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
  // If no householdText field filled in, generating conversion not possible
  if (householdText === undefined) {
    return undefined;
  }

  // Start parsing the text field, split[0] = quantity, split[1] = measurement
  let split = householdText.split(' ');

  // Check if quantity is a fraction, normalize to a decimal
  let quantity;
  if (split[0].indexOf('/') > -1) {
    let fraction = split[0].split('/');
    quantity = Number(fraction[0]) / Number(fraction[1])
  } else {
    quantity = split[0];
  }

  // If the the measurement option is in list of valid volumeOptions, return the conversion rate
  if (volumeOptions[split[1].toLowerCase()]) {
    const converted = volumeOptions[split[1].toLowerCase()];
    const cups = (quantity * tspConversions[converted]) / tspConversions['cup'];
    return Number(servingSize) / Number(cups);
  } else {
  // If measurement option is not valid, return undefined since conversion not possible
    return undefined
  }
}

