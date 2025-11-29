import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Reel } from '../types';
import { COLORS, SIZES } from '../constants/theme';

type Props = {
  reel: Reel;
  index: number;
  isCompleted: boolean;
  onPress: () => void;
};

export default function ReelThumbnail({ reel, index, isCompleted, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Thumbnail with image */}
          <View style={styles.thumbnailContainer}>
            <Image 
              source={{ uri: reel.thumbnail }} 
              style={styles.thumbnailImage}
              resizeMode="cover"
            />
            {isCompleted && (
              <View style={styles.completedOverlay}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
            {!isCompleted && (
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            )}
          </View>
          
          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.lessonNumber}>Lesson {index + 1}</Text>
            <Text style={styles.title} numberOfLines={2}>{reel.title}</Text>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{reel.duration}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.cardRadius,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnailContainer: {
    width: 100,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.screenBg,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 86, 83, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 28,
    color: COLORS.screenBg,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -16,
    marginLeft: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 12,
    color: COLORS.screenBg,
    marginLeft: 2,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  lessonNumber: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    color: COLORS.screenBg,
    fontWeight: '600',
    marginBottom: 6,
  },
  durationBadge: {
    backgroundColor: COLORS.screenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
