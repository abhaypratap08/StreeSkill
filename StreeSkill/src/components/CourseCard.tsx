import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Course } from '../types';
import { COLORS } from '../constants/theme';
import CourseLineArt from './CourseLineArt';

type Props = {
  course: Course;
  progress: { completed: number; total: number };
  onPress: () => void;
};

export default function CourseCard({ course, progress, onPress }: Props) {
  const progressPercent = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Card content area */}
      <View style={styles.cardInner}>
        {/* Line art icon instead of thumbnail */}
        <View style={styles.iconContainer}>
          <CourseLineArt courseId={course.id} size={70} color={COLORS.primary} />
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.completed}/{progress.total}</Text>
        </View>
      </View>
      
      {/* Title bar at bottom */}
      <View style={styles.titleBar}>
        <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 180,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardInner: {
    flex: 1,
    padding: 12,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(26, 86, 83, 0.05)',
    borderRadius: 8,
    paddingVertical: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.white,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
  titleBar: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.screenBg,
    textAlign: 'center',
  },
});
