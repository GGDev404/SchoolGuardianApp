import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorPalettes } from '../theme/colors';
import { ThemeContext, UserContext } from '../App';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { t } from '../i18n';

// Configuración de idioma para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
};
LocaleConfig.defaultLocale = 'es';


// Ejemplo de clases y asistencias para el calendario
type ClassEvent = { name: string; time: string; attended: boolean };
type ClassEventsMap = Record<string, ClassEvent[]>;
const classEvents: ClassEventsMap = {
  '2025-07-30': [{ name: 'Mathematics', time: '8:00-9:30', attended: true }],
  '2025-07-31': [{ name: 'Science', time: '10:00-11:30', attended: false }],
  '2025-08-01': [{ name: 'Art', time: '12:00-13:30', attended: true }],
};

const getMarkedDates = (colors: any): Record<string, any> => {
  const marked: Record<string, any> = {};
  Object.keys(classEvents).forEach((date: string) => {
    marked[date] = {
      marked: true,
      dotColor: classEvents[date].some((e: ClassEvent) => !e.attended) ? colors.error : colors.success,
    };
  });
  return marked;
};


const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const { theme } = useContext(ThemeContext);
  const colors = colorPalettes[theme as 'dark' | 'light'] || colorPalettes.dark;
  const { setUser, lang } = useContext(UserContext);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    eventList: { flex: 1, padding: 20 },
    eventCard: { backgroundColor: colors.card, borderRadius: 16, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
    eventName: { color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 2 },
    eventTime: { color: colors.textSecondary, fontSize: 15, marginBottom: 8 },
    attendanceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    noEvents: { color: colors.textSecondary, fontSize: 16, textAlign: 'center', marginTop: 32 },
  });

  const calendarTheme = useMemo(() => ({
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.button,
    selectedDayTextColor: '#fff',
    todayTextColor: colors.button,
    dayTextColor: colors.text,
    textDisabledColor: colors.textSecondary,
    dotColor: colors.button,
    arrowColor: colors.button,
  }), [colors]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <View>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          {t(lang, 'calendar', 'title')}
        </Text>
      </View>
      <Calendar
        markedDates={{
          ...getMarkedDates(colors),
          ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: colors.button, ...getMarkedDates(colors)[selectedDate] } } : {}),
        }}
        onDayPress={day => setSelectedDate(day.dateString)}
        theme={calendarTheme}
      />
      <View style={styles.eventList}>
        {selectedDate && classEvents[selectedDate] ? (
          (classEvents[selectedDate] as ClassEvent[]).map((event: ClassEvent, idx: number) => (
            <View key={idx} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
              <View style={styles.attendanceRow}>
                <Ionicons name={event.attended ? 'checkmark-circle' : 'close-circle'} size={22} color={event.attended ? colors.success : colors.error} />
                <Text style={{ color: event.attended ? colors.success : colors.error, marginLeft: 6 }}>
                  {event.attended ? 'Asististe' : 'Faltaste'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEvents}>No tienes clases este día.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;