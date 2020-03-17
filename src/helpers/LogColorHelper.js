import chalk from 'chalk';

// Helper to log colors in terminal
const Color = {
  error: chalk.bold.red,
  info: chalk.bold.green,
  warning: chalk.bold.yellowBright,
};

// Taking the info parameter of Winston
// And transform it by cases to uppercase with the right color
const infoColor = (info) => {
  if (info.level === 'info') {
    return Color.info(info.level.toUpperCase());
  }

  if (info.level === 'error') {
    return Color.error(info.level.toUpperCase());
  }

  return Color.warning(info.level.toUpperCase());
};

export default infoColor;
