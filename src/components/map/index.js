// Based on React Google Maps node module by Tom Chen.
// Docs found here: https://tomchentw.github.io/react-google-maps

import React, { Component } from 'react'
import { compose, withProps, withHandlers, withStateHandlers, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps"
import MarkerClusterer from "react-google-maps/lib/components/addons/MarkerClusterer"
import FlatButton from 'material-ui/FlatButton'
import './index.scss'

const POIMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAOhNUwMY9QAYojHd5Ar87X8ztMjNXNmn0&libraries=geometry,drawing, places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),
  withStateHandlers((props) => ({
    isOpen: -1,
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
        onClick={() => props.onToggleOpen(props.isOpen === index ? -1 : index, { lat: marker.coordinates.latitude, lng: marker.coordinates.longitude })}
        >
        {props.isOpen === index &&
          <InfoWindow onCloseClick={() => props.onToggleOpen(-1, { lat: marker.coordinates.latitude, lng: marker.coordinates.longitude })}>
            <div className='pin-label'>
              <label className='pin-title'>{marker.name}</label>
              <FlatButton
                label='Add'
                style={{marginLeft: '10px'}}
                onClick={() => {
                  props.onToggleOpen(-1, { lat: marker.coordinates.latitude, lng: marker.coordinates.longitude })
                }}
              />
            </div>
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
				<POIMap
          center={this.props.center}
          markers={this.props.MarkerClusterArray || []}
        />
			</div>
		)
	}
}
