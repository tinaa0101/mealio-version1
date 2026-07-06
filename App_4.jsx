import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowRight, Phone, Lock, ChevronLeft, ChevronRight,
  Clock, Heart, PlayCircle, ShoppingBag, Plus, Check,
  Mic, Minus, RefreshCw, ClipboardList, Utensils, X
} from "lucide-react";

// ─── LOGO ────────────────────────────────────────────────────────────────────
function MealioLogo({ size = 48, showText = false, textSize = 22 }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <svg viewBox="0 0 100 100" width={size} height={size}
        style={{ isolation:"isolate", display:"block" }}>
        <circle cx="40" cy="50" r="28" fill="#5878F0" opacity="0.9" style={{mixBlendMode:"screen"}}/>
        <circle cx="64" cy="38" r="22" fill="#F07820" opacity="0.9" style={{mixBlendMode:"screen"}}/>
        <circle cx="58" cy="62" r="22" fill="#E02858" opacity="0.9" style={{mixBlendMode:"screen"}}/>
        <circle cx="46" cy="13" r="5.5" fill="#E02858" opacity="0.72" style={{mixBlendMode:"screen"}}/>
        <circle cx="20" cy="50" r="3.5" fill="#5878F0" opacity="0.65" style={{mixBlendMode:"screen"}}/>
        <circle cx="83" cy="62" r="4.5" fill="#5878F0" opacity="0.68" style={{mixBlendMode:"screen"}}/>
        <circle cx="75" cy="12" r="3"   fill="#F07820" opacity="0.68" style={{mixBlendMode:"screen"}}/>
        <circle cx="27" cy="79" r="4"   fill="#F07820" opacity="0.58" style={{mixBlendMode:"screen"}}/>
        <circle cx="52" cy="50" r="16" fill="none" stroke="#100408" strokeWidth="2.4"/>
        <rect x="26"   y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="29.6" y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="33.2" y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="26"   y="45.5" width="9" height="1.8" rx="0.9" fill="#100408"/>
        <rect x="29.6" y="47.2" width="1.8" height="19" rx="0.9" fill="#100408"/>
        <rect x="69"   y="34" width="2.2" height="32" rx="1.1" fill="#100408"/>
        <path d="M 69 34 Q 73.5 38 73 44 L 69 44 Z" fill="#100408"/>
      </svg>
      {showText && (
        <div style={{textAlign:"center"}}>
          <p style={{fontFamily:"'Pacifico',cursive", fontSize:textSize, color:"#fff",
            margin:0, lineHeight:1.1}}>Mealio</p>
          <p style={{fontFamily:"'Nunito',sans-serif", fontSize:Math.max(9,textSize*0.38),
            color:"rgba(255,255,255,0.72)", margin:"4px 0 0", letterSpacing:"0.07em"}}>
            Art Of Meal Planning</p>
        </div>
      )}
    </div>
  );
}

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#FFF8F0", card:"#FFFFFF", subtle:"#FFF0E0",
  dark1:"#201008", indigo:"#5878F0", saffron:"#F07820", red:"#E02858",
  selBg:"#FFF0DE", selTxt:"#B85010", selBdr:"#F07820",
  ink:"#2C1410", muted:"#8A6A5A", border:"#EDD8C4",
};
const EL="#606C38", EM="#C98A1E", EH="#E05A4E";
const eColor = e => e===1?EL:e===3?EH:EM;

// ─── FOOD DATA ───────────────────────────────────────────────────────────────
const VEG_OPTIONS = [
  {key:"veg",       label:"Vegetarian",    sub:"No meat, fish, or eggs",  emoji:"🌿"},
  {key:"eggetarian",label:"Eggetarian",    sub:"Vegetarian + eggs",       emoji:"🥚"},
  {key:"vegan",     label:"Vegan",         sub:"No meat, eggs, or dairy", emoji:"🌱"},
  {key:"nonveg",    label:"Non-Vegetarian",sub:"Eats meat, fish, eggs",   emoji:"🍖"},
];
const DIET_OPTIONS = [
  {key:"balanced",   label:"Balanced",          sub:"No restrictions",        emoji:"🍽️"},
  {key:"highprotein",label:"High-Protein",       sub:"Muscle & satiety focus", emoji:"💪"},
  {key:"keto",       label:"Keto",              sub:"Low-carb, high-fat",      emoji:"🥑"},
  {key:"diabetic",   label:"Diabetic-Friendly", sub:"Low glycemic load",       emoji:"🩺"},
  {key:"glutenfree", label:"Gluten-Free",        sub:"No wheat or gluten",     emoji:"🌾"},
];
const ENERGY_OPTIONS = [
  {key:1,label:"Low",   icon:"battery_1_bar",color:EL},
  {key:2,label:"Steady",icon:"battery_4_bar",color:EM},
  {key:3,label:"High",  icon:"bolt",         color:EH},
];
const MOOD_OPTIONS = [
  {key:"inspired", label:"Inspired",  emoji:"💡"},
  {key:"rushed",   label:"Rushed",    emoji:"⚡"},
  {key:"lethargic",label:"Lethargic", emoji:"🥱"},
];
const TIME_OPTIONS = [{key:15,label:"15 min"},{key:30,label:"30 min"},{key:60,label:"1 hr+"}];

const MEAT  = ["chicken breast","fish","mutton","prawns"];
const EGGS  = ["eggs"];
const DAIRY = ["milk","curd","paneer","ghee","greek yogurt"];
const GLUTEN= ["wheat flour"];
const HICARB= ["rice","wheat flour","semolina","poha","rajma","besan"];

function ingOk(item, veg, diet) {
  if (veg==="vegan"      && [...MEAT,...EGGS,...DAIRY].includes(item)) return false;
  if (veg==="veg"        && [...MEAT,...EGGS].includes(item))          return false;
  if (veg==="eggetarian" && MEAT.includes(item))                       return false;
  if (diet==="glutenfree"&& GLUTEN.includes(item))                     return false;
  if (diet==="keto"      && HICARB.includes(item))                     return false;
  return true;
}
function vegFilter(veg) {
  return d => {
    if (veg==="vegan")      return !d.uses.some(u=>[...MEAT,...EGGS,...DAIRY].includes(u));
    if (veg==="veg")        return !d.uses.some(u=>[...MEAT,...EGGS].includes(u));
    if (veg==="eggetarian") return !d.uses.some(u=>MEAT.includes(u));
    return true;
  };
}
function dietFilter(diet) {
  return d => {
    if (diet==="keto")       return d.isKeto;
    if (diet==="diabetic")   return d.isDiabetic;
    if (diet==="glutenfree") return d.isGF;
    if (diet==="highprotein")return d.protein>=14;
    return true;
  };
}
function scoreDish(d, avail, expiring, time, energy, diet, isFav, lkeys) {
  let s = 0;

  // ── TIER 1: Leftover transform match (homemaker's first instinct) ──────────
  lkeys.forEach(k => { if (d.name.toLowerCase().includes(k)) s += 60; });

  // ── TIER 2: Ingredient coverage ratio ─────────────────────────────────────
  // "What can I make with what I already have at home?"
  // A dish where you have 4/4 ingredients beats one where you have 1/4.
  const have    = d.uses.filter(u => avail.includes(u)).length;
  const total   = d.uses.length || 1;
  const ratio   = have / total;          // 0.0 → 1.0
  s += ratio * 50;                       // full coverage = 50 pts

  // ── TIER 3: Expiring ingredient urgency ───────────────────────────────────
  // "Use before it goes bad" is always a homemaker's top concern.
  s += d.uses.filter(u => expiring.includes(u)).length * 22;

  // ── TIER 4: Missing items penalty ─────────────────────────────────────────
  // Dishes needing a grocery run rank lower — not impossible, just behind.
  s -= d.uses.filter(u => !avail.includes(u)).length * 9;

  // ── TIER 5: Energy & time match ───────────────────────────────────────────
  s -= Math.abs(d.energy - energy) * 10;
  if (d.time > time) s -= (d.time - time) * 1.5;   // penalise only if over

  // ── TIER 6: Dietary preference signal ────────────────────────────────────
  if (diet === "highprotein") s += d.protein * 0.4;

  // ── TIER 7: Favourites ────────────────────────────────────────────────────
  if (isFav) s += 15;

  // ── Tiny random tie-breaker (prevents identical results on every re-run) ──
  s += Math.random() * 4;

  return s;
}
function rankDishes(slot, avail, expiring, time, energy, diet, veg, favs, lkeys) {
  // CRITICAL: build implied availability from veg preference.
  // An eggetarian household almost always has eggs; nonveg always has eggs.
  // Without this, egg dishes score near-zero because eggs aren't in pantry.
  const impliedAvail = [...avail];
  if ((veg==="eggetarian"||veg==="nonveg") && !impliedAvail.includes("eggs")) impliedAvail.push("eggs");
  if ((veg==="nonveg") && !impliedAvail.includes("chicken breast")) {
    // don't auto-add chicken — that needs explicit selection — but do boost egg
  }
  let pool = DISHES[slot].filter(vegFilter(veg)).filter(dietFilter(diet));
  if (pool.length<3) pool = DISHES[slot].filter(vegFilter(veg));
  if (pool.length===0) pool = DISHES[slot];
  return pool
    .map(d=>({...d, score:scoreDish(d,impliedAvail,expiring,time,energy,diet,favs.includes(d.name),lkeys)}))
    .sort((a,b)=>b.score-a.score);
}
function currentSlot() {
  const h=new Date().getHours();
  return h<11?"breakfast":h<16?"lunch":"dinner";
}

const ING_EMOJI = {
  carrot:"🥕",eggs:"🥚",curd:"🥣",onion:"🧅",rice:"🍚",paneer:"🧀",
  spinach:"🥬",milk:"🥛","wheat flour":"🌾",capsicum:"🫑",poha:"🍙",
  rajma:"🫘",semolina:"🌾",peanuts:"🥜","moong dal":"🟡",
  "chicken breast":"🍗",tofu:"⬜",quinoa:"🌿","chia seeds":"⚫",
  "coconut milk":"🥥","greek yogurt":"🥛",oats:"🌾",sprouts:"🌱",
  ghee:"🧈",pickle:"🥒",papad:"🫓",besan:"🌾",cucumber:"🥒",
  potato:"🥔",tomato:"🍅",mushroom:"🍄",broccoli:"🥦",lentils:"🫘",
};
const STAPLE_OPTIONS = ["rice","wheat flour","lentils","oats","besan","quinoa","curd","milk","eggs","ghee","pickle","papad"];
const PANTRY_CHIPS   = ["paneer","spinach","eggs","moong dal","onion","carrot","capsicum","poha","rajma","semolina","peanuts","chicken breast","tofu","quinoa","chia seeds","coconut milk","greek yogurt","oats","sprouts","besan","cucumber","potato","tomato","mushroom","broccoli"];

const LEFTOVER_CHIPS = [
  {key:"dal",label:"Dal",emoji:"🍲"},{key:"rice",label:"Rice",emoji:"🍚"},
  {key:"roti",label:"Roti",emoji:"🫓"},{key:"sabzi",label:"Sabzi",emoji:"🥦"},
  {key:"curry",label:"Curry",emoji:"🍛"},{key:"khichdi",label:"Khichdi",emoji:"🍜"},
  {key:"idli",label:"Idli",emoji:"🫓"},{key:"pasta",label:"Pasta",emoji:"🍝"},
];
const LEFTOVER_TRANSFORMS = {
  dal:    [{name:"Dal Paratha",slot:"breakfast",time:20,note:"Mix into dough — protein-rich start"},
           {name:"Dal Soup",   slot:"dinner",   time:10,note:"Thin it, quick tadka — light & nourishing"}],
  rice:   [{name:"Vegetable Fried Rice",slot:"lunch",  time:15,note:"Day-old rice stir-fries better than fresh"},
           {name:"Curd Rice Bowl",       slot:"dinner", time:5, note:"Cooling, zero-effort, gut-friendly"}],
  roti:   [{name:"Roti Upma",   slot:"breakfast",time:10,note:"Crumble & temper — zero-waste breakfast"},
           {name:"Kathi Roll",  slot:"lunch",    time:10,note:"Stuff with sabzi — no cooking needed"}],
  sabzi:  [{name:"Stuffed Paratha",slot:"breakfast",time:20,note:"Most sabzis work as filling"},
           {name:"Sabzi Rice Bowl",slot:"lunch",    time:5, note:"Reheat over rice — done in 5 minutes"}],
  curry:  [{name:"Curry Paratha", slot:"breakfast",time:25,note:"Thick curry makes excellent stuffing"},
           {name:"Curry Noodles",slot:"dinner",    time:15,note:"An unexpected fusion that works"}],
  khichdi:[{name:"Khichdi Patties",slot:"breakfast",time:15,note:"Shape & shallow-fry — crispy outside"}],
  idli:   [{name:"Idli Upma",    slot:"breakfast",time:10,note:"Crumble & temper — instant zero-waste"}],
  pasta:  [{name:"Pasta Frittata",slot:"breakfast",time:15,note:"Mix with besan batter & pan-fry"}],
};

const DELIVERY_APPS = [
  {key:"zepto",   label:"Zepto",    color:"#8A2BE2",url:q=>`https://www.zeptonow.com/search?query=${encodeURIComponent(q)}`},
  {key:"blinkit", label:"Blinkit",  color:"#C4900A",url:q=>`https://blinkit.com/s/?q=${encodeURIComponent(q)}`},
  {key:"instamart",label:"Instamart",color:"#D06020",url:q=>`https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}`},
];
const ACCOMPANIMENTS = {
  breakfast:[{staple:"milk",  name:"Protein Shake",kcal:150,protein:12,carb:8, fat:3}],
  lunch:    [{staple:"curd",  name:"Raita",         kcal:70, protein:3, carb:5, fat:4}],
  dinner:   [{staple:"curd",  name:"Chaas",         kcal:40, protein:2, carb:4, fat:1},
             {staple:"pickle",name:"Pickle",         kcal:20, protein:0, carb:3, fat:1},
             {staple:"papad", name:"Papad",          kcal:35, protein:1, carb:5, fat:1}],
};

