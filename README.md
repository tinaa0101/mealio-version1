# Mealio — MVP v1

**Your kitchen's brain, not a recipe box.**

Mealio is a daily-use decision engine for homemakers, built to answer the question that never ends: *"What should I cook?"* This is not a recipe app — it's a system that knows what's in your kitchen, what's expiring, your energy and mood today, and your dietary needs, and tells you exactly what to make.

## What this MVP demonstrates

A single end-to-end flow, built as an interactive React component:

1. **Kitchen preferences (one-time setup)** — vegetarian / eggetarian / vegan / non-vegetarian (mandatory, never assumed), plus a diet style (balanced, high-protein, keto, diabetic-friendly, gluten-free).
2. **Kitchen setup** — household staples (rice, lentils, dairy, etc. — voice/text addable) and today's specific ingredients, with expiring items flagged.
3. **Daily check-in** — energy level, mood, and time available, defaulting to sensible values to keep this fast.
4. **Next Hour vs. Next Day** — a segmented control that toggles between getting one immediate dish recommendation or a full breakfast/lunch/dinner plan.
5. **Results** — a browsable carousel of ranked meal options per slot, each with:
   - Per-meal nutrition (protein/carbs/fat + key micronutrients)
   - Automatically suggested no-cook accompaniments based on staples on hand (raita, chaas, protein shake, etc.)
   - A "Missing groceries?" panel with one-tap order links to Zepto, Blinkit, and Instamart for anything not already in the kitchen
   - A YouTube recipe search link
   - A favorite/heart toggle that influences future ranking

All scoring logic (energy match, time match, expiring-ingredient priority, dietary filtering) runs client-side with mock data — structured so a real backend/ingredient database can be swapped in later.

## Tech

- React (functional components, hooks)
- Tailwind CSS utility classes
- lucide-react icons + Google Material Symbols (variable font)
- No external state/data libraries — all state is local component state for this MVP stage

## Running this

This file (`src/App.jsx`) is built as a single self-contained component, originally created and tested as a Claude.ai React artifact. To run it locally:

1. Create a new React app (e.g. via Vite: `npm create vite@latest mealio -- --template react`)
2. Replace the generated `src/App.jsx` with this file
3. Install dependencies: `npm install lucide-react`
4. Add Tailwind CSS to the project ([Tailwind + Vite setup guide](https://tailwindcss.com/docs/guides/vite))
5. `npm run dev`

## Status

Early MVP — built to demonstrate the core decision-engine flow for investor review. Next iterations planned: persistent backend (replacing mock dish data and in-session-only favorites), real grocery delivery API integrations (currently illustrative search-link patterns), and the remaining product surfaces described in the original Mealio spec (leftover transformations, guest scaling, festival/weather awareness, budget tracking).
