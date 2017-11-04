import { ActionTypes } from '../actions';

const initialState = {
  user_id: {},
  error: null,

};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_USER:
      return Object.assign({}, state, {
        user_id: action.payload,
      });
    case ActionTypes.CREATE_USER_ERROR:
      return Object.assign({}, state, {
        error: action.payload
      });
    default:
      return state;
  }
};

export default UsersReducer;