const DISHES = {
  breakfast:[
    {name:"Curd Poha",             time:10,energy:1,uses:["poha","curd","peanuts"],           protein:6, carb:38,fat:5, kcal:230,micros:["Probiotics","B12"],  isKeto:false,isGF:true, isDiabetic:false,isVegan:false,note:"Cooling, almost no stove time"},
    {name:"Vegetable Upma",        time:15,energy:1,uses:["semolina","onion","carrot"],         protein:8, carb:45,fat:6, kcal:260,micros:["Iron","B-vitamins"],isKeto:false,isGF:false,isDiabetic:false,isVegan:true, note:"One pot, no chopping marathon"},
    {name:"Coconut Chia Pudding",  time:10,energy:1,uses:["chia seeds","coconut milk"],         protein:6, carb:14,fat:18,kcal:240,micros:["Omega-3","Magnesium"],isKeto:true,isGF:true, isDiabetic:true, isVegan:true, note:"No-cook, set it the night before"},
    {name:"Moong Dal Chilla",      time:20,energy:2,uses:["moong dal","onion"],                  protein:16,carb:22,fat:6, kcal:220,micros:["Folate","Iron"],    isKeto:false,isGF:true, isDiabetic:true, isVegan:true, note:"High protein, light on the stomach"},
    {name:"Paneer Stuffed Paratha",time:30,energy:2,uses:["paneer","wheat flour"],               protein:14,carb:40,fat:16,kcal:360,micros:["Calcium","Vit D"],  isKeto:false,isGF:false,isDiabetic:false,isVegan:false,note:"Uses paneer before it turns"},
    {name:"Protein Egg Scramble",  time:15,energy:2,uses:["eggs","capsicum"],                    protein:24,carb:6, fat:10,kcal:210,micros:["B12","Selenium"],   isKeto:true, isGF:true, isDiabetic:true, isVegan:false,note:"Quick lean protein start"},
    {name:"Besan Cheela",          time:25,energy:2,uses:["besan","tomato","onion"],              protein:18,carb:30,fat:10,kcal:290,micros:["Folate","Iron"],    isKeto:false,isGF:true, isDiabetic:true, isVegan:true, note:"High-protein, gluten-free, filling"},
    {name:"Oats Veggie Bowl",      time:15,energy:2,uses:["oats","carrot","spinach"],             protein:10,carb:36,fat:5, kcal:230,micros:["Fibre","Iron"],     isKeto:false,isGF:true, isDiabetic:true, isVegan:true, note:"Savoury oats — better than you think"},
    {name:"Stuffed Mushroom Toast",time:40,energy:3,uses:["mushroom","sprouts","wheat flour"],    protein:20,carb:35,fat:12,kcal:320,micros:["Vit D","Folate"],   isKeto:false,isGF:false,isDiabetic:false,isVegan:true, note:"Weekend-worthy stacked breakfast"},
  ],
  lunch:[
    {name:"Curd Rice + Pickle",    time:15,energy:1,uses:["rice","curd"],                        protein:7, carb:50,fat:5, kcal:290,micros:["Probiotics","Calcium"],isKeto:false,isGF:true, isDiabetic:false,isVegan:false,note:"Almost no effort, easy on energy"},
    {name:"Light Veg Soup + Toast",time:20,energy:1,uses:["carrot","spinach","onion"],            protein:6, carb:24,fat:4, kcal:180,micros:["Vit A","Potassium"],  isKeto:false,isGF:false,isDiabetic:true, isVegan:true, note:"Gentle option on a slow day"},
    {name:"Spinach Dal + Rice",    time:30,energy:2,uses:["spinach","moong dal","rice"],          protein:14,carb:55,fat:6, kcal:340,micros:["Iron","Vit A"],        isKeto:false,isGF:true, isDiabetic:false,isVegan:true, note:"Spinach won't survive the week"},
    {name:"Paneer Bhurji + Roti",  time:25,energy:2,uses:["paneer","capsicum","wheat flour"],     protein:18,carb:35,fat:18,kcal:370,micros:["Calcium","B12"],       isKeto:false,isGF:false,isDiabetic:false,isVegan:false,note:"Quick paneer turnaround"},
    {name:"Quinoa Veg Bowl",       time:25,energy:2,uses:["quinoa","carrot","spinach"],           protein:12,carb:40,fat:8, kcal:300,micros:["Magnesium","Folate"],   isKeto:false,isGF:true, isDiabetic:false,isVegan:true, note:"Complete plant protein, loaded bowl"},
    {name:"Egg Curry + Rice",       time:25,energy:2,uses:["eggs","rice","onion"],            protein:20,carb:48,fat:14,kcal:360,micros:["B12","Zinc"],            isKeto:false,isGF:true, isDiabetic:false,isVegan:false,note:"Quick egg curry, great with leftover rice"},
    {name:"Masala Omelette + Toast",  time:15,energy:2,uses:["eggs","onion","capsicum"],         protein:22,carb:20,fat:14,kcal:290,micros:["B12","Selenium"],         isKeto:false,isGF:false,isDiabetic:true, isVegan:false,note:"Classic high-protein lunch in 15 minutes"},
    {name:"Grilled Chicken Salad", time:30,energy:2,uses:["chicken breast","capsicum"],           protein:35,carb:8, fat:14,kcal:320,micros:["Niacin","Phosphorus"],  isKeto:true, isGF:true, isDiabetic:true, isVegan:false,note:"Lean, high-protein, low cleanup"},
    {name:"Rajma + Jeera Rice",    time:45,energy:3,uses:["rajma","rice"],                        protein:16,carb:60,fat:8, kcal:380,micros:["Folate","Potassium"],   isKeto:false,isGF:true, isDiabetic:false,isVegan:true, note:"Worth it when you have the energy"},
    {name:"Tofu Stir-Fry Bowl",    time:25,energy:2,uses:["tofu","capsicum","carrot"],            protein:18,carb:14,fat:12,kcal:250,micros:["Calcium","Iron"],        isKeto:true, isGF:true, isDiabetic:true, isVegan:true, note:"Fast, plant protein, one pan"},
    {name:"Chicken Power Bowl",    time:50,energy:3,uses:["chicken breast","broccoli","quinoa"],  protein:38,carb:30,fat:12,kcal:380,micros:["B6","Zinc"],             isKeto:false,isGF:true, isDiabetic:true, isVegan:false,note:"A proper sit-down, high-effort bowl"},
  ],
  dinner:[
    {name:"Light Vegetable Soup",  time:20,energy:1,uses:["carrot","spinach","onion"],            protein:5, carb:18,fat:3, kcal:120,micros:["Vit A","Potassium"],  isKeto:true, isGF:true, isDiabetic:true, isVegan:true, note:"Easy on a tired, low-appetite night"},
    {name:"Curd Rice Bowl",        time:15,energy:1,uses:["rice","curd","cucumber"],              protein:7, carb:45,fat:5, kcal:270,micros:["Probiotics","Calcium"],isKeto:false,isGF:true, isDiabetic:false,isVegan:false,note:"Cooling, almost zero cleanup"},
    {name:"Egg Bhurji + Toast",    time:15,energy:1,uses:["eggs","onion"],                        protein:16,carb:28,fat:12,kcal:280,micros:["B12","Choline"],       isKeto:false,isGF:false,isDiabetic:false,isVegan:false,note:"Fastest protein option tonight"},
    {name:"Vegetable Khichdi",     time:30,energy:2,uses:["rice","moong dal","carrot","spinach"], protein:13,carb:52,fat:6, kcal:320,micros:["Iron","Vit A"],         isKeto:false,isGF:true, isDiabetic:false,isVegan:true, note:"Gentle one-pot, clears the fridge"},
    {name:"Tofu Stir-Fry",         time:25,energy:2,uses:["tofu","capsicum","carrot"],            protein:18,carb:14,fat:12,kcal:250,micros:["Calcium","Iron"],       isKeto:true, isGF:true, isDiabetic:true, isVegan:true, note:"Fast, plant protein, one pan"},
    {name:"Palak Paneer + Roti",   time:35,energy:2,uses:["spinach","paneer","wheat flour"],      protein:19,carb:32,fat:18,kcal:360,micros:["Iron","Calcium"],       isKeto:false,isGF:false,isDiabetic:false,isVegan:false,note:"Uses spinach + paneer together"},
    {name:"Tandoori Chicken + Veg",time:45,energy:3,uses:["chicken breast","carrot"],             protein:38,carb:10,fat:16,kcal:360,micros:["B6","Zinc"],            isKeto:true, isGF:true, isDiabetic:true, isVegan:false,note:"Worth firing up the pan tonight"},
    {name:"Stuffed Potato Bake",   time:50,energy:3,uses:["potato","mushroom","paneer"],          protein:16,carb:48,fat:16,kcal:400,micros:["Vit C","Calcium"],      isKeto:false,isGF:true, isDiabetic:false,isVegan:false,note:"Oven night — a proper weekend dinner"},
    {name:"Slow-Cooked Rajma",     time:55,energy:3,uses:["rajma","tomato","rice"],               protein:18,carb:62,fat:9, kcal:400,micros:["Folate","Iron"],        isKeto:false,isGF:true, isDiabetic:false,isVegan:true, note:"Best when you want to properly cook"},
  ],
};

// ─── SHARED MICRO COMPONENTS ─────────────────────────────────────────────────
function SwipeScreen({ children, onSwipeLeft, onSwipeRight }) {
  const sx = useRef(null), sy = useRef(null);
  return (
    <div
      onTouchStart={e=>{sx.current=e.touches[0].clientX;sy.current=e.touches[0].clientY;}}
      onTouchEnd={e=>{
        if(sx.current===null)return;
        const dx=e.changedTouches[0].clientX-sx.current;
        const dy=Math.abs(e.changedTouches[0].clientY-sy.current);
        sx.current=null;
        if(dy>60)return;
        if(dx<-60&&onSwipeLeft)  onSwipeLeft();
        if(dx> 60&&onSwipeRight) onSwipeRight();
      }}
      style={{width:"100%",minHeight:"100%"}}
    >{children}</div>
  );
}
function GlowBlob({color,opacity,blur,x,y,size}){
  return <div style={{position:"absolute",top:y,left:x,width:size,height:size,borderRadius:"50%",background:color,opacity,filter:`blur(${blur}px)`,pointerEvents:"none"}}/>;
}
function PrimaryBtn({label,onClick,disabled,icon,btnRef}){
  return (
    <button ref={btnRef} onClick={onClick} disabled={disabled} style={{
      display:"flex",alignItems:"center",justifyContent:"center",gap:8,
      width:"100%",padding:"15px 20px",borderRadius:16,border:"none",
      background:disabled?"#D4C4B4":`linear-gradient(135deg,${C.saffron},${C.red})`,
      color:"white",fontSize:14,fontWeight:800,
      fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:disabled?"not-allowed":"pointer",
    }}>
      {icon}{label}<ArrowRight size={16}/>
    </button>
  );
}
function OptionRow({emoji,label,sub,selected,onSelect}){
  return (
    <button onClick={onSelect} style={{
      display:"flex",alignItems:"center",gap:12,width:"100%",
      borderRadius:16,padding:"14px 16px",textAlign:"left",cursor:"pointer",
      border:`1.5px solid ${selected?C.saffron:C.border}`,
      background:selected?C.selBg:C.card,
    }}>
      {emoji&&<span style={{fontSize:20,lineHeight:1,flexShrink:0}}>{emoji}</span>}
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
          color:selected?C.selTxt:C.ink,margin:0}}>{label}</p>
        {sub&&<p style={{fontSize:12,color:C.muted,margin:0}}>{sub}</p>}
      </div>
      {selected&&<Check size={18} color={C.saffron}/>}
    </button>
  );
}
function MS({name,size=20,color,fill=0}){
  return <span className="material-symbols-outlined"
    style={{fontSize:size,color,lineHeight:1,
      fontVariationSettings:`'FILL' ${fill},'wght' 400,'GRAD' 0,'opsz' ${size}`}}>{name}</span>;
}

