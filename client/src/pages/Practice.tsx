import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { storageProgress } from '@/lib/storage';
import { EXERCISES, POINTS } from '@shared/const';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type State = 'idle' | 'correct' | 'wrong';

export default function Practice() {
  const { language }              = useLanguage();
  const [exIdx, setExIdx]         = useState(0);
  const [inputVal, setInputVal]   = useState('');
  const [selected, setSelected]   = useState<number | null>(null);
  const [wordOrder, setWordOrder]  = useState<string[]>([]);
  const [state, setState]         = useState<State>('idle');
  const [score, setScore]         = useState(0);
  const [finished, setFinished]   = useState(false);
  const [progress, setProgress]   = useState(storageProgress.get());

  const ex = EXERCISES[exIdx];

  // Shuffle words for word-order on mount / exercise change
  const initWordOrder = useCallback((words: string[]) => {
    setWordOrder([...words].sort(() => Math.random() - 0.5));
  }, []);

  // When exercise changes, reset
  const goToEx = (i: number) => {
    setExIdx(i); setInputVal(''); setSelected(null);
    setState('idle');
    const next = EXERCISES[i];
    if (next.type === 'word-order' && next.words) initWordOrder(next.words);
  };

  // Check answers
  const check = () => {
    let correct = false;
    if (ex.type === 'fill-blank' || ex.type === 'correct-sentence') {
      correct = inputVal.trim().toLowerCase() === ex.answer.toLowerCase();
    } else if (ex.type === 'multiple-choice') {
      correct = ex.options![selected!] === ex.answer;
    } else if (ex.type === 'word-order') {
      correct = wordOrder.join(' ') === ex.answer;
    }
    setState(correct ? 'correct' : 'wrong');
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      const p = storageProgress.get();
      if (!p.completedExercises.includes(ex.id)) {
        storageProgress.update({
          completedExercises: [...p.completedExercises, ex.id],
          points: p.points + POINTS.EXERCISE_COMPLETE,
        });
        setProgress(storageProgress.get());
      }
    }
  };

  const next = () => {
    if (exIdx + 1 >= EXERCISES.length) { setFinished(true); return; }
    goToEx(exIdx + 1);
  };

  const restart = () => {
    setExIdx(0); setScore(0); setFinished(false);
    setInputVal(''); setSelected(null); setState('idle');
    const first = EXERCISES[0];
    if (first.type === 'word-order' && first.words) initWordOrder(first.words);
  };

  if (finished) return (
    <div className="container max-w-md mx-auto px-4 py-16 text-center space-y-5">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <p className="text-6xl">{score === EXERCISES.length ? '🏆' : '💪'}</p>
      </motion.div>
      <h2 className="text-2xl font-extrabold">
        {language === 'en' ? 'Practice Complete!' : 'اكتملت التمارين!'}
      </h2>
      <p className="text-4xl font-bold text-primary">{score}/{EXERCISES.length}</p>
      <p className="text-muted-foreground text-sm">
        {score === EXERCISES.length
          ? (language === 'en' ? 'Perfect score! Brilliant!' : 'درجة كاملة! رائع!')
          : (language === 'en' ? 'Good effort! Keep practising.' : 'جهد ممتاز! واصل التدريب.')}
      </p>
      <Button onClick={restart} className="w-full">
        {language === 'en' ? '🔄 Practice Again' : '🔄 ابدأ من جديد'}
      </Button>
    </div>
  );

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          {language === 'en' ? '⚡ Practice' : '⚡ التمارين'}
        </h1>
        <span className="font-bold text-primary">{score}/{EXERCISES.length}</span>
      </div>

      {/* Progress */}
      <Progress value={((exIdx) / EXERCISES.length) * 100} className="h-2" />

      {/* Exercise card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ex.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.22 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  ex.difficulty === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  ex.difficulty === 2 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                )}>
                  {ex.difficulty === 1 ? '🟢' : ex.difficulty === 2 ? '🟡' : '🔴'}
                  {' '}{language === 'en'
                    ? ['Easy','Medium','Hard'][ex.difficulty - 1]
                    : ['سهل','متوسط','صعب'][ex.difficulty - 1]}
                </span>
                <span className="text-xs text-muted-foreground capitalize">{ex.type.replace('-', ' ')}</span>
              </div>
              <CardTitle className="text-base mt-2">
                {language === 'en' ? ex.questionEn : ex.questionAr}
              </CardTitle>
              {ex.sentenceEn && (
                <p className="text-sm italic text-muted-foreground mt-1">
                  {language === 'en' ? ex.sentenceEn : ex.sentenceAr}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">

              {/* fill-blank or correct-sentence */}
              {(ex.type === 'fill-blank' || ex.type === 'correct-sentence') && (
                <input
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={language === 'en' ? 'Type your answer…' : 'اكتب إجابتك…'}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && state === 'idle' && inputVal.trim() && check()}
                  disabled={state !== 'idle'}
                />
              )}

              {/* multiple-choice */}
              {ex.type === 'multiple-choice' && (
                <div className="grid grid-cols-2 gap-2">
                  {ex.options!.map((opt, i) => {
                    const isCorrect  = opt === ex.answer;
                    const isSelected = i === selected;
                    return (
                      <button
                        key={i}
                        onClick={() => state === 'idle' && setSelected(i)}
                        className={cn(
                          'px-3 py-3 rounded-xl border text-sm font-medium transition-all text-start',
                          state === 'idle' && selected === i && 'border-primary bg-primary/10',
                          state === 'idle' && selected !== i && 'border-border hover:border-primary',
                          state !== 'idle' && isCorrect  && 'bg-green-100 dark:bg-green-900/40 border-green-500 text-green-700 dark:text-green-400',
                          state !== 'idle' && isSelected && !isCorrect && 'bg-red-100 dark:bg-red-900/40 border-destructive text-destructive',
                          state !== 'idle' && !isSelected && !isCorrect && 'opacity-50 border-border'
                        )}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* word-order */}
              {ex.type === 'word-order' && (
                <div className="space-y-3">
                  {/* Answer area */}
                  <div className="min-h-12 p-3 rounded-xl border-2 border-dashed border-border flex flex-wrap gap-2">
                    {wordOrder.map((w, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (state !== 'idle') return;
                          const arr = [...wordOrder];
                          arr.splice(i, 1);
                          setWordOrder(arr);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        {w}
                      </button>
                    ))}
                    {wordOrder.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        {language === 'en' ? 'Tap words below to add…' : 'اضغط على الكلمات أدناه…'}
                      </p>
                    )}
                  </div>
                  {/* Word bank */}
                  <div className="flex flex-wrap gap-2">
                    {ex.words!.filter(w => !wordOrder.includes(w) ||
                      ex.words!.filter(x => x === w).length > wordOrder.filter(x => x === w).length
                    ).map((w, i) => (
                      <button
                        key={i}
                        onClick={() => state === 'idle' && setWordOrder(prev => [...prev, w])}
                        className="px-2.5 py-1 rounded-lg border border-border text-sm hover:border-primary hover:bg-accent transition-all"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              {state !== 'idle' && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm font-medium ${state === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}
                >
                  {state === 'correct'
                    ? (language === 'en' ? `✅ Correct! +${POINTS.EXERCISE_COMPLETE} pts` : `✅ صحيح! +${POINTS.EXERCISE_COMPLETE} نقطة`)
                    : (language === 'en' ? `❌ Wrong. Correct answer: "${ex.answer}"` : `❌ خطأ. الإجابة: "${ex.answer}"`)}
                </motion.p>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                {state === 'idle' ? (
                  <Button
                    className="flex-1"
                    onClick={check}
                    disabled={
                      (ex.type === 'fill-blank' || ex.type === 'correct-sentence') ? !inputVal.trim() :
                      (ex.type === 'multiple-choice') ? selected === null :
                      wordOrder.length !== (ex.words?.length ?? 0)
                    }
                  >
                    {language === 'en' ? 'Check' : 'تحقّق'}
                  </Button>
                ) : (
                  <Button className="flex-1" onClick={next}>
                    {exIdx + 1 >= EXERCISES.length
                      ? (language === 'en' ? 'Finish 🎉' : 'إنهاء 🎉')
                      : (language === 'en' ? 'Next ›'     : 'التالي ›')}
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Exercise dots */}
      <div className="flex justify-center gap-1.5">
        {EXERCISES.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 rounded-full transition-all',
              i < exIdx  ? 'w-2 bg-green-500' :
              i === exIdx ? 'w-4 bg-primary' :
              'w-2 bg-border'
            )}
          />
        ))}
      </div>
    </div>
  );
}