import React from 'react';
import {ListItem} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as utils from './utils';
import FilterScreen from './FilterScreen';
import DetailsScreen from './DetailsScreen';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const Stack = createStackNavigator();

const list = [
  {location: 'Spot_01', country: 'Brasil', favorite: false},
  {location: 'Spot_02', country: 'Spain', favorite: true},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
  {location: 'Item1', country: 'Subitem1', favorite: false},
];

function SpotList({navigation}) {
  const keyExtractor = (item, index) => index.toString();
  const renderItem = ({item}) => (
    <ListItem
      title={item.location}
      subtitle={item.country}
      rightIcon={utils.isFavorite(item.favorite)}
      bottomDivider
      onPress={() => {
        navigation.navigate('DetailsScreen', {
          spot: item.location,
          country: item.country,
          favorite: item.favorite,
          latitude: 0,
          longitude: 0,
          windProb: 0,
          whenToGo: 'N/A',
        });
      }}
    />
  );

  return (
    <View>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
}

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="SpotList"
            component={SpotList}
            options={({navigation, route}) => ({
              title: 'Kitesurfing App',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('FilterScreen')}>
                  <Image
                    source={require('./images/filter/xxxhdpi/Filter.png')}
                    style={styles.filterIcon}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="FilterScreen"
            component={FilterScreen}
            options={{title: 'Filter'}}
          />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  filterIcon: {
    marginEnd: 24,
    width: 30,
    height: 30,
  },
});

export default App;