// ─── SPLASH ──────────────────────────────────────────────────────────────────
function SplashScreen({onDone}){
  const [p,setP]=useState(0);
  useEffect(()=>{
    const t0=Date.now(),tot=5000;
    const tick=()=>{const v=Math.min((Date.now()-t0)/tot,1);setP(v);if(v<1)requestAnimationFrame(tick);else setTimeout(onDone,250);};
    requestAnimationFrame(tick);
  },[]);
  const BOXES=[{e:"🧠",l:"Thinks\nfor you"},{e:"🥕",l:"Uses what's\nalready home"},{e:"⚡",l:"Matches\nyour energy"}];
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",background:`radial-gradient(ellipse at 30% 40%,#3A3090,${C.dark1} 60%)`,
      padding:"0 28px",textAlign:"center",isolation:"isolate",position:"relative",overflow:"hidden"}}>

      {/* Animated glow blobs — pulse breathing effect */}
      {[{c:C.indigo,x:"18%",y:"12%",s:240},{c:C.saffron,x:"54%",y:"24%",s:200},{c:C.red,x:"28%",y:"54%",s:180}].map((g,i)=>(
        <div key={i} style={{position:"absolute",top:g.y,left:g.x,width:g.s,height:g.s,
          borderRadius:"50%",background:g.c,opacity:0.18,filter:"blur(64px)",pointerEvents:"none",
          animation:`glowPulse ${2.8+i*0.7}s ease-in-out ${i*0.4}s infinite`}}/>
      ))}

      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>

        {/* Logo — scale bounce reveal like Myntra/Zepto */}
        <div style={{animation:"logoReveal 0.75s cubic-bezier(0.34,1.56,0.64,1) 0.1s both"}}>
          <MealioLogo size={130} showText textSize={46}/>
        </div>

        {/* Three info boxes — equal size, staggered slide-up */}
        <div style={{marginTop:40,display:"flex",gap:10,width:"100%",maxWidth:340}}>
          {BOXES.map((item,i)=>(
            <div key={i} style={{
              flex:"1 1 0",minWidth:0,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              gap:8,background:"rgba(255,255,255,0.09)",borderRadius:16,padding:"16px 8px",
              border:"0.5px solid rgba(255,255,255,0.14)",
              animation:`fadeSlideUp 0.5s ease ${0.55+i*0.14}s both`,
              textAlign:"center",minHeight:88
            }}>
              <span style={{fontSize:24,lineHeight:1}}>{item.e}</span>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.72)",
                fontFamily:"'Nunito',sans-serif",fontWeight:700,
                lineHeight:1.45,whiteSpace:"pre-line",letterSpacing:"0.01em"}}>{item.l}</span>
            </div>
          ))}
        </div>

        {/* Progress bar — shimmer animation like BookMyShow */}
        <div style={{marginTop:48,width:160,height:4,borderRadius:2,
          background:"rgba(255,255,255,0.12)",overflow:"hidden"}}>
          <div style={{height:"100%",borderRadius:2,
            background:`linear-gradient(90deg,${C.indigo},${C.saffron},${C.red})`,
            backgroundSize:"200% auto",
            width:`${p*100}%`,transition:"width 0.12s linear",
            animation:"shimmerBar 1.8s linear infinite"}}/>
        </div>
        <p style={{marginTop:10,fontSize:11,color:"rgba(255,255,255,0.32)",
          fontFamily:"'Nunito',sans-serif",animation:"fadeSlideUp 0.5s ease 0.9s both"}}>
          Loading your kitchen brain…</p>
      </div>
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────
const SLIDES=[
  {bg:`radial-gradient(ellipse at 25% 35%,#4060D8,#201008 65%)`,
   g:[{c:C.indigo,x:"12%",y:"18%",s:200},{c:C.saffron,x:"58%",y:"52%",s:160}],
   emoji:"🧠",eClr:"#EAF0FF",
   head:"Tell Mealio what's in\nyour fridge or pantry!",
   sub:"We scan what you have!\nNo recipe browsing, no guesswork,\nno wasted food!"},
  {bg:`radial-gradient(ellipse at 70% 30%,#C04010,#201008 65%)`,
   g:[{c:C.saffron,x:"58%",y:"16%",s:180},{c:C.red,x:"18%",y:"58%",s:160}],
   emoji:"⚡",eClr:"#FFF3E8",
   head:"Meals that match\nyour moment!",
   sub:"Low energy? We've got a 10-minute fix!\nInspired? Let's cook something real!\nYou set the mood — we set the menu!"},
  {bg:`radial-gradient(ellipse at 40% 65%,#A01838,#201008 65%)`,
   g:[{c:C.red,x:"28%",y:"52%",s:180},{c:C.indigo,x:"68%",y:"18%",s:160}],
   emoji:"♻️",eClr:"#FFE8EE",
   head:"Nothing goes waste\nin your kitchen!",
   sub:"Leftover dal tonight?\nTomorrow's breakfast is a paratha!\nWe connect the dots — you just eat!"},
];
function OnboardingScreen({onDone}){
  const [idx,setIdx]=useState(0);
  const s=SLIDES[idx];
  const isLast=idx===SLIDES.length-1;
  const next=()=>isLast?onDone():setIdx(i=>i+1);
  const prev=()=>idx>0&&setIdx(i=>i-1);
  return (
    <SwipeScreen onSwipeLeft={next} onSwipeRight={prev}>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",
        background:s.bg,isolation:"isolate",position:"relative",transition:"background 0.4s"}}>
        {s.g.map((g,i)=><GlowBlob key={i} color={g.c} opacity={0.2} blur={60} x={g.x} y={g.y} size={g.s}/>)}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"52px 24px 0",position:"relative",zIndex:1}}>
          <MealioLogo size={38}/>
          <button onClick={onDone} style={{background:"rgba(255,255,255,0.12)",
            border:"0.5px solid rgba(255,255,255,0.22)",borderRadius:20,
            padding:"6px 16px",color:"rgba(255,255,255,0.75)",fontSize:12,
            fontFamily:"'Nunito',sans-serif",fontWeight:600,cursor:"pointer"}}>Skip</button>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",padding:"32px 32px 0",position:"relative",zIndex:1,textAlign:"center"}}>
          <div style={{width:120,height:120,borderRadius:32,background:s.eClr,
            display:"flex",alignItems:"center",justifyContent:"center",
            marginBottom:28,boxShadow:"0 8px 32px rgba(0,0,0,0.25)"}}>
            <span style={{fontSize:56}}>{s.emoji}</span>
          </div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:26,fontWeight:800,
            color:"white",margin:"0 0 16px",lineHeight:1.35,whiteSpace:"pre-line"}}>{s.head}</h2>
          <p style={{fontFamily:"'Nunito',sans-serif",fontSize:15,color:"rgba(255,255,255,0.72)",
            margin:0,lineHeight:1.85,whiteSpace:"pre-line",fontStyle:"italic"}}>{s.sub}</p>
        </div>
        <div style={{padding:"32px 24px 44px",position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:22}}>
            {SLIDES.map((_,i)=>(
              <button key={i} onClick={()=>setIdx(i)} style={{
                height:6,width:i===idx?28:8,borderRadius:3,
                background:i===idx?C.saffron:"rgba(255,255,255,0.3)",
                border:"none",cursor:"pointer",padding:0,transition:"width 0.3s,background 0.3s"}}/>
            ))}
          </div>
          <div style={{display:"flex",gap:12}}>
            {idx>0&&(
              <button onClick={prev} style={{width:52,height:52,borderRadius:16,
                border:"1px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.1)",
                display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",flexShrink:0}}>
                <ChevronLeft size={20} color="white"/>
              </button>
            )}
            <button onClick={next} style={{flex:1,height:52,borderRadius:16,border:"none",
              background:`linear-gradient(135deg,${C.saffron},${C.red})`,
              color:"white",fontSize:15,fontWeight:800,
              fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              {isLast?"Let's get started!":"Next →"}
            </button>
          </div>
          <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.38)",
            marginTop:14,fontFamily:"'Nunito',sans-serif",fontStyle:"italic"}}>
            Swipe left to go forward · swipe right to go back</p>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [phone,setPhone]=useState("");
  const valid=phone.replace(/\D/g,"").length===10;
  return (
    <SwipeScreen>
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{background:`linear-gradient(135deg,${C.dark1},#3A2818)`,
          padding:"52px 24px 32px",isolation:"isolate",position:"relative"}}>
          <GlowBlob color={C.saffron} opacity={0.14} blur={50} x="55%" y="0%" size={180}/>
          <GlowBlob color={C.red}     opacity={0.10} blur={40} x="20%" y="40%" size={120}/>
          <MealioLogo size={46} showText textSize={24}/>
        </div>
        <div style={{flex:1,padding:"36px 24px 44px"}}>
          <div style={{width:52,height:52,borderRadius:16,background:C.subtle,
            display:"flex",alignItems:"center",justifyContent:"center",
            marginBottom:20,border:`1px solid ${C.border}`}}>
            <Phone size={22} color={C.saffron}/>
          </div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,
            fontWeight:800,color:C.ink,margin:"0 0 8px",lineHeight:1.2}}>What's your number?</h1>
          <p style={{fontSize:14,color:C.muted,margin:"0 0 32px",fontFamily:"'Nunito',sans-serif",
            lineHeight:1.75,fontStyle:"italic"}}>We'll send a one-time code —<br/>takes 10 seconds!</p>
          <div style={{display:"flex",alignItems:"center",borderRadius:16,
            border:`1.5px solid ${phone.length>0?C.saffron:C.border}`,
            background:C.card,overflow:"hidden",transition:"border-color 0.2s"}}>
            <div style={{padding:"16px 14px",borderRight:`1px solid ${C.border}`,
              fontWeight:700,fontSize:14,color:C.ink,
              fontFamily:"'Plus Jakarta Sans',sans-serif",flexShrink:0}}>+91</div>
            <input type="tel" value={phone}
              onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit mobile number" maxLength={10}
              style={{flex:1,border:"none",outline:"none",padding:"16px 14px",
                fontSize:16,color:C.ink,background:"transparent",
                fontFamily:"'Nunito',sans-serif",minWidth:0}}/>
            {phone.length===10&&(
              <div style={{padding:"0 14px"}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:C.saffron,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="10" height="8" viewBox="0 0 10 8">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:10}}>
            <Lock size={11} color={C.muted}/>
            <p style={{margin:0,fontSize:12,color:C.muted,fontFamily:"'Nunito',sans-serif"}}>
              Your number is safe — we never share or spam!</p>
          </div>
          <div style={{marginTop:32}}>
            <PrimaryBtn label="Send OTP" disabled={!valid} onClick={()=>valid&&onLogin(phone)}/>
            {!valid&&phone.length>0&&(
              <p style={{textAlign:"center",fontSize:12,color:C.red,marginTop:10,
                fontFamily:"'Nunito',sans-serif"}}>Please enter a valid 10-digit number</p>
            )}
          </div>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── OTP ─────────────────────────────────────────────────────────────────────
function OTPScreen({phone,onVerify,onBack}){
  const [digits,setDigits]=useState(["","","",""]);
  const inputRefs=useRef([]);
  const verifyRef=useRef(null);
  const code=digits.join("");
  const fmt=`+91 ${phone.slice(0,5)} XXXXX`;
  const handleDigit=(i,val)=>{
    if(!/^\d?$/.test(val))return;
    const n=[...digits];n[i]=val;setDigits(n);
    if(val&&i<3) inputRefs.current[i+1]?.focus();
    else if(val&&i===3) setTimeout(()=>verifyRef.current?.focus(),80);
    if(!val&&i>0)inputRefs.current[i-1]?.focus();
  };
  const handleKey=(i,e)=>{
    if(e.key==="Backspace"&&!digits[i]&&i>0)inputRefs.current[i-1]?.focus();
  };
  return (
    <SwipeScreen onSwipeRight={onBack}>
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{background:`linear-gradient(135deg,${C.dark1},#3A2818)`,
          padding:"52px 24px 32px",isolation:"isolate",position:"relative"}}>
          <GlowBlob color={C.red}   opacity={0.14} blur={50} x="28%" y="0%" size={160}/>
          <GlowBlob color={C.indigo} opacity={0.10} blur={40} x="62%" y="30%" size={120}/>
          <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",
            border:"0.5px solid rgba(255,255,255,0.2)",borderRadius:12,
            padding:"7px 14px",color:"rgba(255,255,255,0.75)",fontSize:13,
            fontFamily:"'Nunito',sans-serif",fontWeight:600,cursor:"pointer",
            display:"flex",alignItems:"center",gap:4,marginBottom:16,width:"fit-content"}}>
            <ChevronLeft size={15}/> Back
          </button>
          <MealioLogo size={38}/>
        </div>
        <div style={{flex:1,padding:"36px 24px 44px"}}>
          <span style={{fontSize:48,display:"block",marginBottom:16}}>📱</span>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:28,
            fontWeight:800,color:C.ink,margin:"0 0 8px",lineHeight:1.2}}>Check your phone!</h1>
          <p style={{fontSize:14,color:C.muted,margin:"0 0 32px",
            fontFamily:"'Nunito',sans-serif",lineHeight:1.75,fontStyle:"italic"}}>
            Sent a 6-digit code to{" "}
            <strong style={{color:C.ink,fontStyle:"normal"}}>{fmt}</strong>
          </p>
          {/* OTP boxes — fontSize:16 prevents iOS zoom/scroll bug */}
          <div style={{display:"flex",gap:8,width:"100%",maxWidth:"100%"}}>
            {digits.map((d,i)=>(
              <input key={i}
                ref={el=>inputRefs.current[i]=el}
                type="tel" inputMode="numeric" maxLength={1} value={d}
                onChange={e=>handleDigit(i,e.target.value)}
                onKeyDown={e=>handleKey(i,e)}
                onFocus={e=>e.target.select()}
                style={{flex:1,minWidth:0,height:56,borderRadius:14,textAlign:"center",
                  fontSize:16,fontWeight:700,outline:"none",
                  border:`2px solid ${d?C.saffron:C.border}`,
                  background:d?C.selBg:C.card,color:C.ink,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  transition:"border-color 0.2s,background 0.2s"}}/>
            ))}
          </div>
          <p style={{fontSize:12,color:C.muted,marginTop:12,
            fontFamily:"'Nunito',sans-serif",textAlign:"center",fontStyle:"italic"}}>
            Demo — any 4 digits will work!</p>
          <div style={{marginTop:28}}>
            <PrimaryBtn label="Verify & Continue" disabled={code.length<4}
              btnRef={verifyRef}
              onClick={()=>code.length===4&&onVerify()}/>
          </div>
          <button style={{display:"block",width:"100%",marginTop:14,background:"none",
            border:"none",fontSize:13,color:C.muted,
            fontFamily:"'Nunito',sans-serif",cursor:"pointer",fontWeight:600}}>
            Didn't receive it? Resend code</button>
          <p style={{textAlign:"center",fontSize:11,color:C.muted,marginTop:10,
            fontFamily:"'Nunito',sans-serif",fontStyle:"italic"}}>
            ← Swipe right to change your number</p>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── APP HEADER (sticky) ─────────────────────────────────────────────────────

// ─── WEEKLY PLANNER ──────────────────────────────────────────────────────────

function getWeekDays(weekOffset) {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow===0?6:dow-1) + weekOffset*7);
  monday.setHours(0,0,0,0);
  return Array.from({length:7},(_,i)=>{
    const d = new Date(monday); d.setDate(monday.getDate()+i);
    return d.toISOString().split('T')[0];
  });
}
function dayMeta(dateStr){
  const d = new Date(dateStr+'T00:00:00');
  return {
    day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
    date:d.getDate(),
    month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()],
  };
}
function isToday(dateStr){ return dateStr===new Date().toISOString().split('T')[0]; }

