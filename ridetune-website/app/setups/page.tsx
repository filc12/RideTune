"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { PLAY_URL } from "@/site.config";
import { useI18n } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function ShareConfirmationModal() {
  const { t } = useI18n();
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
          <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: "700", margin: 0 }}>{t.setups.modalTitle}</h3>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "20px", lineHeight: "1.5" }}>{t.setups.modalDesc}</p>
        
        <div style={{ backgroundColor: "#1e293b", padding: "16px", borderRadius: "16px", marginBottom: "24px", borderLeft: "4px solid #38bdf8" }}>
          <p style={{ color: "#38bdf8", fontWeight: "700", fontSize: "16px", margin: 0 }}>{pendingSetup.bike}</p>
          <p style={{ color: "#e2e8f0", fontSize: "13px", marginTop: "8px", marginBottom: 0, fontFamily: "monospace" }}>{pendingSetup.setup}</p>
          {pendingSetup.notes ? <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "10px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p> : null}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={handleClose} style={{ padding: "10px 18px", borderRadius: "12px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>{t.setups.cancel}</button>
          <button onClick={handleConfirm} style={{ padding: "10px 20px", borderRadius: "12px", background: "#38bdf8", color: "#020617", fontWeight: "700", border: "none", cursor: "pointer", fontSize: "14px", boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)" }}>{t.setups.publish}</button>
        </div>
      </div>
    </div>
  );
}

