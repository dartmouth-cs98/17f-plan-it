import { combineReducers } from 'redux'
import TripsReducer from './trips_reducer'
import CardsReducer from './cards_reducer'

const rootReducer = combineReducers({
	trips: TripsReducer,
	cards: CardsReducer,
});

export default rootReducer;
