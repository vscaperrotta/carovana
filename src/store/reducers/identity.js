import { produce } from 'immer';
import { actionTypes } from '@store/actions/identity';

const ACTION_HANDLERS = {
  [actionTypes.RESOLVED]: produce((draft, action) => {
    draft.profile = action.payload;
    draft.profileLoading = false;
  }),
  [actionTypes.PROFILES_RECEIVED]: produce((draft, action) => {
    draft.profiles = action.payload;
    draft.profilesLoading = false;
  }),
  // @generator reducer:type:action
};

const initialState = {
  profile: null,
  profileLoading: true,
  profiles: [],
  profilesLoading: true,
};

const identity = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default identity;
