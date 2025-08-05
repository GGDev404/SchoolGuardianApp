import { StatusBar } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import React, { useState, useEffect, useContext } from 'react';
import { Animated } from 'react-native';
import { TouchableOpacity } from 'react-native';
const usFlag = require('../assets/us.png');
const mxFlag = require('../assets/mx.png');
import { Modal } from 'react-native';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colorPalettes } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts/AppContexts';
import { SupportedLang } from '../i18n';
import { ThemeContext } from '../contexts/AppContexts';
import { useTranslation } from '../hooks/useTranslation';
import { useScreenStyles } from '../hooks/useStyles';



const ConfigScreen = () => {
  const { colors, styles, common } = useScreenStyles('config');
  const navigation = useNavigation<any>();
  const { user, setUser, lang , setLang } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const themeDropdownRef = React.useRef<View>(null);
  const [themeDropdownPos, setThemeDropdownPos] = useState<{ x: number; y: number } | null>(null);
  const dropdownAnim = React.useRef(new Animated.Value(0)).current;
  const dropdownRef = React.useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number } | null>(null);

  // Persistently force navigation bar color while dropdowns are open
  useEffect(() => {
    const setBarColors = () => {
      StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content', true);
      changeNavigationBarColor(colors.background, theme === 'dark');
    };
    setBarColors();
    return () => {
      setBarColors(); // Force color again after modal closes
    };
  }, [showThemeDropdown, showDropdown, theme, colors.background]);

  // WebSocket para notificaciones en tiempo real
  useEffect(() => {
    const ws = new WebSocket('wss://api-schoolguardian.onrender.com');
    ws.onopen = () => {
      console.log('WebSocket conectado');
    };
    ws.onerror = (err) => {
      console.log('WebSocket error:', err);
    };
    ws.onclose = () => {
      console.log('WebSocket cerrado');
    };
    return () => {
      ws.close();
    };
  }, []);

  // Animate dropdown open/close
  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: showDropdown ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [showDropdown]);
  // Measure dropdown position when opening
  const handleDropdownPress = () => {
    if (dropdownRef.current) {
      dropdownRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setDropdownPos({ x, y: y + height });
        setShowDropdown(true);
      });
    } else {
      setShowDropdown(true);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Botón flotante para regresar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 18, left: 18, zIndex: 10, backgroundColor: colors.card, borderRadius: 20, padding: 6, elevation: 4 }}>
          <Ionicons name="arrow-back" size={26} color={colors.text} />
        </TouchableOpacity>

        {/* Avatar y datos con icono idatr */}
        <View style={styles.profileSection}>
          <Image source={{ uri: user?.avatar || 'https://s3.amazonaws.com/uploads-dev-vtxapp-net/athletes/profile/dev_AT_vtx.com_2025_07_28_11_01_54.png' }} style={styles.avatar} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={styles.profileName}>{user?.name ? user.name : t( 'config', 'defaultUserName')}</Text>
          </View>
          <Text style={styles.profileEmail}>{user?.email ? user.email : t( 'config', 'defaultUserEmail')}</Text>
          {user?.matricula && (
            <Text style={[styles.profileEmail, { fontSize: 14}]}>Matrícula: {user.matricula}</Text>
          )}
        </View>

        {/* Botón Editar Perfil */}
        <TouchableOpacity
          style={[styles.sectionRow, { marginTop: 8 }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.iconCard}>
            <Ionicons name="person-outline" size={20} color={colors.text} />
          </View>
          <Text style={styles.sectionText}>Editar Perfil</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>{t( 'config', 'settingsTitle')}</Text>
        {/* Theme first (dropdown alineado) */}
        <View style={styles.sectionRow}>
          <View style={styles.iconCard}><Ionicons name="sunny-outline" size={28} color={colors.button} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionText}>{t( 'config', 'theme')}</Text>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={styles.dropdownContainer}
                activeOpacity={0.8}
                ref={themeDropdownRef}
                onPress={() => {
                  if (themeDropdownRef.current) {
                    themeDropdownRef.current.measureInWindow((x, y, width, height) => {
                      setThemeDropdownPos({ x, y: y + height });
                      setShowThemeDropdown(true);
                    });
                  } else {
                    setShowThemeDropdown(true);
                  }
                }}
              >
                <View style={styles.dropdownSelected}>
                  <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={22} color={colors.text} style={{ marginRight: 10 }} />
                  <Text style={styles.dropdownText}>{t( 'config', theme === 'dark' ? 'darkTheme' : 'lightTheme')}</Text>
                  <Ionicons name={showThemeDropdown ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
              <Modal visible={showThemeDropdown} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlayDropdown} activeOpacity={1} onPress={() => setShowThemeDropdown(false)}>
                  {themeDropdownPos && (
                    <View style={{
                      ...styles.dropdownMenuModalDropdown,
                      position: 'absolute',
                      left: themeDropdownPos.x,
                      top: themeDropdownPos.y,
                      zIndex: 999,
                    }}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        activeOpacity={0.7}
                        onPress={() => { setTheme('dark'); setShowThemeDropdown(false); }}
                      >
                        <Ionicons name="moon" size={22} color={colors.text} style={{ marginRight: 10 }} />
                        <Text style={styles.dropdownText}>{t( 'config', 'darkTheme')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        activeOpacity={0.7}
                        onPress={() => { setTheme('light'); setShowThemeDropdown(false); }}
                      >
                        <Ionicons name="sunny" size={22} color={colors.text} style={{ marginRight: 10 }} />
                        <Text style={styles.dropdownText}>{t( 'config', 'lightTheme')}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              </Modal>
            </View>
          </View>
        </View>
        {/* Language second */}
        <View style={styles.sectionRow}>
          <View style={styles.iconCard}><Ionicons name="globe-outline" size={28} color={colors.button} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionText}>{t( 'config', 'language')}</Text>
            <View style={{ position: 'relative' }}>
              <TouchableOpacity
                style={styles.dropdownContainer}
                activeOpacity={0.8}
                onPress={handleDropdownPress}
                ref={dropdownRef}
              >
                <View style={styles.dropdownSelected}>
                  <Image source={lang === 'en' ? usFlag : mxFlag} style={styles.flagIcon} />
                  <Text style={styles.dropdownText}>{t( 'config', lang === 'en' ? 'english' : 'spanish')}</Text>
                  <Ionicons name={showDropdown ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </View>
              </TouchableOpacity>
              <Modal visible={showDropdown} transparent animationType="fade">
                <TouchableOpacity style={styles.modalOverlayDropdown} activeOpacity={1} onPress={() => setShowDropdown(false)}>
                  {dropdownPos && (
                    <Animated.View style={{
                      ...styles.dropdownMenuModalDropdown,
                      opacity: dropdownAnim,
                      transform: [{ scaleY: dropdownAnim }],
                      position: 'absolute',
                      left: dropdownPos.x,
                      top: dropdownPos.y,
                      zIndex: 999,
                    }}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        activeOpacity={0.7}
                        onPress={() => { setLang('en'); setShowDropdown(false); }}
                      >
                        <Image source={usFlag} style={styles.flagIcon} />
                        <Text style={styles.dropdownText}>{t( 'config', 'english')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        activeOpacity={0.7}
                        onPress={() => { setLang('es'); setShowDropdown(false); }}
                      >
                        <Image source={mxFlag} style={styles.flagIcon} />
                        <Text style={styles.dropdownText}>{t( 'config', 'spanish')}</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Modal>
            </View>
          </View>
        </View>


        {/* Logout mejorado */}
        <TouchableOpacity
          style={styles.logoutButtonModern}
          activeOpacity={0.85}
          onPress={async () => { await AsyncStorage.removeItem('@userSession'); setUser(null); }}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonTextModern}>{t( 'config', 'logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


export default ConfigScreen;
