import React, { Component } from 'react'
import { updateTrip, favoriteTrip, unfavoriteTrip, fetchAllCards, updateCards, deleteCard, createCard } from '../../actions/index.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import cookie from 'react-cookies'
import './index.scss'
import DownloadTrip from '../download_trip/index.js'
import LiveUsers from '../live_users'
import CollabButton from '../collab_button'
import axios from 'axios'
import { ROOT_URL } from '../../actions/'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import OnboardingInput from '../onboarding_input'
import { SingleDatePicker } from 'react-dates'
import Modal from 'react-modal'
import _ from 'lodash'
// import moment from 'moment'

class Toolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			published: this.props.published,		
			collab: false,
			copied: false,
			share_url: "loading",			
			favorited: this.props.favorited,
			trip_name: this.props.tripName,
			edited_trip_name: this.props.tripName,
			start_date: null,
			end_date: null,
			edited_start_date: null,
			edited_end_date: null,
			photo_url: this.props.photo_url,
			edited_photo_url: this.props.photo_url,
			start_focused: false,
			end_focused: false,
			edit_error: ''
		}

		this.togglePublish = this.togglePublish.bind(this)
		this.toggleFavorite = this.toggleFavorite.bind(this)

		// collab button functions
		this.onCollabOpen = this.onCollabOpen.bind(this)
		this.onCollabClose = this.onCollabClose.bind(this)

		this.onModalOpen = this.onModalOpen.bind(this)
		this.onModalClose = this.onModalClose.bind(this)
		this.onNameChange = this.onNameChange.bind(this)
		this.onImageChange = this.onImageChange.bind(this)
		this.onSaveChanges = this.onSaveChanges.bind(this)
		this.renderModal = this.renderModal.bind(this)
	}

	componentWillReceiveProps(nextProps){
		// let start_time = moment(this.adjustTimezone(new Date(nextProps.start_time)))
		// let end_time = nextProps.end_time?  moment(new Date(nextProps.end_time).getTime()) : null
		this.setState({
			published: nextProps.published,
			favorited: nextProps.favorited,
			trip_name: nextProps.tripName,
			edited_trip_name: nextProps.tripName,
			// start_date: nextProps.start_time,
			// end_date: nextProps.end_time,
			// edited_start_date: start_time,
			// edited_end_date: end_time,
			photo_url: nextProps.photo_url,
			edited_photo_url: nextProps.photo_url
		})
	}

	componentDidMount() {
		this.props.fetchAllCards(this.props.tripId)
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

	renderCollabButton() {
	    return <CollabButton tripId={this.props.tripId}/>
	}

	onCollabOpen() {
		this.generateURL()
		this.setState({ collab_open: true})
		console.log("function called?")
	}

	onCollabClose() {
		this.setState({ collab_open: false, collab: false, added_text: '' })
		/**this.onResetCustomValues()**/
	}

	async generateURL() {

	    const response = await axios.get(`${ROOT_URL}/sharecode?trip_id=${this.props.tripId}`);
	    const currentURL = window.location.protocol + window.location.hostname;

	    const share_url = currentURL + "/share" + "?sharecode=" + response.data + "&trip_id=" + this.props.tripId
	    console.log(share_url)
	    this.setState({share_url})
  	}

	renderModalCollab() {
		if (this.state.collab) {
			return (
				<Modal
				    isOpen={this.state.collab_open}
				    onRequestClose={this.onCollabClose}
				    className='card horizontal center no_outline'>
					<div className="card-content">
	        			<p>{ this.state.added_text }</p>
	        		</div>
				</Modal>
			)
		} else {
			return (
				<Modal
					isOpen={this.state.collab_open}
					onRequestClose={this.onCollabClose}
					className='card horizontal center no_outline'>
					<div className="card-content date_modal">
						<label class='edit-title'>Invite Friends to Edit</label>
						<p>{this.state.share_url}</p>

						<CopyToClipboard text={this.state.share_url} onCopy={() => this.setState({copied: true})}>
				          <button>Copy</button>
				        </CopyToClipboard>
				    </div>
				</Modal>
			)
		}

		return <CollabButton tripId={this.props.tripId}/>
	}

	onModalClose() {
		this.setState({ 
			modal_open: false,
			edited_trip_name: this.state.trip_name,
			edited_photo_url: this.state.photo_url,
			edited_start_date: this.state.start_date, 
			edited_end_date: this.state.end_date,
			edit_error: ''
		})
	}

	onModalOpen() {
		this.setState({ modal_open: true })
	}

	onNameChange(event) {
		this.setState({ edited_trip_name: event.target.value })
	}

	onImageChange(event) {
		this.setState({ edited_photo_url: event.target.value })
	}

	// getDayOffset(second_date, first_date) {
	// 	const MILLISECONDS = 1000*60*60*24
	// 	return Math.round(second_date - first_date)/MILLISECONDS
	// }

	// addDays(dat, days_to_add) {
	// 	dat.setDate(dat.getDate() + days_to_add)
	// 	return dat
	// }

	// adjustTimezone(date) {
	// 	return new Date(date.getTime() + date.getTimezoneOffset()*60*1000)
	// }

	checkImageExists(url) {

		return new Promise(resolve => {

			let imageExists = require('image-exists')
			let exists

			imageExists(url, function(exists) {
				if (exists) {
					console.log("TRUE")
					exists = true
				}
				else {
					console.log("FALSE")
					exists = false
				}

				resolve(exists)
			});
		})
	}

	async onSaveChanges() {
		let photo_url = this.state.edited_photo_url
		// If undefined or invalid, make it what it was originally
		const image_exists = await this.checkImageExists(photo_url)
		if (_.isUndefined(photo_url) || photo_url === '' || !image_exists) {
			this.setState({ edit_error: 'Invalid photo url'})
		} else {
			console.log('got here')
			console.log(this.state.edited_trip_name)
			this.props.updateTrip(this.props.tripId, { photo_url: this.state.edited_photo_url, name: this.state.edited_trip_name })
				
			this.setState({ 
				modal_open: false,
				edit_error: '', 
				trip_name: this.state.edited_trip_name, 
				photo_url: this.state.edited_photo_url
				// start_date: new_start_date,
				// end_date: new_end_date
			})
			

			// let new_start_date = new Date(this.state.edited_start_date)
			// new_start_date.setHours(0, 0, 0, 0)	
			// new_start_date = new Date(new_start_date.getTime() - new_start_date.getTimezoneOffset()*60*1000)

			// let new_end_date = null

			// if (this.state.edited_start_date) {			
			// 	let offset = this.getDayOffset(new_start_date.getTime(), new Date(this.state.start_date).getTime())
			// 	console.log(offset)
			// 	if (offset !== 0) {

			// 		let cards = []
			// 		console.log(this.props.all_cards)
			// 		_.forEach(this.props.all_cards, (card) => {
		 //  				let start_date = this.addDays(new Date(new Date(card.start_time).getTime() + 5*60*60*1000 - new Date(this.state.edited_start_date).getTimezoneOffset()*60*1000), offset)
		 //  				let end_date = this.addDays(new Date(new Date(card.end_time).getTime() + 5*60*60*1000 - new Date(this.state.edited_start_date).getTimezoneOffset()*60*1000), offset)
		 //  				console.log(new Date(card.start_time))
		 //  				console.log(start_date)
		 //  				const updated_card = _.assign(card, {
			// 				start_time: start_date,
			// 				end_time: end_date
			// 			})

			// 			cards.push(updated_card)
			// 		})

			// 		this.props.sendUpdates(cards, this.props.tripId)
			// 		this.props.updateTrip(this.props.tripId, { 
			// 			start_time: new_start_date, 
			// 			name: this.state.edited_trip_name, 
			// 			photo_url: this.state.edited_photo_url 
			// 		})
			// 	}
			// }
			// if (this.state.edited_end_date) {
			// 	new_end_date = new Date(this.state.edited_end_date)
			// 	new_end_date.setHours(23, 59, 59, 999)
			// 	new_end_date = new Date(new_end_date.getTime() - new_end_date.getTimezoneOffset()*60*1000)
			// 	let adjusted_end_date = new Date(this.state.end_date)
			// 	adjusted_end_date.setHours(23, 59, 59, 999)
			// 	adjusted_end_date = new Date(adjusted_end_date.getTime() - adjusted_end_date.getTimezoneOffset()*60*1000)
			// 	let offset = this.getDayOffset(new_end_date.getTime(), adjusted_end_date.getTime())
			// 	if (offset !== 0) {
			// 		this.props.updateTrip(this.props.tripId, { end_time: new_end_date })
			// 	}

			// 	let last_city = null
			// 	_.forEach(this.props.all_cards, (card) => {
			// 		if (new Date(card.end_time) > new_end_date)
		 //  				this.props.deleteCard(card.id, this.props.tripId, this.props.day)
		 //  			else if (card.type === 'city')
		 //  				last_city = card
			// 	})

			// 	//add on to city
			// 	let last_city_end_time = new Date(last_city.end_time)
			// 	last_city_end_time.setHours(23, 59, 59, 999)
			// 	last_city_end_time = new Date(last_city_end_time.getTime() - last_city_end_time.getTimezoneOffset()*60*1000)
			// 	let day_diff = this.getDayOffset(new_end_date.getTime(), last_city_end_time)
			// 	let added_cards = []
			// 	if (new Date(last_city.end_time) < new_end_date) {
			// 		for (let i = 1; i <= day_diff; i++) {
			// 			last_city = _.assign(last_city, {
			// 				start_time: this.addDays(new Date(last_city.start_time), 1),
			// 				end_time: this.addDays(new Date(last_city.end_time), 1),
			// 				day_number: last_city.day_number + 1
			// 			})
			// 			added_cards.push(last_city)
			// 		}
			// 		this.props.createCard(added_cards)
			// 	}
			// }
		}
	}

	renderModal() {
		return (
			<Modal
				isOpen={this.state.modal_open}
				onRequestClose={this.onModalClose}
				className='card horizontal center no_outline'>
				<div className="card-content date_modal">
					<p>Trip Name</p>
					<OnboardingInput placeholder={'Name your trip'}
						onNameChange={this.onNameChange}
						name={this.state.edited_trip_name}
					/>
					<div className='custom_error'>{this.state.name_error}</div>
					<p>Image URL</p>
					<OnboardingInput placeholder={'Enter image URL'}
						onImageChange={(this.onImageChange)}
						image_url={this.state.edited_photo_url}
					/>
					{// <p>Start Date</p>
					// <SingleDatePicker
					// 	date={this.state.edited_start_date}
					// 	onDateChange={(start_date) => {
					// 		let new_start_date = new Date(start_date)
					// 		new_start_date.setHours(0, 0, 0, 0)	
					// 		new_start_date = new Date(new_start_date.getTime() - new_start_date.getTimezoneOffset()*60*1000)
					// 		let offset = this.getDayOffset(new_start_date.getTime(), new Date(this.state.start_date).getTime())
					// 		this.setState({ edited_start_date: start_date })
					// 		this.setState({ edited_end_date: moment(this.addDays(new Date(this.state.end_date), offset))})
					// 	}}
					// 	focused={this.state.start_focused}
					// 	onFocusChange={({ focused }) => this.setState({ start_focused: focused })}
					// 	withPortal={true}
					// 	hideKeyboardShortcutsPanel={true}
					// />
					// <p>End Date</p>
					// <SingleDatePicker
					// 	date={this.state.edited_end_date}
					// 	onDateChange={(end_date) => this.setState({ edited_end_date: end_date })}
					// 	focused={this.state.end_focused}
					// 	onFocusChange={({ focused }) => this.setState({ end_focused: focused })}
					// 	withPortal={true}
					// 	hideKeyboardShortcutsPanel={true}
					// />
					}
					<div className='custom_error'>{this.state.edit_error}</div>
					<div className='button_container start-onboarding-button'
						onClick={this.onSaveChanges}>
						Save Changes
					</div>
				</div>
			</Modal>
		)
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
					<div className= 'toolbar-live-users'>
					</div>
					<div className='toolbar-trip-title'>
						{this.props.tripName}
					</div>
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
			)
		} else {
			return (
				<div id='tool-bar'>
					{ this.renderModalCollab() }
					{this.renderModal()}
					<div className='toolbar-live-users'>
						<LiveUsers tripId={this.props.tripId} />
						<CollabButton
							onCollabOpen={this.onCollabOpen}
						/>
					</div>


					<div className='toolbar-trip-title'>
						{this.state.trip_name}
					</div>

					<div className='toggle-options'>
						<div className ='toolbar-download'
							onClick={this.onModalOpen}>
							Edit Trip
						</div>
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

const mapStateToProps = (state) => {
	return {
		all_cards: state.cards.all_cards
	}
}

export default withRouter(connect(mapStateToProps, { updateTrip, unfavoriteTrip, favoriteTrip, fetchAllCards, updateCards, deleteCard, createCard })(Toolbar));

