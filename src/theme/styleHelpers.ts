import { StyleSheet } from 'react-native';
import { colorPalettes } from './colors';

// Función para crear estilos personalizados que extienden los comunes
export const createStyles = (
  colors: typeof colorPalettes['dark'],
  customStyles?: any
) => {
  const baseStyles = StyleSheet.create({
    // Reutiliza estilos comunes más frecuentes
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    input: {
      backgroundColor: colors.input,
      color: colors.inputText,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      padding: 16,
      borderRadius: 12,
      fontSize: 16,
    },
    button: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
    successText: {
      color: colors.success,
      fontSize: 14,
      marginTop: 4,
    },
  });

  // Si se proporcionan estilos personalizados, los combina con los base
  if (customStyles) {
    return StyleSheet.create({
      ...baseStyles,
      ...customStyles(colors),
    });
  }

  return baseStyles;
};

// Presets de estilos para diferentes tipos de pantallas
export const screenPresets = {
  // Preset para pantallas de autenticación (Login, SignUp)
  auth: (colors: typeof colorPalettes['dark']) => ({
    authContainer: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
      justifyContent: 'center',
    },
    logoSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    formSection: {
      gap: 20,
    },
    loginButton: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    authLinks: {
      alignItems: 'center',
      marginTop: 24,
      gap: 16,
    },
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 24,
      elevation: 2,
    },
  }),

  // Preset para pantallas de configuración
  config: (colors: typeof colorPalettes['dark']) => ({
    container: {
      flexGrow: 1,
      paddingBottom: 32,
    },
    profileSection: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 16,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
      marginBottom: 16,
    },
    profileName: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 26,
      textAlign: 'center',
      marginBottom: 2,
    },
    profileEmail: {
      color: colors.textSecondary,
      fontSize: 17,
      textAlign: 'center',
      marginBottom: 18,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 18,
      marginBottom: 10,
      marginLeft: 24,
    },
    sectionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 24,
      marginBottom: 14,
      padding: 12,
      elevation: 2,
    },
    iconCard: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    sectionText: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '500',
    },
    logoutButton: {
      backgroundColor: colors.error,
      borderRadius: 16,
      paddingVertical: 14,
      marginHorizontal: 32,
      marginTop: 28,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
    },
    logoutButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
      marginLeft: 6,
      letterSpacing: 1,
    },
    logoutButtonModern: {
      backgroundColor: colors.error,
      borderRadius: 16,
      paddingVertical: 14,
      marginHorizontal: 32,
      marginTop: 28,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
    },
    logoutButtonTextModern: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18,
      textAlign: 'center',
      marginLeft: 6,
      letterSpacing: 1,
    },
    dropdownContainer: {
      marginTop: 8,
    },
    dropdownSelected: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 48,
    },
    dropdownText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      flex: 1,
    },
    flagIcon: {
      width: 24,
      height: 18,
      marginRight: 12,
      borderRadius: 2,
    },
    modalOverlayDropdown: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownMenuModalDropdown: {
      backgroundColor: colors.card,
      borderRadius: 12,
      minWidth: 200,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
    },
  }),

  // Preset para pantalla de calendario
  calendar: (colors: typeof colorPalettes['dark']) => ({
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    eventName: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 2,
    },
    eventTime: {
      color: colors.textSecondary,
      fontSize: 15,
      marginBottom: 8,
    },
    eventStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    eventStatusText: {
      marginLeft: 6,
      fontWeight: '500',
    },
    noEventsText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 32,
    },
  }),

  // Preset para pantallas de lista/home
  home: (colors: typeof colorPalettes['dark']) => ({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      marginTop: 30,
      paddingTop: 30,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
      backgroundColor: colors.background,
    },
    cardRow: {
      flexDirection: 'column',
      marginHorizontal: 12,
      marginBottom: 20,
    },
    classCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      width: '97%',
      alignSelf: 'center',
      elevation: 2,
    },
    classImage: {
      width: 54,
      height: 54,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: colors.background,
    },
    classInfo: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    classTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: 17,
      marginBottom: 2,
    },
    classSubtitle: {
      color: colors.textSecondary,
      fontSize: 15,
    },
    advertisingBadge: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 4,
      marginLeft: 10,
    },
    advertisingText: {
      color: colors.buttonText,
      fontWeight: 'bold',
      fontSize: 14,
    },
  }),
  header: (colors: typeof colorPalettes['dark']) => ({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 20,
      marginTop: 40,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
      backgroundColor: colors.background,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    headerButton: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 8,
      elevation: 2,
    },
    headerButtonIcon: {
      color: colors.text,
      fontSize: 24,
    },
  }),
};

// Función helper para crear estilos usando un preset
export const usePresetStyles = (
  preset: keyof typeof screenPresets,
  colors: typeof colorPalettes['dark']
) => {
  const presetStyles = screenPresets[preset](colors);
  const baseStyles = createStyles(colors);
  
  return StyleSheet.create({
    ...baseStyles,
    ...presetStyles,
  });
};
