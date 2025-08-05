import React, { useState, useContext, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext, UserContext } from '../contexts/AppContexts';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../hooks/useTranslation';
import { useScreenStyles } from '../hooks/useStyles';


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
  const { colors, styles, common } = useScreenStyles('calendar');
  const { setUser, lang } = useContext(UserContext);
  const { t } = useTranslation();

  // Debug: Log para verificar que los colores cambien
  console.log('Calendar theme:', theme, 'Background color:', colors.background, 'Text color:', colors.text);

  // Crear el tema del calendario con dependencias correctas
  const calendarTheme = useMemo(() => ({
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.button,
    selectedDayTextColor: '#ffffff',
    todayTextColor: colors.button,
    dayTextColor: colors.text,
    textDisabledColor: colors.textSecondary + '60',
    dotColor: colors.button,
    selectedDotColor: '#ffffff',
    arrowColor: colors.button,
    monthTextColor: colors.text,
    indicatorColor: colors.button,
    textDayFontWeight: '400' as const,
    textMonthFontWeight: '600' as const,
    textDayHeaderFontWeight: '500' as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 13,
    // Forzar colores del stylesheet para asegurar cambios de tema
    'stylesheet.calendar.header': {
      week: {
        marginTop: 5,
        flexDirection: 'row' as const,
        justifyContent: 'space-around' as const,
        backgroundColor: colors.card,
        borderRadius: 8,
        marginHorizontal: 12,
        paddingVertical: 8,
      }
    },
    'stylesheet.day.basic': {
      base: {
        width: 32,
        height: 32,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
      },
      text: {
        marginTop: 4,
        fontSize: 16,
        fontFamily: 'System',
        fontWeight: '400' as const,
        color: colors.text,
      },
      today: {
        backgroundColor: colors.button + '20',
        borderRadius: 16,
      },
      selected: {
        backgroundColor: colors.button,
        borderRadius: 16,
      },
    }
  }), [colors, theme]);

  // Memoizar las fechas marcadas para evitar recrearlas en cada render
  const markedDates = useMemo(() => {
    const marked = getMarkedDates(colors);
    if (selectedDate) {
      return {
        ...marked,
        [selectedDate]: {
          selected: true,
          selectedColor: colors.button,
          selectedTextColor: colors.buttonText || '#fff',
          ...marked[selectedDate]
        }
      };
    }
    return marked;
  }, [colors, selectedDate, theme]);

  return (
    <SafeAreaView style={common.container} edges={["left", "right", "bottom"]}>
      <View>
        <Text style={styles.title}>
          {t('calendar', 'title')}
        </Text>
      </View>
      <View style={{ backgroundColor: colors.background, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }}>
        <Calendar
          key={`calendar-${theme}-${colors.background}`} // Forzar re-render cuando cambie el tema
          markedDates={markedDates}
          onDayPress={day => setSelectedDate(day.dateString)}
          theme={calendarTheme}
          style={{
            backgroundColor: colors.background,
            borderRadius: 12,
          }}
        />
      </View>
      <View style={{ flex: 1, padding: 20 }}>
        {selectedDate && classEvents[selectedDate] ? (
          (classEvents[selectedDate] as ClassEvent[]).map((event: ClassEvent, idx: number) => (
            <View key={idx} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventTime}>{event.time}</Text>
              <View style={styles.eventStatus}>
                <Ionicons name={event.attended ? 'checkmark-circle' : 'close-circle'} size={22} color={event.attended ? colors.success : colors.error} />
                <Text style={[styles.eventStatusText, { color: event.attended ? colors.success : colors.error }]}>
                  {event.attended ? 'Asististe' : 'Faltaste'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEventsText}>No tienes clases este día.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;