import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { storageProgress } from '@/lib/storage';
import {
  DAILY_PHRASES, LESSONS, getCurrentLevel, getNextLevel, LEVELS, POINTS,
} from '@shared/const';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Flame, Star, Trophy, CheckCircle2, Zap, BookOpen } from 'lucide-react';

const fade = {
  hidden:  { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.38 } }),
};

export default function Home() {
  const { language } = useLanguage();
  const [progress, setProgress]         = useState(storageProgress.get());
  const [answer, setAnswer]             = useState('');
  const [submitted, setSubmitted]       = useState(false);
  const [correct, setCorrect]           = useState(false);

  useEffect(() => { setProgress(storageProgress.get()); }, []);

  // Update streak on daily visit
  useEffect(() => {
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const p         = storageProgress.get();
    if (p.lastStudyDate !== today) {
      const newStreak = p.lastStudyDate === yesterday ? p.streak + 1 : 1;
      storageProgress.update({ lastStudyDate: today, streak: newStreak });
      setProgress(storageProgress.get());
    }
  }, []);

  const { points, streak, completedLessons } = progress;
  const currentLevel = getCurrentLevel(points);
  const nextLevel    = getNextLevel(points);
  const levelData    = LEVELS[currentLevel];

  // Daily phrase — cycles by day of year
  const doy         = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  const dailyPhrase = DAILY_PHRASES[doy % DAILY_PHRASES.length];

  // Challenge: complete last word of the phrase
  const words           = dailyPhrase.en.split(' ');
  const challengeAnswer = words.at(-1)!.replace(/[^a-zA-Z']/g, '');
  const prompt          = words.slice(0, -1).join(' ') + ' ___';

  const handleSubmit = () => {
    const ok = answer.trim().toLowerCase() === challengeAnswer.toLowerCase();
    setCorrect(ok);
    setSubmitted(true);
    const today = new Date().toDateString();
    if (ok && progress.dailyChallengeDate !== today) {
      storageProgress.update({
        points:                  points + POINTS.DAILY_CHALLENGE,
        dailyChallengeDate:      today,
        dailyChallengeCompleted: true,
      });
      setProgress(storageProgress.get());
    }
  };

  const progressPct = nextLevel
    ? Math.round(((points - levelData.minPoints) / (nextLevel.minPoints - levelData.minPoints)) * 100)
    : 100;

  const todayDone =
    progress.dailyChallengeCompleted &&
    progress.dailyChallengeDate === new Date().toDateString();

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-7">

      {/* Hero */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}
        className="flex items-center gap-4 flex-wrap">
        <span className="text-5xl select-none">🇬🇧</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            {language === 'en' ? 'Welcome, Saleem!' : 'أهلاً يا سليم!'}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {language === 'en'
              ? 'Coach Alex is proud of your progress. Keep it up!'
              : 'كوتش أليكس فخور بتقدمك. واصل!'}
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Flame      className="h-5 w-5 text-orange-500" />, value: streak,                  en: 'Day streak',     ar: 'أيام متتالية' },
          { icon: <Star       className="h-5 w-5 text-yellow-500" />, value: points,                  en: 'Total points',   ar: 'إجمالي النقاط' },
          { icon: <Trophy     className="h-5 w-5 text-primary"    />, value: `${levelData.icon} ${levelData.name}`, en: 'Level', ar: 'المستوى' },
          { icon: <CheckCircle2 className="h-5 w-5 text-green-500" />, value: completedLessons.length, en: 'Lessons done',  ar: 'دروس مكتملة' },
        ].map((s, i) => (
          <motion.div key={i} initial="hidden" animate="visible" variants={fade} custom={i + 1}>
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-4 pb-3 flex flex-col items-center gap-1">
                {s.icon}
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{language === 'en' ? s.en : s.ar}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Level progress */}
      {nextLevel && (
        <motion.div initial="hidden" animate="visible" variants={fade} custom={5}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                {language === 'en'
                  ? `Progress to ${nextLevel.name} ${nextLevel.icon}`
                  : `التقدم نحو ${nextLevel.nameAr} ${nextLevel.icon}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Progress value={progressPct} className="h-2.5" />
              <p className="text-xs text-muted-foreground">
                {language === 'en'
                  ? `${nextLevel.minPoints - points} points to go`
                  : `${nextLevel.minPoints - points} نقطة متبقية`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Daily phrase */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={6}>
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm flex items-center gap-2">
              🗣️ {language === 'en' ? "Today's Phrase" : 'عبارة اليوم'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-xl font-bold text-primary">{dailyPhrase.en}</p>
            <p className="text-xs text-muted-foreground font-mono">{dailyPhrase.phonetic}</p>
            <p className="text-base">{dailyPhrase.ar}</p>
            <p className="text-xs text-muted-foreground italic">{dailyPhrase.meaning}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily challenge */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={7}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              {language === 'en' ? 'Daily Challenge' : 'التحدي اليومي'}
              {todayDone && (
                <span className="ms-auto text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  {language === 'en' ? '✓ Done' : '✓ مكتمل'}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayDone ? (
              <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                {language === 'en'
                  ? `🎉 Great job! +${POINTS.DAILY_CHALLENGE} pts earned today.`
                  : `🎉 أحسنت! +${POINTS.DAILY_CHALLENGE} نقطة مكتسبة.`}
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Complete the phrase:' : 'أكمل العبارة:'}
                  {' '}<span className="font-medium text-foreground">"{prompt}"</span>
                </p>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={language === 'en' ? 'Your answer…' : 'إجابتك…'}
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmit()}
                    disabled={submitted}
                  />
                  <Button size="sm" onClick={handleSubmit} disabled={submitted || !answer.trim()}>
                    {language === 'en' ? 'Submit' : 'إرسال'}
                  </Button>
                </div>
                {submitted && (
                  <p className={`text-sm font-medium ${correct ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                    {correct
                      ? (language === 'en' ? `✅ Correct! +${POINTS.DAILY_CHALLENGE} pts` : `✅ صحيح! +${POINTS.DAILY_CHALLENGE} نقطة`)
                      : (language === 'en' ? `❌ Try again. Answer: "${challengeAnswer}"` : `❌ حاول مجدداً. الإجابة: "${challengeAnswer}"`)}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick links */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={8}>
        <h2 className="font-semibold mb-3">
          {language === 'en' ? 'Continue Learning' : 'واصل التعلم'}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { href: '/lessons',     icon: '📖', en: 'Lessons',     ar: 'الدروس'          },
            { href: '/vocabulary',  icon: '💬', en: 'Vocabulary',  ar: 'المفردات'        },
            { href: '/practice',    icon: '⚡', en: 'Practice',    ar: 'التمارين'        },
            { href: '/journey',     icon: '🗺️', en: 'My Journey',  ar: 'رحلتي'          },
            { href: '/weekly-plan', icon: '📅', en: 'Weekly Plan', ar: 'الخطة الأسبوعية' },
            { href: '/badges',      icon: '🏅', en: 'Badges',      ar: 'الشارات'         },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <a className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-accent transition-all text-sm font-medium">
                <span className="text-lg">{item.icon}</span>
                {language === 'en' ? item.en : item.ar}
              </a>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent lessons preview */}
      <motion.div initial="hidden" animate="visible" variants={fade} custom={9}>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          {language === 'en' ? 'Week 1 Lessons' : 'دروس الأسبوع الأول'}
        </h2>
        <div className="space-y-2">
          {LESSONS.map(lesson => {
            const done = completedLessons.includes(lesson.id);
            return (
              <Link key={lesson.id} href="/lessons">
                <a className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-accent transition-all">
                  <span className="text-2xl">{lesson.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {language === 'en' ? lesson.titleEn : lesson.titleAr}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {language === 'en' ? lesson.descriptionEn : lesson.descriptionAr}
                    </p>
                  </div>
                  {done
                    ? <span className="text-green-500 text-lg">✅</span>
                    : <span className="text-muted-foreground text-sm">›</span>}
                </a>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}