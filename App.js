import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import ListScreen from './screens/ListScreen';
import FilterScreen from './screens/FilterScreen';
import DetailsScreen from './screens/DetailsScreen';
import UserDrawer from './screens/UserDrawer';

const LoginStack = createStackNavigator();
const Login = () => (
  <LoginStack.Navigator>
    <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
  </LoginStack.Navigator>
);

const Drawer = createDrawerNavigator();
const Main = ({route, navigation}) => (
  <Drawer.Navigator
    drawerContent={props => <UserDrawer route={route} {...props} />}>
    <Drawer.Screen name="Spots" component={Spots} />
  </Drawer.Navigator>
);

const SpotsNavigator = createStackNavigator();
const Spots = () => (
  <SpotsNavigator.Navigator initialRouteName="Login">
    <SpotsNavigator.Screen
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
    <SpotsNavigator.Screen
      name="FilterScreen"
      component={FilterScreen}
      options={{
        title: 'Filter',
      }}
    />
    <SpotsNavigator.Screen name="DetailsScreen" component={DetailsScreen} />
  </SpotsNavigator.Navigator>
);

const Root = createStackNavigator();
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Root.Navigator initialRouteName="Login" headerMode="none">
          <Root.Screen name="Login" component={Login} />
          <Root.Screen name="Main" component={Main} />
        </Root.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  filterIcon: {
    marginEnd: 20,
  },
});
