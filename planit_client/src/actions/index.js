import axios from 'axios';

const ROOT_URL = 'http://localhost:4000/api/v1';

// const ROOT_URL = 'https://lab6-elin.herokuapp.com/api';
// const ROOT_URL = 'https://cs52-blog.herokuapp.com/api';
// const API_KEY = '?key=e_lin';

// keys for actiontypes
export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIPS_ERROR: 'FETCH_TRIPS_ERROR',
  FETCH_TRIP: 'FETCH_TRIP',
  FETCH_TRIP_ERROR: 'FETCH_TRIP_ERROR',
  FETCH_FAVORITED_TRIPS: 'FETCH_FAVORITED_TRIPS',
  FETCH_FAVORITED_TRIPS_ERROR: 'FETCH_FAVORITED_TRIPS_ERROR',
  FETCH_PUBLISHED_TRIPS: 'FETCH_PUBLISHED_TRIPS',
  FETCH_PUBLISHED_TRIPS_ERROR: 'FETCH_PUBLISHED_TRIPS_ERROR',
  CREATE_TRIP_ERROR: 'CREATE_TRIP_ERROR',
  UPDATE_TRIP: 'UPDATE_TRIP',
  UPDATE_TRIP_ERROR: 'UPDATE_TRIP_ERROR',
  CREATE_CARD: 'CREATE_CARD',
  CREATE_CARD_ERROR: 'CREATE_CARD_ERROR',
  DELETE_CARD: 'DELETE_CARD',
  DELETE_CARD_ERROR: 'DELETE_CARD_ERROR',
  UPDATE_CARD: 'UPDATE_CARD',
  UPDATE_CARD_ERROR: 'UPDATE_CARD_ERROR',
  CREATE_USER: 'CREATE_USER',
  CREATE_USER_ERROR: 'CREATE_USER_ERROR'
};

export function fetchTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips?user_id=${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIPS, payload: response.data });
    }).catch((error) => {
      console.log(error)
      dispatch({ type: ActionTypes.FETCH_TRIPS_ERROR, payload: error });
    });
  };
}

export function fetchTrip(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips/${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.FETCH_TRIP_ERROR, payload: error });
    });
  };
}

export function createTrip(trip) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/trips`, trip).then((response) => {
        dispatch({ type: ActionTypes.CREATE_TRIP, payload: response.data });
      }).catch((error) => {
        dispatch({ type: ActionTypes.CREATE_TRIP_ERROR, payload: error });
      });
  };
}

export function fetchPublishedTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PUBLISHED_TRIPS, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.FETCH_PUBLISHED_TRIPS_ERROR, payload: error });
    });
  };
}

export function fetchFavoritedTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/favorited?user_id=${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_FAVORITED_TRIPS, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.FETCH_FAVORITED_TRIPS_ERROR, payload: error });
    });
  };
}

export function createUser(user) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/users`, user).then((response) => {
        dispatch({ type: ActionTypes.CREATE_USER, payload: response.data });
      }).catch((error) => {
        dispatch({ type: ActionTypes.CREATE_USER_ERROR, payload: error });
      });
  };
}

