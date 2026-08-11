import { produce } from 'immer';
import { actionTypes } from '@store/actions/people';

const ACTION_HANDLERS = {
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
  }),
  [actionTypes.ADD_FAILURE]: produce((draft, action) => {
    draft.adding = false;
    draft.error = action.payload;
  }),
  [actionTypes.RENAME_REQUEST]: produce((draft) => {
    draft.renaming = true;
    draft.renameError = null;
  }),
  [actionTypes.RENAME_SUCCESS]: produce((draft) => {
    draft.renaming = false;
    draft.renamedToken += 1;
  }),
  [actionTypes.RENAME_FAILURE]: produce((draft, action) => {
    draft.renaming = false;
    draft.renameError = action.payload;
  }),
  [actionTypes.DELETE_REQUEST]: produce((draft) => {
    draft.deleting = true;
    draft.deleteError = null;
  }),
  [actionTypes.DELETE_SUCCESS]: produce((draft) => {
    draft.deleting = false;
  }),
  [actionTypes.DELETE_FAILURE]: produce((draft, action) => {
    draft.deleting = false;
    draft.deleteError = action.payload;
  }),
  [actionTypes.CLEAR_ERROR]: produce((draft) => {
    draft.error = null;
    draft.renameError = null;
    draft.deleteError = null;
  }),
  // @generator reducer:type:action
};

const initialState = {
  list: [],
  loading: true,
  adding: false,
  error: null,
  renaming: false,
  renameError: null,
  renamedToken: 0,
  deleting: false,
  deleteError: null,
};

const people = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default people;