export default function SetupsPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Setups de referência (mesma forma que a app produz).
  // front/rear.comp fica a null nas motos sem compressão ajustável (adj "partial").
  const mockSetups = [
    { id: 1, bike: "Honda XL750 Transalp", cc: "755cc", category: "Adventure", rating: 4, front: { pre: 6, reb: 1, comp: 11 }, rear: { pre: 2.25, reb: 1.25, comp: 2.5 }, notes: "Estável em autoestrada, absorve bem o piso partido.", author: "Filipe C.", date: "Agora mesmo", isNew: true },
    { id: 2, bike: "BMW R 1250 GS", cc: "1254cc", category: "Adventure", rating: 5, front: { pre: 5, reb: 10, comp: 12 }, rear: { pre: 7, reb: 9, comp: 11 }, notes: "Confortável a dois com malas, estável a alta velocidade.", author: "João Silva", date: "Hoje", isNew: false },
    { id: 3, bike: "Yamaha Ténéré 700 World Raid", cc: "689cc", category: "Adventure", rating: 5, front: { pre: 4, reb: 12, comp: 14 }, rear: { pre: 6, reb: 10, comp: 12 }, notes: "Vocação off-road, absorve bem terreno técnico.", author: "Marta Costa", date: "Ontem", isNew: false },
    { id: 4, bike: "KTM 890 Adventure", cc: "889cc", category: "Adventure", rating: 4, front: { pre: 5, reb: 12, comp: null }, rear: { pre: 8, reb: 10, comp: null }, notes: "Ideal para viagem com bagagem e piso misto.", author: "Rui Almeida", date: "há 2 dias", isNew: false },
    { id: 5, bike: "Triumph Street Triple RS", cc: "765cc", category: "Naked", rating: 5, front: { pre: 6, reb: 8, comp: 9 }, rear: { pre: 5, reb: 7, comp: 8 }, notes: "Preciso e ágil em estrada de montanha.", author: "Pedro M.", date: "há 3 dias", isNew: false },
    { id: 6, bike: "Yamaha MT-09", cc: "890cc", category: "Naked", rating: 4, front: { pre: 5, reb: 9, comp: null }, rear: { pre: 4, reb: 8, comp: null }, notes: "Menos mergulho na travagem, mais confiança.", author: "Ana R.", date: "há 4 dias", isNew: false },
    { id: 7, bike: "BMW S 1000 RR", cc: "999cc", category: "Sport", rating: 5, front: { pre: 4, reb: 10, comp: 8 }, rear: { pre: 6, reb: 9, comp: 10 }, notes: "Setup track-day, firme e preciso.", author: "Tiago F.", date: "há 5 dias", isNew: false },
    { id: 8, bike: "Ducati Hypermotard 950", cc: "937cc", category: "Supermoto", rating: 4, front: { pre: 5, reb: 7, comp: 9 }, rear: { pre: 7, reb: 8, comp: 10 }, notes: "Divertida e leve na frente, boa para curvas apertadas.", author: "Sofia L.", date: "há 1 semana", isNew: false }
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
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
          <span className="h-4 w-9 rounded-full bg-brand-accent shadow-[0_0_22px_rgba(74,158,255,0.9)]" />
          <span className="text-2xl font-bold tracking-tight text-white">
            Ride<span className="text-brand-accent">Tune</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#94a3b8", alignItems: "center" }}>
          <Link href="/#features" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.nav.features}</Link>
          <Link href="/#how" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.nav.how}</Link>
          <Link href="/setups" style={{ color: "#ffffff", fontWeight: "600", textDecoration: "none" }}>{t.nav.setups}</Link>
          <Link href="/#premium" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.nav.premium}</Link>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <LanguageSwitcher />
          <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#38bdf8", color: "#020617", padding: "8px 20px", borderRadius: "20px", fontWeight: "700", border: "none", fontSize: "14px", cursor: "pointer", textDecoration: "none" }}>{t.nav.download}</a>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "1.2px", color: "#38bdf8", textTransform: "uppercase", fontWeight: "700", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "6px 14px", borderRadius: "12px", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
            • {t.setups.eyebrow}
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800", lineHeight: "1.1", marginBottom: "16px", maxWidth: "700px" }}>
          {t.setups.titleA} <br />
          <span style={{ color: "#38bdf8" }}>{t.setups.titleB}</span>
        </h1>

        <p style={{ color: "#94a3b8", fontSize: "16px", maxWidth: "600px", lineHeight: "1.6", marginBottom: "40px" }}>
          {t.setups.subtitle}
        </p>

        {/* CONTROLS */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ position: "relative", minWidth: "280px", flex: "1", maxWidth: "400px" }}>
            <input 
              type="text"
              placeholder={t.setups.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: "24px", backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: "14px" }}>🔍</span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Adventure", "Naked", "Sport", "Supermoto"].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: "8px 18px", borderRadius: "20px", fontSize: "13px", fontWeight: "600", border: "1px solid #1e293b", cursor: "pointer", transition: "all 0.2s", backgroundColor: selectedCategory === cat ? "#38bdf8" : "#0f172a", color: selectedCategory === cat ? "#020617" : "#94a3b8" }}
              >
                {cat === "All" ? t.setups.all : cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", marginBottom: "24px", letterSpacing: "1px" }}>
          {filteredSetups.length} {t.setups.modelsFound}
        </div>

        {/* PREVIEW CARDS GRELHA MODERNA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {filteredSetups.map((item) => {
            const rows = [
              { k: "Pre", f: item.front.pre, r: item.rear.pre },
              { k: "Reb", f: item.front.reb, r: item.rear.reb },
              { k: "Comp", f: item.front.comp, r: item.rear.comp },
            ].filter((row) => row.f !== null || row.r !== null);

            const axisBox = (label: string, side: "f" | "r") => (
              <div style={{ backgroundColor: "#131c2e", border: "1px solid #1e2d4a", borderRadius: "12px", padding: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "1px", marginBottom: "10px" }}>{label}</div>
                {rows.map((row) => (
                  <div key={row.k} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                    <span style={{ color: "#64748b" }}>{row.k}</span>
                    <span style={{ color: "#38bdf8", fontFamily: "monospace", fontWeight: "600" }}>
                      {row[side] === null ? "—" : row[side]}
                    </span>
                  </div>
                ))}
              </div>
            );

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
                  boxShadow: item.isNew ? "0 0 24px rgba(56, 189, 248, 0.18)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                  position: "relative"
                }}
              >
                {/* CABEÇALHO DO CARD */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.8px", backgroundColor: "rgba(56, 189, 248, 0.1)", padding: "3px 9px", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.25)" }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "10px 0 2px" }}>
                      {item.bike}
                    </h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{item.cc}</span>
                  </div>
                  {item.isNew && (
                    <span style={{ backgroundColor: "#38bdf8", color: "#020617", fontSize: "10px", fontWeight: "800", padding: "4px 10px", borderRadius: "12px", letterSpacing: "0.5px" }}>
                      {t.setups.isNew}
                    </span>
                  )}
                </div>

                {/* AVALIAÇÃO POR ESTRELAS */}
                <div style={{ display: "flex", gap: "2px", marginBottom: "14px", color: "#eab308", fontSize: "15px", lineHeight: 1 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} style={{ color: s <= item.rating ? "#eab308" : "#334155" }}>★</span>
                  ))}
                </div>

                {/* GRELHA FRENTE / TRÁS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {axisBox(t.setups.front, "f")}
                  {axisBox(t.setups.rear, "r")}
                </div>

                {/* NOTAS DE CONDUÇÃO */}
                {item.notes && (
                  <div style={{ backgroundColor: "rgba(255,255,255,0.02)", padding: "10px 14px", borderLeft: "3px solid #38bdf8", marginBottom: "18px" }}>
                    <p style={{ fontSize: "13px", color: "#cbd5e1", fontStyle: "italic", margin: 0, lineHeight: "1.4" }}>
                      "{item.notes}"
                    </p>
                  </div>
                )}

                {/* RODAPÉ DO CARD */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid #1e293b", fontSize: "12px", marginTop: "auto" }}>
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

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #1e293b", marginTop: "48px", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
          <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.6", margin: 0, maxWidth: "760px" }}>
            {t.footer.disclaimer}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", borderTop: "1px solid #1e293b", paddingTop: "20px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>© {new Date().getFullYear()} RideTune. {t.footer.rights}</span>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "13px" }}>
              <Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.footer.privacy}</Link>
              <Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.footer.terms}</Link>
              <Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none" }}>{t.footer.contact}</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
