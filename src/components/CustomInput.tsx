import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 5,
  },
});

export default function CustomInput(props: any) {
  return <TextInput style={styles.input} {...props} />;
}
