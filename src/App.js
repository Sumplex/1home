import { useState } from "react";

const MOCK_USERS = [
  { id: 1, email: "gast@test.de", password: "123", name: "Julia Meier", role: "guest", avatar: "JM" },
  { id: 2, email: "host@test.de", password: "123", name: "Thomas Bauer", role: "host", avatar: "TB" },
];

const initialListings = [
  { id: 1, hostId: 2, title: "Moderne Stadtwohnung Berlin Mitte", location: "Berlin, Deutschland", type: "Gesamte Wohnung", price: 89, rating: 4.92, reviews: 134, guests: 4, bedrooms: 2, beds: 2, baths: 1, images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"], amenities: ["WLAN","Küche","Waschmaschine","Klimaanlage","Aufzug"], description: "Stilvolle Wohnung im Herzen Berlins. Perfekt für Paare oder kleine Familien.", category: "Städte", tag: "Gäste-Liebling", active: true },
  { id: 2, hostId: 2, title: "Gemütliches Chalet in den Alpen", location: "Garmisch-Partenkirchen, Bayern", type: "Gesamtes Haus", price: 215, rating: 4.98, reviews: 89, guests: 6, bedrooms: 3, beds: 4, baths: 2, images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80","https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80"], amenities: ["Kamin","WLAN","Bergblick","Parkplatz","Sauna"], description: "Traumhaftes Chalet mit Panoramablick auf die Zugspitze.", category: "Berge", tag: null, active: true },
  { id: 3, hostId: 99, title: "Strandhaus an der Ostsee", location: "Rügen, Mecklenburg-Vorpommern", type: "Gesamtes Haus", price: 175, rating: 4.85, reviews: 212, guests: 8, bedrooms: 4, beds: 5, baths: 2, images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80","https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"], amenities: ["Strandnah","Terrasse","Grill","Fahrräder","Spülmaschine"], description: "Idyllisches Strandhaus nur 200m vom Meer.", category: "Strand", tag: "Gäste-Liebling", active: true },
  { id: 4, hostId: 99, title: "Luxus-Penthouse Hamburg HafenCity", location: "Hamburg, Deutschland", type: "Gesamte Wohnung", price: 340, rating: 5.0, reviews: 47, guests: 4, bedrooms: 2, beds: 2, baths: 2, images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"], amenities: ["Dachterrasse","Hafenblick","Concierge","Gym","Parkplatz"], description: "Exklusives Penthouse mit 180°-Blick auf den Hamburger Hafen.", category: "Städte", tag: "Luxus", active: true },
  { id: 5, hostId: 99, title: "Romantisches Weinberghaus Mosel", location: "Bernkastel-Kues, Rheinland-Pfalz", type: "Gesamtes Haus", price: 128, rating: 4.91, reviews: 163, guests: 2, bedrooms: 1, beds: 1, baths: 1, images: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80","https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"], amenities: ["Weinberg","Terrasse","Weinverkostung","WLAN","Parkplatz"], description: "Kleines Schmuckstück inmitten von Weinreben.", category: "Natur", tag: null, active: true },
];

const initialBookings = [
  { id: 1, listingId: 3, guestId: 1, guestName: "Julia Meier", checkIn: "2026-04-10", checkOut: "2026-04-14", guests: 3, total: 840, status: "confirmed" },
  { id: 2, listingId: 4, guestId: 1, guestName: "Julia Meier", checkIn: "2026-05-01", checkOut: "2026-05-03", guests: 2, total: 816, status: "pending" },
];

const categories = ["Alle", "Städte", "Strand", "Berge", "Natur"];

const s = {
  btn: (variant = "primary", size = "md") => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    padding: size === "sm" ? "6px 14px" : size === "lg" ? "14px 28px" : "10px 20px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    fontWeight: 600, borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
    border: variant === "outline" ? "1px solid #DDDDDD" : "none",
    background: variant === "primary" ? "linear-gradient(135deg,#E61E4D,#D70466)" : variant === "outline" ? "white" : variant === "ghost" ? "transparent" : "#f5f5f5",
    color: variant === "primary" ? "white" : "#222",
    boxShadow: variant === "primary" ? "0 2px 8px rgba(230,30,77,0.3)" : "none",
  }),
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #E0E0E0", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border 0.15s", fontFamily: "inherit" },
  card: { background: "white", borderRadius: 16, border: "1px solid #EBEBEB", overflow: "hidden" },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6, letterSpacing: 0.3 },
};

const StarFill = ({ size = 12 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const HeartIcon = ({ filled }) => <svg width={18} height={18} viewBox="0 0 24 24" fill={filled?"#FF385C":"none"} stroke={filled?"#FF385C":"white"} strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("guest");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [regUsers, setRegUsers] = useState([...MOCK_USERS]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    setError("");
    if (mode === "login") {
      const user = regUsers.find(u => u.email === form.email && u.password === form.password);
      if (!user) return setError("E-Mail oder Passwort falsch.");
      onLogin(user);
    } else {
      if (!form.name || !form.email || !form.password) return setError("Bitte alle Felder ausfüllen.");
      if (form.password.length < 3) return setError("Passwort zu kurz (min. 3 Zeichen).");
      if (regUsers.find(u => u.email === form.email)) return setError("E-Mail bereits registriert.");
      const newUser = { id: Date.now(), email: form.email, password: form.password, name: form.name, role, avatar: form.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() };
      setRegUsers(p => [...p, newUser]);
      onLogin(newUser);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #EBEBEB" }}>
          <button onClick={onClose} style={{ ...s.btn("ghost","sm"), padding: 6, borderRadius: "50%" }}>✕</button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{mode === "login" ? "Anmelden" : "Registrieren"}</span>
          <div style={{ width: 32 }} />
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ marginBottom: 24, background: "#F7F7F7", borderRadius: 10, padding: 4, display: "flex" }}>
            {["login","register"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, background: mode === m ? "white" : "transparent", color: mode === m ? "#222" : "#888", boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {m === "login" ? "Anmelden" : "Registrieren"}
              </button>
            ))}
          </div>
          {mode === "register" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={s.label}>Ich bin ein…</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[{val:"guest",icon:"🧳",label:"Gast"},{val:"host",icon:"🏠",label:"Gastgeber"}].map(r => (
                    <button key={r.val} onClick={() => setRole(r.val)}
                      style={{ padding: "14px 10px", border: `2px solid ${role===r.val?"#FF385C":"#E0E0E0"}`, borderRadius: 10, background: role===r.val?"#FFF0F3":"white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: role===r.val?"#FF385C":"#555" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{r.icon}</div>{r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={s.label}>Vollständiger Name</label>
                <input style={s.input} placeholder="Max Mustermann" value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
            </>
          )}
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>E-Mail</label>
            <input style={s.input} type="email" placeholder="name@email.de" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={s.label}>Passwort</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key==="Enter"&&handleSubmit()} />
          </div>
          {error && <div style={{ background: "#FFF0F0", border: "1px solid #FFD0D0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#CC0000", marginBottom: 16 }}>{error}</div>}
          {mode === "login" && (
            <div style={{ background: "#F0F7FF", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
              <b>Demo-Accounts:</b><br/>🧳 Gast: gast@test.de / 123<br/>🏠 Host: host@test.de / 123
            </div>
          )}
          <button onClick={handleSubmit} style={{ ...s.btn("primary","lg"), width: "100%" }}>
            {mode === "login" ? "Anmelden" : "Konto erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Carousel({ images }) {
  const [i, setI] = useState(0);
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom: "66%", background: "#f0f0f0", borderRadius: 12, overflow: "hidden" }}>
      <img src={images[i]} alt="" style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} />
      {images.length > 1 && <>
        <button onClick={e=>{e.stopPropagation();setI((i-1+images.length)%images.length);}} style={{ position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"white",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,opacity:i===0?0.4:1 }}>‹</button>
        <button onClick={e=>{e.stopPropagation();setI((i+1)%images.length);}} style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"white",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",fontSize:14,opacity:i===images.length-1?0.4:1 }}>›</button>
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4}}>
          {images.map((_,j)=><div key={j} style={{width:5,height:5,borderRadius:"50%",background:j===i?"white":"rgba(255,255,255,0.5)"}}/>)}
        </div>
      </>}
    </div>
  );
}

function ListingCard({ listing, onSelect, wishlist, onToggleWish }) {
  return (
    <div onClick={() => onSelect(listing)} style={{ cursor: "pointer" }}>
      <div style={{ position: "relative" }}>
        <Carousel images={listing.images} />
        <button onClick={e=>{e.stopPropagation();onToggleWish(listing.id);}} style={{position:"absolute",top:10,right:10,background:"none",border:"none",cursor:"pointer",filter:"drop-shadow(0 1px 2px rgba(0,0,0,0.4))"}}>
          <HeartIcon filled={wishlist.has(listing.id)} />
        </button>
        {listing.tag && <div style={{position:"absolute",top:10,left:10,background:"white",borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700,color:"#222"}}>{listing.tag}</div>}
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div style={{ fontSize:14,fontWeight:600,color:"#222",flex:1,marginRight:6 }}>{listing.location}</div>
          <div style={{ display:"flex",alignItems:"center",gap:3,fontSize:13,flexShrink:0 }}><StarFill />{listing.rating}</div>
        </div>
        <div style={{ fontSize:13,color:"#717171",marginTop:2 }}>{listing.type}</div>
        <div style={{ fontSize:13,color:"#717171" }}>{listing.reviews} Bewertungen</div>
        <div style={{ marginTop:6,fontSize:14 }}><b>€{listing.price}</b><span style={{color:"#717171"}}> / Nacht</span></div>
      </div>
    </div>
  );
}

function BookingWidget({ listing, user, onBook, onLoginNeeded }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [done, setDone] = useState(false);
  const nights = checkIn && checkOut ? Math.max(0, Math.round((new Date(checkOut)-new Date(checkIn))/86400000)) : 0;
  const subtotal = nights * listing.price;
  const fee = Math.round(subtotal * 0.14);

  const handleBook = () => {
    if (!user) return onLoginNeeded();
    if (nights <= 0) return;
    onBook({ listingId: listing.id, guestId: user.id, guestName: user.name, checkIn, checkOut, guests, total: subtotal + fee });
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding: 24 }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🎉</div>
      <div style={{ fontSize:17,fontWeight:700,color:"#222",marginBottom:6 }}>Buchung bestätigt!</div>
      <div style={{ fontSize:13,color:"#717171" }}>Bestätigung wird per E-Mail gesendet.</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:18}}>
        <div><span style={{fontSize:22,fontWeight:700}}>€{listing.price}</span><span style={{color:"#717171",fontSize:14}}> / Nacht</span></div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:13}}><StarFill /><b>{listing.rating}</b><span style={{color:"#717171"}}>({listing.reviews})</span></div>
      </div>
      <div style={{border:"1.5px solid #CCC",borderRadius:10,overflow:"hidden",marginBottom:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:"1px solid #CCC"}}>
          <div style={{padding:"10px 12px",borderRight:"1px solid #CCC"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:2}}>CHECK-IN</div>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} style={{border:"none",outline:"none",fontSize:13,width:"100%",background:"transparent"}}/>
          </div>
          <div style={{padding:"10px 12px"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:2}}>CHECKOUT</div>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} style={{border:"none",outline:"none",fontSize:13,width:"100%",background:"transparent"}}/>
          </div>
        </div>
        <div style={{padding:"10px 12px"}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:4}}>GÄSTE</div>
          <select value={guests} onChange={e=>setGuests(Number(e.target.value))} style={{border:"none",outline:"none",fontSize:13,width:"100%",background:"transparent"}}>
            {Array.from({length:listing.guests},(_,i)=>i+1).map(n=><option key={n} value={n}>{n} Gast{n>1?"¨e":""}</option>)}
          </select>
        </div>
      </div>
      <button onClick={handleBook} style={{...s.btn("primary","lg"),width:"100%",opacity:nights>0?1:0.6,marginBottom:12}}>
        {!user ? "Anmelden zum Buchen" : nights > 0 ? "Jetzt reservieren" : "Datum auswählen"}
      </button>
      {nights > 0 && (
        <div style={{fontSize:14,color:"#222"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{textDecoration:"underline"}}>€{listing.price} × {nights} Nächte</span><span>€{subtotal}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{textDecoration:"underline"}}>Servicegebühr</span><span>€{fee}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,paddingTop:12,borderTop:"1px solid #EBEBEB"}}><span>Gesamt</span><span>€{subtotal+fee}</span></div>
        </div>
      )}
    </div>
  );
}

