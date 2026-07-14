"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ShareConfirmationModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSetup, setPendingSetup] = useState<any>(null);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    if (hasProcessed) return;

    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams, hasProcessed]);

  const handleClose = () => {
    setShowShareModal(false);
    setHasProcessed(true);
    router.replace("/setups", { scroll: false });
  };

  const handleConfirm = () => {
    setShowShareModal(false);
    setHasProcessed(true);
    router.replace("/setups", { scroll: false });
  };

  if (!showShareModal || !pendingSetup || hasProcessed) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
      <div style={{ backgroundColor: "#0f172a", padding: "28px", borderRadius: "24px", maxWidth: "460px", width: "100%", border: "1px solid #334155", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <span style={{ fontSize: "22px" }}>⚡</span>
          <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: "700", margin: 0 }}>Confirmar Partilha de Setup</h3>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px", lineHeight: "1.5" }}>Recebemos a tua afinação da app RideTune. Confirmas a publicação para a comunidade?</p>
        
        <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "16px", marginBottom: "24px", borderLeft: "4px solid #38bdf8" }}>
          <p style={{ color: "#38bdf8", fontWeight: "700", fontSize: "16px", margin: 0 }}>{pendingSetup.bike}</p>
          <p style={{ color: "#e2e8f0", fontSize: "13px", marginTop: "8px", marginBottom: 0, fontFamily: "monospace" }}>{pendingSetup.setup}</p>
          {pendingSetup.notes ? <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "10px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p> : null}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={handleClose} style={{ padding: "10px 18px", borderRadius: "12px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>Cancelar</button>
          <button onClick={handleConfirm} style={{ padding: "10px 20px", borderRadius: "12px", background: "#38bdf8", color: "#020617", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)" }}>Publicar Setup</button>
        </div>
      </div>
    </div>
  );
}

export default function SetupsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const mockSetups = [
    { id: 1, bike: "Honda Transalp 2026", category: "Adventure", setup: "F.Pre: 6 | F.Reb: 1 | F.Comp: 11 | R.Pre: 2.25 | R.Reb: 1.25 | R.Comp: 2.5", notes: "top", author: "Utilizador RideTune", date: "Agora mesmo", isNew: true },
    { id: 2, bike: "Yamaha Tenere 700", category: "Adventure", setup: "F.Pre: 4T | F.Reb: 8C | R.Pre: 3T | R.Reb: 10C", notes: "Setup focado em off-road técnico e rochas soltas.", author: "João Silva", date: "Hoje", isNew: false },
    { id: 3, bike: "KTM 890 Adventure R", category: "Adventure", setup: "F.Pre: 2T | F.Comp: 12C | R.Pre: 5T | R.Reb: 6C", notes: "Ideal para viagem com bagagem e piso misto.", author: "Marta Costa", date: "Ontem", isNew: false }
  ];

  const filteredSetups = mockSetups.filter(item => {
    const matchesSearch = item.bike.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060911", color: "#ffffff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Suspense fallback={null}>
        <ShareConfirmationModal />
      </Suspense>

      {/* NAVBAR */}
      <header style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#38bdf8", boxShadow: "0 0 12px #38bdf8" }}></div>
          <span style={{ fontWeight: "800", fontSize: "20px", letterSpacing: "-0.5px" }}>RideTune</span>
        </div>
        <nav style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#94a3b8", alignItems: "center" }}>
          <a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Features</a>
          <a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>How it works</a>
          <a href="#" style={{ color: "#ffffff", fontWeight: "600", textDecoration: "none" }}>Setups</a>
          <a href="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Premium</a>
        </nav>
        <button style={{ backgroundColor: "#38bdf8", color: "#020617", padding: "8px 20px", borderRadius: "20px", fontWeight: "700", border: "none", fontSize: "14px", cursor: "pointer" }}>Download</button>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "700", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "6px 14px", borderRadius: "12px", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
            • SETUP LIBRARY · VERIFIED AGAINST OEM
          </span>
        </div>
        
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "16px", maxWidth: "700px" }}>
          Suspension setups, <br />
          <span style={{ color: "#38bdf8" }}>for your exact bike.</span>
        </h1>
        
        <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "600px", lineHeight: "1.6", marginBottom: "40px" }}>
          Reference starting points for sag, preload, rebound and compression — by model and by how you ride. Browse and contribute for free.
        </p>

        {/* CONTROLS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ position: "relative", minWidth: "280px", flex: "1", maxWidth: "400px" }}>
            <input 
              type="text" 
              placeholder="Search a model..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "24px", backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px" }}>🔍</span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Adventure", "Middleweight sport", "Sport"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: "8px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", border: "1px solid #1e293b", cursor: "pointer", transition: "all 0.2s", backgroundColor: selectedCategory === cat ? "#38bdf8" : "#0f172a", color: selectedCategory === cat ? "#020617" : "#94a3b8" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", marginBottom: "24px", letterSpacing: "1px" }}>
          {filteredSetups.length} MODELS FOUND
        </div>

        {/* PREVIEW CARDS GRELHA MODERNA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredSetups.map((item) => {
            const setupItems = item.setup.split("|").map(s => s.trim());

            return (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: "#0b1220", 
                  border: item.isNew ? "1px solid #38bdf8" : "1px solid #1e293b", 
                  borderRadius: "20px", 
                  padding: "24px", 
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: item.isNew ? "0 0 24px rgba(56, 189, 248, 0.18)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  position: "relative"
                }}
              >
                <div>
                  {/* CABEÇALHO DO CARD */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                        {item.category}
                      </span>
                      <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginTop: "4px", margin: 0 }}>
                        {item.bike}
                      </h3>
                    </div>
                    {item.isNew && (
                      <span style={{ backgroundColor: "#38bdf8", color: "#020617", fontSize: "10px", fontWeight: "800", padding: "4px 10px", borderRadius: "12px", letterSpacing: "0.5px" }}>
                        NOVO
                      </span>
                    )}
                  </div>

                  {/* PARÂMETROS FORMATADOS EM PILLS */}
                  <div style={{ backgroundColor: "#131c2e", padding: "14px", borderRadius: "14px", border: "1px solid #1e2d4a", marginBottom: "16px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {setupItems.map((param, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            backgroundColor: "#1e293b", 
                            color: "#38bdf8", 
                            fontSize: "12px", 
                            fontWeight: "600", 
                            fontFamily: "monospace", 
                            padding: "4px 10px", 
                            borderRadius: "8px",
                            border: "1px solid #334155"
                          }}
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* NOTAS DE CONDUÇÃO */}
                  {item.notes && (
                    <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "10px 14px", borderRadius: "10px", borderLeft: "3px solid #38bdf8", marginBottom: "20px" }}>
                      <p style={{ fontSize: "13px", color: "#cbd5e1", fontStyle: "italic", margin: 0, lineHeight: "1.4" }}>
                        "{item.notes}"
                      </p>
                    </div>
                  )}
                </div>

                {/* RODAPÉ DO CARD */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid #1e293b", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#1e293b", border: "1px solid #38bdf8", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontWeight: "700", fontSize: "12px" }}>
                      {item.author.charAt(0)}
                    </div>
                    <span style={{ color: "#e2e8f0", fontWeight: "600" }}>{item.author}</span>
                  </div>
                  <span style={{ color: "#64748b", fontWeight: "500" }}>{item.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
