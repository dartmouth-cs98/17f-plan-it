import { combineReducers } from 'redux'
import TripsReducer from './trips_reducer'
import CardsReducer from './cards_reducer'
import UsersReducer from './users_reducer'

const rootReducer = combineReducers({
	trips: TripsReducer,
	cards: CardsReducer,
	users: UsersReducer
});

export default rootReducer;
