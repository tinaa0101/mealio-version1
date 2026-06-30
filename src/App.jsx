import React, { useState, useMemo, useEffect } from "react";
import { Mic, Plus, X, Clock, ChevronLeft, ChevronRight, Heart, PlayCircle, ArrowRight, Check, ClipboardList, Utensils, ShoppingBag } from "lucide-react";

// ---------- Material Symbols helper ----------
function MSymbol({ name, size = 20, weight = 400, fill = 0, color }) {
  return (
    <span
      className="material-symbols-outlined select-none"
      style={{ fontSize: size, color, fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`, lineHeight: 1 }}
    >
      {name}
    </span>
  );
}

// ---------- Design tokens ----------
const CANVAS = "#FAF9F6";
const INK = "#1C1B1F";
const BORDER = "#E7E4DC";
const MUTED = "#7A766C";

const ENERGY_OPTIONS = [
  { key: 1, label: "Low", icon: "battery_1_bar", color: "#606C38" },
  { key: 2, label: "Steady", icon: "battery_4_bar", color: "#C98A1E" },
  { key: 3, label: "High", icon: "bolt", color: "#FF5A5F" },
];

const MOOD_OPTIONS = [
  { key: "inspired", label: "Inspired", emoji: "💡" },
  { key: "rushed", label: "Rushed", emoji: "⚡" },
  { key: "lethargic", label: "Lethargic", emoji: "🥱" },
];

const TIME_OPTIONS = [
  { key: 15, label: "15 min" },
  { key: 30, label: "30 min" },
  { key: 60, label: "1 hr+" },
];

const VEG_OPTIONS = [
  { key: "veg", label: "Vegetarian", sub: "No meat, fish, or eggs" },
  { key: "eggetarian", label: "Eggetarian", sub: "Vegetarian + eggs" },
  { key: "vegan", label: "Vegan", sub: "No meat, eggs, or dairy" },
  { key: "nonveg", label: "Non-Vegetarian", sub: "Eats meat, fish, eggs" },
];

const DIET_OPTIONS = [
  { key: "balanced", label: "Balanced", sub: "No restrictions" },
  { key: "highprotein", label: "High-Protein", sub: "Muscle & satiety focus" },
  { key: "keto", label: "Keto", sub: "Low-carb, high-fat" },
  { key: "diabetic", label: "Diabetic-Friendly", sub: "Low glycemic load" },
  { key: "glutenfree", label: "Gluten-Free", sub: "No wheat/gluten" },
];

const INGREDIENT_ICON = {
  carrot: "🥕", egg: "🥚", eggs: "🥚", curd: "🥣", onion: "🧅", rice: "🍚",
  paneer: "🧀", spinach: "🥬", milk: "🥛", "wheat flour": "🌾", capsicum: "🫑",
  poha: "🍙", rajma: "🫘", semolina: "🌾", peanuts: "🥜", "moong dal": "🟡",
  "chicken breast": "🍗", tofu: "⬜", quinoa: "🌿", "chia seeds": "⚫",
  "coconut milk": "🥥", "greek yogurt": "🥛", oats: "🌾", sprouts: "🌱",
  ghee: "🧈", pickle: "🥒", papad: "🫓", besan: "🌾", cucumber: "🥒", lentils: "🫘",
  potato: "🥔", tomato: "🍅", mushroom: "🍄", broccoli: "🥦",
};

const PANTRY_TODAY_SUGGESTIONS = [
  "paneer", "spinach", "eggs", "moong dal", "onion", "carrot", "capsicum",
  "poha", "rajma", "semolina", "peanuts", "chicken breast", "tofu", "quinoa",
  "chia seeds", "coconut milk", "greek yogurt", "oats", "sprouts", "besan",
  "cucumber", "potato", "tomato", "mushroom", "broccoli",
];

const STAPLE_OPTIONS = ["rice", "wheat flour", "lentils", "quinoa", "oats", "besan", "curd", "milk", "eggs", "ghee", "pickle", "papad"];

const ACCOMPANIMENTS = {
  breakfast: [{ staple: "milk", name: "Protein Shake", kcal: 150, protein: 12, carb: 8, fat: 3 }],
  lunch: [{ staple: "curd", name: "Raita", kcal: 70, protein: 3, carb: 5, fat: 4 }],
  dinner: [
    { staple: "curd", name: "Chaas (Buttermilk)", kcal: 40, protein: 2, carb: 4, fat: 1 },
    { staple: "pickle", name: "Pickle", kcal: 20, protein: 0, carb: 3, fat: 1 },
    { staple: "papad", name: "Papad", kcal: 35, protein: 1, carb: 5, fat: 1 },
  ],
};

// Delivery apps — illustrative deep-link patterns for the MVP demo.
// In production these would be real partner deep links / APIs.
const DELIVERY_APPS = [
  { key: "zepto", label: "Zepto", initial: "Z", color: "#8A2BE2", url: (q) => `https://www.zeptonow.com/search?query=${encodeURIComponent(q)}` },
  { key: "blinkit", label: "Blinkit", initial: "B", color: "#F8CB46", text: "#1C1B1F", url: (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}` },
  { key: "instamart", label: "Instamart", initial: "I", color: "#FC8019", url: (q) => `https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(q)}` },
];

// ---------- Mock dish database — expanded for real variety across energy levels ----------
const DISHES = {
  breakfast: [
    { name: "Vegetable Upma", time: 15, energy: 1, uses: ["semolina", "onion", "carrot"], protein: 8, carb: 45, fat: 6, kcal: 260, micros: ["Iron", "B-vitamins"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "One pot, no chopping marathon" },
    { name: "Curd Poha", time: 10, energy: 1, uses: ["poha", "curd", "peanuts"], protein: 6, carb: 38, fat: 5, kcal: 230, micros: ["Probiotics", "B12"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Cooling, almost no stove time" },
    { name: "Coconut Chia Pudding", time: 10, energy: 1, uses: ["chia seeds", "coconut milk"], protein: 6, carb: 14, fat: 18, kcal: 240, micros: ["Omega-3", "Magnesium"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "No-cook, set it the night before" },
    { name: "Moong Dal Chilla", time: 20, energy: 2, uses: ["moong dal", "onion"], protein: 16, carb: 22, fat: 6, kcal: 220, micros: ["Folate", "Iron"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: true, note: "High protein, light on the stomach" },
    { name: "Paneer Stuffed Paratha", time: 30, energy: 2, uses: ["paneer", "wheat flour"], protein: 14, carb: 40, fat: 16, kcal: 360, micros: ["Calcium", "Vitamin D"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "Uses paneer before it turns" },
    { name: "Protein Egg-White Scramble", time: 15, energy: 2, uses: ["eggs", "capsicum"], protein: 24, carb: 6, fat: 10, kcal: 210, micros: ["B12", "Selenium"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "Quick, lean protein to start strong" },
    { name: "Besan Cheela Trio", time: 35, energy: 3, uses: ["besan", "tomato", "onion"], protein: 18, carb: 30, fat: 10, kcal: 290, micros: ["Folate", "Iron"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: true, note: "Three layers, worth the morning effort" },
    { name: "Stuffed Mushroom & Sprouts Toast", time: 40, energy: 3, uses: ["mushroom", "sprouts", "wheat flour"], protein: 20, carb: 35, fat: 12, kcal: 320, micros: ["Vitamin D", "Folate"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "A weekend-worthy stacked breakfast" },
  ],
  lunch: [
    { name: "Curd Rice + Pickle", time: 15, energy: 1, uses: ["rice", "curd"], protein: 7, carb: 50, fat: 5, kcal: 290, micros: ["Probiotics", "Calcium"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Almost no effort, easy on energy" },
    { name: "Light Vegetable Soup + Toast", time: 20, energy: 1, uses: ["carrot", "spinach", "onion"], protein: 6, carb: 24, fat: 4, kcal: 180, micros: ["Vitamin A", "Potassium"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: true, note: "Gentle option on a slow day" },
    { name: "Spinach Dal + Rice", time: 30, energy: 2, uses: ["spinach", "moong dal", "rice"], protein: 14, carb: 55, fat: 6, kcal: 340, micros: ["Iron", "Vitamin A"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Spinach won't survive the week" },
    { name: "Paneer Bhurji + Roti", time: 25, energy: 2, uses: ["paneer", "capsicum", "wheat flour"], protein: 18, carb: 35, fat: 18, kcal: 370, micros: ["Calcium", "B12"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "Quick paneer turnaround" },
    { name: "Quinoa Veg Bowl", time: 25, energy: 2, uses: ["quinoa", "carrot", "spinach"], protein: 12, carb: 40, fat: 8, kcal: 300, micros: ["Magnesium", "Folate"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Complete plant protein, fully loaded bowl" },
    { name: "Grilled Chicken + Salad", time: 30, energy: 2, uses: ["chicken breast", "capsicum"], protein: 35, carb: 8, fat: 14, kcal: 320, micros: ["Niacin", "Phosphorus"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "Lean, high-protein, low effort cleanup" },
    { name: "Rajma + Jeera Rice", time: 45, energy: 3, uses: ["rajma", "rice"], protein: 16, carb: 60, fat: 8, kcal: 380, micros: ["Folate", "Potassium"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Worth it when you have the energy" },
    { name: "Stuffed Tomato & Mushroom Curry", time: 50, energy: 3, uses: ["tomato", "mushroom", "potato"], protein: 14, carb: 42, fat: 14, kcal: 350, micros: ["Vitamin C", "Potassium"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Slow-cooked, full kitchen-on day" },
    { name: "Tandoori Chicken Power Bowl", time: 50, energy: 3, uses: ["chicken breast", "broccoli", "quinoa"], protein: 38, carb: 30, fat: 12, kcal: 380, micros: ["B6", "Zinc"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: true, note: "A proper sit-down, high-effort bowl" },
  ],
  dinner: [
    { name: "Light Vegetable Soup", time: 20, energy: 1, uses: ["carrot", "spinach", "onion"], protein: 5, carb: 18, fat: 3, kcal: 120, micros: ["Vitamin A", "Potassium"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "Easy on a tired, low-appetite night" },
    { name: "Curd Rice Bowl", time: 15, energy: 1, uses: ["rice", "curd", "cucumber"], protein: 7, carb: 45, fat: 5, kcal: 270, micros: ["Probiotics", "Calcium"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Cooling, almost zero cleanup" },
    { name: "Egg Bhurji + Toast", time: 15, energy: 1, uses: ["eggs", "onion"], protein: 16, carb: 28, fat: 12, kcal: 280, micros: ["B12", "Choline"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "Fastest protein option tonight" },
    { name: "Vegetable Khichdi", time: 30, energy: 2, uses: ["rice", "moong dal", "carrot", "spinach"], protein: 13, carb: 52, fat: 6, kcal: 320, micros: ["Iron", "Vitamin A"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Gentle, one pot, clears the fridge" },
    { name: "Tofu Stir-Fry", time: 25, energy: 2, uses: ["tofu", "capsicum", "carrot"], protein: 18, carb: 14, fat: 12, kcal: 250, micros: ["Calcium", "Iron"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "Fast, plant protein, one pan" },
    { name: "Palak Paneer + Roti", time: 35, energy: 2, uses: ["spinach", "paneer", "wheat flour"], protein: 19, carb: 32, fat: 18, kcal: 360, micros: ["Iron", "Calcium"], isKeto: false, isGlutenFree: false, isDiabeticFriendly: false, note: "Uses spinach + paneer together" },
    { name: "Tandoori Chicken + Sautéed Veg", time: 45, energy: 3, uses: ["chicken breast", "carrot"], protein: 38, carb: 10, fat: 16, kcal: 360, micros: ["B6", "Zinc"], isKeto: true, isGlutenFree: true, isDiabeticFriendly: true, note: "Worth firing up the tandoor pan tonight" },
    { name: "Stuffed Potato & Mushroom Bake", time: 50, energy: 3, uses: ["potato", "mushroom", "paneer"], protein: 16, carb: 48, fat: 16, kcal: 400, micros: ["Vitamin C", "Calcium"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Oven night — a proper weekend dinner" },
    { name: "Slow-Cooked Rajma Feast", time: 55, energy: 3, uses: ["rajma", "tomato", "rice"], protein: 18, carb: 62, fat: 9, kcal: 400, micros: ["Folate", "Iron"], isKeto: false, isGlutenFree: true, isDiabeticFriendly: false, note: "Best on a night you want to properly cook" },
  ],
};

const MEAT_ITEMS = ["chicken breast", "fish", "mutton", "prawns"];
const EGG_ITEMS = ["eggs"];
const DAIRY_ITEMS = ["milk", "curd", "paneer", "ghee", "greek yogurt"];

function dishHasMeat(d) { return d.uses.some((u) => MEAT_ITEMS.includes(u)); }
function dishHasEgg(d) { return d.uses.some((u) => EGG_ITEMS.includes(u)); }
function dishHasDairy(d) { return d.uses.some((u) => DAIRY_ITEMS.includes(u)); }

function vegFilter(vegPref) {
  if (vegPref === "vegan") return (d) => !dishHasMeat(d) && !dishHasEgg(d) && !dishHasDairy(d);
  if (vegPref === "veg") return (d) => !dishHasMeat(d) && !dishHasEgg(d);
  if (vegPref === "eggetarian") return (d) => !dishHasMeat(d);
  return () => true;
}
function ingredientAllowed(item, vegPref) {
  if (vegPref === "vegan") return !MEAT_ITEMS.includes(item) && !EGG_ITEMS.includes(item) && !DAIRY_ITEMS.includes(item);
  if (vegPref === "veg") return !MEAT_ITEMS.includes(item) && !EGG_ITEMS.includes(item);
  if (vegPref === "eggetarian") return !MEAT_ITEMS.includes(item);
  return true;
}
const GLUTEN_ITEMS = ["wheat flour"];
const HIGH_CARB_STAPLES = ["rice", "wheat flour", "semolina", "poha", "rajma", "besan"];
function ingredientAllowedByDiet(item, diet) {
  if (diet === "glutenfree" && GLUTEN_ITEMS.includes(item)) return false;
  if (diet === "keto" && HIGH_CARB_STAPLES.includes(item)) return false;
  return true;
}
function ingredientAllowedOverall(item, vegPref, diet) {
  return ingredientAllowed(item, vegPref) && ingredientAllowedByDiet(item, diet);
}
function placeholderFor(vegPref) {
  if (vegPref === "vegan") return 'Try "tofu" or "a bunch of spinach"';
  if (vegPref === "veg") return 'Try "paneer" or "half a kilo of carrots"';
  if (vegPref === "eggetarian") return 'Try "eggs" or "half a dozen eggs"';
  return 'Try "chicken breast" or "half a dozen eggs"';
}
function dietFilter(diet) {
  switch (diet) {
    case "keto": return (d) => d.isKeto;
    case "diabetic": return (d) => d.isDiabeticFriendly;
    case "glutenfree": return (d) => d.isGlutenFree;
    default: return () => true;
  }
}

// Energy & time matching dominate; pantry overlap and favorites only nudge the order.
function scoreDish(dish, pantry, expiring, time, energy, diet, isFavorite) {
  let score = 0;
  const usesExpiring = dish.uses.filter((u) => expiring.includes(u)).length;
  const haveCount = dish.uses.filter((u) => pantry.includes(u)).length;
  score += usesExpiring * 6;
  score += haveCount * 0.8;
  score -= Math.abs(dish.energy - energy) * 9; // strong separation between energy levels
  score -= dish.time > time ? (dish.time - time) * 2.2 : Math.abs(time - dish.time) * 0.15;
  if (diet === "highprotein") score += dish.protein * 0.4;
  if (isFavorite) score += 10;
  return score;
}

function rankMeals(mealType, pantry, expiring, time, energy, diet, vegPref, favorites) {
  let pool = DISHES[mealType].filter(vegFilter(vegPref)).filter(dietFilter(diet));
  if (pool.length < 3) pool = DISHES[mealType].filter(vegFilter(vegPref)); // relax diet style, never the veg gate
  return pool
    .map((d) => ({ ...d, score: scoreDish(d, pantry, expiring, time, energy, diet, favorites.includes(d.name)) }))
    .sort((a, b) => b.score - a.score);
}

function currentSlot() {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 16) return "lunch";
  return "dinner";
}
function energyColor(energy) { return ENERGY_OPTIONS.find((e) => e.key === energy)?.color || INK; }

function NutritionFacts({ dish, addOns }) {
  const totals = addOns.reduce(
    (acc, a) => ({ kcal: acc.kcal + a.kcal, protein: acc.protein + a.protein, carb: acc.carb + a.carb, fat: acc.fat + a.fat }),
    { kcal: dish.kcal, protein: dish.protein, carb: dish.carb, fat: dish.fat }
  );
  const stats = [
    { label: "Protein", val: `${totals.protein}g`, color: "#FF5A5F", icon: "fitness_center" },
    { label: "Carbs", val: `${totals.carb}g`, color: "#C98A1E", icon: "grain" },
    { label: "Fat", val: `${totals.fat}g`, color: "#606C38", icon: "water_drop" },
  ];
  return (
    <div className="mt-3 rounded-2xl p-3" style={{ background: CANVAS, border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Nutrition</span>
        <span className="app-heading text-sm font-extrabold">{totals.kcal} kcal</span>
      </div>
      <div className="mt-2.5 flex gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: INK }}>
            <MSymbol name={s.icon} size={14} color={s.color} />
            {s.val} <span style={{ color: MUTED, fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {dish.micros.map((m) => (
          <span key={m} className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "white", border: `1px solid ${BORDER}`, color: MUTED }}>{m}</span>
        ))}
      </div>
      {addOns.length > 0 && (
        <div className="mt-2.5 border-t pt-2.5" style={{ borderColor: BORDER }}>
          {addOns.map((a) => (
            <p key={a.name} className="flex items-center gap-1.5 text-[11px]" style={{ color: MUTED }}>
              <Plus size={10} /> {a.name} — already in your kitchen · +{a.kcal} kcal, +{a.protein}g protein
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function MissingGroceries({ items }) {
  if (items.length === 0) {
    return (
      <p className="mt-3 flex items-center gap-1.5 text-xs font-medium" style={{ color: "#4A5429" }}>
        <Check size={13} /> You already have everything for this
      </p>
    );
  }
  return (
    <div className="mt-3 rounded-2xl p-3" style={{ background: "#FCEFD9", border: "1px solid #F0DBAE" }}>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: "#A0671A" }}>
        <ShoppingBag size={13} /> Missing groceries?
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <div key={item} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-sm" style={{ color: INK }}>
              <span className="text-base leading-none">{INGREDIENT_ICON[item] || "•"}</span> {item}
            </span>
            <div className="flex gap-1.5">
              {DELIVERY_APPS.map((app) => (
                <a
                  key={app.key}
                  href={app.url(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Order ${item} on ${app.label}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold transition active:scale-90"
                  style={{ background: app.color, color: app.text || "white" }}
                >
                  {app.initial}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MealCarousel({ slot, ranked, index, onIndex, accent, accompaniments, available, favorites, onToggleFavorite }) {
  const icons = { Breakfast: "wb_twilight", Lunch: "wb_sunny", Dinner: "bedtime" };
  const slotEmoji = { Breakfast: "🌅", Lunch: "☀️", Dinner: "🌙" };
  const dish = ranked[index % ranked.length];
  const missing = dish.uses.filter((u) => !available.includes(u));
  const isFav = favorites.includes(dish.name);
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dish.name + " recipe")}`;

  return (
    <div className="overflow-hidden rounded-3xl bg-white" style={{ border: `1px solid ${BORDER}` }}>
      <div className="h-1.5 w-full" style={{ background: accent }} />
      <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>
          <span className="text-base leading-none">{slotEmoji[slot]}</span>
          {slot}
        </div>
        <button onClick={() => onToggleFavorite(dish.name)} title="Save as favorite" className="transition active:scale-90">
          <Heart size={18} fill={isFav ? "#FF5A5F" : "none"} color={isFav ? "#FF5A5F" : MUTED} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => onIndex((index - 1 + ranked.length) % ranked.length)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition active:scale-90"
          style={{ border: `1px solid ${BORDER}` }}
          title="Previous option"
        >
          <ChevronLeft size={15} color={MUTED} />
        </button>
        <div className="flex-1 text-center">
          <h3 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: INK }}>{dish.name}</h3>
          <p className="mt-0.5 text-[11px] font-medium" style={{ color: MUTED }}>Option {(index % ranked.length) + 1} of {ranked.length}</p>
        </div>
        <button
          onClick={() => onIndex((index + 1) % ranked.length)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition active:scale-90"
          style={{ border: `1px solid ${BORDER}` }}
          title="Next option"
        >
          <ChevronRight size={15} color={MUTED} />
        </button>
      </div>

      <p className="mt-1 text-center text-sm" style={{ color: MUTED }}>{dish.note}</p>

      <div className="mt-1.5 flex justify-center gap-1">
        {ranked.map((_, i) => (
          <span key={i} className="h-1 rounded-full transition" style={{ width: i === index % ranked.length ? 14 : 5, background: i === index % ranked.length ? accent : BORDER }} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3 text-xs" style={{ color: MUTED }}>
        <span className="flex items-center gap-1"><Clock size={12} /> {dish.time} min</span>
        <span className="flex items-center gap-1"><MSymbol name="bolt" size={13} /> energy {dish.energy}/3</span>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline" style={{ color: "#C2542C" }}>
          <PlayCircle size={13} /> Watch recipe
        </a>
      </div>

      <NutritionFacts dish={dish} addOns={accompaniments} />
      <MissingGroceries items={missing} />
      </div>
    </div>
  );
}

function IngredientChip({ label, selected, expiring, onToggle, onMarkExpiring }) {
  const icon = INGREDIENT_ICON[label];
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition"
      style={{ border: `1.5px solid ${expiring ? "#C98A1E" : selected ? INK : BORDER}`, background: expiring ? "#FCEFD9" : selected ? INK : "white", color: expiring ? "#A0671A" : selected ? "white" : INK }}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {selected && !expiring && !icon && <Check size={12} />}
      {expiring && "⏳ "}
      {label}
      {selected && (
        <span onClick={(e) => { e.stopPropagation(); onMarkExpiring(); }} className="ml-0.5 text-[10px] underline opacity-80">
          {expiring ? "" : "expiring?"}
        </span>
      )}
    </button>
  );
}

function StapleChip({ label, selected, onToggle }) {
  const icon = INGREDIENT_ICON[label];
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition"
      style={{ border: `1.5px solid ${selected ? "#606C38" : BORDER}`, background: selected ? "#ECEFE2" : "white", color: selected ? "#4A5429" : INK }}
    >
      {icon && <span className="text-base leading-none">{icon}</span>}
      {selected && <Check size={12} color="#606C38" />}
      {label}
    </button>
  );
}

function SegmentedControl({ value, onChange }) {
  const opts = [{ key: "hour", label: "Next hour", sub: "1 meal" }, { key: "day", label: "Next day", sub: "3 meals" }];
  return (
    <div className="relative flex rounded-2xl p-1" style={{ background: "#F0EEE6" }}>
      {opts.map((o) => (
        <button key={o.key} onClick={() => onChange(o.key)} className="relative z-10 flex-1 rounded-xl py-2.5 text-center transition" style={{ background: value === o.key ? INK : "transparent", color: value === o.key ? "white" : MUTED }}>
          <span className="block text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{o.label}</span>
          <span className="block text-[10px] opacity-80">{o.sub}</span>
        </button>
      ))}
    </div>
  );
}

// Non-editable summary pill — communicates "this was decided earlier" via a lock + muted fill, not a live input
function LockedPill({ icon, emoji, text, color }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "white", border: `1px solid ${BORDER}`, color: color || INK }}>
      {emoji ? <span className="text-sm leading-none">{emoji}</span> : icon && <MSymbol name={icon} size={14} color={color || MUTED} />}
      {text}
    </span>
  );
}

