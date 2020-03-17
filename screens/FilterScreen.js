import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

export default class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '',
      windProb: '',
    };
  }

  onChangeText = (key, val) => {
    this.setState({[key]: val});
  };

  render() {
    return (
      <ScrollView>
        <Input
          label="Country"
          maxLength={60}
          onChangeText={val => this.onChangeText('country', val)}
          containerStyle={styles.container}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Input
          label="Wind Probability"
          keyboardType="numeric"
          maxLength={3}
          onChangeText={val => this.onChangeText('windProb', val)}
          containerStyle={styles.container}
          inputContainerStyle={styles.inputContainer}
          labelStyle={styles.label}
        />
        <Button
          title="APPLY"
          buttonStyle={styles.applyButton}
          containerStyle={styles.apply}
          raised
          onPress={() =>
            this.props.navigation.navigate('ListScreen', {
              countryFilter: this.state.country,
              windFilter: this.state.windProb,
            })
          }
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
  },
  inputContainer: {
    marginTop: 8,
    marginStart: 12,
    marginEnd: 12,
  },
  label: {
    marginStart: 12,
    marginEnd: 12,
    fontSize: 16,
  },
  apply: {
    width: 150,
    marginTop: 18,
    marginBottom: 90,
    alignSelf: 'center',
  },
  applyButton: {
    backgroundColor: '#dd5500',
  },
});