function DetailView({ listing, user, wishlist, onToggleWish, onBook, onBack, onLoginNeeded }) {
  return (
    <div style={{maxWidth:920,margin:"0 auto",padding:"0 24px 60px"}}>
      <button onClick={onBack} style={{...s.btn("ghost"),padding:"14px 0",gap:6}}>← Zurück</button>
      <h1 style={{fontSize:26,fontWeight:700,color:"#222",marginBottom:8}}>{listing.title}</h1>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24,flexWrap:"wrap",fontSize:14}}>
        <span style={{display:"flex",alignItems:"center",gap:4,fontWeight:600}}><StarFill />{listing.rating}</span>
        <span style={{color:"#717171"}}>·</span>
        <span style={{textDecoration:"underline",fontWeight:500,cursor:"pointer"}}>{listing.reviews} Bewertungen</span>
        <span style={{color:"#717171"}}>·</span>
        <span style={{textDecoration:"underline",fontWeight:500}}>{listing.location}</span>
        <button onClick={()=>onToggleWish(listing.id)} style={{...s.btn("ghost","sm"),marginLeft:"auto",textDecoration:"underline",gap:6}}>
          <HeartIcon filled={wishlist.has(listing.id)}/>{wishlist.has(listing.id)?"Gespeichert":"Speichern"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,borderRadius:16,overflow:"hidden",marginBottom:36}}>
        {listing.images.map((img,i)=><img key={i} src={img} alt="" style={{width:"100%",aspectRatio:"4/3",objectFit:"cover"}}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:52,alignItems:"start"}}>
        <div>
          <div style={{paddingBottom:24,borderBottom:"1px solid #EBEBEB",marginBottom:24}}>
            <h2 style={{fontSize:20,fontWeight:600,marginBottom:6}}>{listing.type}</h2>
            <div style={{color:"#717171",fontSize:14}}>{listing.guests} Gäste · {listing.bedrooms} Zimmer · {listing.beds} Betten · {listing.baths} Bad</div>
          </div>
          <div style={{paddingBottom:24,borderBottom:"1px solid #EBEBEB",marginBottom:24}}>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:10}}>Über diese Unterkunft</h3>
            <p style={{color:"#444",lineHeight:1.75,fontSize:14}}>{listing.description}</p>
          </div>
          <div>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:14}}>Ausstattung</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {listing.amenities.map(a=><div key={a} style={{display:"flex",alignItems:"center",gap:10,fontSize:14}}>✓ {a}</div>)}
            </div>
          </div>
        </div>
        <div style={{position:"sticky",top:24,border:"1px solid #DDDDDD",borderRadius:16,padding:24,boxShadow:"0 6px 24px rgba(0,0,0,0.1)"}}>
          <BookingWidget listing={listing} user={user} onBook={onBook} onLoginNeeded={onLoginNeeded}/>
        </div>
      </div>
    </div>
  );
}

