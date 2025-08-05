# Instalación de NativeBase

## 1. Instalar dependencias
```bash
npm install native-base react-native-svg react-native-safe-area-context
```

## 2. Para iOS (CocoaPods)
```bash
cd ios && pod install
```

## 3. Configuración en Root.tsx
Envolver la app con NativeBaseProvider:

```tsx
import { NativeBaseProvider } from 'native-base';

export default function Root() {
  return (
    <NativeBaseProvider>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </NativeBaseProvider>
  );
}
```

## 4. Ejemplo de uso en ConfigScreen
```tsx
import { Box, VStack, HStack, Text, Avatar, Switch, Select } from 'native-base';

// En lugar de View, ScrollView y estilos complejos:
<Box flex={1} bg="coolGray.100" _dark={{ bg: "coolGray.900" }}>
  <VStack space={4} p={4}>
    <HStack space={3} alignItems="center">
      <Avatar size="lg" source={{ uri: user?.avatar }} />
      <VStack>
        <Text fontSize="xl" fontWeight="bold">
          {user?.name || 'Usuario'}
        </Text>
        <Text color="coolGray.600" _dark={{ color: "coolGray.300" }}>
          {user?.email || 'email@ejemplo.com'}
        </Text>
      </VStack>
    </HStack>
  </VStack>
</Box>
```
