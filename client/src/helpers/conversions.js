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
  if (gramConversions[measurement]) {
    let convertedQuantity = quantity * gramConversions[measurement];
    let desiredMeasurement = 'gram';
  } else {
    let convertedQuantity = quantity * tspConversions[measurement];
    let desiredMeasurement = 'teaspoon';
  }
  return {quantity: convertedQuantity, measurement: desiredMeasurement};
};

module.exports.makeReadable = (quantity, measurement, desiredMeasurement) => {
  let convertedQuantity = gramConversions[desiredMeasurement]
    ? quantity / gramConversions[desiredMeasurement]
    : quantity / tspConversions[desiredMeasurement];
  return {quantity: convertedQuantity, measurement: desiredMeasurement};
};
