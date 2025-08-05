import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import App from './src/App';
import { UserProvider, ThemeProvider } from './src/contexts/AppContexts';

/**
 * Root component that wraps the entire app with context providers
 * This ensures all hooks like useTranslation have access to contexts
 */
export default function Root() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
