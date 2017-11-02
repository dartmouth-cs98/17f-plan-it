import { ActionTypes } from '../actions';

const initialState = {
  all: [],
  card: {},
  error: null
};

const CardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_CARDS:
      return Object.assign({}, state, {
        all: action.payload,
      });
    case ActionTypes.FETCH_CARDS_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.FETCH_CARD:
      return Object.assign({}, state, {
        card: action.payload,
      });
    case ActionTypes.FETCH_CARD_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.UPDATE_CARD:
      return Object.assign({}, state, {
        card: action.payload,
      });
    case ActionTypes.UPDATE_CARD_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case ActionTypes.CREATE_CARD:
      return Object.assign({}, state, {
        card: action.payload,
      });
    case ActionTypes.CREATE_CARD_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      }); 
    default:
      return state;
  }
};

export default CardsReducer;

