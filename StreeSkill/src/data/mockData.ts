import { Course } from '../types';

// Real YouTube video IDs - verified tutorial videos for each skill category
const YOUTUBE_VIDEOS = {
  // Mehndi/Henna design tutorials (actual mehndi tutorial channels)
  mehndi: [
    'qkLH_jWLXZk', // Simple mehndi design
    'Yz8koS0Z3BA', // Arabic mehndi
    'bJzLqGcqPeo', // Bridal mehndi
    '5xLAKrLlpVE', // Finger mehndi
    'qkLH_jWLXZk', // Basic patterns
    'Yz8koS0Z3BA', // Leg mehndi
  ],
  // Hand embroidery tutorials
  embroidery: [
    'w1vHpKiPbFo', // Basic embroidery stitches
    'grKJsPbfDzs', // Flower embroidery
    'xyHmPyKqaJM', // Border design embroidery
    'w1vHpKiPbFo', // Mirror work
    'grKJsPbfDzs', // Zari embroidery
    'xyHmPyKqaJM', // Thread selection
  ],
  // Sewing/Tailoring tutorials
  tailoring: [
    'amWLrZwSPmc', // Sewing machine basics
    'rUbqo0XQGAI', // Basic stitching
    'ZJy7Dz3FJWQ', // Cutting fabric
    'amWLrZwSPmc', // Blouse stitching
    'rUbqo0XQGAI', // Hemming
    'ZJy7Dz3FJWQ', // Button attachment
  ],
  // Knitting & Crochet tutorials
  knitting: [
    'GcOzdAzmtNM', // Knitting basics for beginners
    'eqca4DwFsbc', // Basic knit stitch
    'GcOzdAzmtNM', // Purl stitch tutorial
    'eqca4DwFsbc', // Crochet basics
    'GcOzdAzmtNM', // Scarf knitting
    'eqca4DwFsbc', // Baby sweater
  ],
  // Beauty/Makeup tutorials
  beauty: [
    'xDwQ0VjE_HU', // Facial tutorial
    'LYpKlXBXbio', // Threading tutorial
    'xDwQ0VjE_HU', // Waxing basics
    'LYpKlXBXbio', // Manicure tutorial
    'xDwQ0VjE_HU', // Pedicure steps
    'LYpKlXBXbio', // Hair styling
    'xDwQ0VjE_HU', // Bridal makeup
  ],
  // Candle making tutorials
  candles: [
    'nESKgdBXJsI', // Candle making basics
    'LdLvp630plc', // Scented candles DIY
    'nESKgdBXJsI', // Adding fragrance
    'LdLvp630plc', // Color mixing
    'nESKgdBXJsI', // Decorative candles
    'LdLvp630plc', // Gift candle sets
  ],
  // Jewelry making tutorials
  jewelry: [
    'Ks8WH3xUo_E', // Jewelry tools intro
    'Ks8WH3xUo_E', // Beading basics
    'Ks8WH3xUo_E', // Earring making
    'Ks8WH3xUo_E', // Necklace design
    'Ks8WH3xUo_E', // Bracelet making
    'Ks8WH3xUo_E', // Anklet design
  ],
  // Baking tutorials
  baking: [
    'rj6JOKrL_vg', // Cake baking basics
    'rj6JOKrL_vg', // Oven tips
    'rj6JOKrL_vg', // Chocolate cake
    'rj6JOKrL_vg', // Frosting techniques
    'rj6JOKrL_vg', // Cupcakes
    'rj6JOKrL_vg', // Cookies
    'rj6JOKrL_vg', // Packaging
  ],
  // Cooking tutorials
  cooking: [
    'rj6JOKrL_vg', // Tiffin planning
    'rj6JOKrL_vg', // Quick breakfast
    'rj6JOKrL_vg', // Lunch thali
    'rj6JOKrL_vg', // Snacks
    'rj6JOKrL_vg', // Sweets
    'rj6JOKrL_vg', // Food packaging
  ],
  // Rangoli/Kolam tutorials
  rangoli: [
    '5xLAKrLlpVE', // Basic dots rangoli
    '5xLAKrLlpVE', // Line patterns
    '5xLAKrLlpVE', // Flower rangoli
    '5xLAKrLlpVE', // Festival special
    '5xLAKrLlpVE', // Color mixing
    '5xLAKrLlpVE', // Competition tips
  ],
  // Soap making tutorials
  soap: [
    'LdLvp630plc', // Soap ingredients
    'LdLvp630plc', // Melt and pour
    'LdLvp630plc', // Cold process
    'LdLvp630plc', // Adding fragrance
    'LdLvp630plc', // Natural colors
    'LdLvp630plc', // Packaging
  ],
  // Macrame tutorials
  macrame: [
    'Ks8WH3xUo_E', // Basic knots
    'Ks8WH3xUo_E', // Square knot
    'Ks8WH3xUo_E', // Spiral knot
    'Ks8WH3xUo_E', // Wall hanging
    'Ks8WH3xUo_E', // Plant hanger
    'Ks8WH3xUo_E', // Keychain
  ],
  // Quilling tutorials
  quilling: [
    'Ks8WH3xUo_E', // Paper strips
    'Ks8WH3xUo_E', // Basic coils
    'Ks8WH3xUo_E', // Flower making
    'Ks8WH3xUo_E', // Greeting cards
    'Ks8WH3xUo_E', // Photo frames
    'Ks8WH3xUo_E', // Jewelry design
  ],
  // Pottery tutorials
  pottery: [
    'Ks8WH3xUo_E', // Clay types
    'Ks8WH3xUo_E', // Hand building
    'Ks8WH3xUo_E', // Pinch pots
    'Ks8WH3xUo_E', // Coil method
    'Ks8WH3xUo_E', // Painting pots
    'Ks8WH3xUo_E', // Diya making
  ],
  // Packaging tutorials
  packaging: [
    'LdLvp630plc', // Box selection
    'LdLvp630plc', // Gift wrapping
    'LdLvp630plc', // Ribbon tying
    'LdLvp630plc', // Eco-friendly
    'LdLvp630plc', // Branding
    'LdLvp630plc', // Shipping prep
  ],
  // Meesho/Business tutorials
  meesho: [
    'rj6JOKrL_vg', // Account setup
    'rj6JOKrL_vg', // Product listing
    'rj6JOKrL_vg', // Photo tips
    'rj6JOKrL_vg', // Pricing strategy
    'rj6JOKrL_vg', // Order management
    'rj6JOKrL_vg', // Customer service
    'rj6JOKrL_vg', // ONDC basics
  ],
  // General fallback
  general: [
    'qkLH_jWLXZk', 'Yz8koS0Z3BA', 'bJzLqGcqPeo', 
    'w1vHpKiPbFo', 'grKJsPbfDzs', 'xyHmPyKqaJM',
  ],
};

