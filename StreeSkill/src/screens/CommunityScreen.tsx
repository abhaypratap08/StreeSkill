import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Modal, KeyboardAvoidingView, Platform, Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { communityApi, analyticsApi, CommunityPost } from '../services/api';

const { height } = Dimensions.get('window');

interface Reply {
  id: string;
  author: string;
  content: string;
  time: string;
  votes: number;
  userVote: 'up' | 'down' | null;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  votes: number;
  userVote: 'up' | 'down' | null;
  replies: Reply[];
  replyCount: number;
}

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    avatar: 'P',
    content: 'What type of fabric is best for beginners learning tailoring? I want to start with something easy to handle.',
    time: '2h ago',
    votes: 24,
    userVote: null,
    replyCount: 3,
    replies: [
      { id: 'r1', author: 'Meera', content: 'Cotton is the best! It doesn\'t slip and is easy to cut.', time: '1h ago', votes: 12, userVote: null },
      { id: 'r2', author: 'Anita', content: 'I agree with cotton. Avoid silk or satin initially.', time: '45m ago', votes: 8, userVote: null },
      { id: 'r3', author: 'Sunita', content: 'Try poplin cotton - very beginner friendly!', time: '30m ago', votes: 5, userVote: null },
    ],
  },
  {
    id: '2',
    author: 'Lakshmi Devi',
    avatar: 'L',
    content: 'How much should I charge for a basic blouse stitching in my area? I\'m from a small town.',
    time: '5h ago',
    votes: 18,
    userVote: null,
    replyCount: 4,
    replies: [
      { id: 'r4', author: 'Kavita', content: 'Start with ₹200-300 for basic, increase as you gain experience.', time: '4h ago', votes: 15, userVote: null },
      { id: 'r5', author: 'Rekha', content: 'Check what others charge in your area first.', time: '3h ago', votes: 6, userVote: null },
    ],
  },
  {
    id: '3',
    author: 'Geeta Kumari',
    avatar: 'G',
    content: 'Anyone selling on Meesho? How long does it take to get first order? I listed 10 products last week.',
    time: '1d ago',
    votes: 32,
    userVote: null,
    replyCount: 6,
    replies: [
      { id: 'r6', author: 'Pooja', content: 'It took me 2 weeks. Make sure your photos are good!', time: '20h ago', votes: 20, userVote: null },
      { id: 'r7', author: 'Neha', content: 'Price competitively and share on WhatsApp groups.', time: '18h ago', votes: 14, userVote: null },
    ],
  },
];

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showNewPost, setShowNewPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
    analyticsApi.trackEvent(analyticsApi.events.SCREEN_VIEW, { screen: 'Community' });
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const result = await communityApi.getPosts();
      if (result.success && result.data) {
        // Map API posts to local format
        const mappedPosts: Post[] = result.data.map((p: CommunityPost) => ({
          id: p.id,
          author: p.userName,
          avatar: p.userName.charAt(0),
          content: p.content,
          time: formatTime(p.createdAt),
          votes: p.upvotes - p.downvotes,
          userVote: p.userVote || null,
          replyCount: p.repliesCount,
          replies: [],
        }));
        if (mappedPosts.length > 0) {
          setPosts(mappedPosts);
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await communityApi.vote(postId, voteType);
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === postId) {
          const wasUp = p.userVote === 'up';
          const wasDown = p.userVote === 'down';
          let newVotes = p.votes;
          
          if (voteType === 'up') {
            if (wasUp) { newVotes--; }
            else { newVotes++; if (wasDown) newVotes++; }
          } else {
            if (wasDown) { newVotes++; }
            else { newVotes--; if (wasUp) newVotes--; }
          }
          
          return { ...p, votes: newVotes, userVote: p.userVote === voteType ? null : voteType };
        }
        return p;
      }));
    } catch (error) {
      Alert.alert('Error', 'Could not vote');
    }
  };

  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleReplyVote = (postId: string, replyId: string, voteType: 'up' | 'down') => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            let newVotes = reply.votes;
            let newUserVote: 'up' | 'down' | null = voteType;
            
            if (reply.userVote === voteType) {
              newUserVote = null;
              newVotes = voteType === 'up' ? reply.votes - 1 : reply.votes + 1;
            } else if (reply.userVote === null) {
              newVotes = voteType === 'up' ? reply.votes + 1 : reply.votes - 1;
            } else {
              newVotes = voteType === 'up' ? reply.votes + 2 : reply.votes - 2;
            }
            
            return { ...reply, votes: newVotes, userVote: newUserVote };
          }
          return reply;
        });
        return { ...post, replies: newReplies };
      }
      return post;
    }));
  };

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        author: 'You',
        avatar: 'Y',
        content: newPostContent.trim(),
        time: 'Just now',
        votes: 0,
        userVote: null,
        replyCount: 0,
        replies: [],
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setShowNewPost(false);
    }
  };

  const handleAddReply = (postId: string) => {
    if (replyText.trim()) {
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newReply: Reply = {
            id: Date.now().toString(),
            author: 'You',
            content: replyText.trim(),
            time: 'Just now',
            votes: 0,
            userVote: null,
          };
          return {
            ...post,
            replies: [...post.replies, newReply],
            replyCount: post.replyCount + 1,
          };
        }
        return post;
      }));
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.replyBtn}
          onPress={() => {
            setExpandedPost(expandedPost === post.id ? null : post.id);
          }}
        >
          <Text style={styles.replyBtnText}>💬 {post.replyCount} replies</Text>
        </TouchableOpacity>

        {/* Vote buttons */}
        <View style={styles.voteContainer}>
          <TouchableOpacity 
            style={[styles.voteBtn, post.userVote === 'up' && styles.voteBtnActive]}
            onPress={() => handleVote(post.id, 'up')}
          >
            <Text style={styles.voteIcon}>▲</Text>
          </TouchableOpacity>
          <Text style={[styles.voteCount, post.votes > 0 && styles.votePositive, post.votes < 0 && styles.voteNegative]}>
            {post.votes}
          </Text>
          <TouchableOpacity 
            style={[styles.voteBtn, post.userVote === 'down' && styles.voteBtnActiveDown]}
            onPress={() => handleVote(post.id, 'down')}
          >
            <Text style={styles.voteIcon}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thread / Replies */}
      {expandedPost === post.id && (
        <View style={styles.threadContainer}>
          <View style={styles.threadLine} />
          {post.replies.map(reply => (
            <View key={reply.id} style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <Text style={styles.replyAuthor}>{reply.author}</Text>
                <Text style={styles.replyTime}>{reply.time}</Text>
              </View>
              <Text style={styles.replyContent}>{reply.content}</Text>
              <View style={styles.replyVoteContainer}>
                <TouchableOpacity 
                  style={[styles.smallVoteBtn, reply.userVote === 'up' && styles.voteBtnActive]}
                  onPress={() => handleReplyVote(post.id, reply.id, 'up')}
                >
                  <Text style={styles.smallVoteIcon}>▲</Text>
                </TouchableOpacity>
                <Text style={styles.smallVoteCount}>{reply.votes}</Text>
                <TouchableOpacity 
                  style={[styles.smallVoteBtn, reply.userVote === 'down' && styles.voteBtnActiveDown]}
                  onPress={() => handleReplyVote(post.id, reply.id, 'down')}
                >
                  <Text style={styles.smallVoteIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          {/* Add Reply */}
          <View style={styles.addReplyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Write a reply..."
              placeholderTextColor={COLORS.gray}
              value={replyingTo === post.id ? replyText : ''}
              onChangeText={setReplyText}
              onFocus={() => setReplyingTo(post.id)}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendReplyBtn, !replyText.trim() && styles.sendReplyBtnDisabled]}
              onPress={() => handleAddReply(post.id)}
              disabled={!replyText.trim()}
            >
              <Text style={styles.sendReplyText}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Ask questions, share knowledge</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {posts.map(renderPost)}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB - New Post */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowNewPost(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal visible={showNewPost} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowNewPost(false)} />
          <View style={styles.newPostSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Ask a Question</Text>
              <TouchableOpacity onPress={() => setShowNewPost(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.newPostInput}
              placeholder="What would you like to ask the community?"
              placeholderTextColor={COLORS.gray}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              autoFocus
            />
            <TouchableOpacity 
              style={[styles.postBtn, !newPostContent.trim() && styles.postBtnDisabled]}
              onPress={handleAddPost}
              disabled={!newPostContent.trim()}
            >
              <Text style={styles.postBtnText}>Post Question</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  header: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 16, paddingTop: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.screenBg },
  headerSubtitle: { fontSize: 14, color: COLORS.screenBg, opacity: 0.8, marginTop: 4 },
  content: { flex: 1, padding: 16 },
  
  postCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.screenBg, fontSize: 16, fontWeight: 'bold' },
  authorInfo: { marginLeft: 12, flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  postTime: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  postContent: { fontSize: 15, color: COLORS.darkGray, lineHeight: 22, marginBottom: 12 },
  
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  replyBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.screenBg, borderRadius: 16 },
  replyBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  
  voteContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.screenBg, borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4 },
  voteBtn: { padding: 4 },
  voteBtnActive: { backgroundColor: COLORS.primary, borderRadius: 4 },
  voteBtnActiveDown: { backgroundColor: '#FF6B6B', borderRadius: 4 },
  voteIcon: { fontSize: 12, color: COLORS.darkGray },
  voteCount: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray, marginHorizontal: 8, minWidth: 24, textAlign: 'center' },
  votePositive: { color: COLORS.primary },
  voteNegative: { color: '#FF6B6B' },
  
  threadContainer: { marginTop: 12, paddingLeft: 12, position: 'relative' },
  threadLine: { position: 'absolute', left: 0, top: 0, bottom: 60, width: 2, backgroundColor: COLORS.primary, opacity: 0.3 },
  
  replyCard: { backgroundColor: COLORS.screenBg, borderRadius: 8, padding: 12, marginBottom: 8, marginLeft: 8 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  replyAuthor: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  replyTime: { fontSize: 11, color: COLORS.gray },
  replyContent: { fontSize: 14, color: COLORS.darkGray, lineHeight: 20 },
  replyVoteContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
  smallVoteBtn: { padding: 2 },
  smallVoteIcon: { fontSize: 10, color: COLORS.gray },
  smallVoteCount: { fontSize: 11, color: COLORS.darkGray, marginHorizontal: 6 },
  
  addReplyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 8, gap: 8 },
  replyInput: { flex: 1, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 13, maxHeight: 60 },
  sendReplyBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  sendReplyBtnDisabled: { opacity: 0.5 },
  sendReplyText: { color: COLORS.screenBg, fontSize: 13, fontWeight: '600' },
  
  fab: { position: 'absolute', right: 20, bottom: 90, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  fabText: { fontSize: 28, color: COLORS.screenBg, fontWeight: '300' },
  
  modalContainer: { flex: 1, justifyContent: 'flex-end' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  newPostSheet: { backgroundColor: COLORS.screenBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: height * 0.6 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  closeBtn: { fontSize: 20, color: COLORS.primary, padding: 4 },
  newPostInput: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 12, padding: 16, fontSize: 15, minHeight: 120, textAlignVertical: 'top' },
  postBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 24, marginTop: 16, alignItems: 'center' },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { color: COLORS.screenBg, fontSize: 16, fontWeight: '600' },
});
