import { ActionTypes } from '../actions';

const initialState = {
  user_id: null,
  error: null,
  email: null,
  fname: null,
  lname: null
};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_USER:
    console.log(initialState, action)
      return Object.assign({}, state, {
        user_id: action.payload,
      });
    case ActionTypes.CREATE_USER_ERROR:
    console.log(initialState, action)

      return Object.assign({}, state, {
        error: action.payload
      });
    default:
      return state;
  }
};

export default UsersReducer;
