import { useState } from "react";

/* ─── Google Font ─── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;1,400&display=swap";
document.head.appendChild(fontLink);

/* ─── MOCK DATA ─── */
const MOCK_USERS = [
  { id: 1, email: "gast@test.de", password: "123", name: "Julia Meier", role: "guest", avatar: "JM" },
  { id: 2, email: "host@test.de", password: "123", name: "Thomas Bauer", role: "host", avatar: "TB" },
];

const initialListings = [
  { id:1, hostId:2, title:"Moderne Stadtwohnung Berlin Mitte", location:"Berlin, Deutschland", type:"Gesamte Wohnung", price:89, originalPrice:120, rating:4.92, reviews:134, guests:4, bedrooms:2, beds:2, baths:1, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"], amenities:["WLAN","Küche","Waschmaschine","Klimaanlage","Aufzug"], description:"Stilvolle Wohnung im Herzen Berlins. Perfekt für Paare oder kleine Familien. Direkte U-Bahn-Anbindung, viele Restaurants und Cafés in der Nähe.", category:"Städte", badge:"Beliebt", active:true },
  { id:2, hostId:2, title:"Gemütliches Chalet in den Alpen", location:"Garmisch, Bayern", type:"Gesamtes Haus", price:215, originalPrice:null, rating:4.98, reviews:89, guests:6, bedrooms:3, beds:4, baths:2, images:["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80"], amenities:["Kamin","WLAN","Bergblick","Parkplatz","Sauna"], description:"Traumhaftes Chalet mit Panoramablick auf die Zugspitze. Perfekt für Ski-Urlaub oder Wanderungen.", category:"Berge", badge:"Top-Bewertet", active:true },
  { id:3, hostId:99, title:"Strandhaus an der Ostsee", location:"Rügen, MV", type:"Gesamtes Haus", price:175, originalPrice:210, rating:4.85, reviews:212, guests:8, bedrooms:4, beds:5, baths:2, images:["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"], amenities:["Strandnah","Terrasse","Grill","Fahrräder","Spülmaschine"], description:"Idyllisches Strandhaus nur 200m vom Meer. Genießt den Sonnenuntergang über der Ostsee.", category:"Strand", badge:"Angebot", active:true },
  { id:4, hostId:99, title:"Luxus-Penthouse HafenCity", location:"Hamburg, Deutschland", type:"Gesamte Wohnung", price:340, originalPrice:null, rating:5.0, reviews:47, guests:4, bedrooms:2, beds:2, baths:2, images:["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"], amenities:["Dachterrasse","Hafenblick","Concierge","Gym","Parkplatz"], description:"Exklusives Penthouse mit 180°-Blick auf den Hamburger Hafen. Hochwertig ausgestattet.", category:"Städte", badge:"Luxus", active:true },
  { id:5, hostId:99, title:"Weinberghaus an der Mosel", location:"Bernkastel-Kues, RLP", type:"Gesamtes Haus", price:128, originalPrice:155, rating:4.91, reviews:163, guests:2, bedrooms:1, beds:1, baths:1, images:["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80","https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"], amenities:["Weinberg","Terrasse","Weinverkostung","WLAN","Parkplatz"], description:"Kleines Schmuckstück inmitten von Weinreben. Perfekt für ein romantisches Wochenende.", category:"Natur", badge:"Romantisch", active:true },
  { id:6, hostId:99, title:"Design-Loft Frankfurt Westend", location:"Frankfurt, Hessen", type:"Gesamte Wohnung", price:145, originalPrice:null, rating:4.77, reviews:95, guests:3, bedrooms:1, beds:2, baths:1, images:["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80","https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"], amenities:["Rooftop","WLAN","Kaffeemaschine","Smart TV","Gym"], description:"Zeitgenössisch designtes Loft nahe der Messe Frankfurt.", category:"Städte", badge:null, active:true },
];

const initialBookings = [
  { id:1, listingId:3, guestId:1, guestName:"Julia Meier", checkIn:"2026-04-10", checkOut:"2026-04-14", guests:3, total:840, status:"confirmed" },
  { id:2, listingId:4, guestId:1, guestName:"Julia Meier", checkIn:"2026-05-01", checkOut:"2026-05-03", guests:2, total:816, status:"pending" },
];

const categories = [
  { id:"Alle", label:"Alle", icon:"🌍" },
  { id:"Städte", label:"Städte", icon:"🏙️" },
  { id:"Strand", label:"Strand", icon:"🏖️" },
  { id:"Berge", label:"Berge", icon:"🏔️" },
  { id:"Natur", label:"Natur", icon:"🌿" },
];

/* ─── DESIGN TOKENS ─── */
const C = {
  navy: "#0A1628",
  navyMid: "#102040",
  navyLight: "#1A3050",
  teal: "#00C9A7",
  tealDark: "#00A88C",
  tealGlow: "rgba(0,201,167,0.15)",
  amber: "#FFB020",
  rose: "#FF4B6E",
  white: "#FFFFFF",
  offWhite: "#F4F6FA",
  gray1: "#E8ECF2",
  gray2: "#C0CADA",
  gray3: "#8899AA",
  text: "#111827",
  textMid: "#374151",
  textLight: "#6B7280",
};

const font = { display: "'Fraunces', Georgia, serif", body: "'Plus Jakarta Sans', sans-serif" };

/* ─── SHARED STYLES ─── */
const inputBase = {
  fontFamily: font.body, fontSize: 14, background: "white",
  border: `1.5px solid ${C.gray1}`, borderRadius: 10, padding: "10px 14px",
  outline: "none", width: "100%", boxSizing: "border-box", color: C.text,
  transition: "border-color 0.2s",
};
const labelBase = { fontFamily: font.body, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, color: C.gray3, textTransform: "uppercase", display: "block", marginBottom: 5 };

const badgeColors = {
  "Beliebt": { bg:"#FFF3CD", color:"#92600A" },
  "Top-Bewertet": { bg:"#D1FAE5", color:"#065F46" },
  "Angebot": { bg:"#FEE2E2", color:"#991B1B" },
  "Luxus": { bg:"#EDE9FE", color:"#5B21B6" },
  "Romantisch": { bg:"#FCE7F3", color:"#9D174D" },
};

/* ─── ICONS ─── */
const StarIcon = ({ size=12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={C.amber}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const HeartIcon = ({ filled }) => <svg width={18} height={18} viewBox="0 0 24 24" fill={filled?C.rose:"none"} stroke={filled?C.rose:"white"} strokeWidth={2.5}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const SearchSvg = () => <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const ArrowLeft = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>;
const CheckIcon = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth={2.5}><polyline points="20 6 9 17 4 12"/></svg>;

/* ─── AUTH MODAL ─── */
function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("guest");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [users, setUsers] = useState([...MOCK_USERS]);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const submit = () => {
    setError("");
    if (mode === "login") {
      const u = users.find(u => u.email===form.email && u.password===form.password);
      if (!u) return setError("E-Mail oder Passwort falsch.");
      onLogin(u);
    } else {
      if (!form.name||!form.email||!form.password) return setError("Bitte alle Felder ausfüllen.");
      if (users.find(u=>u.email===form.email)) return setError("E-Mail bereits registriert.");
      const nu = { id:Date.now(), ...form, role, avatar:form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() };
      setUsers(p=>[...p,nu]);
      onLogin(nu);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(10,22,40,0.75)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:24,width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,0.3)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:C.navy,padding:"24px 28px",position:"relative"}}>
          <button onClick={onClose} style={{position:"absolute",right:16,top:16,background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:"white",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          <div style={{fontFamily:font.display,fontSize:26,color:"white",fontStyle:"italic",marginBottom:2}}>Willkommen</div>
          <div style={{fontFamily:font.body,fontSize:13,color:C.gray2}}>{mode==="login"?"Melde dich in deinem Konto an":"Erstelle dein kostenloses Konto"}</div>
        </div>

        <div style={{padding:28}}>
          {/* Tab toggle */}
          <div style={{display:"flex",background:C.offWhite,borderRadius:10,padding:3,marginBottom:22,gap:3}}>
            {[["login","Anmelden"],["register","Registrieren"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}}
                style={{flex:1,padding:"8px",border:"none",borderRadius:8,cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,background:mode===m?"white":"transparent",color:mode===m?C.navy:C.gray3,boxShadow:mode===m?"0 1px 6px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>
                {l}
              </button>
            ))}
          </div>

          {mode==="register" && (
            <>
              <div style={{marginBottom:18}}>
                <label style={labelBase}>Ich bin ein…</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[{v:"guest",i:"🧳",l:"Gast"},{v:"host",i:"🏠",l:"Gastgeber"}].map(r=>(
                    <button key={r.v} onClick={()=>setRole(r.v)}
                      style={{padding:"16px 10px",border:`2px solid ${role===r.v?C.teal:C.gray1}`,borderRadius:12,background:role===r.v?C.tealGlow:"white",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,color:role===r.v?C.tealDark:C.textLight,transition:"all 0.15s"}}>
                      <div style={{fontSize:24,marginBottom:4}}>{r.i}</div>{r.l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={labelBase}>Vollständiger Name</label>
                <input style={inputBase} placeholder="Max Mustermann" value={form.name} onChange={e=>set("name",e.target.value)}/>
              </div>
            </>
          )}

          <div style={{marginBottom:14}}>
            <label style={labelBase}>E-Mail</label>
            <input style={inputBase} type="email" placeholder="name@email.de" value={form.email} onChange={e=>set("email",e.target.value)}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={labelBase}>Passwort</label>
            <input style={inputBase} type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>

          {error && <div style={{background:"#FFF0F0",border:`1px solid #FFCDD2`,borderRadius:8,padding:"10px 14px",fontSize:13,color:"#C62828",marginBottom:16,fontFamily:font.body}}>{error}</div>}

          {mode==="login" && (
            <div style={{background:C.tealGlow,border:`1px solid ${C.teal}30`,borderRadius:10,padding:"12px 14px",marginBottom:16,fontSize:12,color:C.textMid,lineHeight:1.7,fontFamily:font.body}}>
              <b style={{color:C.tealDark}}>Demo-Zugänge:</b><br/>
              🧳 Gast: <code style={{background:"rgba(0,0,0,0.06)",padding:"1px 5px",borderRadius:4}}>gast@test.de</code> / <code style={{background:"rgba(0,0,0,0.06)",padding:"1px 5px",borderRadius:4}}>123</code><br/>
              🏠 Host: <code style={{background:"rgba(0,0,0,0.06)",padding:"1px 5px",borderRadius:4}}>host@test.de</code> / <code style={{background:"rgba(0,0,0,0.06)",padding:"1px 5px",borderRadius:4}}>123</code>
            </div>
          )}

          <button onClick={submit}
            style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,border:"none",borderRadius:12,color:"white",fontFamily:font.body,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 14px ${C.tealGlow}`}}>
            {mode==="login"?"Jetzt anmelden →":"Konto erstellen →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HERO SEARCH BAR ─── */
function HeroSearch({ search, setSearch, checkIn, setCheckIn, checkOut, setCheckOut }) {
  return (
    <div style={{background:`linear-gradient(160deg,${C.navy} 0%,${C.navyMid} 60%,${C.navyLight} 100%)`,padding:"52px 24px 64px",position:"relative",overflow:"hidden"}}>
      {/* Decorative blobs */}
      <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,background:`radial-gradient(circle,${C.teal}20,transparent 70%)`,borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-60,left:-40,width:220,height:220,background:`radial-gradient(circle,${C.rose}15,transparent 70%)`,borderRadius:"50%",pointerEvents:"none"}}/>

      <div style={{maxWidth:860,margin:"0 auto",position:"relative",zIndex:1}}>
        <div style={{fontFamily:font.display,fontSize:"clamp(28px,5vw,46px)",color:"white",marginBottom:6,lineHeight:1.2}}>
          Dein nächstes <span style={{color:C.teal,fontStyle:"italic"}}>Abenteuer</span> wartet.
        </div>
        <div style={{fontFamily:font.body,fontSize:15,color:C.gray2,marginBottom:32}}>Finde die perfekte Unterkunft — weltweit, sofort buchbar.</div>

        <div style={{background:"white",borderRadius:18,padding:6,display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:2,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          {/* Destination */}
          <div style={{padding:"12px 16px",borderRight:`1px solid ${C.gray1}`}}>
            <div style={{fontFamily:font.body,fontSize:10,fontWeight:700,letterSpacing:1,color:C.gray3,textTransform:"uppercase",marginBottom:4}}>Reiseziel</div>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Wohin geht's?"
              style={{border:"none",outline:"none",fontFamily:font.body,fontSize:14,fontWeight:500,color:C.text,width:"100%",background:"transparent"}}/>
          </div>
          {/* Check-in */}
          <div style={{padding:"12px 16px",borderRight:`1px solid ${C.gray1}`}}>
            <div style={{fontFamily:font.body,fontSize:10,fontWeight:700,letterSpacing:1,color:C.gray3,textTransform:"uppercase",marginBottom:4}}>Check-in</div>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}
              style={{border:"none",outline:"none",fontFamily:font.body,fontSize:14,color:C.text,width:"100%",background:"transparent"}}/>
          </div>
          {/* Checkout */}
          <div style={{padding:"12px 16px"}}>
            <div style={{fontFamily:font.body,fontSize:10,fontWeight:700,letterSpacing:1,color:C.gray3,textTransform:"uppercase",marginBottom:4}}>Checkout</div>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}
              style={{border:"none",outline:"none",fontFamily:font.body,fontSize:14,color:C.text,width:"100%",background:"transparent"}}/>
          </div>
          {/* Button */}
          <div style={{padding:4}}>
            <button style={{height:"100%",padding:"0 24px",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,border:"none",borderRadius:14,color:"white",fontFamily:font.body,fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap",boxShadow:`0 4px 14px ${C.tealGlow}`}}>
              <SearchSvg /> Suchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LISTING CARD ─── */
function ListingCard({ listing, onSelect, wishlist, onWish }) {
  const [imgIdx, setImgIdx] = useState(0);
  const discount = listing.originalPrice ? Math.round((1 - listing.price/listing.originalPrice)*100) : null;
  const bc = listing.badge ? badgeColors[listing.badge] : null;

  return (
    <div onClick={()=>onSelect(listing)}
      style={{cursor:"pointer",borderRadius:16,overflow:"hidden",background:"white",border:`1px solid ${C.gray1}`,transition:"box-shadow 0.2s,transform 0.2s",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.06)";e.currentTarget.style.transform="translateY(0)";}}>

      {/* Image */}
      <div style={{position:"relative",paddingBottom:"65%",background:C.gray1,overflow:"hidden"}}>
        <img src={listing.images[imgIdx]} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}
          onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}/>

        {/* Heart */}
        <button onClick={e=>{e.stopPropagation();onWish(listing.id);}}
          style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(4px)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <HeartIcon filled={wishlist.has(listing.id)}/>
        </button>

        {/* Badge */}
        {bc && <div style={{position:"absolute",top:10,left:10,background:bc.bg,color:bc.color,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,fontFamily:font.body}}>{listing.badge}</div>}

        {/* Discount */}
        {discount && <div style={{position:"absolute",bottom:10,left:10,background:C.rose,color:"white",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:800,fontFamily:font.body}}>−{discount}%</div>}

        {/* Dots */}
        {listing.images.length > 1 && (
          <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>
            {listing.images.map((_,i)=>(
              <div key={i} onClick={e=>{e.stopPropagation();setImgIdx(i);}}
                style={{width:i===imgIdx?16:6,height:6,borderRadius:3,background:"white",opacity:i===imgIdx?1:0.6,transition:"width 0.2s",cursor:"pointer"}}/>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div style={{fontFamily:font.body,fontSize:14,fontWeight:700,color:C.text,flex:1,marginRight:8,lineHeight:1.3}}>{listing.title}</div>
          <div style={{display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
            <StarIcon/><span style={{fontFamily:font.body,fontSize:13,fontWeight:700,color:C.text}}>{listing.rating}</span>
          </div>
        </div>
        <div style={{fontFamily:font.body,fontSize:12,color:C.gray3,marginBottom:10}}>📍 {listing.location} · {listing.type}</div>

        {/* Amenity chips */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          {listing.amenities.slice(0,3).map(a=>(
            <span key={a} style={{fontFamily:font.body,fontSize:11,color:C.textLight,background:C.offWhite,padding:"3px 8px",borderRadius:20,border:`1px solid ${C.gray1}`}}>{a}</span>
          ))}
        </div>

        {/* Price row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.gray1}`}}>
          <div>
            {listing.originalPrice && <span style={{fontFamily:font.body,fontSize:12,color:C.gray2,textDecoration:"line-through",marginRight:6}}>€{listing.originalPrice}</span>}
            <span style={{fontFamily:font.body,fontSize:17,fontWeight:800,color:C.navy}}>€{listing.price}</span>
            <span style={{fontFamily:font.body,fontSize:12,color:C.gray3}}> /Nacht</span>
          </div>
          <div style={{fontFamily:font.body,fontSize:11,color:C.gray3}}>{listing.reviews} Bewertungen</div>
        </div>
      </div>
    </div>
  );
}

/* ─── BOOKING WIDGET ─── */
function BookingWidget({ listing, user, onBook, onLoginNeeded }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [done, setDone] = useState(false);
  const nights = checkIn&&checkOut ? Math.max(0,Math.round((new Date(checkOut)-new Date(checkIn))/86400000)) : 0;
  const subtotal = nights*listing.price;
  const fee = Math.round(subtotal*0.14);

  const handleBook = () => {
    if (!user) return onLoginNeeded();
    if (nights<=0) return;
    onBook({ listingId:listing.id, guestId:user.id, guestName:user.name, checkIn, checkOut, guests, total:subtotal+fee });
    setDone(true);
  };

  if (done) return (
    <div style={{textAlign:"center",padding:"32px 16px"}}>
      <div style={{width:64,height:64,background:C.tealGlow,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:30}}>🎉</div>
      <div style={{fontFamily:font.display,fontSize:22,color:C.navy,marginBottom:6}}>Buchung bestätigt!</div>
      <div style={{fontFamily:font.body,fontSize:13,color:C.gray3}}>Bestätigung wird per E-Mail gesendet.</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:20}}>
        <div>
          {listing.originalPrice && <div style={{fontFamily:font.body,fontSize:12,color:C.gray2,textDecoration:"line-through"}}>€{listing.originalPrice}/Nacht</div>}
          <span style={{fontFamily:font.display,fontSize:28,fontWeight:700,color:C.navy}}>€{listing.price}</span>
          <span style={{fontFamily:font.body,fontSize:13,color:C.gray3}}> /Nacht</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <StarIcon size={14}/><span style={{fontFamily:font.body,fontSize:13,fontWeight:700}}>{listing.rating}</span>
          <span style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>({listing.reviews})</span>
        </div>
      </div>

      <div style={{border:`1.5px solid ${C.gray1}`,borderRadius:12,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:`1px solid ${C.gray1}`}}>
          <div style={{padding:"12px 14px",borderRight:`1px solid ${C.gray1}`}}>
            <div style={labelBase}>Check-in</div>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}
              style={{border:"none",outline:"none",fontFamily:font.body,fontSize:13,color:C.text,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:"12px 14px"}}>
            <div style={labelBase}>Checkout</div>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}
              style={{border:"none",outline:"none",fontFamily:font.body,fontSize:13,color:C.text,width:"100%",background:"transparent"}}/>
          </div>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={labelBase}>Gäste</div>
          <select value={guests} onChange={e=>setGuests(Number(e.target.value))}
            style={{border:"none",outline:"none",fontFamily:font.body,fontSize:13,color:C.text,width:"100%",background:"transparent"}}>
            {Array.from({length:listing.guests},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} Gast{n>1?"¨e":""}</option>)}
          </select>
        </div>
      </div>

      <button onClick={handleBook}
        style={{width:"100%",padding:"15px",background:nights>0?`linear-gradient(135deg,${C.teal},${C.tealDark})`:`linear-gradient(135deg,${C.gray2},${C.gray3})`,border:"none",borderRadius:12,color:"white",fontFamily:font.body,fontSize:15,fontWeight:700,cursor:nights>0?"pointer":"default",boxShadow:nights>0?`0 4px 16px ${C.tealGlow}`:"none",marginBottom:12,transition:"all 0.2s"}}>
        {!user ? "🔐 Anmelden zum Buchen" : nights>0 ? `Jetzt buchen — ${nights} Nacht${nights>1?"¨e":""}` : "Datum auswählen"}
      </button>

      {nights>0&&(
        <div style={{fontFamily:font.body,fontSize:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,color:C.textMid}}>
            <span>€{listing.price} × {nights} Nächte</span><span>€{subtotal}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,color:C.textMid}}>
            <span>Servicegebühr (14%)</span><span>€{fee}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,fontSize:16,color:C.navy,paddingTop:12,borderTop:`2px solid ${C.gray1}`}}>
            <span>Gesamt</span><span>€{subtotal+fee}</span>
          </div>
        </div>
      )}

      <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:6}}>
        {["Kostenlose Stornierung bis 48h vorher","Sofortbestätigung","Sicher bezahlen"].map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:8,fontFamily:font.body,fontSize:12,color:C.textLight}}>
            <CheckIcon/>{t}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── DETAIL VIEW ─── */
