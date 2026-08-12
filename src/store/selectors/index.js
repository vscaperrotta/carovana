// Plain state selectors. Keep components decoupled from the store shape.

export const selectTrips = (state) => state.trips.list;
export const selectTripsLoading = (state) => state.trips.loading;
export const selectCreatedTripId = (state) => state.trips.createdId;

export const selectTripRenaming = (state) => state.trips.renaming;
export const selectTripRenameError = (state) => state.trips.renameError;
export const selectTripRenamedToken = (state) => state.trips.renamedToken;

export const selectTripDeleting = (state) => state.trips.deleting;
export const selectTripDeleteError = (state) => state.trips.deleteError;
export const selectTripDeletedToken = (state) => state.trips.deletedToken;
export const selectTripDeletedId = (state) => state.trips.deletedId;

export const selectTrip = (state) => state.trip.data;
export const selectTripLoading = (state) => state.trip.loading;
export const selectTripNotFound = (state) => state.trip.notFound;

export const selectPeople = (state) => state.people.list;
export const selectPeopleLoading = (state) => state.people.loading;
export const selectPersonDeleteError = (state) => state.people.deleteError;

export const selectPlaces = (state) => state.places.list;
export const selectPlacesSavedToken = (state) => state.places.savedToken;
export const selectPlaceEditing = (state) => state.places.editing;
export const selectPlaceEditError = (state) => state.places.editError;
export const selectPlaceEditedToken = (state) => state.places.editedToken;

export const selectIdentityProfile = (state) => state.identity.profile;
export const selectIdentityLoading = (state) => state.identity.profileLoading;
export const selectDeviceProfiles = (state) => state.identity.profiles;
export const selectDeviceProfilesLoading = (state) => state.identity.profilesLoading;

// "Am I in this trip?" — derived, not stored: matches the session identity's
// name against this trip's current people list. No match means you haven't
// joined (or your name changed) — never an error state to persist.
export const selectMe = (state) => {
  const name = state.identity.profile?.name;
  if (!name) return null;
  const nameLower = name.trim().toLowerCase();
  return state.people.list.find((person) => person.name.trim().toLowerCase() === nameLower) ?? null;
};

export const selectAddressResults = (state) => state.geocode.results;
export const selectAddressSearching = (state) => state.geocode.searching;
export const selectReverseGeocode = (state) => state.geocode.reverse;

export const selectRoutes = (state) => state.routes.list;
export const selectRoutesAdding = (state) => state.routes.adding;
export const selectRoutesError = (state) => state.routes.error;
export const selectRoutesSavedToken = (state) => state.routes.savedToken;
export const selectOrsQuota = (state) => state.routes.orsQuota;

// @generator selector:method
