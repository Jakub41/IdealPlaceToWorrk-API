import passwordValidator from 'password-validator';

// Create a schema
// eslint-disable-next-line new-cap
const isValidPassword = new passwordValidator();

// Add properties to it
isValidPassword
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Blacklist these values

export default isValidPassword;
