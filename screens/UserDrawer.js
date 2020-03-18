import React from 'react';
import {Icon, Avatar, ListItem} from 'react-native-elements';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export default class UserDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: this.props.route.params.currentUser,
    };
  }

  logout = async () => {
    try {
      await AsyncStorage.setItem('currentUser', JSON.stringify({}));

      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  home = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Main', params: {currentUser: this.state.currentUser}}],
      }),
    );
  };

  render() {
    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.topView}>
          <Avatar
            size={100}
            rounded
            source={{
              uri: this.state.currentUser.avatar,
            }}
            containerStyle={styles.avatar}
          />
          <Text style={styles.username}>{this.state.currentUser.name}</Text>
          <Text style={styles.email}>{this.state.currentUser.email}</Text>
        </View>
        <ListItem
          title="Spots"
          onPress={() => this.home()}
          leftIcon={
            <Icon
              name="home"
              type="font-awesome"
              size={24}
              containerStyle={styles.icon}
            />
          }
          topDivider
          bottomDivider
          titleStyle={styles.spotsText}
        />
        <ListItem
          title="Logout"
          onPress={() => this.logout()}
          leftIcon={
            <Icon
              name="sign-out"
              type="font-awesome"
              size={24}
              containerStyle={styles.icon}
            />
          }
          bottomDivider
          titleStyle={styles.logoutText}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    backgroundColor: '#000000dd',
  },
  avatar: {
    marginTop: 28,
    marginBottom: 18,
    alignSelf: 'center',
  },
  username: {
    marginBottom: 6,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  email: {
    marginBottom: 18,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'center',
  },
  spotsText: {
    marginStart: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutText: {
    marginStart: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  icon: {
    marginStart: 14,
  },
});
