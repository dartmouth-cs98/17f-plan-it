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
  switch (action.type) {
    case ActionTypes.CREATE_USER:
      return Object.assign({}, state, {
        user_id: action.payload,
      });
    case ActionTypes.CREATE_USER_ERROR:
      return Object.assign({}, state, {
        error: action.payload
      });
    case ActionTypes.UPDATE_USERS_LIVE:
      const key = action.payload;
      const old_users = state.live_users;
      const live_users = Object.assign({}, old_users, {
        key: Date.now()
      })

      return Object.assign({}, state, {
        live_users: live_users
      });

    default:
      return state;
  }
};

export default UsersReducer;
