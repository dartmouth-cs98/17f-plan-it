import axios from 'axios'
import _ from 'lodash'

export const ROOT_URL = 'http://localhost:4000/api/v2'
// export const ROOT_URL = 'https://plan-it-server.herokuapp.com/api/v1'

// keys for actiontypes
export const ActionTypes = {
	FETCH_TRIPS: 'FETCH_TRIPS',
	FETCH_TRIP: 'FETCH_TRIP',
	FETCH_FAVORITED_TRIPS: 'FETCH_FAVORITED_TRIPS',
	FETCH_PUBLISH_DATE: 'FETCH_PUBLISH_DATE',
	FETCH_POPULAR_TRIPS: 'FETCH_POPULAR_TRIPS',
	FETCH_TRENDING_TRIPS: 'FETCH_TRENDING_TRIPS',
	FETCH_PUBLISHED_TRIPS: 'FETCH_PUBLISHED_TRIPS',
	FETCH_RECENTLY_VIEWED: 'FETCH_RECENTLY_VIEWED',
	CREATE_TRIP: 'CREATE_TRIP',
	UPDATE_TRIP: 'UPDATE_TRIP',
	FAVORITE_TRIP: 'FAVORITE_TRIP',
	UNFAVORITE_TRIP: 'UNFAVORITE_TRIP',
	RESET_TRIP_ID: 'RESET_TRIP_ID',
	VIEW_TRIP: 'VIEW_TRIP',
	TRIP_ERROR: 'TRIP_ERROR',

	FETCH_CARDS: 'FETCH_CARDS',
	FETCH_ALL_CARDS: 'FETCH_ALL_CARDS',
	FETCH_CARDS_ERROR: 'FETCH_CARDS_ERROR',
	START_CREATING: 'START_CREATING',
	CREATE_CARD: 'CREATE_CARD',
	CREATE_CARD_ERROR: 'CREATE_CARD_ERROR',
	DELETE_CARD: 'DELETE_CARD',
	DELETE_CARD_ERROR: 'DELETE_CARD_ERROR',
	UPDATE_CARD: 'UPDATE_CARD',
	UPDATE_CARD_ERROR: 'UPDATE_CARD_ERROR',
	UPDATE_CARDS: 'UPDATE_CARDS',
	UPDATE_CARDS_ERROR: 'UPDATE_CARDS_ERROR',

	FETCH_DAY_QUEUE_CARDS: 'FETCH_DAY_QUEUE_CARDS',
	CREATE_QUEUE_CARD: 'CREATE_QUEUE_CARD',
	UPDATE_QUEUE_CARD: 'UPDATE_QUEUE_CARD',
	DELETE_QUEUE_CARD: 'DELETE_QUEUE_CARD',
	QUEUE_CARDS_ERROR: 'QUEUE_CARDS_ERROR',

	UPDATE_CARDS_LIVE: 'UPDATE_CARDS_LIVE',
	UPDATE_USERS_LIVE: 'UPDATE_USERS_LIVE',
	DELETE_CARD_LIVE: 'DELETE_CARD_LIVE',

	AUTH_USER: 'AUTH_USER',
	DEAUTH_USER: 'DEAUTH_USER',
	AUTH_ERROR: 'AUTH_ERROR',
	CREATE_USER: 'CREATE_USER',
	CREATE_USER_ERROR: 'CREATE_USER_ERROR',

	FETCH_SUGGESTIONS: 'FETCH_SUGGESTIONS',
	RECEIVE_SUGGESTIONS: 'RECEIVE_SUGGESTIONS',
	FETCH_SUGGESTIONS_ERROR: 'FETCH_SUGGESTIONS_ERROR',
	CLEAR_SUGGESTIONS: 'CLEAR_SUGGESTIONS',

  CHECK_EDIT_PERMISSION: 'CHECK_EDIT_PERMISSION'
}

export function resetTripId(id) {
	return { type: ActionTypes.RESET_TRIP_ID, payload: null}
}

