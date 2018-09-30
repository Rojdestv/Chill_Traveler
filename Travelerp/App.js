import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Map from './src/components/map';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name={'ios-camera'} size={40} color={'#E7E7E6'} />
          <Text style={styles.title}>Chill Traveler</Text>
        </View>
        <Map />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.2,
    backgroundColor: '#76BBB7',
  },
  title: {
    fontFamily: 'Marker Felt',
    fontSize: 30,
    color: '#E7E7E6',
  },
});
