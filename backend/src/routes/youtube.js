const express = require('express');
const router = express.Router();

// YouTube Data API v3 configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Search queries for each skill category (optimized for Indian women skill tutorials)
const SKILL_SEARCH_QUERIES = {
  tailoring: 'tailoring tutorial hindi silai machine',
  embroidery: 'hand embroidery tutorial hindi kadhai',
  knitting: 'knitting crochet tutorial hindi bunai',
  mehendi: 'mehndi design tutorial hindi simple',
  baking: 'cake baking tutorial hindi home',
  beauty: 'beauty parlour tutorial hindi facial makeup',
  packaging: 'gift wrapping packaging tutorial hindi',
  beadwork: 'beaded jewelry making tutorial hindi',
  macrame: 'macrame tutorial hindi wall hanging',
  candles: 'candle making tutorial hindi diy',
  quilling: 'paper quilling tutorial hindi',
  meesho: 'meesho selling tutorial hindi online business',
  cooking: 'indian cooking business tutorial hindi tiffin',
  pottery: 'pottery clay art tutorial hindi diya',
  rangoli: 'rangoli kolam design tutorial hindi',
  soap: 'soap making tutorial hindi homemade',
};

// Fetch YouTube Shorts for a skill category
router.get('/shorts/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { maxResults = 10 } = req.query;
    
    if (!YOUTUBE_API_KEY) {
      // Return mock data if no API key
      return res.json({
        success: true,
        data: getMockShorts(category),
        source: 'mock'
      });
    }

    const searchQuery = SKILL_SEARCH_QUERIES[category] || `${category} tutorial hindi`;
    
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?` + new URLSearchParams({
        part: 'snippet',
        q: searchQuery + ' #shorts',
        type: 'video',
        videoDuration: 'short', // Only short videos (< 4 min, includes Shorts)
        maxResults: maxResults.toString(),
        regionCode: 'IN',
        relevanceLanguage: 'hi',
        key: YOUTUBE_API_KEY,
      })
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    const shorts = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `youtube:${item.id.videoId}`,
    }));

    res.json({ success: true, data: shorts, source: 'youtube' });
  } catch (error) {
    console.error('YouTube API error:', error);
    // Fallback to mock data on error
    res.json({
      success: true,
      data: getMockShorts(req.params.category),
      source: 'mock'
    });
  }
});

// Search YouTube Shorts by custom query
router.get('/search', async (req, res) => {
  try {
    const { q, maxResults = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query required' });
    }

    if (!YOUTUBE_API_KEY) {
      return res.json({
        success: true,
        data: getMockShorts('general'),
        source: 'mock'
      });
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?` + new URLSearchParams({
        part: 'snippet',
        q: q + ' tutorial hindi #shorts',
        type: 'video',
        videoDuration: 'short',
        maxResults: maxResults.toString(),
        regionCode: 'IN',
        key: YOUTUBE_API_KEY,
      })
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    const shorts = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `youtube:${item.id.videoId}`,
    }));

    res.json({ success: true, data: shorts, source: 'youtube' });
  } catch (error) {
    console.error('YouTube search error:', error);
    res.json({
      success: true,
      data: getMockShorts('general'),
      source: 'mock'
    });
  }
});

