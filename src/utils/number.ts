function getRandomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}
// has a {float}% chance of returning true
function randomBoolean(float: number) {
  return Math.random() < float;
}

export { getRandomNumber, randomBoolean };
