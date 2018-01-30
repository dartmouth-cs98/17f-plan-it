import { ActionTypes } from '../actions';

const initialState = {
  userTrips: [],
  favoritedTrips: [],
  publishedDateTrips: [],
  publishedTrendingTrips: [],
  publishedPopularTrips: [],
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
    case ActionTypes.TRIP_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.FETCH_TRIP:
      return Object.assign({}, state, {
        trip: action.payload,
      });
    case ActionTypes.UPDATE_TRIP:
      return Object.assign({}, state, {
        trip: action.payload,
      });
    case ActionTypes.CREATE_TRIP:
      return Object.assign({}, state, {
        trip_id: action.payload,
      });
    case ActionTypes.FETCH_FAVORITED_TRIPS:
      return Object.assign({}, state, {
        favoritedTrips: action.payload,
      }); 
    case ActionTypes.FETCH_PUBLISH_DATE:
      return Object.assign({}, state, {
        publishedDateTrips: action.payload,
      }); 
    case ActionTypes.FETCH_TRENDING_TRIPS:
      return Object.assign({}, state, {
        publishedTrendingTrips: action.payload,
      }); 
    case ActionTypes.FETCH_POPULAR_TRIPS:
      return Object.assign({}, state, {
        publishedPopularTrips: action.payload,
      });
    case ActionTypes.FETCH_PUBLISHED_TRIPS:
      return Object.assign({}, state, {
        publishedTrips: action.payload,
      }); 
    case ActionTypes.FAVORITE_TRIP:
      return Object.assign({}, state, {
          error: null,
        }); 
    case ActionTypes.UNFAVORITE_TRIP:
      return Object.assign({}, state, {
          error: null,
        }); 
    default:
      return state;
  }
};

export default TripsReducer;
