import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorPalettes } from '../theme/colors';
import { ThemeContext } from '../contexts/AppContexts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const defaultSchedule = [
  { day: 'Monday', time: '8:00 AM - 9:30 AM' },
  { day: 'Wednesday', time: '8:00 AM - 9:30 AM' },
  { day: 'Friday', time: '8:00 AM - 9:30 AM' },
];

const ClassDetailScreen = ({ route, navigation }: any) => {
  const { theme } = React.useContext(ThemeContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;
  const { classInfo } = route.params;
  const schedule = classInfo.schedule || defaultSchedule;
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["left", "right", "top"]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: insets.top + 18,
          left: 18,
          zIndex: 10,
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 6,
          elevation: 4,
        }}
      >
        <Ionicons name="arrow-back" size={26} color={colors.text} />
      </TouchableOpacity>
      <Image source={{ uri: classInfo.image }} style={styles.image} />
      <ScrollView style={[styles.content, { backgroundColor: colors.card }]} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={[styles.title, { color: colors.text }]}>{classInfo.name || 'Advanced Mathematics'}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{classInfo.room || 'Room 201, Science Building'}</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{'Schedule'}</Text>
        {schedule.map((item: any, idx: number) => (
          <View key={idx} style={[styles.scheduleCard, { backgroundColor: colors.input }]}> 
            <Ionicons name="calendar-outline" size={32} color={colors.button} style={{ marginRight: 16 }} />
            <View>
              <Text style={[styles.scheduleDay, { color: colors.text }]}>{item.day}</Text>
              <Text style={[styles.scheduleTime, { color: colors.textSecondary }]}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 18,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  scheduleDay: {
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 15,
  },
});

export default ClassDetailScreen;
