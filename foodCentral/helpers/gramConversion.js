module.exports = (foodPortionData) => {
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
  return 0;
}