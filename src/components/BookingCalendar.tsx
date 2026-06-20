import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { Booking } from '@/src/types';
import { Card } from './Card';
import { colors, borderRadius, spacing, typography } from '@/src/constants/theme';

interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BookingCalendar({ bookings, selectedDate, onSelectDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  const bookingCountByDay = useMemo(() => {
    const counts = new Map<string, number>();
    for (const booking of bookings) {
      const key = format(new Date(booking.scheduledAt), 'yyyy-MM-dd');
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [bookings]);

  const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  return (
    <Card style={styles.card}>
      <View style={styles.monthHeader}>
        <Pressable onPress={goToPrevMonth} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.monthTitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
        <Pressable onPress={goToNextMonth} hitSlop={8} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} style={styles.weekdayLabel}>
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {calendarDays.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const count = bookingCountByDay.get(dayKey) ?? 0;
          const inMonth = isSameMonth(day, currentMonth);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <Pressable
              key={dayKey}
              onPress={() => onSelectDate(day)}
              style={[
                styles.dayCell,
                !inMonth && styles.dayCellOutside,
                selected && styles.dayCellSelected,
                today && !selected && styles.dayCellToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  !inMonth && styles.dayTextOutside,
                  selected && styles.dayTextSelected,
                  today && !selected && styles.dayTextToday,
                ]}
              >
                {format(day, 'd')}
              </Text>
              {count > 0 && (
                <View
                  style={[
                    styles.dot,
                    count > 1 && styles.dotBadge,
                    selected && styles.dotSelected,
                  ]}
                >
                  {count > 1 && (
                    <Text style={[styles.dotCount, selected && styles.dotCountSelected]}>
                      {count}
                    </Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navBtn: { padding: spacing.xs },
  monthTitle: { ...typography.h3, color: colors.text },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  dayCellOutside: { opacity: 0.35 },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  dayTextOutside: { color: colors.textMuted },
  dayTextSelected: { color: colors.white, fontWeight: '700' },
  dayTextToday: { color: colors.primary, fontWeight: '700' },
  dot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
  },
  dotBadge: {
    width: 'auto',
    minWidth: 14,
    height: 14,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: {
    backgroundColor: colors.white,
  },
  dotCount: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 12,
  },
  dotCountSelected: {
    color: colors.primary,
  },
});
