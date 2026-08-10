import { produce } from 'immer';
import { actionTypes } from '@store/actions/identity';

const ACTION_HANDLERS = {
  [actionTypes.RESOLVED]: produce((draft, action) => {
    draft.me = action.payload;
  }),
  // @generator reducer:type:action
};

const initialState = {
  me: null,
};

const identity = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default identity;
