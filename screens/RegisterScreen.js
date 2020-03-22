import React, {Component} from 'react';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import * as Constants from '../constants';

export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameErr: '',
      email: '',
      emailErr: '',
      pass: '',
      passErr: '',
      confirmPass: '',
      confirmPassErr: '',
    };

    this.props.navigation.setOptions({headerShown: false});
  }

  componentDidMount() {}

  async storeItem(key, item) {
    try {
      var json = await AsyncStorage.setItem(key, JSON.stringify(item));
      return json;
    } catch (error) {
      Alert.alert('', 'Sign Up failed. Please try again.');
    }
  }

  onChangeText = (key, val) => {
    this.setState({[key]: val});
  };

  /* Check if user input is valid */
  Validate = () => {
    const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    let flag = true;

    if (this.state.name.length === 0) {
      this.setState({nameErr: '*Name is invalid'});
      flag = false;
    }

    if (reg.test(this.state.email) === false) {
      this.setState({emailErr: '*Email is invalid'});
      flag = false;
    }

    if (this.state.pass.length === 0) {
      this.setState({passErr: '*Password is invalid'});
      flag = false;
    }

    if (this.state.confirmPass !== this.state.pass) {
      this.setState({confirmPassErr: '*Password does not match'});
      flag = false;
    }

    return flag;
  };

  /* Add new user to API */
  CreateUser = async () => {
    /* First check if email already exists */
    try {
      const response = await fetch(Constants.USER_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      let r = result
        .filter(e => e.email.toLowerCase() === this.state.email.toLowerCase())
        .map(e => {
          return e;
        });

      /* If not in use add user to API */
      if (r.length > 0) {
        this.setState({emailErr: '*Email already in use'});
      } else {
        try {
          const addResponse = await fetch(Constants.USER_URL, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.state.name,
              password: this.state.pass,
              email: this.state.email,
            }),
          });
          const addResult = await addResponse.json();

          const user = {
            id: addResult.id,
            name: addResult.name,
            avatar: addResult.avatar,
            email: addResult.email,
          };

          this.storeItem('currentUser', user);
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Main', params: {currentUser: user}}],
            }),
          );
        } catch (error) {
          if (error.message === 'Network request failed') {
            Alert.alert('', 'No internet connection.');
          }
        }
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        Alert.alert('', 'No internet connection.');
      }
    }
  };

  submit = () => {
    const valid = this.Validate();
    if (!valid) {
      return;
    }

    this.CreateUser();
  };

  render() {
    return (
      <ImageBackground
        source={require('../images/kitesurfing.jpg')}
        blurRadius={0.75}
        style={styles.background}>
        <View style={styles.view}>
          <ScrollView>
            <Image style={styles.logo} source={require('../images/logo.png')} />
            <Input
              placeholder="Full Name"
              placeholderTextColor="#ffffff"
              leftIcon={
                <View>
                  <Icon
                    style={styles.icon}
                    name="ios-person"
                    size={24}
                    color="#ffffff"
                  />
                </View>
              }
              autoCompleteType="off"
              errorMessage={this.state.nameErr}
              onFocus={() => this.setState({nameErr: ''})}
              onChangeText={val => this.onChangeText('name', val)}
              keyboardType="name-phone-pad"
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.nameErr
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Input
              placeholder="Email"
              placeholderTextColor="#ffffff"
              leftIcon={
                <View>
                  <Icon
                    style={styles.icon}
                    name="ios-mail"
                    size={24}
                    color="#ffffff"
                  />
                </View>
              }
              autoCompleteType="off"
              errorMessage={this.state.emailErr}
              onFocus={() => this.setState({emailErr: ''})}
              onChangeText={val => this.onChangeText('email', val)}
              keyboardType="email-address"
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.emailErr
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Input
              placeholder="Password"
              placeholderTextColor="#ffffff"
              leftIcon={
                <View>
                  <Icon
                    style={styles.icon}
                    name="ios-lock"
                    size={24}
                    color="#ffffff"
                  />
                </View>
              }
              autoCompleteType="off"
              errorMessage={this.state.passErr}
              onFocus={() => this.setState({passErr: ''})}
              onChangeText={val => this.onChangeText('pass', val)}
              keyboardType="name-phone-pad"
              secureTextEntry
              autoCorrect={false}
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.passErr
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Input
              placeholder="Confirm Password"
              placeholderTextColor="#ffffff"
              leftIcon={
                <View>
                  <Icon
                    style={styles.icon}
                    name="ios-lock"
                    size={24}
                    color="#ffffff"
                  />
                </View>
              }
              autoCompleteType="off"
              errorMessage={this.state.confirmPassErr}
              onFocus={() => this.setState({confirmPassErr: ''})}
              onChangeText={val => this.onChangeText('confirmPass', val)}
              keyboardType="name-phone-pad"
              secureTextEntry
              autoCorrect={false}
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.confirmPassErr
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Button
              title="Sign Up"
              titleStyle={styles.buttonText}
              raised
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={() => this.submit()}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  view: {
    height: '100%',
    backgroundColor: '#00000022',
  },
  logo: {
    width: 275,
    height: 200,
    alignSelf: 'center',
  },
  container: {
    marginBottom: 10,
  },
  inputContainerValid: {
    borderRadius: 30,
    borderWidth: 2,
    borderBottomWidth: 2,
    width: '80%',
    alignSelf: 'center',
    borderColor: '#ffffff99',
  },
  inputContainerError: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'red',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#00000066',
  },
  inputText: {
    marginStart: 12,
    fontSize: 16,
    fontWeight: '300',
    color: '#ffffff',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 14,
    marginBottom: 80,
    alignSelf: 'center',
  },
  button: {
    height: 40,
    borderRadius: 30,
    backgroundColor: '#333333',
  },
  buttonText: {
    fontSize: 18,
  },
  icon: {
    marginStart: 10,
  },
  error: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
