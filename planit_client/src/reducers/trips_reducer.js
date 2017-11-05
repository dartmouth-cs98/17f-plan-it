import { ActionTypes } from '../actions';

const initialState = {
  userTrips: [],
  favoritedTrips: [],
  publishedTrips: [],
  trip: {},
  trip_id: null,
  error: null,
};

const TripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, {
        userTrips: action.payload,
      });
    case ActionTypes.FETCH_TRIPS_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, {
        trip: action.payload,
      });
    case ActionTypes.FETCH_TRIP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.UPDATE_TRIP:
      return Object.assign({}, state, {
        trip: action.payload,
      });
    case ActionTypes.UPDATE_TRIP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.CREATE_TRIP:
      return Object.assign({}, state, {
        trip_id: action.payload,
      });
    case ActionTypes.CREATE_TRIP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      }); 
    case ActionTypes.FETCH_FAVORITED_TRIPS:
      return Object.assign({}, state, {
        favoritedTrips: action.payload,
      }); 
    case ActionTypes.FETCH_FAVORITED_TRIPS_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      }); 
    case ActionTypes.FETCH_PUBLISHED_TRIPS:
      return Object.assign({}, state, {
        publishedTrips: action.payload,
      }); 
    case ActionTypes.FETCH_PUBLISHED_TRIPS_ERROR:
      return Object.assign({}, state, {
          error: action.payload,
        }); 
    default:
      return state;
  }
};

export default TripsReducer;
