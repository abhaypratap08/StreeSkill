import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getCourseById } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ReelThumbnail from '../components/ReelThumbnail';
import { COLORS, SIZES } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export default function CourseDetailScreen({ route, navigation }: Props) {
  const { courseId } = route.params;
  const course = getCourseById(courseId);
  const { progress } = useApp();

  if (!course) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </SafeAreaView>
    );
  }

  const completedReels = progress.completedReels[courseId] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextArea}>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.reelCount}>
              {course.reels.length} lessons • {completedReels.length} completed
            </Text>
          </View>
          <View style={styles.headerImage} />
        </View>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          <Text style={styles.sectionTitleLight}>LES</Text>
          <Text style={styles.sectionTitleBold}>SONS</Text>
        </Text>
      </View>

      {/* Reels List */}
      <FlatList
        data={course.reels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <ReelThumbnail
            reel={item}
            index={index}
            isCompleted={completedReels.includes(item.id)}
            onPress={() =>
              navigation.navigate('ReelPlayer', {
                courseId: course.id,
                reelId: item.id,
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },
  headerCard: {
    marginHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.cardRadius,
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
  },
  headerTextArea: {
    flex: 1,
    justifyContent: 'center',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.screenBg,
    marginBottom: 4,
  },
  reelCount: {
    fontSize: 12,
    color: COLORS.screenBg,
    opacity: 0.8,
  },
  headerImage: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.screenBg,
    borderRadius: 12,
  },
  sectionHeader: {
    marginHorizontal: SIZES.padding,
    marginTop: 20,
    marginBottom: 12,
    backgroundColor: COLORS.screenBg,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: 1,
  },
  sectionTitleLight: {
    color: COLORS.primary,
    fontWeight: '400',
  },
  sectionTitleBold: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 100,
  },
  errorText: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
});
