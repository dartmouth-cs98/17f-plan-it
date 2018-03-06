import React, { Component } from 'react'
import { updateTrip, favoriteTrip, unfavoriteTrip } from '../../actions/index.js'
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
import Modal from 'react-modal';

class Toolbar extends Component {
	constructor(props) {
		super(props)
		this.state = {
			published: this.props.published,
			favorited: this.props.favorited,			
			collab: false,
			copied: false,
			share_url: "loading"			
		}

		this.togglePublish = this.togglePublish.bind(this)
		this.toggleFavorite = this.toggleFavorite.bind(this)

		// collab button functions
		this.onCollabOpen = this.onCollabOpen.bind(this)
		this.onCollabClose = this.onCollabClose.bind(this)
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
					<div className='toolbar-live-users'>
						<LiveUsers tripId={this.props.tripId} />
						<CollabButton
							onCollabOpen={this.onCollabOpen}
						/>
					</div>


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

