import MarkerPin from './Marker';
import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { Marker, InfoWindow } from "@react-google-maps/api";
// import axios from "axios";
require('dotenv').config()
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 11
  };
  renderDirection(map, maps) {
    const directionsService = new maps.DirectionsService();
    const directionsDisplay = new maps.DirectionsRenderer();
    directionsService.route({
      origin: '21.01975, 105.835621',
      destination: '20.995696, 105.807828',
      travelMode: maps.DirectionsTravelMode.DRIVING
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        console.log(response.routes[0]);
        const routePolyline = new maps.Polyline({
          path: response.routes[0].overview_path
        });
        routePolyline.setMap(map);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  // handleToggle = () => {
  //   this.setState({
  //     isOpen: !false
  //   });
  // }
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY }}
          center={this.props.center}
          defaultZoom={this.props.zoom}
          yesIWantToUseGoogleMapApiInternals={true}
          // onGoogleApiLoaded={({ map, maps }) => {
          //   this.renderDirection(map, maps);
          // }}
          
        >
          <MarkerPin
            lat={this.props.center.lat}
            lng={this.props.center.lng}
            name="You're here"
            color="blue"
            tooltip="You're here"
          />
          {this.props.data.map(function (this_data, index) {
            if (this_data.name && this_data.image_link) {
              console.log(this_data.name);
              console.log(this_data.image_link);
              return (
                <MarkerPin
                  lat={this_data.coord_lat}
                  lng={this_data.coord_lng}
                  name={this_data.name}
                  color="green"
                  tooltip={this_data.name + "\n" + this_data.place + "<img src='" + this_data.image_link +"' width =300 height =200 />"  }
                />
              );
            }else if(this_data.name && !this_data.image_link){
              return (
                <MarkerPin
                  lat={this_data.coord_lat}
                  lng={this_data.coord_lng}
                  name={this_data.name}
                  color="green"
                  tooltip={this_data.name + "\n" + this_data.place }
                />
              );
            }else {
              return (
                <MarkerPin
                  lat={this_data.coord_lat}
                  lng={this_data.coord_lng}
                  name={"Time: " + this_data.occure_time + " \nStrength: " + this_data.strength}
                  color="red"
                  tooltip={this_data.name + "\n" + this_data.place}
                />
              );
            }

          })}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;