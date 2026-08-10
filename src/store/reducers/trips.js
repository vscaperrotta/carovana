import { produce } from 'immer';
import { actionTypes } from '@store/actions/trips';

const ACTION_HANDLERS = {
  [actionTypes.RECEIVED]: produce((draft, action) => {
    draft.list = action.payload;
    draft.loading = false;
  }),
  [actionTypes.CREATE_REQUEST]: produce((draft) => {
    draft.creating = true;
    draft.error = null;
  }),
  [actionTypes.CREATE_SUCCESS]: produce((draft, action) => {
    draft.creating = false;
    draft.createdId = action.payload;
  }),
  [actionTypes.CREATE_FAILURE]: produce((draft, action) => {
    draft.creating = false;
    draft.error = action.payload;
  }),
  [actionTypes.CLEAR_CREATED]: produce((draft) => {
    draft.createdId = null;
    draft.error = null;
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
  [actionTypes.DELETE_SUCCESS]: produce((draft, action) => {
    draft.deleting = false;
    draft.deletedToken += 1;
    draft.deletedId = action.payload;
  }),
  [actionTypes.DELETE_FAILURE]: produce((draft, action) => {
    draft.deleting = false;
    draft.deleteError = action.payload;
  }),
  [actionTypes.CLEAR_ERROR]: produce((draft) => {
    draft.renameError = null;
    draft.deleteError = null;
  }),
  // @generator reducer:type:action
};

const initialState = {
  list: [],
  loading: true,
  creating: false,
  createdId: null,
  error: null,
  renaming: false,
  renameError: null,
  renamedToken: 0,
  deleting: false,
  deleteError: null,
  // Bumped on each successful delete so open menus can react (close modal,
  // redirect if it's the trip currently being viewed) without awaiting the dispatch.
  deletedToken: 0,
  deletedId: null,
};

const trips = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default trips;
