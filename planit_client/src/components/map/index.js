// Based on React Google Maps node module by Tom Chen.
// Docs found here: https://tomchentw.github.io/react-google-maps

import React, { Component } from 'react'
import { compose, withProps, withHandlers, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import fetch from "isomorphic-fetch"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import './index.scss'

const POIMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAOhNUwMY9QAYojHd5Ar87X8ztMjNXNmn0&libraries=geometry,drawing, places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),
  withStateHandlers(() => ({
    isOpen: -1,
  }), {
    onToggleOpen: ({ isOpen }) => (index) => ({
      isOpen: index,
    })
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={15}
    center={props.center}
  >
  <MarkerClusterer
    onClick={props.onMarkerClustererClick}
    averageCenter
    enableRetinaIcons
    gridSize={60}
  >
    {props.markers.map((marker, index) => (
      <Marker
        key={marker.id}
        position={{ lat: marker.coordinates.latitude, lng: marker.coordinates.longitude }}
        onClick={() => props.onToggleOpen(index)}
        >
        {props.isOpen === index &&
          <InfoWindow onCloseClick={() => props.onToggleOpen(-1)}>
            <p>{marker.name}</p>
      	  </InfoWindow>
        }
      </Marker>
    ))}
  </MarkerClusterer>
  </GoogleMap>
);

export default class Map extends Component {

	render() {
		return (
			<div id='map-container'>
				<POIMap center={this.props.center} markers={this.props.MarkerClusterArray || []}  />
			</div>
		)
	}
}
