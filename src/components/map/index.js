// Based on React Google Maps node module by Tom Chen.
// Docs found here: https://tomchentw.github.io/react-google-maps

import React, { Component } from 'react'
import _ from 'lodash'
import { compose, withProps, withHandlers, withStateHandlers, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import FlatButton from 'material-ui/FlatButton'
import './index.scss'
import itinMarkerIcon from './itinMarker.png'

const POIMap = compose(
	withProps({
		googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAOhNUwMY9QAYojHd5Ar87X8ztMjNXNmn0&libraries=geometry,drawing,places",
		loadingElement: <div style={{ height: `100%` }} />,
		containerElement: <div style={{ height: `100%` }} />,
		mapElement: <div style={{ height: `100%` }} />,
	}),
	withHandlers((props) => {
		const refs = {
      map: undefined,
    }

		return {
			onMarkerClustererClick: () => (markerClusterer) => {
				const clickedMarkers = markerClusterer.getMarkers()
			},
			onMapMounted: () => ref => {
        refs.map = ref
      },
      onCenterChanged: () => e => {
      	props.setMapCenter(refs.map.getCenter().lat(), refs.map.getCenter().lng())
      }
		}
	}),
	withStateHandlers((props) => ({
		isOpen: -1,
		showSuggestions: props.showSug,
		showItinerary: props.showIt,
		localcenter: props.center
	}), {
		onToggleOpen: ({ isOpen, localcenter }) => (index, center) => ({
			isOpen: index,
			localcenter: center
		})
	}),
	lifecycle({
			componentDidCatch(error, info) {
				console.log(error, info)
				this.props.onToggleOpen(-1, { lat:0, lng: 0 }) // <-- props is not defined
			},
			componentWillReceiveProps(){
			},
	}),
	withScriptjs,
	withGoogleMap
)((props) =>
	<GoogleMap
		defaultZoom={15}
		ref={props.onMapMounted}
		center={props.center}
		onDragEnd={(e) => props.onCenterChanged(e)}
	>
		<MarkerClusterer
			onClick={props.onMarkerClustererClick}
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>

			{props.showSug && props.markers.map((marker, index) => (
				<Marker
					key={marker.id}
					position={{ lat: marker.lat, lng: marker.long }}
					onClick={() => props.onToggleOpen(props.isOpen === index ? -1 : index, { lat: marker.lat, lng: marker.long })}
					>
					{props.isOpen === index &&
						<InfoWindow onCloseClick={() => props.onToggleOpen(-1, { lat: marker.lat, lng: marker.long })}>
							<div className='pin-label'>
								<label className='pin-title'>{marker.name}</label>
								<FlatButton
									label='Add'
									style={{marginLeft: '10px'}}
									onClick={() => {
										const path = window.location.pathname.split(':')
										const tripId = _.last(path)

										_.assign(marker, {
											trip_id: tripId
										})

										props.onToggleOpen(-1, { lat: marker.lat, lng: marker.long })
										props.addCard(marker)
										console.log(marker)
									}}
								/>
							</div>
						</InfoWindow>
					}
				</Marker>
			))}
		</MarkerClusterer>
		<MarkerClusterer
			onClick={props.onMarkerClustererClick}
			averageCenter
			enableRetinaIcons
			gridSize={60}
		>
			{props.itin_markers && props.showIt && props.itin_markers.map((marker, index) => (
				<Marker
					key={marker.id}
					position={{ lat: marker.lat, lng: marker.long }}
					onClick={() => props.onToggleOpen(props.isOpen === (index + props.markers.length) ? -1 : (index + props.markers.length), { lat: marker.lat, lng: marker.long })}
					icon={itinMarkerIcon}
					>
					{props.isOpen === (index + props.markers.length) &&
						<InfoWindow onCloseClick={() => props.onToggleOpen(-1, { lat: marker.lat, lng: marker.long })}>
							<div className='pin-label'>
								<label className='pin-title'>{marker.name}</label>
								{!props.readOnly &&
									<FlatButton
										label='Remove'
										style={{marginLeft: '10px'}}
										onClick={() => {
											props.onToggleOpen(-1, { lat: marker.lat, lng: marker.long })
											props.removeCard(marker.id)
										}}
									/>
								}
							</div>
						</InfoWindow>
					}
				</Marker>
			))}
		</MarkerClusterer>
	</GoogleMap>
);

export default class Map extends Component {
	constructor(props) {
		super(props)

		this.state = {
			ShowIt: true,
			ShowSug: true,
		}

		this.setMapCenter = this.setMapCenter.bind(this)
		this.toggleSug = this.toggleSug.bind(this)
		this.toggleIt = this.toggleIt.bind(this)
	}

	setMapCenter(lat, lng) {
		this.setState({
			lat,
			lng
		})
	}

	toggleSug(){
		this.setState({
			ShowSug: !this.state.ShowSug
		})
	}

	toggleIt(){
		this.setState({
			ShowIt: !this.state.ShowIt
		})
	}

	renderSugText(){
		if (this.state.ShowSug){
			return "Hide Suggestion Pins"
		}
		return "Show Suggestion Pins"
	}

	renderItText(){
		if (this.state.ShowIt){
			return "Hide Itinerary Pins"
		}
		return "Show Itinerary Pins"
	}

	renderSearch() {
		if (!_.isNil(this.state.lat) && !_.isNil(this.state.lng)) {
			return (
				<FlatButton
					label={<span className='toggle-pin'>Redo search here</span>}
					onClick={() => {
						this.setState({
							lat: null,
							lng: null
						})
						this.props.searchSuggestions({
							lat: this.state.lat,
							long: this.state.lng
						})
					}}
				/>
			)
		}
	}

	render() {
		return (
			<div id='map-container'>
			{!this.props.readOnly &&
				<div className='map-suggestions-header'>
					<FlatButton
						label={<span className='toggle-pin'>{this.renderSugText()}</span>}
						onClick={this.toggleSug}
					/>
					<FlatButton
						label={<span className='toggle-pin'>{this.renderItText()}</span>}
						onClick={this.toggleIt}
					/>
					{this.renderSearch()}
				</div>
			}
				<POIMap
					center={this.props.center}
					markers={this.props.MarkerClusterArray || []}
					itin_markers={this.props.itin_marker_array || []}
					showSug={this.state.ShowSug}
					showIt={this.state.ShowIt}
					readOnly={this.props.readOnly}
					addCard={this.props.addCard}
					removeCard={this.props.removeCard}
					setMapCenter={this.setMapCenter}
				/>
			</div>
		)
	}
}