export function viewTrip(trip) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/viewed`, trip).then((response) => {
			dispatch({ type: ActionTypes.VIEW_TRIP, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
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

export function fetchPublishDateTrips() {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/published?order=publish_date`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_PUBLISH_DATE, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function fetchPopularTrips() {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/published?order=popular`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_POPULAR_TRIPS, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function fetchTrendingTrips() {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/published?order=trending`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_TRENDING_TRIPS, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function fetchRecentlyViewedTrips(user_id) {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/published?order=user_recent&user_id=${user_id}`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_RECENTLY_VIEWED, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function fetchPublishedTrips() {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/published`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_PUBLISHED_TRIPS, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function fetchCards(id, day=null) {
	return (dispatch) => {
		let query = `${ROOT_URL}/cards/itinerary?trip_id=${id}`
		if (day) { query += `&day=${day}` }
		axios.get(query).then((response) => {
			dispatch({ type: ActionTypes.FETCH_CARDS, payload: response.data })
		}).catch((error) => {
			console.log(error)
			dispatch({ type: ActionTypes.FETCH_CARDS_ERROR, payload: error })
		})
	}
}

export function fetchDay(id, day) {
	return (dispatch) => {
		let query = `${ROOT_URL}/cards/itinerary?trip_id=${id}&day=${day}`
		axios.get(query).then((response) => {
			dispatch({ type: ActionTypes.FETCH_CARDS, payload: response.data })

			// get the new city and fetch suggestions from that city
			const city = _.find(response.data, (card) => {
				return card.type === 'city'
			})

			if (!_.isNil(city)) {
				dispatch(fetchSuggestions(city.lat, city.long, id))
			}
		}).catch((error) => {
			console.log(error)
			dispatch({ type: ActionTypes.FETCH_CARDS_ERROR, payload: error })
		})
	}
}

export function fetchAllCards(id) {
	return (dispatch) => {
		let query = `${ROOT_URL}/cards/itinerary?trip_id=${id}`
		axios.get(query).then((response) => {
			dispatch({ type: ActionTypes.FETCH_ALL_CARDS, payload: response.data })
		}).catch((error) => {
			console.log(error)
			dispatch({ type: ActionTypes.FETCH_CARDS_ERROR, payload: error })
		})
	}
}


export function insertCard(cards, trip, day) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/cards/itinerary`, cards).then((response) => {
			dispatch(fetchCards(trip, day))
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function updateCard(id, attributes, trip, day) {
	return (dispatch) => {
		axios.put(`${ROOT_URL}/cards/itinerary/${id}`, attributes).then((response) => {
			dispatch(fetchCards(trip, day))
		}).catch((error) => {
			dispatch({ type: ActionTypes.UPDATE_CARD_ERROR, payload: error })
		})
	}
}

export function updateCards(cards, trip, day) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/cards/itinerary?trip_id=${trip}`, Array.from(cards)).then((response) => {
			console.log("this is reposen data", response.data)
			dispatch({ type: ActionTypes.UPDATE_CARDS, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.UPDATE_CARDS_ERROR, payload: error })
		})
	}
}

export function updateCardsLive(cards) {
	return (dispatch) => {
		dispatch({ type: ActionTypes.UPDATE_CARDS_LIVE, payload: cards})
	}
}

export function deleteCardLive(card_id) {
	return (dispatch) => {
		dispatch({ type: ActionTypes.DELETE_CARD_LIVE, payload: card_id})
	}
}

export function updateUsersLive(users) {
	return (dispatch) => {
		dispatch({ type: ActionTypes.UPDATE_USERS_LIVE, payload: users})
	}
}

export function deleteUserLive(user) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.DELETE_USER_LIVE, payload: user})
  }
}


