import React from 'react';
import { MapView } from 'expo';
import { Text, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Map extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      markers: [],
      origin: { latitude: 40.7050758, longitude: -74.0091604 },
    };

    config = {
      headers: {
        Authorization: 'Bearer u7IGu_9imvSNXhcFF8SL2bezzy9ktJy3MowyKCcp9-JZ3Gc1ew_NfmGuPqTK4koxAGv63qYbXZTeI_LNcdjArC7IcXDTzKotaUc81a53sf6tHX0cTJlgdYG4i2ekW3Yx',
      },
      params: {
        term: 'Tourists Must See List',
        raduis: 0.5,
        latitude: this.state.origin.latitude,
        longitude: this.state.origin.longitude,
        sort_by: 'distance',
        limit: 5,
      },
    };
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          let newOrigin = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          config.params.latitude = newOrigin.latitude;
          config.params.longitude = newOrigin.longitude;

          this.setState({
            origin: newOrigin,
          });
          resolve(true);
        },
        err => {
          console.log('error');
          console.log(err);
          reject(reject);
        },
        { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
      );
    });
  };

  async componentDidMount() {
    const nas = await this.getLocation();
    const yas = await this.fetchMarkerData();
    return {
      nas,
      yas,
    };
  }

  fetchMarkerData() {
    return axios
      .get('https://api.yelp.com/v3/businesses/search', config)
      .then(responseJson => {
        this.setState({
          isLoading: false,
          markers: responseJson.data.businesses.map(x => x),
        });
      })
      .then(() => console.log('Yas fetch', config))
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        provider="google"
        region={{
          latitude: this.state.origin.latitude,
          longitude: this.state.origin.longitude,
          latitudeDelta: 0.0100,
          longitudeDelta: 0.0100,
        }}
      >
        {this.state.isLoading
          ? null
          : this.state.markers.map(marker => {
              const coords = {
                latitude: marker.coordinates.latitude,
                longitude: marker.coordinates.longitude,
              };
              const namer = `${marker.name}(${marker.rating} rating)`;
              const addresser = `${marker.location.address1}, ${marker.location.city}`;
              return (
                <MapView.Marker
                  key={marker.id}
                  coordinate={coords}
                  title={namer}
                  description={addresser}
                >

                  <Icon name="map-marker" size={30} color={'#605A56'} />

                </MapView.Marker>
              );
            })}

        <MapView.Marker coordinate={this.state.origin}>
          <Icon name="street-view" size={40} color={'#76BBB7'} />
        </MapView.Marker>
      </MapView>
    );
  }
}
