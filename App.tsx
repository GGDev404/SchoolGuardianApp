import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNav from './src/App';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNav />
    </GestureHandlerRootView>
  );
}