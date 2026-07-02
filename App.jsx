import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Phone, Lock, ChevronLeft } from "lucide-react";

// ─── LOGO: Indian Festive ─────────────────────────────────────────────────────
function MealioLogo({ size = 48, showText = false, textSize = 22 }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-label="Mealio logo"
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
        <rect x="26"  y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="29.6" y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="33.2" y="34" width="1.8" height="12" rx="0.9" fill="#100408"/>
        <rect x="26"  y="45.5" width="9" height="1.8" rx="0.9" fill="#100408"/>
        <rect x="29.6" y="47.2" width="1.8" height="19" rx="0.9" fill="#100408"/>
        <rect x="69" y="34" width="2.2" height="32" rx="1.1" fill="#100408"/>
        <path d="M 69 34 Q 73.5 38 73 44 L 69 44 Z" fill="#100408"/>
      </svg>
      {showText && (
        <div style={{textAlign:"center"}}>
          <p style={{fontFamily:"'Pacifico',cursive", fontSize:textSize, color:"#fff", margin:0, lineHeight:1.1}}>Mealio</p>
          <p style={{fontFamily:"'Nunito',sans-serif", fontSize:Math.max(9,textSize*0.38), color:"rgba(255,255,255,0.72)", margin:"4px 0 0", letterSpacing:"0.07em"}}>Art Of Meal Planning</p>
        </div>
      )}
    </div>
  );
}

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:      "#FFF8F0",
  card:    "#FFFFFF",
  subtle:  "#FFF0E0",
  dark1:   "#201008",
  indigo:  "#5878F0",
  saffron: "#F07820",
  red:     "#E02858",
  primary: "#F07820",
  selBg:   "#FFF0DE",
  selTxt:  "#B85010",
  selBdr:  "#F07820",
  ink:     "#2C1410",
  muted:   "#8A6A5A",
  border:  "#EDD8C4",
};

// ─── SWIPE WRAPPER ─────────────────────────────────────────────────────────────
function SwipeScreen({ children, onSwipeLeft, onSwipeRight }) {
  const sx = useRef(null), sy = useRef(null);
  return (
    <div
      onTouchStart={e => { sx.current = e.touches[0].clientX; sy.current = e.touches[0].clientY; }}
      onTouchEnd={e => {
        if (sx.current === null) return;
        const dx = e.changedTouches[0].clientX - sx.current;
        const dy = Math.abs(e.changedTouches[0].clientY - sy.current);
        sx.current = null;
        if (dy > 60) return;
        if (dx < -60 && onSwipeLeft)  onSwipeLeft();
        if (dx >  60 && onSwipeRight) onSwipeRight();
      }}
      style={{ height:"100%", width:"100%" }}
    >{children}</div>
  );
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function PrimaryBtn({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      width:"100%", padding:"15px 20px", borderRadius:16, border:"none",
      background: disabled ? "#D4C4B4" : `linear-gradient(135deg,${C.saffron},${C.red})`,
      color:"white", fontSize:14, fontWeight:800,
      fontFamily:"'Plus Jakarta Sans',sans-serif",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      {label} <ArrowRight size={16}/>
    </button>
  );
}

function GlowBlob({ color, opacity, blur, x, y, size }) {
  return (
    <div style={{ position:"absolute", top:y, left:x, width:size, height:size,
      borderRadius:"50%", background:color, opacity, filter:`blur(${blur}px)`, pointerEvents:"none" }}/>
  );
}

// ─── SPLASH ────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const start = Date.now(), total = 5000;
    const tick = () => {
      const p = Math.min((Date.now() - start) / total, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(onDone, 200);
    };
    requestAnimationFrame(tick);
  }, [onDone]);

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:`radial-gradient(ellipse at 30% 40%,#3A3090 0%,${C.dark1} 60%)`,
      padding:"0 32px", textAlign:"center", isolation:"isolate", position:"relative" }}>
      <GlowBlob color={C.indigo}  opacity={0.18} blur={60} x="18%" y="16%" size={220}/>
      <GlowBlob color={C.saffron} opacity={0.20} blur={50} x="58%" y="26%" size={180}/>
      <GlowBlob color={C.red}     opacity={0.16} blur={55} x="30%" y="56%" size={160}/>
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
        <MealioLogo size={130} showText={true} textSize={46}/>
        <div style={{ marginTop:44, display:"flex", gap:12 }}>
          {[{e:"🧠",l:"Thinks for you"},{e:"🥕",l:"Uses what's home"},{e:"⚡",l:"Matches your energy"}].map(i=>(
            <div key={i.l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              background:"rgba(255,255,255,0.08)", borderRadius:14, padding:"12px 10px",
              border:"0.5px solid rgba(255,255,255,0.12)", minWidth:0 }}>
              <span style={{fontSize:22}}>{i.e}</span>
              <span style={{fontSize:10, color:"rgba(255,255,255,0.7)",
                fontFamily:"'Nunito',sans-serif", fontWeight:600, letterSpacing:"0.04em"}}>{i.l}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:52, width:160, height:4, borderRadius:2,
          background:"rgba(255,255,255,0.14)", overflow:"hidden" }}>
          <div style={{ height:"100%", borderRadius:2,
            background:`linear-gradient(90deg,${C.indigo},${C.saffron})`,
            width:`${progress*100}%`, transition:"width 0.1s linear" }}/>
        </div>
        <p style={{ marginTop:12, fontSize:11, color:"rgba(255,255,255,0.35)",
          fontFamily:"'Nunito',sans-serif" }}>Loading your kitchen brain…</p>
      </div>
    </div>
  );
}

