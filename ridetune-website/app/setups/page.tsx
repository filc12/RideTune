"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface SetupCard {
  id: string;
  bike: string;
  setup: string;
  notes?: string;
  author: string;
  date: string;
  isNew?: boolean;
}

// Lista inicial de exemplo da comunidade
const initialSetups: SetupCard[] = [
  {
    id: "1",
    bike: "Yamaha Tenere 700",
    setup: "F.Pre: 4T | F.Reb: 8C | R.Pre: 3T | R.Reb: 10C",
    notes: "Setup focado em off-road técnico e rochas soltas.",
    author: "João Silva",
    date: "Hoje"
  },
  {
    id: "2",
    bike: "KTM 890 Adventure R",
    setup: "F.Pre: 2T | F.Comp: 12C | R.Pre: 5T | R.Reb: 6C",
    notes: "Ideal para viagem com bagagem e piso misto.",
    author: "Marta Costa",
    date: "Ontem"
  }
];

function SetupsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [setups, setSetups] = useState<SetupCard[]>(initialSetups);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [pendingSetup, setPendingSetup] = useState<{ bike: string; setup: string; notes: string } | null>(null);
  const [published, setPublished] = useState<boolean>(false);

  useEffect(() => {
    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams]);

  const handleConfirm = () => {
    if (!pendingSetup) return;

    setPublished(true);

    setTimeout(() => {
      // Adiciona o novo setup ao topo da lista de cards da página
      const newEntry: SetupCard = {
        id: Date.now().toString(),
        bike: pendingSetup.bike,
        setup: pendingSetup.setup,
        notes: pendingSetup.notes,
        author: "Utilizador RideTune",
        date: "Agora mesmo",
        isNew: true
      };

      setSetups((prev) => [newEntry, ...prev]);
      setShowShareModal(false);
      setPublished(false);
      
      // Limpa os parametros da URL
      router.replace("/setups");
    }, 1000);
  };

  const handleClose = () => {
    setShowShareModal(false);
    router.replace("/setups");
  };

  return (
    <>
      {/* POP-UP DE CONFIRMAÇÃO */}
      {showShareModal && pendingSetup && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
          <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "440px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
            {published ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <span style={{ fontSize: "36px" }}>✅</span>
                <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginTop: "12px" }}>Setup Publicado!</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>A adicionar à lista da comunidade...</p>
              </div>
            ) : (
              <>
                <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Confirmar Partilha de Setup</h3>
                <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>Recebemos a tua afinação da app RideTune. Confirmas a publicação para a comunidade?</p>
                
                <div style={{ backgroundColor: "#1e293b", padding: "14px", borderRadius: "10px", marginBottom: "20px", borderLeft: "4px solid #38bdf8" }}>
                  <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
                  <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0, fontFamily: "monospace" }}>{pendingSetup.setup}</p>
                  {pendingSetup.notes ? <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "8px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p> : null}
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  <button onClick={handleClose} style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}>Cancelar</button>
                  <button onClick={handleConfirm} style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}>Publicar Setup</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* GRELHA DE CARDS DE SETUPS NA PÁGINA */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "24px" }}>
        {setups.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#111827",
              borderRadius: "14px",
              padding: "20px",
              border: item.isNew ? "2px solid #38bdf8" : "1px solid #1f2937",
              boxShadow: item.isNew ? "0 0 15px rgba(56, 189, 248, 0.2)" : "none",
              transition: "transform 0.2s ease",
              position: "relative"
            }}
          >
            {item.isNew && (
              <span style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "#38bdf8", color: "#090d16", fontSize: "10px", fontWeight: "bold", padding: "2px 8px", borderRadius: "12px", textTransform: "uppercase" }}>
                Novo
              </span>
            )}
            <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", margin: "0 0 8px 0" }}>{item.bike}</h3>
            
            <div style={{ backgroundColor: "#1e293b", padding: "10px", borderRadius: "8px", margin: "12px 0", fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1", wordBreak: "break-all" }}>
              {item.setup}
            </div>

            {item.notes && (
              <p style={{ color: "#94a3b8", fontSize: "13px", fontStyle: "italic", marginBottom: "16px" }}>
                "{item.notes}"
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", borderTop: "1px solid #1f2937", paddingTop: "12px", marginTop: "12px" }}>
              <span>Por: {item.author}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function SetupsPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#090d16", color: "#fff", padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Suspense fallback={null}><ShareConfirmationModal /></Suspense>
      
      
      
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px", color: "#ffffff" }}>Setups Públicos</h1>
      <p style={{ color: "#94a3b8", fontSize: "15px" }}>Explora e partilha afinações de suspensão da comunidade RideTune.</p>

      <Suspense fallback={<p style={{ color: "#64748b", marginTop: "24px" }}>A carregar setups...</p>}>
        <SetupsContent />
      </Suspense>
    </main>
  );
}


function ShareConfirmationModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSetup, setPendingSetup] = useState<any>(null);

  useEffect(() => {
    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams]);

  if (!showShareModal || !pendingSetup) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
      <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "440px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
        <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Confirmar Partilha de Setup</h3>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>Recebemos a tua afinação da app RideTune. Confirmas a publicação para a comunidade?</p>
        
        <div style={{ backgroundColor: "#1e293b", padding: "14px", borderRadius: "10px", marginBottom: "20px", borderLeft: "4px solid #38bdf8" }}>
          <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
          <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>{pendingSetup.setup}</p>
          {pendingSetup.notes ? <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "8px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p> : null}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={() => { setShowShareModal(false); router.replace("/setups"); }} style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}>Cancelar</button>
          <button onClick={() => { alert("Setup publicado com sucesso!"); setShowShareModal(false); router.replace("/setups"); }} style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}>Publicar Setup</button>
        </div>
      </div>
    </div>
  );
}
