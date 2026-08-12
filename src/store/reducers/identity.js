import { produce } from 'immer';
import { actionTypes } from '@store/actions/identity';

const ACTION_HANDLERS = {
  [actionTypes.RESOLVED]: produce((draft, action) => {
    draft.me = action.payload;
  }),
  [actionTypes.LOAD_DEVICE_PROFILES]: produce((draft) => {
    draft.deviceProfilesLoading = true;
  }),
  [actionTypes.DEVICE_PROFILES_RECEIVED]: produce((draft, action) => {
    draft.deviceProfiles = action.payload;
    draft.deviceProfilesLoading = false;
  }),
  [actionTypes.SESSION_CONFIRMED]: produce((draft) => {
    draft.confirmedToken += 1;
  }),
  // @generator reducer:type:action
};

const initialState = {
  me: null,
  deviceProfiles: [],
  // Starts true: Trip always dispatches loadDeviceProfiles on mount, so
  // "not loading" should only ever mean "checked, here's the result" —
  // never the pre-dispatch gap, which IdentityModal would otherwise read
  // as "no device profile" and flash its picker open needlessly.
  deviceProfilesLoading: true,
  // Bumped whenever an identity gets confirmed (claim/add/"still you") so
  // the modal can react (close) without depending on meIsValid/session
  // booleans that may already be true before the action — see selectors.
  confirmedToken: 0,
};

const identity = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default identity;
