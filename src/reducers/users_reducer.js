import { ActionTypes } from '../actions';

const initialState = {
  user_id: null,
  error: null,
  email: null,
  fname: null,
  lname: null,
  live_users: {}
};

const UsersReducer = (state = initialState, action) => {
  console.log("this is state", state)
  switch (action.type) {
    case ActionTypes.CREATE_USER:
    console.log(initialState, action)
      return Object.assign({}, state, {
        user_id: action.payload.user_id,
        fname: action.payload.fname,
        lname: action.payload.lname,
        email: action.payload.email,
      });
    case ActionTypes.CREATE_USER_ERROR:
    console.log(initialState, action)

      return Object.assign({}, state, {
        error: action.payload
      });
    case ActionTypes.UPDATE_USERS_LIVE:
      const key = action.payload.email;
      const new_users = {}
      new_users[key] = Date.now()
      const live_users = Object.assign({}, state.live_users, new_users)

      return Object.assign({}, state, {
        live_users: live_users
      });

    default:
      return state;
  }
};

export default UsersReducer;