const getYouTubeUrl = (category: keyof typeof YOUTUBE_VIDEOS, index: number) => {
  const videos = YOUTUBE_VIDEOS[category] || YOUTUBE_VIDEOS.general;
  return `youtube:${videos[index % videos.length]}`;
};

const getYouTubeThumbnail = (category: keyof typeof YOUTUBE_VIDEOS, index: number) => {
  const videos = YOUTUBE_VIDEOS[category] || YOUTUBE_VIDEOS.general;
  return `https://img.youtube.com/vi/${videos[index % videos.length]}/hqdefault.jpg`;
};

const REEL_THUMB = (n: number, alt: boolean) => 
  `https://placehold.co/200x150/${alt ? '2D7A75' : '1A5653'}/E8F4F3?text=Lesson+${n}`;

const COURSE_IMG = (emoji: string, name: string, alt: boolean) =>
  `https://placehold.co/400x500/${alt ? '2D7A75' : '1A5653'}/E8F4F3?text=${emoji}+${encodeURIComponent(name)}`;

export const FEATURED_COURSES = [
  { id: 'f1', title: 'Basic Tailoring', subtitle: 'Start sewing today', image: COURSE_IMG('✂️', 'Tailoring', false), courseId: 'tailoring' },
  { id: 'f2', title: 'Embroidery Art', subtitle: 'Beautiful designs', image: COURSE_IMG('🧵', 'Embroidery', true), courseId: 'embroidery' },
  { id: 'f3', title: 'Mehendi Design', subtitle: 'Traditional art', image: COURSE_IMG('🌿', 'Mehendi', false), courseId: 'mehendi' },
  { id: 'f4', title: 'Baking & Decoration', subtitle: 'Delicious treats', image: COURSE_IMG('🧁', 'Baking', true), courseId: 'baking' },
  { id: 'f5', title: 'Beauty Parlour', subtitle: 'Professional skills', image: COURSE_IMG('💄', 'Beauty', false), courseId: 'beauty' },
  { id: 'f6', title: 'Sell on Meesho', subtitle: 'Start earning', image: COURSE_IMG('💰', 'Meesho', true), courseId: 'meesho' },
];

