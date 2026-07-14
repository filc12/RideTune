"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ShareConfirmationModal() {
  const searchParams = useSearchParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSetup, setPendingSetup] = useState<{ bike: string; setup: string; notes: string } | null>(null);

  useEffect(() => {
    const action = searchParams.get("action");
    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (action === "share" && bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams]);

  if (!showShareModal || !pendingSetup) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
      <Suspense fallback={null}><ShareConfirmationModal /></Suspense>
      <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "420px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
        <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
          Confirmar Partilha de Setup
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>
          Recebemos este registo do teu diário na app RideTune. Confirmas a publicação pública?
        </p>

        <div style={{ backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
          <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>{pendingSetup.setup}</p>
          {pendingSetup.notes && (
            <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button 
            onClick={() => setShowShareModal(false)} 
            style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}
          >
            Cancelar
          </button>
          <button 
            onClick={() => { alert("Setup publicado com sucesso!"); setShowShareModal(false); }} 
            style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}
          >
            Publicar Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SetupsPage() {
  return (
    <main style={{ padding: "20px", color: "#fff" }}>
      <h2>Setups Públicos</h2>
      <Suspense fallback={null}>
        <ShareConfirmationModal />
      </Suspense>
    </main>
  );
}



function ShareConfirmationModal() {
  const searchParams = useSearchParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingSetup, setPendingSetup] = useState(null);

  useEffect(() => {
    const action = searchParams.get("action");
    const bike = searchParams.get("bike");
    const setup = searchParams.get("setup");
    const notes = searchParams.get("notes");

    if (action === "share" && bike && setup) {
      setPendingSetup({ bike, setup, notes: notes || "" });
      setShowShareModal(true);
    }
  }, [searchParams]);

  if (!showShareModal || !pendingSetup) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
      <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "420px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
        <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
          Confirmar Partilha de Setup
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>
          Recebemos este registo do teu diário na app. Confirmas a publicação?
        </p>

        <div style={{ backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
          <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
          <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>{pendingSetup.setup}</p>
          {pendingSetup.notes && (
            <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p>
          )}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button 
            onClick={() => setShowShareModal(false)} 
            style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}
          >
            Cancelar
          </button>
          <button 
            onClick={() => { alert("Setup publicado com sucesso!"); setShowShareModal(false); }} 
            style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}
          >
            Publicar Setup
          </button>
        </div>
      </div>
    </div>
  );
}