// ─── ONBOARDING ────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    bg: `radial-gradient(ellipse at 25% 35%,#4060D8 0%,#201008 65%)`,
    g: [{c:C.indigo,x:"12%",y:"18%",s:200},{c:C.saffron,x:"58%",y:"52%",s:160}],
    emoji:"🧠", eClr:"#EAF0FF",
    head:"Tell Mealio what's in\nyour fridge or pantry!",
    sub:"We scan what you have!\nNo recipe browsing, no guesswork,\nno wasted food!",
  },
  {
    bg: `radial-gradient(ellipse at 70% 30%,#C04010 0%,#201008 65%)`,
    g: [{c:C.saffron,x:"58%",y:"16%",s:180},{c:C.red,x:"18%",y:"58%",s:160}],
    emoji:"⚡", eClr:"#FFF3E8",
    head:"Meals that match\nyour moment!",
    sub:"Low energy? We've got a 10-minute fix!\nInspired? Let's cook something real!\nYou set the mood — we set the menu!",
  },
  {
    bg: `radial-gradient(ellipse at 40% 65%,#A01838 0%,#201008 65%)`,
    g: [{c:C.red,x:"28%",y:"52%",s:180},{c:C.indigo,x:"68%",y:"18%",s:160}],
    emoji:"♻️", eClr:"#FFE8EE",
    head:"Nothing in your kitchen\ngoes to waste!",
    sub:"Leftover dal tonight?\nTomorrow's breakfast is a paratha!\nWe connect the dots — you just eat!",
  },
];

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;
  const next = () => isLast ? onDone() : setSlide(i => i+1);
  const prev = () => slide > 0 && setSlide(i => i-1);

  return (
    <SwipeScreen onSwipeLeft={next} onSwipeRight={prev}>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
        background:s.bg, isolation:"isolate", position:"relative",
        transition:"background 0.4s ease" }}>
        {s.g.map((g,i)=><GlowBlob key={i} color={g.c} opacity={0.2} blur={60} x={g.x} y={g.y} size={g.s}/>)}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"52px 24px 0", position:"relative", zIndex:1 }}>
          <MealioLogo size={38}/>
          <button onClick={onDone} style={{ background:"rgba(255,255,255,0.12)",
            border:"0.5px solid rgba(255,255,255,0.22)", borderRadius:20,
            padding:"6px 16px", color:"rgba(255,255,255,0.75)", fontSize:12,
            fontFamily:"'Nunito',sans-serif", fontWeight:600, cursor:"pointer" }}>Skip</button>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:"32px 32px 0", position:"relative", zIndex:1, textAlign:"center" }}>
          <div style={{ width:120, height:120, borderRadius:32, background:s.eClr,
            display:"flex", alignItems:"center", justifyContent:"center",
            marginBottom:28, boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
            <span style={{fontSize:56}}>{s.emoji}</span>
          </div>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:26, fontWeight:800,
            color:"white", margin:"0 0 16px", lineHeight:1.35, whiteSpace:"pre-line" }}>{s.head}</h2>
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15,
            color:"rgba(255,255,255,0.72)", margin:0, lineHeight:1.85,
            whiteSpace:"pre-line", fontStyle:"italic" }}>{s.sub}</p>
        </div>

        <div style={{ padding:"32px 24px 44px", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:22 }}>
            {SLIDES.map((_,i)=>(
              <button key={i} onClick={()=>setSlide(i)} style={{
                height:6, width:i===slide?28:8, borderRadius:3,
                background:i===slide?C.saffron:"rgba(255,255,255,0.3)",
                border:"none", cursor:"pointer", padding:0,
                transition:"width 0.3s, background 0.3s" }}/>
            ))}
          </div>
          <div style={{display:"flex", gap:12}}>
            {slide > 0 && (
              <button onClick={prev} style={{ width:52, height:52, borderRadius:16,
                border:"1px solid rgba(255,255,255,0.25)", background:"rgba(255,255,255,0.1)",
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", flexShrink:0 }}>
                <ChevronLeft size={20} color="white"/>
              </button>
            )}
            <button onClick={next} style={{ flex:1, height:52, borderRadius:16, border:"none",
              background:`linear-gradient(135deg,${C.saffron},${C.red})`,
              color:"white", fontSize:15, fontWeight:800,
              fontFamily:"'Plus Jakarta Sans',sans-serif", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {isLast ? "Let's get started!" : "Next →"}
            </button>
          </div>
          <p style={{ textAlign:"center", fontSize:11, color:"rgba(255,255,255,0.38)",
            marginTop:14, fontFamily:"'Nunito',sans-serif", fontStyle:"italic" }}>
            Swipe left to go forward · swipe right to go back
          </p>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [phone, setPhone] = useState("");
  const valid = phone.replace(/\D/g,"").length === 10;

  return (
    <SwipeScreen>
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
        <div style={{ background:`linear-gradient(135deg,${C.dark1} 0%,#3A2818 100%)`,
          padding:"52px 24px 32px", isolation:"isolate", position:"relative" }}>
          <GlowBlob color={C.saffron} opacity={0.14} blur={50} x="55%" y="0%" size={180}/>
          <GlowBlob color={C.red}     opacity={0.10} blur={40} x="20%" y="40%" size={120}/>
          <MealioLogo size={46} showText={true} textSize={24}/>
        </div>

        <div style={{ flex:1, padding:"36px 24px 44px" }}>
          <div style={{ width:52, height:52, borderRadius:16, background:C.subtle,
            display:"flex", alignItems:"center", justifyContent:"center",
            marginBottom:20, border:`1px solid ${C.border}` }}>
            <Phone size={22} color={C.saffron}/>
          </div>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28,
            fontWeight:800, color:C.ink, margin:"0 0 8px", lineHeight:1.2 }}>
            What's your number?
          </h1>
          <p style={{ fontSize:14, color:C.muted, margin:"0 0 32px",
            fontFamily:"'Nunito',sans-serif", lineHeight:1.75, fontStyle:"italic" }}>
            We'll send a one-time code —<br/>takes 10 seconds!
          </p>

          <div style={{ display:"flex", alignItems:"center", borderRadius:16,
            border:`1.5px solid ${phone.length>0?C.saffron:C.border}`,
            background:C.card, overflow:"hidden", transition:"border-color 0.2s" }}>
            <div style={{ padding:"16px 14px", borderRight:`1px solid ${C.border}`,
              fontWeight:700, fontSize:14, color:C.ink,
              fontFamily:"'Plus Jakarta Sans',sans-serif", flexShrink:0 }}>+91</div>
            <input type="tel" value={phone}
              onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit mobile number" maxLength={10}
              style={{ flex:1, border:"none", outline:"none", padding:"16px 14px",
                fontSize:15, color:C.ink, background:"transparent",
                fontFamily:"'Nunito',sans-serif" }}/>
            {phone.length===10 && (
              <div style={{padding:"0 14px"}}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:C.saffron,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="10" height="8" viewBox="0 0 10 8">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:10 }}>
            <Lock size={11} color={C.muted}/>
            <p style={{ margin:0, fontSize:12, color:C.muted,
              fontFamily:"'Nunito',sans-serif" }}>Your number is safe — we never share or spam!</p>
          </div>

          <div style={{marginTop:32}}>
            <PrimaryBtn label="Send OTP" disabled={!valid} onClick={()=>valid&&onLogin(phone)}/>
            {!valid && phone.length>0 && (
              <p style={{ textAlign:"center", fontSize:12, color:C.red, marginTop:10,
                fontFamily:"'Nunito',sans-serif" }}>Please enter a valid 10-digit number</p>
            )}
          </div>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── OTP ───────────────────────────────────────────────────────────────────────
function OTPScreen({ phone, onVerify, onBack }) {
  const [digits, setDigits] = useState(["","","","","",""]);
  const refs = Array.from({length:6}, ()=>useRef(null));
  const code = digits.join("");
  const fmt  = `+91 ${phone.slice(0,5)} XXXXX`;

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const n=[...digits]; n[i]=val; setDigits(n);
    if (val && i<5) refs[i+1].current?.focus();
    if (!val && i>0) refs[i-1].current?.focus();
  };
  const handleKey = (i,e) => {
    if (e.key==="Backspace" && !digits[i] && i>0) refs[i-1].current?.focus();
  };

  return (
    <SwipeScreen onSwipeRight={onBack}>
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
        <div style={{ background:`linear-gradient(135deg,${C.dark1} 0%,#3A2818 100%)`,
          padding:"52px 24px 32px", isolation:"isolate", position:"relative" }}>
          <GlowBlob color={C.red}   opacity={0.14} blur={50} x="28%" y="0%" size={160}/>
          <GlowBlob color={C.indigo} opacity={0.10} blur={40} x="62%" y="30%" size={120}/>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.1)",
            border:"0.5px solid rgba(255,255,255,0.2)", borderRadius:12,
            padding:"7px 14px", color:"rgba(255,255,255,0.75)", fontSize:13,
            fontFamily:"'Nunito',sans-serif", fontWeight:600, cursor:"pointer",
            display:"flex", alignItems:"center", gap:4, marginBottom:16, width:"fit-content" }}>
            <ChevronLeft size={15}/> Back
          </button>
          <MealioLogo size={38}/>
        </div>

        <div style={{ flex:1, padding:"36px 24px 44px" }}>
          <span style={{fontSize:48, display:"block", marginBottom:16}}>📱</span>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:28,
            fontWeight:800, color:C.ink, margin:"0 0 8px", lineHeight:1.2 }}>
            Check your phone!
          </h1>
          <p style={{ fontSize:14, color:C.muted, margin:"0 0 32px",
            fontFamily:"'Nunito',sans-serif", lineHeight:1.75, fontStyle:"italic" }}>
            Sent a 6-digit code to{" "}
            <strong style={{color:C.ink, fontStyle:"normal"}}>{fmt}</strong>
          </p>

          <div style={{display:"flex", gap:8}}>
            {digits.map((d,i)=>(
              <input key={i} ref={refs[i]} type="tel" maxLength={1} value={d}
                onChange={e=>handleDigit(i,e.target.value)}
                onKeyDown={e=>handleKey(i,e)}
                onFocus={e=>e.target.select()}
                style={{ flex:1, height:58, borderRadius:14, textAlign:"center",
                  fontSize:22, fontWeight:700, outline:"none",
                  border:`2px solid ${d?C.saffron:C.border}`,
                  background:d?C.selBg:C.card, color:C.ink,
                  fontFamily:"'Plus Jakarta Sans',sans-serif",
                  transition:"border-color 0.2s, background 0.2s" }}/>
            ))}
          </div>

          <p style={{ fontSize:12, color:C.muted, marginTop:12,
            fontFamily:"'Nunito',sans-serif", textAlign:"center", fontStyle:"italic" }}>
            Demo — any 6 digits will work!
          </p>

          <div style={{marginTop:28}}>
            <PrimaryBtn label="Verify & Continue" disabled={code.length<6}
              onClick={()=>code.length===6&&onVerify()}/>
          </div>

          <button style={{ display:"block", width:"100%", marginTop:14, background:"none",
            border:"none", fontSize:13, color:C.muted,
            fontFamily:"'Nunito',sans-serif", cursor:"pointer", fontWeight:600 }}>
            Didn't receive it? Resend code
          </button>
          <p style={{ textAlign:"center", fontSize:11, color:C.muted, marginTop:10,
            fontFamily:"'Nunito',sans-serif", fontStyle:"italic" }}>
            ← Swipe right to change your number
          </p>
        </div>
      </div>
    </SwipeScreen>
  );
}

