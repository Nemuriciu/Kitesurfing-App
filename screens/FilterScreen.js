import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';

function FilterScreen({navigation}) {
  return (
    <ScrollView>
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
    </ScrollView>
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
    width: 150,
    marginTop: 18,
    marginBottom: 90,
    alignSelf: 'center',
  },
});

export default FilterScreen;
