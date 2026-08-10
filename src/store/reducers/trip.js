import { produce } from 'immer';
import { actionTypes } from '@store/actions/trip';

const ACTION_HANDLERS = {
  [actionTypes.RECEIVED]: produce((draft, action) => {
    draft.data = action.payload;
    draft.notFound = action.payload === null;
    draft.loading = false;
  }),
  [actionTypes.RESET]: produce((draft) => {
    draft.data = null;
    draft.notFound = false;
    draft.loading = true;
  }),
  // @generator reducer:type:action
};

const initialState = {
  data: null,
  loading: true,
  notFound: false,
};

const trip = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default trip;