export default function Mealio() {
  const [horizon, setHorizon] = useState("day");
  const [step, setStep] = useState(0); // 0 prefs, 1 pantry, 2 checkin, 3 loading, 4 results
  const [vegPref, setVegPref] = useState(null);
  const [diet, setDiet] = useState("balanced");
  const [staples, setStaples] = useState(["curd", "milk", "eggs", "rice"]);
  const [pantry, setPantry] = useState(["onion", "spinach", "paneer"]);
  const [expiring, setExpiring] = useState(["spinach", "paneer"]);
  const [inputVal, setInputVal] = useState("");
  const [stapleInputVal, setStapleInputVal] = useState("");
  const [energy, setEnergy] = useState(2);
  const [time, setTime] = useState(30);
  const [mood, setMood] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [favorites, setFavorites] = useState([]);

  const toggleStaple = (item) => setStaples((s) => (s.includes(item) ? s.filter((i) => i !== item) : [...s, item]));
  const toggleFavorite = (name) => setFavorites((f) => (f.includes(name) ? f.filter((n) => n !== name) : [...f, name]));

  // Kitchen intelligence: whenever diet/veg preferences change, silently drop any
  // already-selected items that now contradict them (e.g. wheat flour after going gluten-free).
  useEffect(() => {
    setStaples((s) => s.filter((i) => ingredientAllowedOverall(i, vegPref, diet)));
    setPantry((p) => p.filter((i) => ingredientAllowedOverall(i, vegPref, diet)));
    setExpiring((e) => e.filter((i) => ingredientAllowedOverall(i, vegPref, diet)));
  }, [vegPref, diet]);

  const allowedStaples = useMemo(() => {
    const base = STAPLE_OPTIONS.filter((i) => ingredientAllowedOverall(i, vegPref, diet));
    const extras = staples.filter((s) => !base.includes(s) && ingredientAllowedOverall(s, vegPref, diet));
    return [...base, ...extras];
  }, [vegPref, diet, staples]);
  const todayChips = useMemo(() => {
    const base = PANTRY_TODAY_SUGGESTIONS.filter((i) => ingredientAllowedOverall(i, vegPref, diet));
    const extras = pantry.filter((p) => !base.includes(p) && !staples.includes(p) && ingredientAllowedOverall(p, vegPref, diet));
    return [...base, ...extras];
  }, [pantry, staples, vegPref, diet]);

  const toggleChip = (item) => {
    if (pantry.includes(item)) { setPantry((p) => p.filter((i) => i !== item)); setExpiring((e) => e.filter((i) => i !== item)); }
    else setPantry((p) => [...p, item]);
  };
  const toggleExpiring = (item) => setExpiring((e) => (e.includes(item) ? e.filter((i) => i !== item) : [...e, item]));
  const addCustom = () => {
    const v = inputVal.trim().toLowerCase();
    if (!v) return;
    if (!pantry.includes(v)) setPantry((p) => [...p, v]);
    setInputVal("");
  };
  const addCustomStaple = () => {
    const v = stapleInputVal.trim().toLowerCase();
    if (!v) return;
    if (!staples.includes(v)) setStaples((s) => [...s, v]);
    setStapleInputVal("");
  };

  const effectiveStaples = useMemo(() => staples.filter((s) => ingredientAllowed(s, vegPref)), [staples, vegPref]);
  const available = useMemo(() => Array.from(new Set([...effectiveStaples, ...pantry])), [effectiveStaples, pantry]);

  const slot = horizon === "hour" ? currentSlot() : null;
  const slots = horizon === "hour" ? [slot] : ["breakfast", "lunch", "dinner"];

  const plan = useMemo(() => {
    if (step < 4) return null;
    const result = {};
    slots.forEach((s) => { result[s] = rankMeals(s, available, expiring, time, energy, diet, vegPref, favorites); });
    return result;
  }, [step, available, expiring, time, energy, diet, vegPref, horizon, favorites]);

  const accompanimentsFor = (s) => ACCOMPANIMENTS[s].filter((a) => effectiveStaples.includes(a.staple));

  const goGenerate = () => { setCarouselIndex({ breakfast: 0, lunch: 0, dinner: 0 }); setStep(3); setTimeout(() => setStep(4), 1300); };
  const goHome = () => { setStep(0); setMood(null); };

  const accent = energyColor(energy);
  const slotLabel = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };
  const energyOpt = ENERGY_OPTIONS.find((e) => e.key === energy);
  const moodOpt = MOOD_OPTIONS.find((m) => m.key === mood);
  const vegOpt = VEG_OPTIONS.find((v) => v.key === vegPref);
  const dietOpt = DIET_OPTIONS.find((d) => d.key === diet);

  return (
    <div className="min-h-screen w-full" style={{ background: CANVAS, color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Roboto:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; }
        .app-body { font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif; }
        .app-heading { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      {/* sticky header — frozen reference to earlier choices */}
      <div className="sticky top-0 z-20 mx-auto max-w-md px-5 pb-3 pt-7" style={{ background: CANVAS }}>
        <div className="mb-4 flex items-center gap-2.5">
          <button onClick={goHome} title="Back to preferences" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-90" style={{ background: INK, color: CANVAS }}>
            <MSymbol name="skillet" size={18} fill={1} />
          </button>
          <div>
            <p className="app-heading text-lg font-extrabold leading-none">Mealio</p>
            <p className="text-[11px]" style={{ color: MUTED }}>your kitchen's brain, not a recipe box</p>
          </div>
        </div>

        {step > 0 && step < 4 && (
          <>
            <SegmentedControl value={horizon} onChange={(v) => { setHorizon(v); setStep(1); }} />
            <div className="my-4 flex items-center gap-1.5">
              {[{ n: 1, label: "Kitchen prefs" }, { n: 2, label: "Check-in" }].map((s) => {
                const clickable = step > s.n;
                return (
                  <button key={s.n} onClick={() => clickable && setStep(s.n)} disabled={!clickable} title={clickable ? `Back to ${s.label}` : s.label}
                    className="h-1.5 flex-1 rounded-full transition" style={{ background: step >= s.n ? accent : BORDER, cursor: clickable ? "pointer" : "default", opacity: clickable ? 1 : 0.6 }} />
                );
              })}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <SegmentedControl value={horizon} onChange={(v) => { setHorizon(v); setStep(1); }} />
            <div className="mt-4 rounded-2xl p-3.5" style={{ background: "white", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${accent}` }}>
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
                <MSymbol name="lock" size={12} color={MUTED} /> Set earlier — tap the icon above to change
              </div>
              <h1 className="app-heading text-xl font-extrabold leading-tight">{horizon === "hour" ? `Right now: ${slotLabel[slot]} 🍽️` : "Today, sorted ✨"}</h1>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {vegOpt && <LockedPill text={vegOpt.label} icon="eco" color="#4A5429" />}
                <LockedPill text={dietOpt.label} icon="nutrition" />
                <LockedPill text={energyOpt.label} icon={energyOpt.icon} color={energyOpt.color} />
                {moodOpt && <LockedPill text={moodOpt.label} emoji={moodOpt.emoji} icon={moodOpt.icon} />}
                <LockedPill text={`${time} min`} icon="schedule" />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="app-body mx-auto max-w-md px-5 pb-16">
        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <h1 className="app-heading text-[26px] font-extrabold leading-tight">First, the basics.</h1>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>We'll never show you anything outside this — no assumptions, ever.</p>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Do you eat eggs or meat? <span style={{ color: "#FF5A5F" }}>*</span></p>
            <div className="flex flex-col gap-2">
              {VEG_OPTIONS.map((v) => (
                <button key={v.key} onClick={() => setVegPref(v.key)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-left transition" style={{ border: `1.5px solid ${vegPref === v.key ? "#606C38" : BORDER}`, background: vegPref === v.key ? "#ECEFE2" : "white" }}>
                  <div>
                    <p className="app-heading text-sm font-bold" style={{ color: vegPref === v.key ? "#4A5429" : INK }}>{v.label}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{v.sub}</p>
                  </div>
                  {vegPref === v.key && <Check size={18} color="#606C38" />}
                </button>
              ))}
            </div>

            <h2 className="app-heading mt-7 text-xl font-bold">What's your eating style?</h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>This shapes every suggestion we give you. Change it anytime.</p>
            <div className="mt-4 flex flex-col gap-2">
              {DIET_OPTIONS.map((d) => (
                <button key={d.key} onClick={() => setDiet(d.key)} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-left transition" style={{ border: `1.5px solid ${diet === d.key ? INK : BORDER}`, background: diet === d.key ? INK : "white" }}>
                  <div>
                    <p className="app-heading text-sm font-bold" style={{ color: diet === d.key ? "white" : INK }}>{d.label}</p>
                    <p className="text-xs" style={{ color: diet === d.key ? "#D8D6CF" : MUTED }}>{d.sub}</p>
                  </div>
                  {diet === d.key && <Check size={18} color="white" />}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(1)} disabled={!vegPref} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40" style={{ background: INK }}>
              Next: set up your kitchen <ArrowRight size={15} />
            </button>
            {!vegPref && <p className="mt-2 text-center text-xs" style={{ color: MUTED }}>Please answer the eggs/meat question to continue.</p>}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h1 className="app-heading text-[26px] font-extrabold leading-tight">What's always in your kitchen?</h1>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>Staples like these unlock easy add-ons — raita, chaas, a protein shake — with near-zero extra cooking.</p>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5" style={{ border: `1px solid ${BORDER}` }}>
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-95" style={{ background: INK, color: "white" }}><Mic size={16} /></button>
              <input value={stapleInputVal} onChange={(e) => setStapleInputVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomStaple()} placeholder='Not listed? Type any staple, e.g. "almonds"' className="flex-1 bg-transparent text-sm outline-none" style={{ color: INK }} />
              <button onClick={addCustomStaple} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: CANVAS, color: INK }}><Plus size={16} /></button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {allowedStaples.map((item) => <StapleChip key={item} label={item} selected={staples.includes(item)} onToggle={() => toggleStaple(item)} />)}
            </div>

            <h2 className="app-heading mt-7 text-xl font-bold">Anything specific today?</h2>
            <p className="mt-1 text-sm" style={{ color: MUTED }}>Tap the mic or type. Tap a chip to add, tap again to remove.</p>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5" style={{ border: `1px solid ${BORDER}` }}>
              <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition active:scale-95" style={{ background: INK, color: "white" }}><Mic size={16} /></button>
              <input value={inputVal} onChange={(e) => setInputVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustom()} placeholder={placeholderFor(vegPref)} className="flex-1 bg-transparent text-sm outline-none" style={{ color: INK }} />
              <button onClick={addCustom} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: CANVAS, color: INK }}><Plus size={16} /></button>
            </div>

            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Today's ingredients ({pantry.filter((p) => !staples.includes(p)).length} selected)</p>
            <div className="flex flex-wrap gap-2">
              {todayChips.map((item) => <IngredientChip key={item} label={item} selected={pantry.includes(item)} expiring={expiring.includes(item)} onToggle={() => toggleChip(item)} onMarkExpiring={() => toggleExpiring(item)} />)}
            </div>

            <button onClick={() => setStep(2)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition" style={{ background: INK }}>
              Next: how are you feeling <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h1 className="app-heading text-[26px] font-extrabold leading-tight">Quick check-in.</h1>
            <p className="mt-2 text-sm" style={{ color: MUTED }}>This changes everything we suggest{horizon === "hour" ? " right now" : " today"}.</p>

            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Energy level</p>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setEnergy(opt.key)} className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-4 text-xs font-bold transition" style={{ border: `1.5px solid ${energy === opt.key ? opt.color : BORDER}`, background: energy === opt.key ? `${opt.color}1A` : "white", color: energy === opt.key ? opt.color : MUTED }}>
                  <MSymbol name={opt.icon} size={24} color={energy === opt.key ? opt.color : MUTED} />
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Mood (optional)</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button key={m.key} onClick={() => setMood(m.key)} className="flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition" style={{ border: `1.5px solid ${mood === m.key ? INK : BORDER}`, background: mood === m.key ? INK : "white", color: mood === m.key ? "white" : INK }}>
                  {m.emoji ? <span className="text-base leading-none">{m.emoji}</span> : <MSymbol name={m.icon} size={17} color={mood === m.key ? "white" : MUTED} />}
                  {m.label}
                </button>
              ))}
            </div>

            <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide" style={{ color: MUTED }}>Time you have to cook{horizon === "hour" ? " in the next hour" : ""}</p>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setTime(opt.key)} className="flex-1 rounded-2xl py-3 text-sm font-bold transition" style={{ border: `1.5px solid ${time === opt.key ? INK : BORDER}`, background: time === opt.key ? INK : "white", color: time === opt.key ? "white" : MUTED }}>
                  {opt.label}
                </button>
              ))}
            </div>

            <button onClick={goGenerate} className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition" style={{ background: accent }}>
              {horizon === "hour" ? <Utensils size={16} /> : <ClipboardList size={16} />}
              {horizon === "hour" ? "Recommend a dish" : "Plan a menu"}
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full" style={{ border: `3px solid ${BORDER}`, borderTopColor: accent }} />
              <div className="absolute inset-0 flex items-center justify-center"><MSymbol name="skillet" size={26} fill={1} color={accent} /></div>
            </div>
            <p className="app-heading mt-5 text-lg font-bold">{horizon === "hour" ? "Finding your next meal…" : "Weighing what's expiring, your energy, and the clock…"}</p>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && plan && (
          <div className="mt-1 flex flex-col gap-3">
            {slots.map((s) => (
              <MealCarousel
                key={s}
                slot={slotLabel[s]}
                ranked={plan[s]}
                index={carouselIndex[s]}
                onIndex={(i) => setCarouselIndex((c) => ({ ...c, [s]: i }))}
                accent={accent}
                accompaniments={accompanimentsFor(s)}
                available={available}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
