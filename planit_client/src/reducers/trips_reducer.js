import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  trip: {},
  error: null
};

const TripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_TRIPS:
      return Object.assign({}, state, {
        all: action.payload,
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
        trip: action.payload,
      });
    case ActionTypes.CREATE_TRIP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      }); 
    default:
      return state;
  }
};

export default TripsReducer;
