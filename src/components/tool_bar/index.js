import React, { Component } from 'react'
import { updateTrip, fetchFavoritedTrips, favoriteTrip, unfavoriteTrip } from '../../actions/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import cookie from 'react-cookies'
import './index.scss'

class Toolbar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			published: this.props.published,
			favorited: this.props.favoritedTrips? this.isFavorited() : false
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
		this.props.favoritedTrips.map((trip) => {
			if (trip.trip_id === parseInt(this.props.tripId)) {
				return true
			}
		})
		return false
	}

	togglePublish(event) {
		let published = this.state.published? false: true
		this.setState({ published })

		this.props.updateTrip(this.props.tripId, { publish: published })
	}

	toggleFavorite(event) {
		if (cookie.load('auth')) { 
			let favorited = !this.state.favorited
			// changed from unfavorited to favorited
			if (favorited) {
				this.props.favoriteTrip({trip_id: this.props.tripId, user_id: cookie.load('auth')})
			} else {
				this.props.unfavoriteTrip(this.props.tripId, cookie.load('auth'))
			}
			this.setState({ favorited }) 
		}
	}

	getPublishedText() {
		if (cookie.load('auth')) {
			return this.state.published? 'Published' : 'Publish'
		} else {
			return ''
		}
	}

	render() {
		let favoriteIconClass = this.state.favorited? 'fas fa-heart' : 'far fa-heart'
		let favoriteToggle = cookie.load('auth')? 
		(<div 
			onClick={this.toggleFavorite}
			className='toolbar_click'>
			<i className={ favoriteIconClass }></i>
		</div>) : <div/>

		if (this.props.readOnly) {
			return (
				<div id='tool-bar'>
					<div className='toolbar_items'>
						<div className='toolbar-trip-title'>
							{this.props.tripName}
						</div>
						<div className='toggle_options'>
						{ favoriteToggle }
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div id='tool-bar'>
					<div className='toolbar_items'>
						<div className='toolbar-trip-title'>
							{this.props.tripName}
						</div>
						<div className='toggle_options'>
							<div 
								onClick={this.togglePublish}
								className='toolbar_click'>
								{this.getPublishedText()}
							</div>
						</div>
					</div>
				</div>
			)
		}
	}
}

const mapStateToProps = (state) => {
	return { favoritedTrips: state.trips.favoritedTrips }
}

export default withRouter(connect(mapStateToProps, { updateTrip, fetchFavoritedTrips, unfavoriteTrip, favoriteTrip })(Toolbar));