// Get video details by ID
router.get('/video/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!YOUTUBE_API_KEY) {
      return res.json({
        success: true,
        data: {
          id: videoId,
          title: 'Tutorial Video',
          description: 'Learn new skills',
          videoUrl: `youtube:${videoId}`,
        },
        source: 'mock'
      });
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/videos?` + new URLSearchParams({
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY,
      })
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    if (data.items.length === 0) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    const video = data.items[0];
    res.json({
      success: true,
      data: {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        videoUrl: `youtube:${video.id}`,
      },
      source: 'youtube'
    });
  } catch (error) {
    console.error('YouTube video details error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch video details' });
  }
});

// Get trending skill tutorials
router.get('/trending', async (req, res) => {
  try {
    const { maxResults = 20 } = req.query;

    if (!YOUTUBE_API_KEY) {
      return res.json({
        success: true,
        data: getAllMockShorts(),
        source: 'mock'
      });
    }

    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?` + new URLSearchParams({
        part: 'snippet',
        q: 'women skill tutorial hindi handicraft business',
        type: 'video',
        videoDuration: 'short',
        maxResults: maxResults.toString(),
        regionCode: 'IN',
        order: 'viewCount',
        key: YOUTUBE_API_KEY,
      })
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    const shorts = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `youtube:${item.id.videoId}`,
    }));

    res.json({ success: true, data: shorts, source: 'youtube' });
  } catch (error) {
    console.error('YouTube trending error:', error);
    res.json({
      success: true,
      data: getAllMockShorts(),
      source: 'mock'
    });
  }
});

// Mock data for when API key is not available
function getMockShorts(category) {
  const mockVideos = {
    tailoring: [
      { id: 'amWLrZwSPmc', title: 'Sewing Machine Basics', channelTitle: 'Tailoring Tips' },
      { id: 'rUbqo0XQGAI', title: 'How to Take Measurements', channelTitle: 'Stitch Perfect' },
      { id: 'ZJy7Dz3FJWQ', title: 'Simple Blouse Cutting', channelTitle: 'DIY Fashion' },
    ],
    embroidery: [
      { id: 'w1vHpKiPbFo', title: 'Basic Embroidery Stitches', channelTitle: 'Craft Corner' },
      { id: 'grKJsPbfDzs', title: 'Flower Embroidery Design', channelTitle: 'Needle Art' },
      { id: 'xyHmPyKqaJM', title: 'Border Embroidery Pattern', channelTitle: 'Stitch Magic' },
    ],
    mehendi: [
      { id: 'qkLH_jWLXZk', title: 'Simple Mehndi Design', channelTitle: 'Mehndi Art' },
      { id: 'Yz8koS0Z3BA', title: 'Arabic Mehndi Tutorial', channelTitle: 'Henna Queen' },
      { id: 'bJzLqGcqPeo', title: 'Bridal Mehndi Design', channelTitle: 'Wedding Mehndi' },
    ],
    knitting: [
      { id: 'GcOzdAzmtNM', title: 'Knitting for Beginners', channelTitle: 'Yarn Crafts' },
      { id: 'eqca4DwFsbc', title: 'Basic Crochet Stitches', channelTitle: 'Crochet World' },
    ],
    beauty: [
      { id: 'xDwQ0VjE_HU', title: 'Facial at Home', channelTitle: 'Beauty Tips' },
      { id: 'LYpKlXBXbio', title: 'Threading Tutorial', channelTitle: 'Parlour Skills' },
    ],
    candles: [
      { id: 'nESKgdBXJsI', title: 'Candle Making Basics', channelTitle: 'DIY Candles' },
      { id: 'LdLvp630plc', title: 'Scented Candles DIY', channelTitle: 'Craft Ideas' },
    ],
    general: [
      { id: 'qkLH_jWLXZk', title: 'Skill Tutorial', channelTitle: 'Learn & Earn' },
      { id: 'w1vHpKiPbFo', title: 'Craft Tutorial', channelTitle: 'DIY Skills' },
      { id: 'amWLrZwSPmc', title: 'Business Skills', channelTitle: 'Entrepreneur' },
    ],
  };

  const videos = mockVideos[category] || mockVideos.general;
  return videos.map(v => ({
    ...v,
    description: `Learn ${v.title} step by step`,
    thumbnail: `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`,
    publishedAt: new Date().toISOString(),
    videoUrl: `youtube:${v.id}`,
  }));
}

function getAllMockShorts() {
  const categories = ['tailoring', 'embroidery', 'mehendi', 'knitting', 'beauty', 'candles'];
  let allShorts = [];
  categories.forEach(cat => {
    allShorts = allShorts.concat(getMockShorts(cat));
  });
  return allShorts;
}

module.exports = router;
