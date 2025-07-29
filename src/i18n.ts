// src/i18n.ts
export const translations = {
  en: {
    login: {
      title: 'Attendance App',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      register: 'Register',
      loggingIn: 'Logging in...',
      errorRequired: 'Email and password are required',
      success: 'Login successful',
      welcome: 'Welcome',
    },
    signup: {
      title: 'Sign Up',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      register: 'Register',
      alreadyAccount: 'Already have an account?',
      login: 'Login',
      errorRequired: 'All fields are required',
      success: 'Registration successful',
      userCreated: 'User created successfully',
    },
    config: {
      title: 'User Settings',
      name: 'Name',
      email: 'Email',
      save: 'Save changes',
      logout: 'Logout',
      role: 'Role',
      errorRequired: 'Name and email are required',
      saved: 'Saved',
      updated: 'Data updated successfully',
    },
    home: {
      welcome: 'Welcome',
      announcements: 'Announcements',
      settings: 'Settings',
      advertising: 'Advertising',
      startAdvertising: 'Start Advertising',
      stopAdvertising: 'Stop Advertising',
    },
    errors: {
      error: 'Error',
    },
  },
  es: {
    login: {
      title: 'App de Asistencia',
      username: 'Usuario',
      password: 'Contraseña',
      login: 'Iniciar sesión',
      noAccount: '¿No tienes cuenta?',
      register: 'Registrarse',
      loggingIn: 'Iniciando sesión...',
      errorRequired: 'Email y contraseña son obligatorios',
      success: 'Login exitoso',
      welcome: 'Bienvenido',
    },
    signup: {
      title: 'Registro',
      name: 'Nombre',
      email: 'Email',
      password: 'Contraseña',
      register: 'Registrarse',
      alreadyAccount: '¿Ya tienes cuenta?',
      login: 'Iniciar sesión',
      errorRequired: 'Todos los campos son obligatorios',
      success: 'Registro exitoso',
      userCreated: 'Usuario creado correctamente',
    },
    config: {
      title: 'Configuración de Usuario',
      name: 'Nombre',
      email: 'Email',
      save: 'Guardar cambios',
      logout: 'Cerrar sesión',
      role: 'Rol',
      errorRequired: 'Nombre y email son obligatorios',
      saved: 'Guardado',
      updated: 'Datos actualizados correctamente',
    },
    home: {
      welcome: 'Bienvenido',
      announcements: 'Anuncios',
      settings: 'Configuración',
      advertising: 'Anunciando',
      startAdvertising: 'Iniciar anuncio',
      stopAdvertising: 'Detener anuncio',
    },
    errors: {
      error: 'Error',
    },
  },
};

export type SupportedLang = 'en' | 'es';

export function t(lang: SupportedLang, section: string, key: string): string {
  const dict = translations[lang] as any;
  const dictEn = translations['en'] as any;
  return (
    dict?.[section]?.[key] ||
    dictEn?.[section]?.[key] ||
    key
  );
}
