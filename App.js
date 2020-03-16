import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ListScreen from './screens/ListScreen';
import FilterScreen from './screens/FilterScreen';
import DetailsScreen from './screens/DetailsScreen';

const Stack = createStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListScreen">
          <Stack.Screen
            name="ListScreen"
            component={ListScreen}
            options={({navigation, route}) => ({
              title: 'Kitesurfing App',
              headerRight: () => (
                <Icon
                  name="filter-list"
                  size={34}
                  style={styles.filterIcon}
                  onPress={() => navigation.navigate('FilterScreen')}
                />
              ),
            })}
          />
          <Stack.Screen
            name="FilterScreen"
            component={FilterScreen}
            options={{
              title: 'Filter',
            }}
          />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  filterIcon: {
    marginEnd: 20,
  },
});
