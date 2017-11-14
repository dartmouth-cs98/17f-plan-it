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
    onMarkerClick: () => (markerArray, index) => {
      // TODO: FUNCTION FOR MARKER CLICK TO SHOW INFO
      console.log(index)
      markerArray[index].isInfoOpen = true
    },
    onInfoClose: () => (markerArray, index) => {
      // TODO: FUNCTION FOR MARKER CLICK TO HIDE INFO
      markerArray[index].isInfoOpen = false
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
	constructor(props) {
	  super(props);
	  this.handleMarkerClick = this.handleMarkerClick.bind(this);
		this.onInfoClose = this.onInfoClose.bind(this);
		this.ChangeMapAndMarkerPosition = this.ChangeMapAndMarkerPosition.bind(this);
		this.state = {
			isInfoOpen: this.props.isInfoOpen,
    	isMarkerShown: this.props.isMarkerShown,
			MarkerPosition: this.props.MarkerPosition,
			center: this.props.center,
			infoMessage: this.props.infoMessage,
      markers: []

	  }
	}

  componentWillMount() {
    this.setState({ markers: [] })
  }

  // TODO: Generate JSON object of all places in suggestions
  componentDidMount() {
    const url = [
      // Length issue
      `https://gist.githubusercontent.com`,
      `/farrrr/dfda7dd7fccfec5474d3`,
      `/raw/758852bbc1979f6c4522ab4e92d1c92cba8fb0dc/data.json`
    ].join("")

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({ markers: data.photos });
      });

  }

  handleMarkerClick = () => {
    this.setState({ isInfoOpen: true });
  }

	onInfoClose = () => {
    this.setState({ isInfoOpen: false });
    console.log("worked");
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
    console.log(this.props.MarkerClusterArray);
		return (
			<div id='map-container'>
				<POIMap center={this.props.center} markers={this.props.MarkerClusterArray || []}  />
			</div>
		)
	}
}
