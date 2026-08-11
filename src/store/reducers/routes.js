import { produce } from 'immer';
import { actionTypes } from '@store/actions/routes';

const ACTION_HANDLERS = {
  [actionTypes.RECEIVED]: produce((draft, action) => {
    draft.list = action.payload;
    draft.loading = false;
  }),
  [actionTypes.ADD_REQUEST]: produce((draft) => {
    draft.adding = true;
    draft.error = null;
  }),
  [actionTypes.ADD_SUCCESS]: produce((draft, action) => {
    draft.adding = false;
    draft.savedToken += 1;
    if (action.payload) draft.orsQuota = action.payload;
  }),
  [actionTypes.ADD_FAILURE]: produce((draft, action) => {
    draft.adding = false;
    draft.error = action.payload;
  }),
  [actionTypes.CLEAR_ERROR]: produce((draft) => {
    draft.error = null;
  }),
};

const initialState = {
  list: [],
  loading: true,
  adding: false,
  savedToken: 0,
  error: null,
  orsQuota: { remaining: null, limit: null },
};

const routes = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default routes;
