// Componente reutilizable de botón
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});

export default function CustomButton({ title, onPress, color, disabled }: any) {
  return (
    <View style={styles.container}>
      <Button title={title} onPress={onPress} color={color} disabled={disabled} />
    </View>
  );
}
