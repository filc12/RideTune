"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface PendingSetup {
  bike: string;
  setup: string;
  notes: string;
}

function ShareConfirmationModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [pendingSetup, setPendingSetup] = useState<PendingSetup | null>(null);
  const [published, setPublished] = useState<boolean>(false);

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

  const handleConfirm = () => {
    setPublished(true);
    setTimeout(() => {
      setShowShareModal(false);
      router.replace("/setups");
    }, 1200);
  };

  const handleClose = () => {
    setShowShareModal(false);
    router.replace("/setups");
  };

  if (!showShareModal || !pendingSetup) return null;

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "16px" }}>
      <div style={{ backgroundColor: "#111827", padding: "24px", borderRadius: "16px", maxWidth: "420px", width: "100%", border: "1px solid #38bdf8", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
        {published ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <span style={{ fontSize: "32px" }}>✅</span>
            <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginTop: "12px" }}>Setup Publicado!</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>A redirecionar...</p>
          </div>
        ) : (
          <>
            <h3 style={{ color: "#ffffff", fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>Confirmar Partilha de Setup</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>Recebemos este registo da tua app RideTune. Confirmas a publicação?</p>
            <div style={{ backgroundColor: "#1e293b", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={{ color: "#38bdf8", fontWeight: "bold", fontSize: "15px", margin: 0 }}>{pendingSetup.bike}</p>
              <p style={{ color: "#cbd5e1", fontSize: "13px", marginTop: "6px", marginBottom: 0 }}>{pendingSetup.setup}</p>
              {pendingSetup.notes ? <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "6px", fontStyle: "italic", margin: 0 }}>"{pendingSetup.notes}"</p> : null}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={handleClose} style={{ padding: "10px 16px", borderRadius: "8px", background: "transparent", color: "#94a3b8", border: "1px solid #334155", cursor: "pointer", fontWeight: "600" }}>Cancelar</button>
              <button onClick={handleConfirm} style={{ padding: "10px 16px", borderRadius: "8px", background: "#38bdf8", color: "#090d16", fontWeight: "bold", border: "none", cursor: "pointer" }}>Publicar Setup</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SetupsPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#090d16", color: "#fff", padding: "24px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>Setups Públicos</h1>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>Explora e partilha afinações de suspensão da comunidade RideTune.</p>
      
      <Suspense fallback={null}>
        <ShareConfirmationModal />
      </Suspense>
    </main>
  );
}
