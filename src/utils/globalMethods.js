
/**  @function
 * * Handling the null case and set to safe
 *
 * @name nullSafe
 * @param {function} func
 * @param {*} fallbackValue
 * @returns {*} the value to set safe the method
 */
export const nullSafe = (func, fallbackValue) => {
  try {
    const value = func();
    return value === null || value === undefined ? fallbackValue : value;
  } catch {
    return fallbackValue;
  }
};

/**
 * Generates a unique identifier by combining two random numbers.
 *
 * @function generateId
 * @returns {string} - A string in the format "XXXX-XXXX".
 */
export function generateId() {
  return `${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000)}`;
}
