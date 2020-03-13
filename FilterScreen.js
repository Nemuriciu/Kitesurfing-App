import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation';

function FilterScreen({navigation}) {
  return (
    <SafeAreaView>
      <Input
        label="Country"
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        labelStyle={styles.label}
      />
      <Input
        label="Wind Probability"
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        labelStyle={styles.label}
        keyboardType="numeric"
      />
      <Button containerStyle={styles.apply} title="APPLY" />
    </SafeAreaView>
  );
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
    marginStart: 90,
    marginEnd: 90,
    marginTop: 24,
  },
});

export default FilterScreen;
