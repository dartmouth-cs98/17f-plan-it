import { ActionTypes } from '../actions'
import _ from 'lodash'

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
		case ActionTypes.UPDATE_CARDS:
			return Object.assign({}, state, {
				all: action.payload,
			});
		case ActionTypes.UPDATE_CARDS_ERROR:
			return Object.assign({}, state, {
				error: action.payload,
			});
		case ActionTypes.UPDATE_CARDS_LIVE:
			return Object.assign({}, state, {
				all: action.payload,
			});
		case ActionTypes.CREATE_CARD:
			return Object.assign({}, state, {
				card: action.payload,
			});
		case ActionTypes.CREATE_CARD_ERROR:
			return Object.assign({}, state, {
				error: action.payload,
			});
		case ActionTypes.DELETE_CARD:
			return Object.assign({}, state, {
				all: _.filter(state.all, (card) => {
					return card.id !== action.payload
				})
			})
		case ActionTypes.FETCH_SUGGESTIONS:
			return Object.assign({}, state, {
				suggestions: action.payload,
			});
		case ActionTypes.FETCH_SUGGESTIONS_ERROR:
			return Object.assign({}, state, {
				error: action.payload,
			});
		default:
			return state;
	}
};

export default CardsReducer;

