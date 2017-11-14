import React, { Component } from 'react'
import { updateTrip, fetchFavoritedTrips, favoriteTrip, unfavoriteTrip } from '../../actions/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import cookie from 'react-cookies'
import _ from 'lodash'
import './index.scss'


const tripId = _.last(window.location.pathname.split(':'))

class Toolbar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			published: this.props.published,
			favorited: this.props.favoritedTrips? this.isFavorited() : false,
			name: this.props.tripName
		}

		this.togglePublish = this.togglePublish.bind(this)	
		this.toggleFavorite = this.toggleFavorite.bind(this)	
	}

	componentDidMount() {
		this.props.fetchFavoritedTrips(cookie.load('auth'))
	}

	componentWillReceiveProps() {
		this.setState({ favorited: this.isFavorited() })
	}

	isFavorited() {
		let favorited = false
		this.props.favoritedTrips.map((trip) => {
			if (trip.trip_id === parseInt(tripId)) {
				favorited = true
			}
		})
		return favorited
	}

	togglePublish(event) {
		let published = this.state.published? false: true
		this.setState({published})
		this.props.updateTrip(tripId, {published})
	}

	toggleFavorite(event) {
		let favorited = this.state.favorited? false : true
		if (favorited) {
			this.props.favoriteTrip({trip_id: parseInt(tripId), user_id: cookie.load('auth')})
		} else {
			this.props.unfavoriteTrip(tripId, cookie.load('auth'))
		}
		this.setState({ favorited })
	}

	getPublishedText() {
		if (cookie.load('auth')) {
			return this.state.published? 'Published' : 'Publish'
		} else {
			return ''
		}
	}

	getFavoritedText() {
		if (cookie.load('auth')) {
			return this.state.favorited? 'Favorited' : 'Favorite'
		} else {
			return ''
		}
	}

	render() {
		return (
			<div id='tool-bar'>
				<div className='toolbar_items'>
					<div className='toolbar-trip-title'>
						{this.state.name}
					</div>
					<div className='toggle_options'>
						<div 
							onClick={this.togglePublish}
							className='toolbar_click'>
							{this.getPublishedText()}
						</div>
						<div 
							onClick={this.toggleFavorite}
							className='toolbar_click'>
							{this.getFavoritedText()}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return { favoritedTrips: state.trips.favoritedTrips }
}

export default withRouter(connect(mapStateToProps, { updateTrip, fetchFavoritedTrips, unfavoriteTrip, favoriteTrip })(Toolbar));

