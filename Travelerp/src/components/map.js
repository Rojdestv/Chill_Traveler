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
    navigator.geolocation.getCurrentPosition(
      position => {
        let newOrigin = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('WHY');
        config.params.latitude = newOrigin.latitude;
        config.params.longitude = newOrigin.longitude;

        this.setState({
          origin: newOrigin,
        });

        // (config.params.latitude = newOrigin.latitude)
        //   (config.params.longitude = newOrigin.longitude)
      },
      err => {
        console.log('error');
        console.log(err);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
  };

  async componentDidMount() {
    const las = await this.editYelp();
    const nas = await this.getLocation();
    const yas = await this.fetchMarkerData();
    return {
      nas,
      yas,
    };
  }

  editYelp() {
    (config.params.latitude = this.state.origin.latitude), (config.params.longitude = this.state.origin.longitude);
    return console.log(
      'AS WELLL',
      config.params.latitude,
      config.params.longitude,
      this.state.origin.latitude
    );
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
    console.log(
      'HEREEEE',
      config.params.latitude,
      config.params.longitude,
      this.state.origin.latitude
    );
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
