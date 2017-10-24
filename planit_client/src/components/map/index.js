// Based on React Google Maps node module by Tom Chen.
// Docs found here: https://tomchentw.github.io/react-google-maps

import React, { Component } from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import './index.css'

const POIMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,

  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    center={props.center}
  >
	<Marker
		position={props.MarkerPosition}
		onClick={props.onMarkerClick}
	>
		{props.isInfoOpen && <InfoWindow onCloseClick={props.onInfoClose}>
			<p>{props.infoMessage}</p>
		</InfoWindow>}
	</Marker>
  </GoogleMap>
);

export default class Map extends Component {
	constructor(props) {
	  super(props);
	  this.handleMarkerClick = this.handleMarkerClick.bind(this);
		this.onInfoClose = this.onInfoClose.bind(this);
		this.ChangeMapAndMarkerPosition = this.ChangeMapAndMarkerPosition.bind(this);
		this.state = {
			/*
			isInfoOpen: false,
	    isMarkerShown: false,
			MarkerPosition: { lat: 43.704441, lng: -72.288694 },
			center: { lat: 43.704441, lng: -72.288694 },
			infoMessage: "Hello From Dartmouth!"
			*/
			isInfoOpen: this.props.isInfoOpen,
	    isMarkerShown: this.props.isMarkerShown,
			MarkerPosition: this.props.MarkerPosition,
			center: this.props.center,
			infoMessage: this.props.infoMessage

	  }
	}

  handleMarkerClick = () => {
    this.setState({ isInfoOpen: true });
  }

	onInfoClose = () => {
    this.setState({ isInfoOpen: false });
  }

	ChangeMapAndMarkerPosition = (LatLong, message) => {
		this.setState({
										isMarkerShown: true,
										MarkerPosition: LatLong,
										center: LatLong,
										isInfoOpen: false,
										infoMessage: message
									});
	}

	render() {
		return (
			<div id='map-container'>
				<POIMap infoMessage={this.state.infoMessage} isInfoOpen={this.state.isInfoOpen} onInfoClose={this.onInfoClose} center={this.state.center} MarkerPosition ={this.state.MarkerPosition} isMarkerShown={this.state.isMarkerShown} onMarkerClick={this.handleMarkerClick}  />
				<button onClick={() => this.ChangeMapAndMarkerPosition({ lat: 43.705382, lng: -72.294620 },"Hello From Tuck!")} type="button">Go to Tuck!</button>
				<button onClick={() => this.ChangeMapAndMarkerPosition({ lat: 43.704441, lng: -72.288694 },"Hello From Dartmouth!")} type="button">Go to Dartmouth!</button>
			</div>
		)
	}
}
