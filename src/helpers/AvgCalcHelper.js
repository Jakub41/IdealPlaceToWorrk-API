import Logger from '../loaders/logger';

// To get the average of the two numbers
const calcAverage = async (number1, number2) => {
  if (number1 === 0) return number2;
  if (number2 === 0) return number1;

  const res = (number1 + number2) / 2;

  const round = Math.floor(res * 100) / 100;
  Logger.info('AVG Calc', round);

  return round;
};

export default calcAverage;
