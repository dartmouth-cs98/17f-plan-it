import { ActionTypes } from '../actions'

//permission to view a trip
const initialState = {
  permission: false,
}

const PermissionReducer = (state=initialState, action) => {
  switch(action.type) {
    case ActionTypes.CHECK_EDIT_PERMISSION:
      console.log("in the reducer", action)
      return Object.assign({}, state, {
        permission: action.payload
      })
    default:
      return state;
  }
}

export default PermissionReducer
