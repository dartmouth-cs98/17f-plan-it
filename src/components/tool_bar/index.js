import React, { Component } from 'react'
import { updateTrip, favoriteTrip, unfavoriteTrip } from '../../actions/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import cookie from 'react-cookies'
import './index.scss'
import DownloadTrip from '../download_trip/index.js'
import LiveUsers from '../live_users'

class Toolbar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			published: this.props.published,
			favorited: this.props.favorited
		}

		this.togglePublish = this.togglePublish.bind(this)
		this.toggleFavorite = this.toggleFavorite.bind(this)
	}

	componentWillReceiveProps(nextProps){
		this.setState({ 
			published: nextProps.published,
			favorited: nextProps.favorited })
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
				this.props.favoriteTrip({trip_id: this.props.tripId, user_id: cookie.load('auth'), last_visited: new Date()})
			} else {
				this.props.unfavoriteTrip(this.props.tripId, cookie.load('auth'))
			}
			this.setState({ favorited })
		}
	}

	getPublishedText() {
		if (cookie.load('auth')) {
			return this.state.published? 'Unpublish' : 'Publish'
		} else {
			return ''
		}
	}

	render() {
		let favoriteIconClass = this.state.favorited? 'fa fa-heart fa-2x heart' : 'fa fa-heart-o fa-2x heart'
		let favoriteToggle = cookie.load('auth')?
		(<div
			onClick={this.toggleFavorite}
			className='toolbar-favorite'>
			<i className={ favoriteIconClass }></i>
		</div>) : <div/>
		let importButton = cookie.load('auth')?
			<div onClick={this.props.onModalOpen}>Import Trip</div> : <div/>

		if (this.props.readOnly) {
			return (
				<div id='tool-bar'>
					<div className= 'left-wrapper'>
					</div>
					<div className='toolbar-trip-title'>
						{this.props.tripName}
					</div>
					<div className= 'right-wrapper'>
						<div className='toggle-options'>
							<div className ='toolbar-download'>
								<DownloadTrip tripId={this.props.tripId} />
							</div>
							<div className = 'toolbar-download'>
								{ importButton }
							</div>
							{ favoriteToggle }
						</div>
					</div>

				</div>
			)
		} else {
			return (
				<div id='tool-bar'>
					<div className='toolbar-trip-title'>
						{this.props.tripName}
					</div>
					<div className='toggle-options'>
						<div className ='toolbar-download'>
							<DownloadTrip tripId={this.props.tripId} />
						</div>
						<div
							onClick={this.togglePublish}
							className='toolbar-click'>
							{this.getPublishedText()}
						</div>
					</div>
				</div>
			)
		}
	}
}

export default withRouter(connect(null, { updateTrip, unfavoriteTrip, favoriteTrip })(Toolbar));