export function deleteCard(id, trip, day) {
	return (dispatch) => {
		axios.delete(`${ROOT_URL}/cards/itinerary/${id}`).then((response) => {
			dispatch({ type: ActionTypes.DELETE_CARD, payload: id })
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

export function favoriteTrip(trip) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/favorited?`, trip).then((response) => {
			dispatch({ type: ActionTypes.FAVORITE_TRIP, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
		})
	}
}

export function unfavoriteTrip(tripId, userId) {
		return (dispatch) => {
			axios.delete(`${ROOT_URL}/favorited?user_id=${userId}&trip_id=${tripId}`).then((response) => {
				dispatch({ type: ActionTypes.UNFAVORITE_TRIP, payload: response.data })
			}).catch((error) => {
				dispatch({ type: ActionTypes.TRIP_ERROR, payload: error })
			})
	}
}

export function authUser(is_auth) {
  return (dispatch) => {
    dispatch({ type: ActionTypes.AUTH_USER, payload: is_auth})
  }
}
export function createUser(user) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/users`, user).then((response) => {
				dispatch({ type: ActionTypes.CREATE_USER, payload: {user_id: response.data, fname: user.fname, lname: user.lname, email: user.email} });
			}).catch((error) => {
				dispatch({ type: ActionTypes.CREATE_USER_ERROR, payload: error });
			});
	};
}

export function createCard(cards) {
	return (dispatch) => {
		dispatch({ type: ActionTypes.START_CREATING })

		axios.post(`${ROOT_URL}/cards/itinerary`, cards).then((response) => {
				dispatch({ type: ActionTypes.CREATE_CARD, payload: response.data })

				// get the cards for the first day of the trip
				const city = response.data[0]

				if (!_.isNil(city)) {
					dispatch(fetchDay(city.trip_id, 1))
				}
			}).catch((error) => {
				dispatch({ type: ActionTypes.CREATE_CARD_ERROR, payload: error })
			});
	};
}

export function fetchDayQueueCards(id, day) {
	return (dispatch) => {
		axios.get(`${ROOT_URL}/cards/queue?trip_id=${id}&day=${day}`).then((response) => {
			dispatch({ type: ActionTypes.FETCH_DAY_QUEUE_CARDS, payload: response.data })
		}).catch((error) => {
			console.log(error)
			dispatch({ type: ActionTypes.QUEUE_CARDS_ERROR, payload: error })
		})
	}
}

export function createQueueCard(card) {
	return (dispatch) => {
		axios.post(`${ROOT_URL}/cards/queue`, card).then((response) => {
				dispatch({ type: ActionTypes.CREATE_QUEUE_CARD, payload: response.data });
			}).catch((error) => {
				dispatch({ type: ActionTypes.QUEUE_CARDS_ERROR, payload: error });
			});
	};
}

export function updateQueueCard(id, card) {
	return (dispatch) => {
		axios.put(`${ROOT_URL}/cards/queue/${id}`, card).then((response) => {
			dispatch({ type: ActionTypes.UPDATE_QUEUE_CARD, payload: response.data });
		}).catch((error) => {
			dispatch({ type: ActionTypes.QUEUE_CARDS_ERROR, payload: error })
		})
	}
}

export function deleteQueueCard(id) {
	return (dispatch) => {
		axios.delete(`${ROOT_URL}/cards/queue/${id}`).then((response) => {
			dispatch({ type: ActionTypes.DELETE_QUEUE_CARD, payload: response.data })
		}).catch((error) => {
			console.log(error)
			dispatch({ type: ActionTypes.QUEUE_CARDS_ERROR, payload: error })
		})
	}
}

export function fetchSuggestions(lat, long, tripId, category=null) {
	return (dispatch) => {
		dispatch({ type: ActionTypes.FETCH_SUGGESTIONS })

    let query
    if (category && tripId && category === 'queue') {
      query = `${ROOT_URL}/cards/queue?trip_id=${tripId}`
    } else {
      query = `${ROOT_URL}/suggestions?latitude=${lat}&longitude=${long}&trip_id=${tripId}`
      if (category) { query = `${ROOT_URL}/suggestions?latitude=${lat}&longitude=${long}&categories=${category}` }
    }

		axios.get(query).then((response) => {
			dispatch({ type: ActionTypes.RECEIVE_SUGGESTIONS, payload: response.data })
		}).catch((error) => {
			dispatch({ type: ActionTypes.FETCH_SUGGESTIONS_ERROR, payload: error })
		})
	}
}

export function clearSuggestions() {
	return (dispatch) => {
		dispatch({ type: ActionTypes.CLEAR_SUGGESTIONS })
	}
}

export function checkEditPermission(userId, tripId) {
  return (dispatch) => {
    const query = `${ROOT_URL}/permissions?user_id=${userId}&trip_id=${tripId}`

    axios.get(query).then((response) => {
      dispatch({ type: ActionTypes.CHECK_EDIT_PERMISSION, payload: response.data})
    }).catch((error) => {
      console.log(error)
    })
  }
}

export function giveEditPermission(userId, tripId, shareCode) {
  return (dispatch) => {
    const query = `${ROOT_URL}/sharecode?user_id=${userId}&trip_id=${tripId}&verify=${shareCode}`
    //should do some type of handling with the response eventually
    axios.get(query).then((response) => {
      //TODO change api to return true and false instead of yes and no
      //WARNING deployed api uses yes and no 02/21/18
      if (response.data == "yes") {
        dispatch({ type: ActionTypes.CHECK_EDIT_PERMISSION, payload: true})
      } else {
        dispatch({ type: ActionTypes.CHECK_EDIT_PERMISSION, payload: false})
      }
    }).catch((error) => {
      console.log(error)
    })
  }
}
