import React from 'react';
import {Image, StyleSheet} from 'react-native';

const starOff = () => (
  <Image
    source={require('./images/star-off/xxxhdpi/star-off.png')}
    style={styles.favorite}
  />
);

const starOn = () => (
  <Image
    source={require('./images/star-on/xxxhdpi/star-on.png')}
    style={styles.favorite}
  />
);

export function isFavorite(flag) {
  if (flag) {
    return starOn;
  } else {
    return starOff;
  }
}

const styles = StyleSheet.create({
  favorite: {
    marginEnd: 10,
    width: 24,
    height: 24,
  },
});