function DetailView({ listing, user, wishlist, onWish, onBook, onBack, onLoginNeeded }) {
  return (
    <div style={{maxWidth:1000,margin:"0 auto",padding:"0 24px 80px"}}>
      <button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"20px 0",fontFamily:font.body,fontSize:14,fontWeight:600,color:C.navyMid}}>
        <ArrowLeft/> Zurück zur Übersicht
      </button>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,borderRadius:20,overflow:"hidden",marginBottom:32,height:400}}>
        <img src={listing.images[0]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        {listing.images[1] && <img src={listing.images[1]} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:52,alignItems:"start"}}>
        <div>
          {listing.badge && (() => { const bc=badgeColors[listing.badge]; return <span style={{fontFamily:font.body,fontSize:12,fontWeight:700,background:bc.bg,color:bc.color,padding:"4px 12px",borderRadius:20,marginBottom:12,display:"inline-block"}}>{listing.badge}</span>;})()}
          <h1 style={{fontFamily:font.display,fontSize:32,color:C.navy,marginBottom:8,lineHeight:1.2}}>{listing.title}</h1>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><StarIcon size={14}/><span style={{fontFamily:font.body,fontSize:14,fontWeight:700}}>{listing.rating}</span></div>
            <span style={{color:C.gray2}}>·</span>
            <span style={{fontFamily:font.body,fontSize:14,color:C.textLight}}>{listing.reviews} Bewertungen</span>
            <span style={{color:C.gray2}}>·</span>
            <span style={{fontFamily:font.body,fontSize:14,color:C.textLight}}>📍 {listing.location}</span>
            <button onClick={()=>onWish(listing.id)} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:"none",border:`1.5px solid ${C.gray1}`,borderRadius:20,padding:"6px 14px",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600}}>
              <HeartIcon filled={wishlist.has(listing.id)}/>{wishlist.has(listing.id)?"Gespeichert":"Merken"}
            </button>
          </div>

          {/* Stats bar */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,background:C.offWhite,borderRadius:14,padding:16,marginBottom:28}}>
            {[["Gäste",listing.guests,"👤"],["Zimmer",listing.bedrooms,"🛏"],["Betten",listing.beds,"🛏"],["Bäder",listing.baths,"🚿"]].map(([l,v,i])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:2}}>{i}</div>
                <div style={{fontFamily:font.body,fontSize:16,fontWeight:700,color:C.navy}}>{v}</div>
                <div style={{fontFamily:font.body,fontSize:11,color:C.gray3}}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{paddingBottom:24,borderBottom:`1px solid ${C.gray1}`,marginBottom:24}}>
            <h3 style={{fontFamily:font.body,fontSize:15,fontWeight:700,color:C.navy,marginBottom:10}}>Über diese Unterkunft</h3>
            <p style={{fontFamily:font.body,color:C.textMid,lineHeight:1.8,fontSize:14}}>{listing.description}</p>
          </div>

          <div>
            <h3 style={{fontFamily:font.body,fontSize:15,fontWeight:700,color:C.navy,marginBottom:14}}>Ausstattung</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {listing.amenities.map(a=>(
                <div key={a} style={{display:"flex",alignItems:"center",gap:8,fontFamily:font.body,fontSize:14,color:C.textMid}}>
                  <CheckIcon/>{a}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{position:"sticky",top:24,border:`1.5px solid ${C.gray1}`,borderRadius:20,padding:24,boxShadow:"0 8px 32px rgba(0,0,0,0.09)"}}>
          <BookingWidget listing={listing} user={user} onBook={onBook} onLoginNeeded={onLoginNeeded}/>
        </div>
      </div>
    </div>
  );
}

