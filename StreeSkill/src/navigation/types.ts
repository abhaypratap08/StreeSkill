export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  Profile: undefined;
  Settings: undefined;
  CourseDetail: { courseId: string; courseTitle: string };
  ReelPlayer: { courseId: string; reelId: string };
  YouTubePlayer: { videoId: string; title: string; channelTitle?: string };
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Community: undefined;
  Sell: undefined;
};
