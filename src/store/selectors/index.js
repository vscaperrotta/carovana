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

export const selectPlaces = (state) => state.places.list;
export const selectPlacesSavedToken = (state) => state.places.savedToken;
export const selectPlaceEditing = (state) => state.places.editing;
export const selectPlaceEditError = (state) => state.places.editError;
export const selectPlaceEditedToken = (state) => state.places.editedToken;

export const selectMe = (state) => state.identity.me;

export const selectAddressResults = (state) => state.geocode.results;
export const selectAddressSearching = (state) => state.geocode.searching;
export const selectReverseGeocode = (state) => state.geocode.reverse;

export const selectRoutes = (state) => state.routes.list;
export const selectRoutesAdding = (state) => state.routes.adding;
export const selectRoutesError = (state) => state.routes.error;
export const selectRoutesSavedToken = (state) => state.routes.savedToken;
export const selectOrsQuota = (state) => state.routes.orsQuota;

// @generator selector:method
