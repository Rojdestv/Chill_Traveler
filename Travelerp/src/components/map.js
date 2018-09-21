import React from 'react';
import { MapView } from 'expo';
import { Text, View, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const config = {
  headers: {
    Authorization: 'Bearer u7IGu_9imvSNXhcFF8SL2bezzy9ktJy3MowyKCcp9-JZ3Gc1ew_NfmGuPqTK4koxAGv63qYbXZTeI_LNcdjArC7IcXDTzKotaUc81a53sf6tHX0cTJlgdYG4i2ekW3Yx',
  },
  params: {
    term: 'tourist attractions',
    location: 'new york',
  },
};

const origin = { latitude: 40.7480124, longitude: -73.9894128 }; // new york

export default class Map extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      markers: [],
      origin,
    };
  }

  getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        let newOrigin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        this.setState({
          origin: newOrigin,
        });
      },
      err => {
        console.log('error');
        console.log(err);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
  };

  async componentDidMount() {
    const yas = await this.fetchMarkerData();
    const nas = await this.getLocation();
    return {
      yas,
      nas,
    };
  }

  fetchMarkerData() {
    axios
      .get('https://api.yelp.com/v3/businesses/search', config)
      .then(responseJson => {
        this.setState({
          isLoading: false,
          markers: responseJson.data.businesses.map(x => x),
        });
      })
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
              return (
                <MapView.Marker
                  key={marker.id}
                  coordinate={coords}
                  title={marker.name}
                  // description={marker.rating}
                >

                  <MapView.Callout style={styles.bubble}>

                    <Text> Name: {marker.name} Rating:{marker.rating}</Text>
                    {/* <Image style={styles.image} source={marker.image_url} /> */}
                  </MapView.Callout>
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

const styles = StyleSheet.create({
  // Callout bubble
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#E7E7E6',
    padding: 15,
    width: 150,
  },
  image: {
    width: 120,
    height: 80,
  },
});
