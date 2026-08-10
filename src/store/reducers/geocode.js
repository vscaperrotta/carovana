import { produce } from 'immer';
import { actionTypes } from '@store/actions/geocode';

const ACTION_HANDLERS = {
  [actionTypes.SEARCH_REQUEST]: produce((draft) => {
    draft.searching = true;
  }),
  [actionTypes.SEARCH_SUCCESS]: produce((draft, action) => {
    draft.searching = false;
    draft.results = action.payload;
  }),
  [actionTypes.SEARCH_CLEAR]: produce((draft) => {
    draft.searching = false;
    draft.results = [];
  }),
  [actionTypes.REVERSE_SUCCESS]: produce((draft, action) => {
    draft.reverse = action.payload;
  }),
  // @generator reducer:type:action
};

const initialState = {
  results: [],
  searching: false,
  // { lat, lng, address } for the last reverse-geocoded map pick
  reverse: null,
};

const geocode = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default geocode;
