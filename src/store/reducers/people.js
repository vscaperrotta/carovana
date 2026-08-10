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
  [actionTypes.CLEAR_ERROR]: produce((draft) => {
    draft.error = null;
  }),
  // @generator reducer:type:action
};

const initialState = {
  list: [],
  loading: true,
  adding: false,
  error: null,
};

const people = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default people;
