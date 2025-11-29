import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'YouTubePlayer'>;
const { width, height } = Dimensions.get('window');

export default function YouTubePlayerScreen({ route, navigation }: Props) {
  const { videoId, title, channelTitle } = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setIsPlaying(false);
    }
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${title}" on StreeSkill! 🎓\nhttps://youtube.com/watch?v=${videoId}\n#StreeSkill #LearnAndEarn`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Tutorial</Text>
        <View style={{ width: 70 }} />
      </View>

      {/* YouTube Player */}
      <View style={styles.playerContainer}>
        <YoutubePlayer
          height={width * 0.75}
          width={width}
          play={isPlaying}
          videoId={videoId}
          onChangeState={onStateChange}
        />
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{title}</Text>
        {channelTitle && <Text style={styles.channelName}>{channelTitle}</Text>}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsLiked(!isLiked)}>
          <Text style={styles.actionIcon}>{isLiked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionLabel}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsPlaying(!isPlaying)}>
          <Text style={styles.actionIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
          <Text style={styles.actionLabel}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Learning Tips</Text>
        <Text style={styles.tipText}>• Watch the video multiple times to master the technique</Text>
        <Text style={styles.tipText}>• Practice along with the tutorial</Text>
        <Text style={styles.tipText}>• Share with friends to learn together</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  backBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  backText: { color: COLORS.screenBg, fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, flex: 1, textAlign: 'center' },
  playerContainer: { backgroundColor: '#000' },
  infoContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.primary },
  videoTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 },
  channelName: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: COLORS.primary },
  actionBtn: { alignItems: 'center', gap: 6 },
  actionIcon: { fontSize: 28 },
  actionLabel: { fontSize: 12, color: COLORS.darkGray, fontWeight: '500' },
  tipsContainer: { padding: 16, margin: 16, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary },
  tipsTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 12 },
  tipText: { fontSize: 14, color: COLORS.darkGray, marginBottom: 8, lineHeight: 20 },
});