const LEFTOVER_CHAINS = {
  "Rajma + Jeera Rice":      {next:"Dal Paratha",         slot:"breakfast",note:"Use last night's rajma as stuffing!"},
  "Slow-Cooked Rajma":       {next:"Dal Paratha",         slot:"breakfast",note:"Thick rajma = perfect paratha filling"},
  "Spinach Dal + Rice":      {next:"Dal Paratha",         slot:"breakfast",note:"Turn dal into crispy parathas"},
  "Vegetable Khichdi":       {next:"Khichdi Patties",     slot:"breakfast",note:"Shape & pan-fry — crispy outside"},
  "Palak Paneer + Roti":     {next:"Paneer Stuffed Paratha",slot:"breakfast",note:"Leftover palak paneer = best stuffing"},
  "Egg Curry + Rice":        {next:"Egg Bhurji + Toast",  slot:"breakfast",note:"Quick twist on last night's eggs"},
  "Tandoori Chicken + Veg":  {next:"Chicken Kathi Roll",  slot:"lunch",    note:"Wrap leftover chicken — done in 10 min"},
  "Grilled Chicken Salad":   {next:"Chicken Kathi Roll",  slot:"lunch",    note:"Repurpose chicken beautifully"},
};

function getSlotSuggestions(slot, dayKey, weekPlan, vegPref, diet, count=3){
  const usedNames = new Set(Object.values(weekPlan).map(m=>m.name));
  const suggestions = [];

  // Leftover chain check: look at previous day's dinner
  const prev = new Date(dayKey+'T00:00:00');
  prev.setDate(prev.getDate()-1);
  const prevDinner = weekPlan[prev.toISOString().split('T')[0]+'_dinner'];
  if(prevDinner && LEFTOVER_CHAINS[prevDinner.name]){
    const chain = LEFTOVER_CHAINS[prevDinner.name];
    if(chain.slot===slot){
      suggestions.push({name:chain.next,reason:chain.note,isChain:true,time:15});
    }
  }

  // Balance: if lunch for same day has heavy carbs suggest protein for dinner
  const sameDayLunch = slot==='dinner'?weekPlan[dayKey+'_lunch']:null;
  let boostProtein = sameDayLunch && DISHES.lunch.find(d=>d.name===sameDayLunch.name&&d.carb>40);

  let pool = DISHES[slot].filter(vegFilter(vegPref)).filter(dietFilter(diet));
  const fresh = pool.filter(d=>!usedNames.has(d.name));
  const fill = fresh.length>=count?fresh:[...fresh,...pool.filter(d=>usedNames.has(d.name))];

  const scored = fill.map(d=>({
    ...d,
    score: scoreDish(d,[],[],30,2,diet,false,[])
      + (boostProtein&&d.protein>=16?12:0)
      + Math.random()*3,
  })).sort((a,b)=>b.score-a.score);

  scored.forEach(d=>{
    if(suggestions.length<count&&!suggestions.find(s=>s.name===d.name)){
      suggestions.push({name:d.name,reason:d.note,isChain:false,time:d.time});
    }
  });
  return suggestions.slice(0,count);
}

function fillEntireWeek(weekDays, weekPlan, vegPref, diet){
  const result={...weekPlan};
  const usedNames=new Set(Object.values(result).map(m=>m.name));

  weekDays.forEach((day,dayIdx)=>{
    ['breakfast','lunch','dinner'].forEach(slot=>{
      const key=`${day}_${slot}`;
      if(result[key]) return;

      // Leftover chain
      if(dayIdx>0){
        const prevDay=weekDays[dayIdx-1];
        const prevDinner=result[prevDay+'_dinner'];
        if(prevDinner&&LEFTOVER_CHAINS[prevDinner.name]?.slot===slot){
          const chain=LEFTOVER_CHAINS[prevDinner.name];
          result[key]={name:chain.next,source:'ai',isChain:true};
          usedNames.add(chain.next);
          return;
        }
      }

      let pool=DISHES[slot].filter(vegFilter(vegPref)).filter(dietFilter(diet));
      let fresh=pool.filter(d=>!usedNames.has(d.name));
      if(!fresh.length) fresh=pool;

      const picked=fresh
        .map(d=>({...d,score:scoreDish(d,[],[],30,2,diet,false,[])+Math.random()*4}))
        .sort((a,b)=>b.score-a.score)[0];

      if(picked){
        result[key]={name:picked.name,source:'ai'};
        usedNames.add(picked.name);
      }
    });
  });
  return result;
}

