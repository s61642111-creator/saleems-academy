import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { storageProgress } from '@/lib/storage';
import { VOCABULARY, type VocabItem } from '@shared/const';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { key: 'all',      en: 'All',      ar: 'الكل'      },
  { key: 'slang',    en: 'Slang',    ar: 'عامية'     },
  { key: 'car',      en: 'Cars',     ar: 'سيارات'    },
  { key: 'hospital', en: 'Hospital', ar: 'مستشفى'   },
  { key: 'phrases',  en: 'Phrases',  ar: 'عبارات'   },
] as const;

function FlipCard({ item, done, onFlip }: { item: VocabItem; done: boolean; onFlip: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const { language } = useLanguage();

  const handleFlip = () => {
    setFlipped(f => !f);
    if (!flipped) onFlip();
  };

  return (
    <div className="flip-card h-44 cursor-pointer select-none" onClick={handleFlip}>
      <div className={`flip-card-inner h-full ${flipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="flip-card-front flex flex-col items-center justify-center p-4 bg-card border border-border rounded-xl shadow-sm">
          {done && <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-green-500" />}
          <p className="text-4xl mb-2">🇬🇧</p>
          <p className="text-lg font-bold text-center text-primary">{item.en}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {language === 'en' ? 'Tap to flip' : 'اضغط للقلب'}
          </p>
        </div>
        {/* Back */}
        <div className="flip-card-back flex flex-col items-center justify-center p-4 bg-primary text-primary-foreground rounded-xl shadow-sm">
          <p className="text-xl font-bold text-center mb-1">{item.ar}</p>
          <p className="text-xs text-center opacity-80 leading-relaxed">{item.example}</p>
        </div>
      </div>
    </div>
  );
}

export default function Vocabulary() {
  const { language }                = useLanguage();
  const [cat, setCat]               = useState<string>('all');
  const [progress, setProgress]     = useState(storageProgress.get());

  const filtered = cat === 'all' ? VOCABULARY : VOCABULARY.filter(v => v.category === cat);

  const handleFlip = (id: string) => {
    const p = storageProgress.get();
    if (!p.completedVocab.includes(id)) {
      storageProgress.update({ completedVocab: [...p.completedVocab, id] });
      setProgress(storageProgress.get());
    }
  };

  const seenCount = filtered.filter(v => progress.completedVocab.includes(v.id)).length;

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">
          {language === 'en' ? '💬 Vocabulary' : '💬 المفردات'}
        </h1>
        <span className="text-sm text-muted-foreground">
          {seenCount}/{filtered.length} {language === 'en' ? 'seen' : 'شاهدت'}
        </span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              'px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all',
              cat === c.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:border-primary'
            )}
          >
            {language === 'en' ? c.en : c.ar}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ delay: i * 0.04 }}
            >
              <FlipCard
                item={item}
                done={progress.completedVocab.includes(item.id)}
                onFlip={() => handleFlip(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {seenCount === filtered.length && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <p className="text-2xl mb-1">🎉</p>
          <p className="font-bold text-green-600 dark:text-green-400">
            {language === 'en'
              ? 'Brilliant! You\'ve seen all cards!'
              : 'رائع! شاهدت جميع البطاقات!'}
          </p>
        </motion.div>
      )}
    </div>
  );
}