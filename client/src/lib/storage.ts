const PROGRESS_KEY = 'saleem_academy_progress';
const LANGUAGE_KEY = 'saleem_academy_language';
const THEME_KEY    = 'saleem_academy_theme';

export interface UserProgress {
  points:                  number;
  streak:                  number;
  lastStudyDate:           string | null;
  level:                   string;
  completedLessons:        string[];
  completedVocab:          string[];
  completedExercises:      string[];
  earnedBadges:            string[];
  weeklyPlanCompleted:     Record<string, boolean>;
  dailyChallengeDate:      string | null;
  dailyChallengeCompleted: boolean;
  quizScores:              Record<string, number>;
}

const defaultProgress: UserProgress = {
  points: 0, streak: 0, lastStudyDate: null, level: 'bronze',
  completedLessons: [], completedVocab: [], completedExercises: [],
  earnedBadges: [], weeklyPlanCompleted: {},
  dailyChallengeDate: null, dailyChallengeCompleted: false, quizScores: {},
};

export const storageProgress = {
  get(): UserProgress {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      return raw ? { ...defaultProgress, ...JSON.parse(raw) } : { ...defaultProgress };
    } catch { return { ...defaultProgress }; }
  },
  set(p: UserProgress)                    { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); },
  update(partial: Partial<UserProgress>) { this.set({ ...this.get(), ...partial }); },
  reset()                                { localStorage.removeItem(PROGRESS_KEY); },
};

export const storageLanguage = {
  get(): 'en' | 'ar' { return (localStorage.getItem(LANGUAGE_KEY) as 'en' | 'ar') ?? 'en'; },
  set(lang: 'en' | 'ar') { localStorage.setItem(LANGUAGE_KEY, lang); },
};

export const storageTheme = {
  get(): 'light' | 'dark' { return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'light'; },
  set(theme: 'light' | 'dark') { localStorage.setItem(THEME_KEY, theme); },
};