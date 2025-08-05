import { useContext } from 'react';
import { ThemeContext } from '../contexts/AppContexts';
import { colorPalettes } from '../theme/colors';
import { createCommonStyles, createScreenStyles } from '../theme/commonStyles';
import { createStyles, usePresetStyles, screenPresets } from '../theme/styleHelpers';

// Hook principal para usar estilos en cualquier componente
export const useStyles = () => {
  const { theme } = useContext(ThemeContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;

  return {
    colors,
    common: createCommonStyles(colors),
    screens: createScreenStyles(colors),
    create: (customStyles?: any) => createStyles(colors, customStyles),
  };
};

// Hook específico para pantallas con presets
export const useScreenStyles = (preset: keyof typeof screenPresets) => {
  const { theme } = useContext(ThemeContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;

  return {
    colors,
    styles: usePresetStyles(preset, colors),
    common: createCommonStyles(colors),
  };
};

// Funciones de utilidad para estilos específicos
export const getInputStyle = (colors: typeof colorPalettes['dark'], focused?: boolean) => {
  return {
    backgroundColor: colors.input,
    color: colors.inputText,
    borderWidth: focused ? 2 : 1,
    borderColor: focused ? colors.button : colors.border,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
  };
};

export const getButtonStyle = (
  colors: typeof colorPalettes['dark'], 
  variant: 'primary' | 'secondary' | 'danger' = 'primary',
  disabled?: boolean
) => {
  const baseStyle = {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginVertical: 8,
  };

  switch (variant) {
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.button,
        opacity: disabled ? 0.6 : 1,
      };
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: colors.error,
        opacity: disabled ? 0.6 : 1,
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: colors.button,
        opacity: disabled ? 0.6 : 1,
      };
  }
};

export const getCardStyle = (colors: typeof colorPalettes['dark'], elevated?: boolean) => {
  return {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: elevated ? 4 : 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevated ? 4 : 2 },
    shadowOpacity: elevated ? 0.12 : 0.08,
    shadowRadius: elevated ? 8 : 4,
  };
};
