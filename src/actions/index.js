import axios from 'axios'

const ROOT_URL = 'http://localhost:4000/api/v1'
// const ROOT_URL = 'https://plan-it-server.herokuapp.com/api/v1'

// const ROOT_URL = 'https://lab6-elin.herokuapp.com/api'
// const ROOT_URL = 'https://cs52-blog.herokuapp.com/api'
// const API_KEY = '?key=e_lin'

// keys for actiontypes
export const ActionTypes = {
  FETCH_TRIPS: 'FETCH_TRIPS',
  FETCH_TRIP: 'FETCH_TRIP',
  FETCH_FAVORITED_TRIPS: 'FETCH_FAVORITED_TRIPS',
  FETCH_PUBLISHED_TRIPS: 'FETCH_PUBLISHED_TRIPS',
  CREATE_TRIP: 'CREATE_TRIP',
  UPDATE_TRIP: 'UPDATE_TRIP',
  FAVORITE_TRIP: 'FAVORITE_TRIP', 
  UNFAVORITE_TRIP: 'UNFAVORITE_TRIP',
  TRIP_ERROR: 'TRIP_ERROR',

  FETCH_CARDS: 'FETCH_CARDS',
  FETCH_CARDS_ERROR: 'FETCH_CARDS_ERROR',
  CREATE_CARD: 'CREATE_CARD',
  CREATE_CARD_ERROR: 'CREATE_CARD_ERROR',
  DELETE_CARD: 'DELETE_CARD',
  DELETE_CARD_ERROR: 'DELETE_CARD_ERROR',
  UPDATE_CARD: 'UPDATE_CARD',
  UPDATE_CARD_ERROR: 'UPDATE_CARD_ERROR',

  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  CREATE_USER: 'CREATE_USER',
  CREATE_USER_ERROR: 'CREATE_USER_ERROR',

  FETCH_SUGGESTIONS: 'FETCH_SUGGESTIONS',
  FETCH_SUGGESTIONS_ERROR: 'FETCH_SUGGESTIONS_ERROR'
}

export function fetchTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips?user_id=${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIPS, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function fetchTrip(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips/${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_TRIP, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function createTrip(trip) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/trips`, trip).then((response) => {
      dispatch({ type: ActionTypes.CREATE_TRIP, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function updateTrip(trip_id, trip) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/trips/${trip_id}`, trip).then((response) => {
      dispatch({ type: ActionTypes.UPDATE_TRIP, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function fetchPublishedTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/trips?user_id=1`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_PUBLISHED_TRIPS, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function fetchCards(id, day=null) {
  return (dispatch) => {
    let query = `${ROOT_URL}/cards?trip_id=${id}`

    if (day) { query += `&day=${day}` }

    axios.get(query).then((response) => {
      dispatch({ type: ActionTypes.FETCH_CARDS, payload: response.data })
    }).catch((error) => {
      console.log(error)
      dispatch({ type: ActionTypes.FETCH_CARDS_ERROR, payload: error })
    })
  }
}

export function insertCard(cards, trip, day) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/cards`, cards).then((response) => {
      dispatch(fetchCards(trip, day))
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function updateCard(id, attributes, trip, day) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/cards/${id}`, attributes).then((response) => {
      dispatch(fetchCards(trip, day))
    }).catch((error) => {
      dispatch({ type: ActionTypes.UPDATE_CARD_ERROR, payload: error })
    })
  }
}

export function deleteCard(id, trip, day) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/cards/${id}`).then((response) => {
      dispatch(fetchCards(trip, day))
    }).catch((error) => {
      console.log(error)
      dispatch({ type: ActionTypes.DELETE_CARD_ERROR, payload: error })
    })
  }
}

export function fetchFavoritedTrips(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/favorited?user_id=${id}`).then((response) => {
      dispatch({ type: ActionTypes.FETCH_FAVORITED_TRIPS, payload: response.data });
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error });
    });
  };
}

export function favoriteTrip(trip, userId) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/favorited?user_id=${userId}`, trip).then((response) => {
      dispatch({ type: ActionTypes.FAVORITE_TRIP, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
    })
  }
}

export function unfavoriteTrip(tripId, userId) {
  console.log(`unfavorite ${tripId} ${userId}`)
    return (dispatch) => {
      axios.delete(`${ROOT_URL}/favorited?user_id=${userId}&trip_id=${tripId}`).then((response) => {
        dispatch({ type: ActionTypes.UNFAVORITE_TRIP, payload: response.data })
      }).catch((error) => {
        dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
      })
  }
}

export function createUser(user) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/users`, user).then((response) => {
        dispatch({ type: ActionTypes.CREATE_USER, payload: response.data });
      }).catch((error) => {
        dispatch({ type: ActionTypes.CREATE_USER_ERROR, payload: error });
      });
  };
}

export function createCard(cards) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/cards`, cards).then((response) => {
        dispatch({ type: ActionTypes.CREATE_CARD, payload: response.data });
      }).catch((error) => {
        dispatch({ type: ActionTypes.CREATE_CARD_ERROR, payload: error });
      });
  };
}

export function fetchSuggestions(lat, long, category=null) {
  return (dispatch) => {
    let query = `${ROOT_URL}/yelp?latitude=${lat}&longitude=${long}`

    if (category) { query += `&categories=${category}` }

    axios.get(query).then((response) => {
      dispatch({ type: ActionTypes.FETCH_SUGGESTIONS, payload: response.data })
    }).catch((error) => {
      dispatch({ type: ActionTypes.FETCH_SUGGESTIONS_ERROR, payload: error })
    })
  }
}
