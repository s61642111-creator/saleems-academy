import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { storageProgress } from '@/lib/storage';
import { LESSONS, POINTS } from '@shared/const';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

type Tab = 'lesson' | 'examples' | 'mistakes' | 'quiz';

export default function Lessons() {
  const { language } = useLanguage();
  const [idx, setIdx]           = useState(0);
  const [tab, setTab]           = useState<Tab>('lesson');
  const [selected, setSelected] = useState<number | null>(null);
  const [quizDone, setQuizDone] = useState(false);
  const [progress, setProgress] = useState(storageProgress.get());

  const lesson = LESSONS[idx];

  const handleNext = () => {
    setIdx(i => Math.min(i + 1, LESSONS.length - 1));
    setTab('lesson'); setSelected(null); setQuizDone(false);
  };
  const handlePrev = () => {
    setIdx(i => Math.max(i - 1, 0));
    setTab('lesson'); setSelected(null); setQuizDone(false);
  };

  const handleLessonComplete = () => {
    const p = storageProgress.get();
    if (!p.completedLessons.includes(lesson.id)) {
      storageProgress.update({
        completedLessons: [...p.completedLessons, lesson.id],
        points: p.points + POINTS.LESSON_COMPLETE,
      });
      setProgress(storageProgress.get());
    }
    setTab('quiz');
  };

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizDone) return;
    setSelected(optionIdx);
    setQuizDone(true);
    if (optionIdx === lesson.correctAnswer) {
      const p = storageProgress.get();
      const prev = p.quizScores[lesson.id] ?? 0;
      if (prev < 100) {
        storageProgress.update({
          points: p.points + POINTS.QUIZ_COMPLETE,
          quizScores: { ...p.quizScores, [lesson.id]: 100 },
        });
        setProgress(storageProgress.get());
      }
    }
  };

  const done = progress.completedLessons.includes(lesson.id);

  const TABS: { key: Tab; en: string; ar: string }[] = [
    { key: 'lesson',   en: 'Lesson',   ar: 'الدرس'    },
    { key: 'examples', en: 'Examples', ar: 'أمثلة'     },
    { key: 'mistakes', en: 'Mistakes', ar: 'أخطاء'     },
    { key: 'quiz',     en: 'Quiz',     ar: 'اختبار'   },
  ];

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          {language === 'en' ? '📖 Lessons' : '📖 الدروس'}
        </h1>
        <span className="text-sm text-muted-foreground">
          {idx + 1} / {LESSONS.length}
        </span>
      </div>

      {/* Lesson selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {LESSONS.map((l, i) => {
          const isDone = progress.completedLessons.includes(l.id);
          return (
            <button
              key={l.id}
              onClick={() => { setIdx(i); setTab('lesson'); setSelected(null); setQuizDone(false); }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all',
                i === idx
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary',
              )}
            >
              {l.icon} {language === 'en' ? l.titleEn : l.titleAr}
              {isDone && <span className="text-green-400">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={lesson.id + tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            {/* Tabs */}
            <div className="flex border-b border-border">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    'flex-1 py-3 text-xs font-semibold transition-colors',
                    tab === t.key
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {language === 'en' ? t.en : t.ar}
                </button>
              ))}
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">{lesson.icon}</span>
                <div>
                  <p className="text-lg font-extrabold">
                    {language === 'en' ? lesson.titleEn : lesson.titleAr}
                  </p>
                  <p className="text-sm text-muted-foreground font-normal">
                    {language === 'en' ? lesson.descriptionEn : lesson.descriptionAr}
                  </p>
                </div>
                {done && <CheckCircle2 className="h-5 w-5 text-green-500 ms-auto shrink-0" />}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Lesson tab */}
              {tab === 'lesson' && (
                <div className="space-y-4">
                  <p className="leading-relaxed text-sm">
                    {language === 'en' ? lesson.contentEn : lesson.contentAr}
                  </p>
                  {!done && (
                    <Button className="w-full" onClick={handleLessonComplete}>
                      {language === 'en' ? `✓ Mark Complete (+${POINTS.LESSON_COMPLETE} pts)` : `✓ اكتملت الدرس (+${POINTS.LESSON_COMPLETE} نقطة)`}
                    </Button>
                  )}
                </div>
              )}

              {/* Examples tab */}
              {tab === 'examples' && (
                <ul className="space-y-3">
                  {lesson.examples.map((ex, i) => (
                    <li key={i} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <p className="font-semibold text-primary text-sm">{ex.en}</p>
                      <p className="text-muted-foreground text-sm mt-0.5">{ex.ar}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Mistakes tab */}
              {tab === 'mistakes' && (
                <ul className="space-y-3">
                  {lesson.mistakes.map((m, i) => (
                    <li key={i} className="p-3 rounded-xl border border-border space-y-1">
                      <p className="text-destructive text-sm line-through">❌ {m.wrong}</p>
                      <p className="text-green-600 dark:text-green-400 text-sm">✅ {m.correct}</p>
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? m.noteEn : m.noteAr}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {/* Quiz tab */}
              {tab === 'quiz' && (
                <div className="space-y-4">
                  <p className="font-semibold text-sm">
                    {language === 'en' ? lesson.quizQuestion : lesson.quizQuestionAr}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {lesson.quizOptions.map((opt, i) => {
                      const isCorrect = i === lesson.correctAnswer;
                      const isSelected = i === selected;
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(i)}
                          disabled={quizDone}
                          className={cn(
                            'px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                            !quizDone && 'hover:border-primary hover:bg-accent',
                            quizDone && isCorrect  && 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400',
                            quizDone && isSelected && !isCorrect && 'bg-red-100 dark:bg-red-900/40 border-destructive text-destructive',
                            !quizDone && 'border-border'
                          )}
                        >
                          {language === 'en' ? opt : lesson.quizOptionsAr[i]}
                        </button>
                      );
                    })}
                  </div>
                  {quizDone && (
                    <p className={`text-sm font-medium ${
                      selected === lesson.correctAnswer
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-destructive'
                    }`}>
                      {selected === lesson.correctAnswer
                        ? (language === 'en' ? `🎉 Correct! +${POINTS.QUIZ_COMPLETE} pts` : `🎉 صحيح! +${POINTS.QUIZ_COMPLETE} نقطة`)
                        : (language === 'en'
                            ? `❌ Wrong. Correct: "${lesson.quizOptions[lesson.correctAnswer]}"`
                            : `❌ خطأ. الصحيح: "${lesson.quizOptions[lesson.correctAnswer]}"`)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={idx === 0}>
          <ChevronLeft className="h-4 w-4 me-1" />
          {language === 'en' ? 'Previous' : 'السابق'}
        </Button>
        <div className="flex gap-1.5">
          {LESSONS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setTab('lesson'); }}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === idx ? 'bg-primary w-4' : 'bg-border hover:bg-muted-foreground'
              )}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={idx === LESSONS.length - 1}>
          {language === 'en' ? 'Next' : 'التالي'}
          <ChevronRight className="h-4 w-4 ms-1" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          {language === 'en'
            ? `${progress.completedLessons.length}/${LESSONS.length} lessons completed`
            : `${progress.completedLessons.length}/${LESSONS.length} درس مكتمل`}
        </p>
        <Progress value={(progress.completedLessons.length / LESSONS.length) * 100} className="h-2" />
      </div>
    </div>
  );
}