// ─── ADD MEAL PANEL (bottom sheet) ───────────────────────────────────────────
function AddMealPanel({slot,dayKey,weekPlan,vegPref,diet,onAdd,onClose}){
  const [query,setQuery]=useState('');
  const SLOTLBL={breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner'};
  const SLOTEMO={breakfast:'🌅',lunch:'☀️',dinner:'🌙'};

  const suggestions=useMemo(
    ()=>getSlotSuggestions(slot,dayKey,weekPlan,vegPref,diet),
    [slot,dayKey]
  );

  const allNames=useMemo(()=>
    DISHES[slot].filter(vegFilter(vegPref)).map(d=>d.name)
  ,[slot,vegPref]);

  const filtered=query.length>=2
    ?allNames.filter(n=>n.toLowerCase().includes(query.toLowerCase()))
    :[];

  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,maxWidth:430,margin:'0 auto',
      background:'white',borderRadius:'24px 24px 0 0',
      boxShadow:'0 -8px 40px rgba(0,0,0,0.18)',zIndex:300,
      maxHeight:'82vh',overflowY:'auto',
      animation:'panelUp 0.28s cubic-bezier(0.32,0.72,0,1) both'}}>
      <style>{`@keyframes panelUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

      {/* Drag handle */}
      <div style={{display:'flex',justifyContent:'center',padding:'14px 0 6px'}}>
        <div style={{width:36,height:4,borderRadius:2,background:C.border}}/>
      </div>

      <div style={{padding:'0 20px 40px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,
            color:C.ink,margin:0}}>{SLOTEMO[slot]} {SLOTLBL[slot]}</p>
          <button onClick={onClose} style={{background:C.subtle,border:'none',borderRadius:10,
            width:30,height:30,cursor:'pointer',fontSize:18,color:C.muted,lineHeight:'30px',
            display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>
        </div>

        {/* Search */}
        <div style={{display:'flex',alignItems:'center',gap:8,borderRadius:14,
          border:`1.5px solid ${query.length?C.saffron:C.border}`,
          background:C.subtle,padding:'11px 14px',marginBottom:16,transition:'border 0.2s'}}>
          <span style={{fontSize:15}}>🔍</span>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Search any dish or type your own…"
            autoFocus
            style={{flex:1,border:'none',background:'transparent',outline:'none',
              fontSize:14,color:C.ink,fontFamily:"'Nunito',sans-serif"}}/>
          {query&&<button onClick={()=>setQuery('')}
            style={{background:'none',border:'none',cursor:'pointer',color:C.muted,fontSize:16}}>×</button>}
        </div>

        {/* Search results */}
        {filtered.length>0&&(
          <div style={{marginBottom:16,borderRadius:14,overflow:'hidden',
            border:`1px solid ${C.border}`}}>
            {filtered.slice(0,7).map((name,i)=>(
              <button key={name} onClick={()=>onAdd({name,source:'manual'})}
                style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  width:'100%',padding:'12px 14px',background:'white',border:'none',
                  borderBottom:i<Math.min(filtered.length,7)-1?`1px solid ${C.border}`:'none',
                  cursor:'pointer',textAlign:'left'}}>
                <span style={{fontSize:13,color:C.ink,fontWeight:600,
                  fontFamily:"'Nunito',sans-serif"}}>{name}</span>
                <span style={{fontSize:12,color:C.saffron,fontWeight:700}}>+ Add</span>
              </button>
            ))}
          </div>
        )}

        {/* Custom entry if no match */}
        {query.length>=2&&!filtered.length&&(
          <button onClick={()=>onAdd({name:query.trim(),source:'custom'})}
            style={{width:'100%',padding:'13px',borderRadius:14,border:'none',cursor:'pointer',
              background:`linear-gradient(135deg,${C.saffron},${C.red})`,
              color:'white',fontSize:14,fontWeight:700,marginBottom:16,
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            Add "{query.trim()}" as custom dish
          </button>
        )}

        {/* AI smart picks */}
        {!query&&(
          <>
            <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',
              letterSpacing:'0.07em',color:C.muted,marginBottom:10,
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              ✨ Smart picks for this slot</p>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {suggestions.map((s,i)=>(
                <button key={i} onClick={()=>onAdd({name:s.name,source:'ai',isChain:s.isChain})}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'13px 14px',
                    borderRadius:16,border:'none',cursor:'pointer',textAlign:'left',
                    background:s.isChain?'#F0FAF3':C.subtle,
                    border:`1px solid ${s.isChain?'#B6DFC2':C.border}`,
                    transition:'opacity 0.15s'}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:2}}>
                      {s.isChain&&<span style={{fontSize:13}}>♻️</span>}
                      <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,
                        fontWeight:700,color:C.ink,margin:0}}>{s.name}</p>
                    </div>
                    <p style={{fontSize:11,color:s.isChain?'#4A7A5C':C.muted,margin:0,
                      fontStyle:'italic',fontFamily:"'Nunito',sans-serif"}}>{s.reason}</p>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',
                    gap:2,flexShrink:0}}>
                    <span style={{fontSize:10,color:C.muted}}>⏱ {s.time}m</span>
                    <span style={{fontSize:12,color:C.saffron,fontWeight:700}}>Add →</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── WEEKLY PLANNER SCREEN ────────────────────────────────────────────────────
const SLOT_CFG=[
  {key:'breakfast',emoji:'🌅',short:'B',color:'#F07820'},
  {key:'lunch',    emoji:'☀️',short:'L',color:'#C98A1E'},
  {key:'dinner',   emoji:'🌙',short:'D',color:'#5878F0'},
];

function WeekPlannerScreen({weekPlan,setWeekPlan,vegPref,diet}){
  const [weekOffset,setWeekOffset]=useState(0);
  const [addingTo,setAddingTo]=useState(null);
  const [movingFrom,setMovingFrom]=useState(null);
  const [showGrocery,setShowGrocery]=useState(false);

  const weekDays=useMemo(()=>getWeekDays(weekOffset),[weekOffset]);

  const weekLabel=()=>{
    const f=dayMeta(weekDays[0]), l=dayMeta(weekDays[6]);
    return `${f.date} ${f.month} – ${l.date} ${l.month}`;
  };

  const filledCount=weekDays.reduce((n,d)=>
    n+SLOT_CFG.filter(s=>weekPlan[`${d}_${s.key}`]).length,0);

  const groceryItems=useMemo(()=>{
    const all=[...DISHES.breakfast,...DISHES.lunch,...DISHES.dinner];
    const needed=new Set();
    Object.values(weekPlan).forEach(meal=>{
      const dish=all.find(d=>d.name===meal.name);
      if(dish) dish.uses.forEach(i=>needed.add(i));
    });
    return Array.from(needed);
  },[weekPlan]);

  const handleSlotTap=(dayKey,slot)=>{
    const key=`${dayKey}_${slot}`;
    if(movingFrom){
      const fromKey=`${movingFrom.dayKey}_${movingFrom.slot}`;
      if(key!==fromKey){
        setWeekPlan(wp=>{
          const n={...wp}; n[key]=movingFrom.dish; delete n[fromKey]; return n;
        });
      }
      setMovingFrom(null);
    } else if(weekPlan[key]){
      setMovingFrom({dayKey,slot,dish:weekPlan[key]});
    } else {
      setAddingTo({dayKey,slot});
    }
  };

  const handleAdd=(dayKey,slot,meal)=>{
    setWeekPlan(wp=>({...wp,[`${dayKey}_${slot}`]:meal}));
    setAddingTo(null);
  };

  const handleRemove=(dayKey,slot)=>{
    setWeekPlan(wp=>{const n={...wp};delete n[`${dayKey}_${slot}`];return n;});
    setMovingFrom(null);
  };

  return (
    <div style={{minHeight:'100vh',background:C.bg,paddingBottom:80}}>

      {/* Header */}
      <div style={{padding:'14px 20px 12px',background:'white',
        borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <button onClick={()=>{setWeekOffset(o=>o-1);setMovingFrom(null);}}
            style={{width:36,height:36,borderRadius:12,background:C.subtle,
              border:`1px solid ${C.border}`,cursor:'pointer',fontSize:18,
              display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
          <div style={{textAlign:'center'}}>
            <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,
              color:C.ink,margin:0}}>{weekLabel()}</p>
            <p style={{fontSize:11,color:C.muted,margin:0,fontFamily:"'Nunito',sans-serif"}}>
              {filledCount} / {weekDays.length*3} meals planned</p>
          </div>
          <button onClick={()=>{setWeekOffset(o=>o+1);setMovingFrom(null);}}
            style={{width:36,height:36,borderRadius:12,background:C.subtle,
              border:`1px solid ${C.border}`,cursor:'pointer',fontSize:18,
              display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setWeekPlan(fillEntireWeek(weekDays,weekPlan,vegPref,diet))}
            style={{flex:1,padding:'9px 0',borderRadius:12,border:'none',cursor:'pointer',
              background:`linear-gradient(135deg,${C.saffron},${C.red})`,
              color:'white',fontSize:13,fontWeight:700,
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            ✨ Fill my week intelligently
          </button>
          <button onClick={()=>setShowGrocery(v=>!v)}
            style={{padding:'9px 14px',borderRadius:12,cursor:'pointer',fontSize:13,fontWeight:700,
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              border:`1px solid ${showGrocery?C.dark1:C.border}`,
              background:showGrocery?C.dark1:'white',
              color:showGrocery?'white':C.muted}}>
            🛒 {groceryItems.length}
          </button>
        </div>
      </div>

      {/* Grocery panel */}
      {showGrocery&&(
        <div style={{margin:'12px 20px',borderRadius:16,background:'white',
          border:`1px solid ${C.border}`,padding:16,
          animation:'fadeSlideUp 0.2s ease both'}}>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:800,
            color:C.ink,margin:'0 0 10px'}}>🛒 This week's shopping list</p>
          {groceryItems.length===0
            ?<p style={{fontSize:13,color:C.muted,margin:0,fontStyle:'italic',
                fontFamily:"'Nunito',sans-serif"}}>Add meals first to auto-generate your list</p>
            :<div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {groceryItems.map(item=>(
                <span key={item} style={{fontSize:12,padding:'5px 12px',borderRadius:20,
                  background:C.subtle,border:`1px solid ${C.border}`,color:C.ink,
                  display:'flex',alignItems:'center',gap:4,fontFamily:"'Nunito',sans-serif"}}>
                  {ING_EMOJI[item]&&<span style={{fontSize:13}}>{ING_EMOJI[item]}</span>}
                  {item}
                </span>
              ))}
            </div>
          }
        </div>
      )}

      {/* Moving banner */}
      {movingFrom&&(
        <div style={{margin:'8px 20px',padding:'11px 14px',borderRadius:12,
          background:'#FFF0DE',border:`1.5px solid ${C.saffron}`,
          display:'flex',alignItems:'center',justifyContent:'space-between',
          animation:'fadeSlideUp 0.15s ease both'}}>
          <p style={{fontSize:12,fontWeight:700,color:C.selTxt,margin:0,
            fontFamily:"'Plus Jakarta Sans',sans-serif",flex:1,minWidth:0}}>
            Moving: {movingFrom.dish.name} — tap any empty slot
          </p>
          <div style={{display:'flex',gap:10,flexShrink:0}}>
            <button onClick={()=>handleRemove(movingFrom.dayKey,movingFrom.slot)}
              style={{fontSize:12,color:C.red,background:'none',border:'none',
                cursor:'pointer',fontWeight:700}}>Delete</button>
            <button onClick={()=>setMovingFrom(null)}
              style={{fontSize:12,color:C.muted,background:'none',border:'none',cursor:'pointer'}}>
              Cancel</button>
          </div>
        </div>
      )}

      {/* Week grid — horizontal scroll */}
      <div style={{overflowX:'auto',padding:'12px 16px 4px',
        WebkitOverflowScrolling:'touch',scrollbarWidth:'none'}}>
        <div style={{display:'flex',gap:7,minWidth:'max-content'}}>
          {weekDays.map(dayKey=>{
            const dm=dayMeta(dayKey);
            const today=isToday(dayKey);
            return (
              <div key={dayKey} style={{width:96,flexShrink:0}}>
                {/* Day header */}
                <div style={{textAlign:'center',marginBottom:7,padding:'7px 4px',borderRadius:12,
                  background:today?C.dark1:today?'':C.card,
                  border:today?'none':`1px solid ${C.border}`}}>
                  <p style={{fontSize:10,fontWeight:700,color:today?'rgba(255,255,255,0.7)':C.muted,
                    margin:0,textTransform:'uppercase',letterSpacing:'0.06em',
                    fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{dm.day}</p>
                  <p style={{fontSize:22,fontWeight:800,color:today?'white':C.ink,
                    margin:0,lineHeight:1.2,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{dm.date}</p>
                  {today&&<span style={{fontSize:9,color:C.saffron,fontWeight:700,
                    background:'rgba(240,120,32,0.15)',borderRadius:8,padding:'1px 6px',
                    fontFamily:"'Nunito',sans-serif"}}>TODAY</span>}
                </div>

                {/* Meal slots */}
                {SLOT_CFG.map(sc=>{
                  const key=`${dayKey}_${sc.key}`;
                  const meal=weekPlan[key];
                  const isMovingSrc=movingFrom?.dayKey===dayKey&&movingFrom?.slot===sc.key;
                  const isDropTarget=movingFrom&&!meal;
                  return (
                    <button key={sc.key} onClick={()=>handleSlotTap(dayKey,sc.key)}
                      style={{display:'block',width:'100%',marginBottom:5,padding:'8px 7px',
                        borderRadius:12,cursor:'pointer',textAlign:'left',
                        background:isMovingSrc?C.selBg:isDropTarget?'#FFFBF0':meal?'white':C.subtle,
                        border:isMovingSrc?`2px solid ${C.saffron}`:
                               isDropTarget?`2px dashed ${C.saffron}`:
                               meal?`1px solid ${C.border}`:`1.5px dashed ${C.border}`,
                        minHeight:64,boxShadow:isMovingSrc?'0 4px 14px rgba(240,120,32,0.22)':undefined,
                        transition:'all 0.15s'}}>
                      <div style={{display:'flex',alignItems:'center',gap:3,marginBottom:3}}>
                        <span style={{fontSize:10}}>{sc.emoji}</span>
                        <span style={{fontSize:9,fontWeight:700,color:sc.color,
                          textTransform:'uppercase',letterSpacing:'0.04em'}}>{sc.short}</span>
                        {meal?.source==='ai'&&<span style={{fontSize:8,color:C.muted,marginLeft:1}}>✨</span>}
                        {meal?.isChain&&<span style={{fontSize:9}}>♻️</span>}
                      </div>
                      {meal
                        ?<p style={{fontSize:11,fontWeight:700,color:C.ink,margin:0,
                            lineHeight:1.3,fontFamily:"'Plus Jakarta Sans',sans-serif",
                            overflow:'hidden',display:'-webkit-box',
                            WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{meal.name}</p>
                        :<p style={{fontSize:13,color:C.border,margin:0,fontWeight:800,
                            lineHeight:1,textAlign:'center'}}>+</p>
                      }
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{padding:'6px 20px 4px',display:'flex',gap:14,flexWrap:'wrap'}}>
        {[{e:'✨',l:'AI filled'},{e:'♻️',l:'Leftover reuse'},{e:'📲',l:'Tap to move/delete'}].map(x=>(
          <span key={x.l} style={{fontSize:11,color:C.muted,display:'flex',alignItems:'center',gap:3,
            fontFamily:"'Nunito',sans-serif"}}><span>{x.e}</span>{x.l}</span>
        ))}
      </div>

      {/* Add meal panel */}
      {addingTo&&(
        <>
          <div style={{position:'fixed',inset:0,background:'rgba(28,20,16,0.35)',zIndex:299}}
            onClick={()=>setAddingTo(null)}/>
          <AddMealPanel slot={addingTo.slot} dayKey={addingTo.dayKey}
            weekPlan={weekPlan} vegPref={vegPref} diet={diet}
            onAdd={meal=>handleAdd(addingTo.dayKey,addingTo.slot,meal)}
            onClose={()=>setAddingTo(null)}/>
        </>
      )}
    </div>
  );
}


function SavedScreen({favorites,plan}){
  // Collect dish details from favorites list
  const allDishes=[...DISHES.breakfast,...DISHES.lunch,...DISHES.dinner];
  const savedDishes=allDishes.filter(d=>favorites.includes(d.name))
    .filter((d,i,arr)=>arr.findIndex(x=>x.name===d.name)===i);
  const SLOT_EMO={breakfast:"🌅",lunch:"☀️",dinner:"🌙"};
  const getSlot=name=>{
    if(DISHES.breakfast.find(d=>d.name===name)) return "breakfast";
    if(DISHES.lunch.find(d=>d.name===name)) return "lunch";
    return "dinner";
  };
  return (
    <div style={{padding:"20px 20px 40px",minHeight:"60vh"}}>
      <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,
        color:C.ink,margin:"0 0 4px"}}>❤️ Saved Dishes</h2>
      <p style={{fontSize:13,color:C.muted,margin:"0 0 20px",fontFamily:"'Nunito',sans-serif",
        fontStyle:"italic"}}>Your all-time favourites, always ready to suggest</p>
      {savedDishes.length===0?(
        <div style={{marginTop:40,textAlign:"center",padding:"32px 24px",borderRadius:20,
          background:"white",border:`1.5px dashed ${C.border}`}}>
          <span style={{fontSize:52,display:"block",marginBottom:14}}>🍽️</span>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:17,fontWeight:800,
            color:C.ink,margin:"0 0 8px"}}>Nothing saved yet!</p>
          <p style={{fontSize:13,color:C.muted,margin:0,fontFamily:"'Nunito',sans-serif",
            lineHeight:1.7}}>Tap the ❤️ on any dish card<br/>to save it here for quick access</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {savedDishes.map(d=>{
            const slot=getSlot(d.name);
            const yt=`https://www.youtube.com/results?search_query=${encodeURIComponent(d.name+" recipe")}`;
            return (
              <div key={d.name} style={{background:"white",borderRadius:16,padding:"14px 16px",
                border:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22,flexShrink:0}}>{SLOT_EMO[slot]}</span>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,
                    color:C.ink,margin:0}}>{d.name}</p>
                  <p style={{fontSize:11,color:C.muted,margin:"2px 0 0",
                    fontFamily:"'Nunito',sans-serif"}}>⏱ {d.time}m · {d.protein}g protein · {d.kcal} kcal</p>
                </div>
                <a href={yt} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",alignItems:"center",flexShrink:0}}>
                  <YTIcon/>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({vegPref,diet,favorites}){
  const vegOpt=VEG_OPTIONS.find(v=>v.key===vegPref);
  const dietOpt=DIET_OPTIONS.find(d=>d.key===diet);
  const MENU=[
    {icon:"restaurant_menu",label:"My Meal Preferences",sub:"Veg, diet style, allergies"},
    {icon:"family_restroom",label:"Family Profiles",sub:"Add members & their preferences"},
    {icon:"calendar_month",label:"Meal History",sub:"What you've eaten this month"},
    {icon:"notifications",label:"Reminders",sub:"Meal planning nudges"},
    {icon:"share",label:"Share Mealio",sub:"Invite friends & family"},
    {icon:"help_outline",label:"Help & Feedback",sub:"We'd love to hear from you"},
  ];
  return (
    <div style={{paddingBottom:40}}>
      {/* Profile hero */}
      <div style={{background:`linear-gradient(135deg,${C.dark1},#3A2818)`,
        padding:"40px 24px 28px",isolation:"isolate",position:"relative"}}>
        <GlowBlob color={C.saffron} opacity={0.12} blur={50} x="60%" y="0%" size={160}/>
        <div style={{display:"flex",alignItems:"center",gap:16,position:"relative",zIndex:1}}>
          <div style={{width:64,height:64,borderRadius:32,
            background:`linear-gradient(135deg,${C.saffron},${C.red})`,
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:28,fontWeight:800,color:"white",
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>T</span>
          </div>
          <div>
            <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,
              color:"white",margin:0}}>Tinaa</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",margin:"2px 0 0",
              fontFamily:"'Nunito',sans-serif"}}>Home chef · Hyderabad</p>
          </div>
        </div>
        {/* Quick stats */}
        <div style={{display:"flex",gap:12,marginTop:20,position:"relative",zIndex:1}}>
          {[
            {n:favorites.length,l:"Favourites"},
            {n:"7",l:"Days planned"},
            {n:"21",l:"Meals cooked"},
          ].map(s=>(
            <div key={s.l} style={{flex:1,background:"rgba(255,255,255,0.1)",
              borderRadius:12,padding:"10px 8px",textAlign:"center",
              border:"0.5px solid rgba(255,255,255,0.15)"}}>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,
                fontWeight:800,color:"white",margin:0}}>{s.n}</p>
              <p style={{fontSize:10,color:"rgba(255,255,255,0.6)",margin:0,
                fontFamily:"'Nunito',sans-serif"}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current preferences */}
      <div style={{margin:"16px 20px 0",padding:"14px 16px",borderRadius:16,
        background:"white",border:`1px solid ${C.border}`}}>
        <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
          color:C.muted,margin:"0 0 10px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          Your kitchen profile</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {vegOpt&&<span style={{fontSize:12,padding:"5px 12px",borderRadius:20,
            background:C.selBg,color:C.selTxt,fontWeight:600,
            fontFamily:"'Nunito',sans-serif"}}>{vegOpt.emoji} {vegOpt.label}</span>}
          {dietOpt&&<span style={{fontSize:12,padding:"5px 12px",borderRadius:20,
            background:C.selBg,color:C.selTxt,fontWeight:600,
            fontFamily:"'Nunito',sans-serif"}}>{dietOpt.emoji} {dietOpt.label}</span>}
        </div>
      </div>

      {/* Menu items */}
      <div style={{margin:"12px 20px 0",borderRadius:16,overflow:"hidden",
        border:`1px solid ${C.border}`}}>
        {MENU.map((item,i)=>(
          <div key={item.label}
            style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
              background:"white",
              borderBottom:i<MENU.length-1?`1px solid ${C.border}`:"none",
              cursor:"pointer"}}>
            <div style={{width:36,height:36,borderRadius:12,background:C.subtle,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <MS name={item.icon} size={18} color={C.saffron}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,
                fontWeight:700,color:C.ink,margin:0}}>{item.label}</p>
              <p style={{fontSize:12,color:C.muted,margin:0,
                fontFamily:"'Nunito',sans-serif"}}>{item.sub}</p>
            </div>
            <MS name="chevron_right" size={18} color={C.border}/>
          </div>
        ))}
      </div>

      <p style={{textAlign:"center",fontSize:11,color:C.muted,marginTop:20,
        fontFamily:"'Nunito',sans-serif",fontStyle:"italic"}}>
        Mealio v2.0 · Made with ❤️ for homemakers</p>
    </div>
  );
}