// ─── DONE ──────────────────────────────────────────────────────────────────────
function DoneScreen({ onRestart }) {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:`linear-gradient(135deg,#201008,#3A2818)`,
      textAlign:"center", padding:32, isolation:"isolate", position:"relative" }}>
      <GlowBlob color={C.saffron} opacity={0.15} blur={60} x="20%" y="18%" size={200}/>
      <GlowBlob color={C.indigo}  opacity={0.13} blur={55} x="55%" y="52%" size={160}/>
      <span style={{fontSize:56, marginBottom:20, display:"block", position:"relative", zIndex:1}}>🎉</span>
      <div style={{position:"relative", zIndex:1}}>
        <MealioLogo size={88} showText={true} textSize={32}/>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15,
          color:"rgba(255,255,255,0.65)", marginTop:24, lineHeight:1.85, fontStyle:"italic" }}>
          You're in!<br/>The full daily planner continues from here.
        </p>
        <button onClick={onRestart} style={{ marginTop:32, padding:"12px 28px",
          borderRadius:14, border:"1px solid rgba(255,255,255,0.22)",
          background:"rgba(255,255,255,0.08)", color:"white", fontSize:13,
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, cursor:"pointer" }}>
          Restart demo
        </button>
      </div>
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────────
export default function Mealio() {
  const [screen, setScreen] = useState("splash");
  const [phone,  setPhone]  = useState("");

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:C.bg, minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Plus+Jakarta+Sans:wght@500;700;800&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap');
        * { box-sizing:border-box; }
        body { margin:0; background:#FFF8F0; }
        input::placeholder { color:#8A6A5A; opacity:0.65; }
        button:active { opacity:0.78; transform:scale(0.98); }
      `}</style>
      <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh",
        position:"relative", overflow:"hidden" }}>
        {screen==="splash"     && <SplashScreen     onDone={()=>setScreen("onboarding")}/>}
        {screen==="onboarding" && <OnboardingScreen onDone={()=>setScreen("login")}/>}
        {screen==="login"      && <LoginScreen      onLogin={p=>{setPhone(p);setScreen("otp");}}/>}
        {screen==="otp"        && <OTPScreen        phone={phone} onVerify={()=>setScreen("done")} onBack={()=>setScreen("login")}/>}
        {screen==="done"       && <DoneScreen       onRestart={()=>setScreen("splash")}/>}
      </div>
    </div>
  );
}
