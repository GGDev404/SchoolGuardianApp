import { StyleSheet } from 'react-native';
import { colorPalettes } from './colors';

// Función para crear estilos comunes basados en el tema
export const createCommonStyles = (colors: typeof colorPalettes['dark']) => {
  return StyleSheet.create({
    // Contenedores principales
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 20,
    },

    // Inputs y formularios
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
    inputFocused: {
      borderColor: colors.button,
      borderWidth: 2,
    },
    label: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    labelRequired: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },

    // Botones
    primaryButton: {
      backgroundColor: colors.button,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    primaryButtonText: {
      color: colors.buttonText,
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    primaryButtonDisabled: {
      backgroundColor: colors.button,
      opacity: 0.6,
    },
    
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.button,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    secondaryButtonText: {
      color: colors.button,
      fontSize: 16,
      fontWeight: '600',
    },

    dangerButton: {
      backgroundColor: colors.error,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    dangerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },

    // Cards y contenedores
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
    cardRow: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },

    // Texto y tipografía
    title: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 24,
      marginBottom: 16,
    },
    bodyText: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 24,
    },
    captionText: {
      color: colors.textSecondary,
      fontSize: 14,
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

    // Headers y navegación
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
    backButton: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 8,
      elevation: 2,
    },

    // Iconos y avatares
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.card,
    },
    avatarLarge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.card,
    },
    avatarXLarge: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.card,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: colors.input,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },

    // Lists y elementos
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 6,
      marginHorizontal: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    listItemContent: {
      flex: 1,
      marginLeft: 12,
    },
    listItemTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    listItemSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    // Badges y notificaciones
    badge: {
      backgroundColor: colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    statusBadge: {
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusBadgeText: {
      fontSize: 12,
      fontWeight: '600',
    },

    // Utilidades
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    marginTop: {
      marginTop: 16,
    },
    marginBottom: {
      marginBottom: 16,
    },
    padding: {
      padding: 16,
    },
    paddingHorizontal: {
      paddingHorizontal: 16,
    },
    paddingVertical: {
      paddingVertical: 16,
    },

    // Separadores
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    spacer: {
      height: 24,
    },

    // Modales y overlays
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      marginHorizontal: 20,
      maxWidth: 400,
      width: '90%',
    },
    modalTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    modalText: {
      color: colors.text,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 24,
    },
  });
};

// Hook personalizado para usar los estilos comunes
export const useCommonStyles = (theme: 'dark' | 'light') => {
  const colors = colorPalettes[theme] || colorPalettes.dark;
  return createCommonStyles(colors);
};

// Estilos específicos para diferentes tipos de pantallas
export const createScreenStyles = (colors: typeof colorPalettes['dark']) => ({
  // Estilos para pantallas de autenticación
  auth: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 24,
      justifyContent: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    formContainer: {
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
    linkContainer: {
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

  // Estilos para listas y feeds
  list: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      paddingVertical: 8,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 16,
    },
  }),

  // Estilos para configuración
  settings: StyleSheet.create({
    profileSection: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    profileName: {
      color: colors.text,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 16,
    },
    profileEmail: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginTop: 4,
    },
    sectionGroup: {
      marginVertical: 8,
    },
    logoutButton: {
      backgroundColor: colors.error,
      borderRadius: 12,
      paddingVertical: 16,
      marginHorizontal: 16,
      marginTop: 32,
      marginBottom: 32,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
  }),
});
