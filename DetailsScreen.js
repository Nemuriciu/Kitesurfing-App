import React from 'react';
import {StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import {isFavorite} from './utils';
import {ScrollView} from 'react-native-gesture-handler';

function DetailsScreen({route, navigation}) {
  const {spot} = route.params;
  const {country} = route.params;
  const {favorite} = route.params;
  const {latitude} = route.params;
  const {longitude} = route.params;
  const {windProb} = route.params;
  const {whenToGo} = route.params;

  navigation.setOptions({title: spot, headerRight: isFavorite(favorite)});

  return (
    <ScrollView>
      <ListItem
        title="Country"
        titleStyle={styles.title}
        subtitle={country}
        subtitleStyle={styles.subtitle}
        bottomDivider
      />
      <ListItem
        title="Latitude"
        titleStyle={styles.title}
        subtitle={latitude}
        subtitleStyle={styles.subtitle}
        bottomDivider
      />
      <ListItem
        title="Longitude"
        titleStyle={styles.title}
        subtitle={longitude}
        subtitleStyle={styles.subtitle}
        bottomDivider
      />
      <ListItem
        title="Wind Probability"
        titleStyle={styles.title}
        subtitle={windProb}
        subtitleStyle={styles.subtitle}
        bottomDivider
      />
      <ListItem
        title="When To Go"
        titleStyle={styles.title}
        subtitle={whenToGo}
        subtitleStyle={styles.subtitle}
        bottomDivider
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginStart: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  subtitle: {
    marginStart: 8,
    fontSize: 16,
  },
});

export default DetailsScreen;