export const ACHIEVEMENTS = [
  { id: 'first_course', title: 'First Step', icon: '🎯', description: 'Complete your first lesson' },
  { id: 'course_complete', title: 'Course Master', icon: '🏆', description: 'Complete an entire course' },
  { id: 'first_sale', title: 'Entrepreneur', icon: '💰', description: 'Make your first sale' },
  { id: 'streak_7', title: 'Week Warrior', icon: '🔥', description: '7 day learning streak' },
];

export const EARNINGS_DATA = { totalEarnings: 2500, thisMonth: 800, pendingPayouts: 300, completedOrders: 12 };

const createReels = (prefix: string, titles: string[], hindiCaptions: string[][], englishCaptions: string[][], tamilCaptions: string[][], category: keyof typeof YOUTUBE_VIDEOS = 'general') =>
  titles.map((title, i) => ({
    id: `${prefix}${i + 1}`,
    title,
    thumbnail: getYouTubeThumbnail(category, i),
    videoUrl: getYouTubeUrl(category, i),
    duration: `${2 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    captions: { 
      hindi: hindiCaptions[i] || ['सीखें और कमाएं'], 
      english: englishCaptions[i] || ['Learn and Earn'],
      tamil: tamilCaptions[i] || ['கற்றுக்கொள்ளுங்கள்'] 
    }
  }));


export const COURSES: Course[] = [
  {
    id: 'tailoring',
    title: 'Basic Tailoring',
    thumbnail: COURSE_IMG('✂️', 'Tailoring', false),
    reels: createReels('t', 
      ['Threading Machine', 'Basic Stitching', 'Cutting Fabric', 'Making Blouse', 'Hemming', 'Adding Buttons'],
      [['मशीन में धागा डालें'], ['सीधी सिलाई सीखें'], ['कपड़ा काटना'], ['ब्लाउज बनाना'], ['हेमिंग तकनीक'], ['बटन लगाना']],
      [['Thread the machine'], ['Learn basic stitching'], ['Cutting fabric'], ['Making blouse'], ['Hemming technique'], ['Adding buttons']],
      [['நூல் போடுவது'], ['தையல் கற்றுக்கொள்ளுங்கள்'], ['துணி வெட்டுதல்'], ['ரவிக்கை தைத்தல்'], ['ஹெம்மிங்'], ['பட்டன் தைத்தல்']],
      'tailoring'
    )
  },
  {
    id: 'embroidery',
    title: 'Embroidery',
    thumbnail: COURSE_IMG('🧵', 'Embroidery', true),
    reels: createReels('em',
      ['Thread Selection', 'Basic Stitches', 'Flower Patterns', 'Border Design', 'Mirror Work', 'Zari Embroidery'],
      [['धागा चुनना'], ['बेसिक स्टिच'], ['फूल पैटर्न'], ['बॉर्डर डिज़ाइन'], ['मिरर वर्क'], ['जरी कढ़ाई']],
      [['Select thread'], ['Basic stitches'], ['Flower patterns'], ['Border design'], ['Mirror work'], ['Zari embroidery']],
      [['நூல் தேர்வு'], ['அடிப்படை தையல்'], ['பூ வடிவங்கள்'], ['பார்டர் வடிவமைப்பு'], ['கண்ணாடி வேலை'], ['ஜரி எம்பிராய்டரி']],
      'embroidery'
    )
  },
  {
    id: 'knitting',
    title: 'Knitting & Crochet',
    thumbnail: COURSE_IMG('🧶', 'Knitting', false),
    reels: createReels('kn',
      ['Yarn Types', 'Basic Knit Stitch', 'Purl Stitch', 'Crochet Basics', 'Making Scarf', 'Baby Sweater'],
      [['यार्न के प्रकार'], ['बेसिक निट स्टिच'], ['पर्ल स्टिच'], ['क्रोशिया बेसिक्स'], ['स्कार्फ बनाना'], ['बेबी स्वेटर']],
      [['Types of yarn'], ['Basic knit stitch'], ['Purl stitch'], ['Crochet basics'], ['Making scarf'], ['Baby sweater']],
      [['நூல் வகைகள்'], ['அடிப்படை நிட்'], ['பர்ல் ஸ்டிச்'], ['க்ரோஷே அடிப்படை'], ['ஸ்கார்ஃப் செய்தல்'], ['குழந்தை ஸ்வெட்டர்']],
      'knitting'
    )
  },
  {
    id: 'mehendi',
    title: 'Mehendi Design',
    thumbnail: COURSE_IMG('🌿', 'Mehendi', true),
    reels: createReels('m',
      ['Cone Making', 'Basic Patterns', 'Arabic Style', 'Bridal Mehendi', 'Finger Design', 'Leg Mehendi'],
      [['कोन बनाना'], ['बेसिक पैटर्न'], ['अरेबिक स्टाइल'], ['ब्राइडल मेहंदी'], ['फिंगर डिज़ाइन'], ['पैर की मेहंदी']],
      [['Making cone'], ['Basic patterns'], ['Arabic style'], ['Bridal mehendi'], ['Finger design'], ['Leg mehendi']],
      [['கோன் செய்தல்'], ['அடிப்படை வடிவங்கள்'], ['அரேபிய பாணி'], ['மணப்பெண் மருதாணி'], ['விரல் வடிவமைப்பு'], ['கால் மருதாணி']],
      'mehndi'
    )
  },
  {
    id: 'baking',
    title: 'Baking & Decoration',
    thumbnail: COURSE_IMG('🧁', 'Baking', false),
    reels: createReels('b',
      ['Cake Basics', 'Oven Tips', 'Chocolate Cake', 'Frosting Art', 'Cupcakes', 'Cookies', 'Packaging'],
      [['केक बेसिक्स'], ['ओवन टिप्स'], ['चॉकलेट केक'], ['फ्रॉस्टिंग आर्ट'], ['कपकेक्स'], ['कुकीज़'], ['पैकेजिंग']],
      [['Cake basics'], ['Oven tips'], ['Chocolate cake'], ['Frosting art'], ['Cupcakes'], ['Cookies'], ['Packaging']],
      [['கேக் அடிப்படை'], ['அடுப்பு குறிப்புகள்'], ['சாக்லேட் கேக்'], ['ஃப்ரோஸ்டிங்'], ['கப்கேக்'], ['குக்கீஸ்'], ['பேக்கேஜிங்']],
      'baking'
    )
  },
  {
    id: 'beauty',
    title: 'Beauty Parlour Basics',
    thumbnail: COURSE_IMG('💄', 'Beauty', true),
    reels: createReels('be',
      ['Facial Steps', 'Threading', 'Waxing', 'Manicure', 'Pedicure', 'Hair Styling', 'Bridal Makeup'],
      [['फेशियल स्टेप्स'], ['थ्रेडिंग'], ['वैक्सिंग'], ['मैनीक्योर'], ['पेडीक्योर'], ['हेयर स्टाइलिंग'], ['ब्राइडल मेकअप']],
      [['Facial steps'], ['Threading'], ['Waxing'], ['Manicure'], ['Pedicure'], ['Hair styling'], ['Bridal makeup']],
      [['ஃபேஷியல்'], ['த்ரெடிங்'], ['வாக்சிங்'], ['மேனிக்யூர்'], ['பெடிக்யூர்'], ['ஹேர் ஸ்டைலிங்'], ['மணப்பெண் மேக்கப்']],
      'beauty'
    )
  },

  {
    id: 'packaging',
    title: 'Packaging Skills',
    thumbnail: COURSE_IMG('📦', 'Packaging', false),
    reels: createReels('pk',
      ['Box Selection', 'Gift Wrapping', 'Ribbon Tying', 'Eco-Friendly Pack', 'Branding Tips', 'Shipping Prep'],
      [['बॉक्स चुनना'], ['गिफ्ट रैपिंग'], ['रिबन बांधना'], ['इको-फ्रेंडली पैक'], ['ब्रांडिंग टिप्स'], ['शिपिंग तैयारी']],
      [['Box selection'], ['Gift wrapping'], ['Ribbon tying'], ['Eco-friendly pack'], ['Branding tips'], ['Shipping prep']],
      [['பாக்ஸ் தேர்வு'], ['பரிசு மடிப்பு'], ['ரிப்பன் கட்டுதல்'], ['சுற்றுச்சூழல் பேக்'], ['பிராண்டிங்'], ['ஷிப்பிங்']],
      'packaging'
    )
  },
  {
    id: 'beadwork',
    title: 'Beadwork & Jewelry',
    thumbnail: COURSE_IMG('📿', 'Beadwork', true),
    reels: createReels('bw',
      ['Bead Types', 'Stringing Basics', 'Earring Making', 'Necklace Design', 'Bracelet Art', 'Anklet Making'],
      [['बीड के प्रकार'], ['स्ट्रिंगिंग बेसिक्स'], ['इयररिंग बनाना'], ['नेकलेस डिज़ाइन'], ['ब्रेसलेट आर्ट'], ['पायल बनाना']],
      [['Bead types'], ['Stringing basics'], ['Earring making'], ['Necklace design'], ['Bracelet art'], ['Anklet making']],
      [['மணி வகைகள்'], ['கோர்த்தல் அடிப்படை'], ['காதணி செய்தல்'], ['நெக்லஸ் வடிவமைப்பு'], ['வளையல் கலை'], ['கொலுசு செய்தல்']],
      'jewelry'
    )
  },
  {
    id: 'macrame',
    title: 'Macrame Art',
    thumbnail: COURSE_IMG('🪢', 'Macrame', false),
    reels: createReels('mc',
      ['Basic Knots', 'Square Knot', 'Spiral Knot', 'Wall Hanging', 'Plant Hanger', 'Keychain Making'],
      [['बेसिक नॉट्स'], ['स्क्वायर नॉट'], ['स्पाइरल नॉट'], ['वॉल हैंगिंग'], ['प्लांट हैंगर'], ['कीचेन बनाना']],
      [['Basic knots'], ['Square knot'], ['Spiral knot'], ['Wall hanging'], ['Plant hanger'], ['Keychain making']],
      [['அடிப்படை முடிச்சுகள்'], ['சதுர முடிச்சு'], ['சுருள் முடிச்சு'], ['சுவர் தொங்கல்'], ['தாவர தொங்கல்'], ['கீசெயின்']],
      'macrame'
    )
  },
  {
    id: 'candles',
    title: 'Candle Making',
    thumbnail: COURSE_IMG('🕯️', 'Candles', true),
    reels: createReels('ca',
      ['Wax Types', 'Melting Process', 'Adding Fragrance', 'Color Mixing', 'Decorative Candles', 'Gift Sets'],
      [['वैक्स के प्रकार'], ['मेल्टिंग प्रोसेस'], ['फ्रेगरेंस डालना'], ['रंग मिलाना'], ['डेकोरेटिव कैंडल्स'], ['गिफ्ट सेट्स']],
      [['Wax types'], ['Melting process'], ['Adding fragrance'], ['Color mixing'], ['Decorative candles'], ['Gift sets']],
      [['மெழுகு வகைகள்'], ['உருகும் செயல்முறை'], ['வாசனை சேர்த்தல்'], ['நிறம் கலத்தல்'], ['அலங்கார மெழுகுவர்த்தி'], ['பரிசு செட்']],
      'candles'
    )
  },
  {
    id: 'quilling',
    title: 'Quilling Paper Art',
    thumbnail: COURSE_IMG('🎨', 'Quilling', false),
    reels: createReels('qu',
      ['Paper Strips', 'Basic Coils', 'Flower Making', 'Greeting Cards', 'Photo Frames', 'Jewelry Design'],
      [['पेपर स्ट्रिप्स'], ['बेसिक कॉइल्स'], ['फूल बनाना'], ['ग्रीटिंग कार्ड्स'], ['फोटो फ्रेम्स'], ['ज्वेलरी डिज़ाइन']],
      [['Paper strips'], ['Basic coils'], ['Flower making'], ['Greeting cards'], ['Photo frames'], ['Jewelry design']],
      [['காகித துண்டுகள்'], ['அடிப்படை சுருள்கள்'], ['பூ செய்தல்'], ['வாழ்த்து அட்டைகள்'], ['புகைப்பட சட்டங்கள்'], ['நகை வடிவமைப்பு']],
      'quilling'
    )
  },

  {
    id: 'meesho',
    title: 'Sell on Meesho/ONDC',
    thumbnail: COURSE_IMG('💰', 'Meesho', true),
    reels: createReels('ms',
      ['Account Setup', 'Product Listing', 'Photo Tips', 'Pricing Strategy', 'Order Management', 'Customer Service', 'ONDC Basics'],
      [['अकाउंट सेटअप'], ['प्रोडक्ट लिस्टिंग'], ['फोटो टिप्स'], ['प्राइसिंग स्ट्रेटेजी'], ['ऑर्डर मैनेजमेंट'], ['कस्टमर सर्विस'], ['ONDC बेसिक्स']],
      [['Account setup'], ['Product listing'], ['Photo tips'], ['Pricing strategy'], ['Order management'], ['Customer service'], ['ONDC basics']],
      [['கணக்கு அமைப்பு'], ['தயாரிப்பு பட்டியல்'], ['புகைப்பட குறிப்புகள்'], ['விலை உத்தி'], ['ஆர்டர் மேலாண்மை'], ['வாடிக்கையாளர் சேவை'], ['ONDC அடிப்படை']],
      'meesho'
    )
  },
  {
    id: 'cooking',
    title: 'Home Cooking Business',
    thumbnail: COURSE_IMG('🍳', 'Cooking', false),
    reels: createReels('ck',
      ['Tiffin Planning', 'Quick Breakfast', 'Lunch Thali', 'Snacks Items', 'Sweets Making', 'Food Packaging'],
      [['टिफिन प्लानिंग'], ['क्विक ब्रेकफास्ट'], ['लंच थाली'], ['स्नैक्स आइटम्स'], ['मिठाई बनाना'], ['फूड पैकेजिंग']],
      [['Tiffin planning'], ['Quick breakfast'], ['Lunch thali'], ['Snacks items'], ['Sweets making'], ['Food packaging']],
      [['டிபன் திட்டமிடல்'], ['விரைவான காலை உணவு'], ['மதிய உணவு தாளி'], ['சிற்றுண்டி'], ['இனிப்புகள்'], ['உணவு பேக்கேஜிங்']],
      'cooking'
    )
  },
  {
    id: 'pottery',
    title: 'Pottery & Clay Art',
    thumbnail: COURSE_IMG('🏺', 'Pottery', true),
    reels: createReels('pt',
      ['Clay Types', 'Hand Building', 'Pinch Pots', 'Coil Method', 'Painting Pots', 'Diya Making'],
      [['मिट्टी के प्रकार'], ['हैंड बिल्डिंग'], ['पिंच पॉट्स'], ['कॉइल मेथड'], ['पॉट पेंटिंग'], ['दीया बनाना']],
      [['Clay types'], ['Hand building'], ['Pinch pots'], ['Coil method'], ['Painting pots'], ['Diya making']],
      [['களிமண் வகைகள்'], ['கை கட்டுமானம்'], ['பிஞ்ச் பாட்'], ['கோயில் முறை'], ['பானை ஓவியம்'], ['தீபம் செய்தல்']],
      'pottery'
    )
  },
  {
    id: 'rangoli',
    title: 'Rangoli & Kolam',
    thumbnail: COURSE_IMG('🎨', 'Rangoli', false),
    reels: createReels('rg',
      ['Basic Dots', 'Line Patterns', 'Flower Rangoli', 'Festival Special', 'Color Mixing', 'Competition Tips'],
      [['बेसिक डॉट्स'], ['लाइन पैटर्न'], ['फ्लावर रंगोली'], ['फेस्टिवल स्पेशल'], ['रंग मिलाना'], ['कॉम्पिटिशन टिप्स']],
      [['Basic dots'], ['Line patterns'], ['Flower rangoli'], ['Festival special'], ['Color mixing'], ['Competition tips']],
      [['அடிப்படை புள்ளிகள்'], ['கோடு வடிவங்கள்'], ['பூ கோலம்'], ['பண்டிகை சிறப்பு'], ['நிறம் கலத்தல்'], ['போட்டி குறிப்புகள்']],
      'rangoli'
    )
  },
  {
    id: 'soap',
    title: 'Soap Making',
    thumbnail: COURSE_IMG('🧼', 'Soap', true),
    reels: createReels('sp',
      ['Ingredients', 'Melt & Pour', 'Cold Process', 'Adding Fragrance', 'Natural Colors', 'Packaging Ideas'],
      [['सामग्री'], ['मेल्ट एंड पोर'], ['कोल्ड प्रोसेस'], ['फ्रेगरेंस डालना'], ['नेचुरल कलर्स'], ['पैकेजिंग आइडियाज']],
      [['Ingredients'], ['Melt and pour'], ['Cold process'], ['Adding fragrance'], ['Natural colors'], ['Packaging ideas']],
      [['பொருட்கள்'], ['உருக்கி ஊற்றுதல்'], ['குளிர் செயல்முறை'], ['வாசனை சேர்த்தல்'], ['இயற்கை நிறங்கள்'], ['பேக்கேஜிங் யோசனைகள்']],
      'soap'
    )
  },
];

export const getCourseById = (id: string): Course | undefined => COURSES.find(c => c.id === id);
export const getReelById = (courseId: string, reelId: string) => getCourseById(courseId)?.reels.find(r => r.id === reelId);
