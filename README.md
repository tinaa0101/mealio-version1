# Mealio — v2

**Your kitchen's brain, not a recipe box.**

## What's new in v2

- Splash screen + 3-slide onboarding
- Phone + OTP login flow
- Leftovers screen with +/- quantity and automatic transformation suggestions (e.g. leftover dal → dal paratha)
- Redesigned preferences screen with emojis, "Choose your orientation" language, soft colour palette throughout
- Delivery app order links (Zepto, Blinkit, Instamart) toned down to subtle pill style
- Full diet+veg consistency: gluten-free hides wheat flour everywhere, vegan hides dairy/eggs everywhere — including pantry chips and staples
- "New day" button replaces "Start over" — preserves preferences, resets daily inputs
- Nutritionist-aware dish scoring: energy level and time budget dominate suggestions

## Running locally

1. `npm install`
2. `npm run dev`

## Deploying to Vercel

Push to GitHub and import the repo in Vercel. It will auto-detect Vite. No extra config needed — `"type": "module"` is set in `package.json` to suppress the PostCSS warning.

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- lucide-react icons
- Google Material Symbols (variable font, CDN)
- Google Fonts: Plus Jakarta Sans (headings) + Roboto (body)
