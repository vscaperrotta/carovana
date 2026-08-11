import { produce } from 'immer';
import { actionTypes } from '@store/actions/places';

const ACTION_HANDLERS = {
  [actionTypes.SUBSCRIBE]: produce((draft) => {
    draft.list = [];
    draft.loading = true;
  }),
  [actionTypes.RECEIVED]: produce((draft, action) => {
    draft.list = action.payload;
    draft.loading = false;
  }),
  [actionTypes.ADD_REQUEST]: produce((draft) => {
    draft.adding = true;
    draft.error = null;
  }),
  [actionTypes.ADD_SUCCESS]: produce((draft) => {
    draft.adding = false;
    draft.savedToken += 1;
  }),
  [actionTypes.ADD_FAILURE]: produce((draft, action) => {
    draft.adding = false;
    draft.error = action.payload;
  }),
  [actionTypes.EDIT_REQUEST]: produce((draft) => {
    draft.editing = true;
    draft.editError = null;
  }),
  [actionTypes.EDIT_SUCCESS]: produce((draft) => {
    draft.editing = false;
    draft.editedToken += 1;
  }),
  [actionTypes.EDIT_FAILURE]: produce((draft, action) => {
    draft.editing = false;
    draft.editError = action.payload;
  }),
  [actionTypes.CLEAR_ERROR]: produce((draft) => {
    draft.error = null;
    draft.editError = null;
  }),
  // @generator reducer:type:action
};

const initialState = {
  list: [],
  loading: true,
  adding: false,
  // Bumped on each successful add so a form can react (reset + close)
  // without awaiting the dispatch.
  savedToken: 0,
  error: null,
  editing: false,
  editError: null,
  editedToken: 0,
};

const places = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default places;
