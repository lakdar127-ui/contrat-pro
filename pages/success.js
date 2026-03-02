import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");
  const [contractData, setContractData] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      generateContract();
    }
  }, [router.isReady]);

  const generateContract = async () => {
    try {
      const raw = localStorage.getItem("contratFormData");
      if (!raw) {
        setStatus("error");
        return;
      }

      let saved;
      try {
        saved = JSON.parse(raw);
      } catch {
        setStatus("error");
        return;
      }

      if (
        !saved.freelanceName ||
        !saved.clientName ||
        !saved.missionTitle
      ) {
        setStatus("error");
        return;
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: saved, type: "full" })
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      const data = await response.json();
      setContractData(data);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  };
  const handleDownload = () => {
    const saved = JSON.parse(localStorage.getItem("contratFormData") || "{}");
    const content = "CONTRAT DE PRESTATION DE SERVICES\nN° " + contractData?.contractNumber + "\nDate : " + contractData?.date + "\n\nPRESTATAIRE : " + saved.freelanceName + "\nMétier : " + saved.freelanceJob + "\nEmail : " + saved.freelanceEmail + "\n\nCLIENT : " + saved.clientName + "\nEmail : " + saved.clientEmail + "\n\nARTICLE 1 - OBJET\n" + contractData?.objet + "\n\nARTICLE 2 - PRESTATIONS\n" + (contractData?.prestations || []).join("\n") + "\n\nARTICLE 3 - CONDITIONS FINANCIÈRES\n" + saved.rate + "€ - " + contractData?.conditions_paiement + "\n\nARTICLE 4 - OBLIGATIONS PRESTATAIRE\n" + (contractData?.obligations_freelance || []).join("\n") + "\n\nARTICLE 5 - OBLIGATIONS CLIENT\n" + (contractData?.obligations_client || []).join("\n") + "\n\nARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE\n" + contractData?.propriete_intellectuelle + "\n\nARTICLE 7 - CONFIDENTIALITÉ\n" + contractData?.confidentialite + "\n\nARTICLE 8 - RÉSILIATION\n" + contractData?.resiliation + "\n\nARTICLE 9 - LITIGES\n" + contractData?.litiges + "\n\nSignatures :\n" + saved.freelanceName + " : _____________    " + saved.clientName + " : _____________";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contrat-" + (saved.clientName || "client").replace(/\s/g, "-") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", padding: "48px", maxWidth: "480px", width: "100%", textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,0.06)" }}>
        {status === "loading" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⏳</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Génération en cours...</h2>
            <p style={{ color: "#7a7468" }}>Votre contrat est en cours de rédaction</p>
          </>
        )}
        {status === "ready" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 24 }}>✅</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Paiement confirmé !</h2>
            <p style={{ color: "#7a7468", marginBottom: 32 }}>Votre contrat complet est prêt</p>
            <button onClick={handleDownload} style={{ background: "#c9a84c", color: "#0d0d0d", border: "none", padding: "18px 40px", cursor: "pointer", fontSize: 14, fontWeight: 600, width: "100%" }}>
              ⬇ Télécharger mon contrat
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <div style={{ fontSize: 48, marginBottom: 24 }}>❌</div>
            <h2 style={{ fontSize: 24, marginBottom: 12 }}>Une erreur est survenue</h2>
            <p style={{ color: "#7a7468", marginBottom: 8 }}>
              Impossible de retrouver les informations de votre contrat ou de terminer la génération.
            </p>
            <p style={{ color: "#7a7468" }}>Merci de regénérer un contrat depuis la page d’accueil ou contactez : support@contrat-pro.fr</p>
          </>
        )}
      </div>
    </div>
  );
}