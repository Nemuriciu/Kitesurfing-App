import React, {Component} from 'react';
import {Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as Constants from '../constants';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      email: '',
      emailError: '',
      pass: '',
      passError: '',
    };

    this.props.navigation.setOptions({headerShown: false});
  }

  componentDidMount() {
    /* Check if user already connected */
    this.currentUser();
  }

  async storeItem(key, item) {
    try {
      var json = await AsyncStorage.setItem(key, JSON.stringify(item));
      return json;
    } catch (error) {
      Alert.alert('', 'Login failed. Please try again.');
    }
  }

  /* Get currentUser from cache */
  currentUser = async () => {
    try {
      const result = await AsyncStorage.getItem('currentUser');
      const currentUser = JSON.parse(result);

      if (currentUser && currentUser.id) {
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Main', params: {currentUser: currentUser}}],
          }),
        );
      } else {
        this.setState({loading: false});
      }
    } catch (error) {
      console.log(error);
    }
  };

  onChangeText = (key, val) => {
    this.setState({[key]: val});
  };

  /* Check if user input is valid email & password */
  Validate = () => {
    const reg = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    let flag = true;

    if (reg.test(this.state.email) === false) {
      this.setState({emailError: '*Email is invalid'});
      flag = false;
    }

    if (this.state.pass.length === 0) {
      this.setState({passError: '*Password is invalid'});
      flag = false;
    }

    return flag;
  };

  /* Check valid user in API */
  CheckUser = async () => {
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
        .filter(
          e =>
            /* check for pass match only if it exists in API */
            e.email.toLowerCase() === this.state.email.toLowerCase() &&
            (e.password ? e.password === this.state.pass : true),
        )
        .map(e => {
          return e;
        });

      /* Login Success */
      if (r.length > 0) {
        const user = {
          id: r[0].id,
          name: r[0].name,
          avatar: r[0].avatar,
          email: r[0].email,
        };

        this.storeItem('currentUser', user);
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Main', params: {currentUser: user}}],
          }),
        );
      } else {
        Alert.alert('', 'Invalid email or password');
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

    this.CheckUser();
  };

  render() {
    if (!this.state.loading) {
      return (
        <ImageBackground
          source={require('../images/kitesurfing.jpg')}
          blurRadius={0.75}
          style={styles.background}>
          <ScrollView style={styles.scrollView}>
            <Image style={styles.logo} source={require('../images/logo.png')} />
            <Input
              placeholder="Email"
              placeholderTextColor="#ffffff"
              autoCompleteType="off"
              errorMessage={this.state.emailError}
              onFocus={() => this.setState({emailError: ''})}
              onChangeText={val => this.onChangeText('email', val)}
              leftIcon={
                <Icon
                  style={styles.icon}
                  name="ios-person"
                  size={28}
                  color="#ffffff"
                />
              }
              keyboardType="email-address"
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.emailError
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Input
              placeholder="Password"
              placeholderTextColor="#ffffff"
              secureTextEntry
              autoCorrect={false}
              autoCompleteType="off"
              errorMessage={this.state.passError}
              onFocus={() => this.setState({passError: ''})}
              onChangeText={val => this.onChangeText('pass', val)}
              leftIcon={
                <View>
                  <Icon
                    style={styles.icon}
                    name="ios-lock"
                    size={28}
                    color="#ffffff"
                  />
                </View>
              }
              containerStyle={styles.container}
              inputContainerStyle={
                this.state.passError
                  ? styles.inputContainerError
                  : styles.inputContainerValid
              }
              inputStyle={styles.inputText}
              errorStyle={styles.error}
            />
            <Button
              title="Sign In"
              titleStyle={styles.buttonText}
              raised
              buttonStyle={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={() => this.submit()}
            />
            <TouchableOpacity
              style={styles.signUpContainer}
              onPress={() => this.props.navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUp}>
                Don't have an account yet? Sign up
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={require('../images/kitesurfing.jpg')}
          blurRadius={0.75}
          style={styles.background}>
          <ScrollView style={styles.scrollView}>
            <Image style={styles.logo} source={require('../images/logo.png')} />
          </ScrollView>
        </ImageBackground>
      );
    }
  }
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    backgroundColor: '#00000022',
  },
  logo: {
    width: 275,
    height: 200,
    marginBottom: 80,
    alignSelf: 'center',
  },
  container: {
    marginBottom: 16,
  },
  inputContainerValid: {
    borderRadius: 30,
    borderWidth: 2,
    borderBottomWidth: 2,
    width: '80%',
    alignSelf: 'center',
    borderColor: '#000000',
    backgroundColor: '#00000066',
  },
  inputContainerError: {
    borderRadius: 30,
    borderWidth: 2,
    borderBottomWidth: 2,
    width: '80%',
    alignSelf: 'center',
    borderColor: 'red',
    backgroundColor: '#00000066',
  },
  inputText: {
    marginStart: 24,
    fontSize: 15,
    color: '#ffffff',
  },
  buttonContainer: {
    width: '60%',
    marginTop: 10,
    borderRadius: 50,
    alignSelf: 'center',
  },
  button: {
    height: 40,
    borderRadius: 50,
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
  signUpContainer: {
    marginTop: 14,
    marginBottom: 60,
    alignSelf: 'center',
  },
  signUp: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    alignSelf: 'center',
  },
});
