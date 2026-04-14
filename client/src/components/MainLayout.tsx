import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme }    from '@/contexts/ThemeContext';
import { cn }          from '@/lib/utils';
import { Moon, Sun, Globe } from 'lucide-react';

const NAV = [
  { href: '/',            icon: '🏠', en: 'Home',     ar: 'الرئيسية'      },
  { href: '/lessons',     icon: '📖', en: 'Lessons',  ar: 'الدروس'        },
  { href: '/vocabulary',  icon: '💬', en: 'Vocab',    ar: 'المفردات'      },
  { href: '/practice',    icon: '⚡', en: 'Practice', ar: 'التمارين'      },
  { href: '/journey',     icon: '🗺️', en: 'Journey',  ar: 'رحلتي'        },
  { href: '/weekly-plan', icon: '📅', en: 'Plan',     ar: 'الخطة'         },
  { href: '/badges',      icon: '🏅', en: 'Badges',   ar: 'الشارات'       },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme }    = useTheme();
  const [location]                = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Top header ───────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link href="/">
            <a className="flex items-center gap-2 font-extrabold text-lg select-none">
              🇬🇧
              <span className="hidden sm:inline text-primary">Saleem's Academy</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4" />
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun  className="h-4 w-4" />
                : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* ── Desktop sidebar ──────────────────────────────── */}
        <aside className="hidden sm:flex fixed left-0 top-14 bottom-0 w-52 border-r border-border bg-background/95 flex-col gap-1 p-3 overflow-y-auto z-40">
          {NAV.map(item => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                )}>
                  <span className="text-base">{item.icon}</span>
                  {language === 'en' ? item.en : item.ar}
                </a>
              </Link>
            );
          })}
        </aside>

        {/* ── Main content ─────────────────────────────────── */}
        <main className="flex-1 sm:ml-52 min-h-[calc(100vh-3.5rem)] pb-20 sm:pb-8">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {NAV.slice(0, 5).map(item => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn(
                  'flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}>
                  <span className="text-lg leading-none">{item.icon}</span>
                  {language === 'en' ? item.en : item.ar}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}