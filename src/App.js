import { useState, useRef, useCallback } from "react";

/* ── Google Fonts ── */
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap";
document.head.appendChild(_fl);

/* ── TOKENS ── */
const C = {
  forest:   "#1C2B1E",
  forestMid:"#2A3D2C",
  forestLt: "#3A5040",
  sand:     "#F5EFE6",
  sandMid:  "#EDE4D8",
  sandDark: "#D6CAB8",
  gold:     "#C9A84C",
  goldLt:   "#F0D080",
  terra:    "#C4633A",
  sage:     "#7A9E7E",
  sageLt:   "#A8C5AC",
  white:    "#FFFFFF",
  ink:      "#1A1A1A",
  inkMid:   "#3D3D3D",
  inkLt:    "#6B6B6B",
  border:   "#E2D9CE",
  cardBg:   "#FDFAF6",
};
const F = { serif: "'DM Serif Display', Georgia, serif", sans: "'DM Sans', sans-serif" };

/* ── MOCK DATA ── */
const MOCK_USERS = [
  { id:1, email:"gast@test.de",  password:"123", name:"Julia Meier",  role:"guest", avatar:"JM" },
  { id:2, email:"host@test.de",  password:"123", name:"Thomas Bauer", role:"host",  avatar:"TB" },
];

let _nextId = 10;
const uid = () => ++_nextId;

const INIT_LISTINGS = [
  { id:1, hostId:2, title:"Moderne Stadtwohnung Berlin Mitte", location:"Berlin, Deutschland", type:"Gesamte Wohnung", price:89, originalPrice:120, rating:4.92, reviews:134, guests:4, bedrooms:2, beds:2, baths:1,
    images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"],
    amenities:["WLAN","Küche","Waschmaschine","Klimaanlage","Aufzug"], description:"Stilvolle Wohnung im Herzen Berlins. Perfekt für Paare oder kleine Familien. Direkte U-Bahn-Anbindung.", category:"Städte", badge:"Beliebt", active:true },
  { id:2, hostId:2, title:"Gemütliches Chalet in den Alpen", location:"Garmisch-Partenkirchen", type:"Gesamtes Haus", price:215, originalPrice:null, rating:4.98, reviews:89, guests:6, bedrooms:3, beds:4, baths:2,
    images:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80","https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80"],
    amenities:["Kamin","WLAN","Bergblick","Parkplatz","Sauna"], description:"Traumhaftes Chalet mit Panoramablick auf die Zugspitze. Perfekt für Ski-Urlaub oder Wanderungen im Sommer.", category:"Berge", badge:"Top-Bewertet", active:true },
  { id:3, hostId:99, title:"Strandhaus an der Ostsee", location:"Rügen, Mecklenburg-Vorpommern", type:"Gesamtes Haus", price:175, originalPrice:210, rating:4.85, reviews:212, guests:8, bedrooms:4, beds:5, baths:2,
    images:["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=900&q=80","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80"],
    amenities:["Strandnah","Terrasse","Grill","Fahrräder","Spülmaschine"], description:"Idyllisches Strandhaus nur 200m vom Meer. Sonnenuntergänge über der Ostsee von der großen Terrasse.", category:"Strand", badge:"Angebot", active:true },
  { id:4, hostId:99, title:"Luxus-Penthouse HafenCity", location:"Hamburg, Deutschland", type:"Gesamte Wohnung", price:340, originalPrice:null, rating:5.0, reviews:47, guests:4, bedrooms:2, beds:2, baths:2,
    images:["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"],
    amenities:["Dachterrasse","Hafenblick","Concierge","Gym","Parkplatz"], description:"Exklusives Penthouse mit 180°-Blick auf den Hamburger Hafen. Hochwertig ausgestattet für besondere Anlässe.", category:"Städte", badge:"Luxus", active:true },
  { id:5, hostId:99, title:"Weinberghaus an der Mosel", location:"Bernkastel-Kues, RLP", type:"Gesamtes Haus", price:128, originalPrice:155, rating:4.91, reviews:163, guests:2, bedrooms:1, beds:1, baths:1,
    images:["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80","https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&q=80"],
    amenities:["Weinberg","Terrasse","Weinverkostung","WLAN","Parkplatz"], description:"Kleines Schmuckstück inmitten von Weinreben mit Verkostung direkt vor Ort.", category:"Natur", badge:"Romantisch", active:true },
  { id:6, hostId:99, title:"Design-Loft Frankfurt Westend", location:"Frankfurt am Main", type:"Gesamte Wohnung", price:145, originalPrice:null, rating:4.77, reviews:95, guests:3, bedrooms:1, beds:2, baths:1,
    images:["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80"],
    amenities:["Rooftop","WLAN","Kaffeemaschine","Smart TV","Gym"], description:"Zeitgenössisch designtes Loft nahe der Messe Frankfurt. Ideal für Business- und Freizeitreisende.", category:"Städte", badge:null, active:true },
];

const INIT_BOOKINGS = [
  { id:1, listingId:3, guestId:1, guestName:"Julia Meier", checkIn:"2026-04-10", checkOut:"2026-04-14", guests:3, total:840,  status:"confirmed" },
  { id:2, listingId:4, guestId:1, guestName:"Julia Meier", checkIn:"2026-05-01", checkOut:"2026-05-03", guests:2, total:816,  status:"pending"   },
];

const CATEGORIES = [
  { id:"Alle",   label:"Alle Ziele", icon:"🌍" },
  { id:"Städte", label:"Städte",     icon:"🏙️" },
  { id:"Strand", label:"Strand",     icon:"🏖️" },
  { id:"Berge",  label:"Berge",      icon:"🏔️" },
  { id:"Natur",  label:"Natur",      icon:"🌿" },
];

const AMENITY_OPTIONS = ["WLAN","Küche","Waschmaschine","Klimaanlage","Aufzug","Kamin","Bergblick","Parkplatz","Sauna","Strandnah","Terrasse","Grill","Fahrräder","Spülmaschine","Dachterrasse","Hafenblick","Concierge","Gym","Weinberg","Weinverkostung","Rooftop","Kaffeemaschine","Smart TV","Pool","Haustiere erlaubt","Nichtraucher"];

const BADGE_COLORS = {
  "Beliebt":     { bg:"#FEF3C7", color:"#92600A" },
  "Top-Bewertet":{ bg:"#D1FAE5", color:"#065F46" },
  "Angebot":     { bg:"#FEE2E2", color:"#991B1B" },
  "Luxus":       { bg:"#EDE9FE", color:"#5B21B6" },
  "Romantisch":  { bg:"#FCE7F3", color:"#9D174D" },
};

