import { ActionTypes } from '../actions'
import _ from 'lodash'

const initialState = {
	all: [],
	card: {},
	queue_day_cards: [],
	queue_result: null,
	queue_cards_error: null,
	all_cards: [],
	error: null
};

const CardsReducer = (state = initialState, action) => {
	switch (action.type) {
		case ActionTypes.FETCH_DAY_QUEUE_CARDS:
			return Object.assign({}, state, {
				queue_day_cards: action.payload
			})
		case ActionTypes.CREATE_QUEUE_CARD:
			return Object.assign({}, state, {
				queue_result: action.payload
			})
		case ActionTypes.UPDATE_QUEUE_CARD:
			return Object.assing({}, state, {
				queue_result: action.payload
			})
		case ActionTypes.DELETE_QUEUE_CARD:
			return Object.assing({}, state, {
				queue_result: action.payload
			})
		case ActionTypes.QUEUE_CARDS_ERROR:
			return Object.assign({}, state, {
				queue_cards_error: action.payload,
			})
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
		case ActionTypes.FETCH_ALL_CARDS:
			return Object.assign({}, state, {
				all_cards: action.payload
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
    	case ActionTypes.DELETE_CARD_LIVE:
			return Object.assign({}, state, {
				all: _.filter(state.all, (card) => {
					return card.id !== action.payload
				})
			})
		case ActionTypes.START_CREATING:
			return Object.assign({}, state, {
				creatingCard: true,
			});
		case ActionTypes.CREATE_CARD:
			return Object.assign({}, state, {
				creatingCard: false,
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
				fetchingSuggestions: true,
			});
		case ActionTypes.RECEIVE_SUGGESTIONS:
			return Object.assign({}, state, {
				fetchingSuggestions: false,
				suggestions: action.payload,
			});
		case ActionTypes.FETCH_SUGGESTIONS_ERROR:
			return Object.assign({}, state, {
				fetchingSuggestions: false,
				error: action.payload,
			});
		case ActionTypes.CLEAR_SUGGESTIONS:
			return Object.assign({}, state, {
				suggestions: []
			})
		default:
			return state;
	}
};

export default CardsReducer;