/* ─── HOST DASHBOARD ─── */
function HostDashboard({ user, listings, bookings, onAddListing, onToggleActive }) {
  const [tab, setTab] = useState("overview");
  const mine = listings.filter(l=>l.hostId===user.id);
  const mineBookings = bookings.filter(b=>mine.some(l=>l.id===b.listingId));
  const revenue = mineBookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.total,0);
  const [showForm,setShowForm] = useState(false);
  const [nl,setNl] = useState({title:"",location:"",type:"Gesamte Wohnung",price:"",guests:"",bedrooms:"",beds:"",baths:"",description:"",category:"Städte"});
  const snl = (k,v)=>setNl(p=>({...p,[k]:v}));

  const addListing = () => {
    if (!nl.title||!nl.location||!nl.price) return;
    onAddListing({...nl,price:Number(nl.price),guests:Number(nl.guests)||4,bedrooms:Number(nl.bedrooms)||1,beds:Number(nl.beds)||1,baths:Number(nl.baths)||1,hostId:user.id,id:Date.now(),rating:0,reviews:0,images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"],amenities:["WLAN"],badge:null,originalPrice:null,active:true});
    setShowForm(false);
    setNl({title:"",location:"",type:"Gesamte Wohnung",price:"",guests:"",bedrooms:"",beds:"",baths:"",description:"",category:"Städte"});
  };

  const stats = [
    {label:"Inserate",value:mine.length,icon:"🏠",color:C.teal},
    {label:"Buchungen",value:mineBookings.filter(b=>b.status==="confirmed").length,icon:"📅",color:"#6366F1"},
    {label:"Einnahmen",value:`€${revenue}`,icon:"💰",color:C.amber},
    {label:"Bewertungen",value:mine.reduce((s,l)=>s+l.reviews,0),icon:"⭐",color:C.rose},
  ];

  const tabs = [{id:"overview",l:"Übersicht"},{id:"listings",l:`Inserate (${mine.length})`},{id:"bookings",l:`Buchungen (${mineBookings.length})`}];

  return (
    <div style={{maxWidth:920,margin:"0 auto",padding:"32px 24px 80px"}}>
      {/* Page header */}
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:20,padding:"28px 32px",marginBottom:28,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,background:`radial-gradient(${C.teal}30,transparent 70%)`,borderRadius:"50%"}}/>
        <div style={{fontFamily:font.body,fontSize:13,color:C.teal,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Gastgeber-Dashboard</div>
        <div style={{fontFamily:font.display,fontSize:28,color:"white",marginBottom:2}}>Hallo, {user.name.split(" ")[0]}! 👋</div>
        <div style={{fontFamily:font.body,fontSize:13,color:C.gray2}}>Verwalte deine Inserate und Buchungen</div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
        {stats.map(s=>(
          <div key={s.label} style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:16,padding:"18px 20px",borderLeft:`4px solid ${s.color}`}}>
            <div style={{fontSize:26,marginBottom:6}}>{s.icon}</div>
            <div style={{fontFamily:font.display,fontSize:26,color:C.navy,marginBottom:2}}>{s.value}</div>
            <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:24,background:C.offWhite,borderRadius:12,padding:4}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"9px",border:"none",borderRadius:9,cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,background:tab===t.id?"white":"transparent",color:tab===t.id?C.navy:C.gray3,boxShadow:tab===t.id?"0 1px 6px rgba(0,0,0,0.08)":"none",transition:"all 0.15s"}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab==="overview" && (
        <div style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.gray1}`,fontFamily:font.body,fontSize:14,fontWeight:700,color:C.navy}}>Neueste Buchungen</div>
          {mineBookings.length===0 ? (
            <div style={{padding:40,textAlign:"center",fontFamily:font.body,color:C.gray3}}>Noch keine Buchungen</div>
          ) : mineBookings.slice(-4).reverse().map(b=>{
            const l = listings.find(l=>l.id===b.listingId);
            return (
              <div key={b.id} style={{padding:"14px 20px",borderBottom:`1px solid ${C.offWhite}`,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <img src={l?.images[0]} alt="" style={{width:48,height:38,objectFit:"cover",borderRadius:8}}/>
                  <div>
                    <div style={{fontFamily:font.body,fontSize:13,fontWeight:600,color:C.text}}>{l?.title}</div>
                    <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>{b.guestName} · {b.checkIn} – {b.checkOut}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:font.body,fontSize:14,fontWeight:700,color:C.navy}}>€{b.total}</span>
                  <span style={{fontFamily:font.body,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
                    {b.status==="confirmed"?"✓ Bestätigt":"⏳ Ausstehend"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Listings */}
      {tab==="listings" && (
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <button onClick={()=>setShowForm(!showForm)}
              style={{padding:"10px 20px",background:showForm?"white":`linear-gradient(135deg,${C.teal},${C.tealDark})`,border:showForm?`1.5px solid ${C.gray1}`:"none",borderRadius:10,color:showForm?C.navy:"white",fontFamily:font.body,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              {showForm?"✕ Abbrechen":"+ Neues Inserat"}
            </button>
          </div>
          {showForm && (
            <div style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:16,padding:24,marginBottom:20}}>
              <div style={{fontFamily:font.body,fontSize:15,fontWeight:700,color:C.navy,marginBottom:18}}>Neues Inserat</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {[["title","Titel"],["location","Standort"]].map(([k,l])=>(
                  <div key={k}><label style={labelBase}>{l}</label><input style={inputBase} value={nl[k]} onChange={e=>snl(k,e.target.value)} placeholder={l}/></div>
                ))}
                <div><label style={labelBase}>Preis / Nacht (€)</label><input style={inputBase} type="number" value={nl.price} onChange={e=>snl("price",e.target.value)} placeholder="89"/></div>
                <div><label style={labelBase}>Typ</label>
                  <select style={inputBase} value={nl.type} onChange={e=>snl("type",e.target.value)}>
                    {["Gesamte Wohnung","Gesamtes Haus","Privates Zimmer"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                {[["guests","Max. Gäste"],["bedrooms","Schlafzimmer"],["beds","Betten"],["baths","Bäder"]].map(([k,l])=>(
                  <div key={k}><label style={labelBase}>{l}</label><input style={inputBase} type="number" value={nl[k]} onChange={e=>snl(k,e.target.value)} placeholder="1"/></div>
                ))}
              </div>
              <div style={{marginBottom:14}}><label style={labelBase}>Beschreibung</label><textarea style={{...inputBase,minHeight:80,resize:"vertical"}} value={nl.description} onChange={e=>snl("description",e.target.value)} placeholder="Beschreibe deine Unterkunft..."/></div>
              <div style={{marginBottom:18}}><label style={labelBase}>Kategorie</label>
                <select style={inputBase} value={nl.category} onChange={e=>snl("category",e.target.value)}>
                  {["Städte","Strand","Berge","Natur"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={addListing} style={{width:"100%",padding:"13px",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,border:"none",borderRadius:10,color:"white",fontFamily:font.body,fontSize:14,fontWeight:700,cursor:"pointer"}}>Inserat veröffentlichen</button>
            </div>
          )}
          {mine.length===0 ? (
            <div style={{textAlign:"center",padding:60,color:C.gray3,fontFamily:font.body}}>
              <div style={{fontSize:40,marginBottom:12}}>🏠</div>Noch keine Inserate
            </div>
          ) : (
            <div style={{display:"grid",gap:12}}>
              {mine.map(l=>(
                <div key={l.id} style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:14,padding:16,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                  <img src={l.images[0]} alt="" style={{width:80,height:60,objectFit:"cover",borderRadius:10,flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:font.body,fontSize:14,fontWeight:700,color:C.text}}>{l.title}</div>
                    <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>{l.location} · €{l.price}/Nacht · {l.guests} Gäste</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:font.body,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:l.active?"#D1FAE5":"#F3F4F6",color:l.active?"#065F46":"#888"}}>
                      {l.active?"Aktiv":"Inaktiv"}
                    </span>
                    <button onClick={()=>onToggleActive(l.id)}
                      style={{padding:"6px 14px",border:`1.5px solid ${C.gray1}`,borderRadius:8,background:"white",fontFamily:font.body,fontSize:12,fontWeight:600,cursor:"pointer",color:C.textMid}}>
                      {l.active?"Deaktivieren":"Aktivieren"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bookings */}
      {tab==="bookings" && (
        <div style={{display:"grid",gap:12}}>
          {mineBookings.length===0 ? (
            <div style={{textAlign:"center",padding:60,color:C.gray3,fontFamily:font.body}}>Noch keine Buchungen</div>
          ) : mineBookings.map(b=>{
            const l=listings.find(x=>x.id===b.listingId);
            return (
              <div key={b.id} style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:14,padding:18,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <img src={l?.images[0]} alt="" style={{width:64,height:50,objectFit:"cover",borderRadius:10}}/>
                  <div>
                    <div style={{fontFamily:font.body,fontSize:14,fontWeight:700,color:C.text}}>{l?.title}</div>
                    <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>Gast: {b.guestName}</div>
                    <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>{b.checkIn} → {b.checkOut}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontFamily:font.display,fontSize:18,color:C.navy}}>€{b.total}</span>
                  <span style={{fontFamily:font.body,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
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

/* ─── GUEST TRIPS ─── */
function GuestTrips({ user, bookings, listings }) {
  const mine = bookings.filter(b=>b.guestId===user.id);
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"32px 24px 80px"}}>
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:20,padding:"28px 32px",marginBottom:28}}>
        <div style={{fontFamily:font.body,fontSize:13,color:C.teal,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Meine Reisen</div>
        <div style={{fontFamily:font.display,fontSize:28,color:"white"}}>Hallo, {user.name.split(" ")[0]}! ✈️</div>
      </div>
      {mine.length===0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",color:C.gray3,fontFamily:font.body}}>
          <div style={{fontSize:48,marginBottom:14}}>🗺️</div>
          <div style={{fontFamily:font.display,fontSize:22,color:C.navy,marginBottom:6}}>Noch keine Reisen</div>
          <div style={{fontSize:14}}>Erkunde Unterkünfte und buche dein nächstes Abenteuer!</div>
        </div>
      ) : (
        <div style={{display:"grid",gap:14}}>
          {mine.map(b=>{
            const l=listings.find(x=>x.id===b.listingId);
            return (
              <div key={b.id} style={{background:"white",border:`1px solid ${C.gray1}`,borderRadius:16,padding:18,display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
                <img src={l?.images[0]} alt="" style={{width:100,height:76,objectFit:"cover",borderRadius:12,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontFamily:font.display,fontSize:18,color:C.navy,marginBottom:3}}>{l?.title}</div>
                  <div style={{fontFamily:font.body,fontSize:13,color:C.gray3}}>📍 {l?.location}</div>
                  <div style={{fontFamily:font.body,fontSize:13,color:C.gray3}}>{b.checkIn} – {b.checkOut} · {b.guests} Gast{b.guests>1?"¨e":""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:font.display,fontSize:20,color:C.navy,marginBottom:4}}>€{b.total}</div>
                  <span style={{fontFamily:font.body,padding:"3px 12px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:b.status==="confirmed"?"#065F46":"#92600A"}}>
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

/* ─── MAIN APP ─── */
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("browse");
  const [selected, setSelected] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [search, setSearch] = useState("");
  const [heroCheckIn, setHeroCheckIn] = useState("");
  const [heroCheckOut, setHeroCheckOut] = useState("");
  const [category, setCategory] = useState("Alle");
  const [listings, setListings] = useState(initialListings);
  const [bookings, setBookings] = useState(initialBookings);

  const toggleWish = id => setWishlist(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const handleLogin = u => { setUser(u); setShowAuth(false); };
  const handleLogout = () => { setUser(null); setView("browse"); setShowProfile(false); };
  const handleBook = b => setBookings(p=>[...p,{...b,id:Date.now(),status:"confirmed"}]);

  const filtered = listings.filter(l=>{
    const ms = search===""||l.title.toLowerCase().includes(search.toLowerCase())||l.location.toLowerCase().includes(search.toLowerCase());
    const mc = category==="Alle"||l.category===category;
    return ms&&mc&&l.active;
  });

  return (
    <div style={{minHeight:"100vh",background:C.offWhite,fontFamily:font.body}}>
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={handleLogin}/>}

      {/* ── NAVBAR ── */}
      <nav style={{background:C.navy,position:"sticky",top:0,zIndex:90,boxShadow:"0 2px 20px rgba(0,0,0,0.3)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",height:60,gap:12,justifyContent:"space-between"}}>
          <button onClick={()=>{setView("browse");setSelected(null);}}
            style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <span style={{fontSize:22}}>🏠</span>
            <span style={{fontFamily:font.display,fontSize:20,color:"white",fontStyle:"italic",letterSpacing:-0.5}}>staywise</span>
          </button>

          {/* Nav links */}
          <div style={{display:"flex",gap:4}}>
            {[["browse","Entdecken"],["map","Karte"]].map(([v,l])=>(
              <button key={v} onClick={()=>{setView(v);setSelected(null);}}
                style={{background:view===v?"rgba(0,201,167,0.15)":"none",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,color:view===v?C.teal:"rgba(255,255,255,0.65)",transition:"all 0.15s"}}>
                {l}
              </button>
            ))}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {user?.role==="host" && (
              <button onClick={()=>{setView("dashboard");setSelected(null);}}
                style={{padding:"7px 16px",borderRadius:8,border:`1.5px solid ${view==="dashboard"?C.teal:"rgba(255,255,255,0.2)"}`,background:view==="dashboard"?C.tealGlow:"transparent",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,color:view==="dashboard"?C.teal:"rgba(255,255,255,0.8)"}}>
                Dashboard
              </button>
            )}
            {user?.role==="guest" && (
              <button onClick={()=>{setView("trips");setSelected(null);}}
                style={{padding:"7px 16px",borderRadius:8,border:`1.5px solid ${view==="trips"?C.teal:"rgba(255,255,255,0.2)"}`,background:view==="trips"?C.tealGlow:"transparent",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,color:view==="trips"?C.teal:"rgba(255,255,255,0.8)"}}>
                Meine Reisen
              </button>
            )}

            {user ? (
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowProfile(!showProfile)}
                  style={{display:"flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",border:`1px solid rgba(255,255,255,0.15)`,borderRadius:22,padding:"5px 12px 5px 8px",cursor:"pointer"}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:font.body,fontSize:11,fontWeight:800,color:"white"}}>{user.avatar}</div>
                  <span style={{fontFamily:font.body,fontSize:13,fontWeight:600,color:"white"}}>{user.name.split(" ")[0]}</span>
                </button>
                {showProfile && (
                  <div onClick={()=>setShowProfile(false)} style={{position:"absolute",right:0,top:"calc(100% + 8px)",background:"white",border:`1px solid ${C.gray1}`,borderRadius:16,boxShadow:"0 12px 40px rgba(0,0,0,0.15)",minWidth:210,overflow:"hidden",zIndex:200}}>
                    <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.gray1}`}}>
                      <div style={{fontFamily:font.body,fontSize:13,fontWeight:700,color:C.text}}>{user.name}</div>
                      <div style={{fontFamily:font.body,fontSize:12,color:C.gray3}}>{user.email}</div>
                      <div style={{marginTop:6,display:"inline-block",padding:"2px 10px",borderRadius:12,background:user.role==="host"?C.tealGlow:"#EFF6FF",fontFamily:font.body,fontSize:11,fontWeight:700,color:user.role==="host"?C.tealDark:"#1D4ED8"}}>
                        {user.role==="host"?"🏠 Gastgeber":"🧳 Gast"}
                      </div>
                    </div>
                    <button onClick={handleLogout}
                      style={{width:"100%",padding:"12px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:font.body,fontSize:13,fontWeight:600,color:"#DC2626",textAlign:"left"}}>
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={()=>setShowAuth(true)}
                style={{padding:"8px 18px",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,border:"none",borderRadius:8,color:"white",fontFamily:font.body,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:`0 2px 10px ${C.tealGlow}`}}>
                Anmelden
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      {selected ? (
        <DetailView listing={selected} user={user} wishlist={wishlist} onWish={toggleWish}
          onBook={handleBook} onBack={()=>setSelected(null)} onLoginNeeded={()=>setShowAuth(true)}/>
      ) : view==="dashboard" && user?.role==="host" ? (
        <HostDashboard user={user} listings={listings} bookings={bookings}
          onAddListing={l=>setListings(p=>[...p,l])} onToggleActive={id=>setListings(p=>p.map(l=>l.id===id?{...l,active:!l.active}:l))}/>
      ) : view==="trips" && user?.role==="guest" ? (
        <GuestTrips user={user} bookings={bookings} listings={listings}/>
      ) : (
        <>
          {/* Hero */}
          <HeroSearch search={search} setSearch={setSearch} checkIn={heroCheckIn} setCheckIn={setHeroCheckIn} checkOut={heroCheckOut} setCheckOut={setHeroCheckOut}/>

          {/* Category bar */}
          <div style={{background:"white",borderBottom:`1px solid ${C.gray1}`,position:"sticky",top:60,zIndex:80}}>
            <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",gap:4,overflowX:"auto",height:52,alignItems:"center"}}>
              {categories.map(cat=>(
                <button key={cat.id} onClick={()=>setCategory(cat.id)}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${category===cat.id?C.teal:C.gray1}`,background:category===cat.id?C.tealGlow:"white",color:category===cat.id?C.tealDark:C.textLight,fontFamily:font.body,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0}}>
                  <span>{cat.icon}</span>{cat.label}
                </button>
              ))}
              {wishlist.size>0 && (
                <button onClick={()=>setView(view==="wishlist"?"browse":"wishlist")}
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 16px",borderRadius:20,border:`1.5px solid ${view==="wishlist"?C.rose:C.gray1}`,background:view==="wishlist"?"#FFF0F3":"white",color:view==="wishlist"?C.rose:C.textLight,fontFamily:font.body,fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",marginLeft:"auto",flexShrink:0}}>
                  ♥ Merkliste ({wishlist.size})
                </button>
              )}
            </div>
          </div>

          {/* Listings grid */}
          <main style={{maxWidth:1200,margin:"0 auto",padding:"28px 24px 60px"}}>
            {view==="wishlist" && <div style={{fontFamily:font.display,fontSize:26,color:C.navy,marginBottom:20}}>♥ Deine Merkliste</div>}
            {(() => {
              const show = view==="wishlist" ? listings.filter(l=>wishlist.has(l.id)) : filtered;
              if (show.length===0) return (
                <div style={{textAlign:"center",padding:"80px 20px"}}>
                  <div style={{fontSize:52,marginBottom:16}}>🔍</div>
                  <div style={{fontFamily:font.display,fontSize:26,color:C.navy,marginBottom:8}}>Keine Ergebnisse</div>
                  <div style={{fontFamily:font.body,fontSize:14,color:C.gray3}}>Versuche andere Suchbegriffe oder Filter</div>
                </div>
              );
              return (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:24}}>
                  {show.map(l=><ListingCard key={l.id} listing={l} onSelect={setSelected} wishlist={wishlist} onWish={toggleWish}/>)}
                </div>
              );
            })()}
          </main>
        </>
      )}
    </div>
  );
}