/* ── SHARED STYLES ── */
const inputSt = { fontFamily:F.sans, fontSize:14, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 14px", outline:"none", width:"100%", boxSizing:"border-box", background:"white", color:C.ink, transition:"border-color 0.2s" };
const labelSt = { fontFamily:F.sans, fontSize:11, fontWeight:700, letterSpacing:0.8, color:C.inkLt, textTransform:"uppercase", display:"block", marginBottom:5 };
const btnPrimary = { fontFamily:F.sans, fontWeight:700, fontSize:14, background:`linear-gradient(135deg,${C.forest},${C.forestLt})`, color:"white", border:"none", borderRadius:10, padding:"11px 22px", cursor:"pointer" };
const btnOutline = { fontFamily:F.sans, fontWeight:600, fontSize:13, background:"white", color:C.inkMid, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 18px", cursor:"pointer" };
const btnGhost  = { fontFamily:F.sans, fontWeight:600, fontSize:13, background:"none", color:C.inkMid, border:"none", cursor:"pointer", padding:"6px 10px" };

/* ── ICONS ── */
const StarIcon  = ({size=12}) => <svg width={size} height={size} viewBox="0 0 24 24" fill={C.gold}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const HeartIcon = ({filled})  => <svg width={18} height={18} viewBox="0 0 24 24" fill={filled?C.terra:"none"} stroke={filled?C.terra:"white"} strokeWidth={2.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const SearchIcon= ()          => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BackIcon  = ()          => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>;
const CheckIcon = ()          => <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>;
const EditIcon  = ()          => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = ()          => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const PhotoIcon = ()          => <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={C.sage} strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const PlusIcon  = ()          => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const XIcon     = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

/* ════════════════════════════════════════════
   PHOTO UPLOADER
════════════════════════════════════════════ */
function PhotoUploader({ images, onChange }) {
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const addFiles = useCallback((files) => {
    const readers = Array.from(files).filter(f=>f.type.startsWith("image/")).map(f=>
      new Promise(res=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.readAsDataURL(f); })
    );
    Promise.all(readers).then(results=>onChange([...images,...results]));
  }, [images, onChange]);

  const addUrl = () => { const u=urlInput.trim(); if(u){ onChange([...images,u]); setUrlInput(""); } };
  const remove    = i => onChange(images.filter((_,j)=>j!==i));
  const moveLeft  = i => { if(i===0)return; const a=[...images];[a[i-1],a[i]]=[a[i],a[i-1]];onChange(a); };
  const moveRight = i => { if(i===images.length-1)return; const a=[...images];[a[i+1],a[i]]=[a[i],a[i+1]];onChange(a); };

  return (
    <div>
      <label style={labelSt}>Fotos ({images.length})</label>
      <div onClick={()=>fileRef.current.click()}
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files);}}
        style={{ border:`2px dashed ${dragging?C.sage:C.border}`, borderRadius:12, padding:"28px 20px", textAlign:"center", cursor:"pointer", background:dragging?`${C.sage}15`:"white", transition:"all 0.2s", marginBottom:12 }}>
        <PhotoIcon/>
        <div style={{ fontFamily:F.sans, fontSize:14, fontWeight:600, color:C.inkMid, marginTop:8 }}>Fotos hier ablegen oder klicken</div>
        <div style={{ fontFamily:F.sans, fontSize:12, color:C.inkLt, marginTop:3 }}>JPG, PNG, WEBP — beliebig viele</div>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <input style={{...inputSt,flex:1}} placeholder="Oder Foto-URL einfügen…" value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUrl()}/>
        <button onClick={addUrl} style={{...btnOutline,padding:"10px 16px",display:"flex",alignItems:"center",gap:4}}><PlusIcon/> URL</button>
      </div>
      {images.length>0 && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:8 }}>
          {images.map((img,i)=>(
            <div key={i} style={{ position:"relative", borderRadius:10, overflow:"hidden", aspectRatio:"4/3", border:i===0?`2.5px solid ${C.gold}`:`1.5px solid ${C.border}` }}>
              <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              {i===0 && <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.55)",fontFamily:F.sans,fontSize:10,fontWeight:700,color:C.goldLt,textAlign:"center",padding:"3px 0"}}>Titelbild</div>}
              <div style={{position:"absolute",top:4,right:4,display:"flex",gap:3}}>
                {i>0 && <button onClick={()=>moveLeft(i)}  style={{background:"rgba(0,0,0,0.5)",border:"none",borderRadius:4,width:20,height:20,cursor:"pointer",color:"white",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>}
                {i<images.length-1 && <button onClick={()=>moveRight(i)} style={{background:"rgba(0,0,0,0.5)",border:"none",borderRadius:4,width:20,height:20,cursor:"pointer",color:"white",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>}
                <button onClick={()=>remove(i)} style={{background:"rgba(180,30,30,0.8)",border:"none",borderRadius:4,width:20,height:20,cursor:"pointer",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}><XIcon size={10}/></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   LISTING FORM
════════════════════════════════════════════ */
const emptyForm = () => ({ title:"", location:"", type:"Gesamte Wohnung", price:"", originalPrice:"", guests:"4", bedrooms:"1", beds:"1", baths:"1", description:"", category:"Städte", badge:"", amenities:[], images:[] });

function ListingForm({ initial, onSave, onCancel, title: formTitle }) {
  const [f, setF] = useState(initial || emptyForm());
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const toggleAmenity = a => set("amenities", f.amenities.includes(a)?f.amenities.filter(x=>x!==a):[...f.amenities,a]);
  const valid = f.title && f.location && f.price;

  return (
    <div style={{ background:"white", border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
      <div style={{ background:`linear-gradient(135deg,${C.forest},${C.forestMid})`, padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:F.serif, fontSize:20, color:"white" }}>{formTitle}</div>
        <button onClick={onCancel} style={{ background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", color:"white", display:"flex", alignItems:"center", justifyContent:"center" }}><XIcon size={16}/></button>
      </div>
      <div style={{ padding:28 }}>
        <div style={{ marginBottom:24 }}>
          <PhotoUploader images={f.images} onChange={imgs=>set("images",imgs)}/>
        </div>
        <div style={{ height:1, background:C.border, marginBottom:24 }}/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={labelSt}>Titel *</label>
            <input style={inputSt} value={f.title} onChange={e=>set("title",e.target.value)} placeholder="z.B. Moderne Stadtwohnung Berlin"/>
          </div>
          <div>
            <label style={labelSt}>Standort *</label>
            <input style={inputSt} value={f.location} onChange={e=>set("location",e.target.value)} placeholder="Stadt, Bundesland"/>
          </div>
          <div>
            <label style={labelSt}>Unterkunftstyp</label>
            <select style={inputSt} value={f.type} onChange={e=>set("type",e.target.value)}>
              {["Gesamte Wohnung","Gesamtes Haus","Privates Zimmer","Ferienwohnung","Villa"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Preis / Nacht (€) *</label>
            <input style={inputSt} type="number" value={f.price} onChange={e=>set("price",e.target.value)} placeholder="89"/>
          </div>
          <div>
            <label style={labelSt}>Originalpreis (€, optional)</label>
            <input style={inputSt} type="number" value={f.originalPrice} onChange={e=>set("originalPrice",e.target.value)} placeholder="Durchgestrichener Preis"/>
          </div>
          <div><label style={labelSt}>Max. Gäste</label><input style={inputSt} type="number" min="1" max="20" value={f.guests} onChange={e=>set("guests",e.target.value)}/></div>
          <div><label style={labelSt}>Schlafzimmer</label><input style={inputSt} type="number" min="0" max="20" value={f.bedrooms} onChange={e=>set("bedrooms",e.target.value)}/></div>
          <div><label style={labelSt}>Betten</label><input style={inputSt} type="number" min="1" max="20" value={f.beds} onChange={e=>set("beds",e.target.value)}/></div>
          <div><label style={labelSt}>Bäder</label><input style={inputSt} type="number" min="1" max="10" value={f.baths} onChange={e=>set("baths",e.target.value)}/></div>
          <div>
            <label style={labelSt}>Kategorie</label>
            <select style={inputSt} value={f.category} onChange={e=>set("category",e.target.value)}>
              {["Städte","Strand","Berge","Natur"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Badge (optional)</label>
            <select style={inputSt} value={f.badge} onChange={e=>set("badge",e.target.value)}>
              <option value="">Kein Badge</option>
              {Object.keys(BADGE_COLORS).map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={labelSt}>Beschreibung</label>
          <textarea style={{...inputSt,minHeight:90,resize:"vertical"}} value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Beschreibe deine Unterkunft ausführlich…"/>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={labelSt}>Ausstattung ({f.amenities.length} ausgewählt)</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {AMENITY_OPTIONS.map(a=>{
              const sel=f.amenities.includes(a);
              return <button key={a} onClick={()=>toggleAmenity(a)}
                style={{ padding:"6px 14px", border:`1.5px solid ${sel?C.sage:C.border}`, borderRadius:20, background:sel?`${C.sage}20`:"white", fontFamily:F.sans, fontSize:12, fontWeight:sel?700:400, color:sel?C.forestLt:C.inkLt, cursor:"pointer" }}>
                {sel&&"✓ "}{a}
              </button>;
            })}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onCancel} style={btnOutline}>Abbrechen</button>
          <button onClick={()=>valid&&onSave(f)} style={{...btnPrimary,opacity:valid?1:0.5,cursor:valid?"pointer":"default",display:"flex",alignItems:"center",gap:6}}>
            <CheckIcon/> Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   AUTH MODAL
════════════════════════════════════════════ */
function AuthModal({ onClose, onLogin }) {
  const [mode,setMode]=useState("login");
  const [role,setRole]=useState("guest");
  const [f,setF]=useState({name:"",email:"",password:""});
  const [error,setError]=useState("");
  const [users,setUsers]=useState([...MOCK_USERS]);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));

  const submit=()=>{
    setError("");
    if(mode==="login"){
      const u=users.find(u=>u.email===f.email&&u.password===f.password);
      if(!u) return setError("E-Mail oder Passwort falsch.");
      onLogin(u);
    } else {
      if(!f.name||!f.email||!f.password) return setError("Bitte alle Felder ausfüllen.");
      if(users.find(u=>u.email===f.email)) return setError("E-Mail bereits registriert.");
      const nu={id:uid(),...f,role,avatar:f.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()};
      setUsers(p=>[...p,nu]); onLogin(nu);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(28,43,30,0.7)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:24,width:"100%",maxWidth:420,boxShadow:"0 40px 80px rgba(0,0,0,0.3)",overflow:"hidden"}}>
        <div style={{background:`linear-gradient(135deg,${C.forest},${C.forestLt})`,padding:"28px 28px 24px",position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"rgba(255,255,255,0.15)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}><XIcon/></button>
          <div style={{fontFamily:F.serif,fontSize:28,color:"white",fontStyle:"italic"}}>Willkommen</div>
          <div style={{fontFamily:F.sans,fontSize:13,color:C.sageLt,marginTop:2}}>{mode==="login"?"In deinem Konto anmelden":"Kostenloses Konto erstellen"}</div>
        </div>
        <div style={{padding:28}}>
          <div style={{display:"flex",background:C.sand,borderRadius:10,padding:3,marginBottom:22,gap:3}}>
            {[["login","Anmelden"],["register","Registrieren"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}}
                style={{flex:1,padding:"8px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:F.sans,fontSize:13,fontWeight:600,background:mode===m?"white":"transparent",color:mode===m?C.forest:C.inkLt,boxShadow:mode===m?"0 1px 6px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>
                {l}
              </button>
            ))}
          </div>
          {mode==="register" && (
            <>
              <label style={labelSt}>Ich bin ein…</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {[{v:"guest",i:"🧳",l:"Gast"},{v:"host",i:"🏡",l:"Gastgeber"}].map(r=>(
                  <button key={r.v} onClick={()=>setRole(r.v)}
                    style={{padding:"16px 10px",border:`2px solid ${role===r.v?C.sage:C.border}`,borderRadius:12,background:role===r.v?`${C.sage}15`:"white",cursor:"pointer",fontFamily:F.sans,fontSize:13,fontWeight:600,color:role===r.v?C.forestLt:C.inkLt,transition:"all 0.15s"}}>
                    <div style={{fontSize:22,marginBottom:4}}>{r.i}</div>{r.l}
                  </button>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <label style={labelSt}>Vollständiger Name</label>
                <input style={inputSt} placeholder="Max Mustermann" value={f.name} onChange={e=>set("name",e.target.value)}/>
              </div>
            </>
          )}
          <div style={{marginBottom:14}}>
            <label style={labelSt}>E-Mail</label>
            <input style={inputSt} type="email" placeholder="name@email.de" value={f.email} onChange={e=>set("email",e.target.value)}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={labelSt}>Passwort</label>
            <input style={inputSt} type="password" placeholder="••••••••" value={f.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          {error && <div style={{background:"#FFF0F0",border:"1px solid #FECACA",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#B91C1C",marginBottom:14,fontFamily:F.sans}}>{error}</div>}
          {mode==="login" && (
            <div style={{background:C.sand,borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:12,color:C.inkMid,lineHeight:1.7,fontFamily:F.sans}}>
              <b>Demo:</b> 🧳 gast@test.de / 123 &nbsp;·&nbsp; 🏡 host@test.de / 123
            </div>
          )}
          <button onClick={submit} style={{...btnPrimary,width:"100%",padding:"13px",fontSize:15,borderRadius:12}}>
            {mode==="login"?"Jetzt anmelden →":"Konto erstellen →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   HERO
════════════════════════════════════════════ */
function Hero({ search, setSearch, checkIn, setCheckIn, checkOut, setCheckOut }) {
  return (
    <div style={{position:"relative",background:`linear-gradient(165deg,${C.forest} 0%,${C.forestMid} 55%,${C.forestLt} 100%)`,overflow:"hidden"}}>
      <div style={{position:"absolute",top:-120,right:-120,width:500,height:500,background:`radial-gradient(circle,${C.gold}18,transparent 65%)`,borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,left:-60,width:360,height:360,background:`radial-gradient(circle,${C.sage}20,transparent 65%)`,borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{maxWidth:860,margin:"0 auto",padding:"60px 24px 72px",position:"relative",zIndex:1}}>
        <div style={{fontFamily:F.serif,fontSize:"clamp(30px,5.5vw,52px)",color:"white",lineHeight:1.15,marginBottom:10}}>
          Finde deinen<br/><span style={{color:C.goldLt,fontStyle:"italic"}}>perfekten Rückzugsort.</span>
        </div>
        <div style={{fontFamily:F.sans,fontSize:15,color:C.sageLt,marginBottom:36,fontWeight:300}}>Tausende einzigartige Unterkünfte. Sofort buchbar.</div>
        <div style={{background:"white",borderRadius:20,padding:6,display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:2,boxShadow:"0 24px 60px rgba(0,0,0,0.35)"}}>
          <div style={{padding:"13px 18px",borderRight:`1px solid ${C.border}`}}>
            <div style={{fontFamily:F.sans,fontSize:10,fontWeight:700,letterSpacing:1,color:C.inkLt,textTransform:"uppercase",marginBottom:4}}>Reiseziel</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Wo soll's hingehen?" style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:14,fontWeight:500,color:C.ink,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:"13px 18px",borderRight:`1px solid ${C.border}`}}>
            <div style={{fontFamily:F.sans,fontSize:10,fontWeight:700,letterSpacing:1,color:C.inkLt,textTransform:"uppercase",marginBottom:4}}>Check-in</div>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:13,color:C.ink,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:"13px 18px"}}>
            <div style={{fontFamily:F.sans,fontSize:10,fontWeight:700,letterSpacing:1,color:C.inkLt,textTransform:"uppercase",marginBottom:4}}>Checkout</div>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:13,color:C.ink,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:4}}>
            <button style={{height:"100%",padding:"0 22px",background:`linear-gradient(135deg,${C.forest},${C.forestLt})`,border:"none",borderRadius:14,color:"white",fontFamily:F.sans,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>
              <SearchIcon/> Suchen
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:20,marginTop:20,flexWrap:"wrap"}}>
          {["✓ Sofortbuchung","✓ Kostenlos stornierbar","✓ Sicher bezahlen"].map(t=>(
            <div key={t} style={{fontFamily:F.sans,fontSize:12,color:C.sageLt,fontWeight:500}}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   LISTING CARD
════════════════════════════════════════════ */
function ListingCard({ listing, onSelect, wishlist, onWish }) {
  const [imgI,setImgI]=useState(0);
  const [hovered,setHovered]=useState(false);
  const discount=listing.originalPrice?Math.round((1-listing.price/listing.originalPrice)*100):null;
  const bc=listing.badge?BADGE_COLORS[listing.badge]:null;

  return (
    <div onClick={()=>onSelect(listing)} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{cursor:"pointer",borderRadius:18,overflow:"hidden",background:C.cardBg,border:`1px solid ${C.border}`,transition:"box-shadow 0.25s,transform 0.25s",boxShadow:hovered?"0 16px 40px rgba(28,43,30,0.14)":"0 2px 12px rgba(0,0,0,0.05)",transform:hovered?"translateY(-3px)":"none"}}>
      <div style={{position:"relative",paddingBottom:"65%",background:C.sandMid,overflow:"hidden"}}>
        <img src={listing.images[imgI]||"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80"} alt=""
          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s",transform:hovered?"scale(1.05)":"scale(1)"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 50%)",pointerEvents:"none"}}/>
        <button onClick={e=>{e.stopPropagation();onWish(listing.id);}}
          style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(6px)",border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <HeartIcon filled={wishlist.has(listing.id)}/>
        </button>
        {bc && <div style={{position:"absolute",top:12,left:12,background:bc.bg,color:bc.color,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:F.sans}}>{listing.badge}</div>}
        {discount && <div style={{position:"absolute",bottom:12,left:12,background:C.terra,color:"white",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:800,fontFamily:F.sans}}>−{discount}%</div>}
        {listing.images.length>1 && (
          <div style={{position:"absolute",bottom:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>
            {listing.images.map((_,i)=>(
              <div key={i} onClick={e=>{e.stopPropagation();setImgI(i);}}
                style={{width:i===imgI?18:6,height:6,borderRadius:3,background:"white",opacity:i===imgI?1:0.55,transition:"width 0.2s",cursor:"pointer"}}/>
            ))}
          </div>
        )}
      </div>
      <div style={{padding:"14px 16px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontFamily:F.sans,fontSize:14,fontWeight:700,color:C.ink,flex:1,marginRight:8,lineHeight:1.3}}>{listing.title}</div>
          <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
            <StarIcon/><span style={{fontFamily:F.sans,fontSize:13,fontWeight:700,color:C.ink}}>{listing.rating||"Neu"}</span>
          </div>
        </div>
        <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt,marginBottom:10}}>📍 {listing.location} · {listing.type}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {listing.amenities.slice(0,3).map(a=>(
            <span key={a} style={{fontFamily:F.sans,fontSize:11,color:C.inkLt,background:C.sand,padding:"3px 9px",borderRadius:20,border:`1px solid ${C.sandDark}`}}>{a}</span>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.border}`}}>
          <div>
            {listing.originalPrice && <span style={{fontFamily:F.sans,fontSize:12,color:C.inkLt,textDecoration:"line-through",marginRight:6}}>€{listing.originalPrice}</span>}
            <span style={{fontFamily:F.serif,fontSize:20,color:C.forest}}>€{listing.price}</span>
            <span style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}> /Nacht</span>
          </div>
          <div style={{fontFamily:F.sans,fontSize:11,color:C.inkLt}}>{listing.reviews>0?`${listing.reviews} Bew.`:"Neu"}</div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   BOOKING WIDGET
════════════════════════════════════════════ */
function BookingWidget({ listing, user, onBook, onLoginNeeded }) {
  const [checkIn,setCheckIn]=useState("");
  const [checkOut,setCheckOut]=useState("");
  const [guests,setGuests]=useState(1);
  const [done,setDone]=useState(false);
  const nights=checkIn&&checkOut?Math.max(0,Math.round((new Date(checkOut)-new Date(checkIn))/86400000)):0;
  const sub=nights*listing.price;
  const fee=Math.round(sub*0.14);

  if(done) return (
    <div style={{textAlign:"center",padding:"36px 16px"}}>
      <div style={{fontSize:52,marginBottom:12}}>🎉</div>
      <div style={{fontFamily:F.serif,fontSize:24,color:C.forest,marginBottom:6}}>Buchung bestätigt!</div>
      <div style={{fontFamily:F.sans,fontSize:13,color:C.inkLt}}>Eine Bestätigung wird per E-Mail gesendet.</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:18}}>
        <div>
          {listing.originalPrice && <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt,textDecoration:"line-through"}}>€{listing.originalPrice}/Nacht</div>}
          <span style={{fontFamily:F.serif,fontSize:30,color:C.forest}}>€{listing.price}</span>
          <span style={{fontFamily:F.sans,fontSize:13,color:C.inkLt}}> /Nacht</span>
        </div>
        {listing.rating>0 && <div style={{display:"flex",alignItems:"center",gap:4}}><StarIcon size={13}/><span style={{fontFamily:F.sans,fontSize:13,fontWeight:700}}>{listing.rating}</span><span style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>({listing.reviews})</span></div>}
      </div>
      <div style={{border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:`1px solid ${C.border}`}}>
          <div style={{padding:"11px 14px",borderRight:`1px solid ${C.border}`}}>
            <div style={labelSt}>Check-in</div>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:13,color:C.ink,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:"11px 14px"}}>
            <div style={labelSt}>Checkout</div>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:13,color:C.ink,width:"100%",background:"transparent"}}/>
          </div>
        </div>
        <div style={{padding:"11px 14px"}}>
          <div style={labelSt}>Gäste</div>
          <select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{border:"none",outline:"none",fontFamily:F.sans,fontSize:13,color:C.ink,width:"100%",background:"transparent"}}>
            {Array.from({length:listing.guests||4},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} Gast{n>1?"¨e":""}</option>)}
          </select>
        </div>
      </div>
      <button onClick={()=>{if(!user)return onLoginNeeded();if(nights>0){onBook({listingId:listing.id,guestId:user.id,guestName:user.name,checkIn,checkOut,guests,total:sub+fee});setDone(true);}}}
        style={{...btnPrimary,width:"100%",padding:"14px",fontSize:15,borderRadius:12,opacity:nights>0?1:0.55,marginBottom:12}}>
        {!user?"🔐 Anmelden zum Buchen":nights>0?`Jetzt buchen — ${nights} Nacht${nights>1?"¨e":""}`:"Datum auswählen"}
      </button>
      {nights>0 && (
        <div style={{fontFamily:F.sans,fontSize:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,color:C.inkMid}}><span>€{listing.price} × {nights} Nächte</span><span>€{sub}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,color:C.inkMid}}><span>Servicegebühr (14 %)</span><span>€{fee}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16,color:C.forest,paddingTop:12,borderTop:`2px solid ${C.border}`}}><span>Gesamt</span><span>€{sub+fee}</span></div>
        </div>
      )}
      <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:6}}>
        {["Kostenlose Stornierung bis 48 h vorher","Sofortbestätigung","Sicher & verschlüsselt bezahlen"].map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:8,fontFamily:F.sans,fontSize:12,color:C.inkLt}}><CheckIcon/>{t}</div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DETAIL VIEW
════════════════════════════════════════════ */
function DetailView({ listing, user, wishlist, onWish, onBook, onBack, onLoginNeeded }) {
  return (
    <div style={{maxWidth:1020,margin:"0 auto",padding:"0 24px 80px"}}>
      <button onClick={onBack} style={{...btnGhost,display:"flex",alignItems:"center",gap:6,padding:"20px 0",fontSize:14,fontWeight:600,color:C.forest}}>
        <BackIcon/> Zurück zur Übersicht
      </button>
      {listing.badge && (()=>{ const bc=BADGE_COLORS[listing.badge]; return <span style={{fontFamily:F.sans,fontSize:12,fontWeight:700,background:bc.bg,color:bc.color,padding:"4px 12px",borderRadius:20,marginBottom:12,display:"inline-block"}}>{listing.badge}</span>; })()}
      <h1 style={{fontFamily:F.serif,fontSize:"clamp(24px,4vw,38px)",color:C.forest,marginBottom:8,lineHeight:1.2}}>{listing.title}</h1>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap",fontFamily:F.sans,fontSize:14}}>
        {listing.rating>0 && <><div style={{display:"flex",alignItems:"center",gap:4}}><StarIcon size={14}/><b>{listing.rating}</b></div><span style={{color:C.sandDark}}>·</span><span style={{color:C.inkLt}}>{listing.reviews} Bewertungen</span><span style={{color:C.sandDark}}>·</span></>}
        <span style={{color:C.inkLt}}>📍 {listing.location}</span>
        <button onClick={()=>onWish(listing.id)} style={{...btnOutline,marginLeft:"auto",display:"flex",alignItems:"center",gap:6,padding:"6px 14px"}}>
          <HeartIcon filled={wishlist.has(listing.id)}/>{wishlist.has(listing.id)?"Gespeichert":"Merken"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:listing.images.length>1?"1fr 1fr":"1fr",gap:8,borderRadius:20,overflow:"hidden",marginBottom:36,maxHeight:420}}>
        {listing.images.slice(0,2).map((img,i)=>(
          <img key={i} src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover",maxHeight:420}}/>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:52,alignItems:"start"}}>
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,background:C.sand,borderRadius:16,padding:16,marginBottom:28}}>
            {[["👤","Gäste",listing.guests],["🛏","Zimmer",listing.bedrooms],["🛏","Betten",listing.beds],["🚿","Bäder",listing.baths]].map(([i,l,v])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:2}}>{i}</div>
                <div style={{fontFamily:F.serif,fontSize:20,color:C.forest}}>{v}</div>
                <div style={{fontFamily:F.sans,fontSize:11,color:C.inkLt}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{paddingBottom:24,borderBottom:`1px solid ${C.border}`,marginBottom:24}}>
            <h3 style={{fontFamily:F.sans,fontSize:15,fontWeight:700,color:C.forest,marginBottom:10}}>Über diese Unterkunft</h3>
            <p style={{fontFamily:F.sans,color:C.inkMid,lineHeight:1.8,fontSize:14}}>{listing.description}</p>
          </div>
          <div>
            <h3 style={{fontFamily:F.sans,fontSize:15,fontWeight:700,color:C.forest,marginBottom:14}}>Ausstattung</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {listing.amenities.map(a=>(
                <div key={a} style={{display:"flex",alignItems:"center",gap:8,fontFamily:F.sans,fontSize:14,color:C.inkMid}}><CheckIcon/>{a}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{position:"sticky",top:24,border:`1.5px solid ${C.border}`,borderRadius:20,padding:24,boxShadow:"0 8px 32px rgba(28,43,30,0.1)",background:"white"}}>
          <BookingWidget listing={listing} user={user} onBook={onBook} onLoginNeeded={onLoginNeeded}/>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   HOST DASHBOARD
════════════════════════════════════════════ */
function HostDashboard({ user, listings, bookings, onAdd, onUpdate, onDelete, onToggleActive }) {
  const [tab,setTab]=useState("overview");
  const [adding,setAdding]=useState(false);
  const [editing,setEditing]=useState(null);

  const mine  = listings.filter(l=>l.hostId===user.id);
  const mineB = bookings.filter(b=>mine.some(l=>l.id===b.listingId));
  const rev   = mineB.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.total,0);

  const handleSave = f => {
    const imgs=f.images.length>0?f.images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80"];
    const data={...f,price:Number(f.price)||0,originalPrice:f.originalPrice?Number(f.originalPrice):null,guests:Number(f.guests)||4,bedrooms:Number(f.bedrooms)||1,beds:Number(f.beds)||1,baths:Number(f.baths)||1,images:imgs,badge:f.badge||null};
    if(editing){ onUpdate(editing,data); setEditing(null); }
    else       { onAdd({...data,hostId:user.id,id:uid(),rating:0,reviews:0,active:true}); setAdding(false); }
  };

  const editL   = editing?mine.find(l=>l.id===editing):null;
  const editIni = editL?{...editL,price:String(editL.price),originalPrice:editL.originalPrice?String(editL.originalPrice):"",guests:String(editL.guests),bedrooms:String(editL.bedrooms),beds:String(editL.beds),baths:String(editL.baths),badge:editL.badge||""}:null;

  const stats=[
    {l:"Inserate",  v:mine.length,                                   icon:"🏡",color:C.sage},
    {l:"Buchungen", v:mineB.filter(b=>b.status==="confirmed").length, icon:"📅",color:"#6366F1"},
    {l:"Einnahmen", v:`€${rev}`,                                      icon:"💰",color:C.gold},
    {l:"Bewertungen",v:mine.reduce((s,l)=>s+(l.reviews||0),0),       icon:"⭐",color:C.terra},
  ];

  const tabs=[{id:"overview",l:"Übersicht"},{id:"listings",l:`Inserate (${mine.length})`},{id:"bookings",l:`Buchungen (${mineB.length})`}];

  return (
    <div style={{maxWidth:940,margin:"0 auto",padding:"32px 24px 80px"}}>
      <div style={{background:`linear-gradient(135deg,${C.forest},${C.forestLt})`,borderRadius:22,padding:"28px 32px",marginBottom:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:160,height:160,background:`radial-gradient(${C.gold}25,transparent 70%)`,borderRadius:"50%"}}/>
        <div style={{fontFamily:F.sans,fontSize:11,fontWeight:700,letterSpacing:1.2,color:C.sageLt,textTransform:"uppercase",marginBottom:6}}>Gastgeber-Dashboard</div>
        <div style={{fontFamily:F.serif,fontSize:30,color:"white",marginBottom:2,fontStyle:"italic"}}>Hallo, {user.name.split(" ")[0]}!</div>
        <div style={{fontFamily:F.sans,fontSize:13,color:C.sageLt}}>Verwalte deine Inserate, Buchungen und Einnahmen</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:28}}>
        {stats.map(s=>(
          <div key={s.l} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:16,padding:"18px 20px",borderLeft:`4px solid ${s.color}`}}>
            <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:F.serif,fontSize:26,color:C.forest}}>{s.v}</div>
            <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:4,marginBottom:24,background:C.sand,borderRadius:12,padding:4}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"9px",border:"none",borderRadius:9,cursor:"pointer",fontFamily:F.sans,fontSize:13,fontWeight:600,background:tab===t.id?"white":"transparent",color:tab===t.id?C.forest:C.inkLt,boxShadow:tab===t.id?"0 1px 6px rgba(0,0,0,0.08)":"none",transition:"all 0.15s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{background:"white",border:`1px solid ${C.border}`,borderRadius:18,overflow:"hidden"}}>
          <div style={{padding:"16px 22px",borderBottom:`1px solid ${C.border}`,fontFamily:F.sans,fontSize:14,fontWeight:700,color:C.forest}}>Neueste Buchungen</div>
          {mineB.length===0?(
            <div style={{padding:40,textAlign:"center",fontFamily:F.sans,color:C.inkLt}}>Noch keine Buchungen</div>
          ):mineB.slice(-5).reverse().map(b=>{
            const l=listings.find(x=>x.id===b.listingId);
            return (
              <div key={b.id} style={{padding:"14px 22px",borderBottom:`1px solid ${C.sand}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <img src={l?.images[0]} alt="" style={{width:50,height:40,objectFit:"cover",borderRadius:8}}/>
                  <div>
                    <div style={{fontFamily:F.sans,fontSize:13,fontWeight:600,color:C.ink}}>{l?.title}</div>
                    <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{b.guestName} · {b.checkIn} – {b.checkOut}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:F.serif,fontSize:17,color:C.forest}}>€{b.total}</span>
                  <span style={{fontFamily:F.sans,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
                    {b.status==="confirmed"?"✓ Bestätigt":"⏳ Ausstehend"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LISTINGS */}
      {tab==="listings" && (
        <div>
          {(adding||editing) && (
            <div style={{marginBottom:24}}>
              <ListingForm initial={editing?editIni:null} title={editing?"Inserat bearbeiten":"Neues Inserat erstellen"} onSave={handleSave} onCancel={()=>{setAdding(false);setEditing(null);}}/>
            </div>
          )}
          {!adding&&!editing&&(
            <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
              <button onClick={()=>setAdding(true)} style={{...btnPrimary,display:"flex",alignItems:"center",gap:6}}><PlusIcon/> Neues Inserat</button>
            </div>
          )}
          {mine.length===0&&!adding?(
            <div style={{textAlign:"center",padding:60,color:C.inkLt,fontFamily:F.sans}}>
              <div style={{fontSize:40,marginBottom:12}}>🏡</div>
              <div style={{fontFamily:F.serif,fontSize:22,color:C.forest,marginBottom:6}}>Noch keine Inserate</div>
            </div>
          ):(
            <div style={{display:"grid",gap:14}}>
              {mine.map(l=>(
                <div key={l.id} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:16,padding:16,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <img src={l.images[0]} alt="" style={{width:90,height:68,objectFit:"cover",borderRadius:10}}/>
                    <div style={{position:"absolute",top:4,left:4,background:"rgba(0,0,0,0.5)",color:"white",fontSize:10,fontWeight:700,fontFamily:F.sans,padding:"2px 6px",borderRadius:4}}>{l.images.length} Foto{l.images.length!==1?"s":""}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:F.sans,fontSize:14,fontWeight:700,color:C.ink}}>{l.title}</div>
                    <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{l.location} · €{l.price}/Nacht · {l.guests} Gäste</div>
                    <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{l.type} · {l.category}{l.badge?` · ${l.badge}`:""}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontFamily:F.sans,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:l.active?"#D1FAE5":"#F3F4F6",color:l.active?"#065F46":"#888"}}>
                      {l.active?"● Aktiv":"○ Inaktiv"}
                    </span>
                    <button onClick={()=>{setEditing(l.id);setAdding(false);}} style={{...btnOutline,display:"flex",alignItems:"center",gap:5,padding:"7px 14px",fontSize:12}}><EditIcon/> Bearbeiten</button>
                    <button onClick={()=>onToggleActive(l.id)} style={{...btnOutline,fontSize:12,padding:"7px 14px",color:l.active?C.terra:C.sage,borderColor:l.active?"#FECACA":`${C.sage}80`}}>{l.active?"Deaktivieren":"Aktivieren"}</button>
                    <button onClick={()=>{if(window.confirm("Inserat wirklich löschen?"))onDelete(l.id);}} style={{...btnOutline,fontSize:12,padding:"7px 14px",color:C.terra,borderColor:"#FECACA",display:"flex",alignItems:"center",gap:4}}><TrashIcon/> Löschen</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS */}
      {tab==="bookings" && (
        <div style={{display:"grid",gap:12}}>
          {mineB.length===0?(
            <div style={{textAlign:"center",padding:60,fontFamily:F.sans,color:C.inkLt}}>Noch keine Buchungen</div>
          ):mineB.map(b=>{
            const l=listings.find(x=>x.id===b.listingId);
            return (
              <div key={b.id} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:16,padding:18,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <img src={l?.images[0]} alt="" style={{width:64,height:50,objectFit:"cover",borderRadius:10}}/>
                  <div>
                    <div style={{fontFamily:F.sans,fontSize:14,fontWeight:700,color:C.ink}}>{l?.title}</div>
                    <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>Gast: {b.guestName}</div>
                    <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{b.checkIn} → {b.checkOut}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontFamily:F.serif,fontSize:19,color:C.forest}}>€{b.total}</span>
                  <span style={{fontFamily:F.sans,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
                    {b.status==="confirmed"?"✓ Bestätigt":"⏳ Ausstehend"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   GUEST TRIPS
════════════════════════════════════════════ */
function GuestTrips({ user, bookings, listings }) {
  const mine=bookings.filter(b=>b.guestId===user.id);
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 80px"}}>
      <div style={{background:`linear-gradient(135deg,${C.forest},${C.forestLt})`,borderRadius:22,padding:"28px 32px",marginBottom:28}}>
        <div style={{fontFamily:F.sans,fontSize:11,fontWeight:700,letterSpacing:1.2,color:C.sageLt,textTransform:"uppercase",marginBottom:6}}>Meine Reisen</div>
        <div style={{fontFamily:F.serif,fontSize:30,color:"white",fontStyle:"italic"}}>Hallo, {user.name.split(" ")[0]}! ✈️</div>
      </div>
      {mine.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px"}}>
          <div style={{fontSize:48,marginBottom:14}}>🗺️</div>
          <div style={{fontFamily:F.serif,fontSize:24,color:C.forest,marginBottom:6}}>Noch keine Reisen</div>
          <div style={{fontFamily:F.sans,fontSize:14,color:C.inkLt}}>Entdecke Unterkünfte und buche dein nächstes Abenteuer!</div>
        </div>
      ):mine.map(b=>{
        const l=listings.find(x=>x.id===b.listingId);
        return (
          <div key={b.id} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:18,padding:20,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
            <img src={l?.images[0]} alt="" style={{width:110,height:80,objectFit:"cover",borderRadius:12,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.serif,fontSize:20,color:C.forest,marginBottom:3}}>{l?.title}</div>
              <div style={{fontFamily:F.sans,fontSize:13,color:C.inkLt}}>📍 {l?.location}</div>
              <div style={{fontFamily:F.sans,fontSize:13,color:C.inkLt}}>{b.checkIn} – {b.checkOut} · {b.guests} Gast{b.guests>1?"¨e":""}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:F.serif,fontSize:22,color:C.forest,marginBottom:4}}>€{b.total}</div>
              <span style={{fontFamily:F.sans,padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
                {b.status==="confirmed"?"✓ Bestätigt":"⏳ Ausstehend"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════ */
export default function App() {
  const [user,setUser]=useState(null);
  const [showAuth,setShowAuth]=useState(false);
  const [showProf,setShowProf]=useState(false);
  const [view,setView]=useState("browse");
  const [selected,setSelected]=useState(null);
  const [wishlist,setWishlist]=useState(new Set());
  const [search,setSearch]=useState("");
  const [checkIn,setCheckIn]=useState("");
  const [checkOut,setCheckOut]=useState("");
  const [category,setCategory]=useState("Alle");
  const [listings,setListings]=useState(INIT_LISTINGS);
  const [bookings,setBookings]=useState(INIT_BOOKINGS);

  const toggleWish = id=>setWishlist(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const handleLogin  = u =>{ setUser(u); setShowAuth(false); };
  const handleLogout = ()=>{ setUser(null); setView("browse"); setShowProf(false); };
  const handleBook   = b =>setBookings(p=>[...p,{...b,id:uid(),status:"confirmed"}]);
  const handleAdd    = l =>setListings(p=>[...p,l]);
  const handleUpdate = (id,d)=>setListings(p=>p.map(l=>l.id===id?{...l,...d}:l));
  const handleDelete = id=>setListings(p=>p.filter(l=>l.id!==id));
  const handleToggle = id=>setListings(p=>p.map(l=>l.id===id?{...l,active:!l.active}:l));

  const filtered=listings.filter(l=>{
    const ms=search===""||l.title.toLowerCase().includes(search.toLowerCase())||l.location.toLowerCase().includes(search.toLowerCase());
    const mc=category==="Alle"||l.category===category;
    return ms&&mc&&l.active;
  });

  const navBtn=(v,label)=>(
    <button onClick={()=>{setView(v);setSelected(null);}}
      style={{padding:"7px 16px",borderRadius:8,border:`1.5px solid ${view===v?C.sageLt:"rgba(255,255,255,0.2)"}`,background:view===v?"rgba(122,158,126,0.2)":"transparent",cursor:"pointer",fontFamily:F.sans,fontSize:13,fontWeight:600,color:view===v?C.sageLt:"rgba(255,255,255,0.75)",transition:"all 0.15s"}}>
      {label}
    </button>
  );

  return (
    <div style={{minHeight:"100vh",background:C.sand,fontFamily:F.sans}}>
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={handleLogin}/>}

      {/* NAVBAR */}
      <nav style={{background:C.forest,position:"sticky",top:0,zIndex:90,boxShadow:"0 2px 20px rgba(0,0,0,0.35)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",height:62,gap:12,justifyContent:"space-between"}}>
          <button onClick={()=>{setView("browse");setSelected(null);}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,background:`linear-gradient(135deg,${C.gold},${C.goldLt})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.serif,fontSize:16,color:C.forest,fontWeight:700}}>1</div>
            <span style={{fontFamily:F.serif,fontSize:22,color:"white",fontStyle:"italic",letterSpacing:-0.3}}>home</span>
          </button>
          <div style={{display:"flex",gap:4}}>{navBtn("browse","Entdecken")}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {user?.role==="host"  && navBtn("dashboard","Dashboard")}
            {user?.role==="guest" && navBtn("trips","Meine Reisen")}
            {user?(
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowProf(!showProf)}
                  style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:22,padding:"5px 12px 5px 8px",cursor:"pointer"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.goldLt})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.sans,fontSize:11,fontWeight:800,color:C.forest}}>{user.avatar}</div>
                  <span style={{fontFamily:F.sans,fontSize:13,fontWeight:600,color:"white"}}>{user.name.split(" ")[0]}</span>
                </button>
                {showProf && (
                  <div onClick={()=>setShowProf(false)} style={{position:"absolute",right:0,top:"calc(100% + 8px)",background:"white",border:`1px solid ${C.border}`,borderRadius:16,boxShadow:"0 12px 40px rgba(0,0,0,0.15)",minWidth:210,overflow:"hidden",zIndex:200}}>
                    <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontFamily:F.sans,fontSize:13,fontWeight:700,color:C.ink}}>{user.name}</div>
                      <div style={{fontFamily:F.sans,fontSize:12,color:C.inkLt}}>{user.email}</div>
                      <div style={{marginTop:6,display:"inline-block",padding:"2px 10px",borderRadius:12,background:user.role==="host"?`${C.sage}20`:"#EFF6FF",fontFamily:F.sans,fontSize:11,fontWeight:700,color:user.role==="host"?C.forestLt:"#1D4ED8"}}>
                        {user.role==="host"?"🏡 Gastgeber":"🧳 Gast"}
                      </div>
                    </div>
                    <button onClick={handleLogout} style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:F.sans,fontSize:13,fontWeight:600,color:"#DC2626",textAlign:"left"}}>Abmelden</button>
                  </div>
                )}
              </div>
            ):(
              <button onClick={()=>setShowAuth(true)}
                style={{padding:"8px 18px",background:`linear-gradient(135deg,${C.gold},${C.goldLt})`,border:"none",borderRadius:8,color:C.forest,fontFamily:F.sans,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                Anmelden
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* PAGES */}
      {selected?(
        <DetailView listing={selected} user={user} wishlist={wishlist} onWish={toggleWish} onBook={handleBook} onBack={()=>setSelected(null)} onLoginNeeded={()=>setShowAuth(true)}/>
      ):view==="dashboard"&&user?.role==="host"?(
        <HostDashboard user={user} listings={listings} bookings={bookings} onAdd={handleAdd} onUpdate={handleUpdate} onDelete={handleDelete} onToggleActive={handleToggle}/>
      ):view==="trips"&&user?.role==="guest"?(
        <GuestTrips user={user} bookings={bookings} listings={listings}/>
      ):(
        <>
          <Hero search={search} setSearch={setSearch} checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut}/>

          {/* Category bar */}
          <div style={{background:"white",borderBottom:`1px solid ${C.border}`,position:"sticky",top:62,zIndex:80}}>
            <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",gap:6,overflowX:"auto",height:54,alignItems:"center"}}>
              {CATEGORIES.map(cat=>(
                <button key={cat.id} onClick={()=>setCategory(cat.id)}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${category===cat.id?C.forest:C.border}`,background:category===cat.id?C.forest:"white",color:category===cat.id?"white":C.inkLt,fontFamily:F.sans,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0}}>
                  {cat.icon} {cat.label}
                </button>
              ))}
              {wishlist.size>0 && (
                <button onClick={()=>setView(view==="wishlist"?"browse":"wishlist")}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${view==="wishlist"?C.terra:C.border}`,background:view==="wishlist"?C.terra:"white",color:view==="wishlist"?"white":C.inkLt,fontFamily:F.sans,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",marginLeft:"auto",flexShrink:0}}>
                  ♥ Merkliste ({wishlist.size})
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <main style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px 60px"}}>
            {view==="wishlist" && <div style={{fontFamily:F.serif,fontSize:28,color:C.forest,marginBottom:20,fontStyle:"italic"}}>♥ Deine Merkliste</div>}
            {(()=>{
              const show=view==="wishlist"?listings.filter(l=>wishlist.has(l.id)):filtered;
              if(show.length===0) return (
                <div style={{textAlign:"center",padding:"80px 20px"}}>
                  <div style={{fontSize:52,marginBottom:16}}>🔍</div>
                  <div style={{fontFamily:F.serif,fontSize:28,color:C.forest,marginBottom:8}}>Keine Ergebnisse</div>
                  <div style={{fontFamily:F.sans,fontSize:14,color:C.inkLt}}>Versuche andere Suchbegriffe oder Filter</div>
                </div>
              );
              return (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:26}}>
                  {show.map(l=><ListingCard key={l.id} listing={l} onSelect={setSelected} wishlist={wishlist} onWish={toggleWish}/>)}
                </div>
              );
            })()}
          </main>

          {/* Footer */}
          <footer style={{background:C.forest,color:C.sageLt,padding:"32px 24px",textAlign:"center"}}>
            <div style={{fontFamily:F.serif,fontSize:20,color:"white",fontStyle:"italic",marginBottom:6}}>1home</div>
            <div style={{fontFamily:F.sans,fontSize:12}}>© {new Date().getFullYear()} 1home. Alle Rechte vorbehalten.</div>
          </footer>
        </>
      )}
    </div>
  );
}
