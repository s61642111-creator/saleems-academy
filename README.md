# Saleem's British English Academy 🇬🇧

A full-stack British English learning app built with **React 19 + Express + tRPC + Drizzle + MySQL**.

## ✨ Features
- 📖 **6 Lessons** with quizzes and instant scoring
- 💬 **Vocabulary Flashcards** with flip animation
- ⚡ **Practice Exercises** — 4 types (fill-blank, MCQ, correct sentence, word order)
- 🗺️ **Journey Tracker** — mistake tracking with red/yellow/green status
- 📅 **Weekly Plan** — 7-day checklist with progress tracking
- 🏅 **Badges & Levels** — Bronze → Silver → Gold → Diamond → Crown
- 🌙 **Dark Mode** + 🇸🇦 Arabic/English bilingual UI

## 🛠️ Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| UI Components | shadcn/ui (New York), Framer Motion |
| Router | wouter |
| Backend | Express, tRPC v11 |
| Database | MySQL + Drizzle ORM |
| Language | TypeScript |

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Init shadcn/ui
npx shadcn@latest init

# 3. Set environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Run dev server
npm run dev
```

## 📁 Project Structure

```
saleems-academy/
├── client/src/
│   ├── pages/          # Home, Lessons, Vocabulary, Practice, Journey, WeeklyPlan, Badges
│   ├── components/     # MainLayout, Header, ErrorBoundary
│   ├── contexts/       # ThemeContext, LanguageContext
│   └── lib/            # storage, trpc, utils, i18n
├── server/             # Express + tRPC routers + Drizzle DB
├── shared/             # const.ts — lessons, vocab, badges, levels
└── drizzle/            # SQL migrations
```

## 🌐 Deploy

### Vercel (Frontend only)
```bash
npm run build
npx vercel --prod
```

### Railway (Full-stack with MySQL)
1. Connect GitHub repo to [Railway](https://railway.app)
2. Add MySQL plugin
3. Set `DATABASE_URL` environment variable
4. Deploy ✅

---
Made with ❤️ for Saleem | British English · STEP Prep · Aramco Ready