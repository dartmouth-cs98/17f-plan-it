import { ActionTypes } from '../actions';

const initialState = {
  user_id: null,
  error: null,
  email: null,
  fname: null,
  lname: null,
  live_users: []
};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_USER:
      return Object.assign({}, state, {
        user_id: action.payload.user_id,
        fname: action.payload.fname,
        lname: action.payload.lname,
        email: action.payload.email,
      });

    case ActionTypes.CREATE_USER_ERROR:
      return Object.assign({}, state, {
        error: action.payload
      });

    case ActionTypes.UPDATE_USERS_LIVE:
      const new_user = {}
      new_user["email"] = action.payload.email;
      new_user["fname"] = action.payload.fname;
      new_user["lname"] = action.payload.lname;
      new_user["tdd"] = Date.now();

      let flag = true;
      for (const user of state.live_users) {
        if (user.email.localeCompare(new_user.email) == 0) {
          flag = false;
          user.tdd = Date.now();
        }
      }
      if (flag) {
        const live_users = [new_user]
        for (const user of state.live_users) {
          if (user.email.localeCompare(new_user.email) != 0) live_users.push(user)
        }
        return Object.assign({}, state, {
          live_users: live_users
        })
      }

      return state;

    case ActionTypes.DELETE_USER_LIVE:
      const dead_user = action.payload;
      const live_users = [];
      for (const user of state.live_users) {
        if (user.email.localeCompare(dead_user.email) != 0) {
          live_users.push(user)
        }
      }
      return Object.assign({}, state, {
        live_users: live_users
      })

    default:
      return state;
  }
};

export default UsersReducer;
