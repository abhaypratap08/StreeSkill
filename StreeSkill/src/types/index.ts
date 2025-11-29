export interface Reel {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  captions: {
    hindi: string[];
    english: string[];
    tamil: string[];
  };
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  reels: Reel[];
}

export interface Progress {
  completedReels: Record<string, string[]>;
}

export interface ProductListing {
  image: string | null;
  name: string;
  description: string;
  price: string;
}

export type Language = 'hindi' | 'english' | 'tamil';

export interface AppContextType {
  progress: Progress;
  language: Language;
  markReelComplete: (courseId: string, reelId: string) => void;
  toggleLanguage: () => void;
  getProgress: (courseId: string, totalReels: number) => { completed: number; total: number };
}
