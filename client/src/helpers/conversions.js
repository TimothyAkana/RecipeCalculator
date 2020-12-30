const gramConversions = {
  pound: 453.592,
  ounce: 28.34952,
  kilogram: 1000,
  gram: 1,
}

const tspConversions = {
  gallon: 768,
  liter: 202.884,
  quart: 192,
  pint: 96,
  cup: 48,
  fluidOunce: 6,
  tablespoon: 3,
  teaspoon: 1,
}

module.exports.simplifyIngredient = (quantity, measurement) => {
  let convertedQuantity;
  let desiredMeasurement;
  if (gramConversions[measurement]) {
    convertedQuantity = quantity * gramConversions[measurement];
    desiredMeasurement = 'gram';
  } else {
    convertedQuantity = quantity * tspConversions[measurement];
    desiredMeasurement = 'teaspoon';
  }
  return {quantity: convertedQuantity, measurement: desiredMeasurement};
};

module.exports.makeReadable = (quantity, measurement, desiredMeasurement) => {
  let convertedQuantity = gramConversions[desiredMeasurement]
    ? quantity / gramConversions[desiredMeasurement]
    : quantity / tspConversions[desiredMeasurement];
  return {quantity: convertedQuantity, measurement: desiredMeasurement};
};

module.exports.gramsPerCup = (volumeQuantity, volumeMeasurement, weightQuantity, weightMeasurement) => {
  let grams = weightQuantity * gramConversions[weightMeasurement];
  let cups = (volumeQuantity * tspConversions[volumeMeasurement]) / tspConversions['cup'];
  return grams/cups;
}

module.exports.costPerGram = (quantity, measurement, cost, gramsPerCup) => {
  if (gramConversions[measurement]) {
    return cost / (quantity * gramConversions[measurement]);
  } else {
    let cups = (quantity * tspConversions[measurement]) / tspConversions['cup'];
    return cost / (cups * gramsPerCup);
  }
}

module.exports.totalCost = (quantity, measurement, costPerGram, gramsPerCup) => {
  if (gramConversions[measurement]) {
    return costPerGram * quantity * gramConversions[measurement];
  } else {
    let cups = (quantity * tspConversions[measurement]) / tspConversions['cup'];
    return costPerGram * gramsPerCup * cups;
  }
}