function HostDashboard({ user, listings, bookings, onAddListing, onToggleActive }) {
  const [tab, setTab] = useState("overview");
  const myListings = listings.filter(l => l.hostId === user.id);
  const myBookings = bookings.filter(b => myListings.some(l => l.id === b.listingId));
  const totalRevenue = myBookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.total,0);
  const [newL, setNewL] = useState({ title:"",location:"",type:"Gesamte Wohnung",price:"",guests:"",bedrooms:"",beds:"",baths:"",description:"",category:"Städte" });
  const setNL = (k,v) => setNewL(p=>({...p,[k]:v}));
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!newL.title || !newL.location || !newL.price) return;
    onAddListing({ ...newL, price:Number(newL.price), guests:Number(newL.guests)||4, bedrooms:Number(newL.bedrooms)||1, beds:Number(newL.beds)||1, baths:Number(newL.baths)||1, hostId: user.id, id: Date.now(), rating:0, reviews:0, images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"], amenities:["WLAN"], tag:null, active:true });
    setShowForm(false);
    setNewL({title:"",location:"",type:"Gesamte Wohnung",price:"",guests:"",bedrooms:"",beds:"",baths:"",description:"",category:"Städte"});
  };

  const statCard = (label, value, icon, color) => (
    <div style={{...s.card,padding:20,background:`linear-gradient(135deg,${color}15,${color}05)`,borderColor:`${color}30`}}>
      <div style={{fontSize:28,marginBottom:4}}>{icon}</div>
      <div style={{fontSize:26,fontWeight:800,color:"#222"}}>{value}</div>
      <div style={{fontSize:13,color:"#717171",marginTop:2}}>{label}</div>
    </div>
  );

  const tabs = [
    { id:"overview", label:"Übersicht" },
    { id:"listings", label:`Inserate (${myListings.length})` },
    { id:"bookings", label:`Buchungen (${myBookings.length})` },
  ];

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"28px 24px 60px"}}>
      <div style={{marginBottom:28}}>
        <h1 style={{fontSize:26,fontWeight:800,color:"#222",marginBottom:4}}>Willkommen, {user.name.split(" ")[0]}! 👋</h1>
        <p style={{color:"#717171",fontSize:14}}>Dein Gastgeber-Dashboard</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:28,background:"#F7F7F7",borderRadius:12,padding:4}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"9px 12px",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t.id?"white":"transparent",color:tab===t.id?"#222":"#888",boxShadow:tab===t.id?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:28}}>
            {statCard("Inserate gesamt", myListings.length, "🏠", "#FF385C")}
            {statCard("Bestätigte Buchungen", myBookings.filter(b=>b.status==="confirmed").length, "📅", "#00A699")}
            {statCard("Gesamteinnahmen", `€${totalRevenue}`, "💰", "#FC642D")}
            {statCard("Bewertungen", myListings.reduce((s,l)=>s+l.reviews,0), "⭐", "#FFB400")}
          </div>
          <div style={{...s.card,padding:0}}>
            <div style={{padding:"18px 20px",borderBottom:"1px solid #EBEBEB"}}>
              <h3 style={{fontSize:15,fontWeight:700,color:"#222"}}>Neueste Buchungen</h3>
            </div>
            {myBookings.length === 0 ? (
              <div style={{padding:32,textAlign:"center",color:"#717171",fontSize:14}}>Noch keine Buchungen</div>
            ) : myBookings.slice(-3).reverse().map(b=>{
              const listing = listings.find(l=>l.id===b.listingId);
              return (
                <div key={b.id} style={{padding:"14px 20px",borderBottom:"1px solid #F0F0F0",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#222"}}>{listing?.title}</div>
                    <div style={{fontSize:12,color:"#717171"}}>{b.guestName} · {b.checkIn} – {b.checkOut}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:14,fontWeight:700}}>€{b.total}</span>
                    <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#E6F9F1":"#FFF3E0",color:b.status==="confirmed"?"#00875A":"#E65C00"}}>
                      {b.status==="confirmed"?"Bestätigt":"Ausstehend"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {tab === "listings" && (
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <button onClick={()=>setShowForm(!showForm)} style={s.btn("primary")}>
              {showForm?"✕ Abbrechen":"+ Neues Inserat"}
            </button>
          </div>
          {showForm && (
            <div style={{...s.card,padding:24,marginBottom:24,background:"#FAFAFA"}}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:18}}>Neues Inserat erstellen</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                {[["title","Titel"],["location","Standort"]].map(([k,l])=>(
                  <div key={k}><label style={s.label}>{l}</label><input style={s.input} value={newL[k]} onChange={e=>setNL(k,e.target.value)} placeholder={l}/></div>
                ))}
                <div>
                  <label style={s.label}>Preis / Nacht (€)</label>
                  <input style={s.input} type="number" value={newL.price} onChange={e=>setNL("price",e.target.value)} placeholder="89"/>
                </div>
                <div>
                  <label style={s.label}>Typ</label>
                  <select style={s.input} value={newL.type} onChange={e=>setNL("type",e.target.value)}>
                    {["Gesamte Wohnung","Gesamtes Haus","Privates Zimmer"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                {[["guests","Max. Gäste"],["bedrooms","Schlafzimmer"],["beds","Betten"],["baths","Bäder"]].map(([k,l])=>(
                  <div key={k}><label style={s.label}>{l}</label><input style={s.input} type="number" value={newL[k]} onChange={e=>setNL(k,e.target.value)} placeholder="1"/></div>
                ))}
              </div>
              <div style={{marginBottom:14}}>
                <label style={s.label}>Beschreibung</label>
                <textarea style={{...s.input,minHeight:80,resize:"vertical"}} value={newL.description} onChange={e=>setNL("description",e.target.value)} placeholder="Beschreibe deine Unterkunft..."/>
              </div>
              <div style={{marginBottom:18}}>
                <label style={s.label}>Kategorie</label>
                <select style={s.input} value={newL.category} onChange={e=>setNL("category",e.target.value)}>
                  {["Städte","Strand","Berge","Natur"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <button onClick={handleAdd} style={{...s.btn("primary"),width:"100%"}}>Inserat veröffentlichen</button>
            </div>
          )}
          {myListings.length === 0 ? (
            <div style={{textAlign:"center",padding:60,color:"#717171"}}>
              <div style={{fontSize:40,marginBottom:12}}>🏠</div>
              <div style={{fontSize:16,fontWeight:600,color:"#222",marginBottom:8}}>Noch keine Inserate</div>
            </div>
          ) : (
            <div style={{display:"grid",gap:14}}>
              {myListings.map(l=>(
                <div key={l.id} style={{...s.card,padding:16,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                  <img src={l.images[0]} alt="" style={{width:80,height:60,objectFit:"cover",borderRadius:8,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:140}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#222"}}>{l.title}</div>
                    <div style={{fontSize:12,color:"#717171"}}>{l.location} · €{l.price}/Nacht</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:l.active?"#E6F9F1":"#F7F7F7",color:l.active?"#00875A":"#888"}}>
                      {l.active?"Aktiv":"Inaktiv"}
                    </span>
                    <button onClick={()=>onToggleActive(l.id)} style={{...s.btn("outline","sm"),fontSize:12}}>
                      {l.active?"Deaktivieren":"Aktivieren"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === "bookings" && (
        <div style={{display:"grid",gap:12}}>
          {myBookings.length === 0 ? (
            <div style={{textAlign:"center",padding:60,color:"#717171",fontSize:14}}>Noch keine Buchungen</div>
          ) : myBookings.map(b=>{
            const listing = listings.find(l=>l.id===b.listingId);
            return (
              <div key={b.id} style={{...s.card,padding:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <img src={listing?.images[0]} alt="" style={{width:60,height:48,objectFit:"cover",borderRadius:8}}/>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,color:"#222"}}>{listing?.title}</div>
                    <div style={{fontSize:12,color:"#717171"}}>Gast: {b.guestName}</div>
                    <div style={{fontSize:12,color:"#717171"}}>{b.checkIn} → {b.checkOut}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:16,fontWeight:700}}>€{b.total}</span>
                  <span style={{padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:700,background:b.status==="confirmed"?"#E6F9F1":"#FFF3E0",color:b.status==="confirmed"?"#00875A":"#E65C00"}}>
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

function GuestDashboard({ user, bookings, listings }) {
  const myBookings = bookings.filter(b => b.guestId === user.id);
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"28px 24px 60px"}}>
      <h1 style={{fontSize:24,fontWeight:800,color:"#222",marginBottom:4}}>Hallo, {user.name.split(" ")[0]}! 🧳</h1>
      <p style={{color:"#717171",fontSize:14,marginBottom:28}}>Deine Reisen & Buchungen</p>
      {myBookings.length === 0 ? (
        <div style={{textAlign:"center",padding:60,color:"#717171"}}>
          <div style={{fontSize:40,marginBottom:12}}>✈️</div>
          <div style={{fontSize:16,fontWeight:600,color:"#222",marginBottom:6}}>Noch keine Buchungen</div>
        </div>
      ) : (
        <div style={{display:"grid",gap:14}}>
          {myBookings.map(b=>{
            const listing = listings.find(l=>l.id===b.listingId);
            return (
              <div key={b.id} style={{...s.card,padding:18,display:"flex",gap:14,alignItems:"center",flexWrap:"wrap"}}>
                <img src={listing?.images[0]} alt="" style={{width:90,height:68,objectFit:"cover",borderRadius:10,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#222",marginBottom:3}}>{listing?.title}</div>
                  <div style={{fontSize:13,color:"#717171"}}>{listing?.location}</div>
                  <div style={{fontSize:13,color:"#717171"}}>{b.checkIn} – {b.checkOut} · {b.guests} Gast{b.guests>1?"¨e":""}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>€{b.total}</div>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:b.status==="confirmed"?"#E6F9F1":"#FFF3E0",color:b.status==="confirmed"?"#00875A":"#E65C00"}}>
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

export default function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [view, setView] = useState("browse");
  const [selectedListing, setSelectedListing] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle");
  const [listings, setListings] = useState(initialListings);
  const [bookings, setBookings] = useState(initialBookings);

  const toggleWish = id => setWishlist(p => { const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const handleLogin = u => { setUser(u); setShowAuth(false); };
  const handleLogout = () => { setUser(null); setView("browse"); setShowProfile(false); };
  const handleBook = booking => setBookings(p => [...p, { ...booking, id: Date.now(), status: "confirmed" }]);

  const filtered = listings.filter(l => {
    const ms = search === "" || l.title.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase());
    const mc = category === "Alle" || l.category === category;
    return ms && mc && l.active;
  });
  const wishListed = listings.filter(l => wishlist.has(l.id));

  return (
    <div style={{ minHeight:"100vh", background:"#fff", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onLogin={handleLogin}/>}

      <header style={{position:"sticky",top:0,zIndex:90,background:"white",borderBottom:"1px solid #EBEBEB"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",height:64,gap:12,justifyContent:"space-between"}}>
          <button onClick={()=>{setView("browse");setSelectedListing(null);}} style={{...s.btn("ghost"),fontSize:22,fontWeight:800,color:"#FF385C",letterSpacing:-0.5,padding:0,flexShrink:0}}>
            🏠 1home
          </button>
          {view === "browse" && !selectedListing && (
            <div style={{display:"flex",alignItems:"center",border:"1.5px solid #DDDDDD",borderRadius:40,padding:"7px 14px",gap:10,boxShadow:"0 1px 6px rgba(0,0,0,0.08)",maxWidth:380,width:"100%"}}>
              <input type="text" placeholder="Wohin soll die Reise gehen?" value={search} onChange={e=>setSearch(e.target.value)}
                style={{border:"none",outline:"none",fontSize:13,flex:1,minWidth:0,background:"transparent"}}/>
              <div style={{background:"#FF385C",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",color:"white",flexShrink:0,fontSize:13}}>🔍</div>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {user?.role === "host" && (
              <button onClick={()=>{setView("dashboard");setSelectedListing(null);}}
                style={{...s.btn(view==="dashboard"?"primary":"outline","sm")}}>Dashboard</button>
            )}
            {user?.role === "guest" && (
              <button onClick={()=>{setView("trips");setSelectedListing(null);}}
                style={{...s.btn(view==="trips"?"primary":"outline","sm")}}>Meine Reisen</button>
            )}
            {user ? (
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowProfile(!showProfile)}
                  style={{display:"flex",alignItems:"center",gap:8,border:"1.5px solid #DDDDDD",borderRadius:22,padding:"5px 12px",background:"white",cursor:"pointer",fontSize:13,fontWeight:600}}>
                  ☰
                  <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#FF385C,#D70466)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11,fontWeight:800}}>{user.avatar}</div>
                </button>
                {showProfile && (
                  <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",background:"white",border:"1px solid #DDDDDD",borderRadius:14,boxShadow:"0 8px 30px rgba(0,0,0,0.12)",minWidth:200,overflow:"hidden",zIndex:200}}>
                    <div style={{padding:"14px 16px",borderBottom:"1px solid #F0F0F0"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#222"}}>{user.name}</div>
                      <div style={{fontSize:12,color:"#717171"}}>{user.email}</div>
                      <div style={{marginTop:4,display:"inline-block",padding:"2px 8px",borderRadius:12,background:user.role==="host"?"#FFF0F3":"#F0F7FF",color:user.role==="host"?"#E61E4D":"#0066CC",fontSize:11,fontWeight:700}}>
                        {user.role==="host"?"🏠 Gastgeber":"🧳 Gast"}
                      </div>
                    </div>
                    <button onClick={handleLogout} style={{...s.btn("ghost"),width:"100%",padding:"12px 16px",justifyContent:"flex-start",borderRadius:0,color:"#CC0000",fontSize:13}}>
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={()=>setShowAuth(true)} style={s.btn("primary","sm")}>Anmelden</button>
            )}
          </div>
        </div>
        {view === "browse" && !selectedListing && (
          <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px 10px",display:"flex",gap:8,overflowX:"auto"}}>
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setCategory(cat)}
                style={{padding:"7px 16px",borderRadius:20,border:"1px solid",borderColor:category===cat?"#222":"#DDDDDD",background:category===cat?"#222":"white",color:category===cat?"white":"#717171",fontSize:13,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap"}}>
                {cat}
              </button>
            ))}
            {wishlist.size > 0 && (
              <button onClick={()=>setView(view==="wishlist"?"browse":"wishlist")}
                style={{padding:"7px 16px",borderRadius:20,border:"1px solid",borderColor:view==="wishlist"?"#FF385C":"#DDDDDD",background:view==="wishlist"?"#FFF0F3":"white",color:view==="wishlist"?"#FF385C":"#717171",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>
                ♥ Merkliste ({wishlist.size})
              </button>
            )}
          </div>
        )}
      </header>

      {selectedListing ? (
        <DetailView listing={selectedListing} user={user} wishlist={wishlist} onToggleWish={toggleWish}
          onBook={handleBook} onBack={()=>setSelectedListing(null)} onLoginNeeded={()=>setShowAuth(true)}/>
      ) : view === "dashboard" && user?.role === "host" ? (
        <HostDashboard user={user} listings={listings} bookings={bookings}
          onAddListing={l=>setListings(p=>[...p,l])} onToggleActive={id=>setListings(p=>p.map(l=>l.id===id?{...l,active:!l.active}:l))}/>
      ) : view === "trips" && user?.role === "guest" ? (
        <GuestDashboard user={user} bookings={bookings} listings={listings}/>
      ) : (
        <main style={{maxWidth:1200,margin:"0 auto",padding:"24px 24px 60px"}}>
          {view === "wishlist" && <h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}>♥ Deine Merkliste</h2>}
          {(() => {
            const toShow = view === "wishlist" ? wishListed : filtered;
            if (toShow.length === 0) return (
              <div style={{textAlign:"center",padding:"80px 20px",color:"#717171"}}>
                <div style={{fontSize:48,marginBottom:16}}>🔍</div>
                <div style={{fontSize:18,fontWeight:600,color:"#222",marginBottom:8}}>Keine Unterkünfte gefunden</div>
              </div>
            );
            return (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:28}}>
                {toShow.map(l=><ListingCard key={l.id} listing={l} onSelect={setSelectedListing} wishlist={wishlist} onToggleWish={toggleWish}/>)}
              </div>
            );
          })()}
        </main>
      )}
    </div>
  );
}
