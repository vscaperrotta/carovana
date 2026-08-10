
const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

/**
 * Creates an action object with a given type and payload.
 *
 * @function createAction
 * @returns {object} - An action object with the given type and payload.
 */
export const createAction = (type, payload = {}) => ({ type, payload });

/**
 * A class for creating request action creators.
 *
 * @class MakeRequest
 */
export class MakeRequest {
  constructor(base, action) {
    this.request = request => createAction(`@@${base}/${action}_request`, { request });
    this.success = (response, payload) => createAction(`@@${base}/${action}_success`, { response, payload });
    this.failure = (error, payload) => createAction(`@@${base}/${action}_failure`, { error, payload });
  }
}

/**
 * Creates an object containing request type constants for a given base and action.
 *
 * @function createRequestTypes
 * @returns {object} - An object containing the request type constants.
 */
export const createRequestTypes = (base, action) =>
  [`${action}_${REQUEST}`, `${action}_${SUCCESS}`, `${action}_${FAILURE}`].reduce((acc, type) => {
    acc[type] = `${base}/${type.toLowerCase()}`;
    return acc;
  }, {});