function BottomNav({screen,onNavigate}){
  const items=[
    {icon:"home",           label:"Today",    key:"checkin"},
    {icon:"calendar_month", label:"Planner",  key:"planner"},
    {icon:"recycling",      label:"Leftovers",key:"leftovers"},
    {icon:"favorite",       label:"Saved",    key:"saved"},
    {icon:"person",         label:"Profile",  key:"profile"},
  ];
  const active=screen;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",
      background:"white",borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,
      paddingBottom:8}}>
      {items.map(it=>{
        const on=active===it.key;
        return (
          <button key={it.key}
            onClick={()=>onNavigate(it.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              padding:"10px 0 4px",background:"none",border:"none",cursor:"pointer"}}>
            <MS name={it.icon} size={22} fill={on?1:0} color={on?C.saffron:C.muted}/>
            <span style={{fontSize:9.5,fontWeight:on?700:500,
              color:on?C.saffron:C.muted,fontFamily:"'Nunito',sans-serif"}}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
function AppHeader({step,horizon,setHorizon,onLogoTap,accent,rightSlot}){
  const steps=[{n:1,l:"Preferences"},{n:2,l:"Pantry"},{n:3,l:"Leftovers"},{n:4,l:"Check-in"}];
  return (
    <div style={{position:"sticky",top:0,zIndex:20,background:C.bg,
      padding:"16px 20px 0",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <button onClick={onLogoTap} style={{background:"none",border:"none",padding:0,cursor:"pointer",flexShrink:0}}>
          <MealioLogo size={36}/>
        </button>
        <div style={{flex:1,minWidth:0}}>
          <p style={{fontFamily:"'Pacifico',cursive",fontSize:16,color:C.dark1,margin:0,lineHeight:1}}>Mealio</p>
          <p style={{fontSize:10,color:C.muted,margin:0}}>Art Of Meal Planning</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {rightSlot}
          <button title="Notifications" style={{width:34,height:34,borderRadius:11,
            background:C.subtle,border:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
            <MS name="notifications" size={17} color={C.muted}/>
            <span style={{position:"absolute",top:6,right:7,width:7,height:7,borderRadius:"50%",
              background:C.red,border:"1.5px solid white"}}/>
          </button>
          <button title="Profile" style={{width:34,height:34,borderRadius:17,
            background:`linear-gradient(135deg,${C.saffron},${C.red})`,
            border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:13,fontWeight:800,color:"white",
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>T</span>
          </button>
        </div>
      </div>
      {step&&step<=4&&(
        <div style={{display:"flex",alignItems:"center",gap:0,height:3,marginBottom:12}}>
          {steps.map((s,i)=>{
            const done=step>s.n, active=step===s.n;
            return <div key={s.n} style={{flex:1,height:"100%",
              background:done||active?accent:C.border,
              borderRadius:i===0?"2px 0 0 2px":i===steps.length-1?"0 2px 2px 0":"0",
              transition:"background 0.3s"}}/>;
          })}
        </div>
      )}
      {step&&step<=4&&(
        <div style={{display:"flex",gap:8,marginBottom:12,overflow:"hidden"}}>
          {[{k:"hour",l:"Next hour",s:"1 meal"},{k:"day",l:"Next day",s:"3 meals"}].map(o=>(
            <button key={o.k} onClick={()=>setHorizon(o.k)}
              style={{flex:1,padding:"8px 4px",borderRadius:12,border:"none",cursor:"pointer",
                background:horizon===o.k?C.dark1:"#F0E8DC",
                color:horizon===o.k?"white":C.muted,transition:"background 0.2s"}}>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,margin:0}}>{o.l}</p>
              <p style={{fontSize:10,margin:0,opacity:0.7}}>{o.s}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PREFS SCREEN ────────────────────────────────────────────────────────────
function PrefsScreen({vegPref,setVegPref,diet,setDiet,onNext}){
  return (
    <div style={{padding:"20px 20px 40px"}}>
      <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:24,fontWeight:800,
        color:C.ink,margin:"0 0 4px"}}>Let's set you up.</h1>
      <p style={{fontSize:13,color:C.muted,margin:"0 0 24px",fontFamily:"'Nunito',sans-serif"}}>
        We only show what fits your choices — always.</p>
      <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,
        color:C.ink,margin:"0 0 4px"}}>Choose your orientation</p>
      <p style={{fontSize:12,color:C.saffron,margin:"0 0 12px",fontFamily:"'Nunito',sans-serif",
        fontStyle:"italic"}}>We respect your boundaries ✨</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
        {VEG_OPTIONS.map(v=><OptionRow key={v.key} emoji={v.emoji} label={v.label} sub={v.sub}
          selected={vegPref===v.key} onSelect={()=>setVegPref(v.key)}/>)}
      </div>
      <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,
        color:C.ink,margin:"0 0 12px"}}>What's your eating style? 🍴</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:32}}>
        {DIET_OPTIONS.map(d=><OptionRow key={d.key} emoji={d.emoji} label={d.label} sub={d.sub}
          selected={diet===d.key} onSelect={()=>setDiet(d.key)}/>)}
      </div>
      <PrimaryBtn label="Next: set up your kitchen" disabled={!vegPref} onClick={()=>vegPref&&onNext()}/>
      {!vegPref&&<p style={{textAlign:"center",fontSize:12,color:C.muted,marginTop:8,
        fontFamily:"'Nunito',sans-serif"}}>Please choose your orientation to continue</p>}
    </div>
  );
}

// ─── PANTRY SCREEN ───────────────────────────────────────────────────────────
function PantryScreen({vegPref,diet,staples,setStaples,pantry,setPantry,expiring,setExpiring,onNext}){
  const [sIn,setSIn]=useState(""), [pIn,setPIn]=useState("");
  const allStaples=useMemo(()=>STAPLE_OPTIONS.filter(i=>ingOk(i,vegPref,diet)),[vegPref,diet]);
  const chips=useMemo(()=>{
    const base=PANTRY_CHIPS.filter(i=>ingOk(i,vegPref,diet));
    const ex=pantry.filter(p=>!base.includes(p)&&!staples.includes(p)&&ingOk(p,vegPref,diet));
    return [...base,...ex];
  },[pantry,staples,vegPref,diet]);
  const addStaple=()=>{const v=sIn.trim().toLowerCase();if(!v)return;if(!staples.includes(v))setStaples(s=>[...s,v]);setSIn("");};
  const addToday =()=>{const v=pIn.trim().toLowerCase();if(!v)return;if(!pantry.includes(v))setPantry(p=>[...p,v]);setPIn("");};
  const toggleChip=item=>{
    if(pantry.includes(item)){setPantry(p=>p.filter(i=>i!==item));setExpiring(e=>e.filter(i=>i!==item));}
    else setPantry(p=>[...p,item]);
  };
  const inp=(val,setV,onEnter,ph)=>(
    <div style={{display:"flex",alignItems:"center",gap:8,borderRadius:14,
      border:`1px solid ${C.border}`,background:C.card,padding:"10px 12px",marginBottom:12}}>
      <Mic size={16} color={C.saffron}/>
      <input value={val} onChange={e=>setV(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&onEnter()}
        placeholder={ph} style={{flex:1,minWidth:0,border:"none",outline:"none",
          fontSize:14,color:C.ink,background:"transparent",fontFamily:"'Nunito',sans-serif"}}/>
      <button onClick={onEnter} style={{background:C.subtle,border:"none",borderRadius:8,
        padding:"4px 8px",cursor:"pointer"}}><Plus size={14} color={C.saffron}/></button>
    </div>
  );
  return (
    <div style={{padding:"20px 20px 40px"}}>
      <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:22,fontWeight:800,
        color:C.ink,margin:"0 0 4px"}}>What's always in your kitchen?</h2>
      <p style={{fontSize:13,color:C.muted,margin:"0 0 16px",fontFamily:"'Nunito',sans-serif",
        fontStyle:"italic"}}>These unlock no-cook add-ons — raita, chaas, a shake!</p>
      {inp(sIn,setSIn,addStaple,'Add a staple, e.g. "almonds"')}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
        {allStaples.map(item=>{
          const sel=staples.includes(item);
          return (
            <button key={item} onClick={()=>setStaples(s=>s.includes(item)?s.filter(i=>i!==item):[...s,item])}
              style={{display:"flex",alignItems:"center",gap:6,borderRadius:20,padding:"8px 14px",
                fontSize:13,fontWeight:500,cursor:"pointer",
                border:`1.5px solid ${sel?C.saffron:C.border}`,
                background:sel?C.selBg:C.card,color:sel?C.selTxt:C.ink}}>
              {ING_EMOJI[item]&&<span style={{fontSize:16,lineHeight:1}}>{ING_EMOJI[item]}</span>}
              {sel&&<Check size={12} color={C.saffron}/>}{item}
            </button>
          );
        })}
      </div>
      <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,
        color:C.ink,margin:"0 0 4px"}}>Anything specific today?</h2>
      <p style={{fontSize:13,color:C.muted,margin:"0 0 12px",fontFamily:"'Nunito',sans-serif",
        fontStyle:"italic"}}>Tap to add · tap again to remove · mark expiring</p>
      {inp(pIn,setPIn,addToday,'e.g. "paneer" or "half a kilo of carrots"')}
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:32}}>
        {chips.map(item=>{
          const sel=pantry.includes(item),exp=expiring.includes(item);
          return (
            <button key={item} onClick={()=>toggleChip(item)}
              style={{display:"flex",alignItems:"center",gap:6,borderRadius:20,padding:"8px 14px",
                fontSize:13,fontWeight:500,cursor:"pointer",
                border:`1.5px solid ${exp?"#C98A1E":sel?C.saffron:C.border}`,
                background:exp?"#FEF5E4":sel?C.selBg:C.card,
                color:exp?"#8A6010":sel?C.selTxt:C.ink}}>
              {ING_EMOJI[item]&&<span style={{fontSize:16,lineHeight:1}}>{ING_EMOJI[item]}</span>}
              {item}
              {sel&&!exp&&(
                <span onClick={e=>{e.stopPropagation();setExpiring(ex=>[...ex,item]);}}
                  style={{fontSize:11,textDecoration:"underline",color:C.muted,marginLeft:2}}>
                  expiring?</span>
              )}
              {exp&&<span style={{fontSize:11}}>⏳</span>}
            </button>
          );
        })}
      </div>
      <PrimaryBtn label="Next: leftovers" onClick={onNext}/>
    </div>
  );
}

// ─── LEFTOVERS SCREEN ────────────────────────────────────────────────────────
function LeftoversScreen({leftovers,setLeftovers,onNext,isFlow=false}){
  const [showPicker,setShowPicker]=useState(false);
  const [customInp,setCustomInp]=useState("");
  const QTY={1:"A little",2:"Some",3:"A lot"};
  const toggle=chip=>{
    if(leftovers.find(l=>l.key===chip.key))
      setLeftovers(ls=>ls.filter(l=>l.key!==chip.key));
    else setLeftovers(ls=>[...ls,{...chip,qty:1}]);
  };
  const adj=(key,d)=>setLeftovers(ls=>
    ls.map(l=>l.key===key?{...l,qty:Math.max(0,Math.min(3,l.qty+d))}:l).filter(l=>l.qty>0));
  const remove=key=>setLeftovers(ls=>ls.filter(l=>l.key!==key));
  const addCustom=()=>{
    const v=customInp.trim().toLowerCase();
    if(!v)return;
    if(!leftovers.find(l=>l.key===v))
      setLeftovers(ls=>[...ls,{key:v,label:v,emoji:"🍱",qty:1}]);
    setCustomInp("");setShowPicker(false);
  };
  return (
    <div style={{padding:"20px 20px 40px"}}>
      {/* Header row with Add button */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:28}}>♻️</span>
          <div>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,
              color:C.ink,margin:0,lineHeight:1.2}}>Leftovers</h2>
            <p style={{fontSize:12,color:C.muted,margin:0,fontFamily:"'Nunito',sans-serif",
              fontStyle:"italic"}}>Used first in your daily plan</p>
          </div>
        </div>
        <button onClick={()=>setShowPicker(v=>!v)}
          style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:14,
            border:`1.5px solid ${showPicker?C.saffron:C.border}`,
            background:showPicker?C.selBg:"white",color:showPicker?C.selTxt:C.ink,
            fontSize:13,fontWeight:700,cursor:"pointer",
            fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          <Plus size={15}/> Add
        </button>
      </div>

      {/* Quick-add picker */}
      {showPicker&&(
        <div style={{marginTop:12,padding:14,borderRadius:16,background:"white",
          border:`1px solid ${C.border}`,animation:"fadeSlideUp 0.2s ease both"}}>
          <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
            color:C.muted,margin:"0 0 10px",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Quick add</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
            {LEFTOVER_CHIPS.filter(c=>!leftovers.find(l=>l.key===c.key)).map(chip=>(
              <button key={chip.key} onClick={()=>toggle(chip)}
                style={{display:"flex",alignItems:"center",gap:5,borderRadius:20,
                  padding:"7px 13px",fontSize:13,fontWeight:600,cursor:"pointer",
                  border:`1.5px solid ${C.border}`,background:C.subtle,color:C.ink}}>
                <span style={{fontSize:16}}>{chip.emoji}</span>{chip.label}
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <input value={customInp} onChange={e=>setCustomInp(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addCustom()}
              placeholder='Something else? e.g. "biryani"'
              style={{flex:1,border:`1px solid ${C.border}`,borderRadius:12,
                padding:"10px 12px",fontSize:13,color:C.ink,
                fontFamily:"'Nunito',sans-serif",outline:"none"}}/>
            <button onClick={addCustom}
              style={{padding:"10px 16px",borderRadius:12,border:"none",
                background:C.saffron,color:"white",fontSize:13,fontWeight:700,
                cursor:"pointer"}}>Add</button>
          </div>
        </div>
      )}

      {/* Leftovers list */}
      {leftovers.length===0?(
        <div style={{marginTop:24,padding:28,borderRadius:16,background:"white",
          border:`1.5px dashed ${C.border}`,textAlign:"center"}}>
          <span style={{fontSize:40,display:"block",marginBottom:8}}>🍱</span>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:700,
            color:C.ink,margin:"0 0 4px"}}>Nothing here yet</p>
          <p style={{fontSize:13,color:C.muted,margin:0,fontFamily:"'Nunito',sans-serif",
            fontStyle:"italic"}}>Tap "+ Add" to log what's in the fridge</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
          {leftovers.map(l=>(
            <div key={l.key} style={{display:"flex",alignItems:"center",gap:12,
              padding:"12px 14px",borderRadius:14,background:"white",
              border:`1px solid ${C.border}`}}>
              <span style={{fontSize:22,flexShrink:0}}>{l.emoji}</span>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:14,fontWeight:700,color:C.ink,margin:0,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  textTransform:"capitalize"}}>{l.label}</p>
                <p style={{fontSize:11,color:C.muted,margin:0,
                  fontFamily:"'Nunito',sans-serif"}}>{QTY[l.qty]}</p>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <button onClick={()=>adj(l.key,-1)}
                  style={{width:28,height:28,borderRadius:"50%",
                    border:`1px solid ${C.border}`,background:"white",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Minus size={13} color={C.muted}/>
                </button>
                <span style={{fontSize:14,fontWeight:700,color:C.ink,
                  minWidth:16,textAlign:"center"}}>{l.qty}</span>
                <button onClick={()=>adj(l.key,1)}
                  style={{width:28,height:28,borderRadius:"50%",
                    border:`1px solid ${C.saffron}`,background:C.selBg,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Plus size={13} color={C.saffron}/>
                </button>
              </div>
              <button onClick={()=>remove(l.key)}
                style={{width:28,height:28,borderRadius:"50%",background:"#FFF0F0",
                  border:"1px solid #FFD0D0",cursor:"pointer",flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={13} color={C.red}/>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subtle continue — only inside meal brain flow */}
      {isFlow&&(
        <button onClick={onNext}
          style={{marginTop:28,display:"flex",alignItems:"center",justifyContent:"center",
            gap:6,width:"100%",padding:"12px",borderRadius:14,
            border:`1px solid ${C.border}`,background:"white",
            color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",
            fontFamily:"'Nunito',sans-serif"}}>
          Continue to check-in <ArrowRight size={14}/>
        </button>
      )}
    </div>
  );
}

// ─── CHECKIN SCREEN ──────────────────────────────────────────────────────────
function CheckinScreen({horizon,energy,setEnergy,time,setTime,mood,setMood,onSubmit}){
  const acc=eColor(energy);
  return (
    <div style={{padding:"20px 20px 40px"}}>
      <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:24,fontWeight:800,
        color:C.ink,margin:"0 0 4px"}}>Quick check-in.</h1>
      <p style={{fontSize:13,color:C.muted,margin:"0 0 24px",fontFamily:"'Nunito',sans-serif",fontStyle:"italic"}}>
        This changes everything{horizon==="hour"?" right now":""} — even defaults help!</p>
      <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
        color:C.muted,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Energy level</p>
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {ENERGY_OPTIONS.map(o=>(
          <button key={o.key} onClick={()=>setEnergy(o.key)} style={{
            flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8,
            padding:"16px 8px",borderRadius:16,cursor:"pointer",
            border:`1.5px solid ${energy===o.key?o.color:C.border}`,
            background:energy===o.key?`${o.color}18`:C.card,
            color:energy===o.key?o.color:C.muted,transition:"all 0.2s"}}>
            <MS name={o.icon} size={24} color={energy===o.key?o.color:C.muted}/>
            <span style={{fontSize:12,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{o.label}</span>
          </button>
        ))}
      </div>
      <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
        color:C.muted,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        Mood <span style={{fontWeight:400,textTransform:"none"}}>(optional)</span></p>
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {MOOD_OPTIONS.map(m=>(
          <button key={m.key} onClick={()=>setMood(k=>k===m.key?null:m.key)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,
              padding:"14px 8px",borderRadius:16,cursor:"pointer",
              border:`1.5px solid ${mood===m.key?C.saffron:C.border}`,
              background:mood===m.key?C.selBg:C.card,transition:"all 0.2s"}}>
            <span style={{fontSize:24,lineHeight:1}}>{m.emoji}</span>
            <span style={{fontSize:12,fontWeight:700,color:mood===m.key?C.selTxt:C.muted,
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{m.label}</span>
          </button>
        ))}
      </div>
      <p style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",
        color:C.muted,marginBottom:8,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        Time to cook{horizon==="hour"?" in the next hour":""}</p>
      <div style={{display:"flex",gap:8,marginBottom:32}}>
        {TIME_OPTIONS.map(o=>(
          <button key={o.key} onClick={()=>setTime(o.key)}
            style={{flex:1,padding:"14px 8px",borderRadius:14,cursor:"pointer",
              fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",
              border:`1.5px solid ${time===o.key?C.saffron:C.border}`,
              background:time===o.key?C.selBg:C.card,
              color:time===o.key?C.selTxt:C.muted,transition:"all 0.2s"}}>
            {o.label}
          </button>
        ))}
      </div>
      <button onClick={onSubmit} style={{
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
        width:"100%",padding:"15px 20px",borderRadius:16,border:"none",cursor:"pointer",
        background:`linear-gradient(135deg,${C.saffron},${C.red})`,
        color:"white",fontSize:14,fontWeight:800,
        fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
        {horizon==="hour"?<Utensils size={16}/>:<ClipboardList size={16}/>}
        {horizon==="hour"?"Recommend a dish":"Plan a menu"}
        <ArrowRight size={16}/>
      </button>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────────────────
function NutritionCard({dish,addOns}){
  const t=addOns.reduce((a,x)=>({kcal:a.kcal+x.kcal,protein:a.protein+x.protein,carb:a.carb+x.carb,fat:a.fat+x.fat}),
    {kcal:dish.kcal,protein:dish.protein,carb:dish.carb,fat:dish.fat});
  return (
    <div style={{borderRadius:14,padding:12,marginTop:12,
      background:C.subtle,border:`1px solid ${C.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.muted}}>Nutrition</span>
        <span style={{fontSize:14,fontWeight:800,color:C.ink,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{t.kcal} kcal</span>
      </div>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:8}}>
        {[["💪",`${t.protein}g`,"Protein"],["🍚",`${t.carb}g`,"Carbs"],["🫒",`${t.fat}g`,"Fat"]].map(([ic,val,lbl])=>(
          <span key={lbl} style={{fontSize:12,color:C.ink,display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:14}}>{ic}</span>{val}<span style={{color:C.muted}}>{lbl}</span>
          </span>
        ))}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {dish.micros.map(m=>(
          <span key={m} style={{fontSize:10,padding:"2px 8px",borderRadius:10,
            background:"white",border:`1px solid ${C.border}`,color:C.muted}}>{m}</span>
        ))}
      </div>
      {addOns.length>0&&(
        <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
          {addOns.map(a=>(
            <p key={a.name} style={{fontSize:11,color:C.muted,margin:"2px 0",
              display:"flex",alignItems:"center",gap:4}}>
              <Plus size={10}/>{a.name} — already on hand · +{a.kcal} kcal, +{a.protein}g protein
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
function MissingGroceries({items}){
  const [open,setOpen]=useState(false);
  if(!items.length) return (
    <p style={{fontSize:12,color:"#4A7040",display:"flex",alignItems:"center",gap:6,marginTop:10,
      fontWeight:600,fontFamily:"'Nunito',sans-serif"}}>
      <Check size={13}/>You have everything for this!</p>
  );
  return (
    <div style={{marginTop:12}}>
      {/* Missing ingredient tags — clean, no buttons */}
      <div style={{display:"flex",alignItems:"flex-start",gap:6,flexWrap:"wrap",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:4,marginRight:2,paddingTop:3}}>
          <ShoppingBag size={12} color="#8A7020"/>
          <span style={{fontSize:11,fontWeight:700,color:"#8A7020",textTransform:"uppercase",
            letterSpacing:"0.06em",whiteSpace:"nowrap"}}>Need to buy:</span>
        </div>
        {items.map(item=>(
          <span key={item} style={{display:"inline-flex",alignItems:"center",gap:4,
            fontSize:12,padding:"4px 10px",borderRadius:20,fontWeight:600,
            background:"#FBF5EA",border:"1px solid #EDD9A0",color:"#5A4010"}}>
            {ING_EMOJI[item]&&<span style={{fontSize:14,lineHeight:1}}>{ING_EMOJI[item]}</span>}
            {item}
          </span>
        ))}
      </div>

      {/* Single "Order Online" CTA — no repetition */}
      <button onClick={()=>setOpen(o=>!o)} style={{
        display:"flex",alignItems:"center",justifyContent:"space-between",
        width:"100%",padding:"11px 14px",borderRadius:14,cursor:"pointer",
        border:"1.5px dashed #C98A1E",background:"#FFFBEF",
        transition:"background 0.2s"}}>
        <span style={{display:"flex",alignItems:"center",gap:8,fontSize:13,
          fontWeight:700,color:"#8A6010",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
          🛒 Order {items.length} item{items.length>1?"s":""} online
        </span>
        <span style={{fontSize:12,color:"#C98A1E",transition:"transform 0.2s",
          display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
      </button>

      {/* Expandable delivery app list — clean rows, brand accent on left */}
      {open&&(
        <div style={{marginTop:6,borderRadius:14,overflow:"hidden",
          border:"1px solid #EDD9A0",background:"white",
          animation:"fadeSlideUp 0.2s ease both"}}>
          <div style={{padding:"10px 14px 6px",fontSize:11,color:"#8A7020",
            fontFamily:"'Nunito',sans-serif",borderBottom:"1px solid #F5EDDC"}}>
            Choose where to order — tap to open app
          </div>
          {DELIVERY_APPS.map((app,i)=>(
            <a key={app.key}
              href={app.url(items.join(" "))} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",
                textDecoration:"none",
                borderBottom:i<DELIVERY_APPS.length-1?"1px solid #F5EDDC":"none",
                borderLeft:`4px solid ${app.color}`,background:"white",
                transition:"background 0.15s"}}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:app.color,flexShrink:0}}/>
              <span style={{flex:1,fontSize:14,fontWeight:700,
                color:C.ink,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{app.label}</span>
              <span style={{fontSize:12,color:C.muted,fontFamily:"'Nunito',sans-serif"}}>
                Search {items.length} item{items.length>1?"s":""}</span>
              <span style={{fontSize:16,color:app.color,fontWeight:700}}>→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
function LeftoverTransforms({leftovers}){
  const txs=leftovers.flatMap(l=>LEFTOVER_TRANSFORMS[l.key]||[]);
  if(!txs.length)return null;
  const SLOT_ICON={breakfast:"🌅",lunch:"☀️",dinner:"🌙"};
  return (
    <div style={{borderRadius:16,overflow:"hidden",marginBottom:12}}>
      <div style={{height:3,background:"linear-gradient(90deg,#4A9B6A,#8ECC2E)"}}/>
      <div style={{padding:16,background:"#F0FAF3",border:"1px solid #B6DFC2",borderTop:"none"}}>
        <p style={{fontSize:13,fontWeight:700,color:"#2A6B45",margin:"0 0 12px",
          display:"flex",alignItems:"center",gap:6}}>♻️ Transform your leftovers first</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {txs.map((tr,i)=>{
            const yt=`https://www.youtube.com/results?search_query=${encodeURIComponent(tr.name+" leftover recipe")}`;
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                {/* Fixed-width circular slot icon — no text, no alignment issues */}
                <div style={{width:30,height:30,borderRadius:"50%",background:"#C8E8D4",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  flexShrink:0,fontSize:15,lineHeight:1}}>
                  {SLOT_ICON[tr.slot]||"🍽️"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:"#1E4D32",margin:0,
                    fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{tr.name}</p>
                  <p style={{fontSize:11,color:"#4A7A5C",margin:"2px 0 0",
                    fontStyle:"italic",fontFamily:"'Nunito',sans-serif"}}>{tr.note}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <span style={{fontSize:11,color:"#4A7A5C",fontFamily:"'Nunito',sans-serif"}}>
                    {tr.time}m</span>
                  <a href={yt} target="_blank" rel="noopener noreferrer"
                    title="Watch leftover recipe on YouTube"
                    style={{display:"flex",alignItems:"center"}}>
                    <YTIcon/>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function YTIcon(){
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-label="Watch on YouTube">
      <rect width="20" height="14" rx="3.5" fill="#FF0000"/>
      <path d="M8 3.5l6 3.5-6 3.5V3.5z" fill="white"/>
    </svg>
  );
}
function MealCarousel({slot,ranked,index,onIndex,accent,addOns,available,favorites,onFav}){
  const EMO={Breakfast:"🌅",Lunch:"☀️",Dinner:"🌙"};
  const dish=ranked[index%ranked.length];
  const missing=dish.uses.filter(u=>!available.includes(u));
  const isFav=favorites.includes(dish.name);
  const yt=`https://www.youtube.com/results?search_query=${encodeURIComponent(dish.name+" recipe")}`;
  return (
    <div style={{borderRadius:20,overflow:"hidden",background:C.card,border:`1px solid ${C.border}`,marginBottom:12}}>
      <div style={{height:3,background:accent}}/>
      <div style={{padding:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <span style={{display:"flex",alignItems:"center",gap:6,fontSize:11,fontWeight:700,
            textTransform:"uppercase",letterSpacing:"0.06em",color:C.muted}}>
            <span style={{fontSize:16}}>{EMO[slot]}</span>{slot}</span>
          <button onClick={(e)=>{e.stopPropagation();onFav(dish.name);}} style={{background:"none",border:"none",
            cursor:"pointer",padding:4}}>
            <Heart size={18} fill={isFav?"#E02858":"none"} color={isFav?"#E02858":C.muted}/>
          </button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <button onClick={()=>onIndex((index-1+ranked.length)%ranked.length)}
            style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${C.border}`,
              background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <ChevronLeft size={16} color={C.muted}/>
          </button>
          <div style={{flex:1,minWidth:0,textAlign:"center"}}>
            <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,fontWeight:800,
              color:C.ink,margin:0,lineHeight:1.2}}>{dish.name}</h3>
            <p style={{fontSize:11,color:C.muted,margin:"2px 0 0"}}>
              Option {(index%ranked.length)+1} of {ranked.length} · swipe cards</p>
          </div>
          <button onClick={()=>onIndex((index+1)%ranked.length)}
            style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${C.border}`,
              background:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <ChevronRight size={16} color={C.muted}/>
          </button>
        </div>
        <p style={{fontSize:13,color:C.muted,textAlign:"center",margin:"0 0 8px",fontStyle:"italic"}}>{dish.note}</p>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:10}}>
          {ranked.map((_,i)=>(
            <span key={i} style={{height:4,borderRadius:2,transition:"all 0.3s",
              width:i===index%ranked.length?16:5,
              background:i===index%ranked.length?accent:C.border}}/>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,
          fontSize:12,color:C.muted}}>
          <span style={{display:"flex",alignItems:"center",gap:4}}>
            <Clock size={12}/>{dish.time} min</span>
          <span>Energy {dish.energy}/3</span>
          <a href={yt} target="_blank" rel="noopener noreferrer"
            title="Watch recipe on YouTube"
            style={{display:"flex",alignItems:"center",gap:4,textDecoration:"none"}}>
            <YTIcon/></a>
        </div>
        <NutritionCard dish={dish} addOns={addOns}/>
        <MissingGroceries items={missing}/>
      </div>
    </div>
  );
}

function LockedPill({emoji,icon,text,color}){
  return (
    <span style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,
      fontSize:12,fontWeight:600,background:C.subtle,border:`1px solid ${C.border}`,
      color:color||C.ink,flexShrink:0}}>
      {emoji&&<span style={{fontSize:14,lineHeight:1}}>{emoji}</span>}
      {icon&&<MS name={icon} size={13} color={color||C.muted}/>}
      {text}
    </span>
  );
}

function LeftoverTooltipPill({leftovers}){
  const [show,setShow]=useState(false);
  return (
    <div style={{position:"relative",display:"inline-flex"}}
      onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}
      onTouchStart={()=>setShow(v=>!v)}>
      <LockedPill emoji="♻️" text={`${leftovers.length} leftover${leftovers.length>1?"s":""}`}/>
      {show&&(
        <div style={{position:"absolute",bottom:"110%",left:"50%",transform:"translateX(-50%)",
          background:C.dark1,borderRadius:12,padding:"10px 14px",zIndex:200,
          boxShadow:"0 6px 24px rgba(0,0,0,0.35)",minWidth:130,
          animation:"fadeSlideUp 0.15s ease both"}}>
          {leftovers.map(l=>(
            <div key={l.key} style={{display:"flex",alignItems:"center",gap:6,
              fontSize:13,color:"white",padding:"3px 0",fontFamily:"'Nunito',sans-serif",
              fontWeight:600}}>
              <span>{l.emoji}</span>{l.label}
              <span style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginLeft:2}}>
                {["","A little","Some","A lot"][l.qty]}</span>
            </div>
          ))}
          <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
            width:0,height:0,borderLeft:"7px solid transparent",
            borderRight:"7px solid transparent",borderTop:`7px solid ${C.dark1}`}}/>
        </div>
      )}
    </div>
  );
}
function ResultsScreen({horizon,slot,slots,plan,vegPref,diet,energy,time,mood,leftovers,
  available,effectiveStaples,carouselIndex,setCarouselIndex,favorites,onFav,onNewDay}){
  const acc=eColor(energy);
  const SL={breakfast:"Breakfast",lunch:"Lunch",dinner:"Dinner"};
  const vO=VEG_OPTIONS.find(v=>v.key===vegPref);
  const dO=DIET_OPTIONS.find(d=>d.key===diet);
  const eO=ENERGY_OPTIONS.find(e=>e.key===energy);
  const mO=MOOD_OPTIONS.find(m=>m.key===mood);
  const accomp=s=>ACCOMPANIMENTS[s].filter(a=>effectiveStaples.includes(a.staple));
  return (
    <div style={{paddingBottom:40}}>
      <div style={{margin:"12px 20px",borderRadius:16,padding:"14px 16px",
        background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${acc}`}}>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,
          fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.muted,marginBottom:6}}>
          <MS name="lock" size={11} color={C.muted}/> Set earlier — tap logo above to change
        </div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,
          color:C.ink,margin:"0 0 10px"}}>
          {horizon==="hour"?`Right now: ${SL[slot]} 🍽️`:"Today, sorted ✨"}
        </h2>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {vO&&<LockedPill emoji={vO.emoji} text={vO.label}/>}
          {dO&&<LockedPill emoji={dO.emoji} text={dO.label}/>}
          <LockedPill icon={eO.icon} text={eO.label} color={eO.color}/>
          {mO&&<LockedPill emoji={mO.emoji} text={mO.label}/>}
          <LockedPill icon="schedule" text={`${time} min`}/>
          {leftovers.length>0&&<LeftoverTooltipPill leftovers={leftovers}/>}
        </div>
      </div>
      <div style={{padding:"0 20px"}}>
        <LeftoverTransforms leftovers={leftovers}/>
        {slots.map(s=>(
          <MealCarousel key={s} slot={SL[s]} ranked={plan[s]}
            index={carouselIndex[s]} onIndex={i=>setCarouselIndex(c=>({...c,[s]:i}))}
            accent={acc} addOns={accomp(s)} available={available}
            favorites={favorites} onFav={onFav}/>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function Mealio(){
  const [screen,setScreen]=useState("splash");
  const [phone,setPhone]=useState("");
  // Setup (persists)
  const [vegPref,setVegPref]=useState("veg");
  const [diet,setDiet]=useState("balanced");
  const [staples,setStaples]=useState(["curd","milk","rice","ghee"]);
  const [favorites,setFavorites]=useState([]);
  const [horizon,setHorizon]=useState("day");
  const [weekPlan,setWeekPlan]=useState({});
  const [prevScreen,setPrevScreen]=useState(null);
  // Daily
  const [pantry,setPantry]=useState([]);
  const [expiring,setExpiring]=useState([]);
  const [leftovers,setLeftovers]=useState([]);
  const [energy,setEnergy]=useState(2);
  const [time,setTime]=useState(30);
  const [mood,setMood]=useState(null);
  const [carouselIndex,setCarouselIndex]=useState({breakfast:0,lunch:0,dinner:0});

  // Prune incompatible ingredients when prefs change
  useEffect(()=>{
    setStaples(s=>s.filter(i=>ingOk(i,vegPref,diet)));
    setPantry(p=>p.filter(i=>ingOk(i,vegPref,diet)));
    setExpiring(e=>e.filter(i=>ingOk(i,vegPref,diet)));
  },[vegPref,diet]);

  const effectiveStaples=useMemo(()=>staples.filter(s=>ingOk(s,vegPref,diet)),[staples,vegPref,diet]);
  const available=useMemo(()=>[...new Set([...effectiveStaples,...pantry])],[effectiveStaples,pantry]);
  const lkeys=useMemo(()=>leftovers.map(l=>l.key),[leftovers]);
  const slot=horizon==="hour"?currentSlot():null;
  const slots=horizon==="hour"?[slot]:["breakfast","lunch","dinner"];

  const plan=useMemo(()=>{
    if(screen!=="results")return null;
    const r={};
    slots.forEach(s=>{r[s]=rankDishes(s,available,expiring,time,energy,diet,vegPref,favorites,lkeys);});
    return r;
  },[screen,available,expiring,time,energy,diet,vegPref,favorites,lkeys,horizon]);

  const go=s=>{setPrevScreen(screen);setScreen(s);};
  const newDay=()=>{setLeftovers([]);setMood(null);setCarouselIndex({breakfast:0,lunch:0,dinner:0});go("leftovers");};
  const fullReset=()=>{setPantry([]);setExpiring([]);setLeftovers([]);setMood(null);setCarouselIndex({breakfast:0,lunch:0,dinner:0});go("prefs");};

  const APP_SCREENS=["prefs","pantry","leftovers","checkin","loading","results","planner","saved","profile"];
  const STEP_MAP={prefs:1,pantry:2,leftovers:3,checkin:4,loading:4,results:5,planner:null,saved:null,profile:null};
  const acc=eColor(energy);
  const isApp=APP_SCREENS.includes(screen);

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Nunito',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Plus+Jakarta+Sans:wght@500;700;800&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..200&display=swap');
        *{box-sizing:border-box;} body{margin:0;background:#FFF8F0;}
        .material-symbols-outlined{font-family:'Material Symbols Outlined';}
        input::placeholder{color:#8A6A5A;opacity:0.65;}
        button:active{opacity:0.8;transform:scale(0.97);}
        @keyframes logoReveal{0%{opacity:0;transform:scale(0.55) translateY(24px);}65%{transform:scale(1.07) translateY(-5px);opacity:1;}85%{transform:scale(0.97) translateY(2px);}100%{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes fadeSlideUp{0%{opacity:0;transform:translateY(18px);}100%{opacity:1;transform:translateY(0);}}
        @keyframes taglineIn{0%{opacity:0;letter-spacing:0.22em;}100%{opacity:0.72;letter-spacing:0.07em;}}
        @keyframes glowPulse{0%,100%{opacity:0.16;transform:scale(1);}50%{opacity:0.26;transform:scale(1.12);}}
        @keyframes shimmerBar{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
      <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",position:"relative",overflow:"hidden"}}>
        {screen==="splash"     && <SplashScreen     onDone={()=>go("onboarding")}/>}
        {screen==="onboarding" && <OnboardingScreen onDone={()=>go("login")}/>}
        {screen==="login"      && <LoginScreen      onLogin={p=>{setPhone(p);go("otp");}}/>}
        {screen==="otp"        && <OTPScreen        phone={phone} onBack={()=>go("login")}
                                    onVerify={()=>go("prefs")}/>}
        {isApp&&(
          <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
            <AppHeader
              step={STEP_MAP[screen]}
              horizon={horizon}
              setHorizon={v=>{setHorizon(v);setCarouselIndex({breakfast:0,lunch:0,dinner:0});}}
              onLogoTap={fullReset}
              accent={acc}
              rightSlot={screen==="results"?(
                <button onClick={newDay} style={{display:"flex",alignItems:"center",gap:6,
                  padding:"7px 12px",borderRadius:12,border:`1px solid ${C.border}`,
                  background:C.subtle,color:C.saffron,fontSize:12,fontWeight:700,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer"}}>
                  <RefreshCw size={12}/>New day
                </button>
              ):null}
            />
            <div style={{flex:1,overflowY:"auto",paddingBottom:72}}>
              {screen==="planner"  && <WeekPlannerScreen weekPlan={weekPlan} setWeekPlan={setWeekPlan} vegPref={vegPref} diet={diet}/>}
              {screen==="saved"    && <SavedScreen favorites={favorites} plan={plan}/>}
              {screen==="profile"  && <ProfileScreen vegPref={vegPref} diet={diet} favorites={favorites}/>}
              {screen==="prefs"    && <PrefsScreen vegPref={vegPref} setVegPref={setVegPref}
                                        diet={diet} setDiet={setDiet} onNext={()=>go("pantry")}/>}
              {screen==="pantry"   && <PantryScreen vegPref={vegPref} diet={diet}
                                        staples={staples} setStaples={setStaples}
                                        pantry={pantry} setPantry={setPantry}
                                        expiring={expiring} setExpiring={setExpiring}
                                        onNext={()=>go("leftovers")}/>}
              {screen==="leftovers"&& <LeftoversScreen leftovers={leftovers}
                                        setLeftovers={setLeftovers} onNext={()=>go("checkin")}
                                        isFlow={prevScreen==="pantry"}/>}
              {screen==="checkin"  && <CheckinScreen horizon={horizon} energy={energy}
                                        setEnergy={setEnergy} time={time} setTime={setTime}
                                        mood={mood} setMood={setMood}
                                        onSubmit={()=>{setCarouselIndex({breakfast:0,lunch:0,dinner:0});go("loading");setTimeout(()=>go("results"),1400);}}/>}
              {screen==="loading"  && (
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",
                  justifyContent:"center",padding:"80px 32px",textAlign:"center"}}>
                  <div style={{position:"relative",width:64,height:64,marginBottom:24}}>
                    <div style={{position:"absolute",inset:0,borderRadius:"50%",
                      border:`3px solid ${C.border}`,borderTopColor:acc,
                      animation:"spin 0.9s linear infinite"}}/>
                    <div style={{position:"absolute",inset:0,display:"flex",
                      alignItems:"center",justifyContent:"center",fontSize:26}}>🍽️</div>
                  </div>
                  <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:18,
                    fontWeight:700,color:C.ink,margin:"0 0 8px"}}>Thinking like a nutritionist…</p>
                  <p style={{fontSize:13,color:C.muted,margin:0,fontStyle:"italic"}}>
                    Balancing expiry, energy, and your preferences</p>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}
              {screen==="results"&&plan&&(
                <ResultsScreen horizon={horizon} slot={slot} slots={slots} plan={plan}
                  vegPref={vegPref} diet={diet} energy={energy} time={time} mood={mood}
                  leftovers={leftovers} available={available} effectiveStaples={effectiveStaples}
                  carouselIndex={carouselIndex} setCarouselIndex={setCarouselIndex}
                  favorites={favorites} onFav={n=>setFavorites(f=>f.includes(n)?f.filter(x=>x!==n):[...f,n])}
                  onNewDay={newDay}/>
              )}
            </div>
          <BottomNav screen={screen} onNavigate={s=>{
            if(s==="checkin"&&screen==="results") newDay();
            else go(s);
          }}/>
          </div>
        )}
      </div>
    </div>
  );
}
