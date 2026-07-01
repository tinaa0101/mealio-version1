import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Mic, Plus, Clock, ChevronLeft, ChevronRight, Heart, PlayCircle,
  ArrowRight, Check, ClipboardList, Utensils, ShoppingBag, Minus,
  RefreshCw, Phone, Lock
} from "lucide-react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  canvas:  "#FAF9F6",   // page background
  card:    "#FFFFFF",   // card background
  ink:     "#2C2417",   // warm dark brown — never pure black
  muted:   "#8A7E6E",   // secondary text
  border:  "#EAE4D8",   // dividers and borders
  subtle:  "#F4EFE6",   // very light warm fill
  primary: "#C4541A",   // terracotta CTA + selections
  selBg:   "#FBF0EC",   // selected option background
  selTxt:  "#8B3E15",   // selected option text
  eL:      "#606C38",   // energy low — olive
  eM:      "#C98A1E",   // energy mid — amber
  eH:      "#E05A4E",   // energy high — coral
};

function energyColor(e) {
  return e === 1 ? T.eL : e === 3 ? T.eH : T.eM;
}

// ─── MATERIAL SYMBOLS ─────────────────────────────────────────────────────────
function MS({ name, size = 20, fill = 0, weight = 400, color }) {
  return (
    <span
      className="material-symbols-outlined select-none"
      style={{ fontSize: size, color, lineHeight: 1,
        fontVariationSettings: `'FILL' ${fill},'wght' ${weight},'GRAD' 0,'opsz' ${size}` }}
    >{name}</span>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const VEG_OPTIONS = [
  { key: "veg",       label: "Vegetarian",      sub: "No meat, fish, or eggs",  emoji: "🌿" },
  { key: "eggetarian",label: "Eggetarian",       sub: "Vegetarian + eggs",       emoji: "🥚" },
  { key: "vegan",     label: "Vegan",            sub: "No meat, eggs, or dairy", emoji: "🌱" },
  { key: "nonveg",    label: "Non-Vegetarian",   sub: "Eats meat, fish, eggs",   emoji: "🍖" },
];

const DIET_OPTIONS = [
  { key: "balanced",   label: "Balanced",           sub: "No restrictions",         emoji: "🍽️" },
  { key: "highprotein",label: "High-Protein",        sub: "Muscle & satiety focus",  emoji: "💪" },
  { key: "keto",       label: "Keto",               sub: "Low-carb, high-fat",       emoji: "🥑" },
  { key: "diabetic",   label: "Diabetic-Friendly",  sub: "Low glycemic load",        emoji: "🩺" },
  { key: "glutenfree", label: "Gluten-Free",         sub: "No wheat or gluten",      emoji: "🌾" },
];

const ENERGY_OPTIONS = [
  { key: 1, label: "Low",    icon: "battery_1_bar", color: T.eL },
  { key: 2, label: "Steady", icon: "battery_4_bar", color: T.eM },
  { key: 3, label: "High",   icon: "bolt",          color: T.eH },
];

const MOOD_OPTIONS = [
  { key: "inspired",  label: "Inspired",  emoji: "💡" },
  { key: "rushed",    label: "Rushed",    emoji: "⚡" },
  { key: "lethargic", label: "Lethargic", emoji: "🥱" },
];

const TIME_OPTIONS = [
  { key: 15, label: "15 min" },
  { key: 30, label: "30 min" },
  { key: 60, label: "1 hr+"  },
];

const MEAT_ITEMS   = ["chicken breast", "fish", "mutton", "prawns"];
const EGG_ITEMS    = ["eggs"];
const DAIRY_ITEMS  = ["milk", "curd", "paneer", "ghee", "greek yogurt"];
const GLUTEN_ITEMS = ["wheat flour"];
const HIGH_CARB    = ["rice", "wheat flour", "semolina", "poha", "rajma", "besan"];

function ingOk(item, veg, diet) {
  if (veg === "vegan"      && [...MEAT_ITEMS,...EGG_ITEMS,...DAIRY_ITEMS].includes(item)) return false;
  if (veg === "veg"        && [...MEAT_ITEMS,...EGG_ITEMS].includes(item)) return false;
  if (veg === "eggetarian" && MEAT_ITEMS.includes(item)) return false;
  if (diet === "glutenfree"&& GLUTEN_ITEMS.includes(item)) return false;
  if (diet === "keto"      && HIGH_CARB.includes(item)) return false;
  return true;
}

const INGREDIENT_EMOJI = {
  carrot:"🥕", eggs:"🥚", curd:"🥣", onion:"🧅", rice:"🍚", paneer:"🧀",
  spinach:"🥬", milk:"🥛", "wheat flour":"🌾", capsicum:"🫑", poha:"🍙",
  rajma:"🫘", semolina:"🌾", peanuts:"🥜", "moong dal":"🟡",
  "chicken breast":"🍗", tofu:"⬜", quinoa:"🌿", "chia seeds":"⚫",
  "coconut milk":"🥥", "greek yogurt":"🥛", oats:"🌾", sprouts:"🌱",
  ghee:"🧈", pickle:"🥒", papad:"🫓", besan:"🌾", cucumber:"🥒",
  potato:"🥔", tomato:"🍅", mushroom:"🍄", broccoli:"🥦", lentils:"🫘",
};

const STAPLE_OPTIONS = [
  "rice","wheat flour","lentils","oats","besan","quinoa",
  "curd","milk","eggs","ghee","pickle","papad",
];

const PANTRY_CHIPS = [
  "paneer","spinach","eggs","moong dal","onion","carrot","capsicum",
  "poha","rajma","semolina","peanuts","chicken breast","tofu","quinoa",
  "chia seeds","coconut milk","greek yogurt","oats","sprouts","besan",
  "cucumber","potato","tomato","mushroom","broccoli",
];

const LEFTOVER_CHIPS = [
  { key:"dal",    label:"Dal",     emoji:"🍲" },
  { key:"rice",   label:"Rice",    emoji:"🍚" },
  { key:"roti",   label:"Roti",    emoji:"🫓" },
  { key:"sabzi",  label:"Sabzi",   emoji:"🥦" },
  { key:"curry",  label:"Curry",   emoji:"🍛" },
  { key:"khichdi",label:"Khichdi", emoji:"🍜" },
  { key:"idli",   label:"Idli",    emoji:"🫓" },
  { key:"pasta",  label:"Pasta",   emoji:"🍝" },
  { key:"bread",  label:"Bread",   emoji:"🍞" },
];

const LEFTOVER_TRANSFORMS = {
  dal:     [{ name:"Dal Paratha",      slot:"breakfast", time:20, note:"Mix into dough — protein-rich with no extra dal" },
            { name:"Dal Soup",          slot:"dinner",    time:10, note:"Thin with water, quick tadka — light and nourishing" }],
  rice:    [{ name:"Vegetable Fried Rice", slot:"lunch",  time:15, note:"Day-old rice stir-fries better than fresh" },
            { name:"Curd Rice Bowl",    slot:"dinner",    time:5,  note:"Cooling, zero-effort, gut-friendly" }],
  roti:    [{ name:"Roti Upma",        slot:"breakfast", time:10, note:"Crumble & temper — a South Indian zero-waste breakfast" },
            { name:"Kathi Roll Wrap",  slot:"lunch",     time:10, note:"Stuff with veggies or leftover sabzi — no cooking" }],
  sabzi:   [{ name:"Stuffed Paratha",  slot:"breakfast", time:20, note:"Most sabzis work as paratha filling" },
            { name:"Sabzi Rice Bowl",  slot:"lunch",     time:5,  note:"Reheat over rice — done in 5 minutes" }],
  curry:   [{ name:"Curry Paratha",    slot:"breakfast", time:25, note:"Thick curry makes an excellent stuffing" },
            { name:"Curry Noodles",    slot:"dinner",    time:15, note:"An unexpected fusion that works surprisingly well" }],
  khichdi: [{ name:"Khichdi Patties",  slot:"breakfast", time:15, note:"Shape & shallow-fry — crispy outside, soft inside" }],
  idli:    [{ name:"Idli Upma",        slot:"breakfast", time:10, note:"Crumble cold idlis & temper — zero waste, full flavour" }],
  pasta:   [{ name:"Pasta Frittata",   slot:"breakfast", time:15, note:"Mix with egg/besan batter & pan-fry into a quick omelette" }],
  bread:   [{ name:"Bread Poha",       slot:"breakfast", time:10, note:"Cube & temper like poha — a great pantry hack" }],
};

const DELIVERY_APPS = [
  { key:"zepto",    label:"Zepto",     color:"#8A2BE2", url: q=>`https://www.zeptonow.com/search?query=${encodeURIComponent(q)}` },
  { key:"blinkit",  label:"Blinkit",   color:"#D4A017", url: q=>`https://blinkit.com/s/?q=${encodeURIComponent(q)}` },
  { key:"instamart",label:"Instamart", color:"#E07030", url: q=>`https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}` },
];

const ACCOMPANIMENTS = {
  breakfast: [{ staple:"milk",   name:"Protein Shake", kcal:150, protein:12, carb:8,  fat:3 }],
  lunch:     [{ staple:"curd",   name:"Raita",         kcal:70,  protein:3,  carb:5,  fat:4 }],
  dinner:    [
    { staple:"curd",   name:"Chaas",  kcal:40,  protein:2, carb:4, fat:1 },
    { staple:"pickle", name:"Pickle", kcal:20,  protein:0, carb:3, fat:1 },
    { staple:"papad",  name:"Papad",  kcal:35,  protein:1, carb:5, fat:1 },
  ],
};

// ─── DISH DATABASE ─────────────────────────────────────────────────────────────
const DISHES = {
  breakfast: [
    { name:"Curd Poha",                time:10, energy:1, uses:["poha","curd","peanuts"],               protein:6,  carb:38, fat:5,  kcal:230, micros:["Probiotics","B12"],     isKeto:false, isGF:true,  isDiabetic:false, isVegan:false, note:"Cooling, almost no stove time" },
    { name:"Vegetable Upma",           time:15, energy:1, uses:["semolina","onion","carrot"],            protein:8,  carb:45, fat:6,  kcal:260, micros:["Iron","B-vitamins"],   isKeto:false, isGF:false, isDiabetic:false, isVegan:true,  note:"One pot, no chopping marathon" },
    { name:"Coconut Chia Pudding",     time:10, energy:1, uses:["chia seeds","coconut milk"],           protein:6,  carb:14, fat:18, kcal:240, micros:["Omega-3","Magnesium"], isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:true,  note:"No-cook, set it the night before" },
    { name:"Moong Dal Chilla",         time:20, energy:2, uses:["moong dal","onion"],                   protein:16, carb:22, fat:6,  kcal:220, micros:["Folate","Iron"],        isKeto:false, isGF:true,  isDiabetic:true,  isVegan:true,  note:"High protein, light on the stomach" },
    { name:"Paneer Stuffed Paratha",   time:30, energy:2, uses:["paneer","wheat flour"],                protein:14, carb:40, fat:16, kcal:360, micros:["Calcium","Vitamin D"], isKeto:false, isGF:false, isDiabetic:false, isVegan:false, note:"Uses paneer before it turns" },
    { name:"Protein Egg Scramble",     time:15, energy:2, uses:["eggs","capsicum"],                     protein:24, carb:6,  fat:10, kcal:210, micros:["B12","Selenium"],       isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:false, note:"Quick, lean protein start" },
    { name:"Besan Cheela",             time:25, energy:2, uses:["besan","tomato","onion"],              protein:18, carb:30, fat:10, kcal:290, micros:["Folate","Iron"],        isKeto:false, isGF:true,  isDiabetic:true,  isVegan:true,  note:"High-protein, gluten-free, filling" },
    { name:"Stuffed Mushroom Toast",   time:40, energy:3, uses:["mushroom","sprouts","wheat flour"],    protein:20, carb:35, fat:12, kcal:320, micros:["Vitamin D","Folate"],   isKeto:false, isGF:false, isDiabetic:false, isVegan:true,  note:"Weekend-worthy stacked breakfast" },
    { name:"Oats Veggie Bowl",         time:15, energy:2, uses:["oats","carrot","spinach"],             protein:10, carb:36, fat:5,  kcal:230, micros:["Fibre","Iron"],         isKeto:false, isGF:true,  isDiabetic:true,  isVegan:true,  note:"Savory oats — better than you think" },
    { name:"Tandoori Egg Wrap",        time:20, energy:2, uses:["eggs","wheat flour","capsicum"],       protein:22, carb:32, fat:12, kcal:320, micros:["B12","Zinc"],           isKeto:false, isGF:false, isDiabetic:false, isVegan:false, note:"High-protein, satisfying morning wrap" },
  ],
  lunch: [
    { name:"Curd Rice + Pickle",       time:15, energy:1, uses:["rice","curd"],                         protein:7,  carb:50, fat:5,  kcal:290, micros:["Probiotics","Calcium"], isKeto:false, isGF:true,  isDiabetic:false, isVegan:false, note:"Almost no effort, easy on energy" },
    { name:"Light Veg Soup + Toast",   time:20, energy:1, uses:["carrot","spinach","onion"],            protein:6,  carb:24, fat:4,  kcal:180, micros:["Vitamin A","Potassium"],isKeto:false, isGF:false, isDiabetic:true,  isVegan:true,  note:"Gentle option on a slow day" },
    { name:"Spinach Dal + Rice",       time:30, energy:2, uses:["spinach","moong dal","rice"],          protein:14, carb:55, fat:6,  kcal:340, micros:["Iron","Vitamin A"],     isKeto:false, isGF:true,  isDiabetic:false, isVegan:true,  note:"Spinach won't survive the week" },
    { name:"Paneer Bhurji + Roti",     time:25, energy:2, uses:["paneer","capsicum","wheat flour"],     protein:18, carb:35, fat:18, kcal:370, micros:["Calcium","B12"],        isKeto:false, isGF:false, isDiabetic:false, isVegan:false, note:"Quick paneer turnaround" },
    { name:"Quinoa Veg Bowl",          time:25, energy:2, uses:["quinoa","carrot","spinach"],           protein:12, carb:40, fat:8,  kcal:300, micros:["Magnesium","Folate"],   isKeto:false, isGF:true,  isDiabetic:false, isVegan:true,  note:"Complete plant protein, loaded bowl" },
    { name:"Grilled Chicken Salad",    time:30, energy:2, uses:["chicken breast","capsicum"],           protein:35, carb:8,  fat:14, kcal:320, micros:["Niacin","Phosphorus"],  isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:false, note:"Lean, high-protein, low cleanup" },
    { name:"Rajma + Jeera Rice",       time:45, energy:3, uses:["rajma","rice"],                        protein:16, carb:60, fat:8,  kcal:380, micros:["Folate","Potassium"],   isKeto:false, isGF:true,  isDiabetic:false, isVegan:true,  note:"Worth it when you have the energy" },
    { name:"Tofu Stir-Fry Bowl",       time:25, energy:2, uses:["tofu","capsicum","carrot"],            protein:18, carb:14, fat:12, kcal:250, micros:["Calcium","Iron"],       isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:true,  note:"Fast, plant protein, one pan" },
    { name:"Chicken Power Bowl",       time:50, energy:3, uses:["chicken breast","broccoli","quinoa"],  protein:38, carb:30, fat:12, kcal:380, micros:["B6","Zinc"],            isKeto:false, isGF:true,  isDiabetic:true,  isVegan:false, note:"A proper sit-down, high-effort bowl" },
  ],
  dinner: [
    { name:"Light Vegetable Soup",     time:20, energy:1, uses:["carrot","spinach","onion"],            protein:5,  carb:18, fat:3,  kcal:120, micros:["Vitamin A","Potassium"],isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:true,  note:"Easy on a tired, low-appetite night" },
    { name:"Curd Rice Bowl",           time:15, energy:1, uses:["rice","curd","cucumber"],              protein:7,  carb:45, fat:5,  kcal:270, micros:["Probiotics","Calcium"], isKeto:false, isGF:true,  isDiabetic:false, isVegan:false, note:"Cooling, almost zero cleanup" },
    { name:"Egg Bhurji + Toast",       time:15, energy:1, uses:["eggs","onion"],                        protein:16, carb:28, fat:12, kcal:280, micros:["B12","Choline"],        isKeto:false, isGF:false, isDiabetic:false, isVegan:false, note:"Fastest protein option tonight" },
    { name:"Vegetable Khichdi",        time:30, energy:2, uses:["rice","moong dal","carrot","spinach"], protein:13, carb:52, fat:6,  kcal:320, micros:["Iron","Vitamin A"],     isKeto:false, isGF:true,  isDiabetic:false, isVegan:true,  note:"Gentle, one pot, clears the fridge" },
    { name:"Tofu Stir-Fry",            time:25, energy:2, uses:["tofu","capsicum","carrot"],            protein:18, carb:14, fat:12, kcal:250, micros:["Calcium","Iron"],       isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:true,  note:"Fast, plant protein, one pan" },
    { name:"Palak Paneer + Roti",      time:35, energy:2, uses:["spinach","paneer","wheat flour"],      protein:19, carb:32, fat:18, kcal:360, micros:["Iron","Calcium"],       isKeto:false, isGF:false, isDiabetic:false, isVegan:false, note:"Uses spinach + paneer together" },
    { name:"Tandoori Chicken + Veg",   time:45, energy:3, uses:["chicken breast","carrot"],             protein:38, carb:10, fat:16, kcal:360, micros:["B6","Zinc"],            isKeto:true,  isGF:true,  isDiabetic:true,  isVegan:false, note:"Worth firing up the pan tonight" },
    { name:"Stuffed Potato Bake",      time:50, energy:3, uses:["potato","mushroom","paneer"],          protein:16, carb:48, fat:16, kcal:400, micros:["Vitamin C","Calcium"],   isKeto:false, isGF:true,  isDiabetic:false, isVegan:false, note:"Oven night — a proper weekend dinner" },
    { name:"Slow-Cooked Rajma",        time:55, energy:3, uses:["rajma","tomato","rice"],               protein:18, carb:62, fat:9,  kcal:400, micros:["Folate","Iron"],        isKeto:false, isGF:true,  isDiabetic:false, isVegan:true,  note:"Best on a night you want to properly cook" },
  ],
};

function vegFilter(veg) {
  return d => {
    if (veg === "vegan")       return !d.uses.some(u=>[...MEAT_ITEMS,...EGG_ITEMS,...DAIRY_ITEMS].includes(u));
    if (veg === "veg")         return !d.uses.some(u=>[...MEAT_ITEMS,...EGG_ITEMS].includes(u));
    if (veg === "eggetarian")  return !d.uses.some(u=>MEAT_ITEMS.includes(u));
    return true;
  };
}
function dietFilter(diet) {
  return d => {
    if (diet === "keto")       return d.isKeto;
    if (diet === "diabetic")   return d.isDiabetic;
    if (diet === "glutenfree") return d.isGF;
    if (diet === "highprotein")return d.protein >= 14;
    return true;
  };
}

function scoreDish(d, available, expiring, time, energy, diet, isFav, leftoverKeys) {
  let s = 0;
  s += d.uses.filter(u => expiring.includes(u)).length * 6;
  s += d.uses.filter(u => available.includes(u)).length * 0.8;
  s -= Math.abs(d.energy - energy) * 9;
  s -= d.time > time ? (d.time - time) * 2.2 : Math.abs(time - d.time) * 0.15;
  if (diet === "highprotein") s += d.protein * 0.5;
  if (isFav) s += 10;
  // Boost dishes whose name suggests leftover use
  leftoverKeys.forEach(k => { if (d.name.toLowerCase().includes(k)) s += 8; });
  return s;
}

function rankDishes(slot, available, expiring, time, energy, diet, veg, favorites, leftoverKeys) {
  let pool = DISHES[slot].filter(vegFilter(veg)).filter(dietFilter(diet));
  if (pool.length < 3) pool = DISHES[slot].filter(vegFilter(veg));
  if (pool.length === 0) pool = DISHES[slot];
  return pool
    .map(d => ({ ...d, score: scoreDish(d, available, expiring, time, energy, diet, favorites.includes(d.name), leftoverKeys) }))
    .sort((a,b) => b.score - a.score);
}

function currentSlot() {
  const h = new Date().getHours();
  return h < 11 ? "breakfast" : h < 16 ? "lunch" : "dinner";
}

function placeholderFor(veg) {
  if (veg === "vegan")      return 'Try "tofu" or "a bunch of spinach"';
  if (veg === "veg")        return 'Try "paneer" or "half a kilo of carrots"';
  if (veg === "eggetarian") return 'Try "eggs" or "half a dozen eggs"';
  return 'Try "chicken breast" or "half a dozen eggs"';
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Chip({ label, emoji, selected, faded, onToggle, children }) {
  return (
    <button onClick={onToggle}
      className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition"
      style={{
        border: `1.5px solid ${selected ? T.primary : T.border}`,
        background: selected ? T.selBg : T.card,
        color: selected ? T.selTxt : faded ? T.muted : T.ink,
        opacity: faded ? 0.5 : 1,
      }}>
      {emoji && <span className="text-base leading-none">{emoji}</span>}
      {selected && !emoji && <Check size={12} color={T.primary} />}
      {label}
      {children}
    </button>
  );
}

function OptionRow({ emoji, label, sub, selected, onSelect, accent }) {
  const sel = selected;
  return (
    <button onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition"
      style={{
        border: `1.5px solid ${sel ? (accent || T.primary) : T.border}`,
        background: sel ? T.selBg : T.card,
      }}>
      {emoji && <span className="text-xl leading-none">{emoji}</span>}
      <div className="flex-1">
        <p className="app-heading text-sm font-bold" style={{ color: sel ? T.selTxt : T.ink }}>{label}</p>
        {sub && <p className="text-xs" style={{ color: T.muted }}>{sub}</p>}
      </div>
      {sel && <Check size={18} color={accent || T.primary} />}
    </button>
  );
}

function NutritionBar({ dish, addOns }) {
  const t = addOns.reduce(
    (acc,a) => ({ kcal:acc.kcal+a.kcal, protein:acc.protein+a.protein, carb:acc.carb+a.carb, fat:acc.fat+a.fat }),
    { kcal:dish.kcal, protein:dish.protein, carb:dish.carb, fat:dish.fat }
  );
  return (
    <div className="mt-3 rounded-2xl p-3" style={{ background: T.subtle, border:`1px solid ${T.border}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color:T.muted }}>Nutrition</span>
        <span className="app-heading text-sm font-extrabold" style={{ color:T.ink }}>{t.kcal} kcal</span>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-3">
        {[["fitness_center",`${t.protein}g`,"Protein",T.eH],["grain",`${t.carb}g`,"Carbs",T.eM],["water_drop",`${t.fat}g`,"Fat",T.eL]].map(([ic,val,lbl,col])=>(
          <div key={lbl} className="flex items-center gap-1 text-xs font-semibold">
            <MS name={ic} size={13} color={col} />
            <span style={{ color:T.ink }}>{val}</span>
            <span style={{ color:T.muted }}>{lbl}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {dish.micros.map(m=>(
          <span key={m} className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background:T.card, border:`1px solid ${T.border}`, color:T.muted }}>{m}</span>
        ))}
      </div>
      {addOns.length > 0 && (
        <div className="mt-2.5 border-t pt-2" style={{ borderColor:T.border }}>
          {addOns.map(a=>(
            <p key={a.name} className="flex items-center gap-1.5 text-[11px]" style={{ color:T.muted }}>
              <Plus size={10}/> {a.name} — on hand · +{a.kcal} kcal, +{a.protein}g protein
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function MissingGroceries({ items }) {
  if (items.length === 0)
    return <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium" style={{ color:"#4A5429" }}><Check size={13}/>You already have everything for this</p>;
  return (
    <div className="mt-3 rounded-2xl p-3" style={{ background:"#FBF5EA", border:`1px solid #EDD99A` }}>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide mb-2" style={{ color:"#8A7020" }}>
        <ShoppingBag size={13}/> Missing groceries?
      </p>
      {items.map(item=>(
        <div key={item} className="flex items-center justify-between py-1">
          <span className="flex items-center gap-1.5 text-sm" style={{ color:T.ink }}>
            <span>{INGREDIENT_EMOJI[item]||"🛒"}</span> {item}
          </span>
          <div className="flex gap-1.5">
            {DELIVERY_APPS.map(app=>(
              <a key={app.key} href={app.url(item)} target="_blank" rel="noopener noreferrer"
                className="rounded-full px-2 py-0.5 text-[10px] font-bold transition"
                style={{ border:`1px solid ${app.color}44`, color:app.color, background:`${app.color}0D` }}>
                {app.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MealCarousel({ slot, ranked, index, onIndex, accent, addOns, available, favorites, onFav }) {
  const slotEmoji = { Breakfast:"🌅", Lunch:"☀️", Dinner:"🌙" };
  const dish = ranked[index % ranked.length];
  const missing = dish.uses.filter(u => !available.includes(u));
  const isFav = favorites.includes(dish.name);
  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(dish.name + " recipe")}`;
  return (
    <div className="overflow-hidden rounded-3xl" style={{ background:T.card, border:`1px solid ${T.border}` }}>
      <div className="h-1 w-full" style={{ background:accent }}/>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color:T.muted }}>
            <span className="text-base">{slotEmoji[slot]}</span>{slot}
          </span>
          <button onClick={()=>onFav(dish.name)} className="transition active:scale-90">
            <Heart size={18} fill={isFav?"#E05A4E":"none"} color={isFav?"#E05A4E":T.muted}/>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>onIndex((index-1+ranked.length)%ranked.length)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ border:`1px solid ${T.border}` }}>
            <ChevronLeft size={16} color={T.muted}/>
          </button>
          <div className="flex-1 text-center">
            <h3 className="app-heading text-xl font-bold" style={{ color:T.ink }}>{dish.name}</h3>
            <p className="text-[11px] mt-0.5" style={{ color:T.muted }}>Option {(index%ranked.length)+1} of {ranked.length} · scroll for more</p>
          </div>
          <button onClick={()=>onIndex((index+1)%ranked.length)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition active:scale-90"
            style={{ border:`1px solid ${T.border}` }}>
            <ChevronRight size={16} color={T.muted}/>
          </button>
        </div>
        <p className="mt-1.5 text-center text-sm" style={{ color:T.muted }}>{dish.note}</p>
        <div className="mt-2 flex justify-center gap-1">
          {ranked.map((_,i)=>(
            <span key={i} className="h-1 rounded-full transition-all"
              style={{ width:i===index%ranked.length?14:5, background:i===index%ranked.length?accent:T.border }}/>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs" style={{ color:T.muted }}>
          <span className="flex items-center gap-1"><Clock size={12}/>{dish.time} min</span>
          <span className="flex items-center gap-1"><MS name="bolt" size={13}/>energy {dish.energy}/3</span>
          <a href={ytUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 font-medium" style={{ color:T.primary }}>
            <PlayCircle size={13}/> Watch recipe
          </a>
        </div>
        <NutritionBar dish={dish} addOns={addOns}/>
        <MissingGroceries items={missing}/>
      </div>
    </div>
  );
}

function LockedPill({ emoji, icon, text, color }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold"
      style={{ background:T.subtle, border:`1px solid ${T.border}`, color:color||T.ink }}>
      {emoji ? <span className="text-sm leading-none">{emoji}</span> : icon && <MS name={icon} size={13} color={color||T.muted}/>}
      {text}
    </span>
  );
}

function SegCtrl({ value, onChange }) {
  return (
    <div className="flex rounded-2xl p-1" style={{ background:"#EDE9DF" }}>
      {[{k:"hour",l:"Next hour",s:"1 meal"},{k:"day",l:"Next day",s:"3 meals"}].map(o=>(
        <button key={o.k} onClick={()=>onChange(o.k)}
          className="flex-1 rounded-xl py-2.5 text-center transition"
          style={{ background:value===o.k?T.ink:"transparent", color:value===o.k?"white":T.muted }}>
          <span className="block text-sm font-bold app-heading">{o.l}</span>
          <span className="block text-[10px] opacity-75">{o.s}</span>
        </button>
      ))}
    </div>
  );
}

function ProgressDots({ step, total, accent, canGoBack, onStep }) {
  return (
    <div className="flex gap-1.5 py-1">
      {Array.from({length:total},(_,i)=>{
        const active = i < step;
        const clickable = canGoBack && i < step - 1;
        return (
          <button key={i} disabled={!clickable} onClick={()=>clickable&&onStep(i+1)}
            className="h-1.5 flex-1 rounded-full transition"
            style={{ background:active?accent:T.border, cursor:clickable?"pointer":"default",
              opacity:clickable?1:active?1:0.5 }}/>
        );
      })}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center"
      style={{ background: T.canvas }}>
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg"
          style={{ background:T.ink }}>
          <span className="text-4xl">🍽️</span>
        </div>
      </div>
      <h1 className="app-heading text-5xl font-extrabold" style={{ color:T.ink }}>Mealio</h1>
      <p className="mt-3 text-base" style={{ color:T.muted }}>your kitchen's brain, not a recipe box</p>
      <div className="mt-12 h-1 w-32 overflow-hidden rounded-full" style={{ background:T.border }}>
        <div className="h-full rounded-full animate-pulse" style={{ background:T.primary, width:"60%" }}/>
      </div>
    </div>
  );
}

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const slides = [
    { emoji:"🧠", color:"#E8F4EC", heading:"Your kitchen thinks for you", sub:"Tell Mealio what's in the fridge. We handle the rest — no recipe browsing, no guesswork." },
    { emoji:"⚡", color:"#FEF5E4", heading:"Meals that match your moment", sub:"Low energy? We've got a 10-minute option. Feeling inspired? Let's cook something real." },
    { emoji:"♻️", color:"#ECF0FB", heading:"Nothing goes to waste", sub:"Leftover dal tonight? Tomorrow's breakfast is a paratha. We connect the dots so you don't have to." },
  ];
  const s = slides[slide];
  return (
    <div className="flex min-h-screen flex-col px-6 pt-12 pb-10" style={{ background:T.canvas }}>
      <div className="flex justify-end">
        <button onClick={onDone} className="text-sm font-semibold" style={{ color:T.muted }}>Skip</button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl"
          style={{ background:s.color }}>
          <span className="text-6xl">{s.emoji}</span>
        </div>
        <h2 className="app-heading text-2xl font-extrabold leading-snug" style={{ color:T.ink }}>{s.heading}</h2>
        <p className="mt-4 text-sm leading-relaxed" style={{ color:T.muted }}>{s.sub}</p>
      </div>
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_,i)=>(
          <span key={i} className="h-1.5 rounded-full transition-all"
            style={{ width:i===slide?24:8, background:i===slide?T.primary:T.border }}/>
        ))}
      </div>
      {slide < slides.length - 1
        ? <button onClick={()=>setSlide(s=>s+1)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
            style={{ background:T.primary }}>
            Next <ArrowRight size={15}/>
          </button>
        : <button onClick={onDone}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
            style={{ background:T.primary }}>
            Let's get started <ArrowRight size={15}/>
          </button>
      }
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [phone, setPhone] = useState("");
  const valid = phone.replace(/\D/g,"").length === 10;
  return (
    <div className="flex min-h-screen flex-col px-6 pt-16 pb-10" style={{ background:T.canvas }}>
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background:T.ink }}>
        <Phone size={22} color="white"/>
      </div>
      <h1 className="app-heading text-3xl font-extrabold leading-tight" style={{ color:T.ink }}>What's your number?</h1>
      <p className="mt-2 text-sm" style={{ color:T.muted }}>We'll send a one-time code to verify it's you.</p>
      <div className="mt-8 flex items-center gap-2 rounded-2xl px-4 py-3.5"
        style={{ background:T.card, border:`1.5px solid ${T.border}` }}>
        <span className="text-sm font-bold pr-2 border-r" style={{ color:T.ink, borderColor:T.border }}>+91</span>
        <input type="tel" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
          placeholder="10-digit mobile number" maxLength={10}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color:T.ink }}/>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color:T.muted }}>
        <Lock size={11}/> We never share your number
      </p>
      <button onClick={()=>valid&&onLogin(phone)} disabled={!valid}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40"
        style={{ background:T.primary }}>
        Send OTP <ArrowRight size={15}/>
      </button>
    </div>
  );
}

function OTPScreen({ phone, onVerify }) {
  const [digits, setDigits] = useState(["","","","","",""]);
  const refs = Array.from({length:6},()=>useRef(null));
  const code = digits.join("");
  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs[i+1].current?.focus();
    if (!val && i > 0) refs[i-1].current?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs[i-1].current?.focus();
  };
  const formatted = `+91 ${phone.slice(0,5)}XXXXX`;
  return (
    <div className="flex min-h-screen flex-col px-6 pt-16 pb-10" style={{ background:T.canvas }}>
      <div className="mb-8 text-5xl">📱</div>
      <h1 className="app-heading text-3xl font-extrabold leading-tight" style={{ color:T.ink }}>Check your phone</h1>
      <p className="mt-2 text-sm" style={{ color:T.muted }}>Sent a 6-digit code to <strong>{formatted}</strong></p>
      <div className="mt-8 flex gap-2">
        {digits.map((d,i)=>(
          <input key={i} ref={refs[i]} type="tel" maxLength={1} value={d}
            onChange={e=>handleDigit(i,e.target.value)}
            onKeyDown={e=>handleKey(i,e)}
            className="h-14 flex-1 rounded-xl text-center text-xl font-bold outline-none transition"
            style={{ background:T.card, border:`1.5px solid ${d?T.primary:T.border}`, color:T.ink }}/>
        ))}
      </div>
      <p className="mt-4 text-xs text-center" style={{ color:T.muted }}>
        For demo: enter any 6 digits
      </p>
      <button onClick={()=>code.length===6&&onVerify()} disabled={code.length<6}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40"
        style={{ background:T.primary }}>
        Verify & Continue <ArrowRight size={15}/>
      </button>
      <button className="mt-4 text-center text-sm" style={{ color:T.muted }}>
        Didn't receive it? Resend code
      </button>
    </div>
  );
}

function PrefsScreen({ vegPref, setVegPref, diet, setDiet, onNext }) {
  return (
    <div className="px-5 pb-10 pt-4">
      <h1 className="app-heading text-[26px] font-extrabold leading-tight" style={{ color:T.ink }}>Let's set you up.</h1>

      <div className="mt-6">
        <p className="app-heading text-lg font-bold" style={{ color:T.ink }}>Choose your orientation</p>
        <p className="text-xs mt-0.5 mb-3" style={{ color:T.primary }}>We respect your boundaries ✨</p>
        <div className="flex flex-col gap-2">
          {VEG_OPTIONS.map(v=>(
            <OptionRow key={v.key} emoji={v.emoji} label={v.label} sub={v.sub}
              selected={vegPref===v.key} onSelect={()=>setVegPref(v.key)}/>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <p className="app-heading text-lg font-bold mb-3" style={{ color:T.ink }}>What's your eating style? 🍴</p>
        <div className="flex flex-col gap-2">
          {DIET_OPTIONS.map(d=>(
            <OptionRow key={d.key} emoji={d.emoji} label={d.label} sub={d.sub}
              selected={diet===d.key} onSelect={()=>setDiet(d.key)}/>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!vegPref}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white transition disabled:opacity-40"
        style={{ background:T.primary }}>
        Next: set up your kitchen <ArrowRight size={15}/>
      </button>
      {!vegPref && <p className="mt-2 text-center text-xs" style={{ color:T.muted }}>Please choose your orientation to continue.</p>}
    </div>
  );
}

function PantryScreen({ vegPref, diet, staples, setStaples, pantry, setPantry, expiring, setExpiring, onNext }) {
  const [staplesInput, setStaplesInput] = useState("");
  const [todayInput, setTodayInput] = useState("");

  const allowedStaples = useMemo(()=>{
    const base = STAPLE_OPTIONS.filter(i=>ingOk(i,vegPref,diet));
    const extras = staples.filter(s=>!base.includes(s)&&ingOk(s,vegPref,diet));
    return [...base,...extras];
  },[vegPref,diet,staples]);

  const todayChips = useMemo(()=>{
    const base = PANTRY_CHIPS.filter(i=>ingOk(i,vegPref,diet));
    const extras = pantry.filter(p=>!base.includes(p)&&!staples.includes(p)&&ingOk(p,vegPref,diet));
    return [...base,...extras];
  },[pantry,staples,vegPref,diet]);

  const addStaple = ()=>{ const v=staplesInput.trim().toLowerCase(); if(!v)return; if(!staples.includes(v))setStaples(s=>[...s,v]); setStaplesInput(""); };
  const addToday = ()=>{ const v=todayInput.trim().toLowerCase(); if(!v)return; if(!pantry.includes(v))setPantry(p=>[...p,v]); setTodayInput(""); };

  return (
    <div className="px-5 pb-10 pt-4">
      <h1 className="app-heading text-[24px] font-extrabold leading-tight" style={{ color:T.ink }}>What's always in your kitchen?</h1>
      <p className="mt-1 text-sm" style={{ color:T.muted }}>These unlock no-cook add-ons like raita, chaas, and protein shakes.</p>

      <div className="mt-4 flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background:T.card, border:`1px solid ${T.border}` }}>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background:T.subtle }}><Mic size={15} color={T.primary}/></button>
        <input value={staplesInput} onChange={e=>setStaplesInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addStaple()}
          placeholder='Not listed? Add any staple, e.g. "almonds"'
          className="flex-1 bg-transparent text-sm outline-none" style={{ color:T.ink }}/>
        <button onClick={addStaple} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background:T.subtle }}><Plus size={15} color={T.primary}/></button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {allowedStaples.map(item=>(
          <Chip key={item} label={item} emoji={INGREDIENT_EMOJI[item]}
            selected={staples.includes(item)}
            onToggle={()=>setStaples(s=>s.includes(item)?s.filter(i=>i!==item):[...s,item])}/>
        ))}
      </div>

      <h2 className="app-heading mt-7 text-lg font-bold" style={{ color:T.ink }}>Anything specific today?</h2>
      <p className="mt-1 text-sm mb-4" style={{ color:T.muted }}>Tap to add · tap again to remove · mark items expiring soon.</p>

      <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 mb-4" style={{ background:T.card, border:`1px solid ${T.border}` }}>
        <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background:T.subtle }}><Mic size={15} color={T.primary}/></button>
        <input value={todayInput} onChange={e=>setTodayInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addToday()}
          placeholder={placeholderFor(vegPref)}
          className="flex-1 bg-transparent text-sm outline-none" style={{ color:T.ink }}/>
        <button onClick={addToday} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background:T.subtle }}><Plus size={15} color={T.primary}/></button>
      </div>

      <div className="flex flex-wrap gap-2">
        {todayChips.map(item=>(
          <button key={item} onClick={()=>{
              if(pantry.includes(item)){setPantry(p=>p.filter(i=>i!==item));setExpiring(e=>e.filter(i=>i!==item));}
              else setPantry(p=>[...p,item]);
            }}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition"
            style={{
              border:`1.5px solid ${expiring.includes(item)?"#C98A1E":pantry.includes(item)?T.primary:T.border}`,
              background:expiring.includes(item)?"#FEF5E4":pantry.includes(item)?T.selBg:T.card,
              color:expiring.includes(item)?"#8A6010":pantry.includes(item)?T.selTxt:T.ink,
            }}>
            {INGREDIENT_EMOJI[item]&&<span className="text-base leading-none">{INGREDIENT_EMOJI[item]}</span>}
            {item}
            {pantry.includes(item)&&!expiring.includes(item)&&(
              <span onClick={e=>{e.stopPropagation();setExpiring(ex=>[...ex,item]);}}
                className="ml-1 text-[10px] underline" style={{ color:T.muted }}>expiring?</span>
            )}
          </button>
        ))}
      </div>

      <button onClick={onNext}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
        style={{ background:T.primary }}>
        Next: leftovers <ArrowRight size={15}/>
      </button>
    </div>
  );
}

function LeftoversScreen({ leftovers, setLeftovers, onNext }) {
  const [input, setInput] = useState("");
  const addCustom = () => {
    const v = input.trim().toLowerCase();
    if (!v) return;
    if (!leftovers.find(l=>l.key===v)) setLeftovers(ls=>[...ls,{key:v,label:v,emoji:"🍱",qty:1}]);
    setInput("");
  };
  const toggle = (chip) => {
    if (leftovers.find(l=>l.key===chip.key))
      setLeftovers(ls=>ls.filter(l=>l.key!==chip.key));
    else
      setLeftovers(ls=>[...ls,{...chip,qty:1}]);
  };
  const adjustQty = (key, delta) => {
    setLeftovers(ls=>ls.map(l=>l.key===key?{...l,qty:Math.max(0,Math.min(3,l.qty+delta))}:l)
      .filter(l=>l.qty>0));
  };
  const QTY_LABEL = {1:"A little",2:"Decent amount",3:"A lot"};

  return (
    <div className="px-5 pb-10 pt-4">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-3xl">♻️</span>
        <div>
          <h1 className="app-heading text-[22px] font-extrabold leading-tight" style={{ color:T.ink }}>Anything left from yesterday?</h1>
          <p className="text-sm" style={{ color:T.muted }}>We'll transform these — not just reheat.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEFTOVER_CHIPS.map(chip=>{
          const added = leftovers.find(l=>l.key===chip.key);
          return (
            <button key={chip.key} onClick={()=>toggle(chip)}
              className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition"
              style={{ border:`1.5px solid ${added?T.primary:T.border}`, background:added?T.selBg:T.card, color:added?T.selTxt:T.ink }}>
              <span className="text-base leading-none">{chip.emoji}</span>
              {chip.label}
              {added&&<Check size={12} color={T.primary}/>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background:T.card, border:`1px solid ${T.border}` }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustom()}
          placeholder='Something else? e.g. "biryani"'
          className="flex-1 bg-transparent text-sm outline-none" style={{ color:T.ink }}/>
        <button onClick={addCustom} className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background:T.subtle }}><Plus size={15} color={T.primary}/></button>
      </div>

      {leftovers.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color:T.muted }}>How much is left?</p>
          {leftovers.map(l=>(
            <div key={l.key} className="flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ background:T.card, border:`1px solid ${T.border}` }}>
              <span className="flex items-center gap-2 text-sm font-semibold" style={{ color:T.ink }}>
                <span>{l.emoji}</span>{l.label}
                <span className="text-xs font-normal" style={{ color:T.muted }}>{QTY_LABEL[l.qty]}</span>
              </span>
              <div className="flex items-center gap-2">
                <button onClick={()=>adjustQty(l.key,-1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition"
                  style={{ border:`1px solid ${T.border}` }}>
                  <Minus size={13} color={T.muted}/>
                </button>
                <span className="w-4 text-center text-sm font-bold" style={{ color:T.ink }}>{l.qty}</span>
                <button onClick={()=>adjustQty(l.key,1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full transition"
                  style={{ border:`1px solid ${T.border}` }}>
                  <Plus size={13} color={T.primary}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={onNext}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
        style={{ background:T.primary }}>
        Next: how are you feeling <ArrowRight size={15}/>
      </button>
      <button onClick={onNext} className="mt-3 w-full text-center text-sm" style={{ color:T.muted }}>
        No leftovers today — skip
      </button>
    </div>
  );
}

function CheckinScreen({ horizon, energy, setEnergy, time, setTime, mood, setMood, onSubmit }) {
  const accent = energyColor(energy);
  return (
    <div className="px-5 pb-10 pt-4">
      <h1 className="app-heading text-[26px] font-extrabold leading-tight" style={{ color:T.ink }}>Quick check-in.</h1>
      <p className="mt-2 mb-6 text-sm" style={{ color:T.muted }}>
        This changes everything we suggest{horizon==="hour"?" right now":""}.
      </p>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color:T.muted }}>Energy level</p>
      <div className="flex gap-2 mb-6">
        {ENERGY_OPTIONS.map(opt=>(
          <button key={opt.key} onClick={()=>setEnergy(opt.key)}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-4 text-xs font-bold transition"
            style={{
              border:`1.5px solid ${energy===opt.key?opt.color:T.border}`,
              background:energy===opt.key?`${opt.color}18`:T.card,
              color:energy===opt.key?opt.color:T.muted,
            }}>
            <MS name={opt.icon} size={24} color={energy===opt.key?opt.color:T.muted}/>
            {opt.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color:T.muted }}>Mood <span style={{ color:T.muted, fontWeight:400 }}>(optional)</span></p>
      <div className="flex gap-2 mb-6">
        {MOOD_OPTIONS.map(m=>(
          <button key={m.key} onClick={()=>setMood(k=>k===m.key?null:m.key)}
            className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3.5 text-xs font-bold transition"
            style={{
              border:`1.5px solid ${mood===m.key?T.primary:T.border}`,
              background:mood===m.key?T.selBg:T.card,
              color:mood===m.key?T.selTxt:T.muted,
            }}>
            <span className="text-2xl leading-none">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color:T.muted }}>
        Time to cook{horizon==="hour"?" in the next hour":""}
      </p>
      <div className="flex gap-2 mb-8">
        {TIME_OPTIONS.map(opt=>(
          <button key={opt.key} onClick={()=>setTime(opt.key)}
            className="flex-1 rounded-2xl py-3 text-sm font-bold transition"
            style={{
              border:`1.5px solid ${time===opt.key?T.primary:T.border}`,
              background:time===opt.key?T.selBg:T.card,
              color:time===opt.key?T.selTxt:T.muted,
            }}>
            {opt.label}
          </button>
        ))}
      </div>

      <button onClick={onSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white"
        style={{ background:accent }}>
        {horizon==="hour"?<Utensils size={16}/>:<ClipboardList size={16}/>}
        {horizon==="hour"?"Recommend a dish":"Plan a menu"}
      </button>
    </div>
  );
}

function LoadingScreen({ accent }) {
  return (
    <div className="flex flex-col items-center justify-center py-36 text-center px-8">
      <div className="relative h-16 w-16 mb-6">
        <div className="absolute inset-0 animate-spin rounded-full"
          style={{ border:`3px solid ${T.border}`, borderTopColor:accent }}/>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🍽️</div>
      </div>
      <p className="app-heading text-lg font-bold" style={{ color:T.ink }}>
        Thinking like a nutritionist…
      </p>
      <p className="mt-2 text-sm" style={{ color:T.muted }}>Balancing expiry, energy, and your preferences</p>
    </div>
  );
}

function LeftoverTransforms({ leftovers }) {
  if (!leftovers.length) return null;
  const transforms = leftovers.flatMap(l=>LEFTOVER_TRANSFORMS[l.key]||[]);
  if (!transforms.length) return null;
  return (
    <div className="rounded-3xl overflow-hidden mb-3" style={{ background:"#F0FAF3", border:`1px solid #B6DFC2` }}>
      <div className="h-1 w-full" style={{ background:"#4A9B6A" }}/>
      <div className="p-5">
        <p className="flex items-center gap-2 text-sm font-bold mb-3" style={{ color:"#2A6B45" }}>
          ♻️ Use up your leftovers first
        </p>
        <div className="flex flex-col gap-2.5">
          {transforms.map((tr,i)=>(
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize"
                style={{ background:"#C8E8D4", color:"#2A6B45" }}>{tr.slot}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color:"#1E4D32" }}>{tr.name}</p>
                <p className="text-xs" style={{ color:"#4A7A5C" }}>{tr.note}</p>
              </div>
              <span className="ml-auto text-xs" style={{ color:"#4A7A5C" }}>{tr.time}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ horizon, slot, slots, plan, energy, mood, time, vegPref, diet, leftovers, available, effectiveStaples, carouselIndex, setCarouselIndex, favorites, onFav, onReset }) {
  const accent = energyColor(energy);
  const energyOpt = ENERGY_OPTIONS.find(e=>e.key===energy);
  const moodOpt = MOOD_OPTIONS.find(m=>m.key===mood);
  const vegOpt = VEG_OPTIONS.find(v=>v.key===vegPref);
  const dietOpt = DIET_OPTIONS.find(d=>d.key===diet);
  const slotLabel = {breakfast:"Breakfast",lunch:"Lunch",dinner:"Dinner"};
  const accompFor = s => ACCOMPANIMENTS[s].filter(a=>effectiveStaples.includes(a.staple));

  return (
    <div>
      <div className="rounded-2xl p-4 mb-4 mx-5" style={{ background:T.card, border:`1px solid ${T.border}`, borderLeft:`4px solid ${accent}` }}>
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color:T.muted }}>
          <MS name="lock" size={11} color={T.muted}/> Preferences — tap the logo above to change
        </div>
        <h2 className="app-heading text-xl font-extrabold mb-2" style={{ color:T.ink }}>
          {horizon==="hour"?`Right now: ${slotLabel[slot]} 🍽️`:"Today, sorted ✨"}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {vegOpt&&<LockedPill emoji={vegOpt.emoji} text={vegOpt.label}/>}
          <LockedPill emoji={dietOpt.emoji} text={dietOpt.label}/>
          <LockedPill icon={energyOpt.icon} text={energyOpt.label} color={energyOpt.color}/>
          {moodOpt&&<LockedPill emoji={moodOpt.emoji} text={moodOpt.label}/>}
          <LockedPill icon="schedule" text={`${time} min`}/>
          {leftovers.length>0&&<LockedPill emoji="♻️" text={`${leftovers.length} leftover${leftovers.length>1?"s":""}`}/>}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        <LeftoverTransforms leftovers={leftovers}/>
        {slots.map(s=>(
          <MealCarousel key={s}
            slot={slotLabel[s]}
            ranked={plan[s]}
            index={carouselIndex[s]}
            onIndex={i=>setCarouselIndex(c=>({...c,[s]:i}))}
            accent={accent}
            addOns={accompFor(s)}
            available={available}
            favorites={favorites}
            onFav={onFav}/>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function Mealio() {
  const [screen, setScreen] = useState("splash");
  const [phone, setPhone] = useState("");
  const [horizon, setHorizon] = useState("day");

  // Preferences (persist across daily resets)
  const [vegPref, setVegPref] = useState(null);
  const [diet, setDiet]       = useState("balanced");

  // Daily inputs (reset on "plan a new day")
  const [staples,  setStaples]  = useState(["curd","milk","eggs","rice"]);
  const [pantry,   setPantry]   = useState(["onion","spinach","paneer"]);
  const [expiring, setExpiring] = useState(["spinach","paneer"]);
  const [leftovers,setLeftovers]= useState([]);
  const [energy,   setEnergy]   = useState(2);
  const [time,     setTime]     = useState(30);
  const [mood,     setMood]     = useState(null);

  const [carouselIndex, setCarouselIndex] = useState({breakfast:0,lunch:0,dinner:0});
  const [favorites,     setFavorites]     = useState([]);

  // Auto-prune disallowed items when prefs change
  useEffect(()=>{
    setStaples(s=>s.filter(i=>ingOk(i,vegPref,diet)));
    setPantry(p=>p.filter(i=>ingOk(i,vegPref,diet)));
    setExpiring(e=>e.filter(i=>ingOk(i,vegPref,diet)));
  },[vegPref,diet]);

  const effectiveStaples = useMemo(()=>staples.filter(s=>ingOk(s,vegPref,diet)),[staples,vegPref,diet]);
  const available = useMemo(()=>[...new Set([...effectiveStaples,...pantry])],[effectiveStaples,pantry]);

  const slot  = horizon==="hour"?currentSlot():null;
  const slots = horizon==="hour"?[slot]:["breakfast","lunch","dinner"];

  const leftoverKeys = useMemo(()=>leftovers.map(l=>l.key),[leftovers]);

  const plan = useMemo(()=>{
    if(screen!=="results") return null;
    const r={};
    slots.forEach(s=>{ r[s]=rankDishes(s,available,expiring,time,energy,diet,vegPref,favorites,leftoverKeys); });
    return r;
  },[screen,available,expiring,time,energy,diet,vegPref,favorites,leftoverKeys,horizon]);

  const accent = energyColor(energy);

  const goTo = s => setScreen(s);

  const resetDaily = () => {
    setCarouselIndex({breakfast:0,lunch:0,dinner:0});
    setLeftovers([]);
    setMood(null);
    setScreen("checkin");
  };

  const MAIN_SCREENS = ["prefs","pantry","leftovers","checkin","loading","results"];
  const isMainFlow = MAIN_SCREENS.includes(screen);

  // Map screen to step number for progress bar
  const stepMap = {prefs:1,pantry:2,leftovers:3,checkin:4,loading:5,results:5};
  const currentStep = stepMap[screen]||0;

  return (
    <div className="min-h-screen w-full" style={{ background:T.canvas, color:T.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Roboto:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200&display=swap');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; }
        * { font-family:'Roboto',-apple-system,BlinkMacSystemFont,sans-serif; }
        .app-heading { font-family:'Plus Jakarta Sans',sans-serif; }
        input::placeholder { color:${T.muted}; opacity:1; }
      `}</style>

      {screen === "splash"     && <SplashScreen     onDone={()=>goTo("onboarding")}/>}
      {screen === "onboarding" && <OnboardingScreen onDone={()=>goTo("login")}/>}
      {screen === "login"      && <LoginScreen      onLogin={p=>{ setPhone(p); goTo("otp"); }}/>}
      {screen === "otp"        && <OTPScreen        phone={phone} onVerify={()=>goTo("prefs")}/>}

      {isMainFlow && (
        <div className="mx-auto max-w-md">
          {/* Sticky header */}
          <div className="sticky top-0 z-20 px-5 pb-3 pt-6" style={{ background:T.canvas }}>
            <div className="flex items-center gap-2.5 mb-4">
              <button onClick={()=>setScreen("prefs")} title="Back to preferences"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition active:scale-90"
                style={{ background:T.ink }}>
                <span className="text-lg">🍽️</span>
              </button>
              <div className="flex-1">
                <p className="app-heading text-lg font-extrabold leading-none" style={{ color:T.ink }}>Mealio</p>
                <p className="text-[11px]" style={{ color:T.muted }}>your kitchen's brain, not a recipe box</p>
              </div>
              {screen==="results"&&(
                <button onClick={resetDaily}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ background:T.subtle, color:T.primary, border:`1px solid ${T.border}` }}>
                  <RefreshCw size={12}/> New day
                </button>
              )}
            </div>

            {screen!=="results"&&(
              <>
                <SegCtrl value={horizon} onChange={v=>{ setHorizon(v); setCarouselIndex({breakfast:0,lunch:0,dinner:0}); }}/>
                <div className="mt-3">
                  <ProgressDots step={currentStep} total={4} accent={accent} canGoBack={true}
                    onStep={s=>{ const screens=["prefs","pantry","leftovers","checkin"]; setScreen(screens[s-1]); }}/>
                </div>
              </>
            )}

            {screen==="results"&&(
              <SegCtrl value={horizon} onChange={v=>{ setHorizon(v); setCarouselIndex({breakfast:0,lunch:0,dinner:0}); setScreen("checkin"); }}/>
            )}
          </div>

          {/* Screen body */}
          <div className="mx-auto max-w-md pb-12">
            {screen==="prefs"    && <PrefsScreen vegPref={vegPref} setVegPref={setVegPref} diet={diet} setDiet={setDiet} onNext={()=>goTo("pantry")}/>}
            {screen==="pantry"   && <PantryScreen vegPref={vegPref} diet={diet} staples={staples} setStaples={setStaples} pantry={pantry} setPantry={setPantry} expiring={expiring} setExpiring={setExpiring} onNext={()=>goTo("leftovers")}/>}
            {screen==="leftovers"&& <LeftoversScreen leftovers={leftovers} setLeftovers={setLeftovers} onNext={()=>goTo("checkin")}/>}
            {screen==="checkin"  && <CheckinScreen horizon={horizon} energy={energy} setEnergy={setEnergy} time={time} setTime={setTime} mood={mood} setMood={setMood} onSubmit={()=>{ setCarouselIndex({breakfast:0,lunch:0,dinner:0}); setScreen("loading"); setTimeout(()=>setScreen("results"),1400); }}/>}
            {screen==="loading"  && <LoadingScreen accent={accent}/>}
            {screen==="results"  && plan && <ResultsScreen horizon={horizon} slot={slot} slots={slots} plan={plan} energy={energy} mood={mood} time={time} vegPref={vegPref} diet={diet} leftovers={leftovers} available={available} effectiveStaples={effectiveStaples} carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex} favorites={favorites} onFav={n=>setFavorites(f=>f.includes(n)?f.filter(x=>x!==n):[...n,...f])} onReset={resetDaily}/>}
          </div>
        </div>
      )}
    </div>
  );
}
