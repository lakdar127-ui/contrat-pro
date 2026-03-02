import { useState, useRef } from "react";

const STEPS = ["landing", "form", "generating", "preview", "payment"];

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d0d;
    --paper: #f5f0e8;
    --cream: #ede8da;
    --gold: #c9a84c;
    --gold-light: #e8d5a3;
    --rust: #b84a2e;
    --muted: #7a7468;
  }

  body { background: var(--paper); font-family: 'DM Sans', sans-serif; color: var(--ink); }

  .app {
    min-height: 100vh;
    background: var(--paper);
    background-image: 
      radial-gradient(ellipse at 10% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* LANDING */
  .landing {
    max-width: 900px;
    margin: 0 auto;
    padding: 80px 24px;
    text-align: center;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    border: 1px solid var(--gold-light);
    padding: 6px 16px;
    border-radius: 2px;
    margin-bottom: 40px;
    background: rgba(201,168,76,0.06);
  }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(48px, 8vw, 96px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
    color: var(--ink);
  }

  .hero-title em {
    font-style: italic;
    color: var(--gold);
    display: block;
  }

  .hero-sub {
    font-size: 18px;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 56px;
  }

  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--ink);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 18px 40px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .cta-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 0;
  }

  .cta-btn:hover::after { transform: translateX(0); }
  .cta-btn span { position: relative; z-index: 1; }
  .cta-btn:hover { color: var(--ink); }

  .pricing-note {
    margin-top: 20px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--cream);
    border: 1px solid var(--cream);
    margin-top: 80px;
    text-align: left;
  }

  .feature {
    background: var(--paper);
    padding: 32px 28px;
  }

  .feature-num {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    color: var(--gold-light);
    font-weight: 700;
    line-height: 1;
    margin-bottom: 16px;
  }

  .feature-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .feature-text {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    font-weight: 300;
  }

  .social-proof {
    margin-top: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  .dot { color: var(--gold); }

  /* FORM */
  .form-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 60px 24px;
  }

  .form-header {
    margin-bottom: 48px;
  }

  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .form-subtitle {
    color: var(--muted);
    font-size: 14px;
    font-weight: 300;
  }

  .form-section {
    margin-bottom: 40px;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--cream);
  }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .col-span-2 { grid-column: span 2; }

  .field { display: flex; flex-direction: column; gap: 6px; }

  .field label {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  .field input, .field select, .field textarea {
    background: white;
    border: 1px solid var(--cream);
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
    border-radius: 0;
    -webkit-appearance: none;
  }

  .field input:focus, .field select:focus, .field textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
  }

  .field textarea { resize: vertical; min-height: 80px; }

  .submit-btn {
    width: 100%;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 18px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .submit-btn:hover { background: var(--gold); color: var(--ink); }

  /* GENERATING */
  .generating {
    max-width: 500px;
    margin: 0 auto;
    padding: 120px 24px;
    text-align: center;
  }

  .gen-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    margin-bottom: 16px;
  }

  .gen-sub { color: var(--muted); font-size: 14px; margin-bottom: 48px; }

  .progress-bar {
    height: 2px;
    background: var(--cream);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .progress-fill {
    height: 100%;
    background: var(--gold);
    border-radius: 2px;
    animation: progress 3s ease-out forwards;
  }

  @keyframes progress {
    from { width: 0%; }
    to { width: 100%; }
  }

  .gen-steps { text-align: left; display: flex; flex-direction: column; gap: 12px; }

  .gen-step {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    opacity: 0;
    animation: fadeIn 0.4s forwards;
  }

  .gen-step:nth-child(1) { animation-delay: 0.2s; }
  .gen-step:nth-child(2) { animation-delay: 0.8s; }
  .gen-step:nth-child(3) { animation-delay: 1.4s; }
  .gen-step:nth-child(4) { animation-delay: 2.0s; }

  @keyframes fadeIn { to { opacity: 1; } }

  .step-dot {
    width: 6px; height: 6px;
    background: var(--gold);
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* PREVIEW */
  .preview-container {
    max-width: 860px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .preview-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
  }

  .preview-actions { display: flex; gap: 12px; }

  .btn-secondary {
    padding: 10px 20px;
    border: 1px solid var(--cream);
    background: transparent;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    color: var(--muted);
    transition: all 0.2s;
  }

  .btn-secondary:hover { border-color: var(--ink); color: var(--ink); }

  .btn-primary {
    padding: 10px 24px;
    background: var(--ink);
    color: var(--paper);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: background 0.2s;
  }

  .btn-primary:hover { background: var(--gold); color: var(--ink); }

  /* CONTRACT DOCUMENT */
  .contract-doc {
    background: white;
    border: 1px solid var(--cream);
    padding: 64px 72px;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.8;
    font-size: 14px;
    box-shadow: 0 4px 40px rgba(0,0,0,0.06);
    position: relative;
  }

  .contract-doc::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--gold), var(--rust));
  }

  .contract-watermark {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 900;
    color: rgba(201,168,76,0.04);
    pointer-events: none;
    white-space: nowrap;
    z-index: 0;
  }

  .contract-inner { position: relative; z-index: 1; }

  .contract-letterhead {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--cream);
  }

  .contract-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
  }

  .contract-brand span { color: var(--gold); }

  .contract-meta {
    text-align: right;
    font-size: 12px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }

  .contract-main-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
    letter-spacing: -0.01em;
  }

  .contract-subtitle {
    text-align: center;
    font-size: 12px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .parties-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 40px;
  }

  .party-box {
    background: var(--paper);
    padding: 20px 24px;
    border-left: 3px solid var(--gold);
  }

  .party-role {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }

  .party-name { font-weight: 500; font-size: 16px; margin-bottom: 4px; }
  .party-detail { font-size: 12px; color: var(--muted); }

  .contract-section { margin-bottom: 32px; }

  .contract-section h3 {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--cream);
  }

  .contract-section p { color: #333; font-size: 13px; line-height: 1.8; }
  .contract-section ul { list-style: none; padding: 0; }
  .contract-section ul li { padding: 4px 0; padding-left: 16px; position: relative; font-size: 13px; color: #333; }
  .contract-section ul li::before { content: '—'; position: absolute; left: 0; color: var(--gold); }

  .payment-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .payment-table td { padding: 10px 0; border-bottom: 1px solid var(--cream); }
  .payment-table tr:last-child td { border-bottom: none; }
  .payment-table .label { color: var(--muted); }
  .payment-table .value { text-align: right; font-weight: 500; }
  .payment-table .total-row td { font-weight: 600; font-size: 16px; padding-top: 16px; }
  .payment-table .total-row .value { color: var(--gold); }

  .signatures {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid var(--cream);
  }

  .sig-block {}
  .sig-role { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 32px; }
  .sig-line { border-top: 1px solid var(--ink); padding-top: 8px; font-size: 12px; color: var(--muted); }

  /* PAYMENT SCREEN */
  .payment-screen {
    max-width: 480px;
    margin: 0 auto;
    padding: 80px 24px;
  }

  .payment-card {
    background: white;
    border: 1px solid var(--cream);
    padding: 48px;
    text-align: center;
    box-shadow: 0 4px 40px rgba(0,0,0,0.06);
  }

  .payment-icon {
    width: 56px;
    height: 56px;
    background: var(--paper);
    border: 1px solid var(--gold-light);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
    font-size: 24px;
  }

  .payment-card h2 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    margin-bottom: 8px;
  }

  .payment-card p { color: var(--muted); font-size: 14px; margin-bottom: 32px; }

  .price-display {
    font-family: 'Playfair Display', serif;
    font-size: 56px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 8px;
  }

  .price-period {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .pay-features { 
    text-align: left;
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pay-feature {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--muted);
  }

  .check { color: var(--gold); font-weight: bold; }

  .pay-btn {
    width: 100%;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 18px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }

  .pay-btn:hover { background: var(--gold); color: var(--ink); }

  .secure-note {
    margin-top: 16px;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* SUCCESS */
  .success-screen {
    max-width: 480px;
    margin: 0 auto;
    padding: 120px 24px;
    text-align: center;
  }

  .success-icon { font-size: 48px; margin-bottom: 24px; }

  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    margin-bottom: 12px;
  }

  .success-sub { color: var(--muted); font-size: 14px; margin-bottom: 40px; line-height: 1.7; }

  .download-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--gold);
    color: var(--ink);
    border: none;
    padding: 18px 40px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 500;
  }

  /* NAV */
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 48px;
    border-bottom: 1px solid var(--cream);
  }

  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
  }

  .nav-brand span { color: var(--gold); }

  .nav-badge {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  @media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; }
    .form-grid-3 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: span 1; }
    .parties-grid { grid-template-columns: 1fr; }
    .contract-doc { padding: 32px 24px; }
    .features { grid-template-columns: 1fr; }
    .signatures { grid-template-columns: 1fr; }
    .nav { padding: 16px 24px; }
  }
`;

// ---- APERÇU SEULEMENT : 3 premiers articles, pas les clauses sensibles ----
async function generatePreviewWithAI(formData) {
  const prompt = `Tu es un expert juridique spécialisé dans les contrats freelance français. Génère UNIQUEMENT les 3 premiers articles d'un contrat de prestation de services en JSON.

DONNÉES :
- Prestataire : ${formData.freelanceName}, ${formData.freelanceJob}
- Client : ${formData.clientName}, ${formData.clientCompany || 'Particulier'}
- Mission : ${formData.missionTitle}
- Description : ${formData.missionDescription}
- Tarif : ${formData.rate} € (${formData.rateType})
- Durée : ${formData.duration}

Réponds UNIQUEMENT avec un JSON valide (sans backticks) :
{
  "contractNumber": "FC-${new Date().getFullYear()}-XXXX",
  "date": "date du jour en français",
  "objet": "2-3 phrases sur l'objet du contrat",
  "prestations": ["prestation 1", "prestation 2", "prestation 3"],
  "conditions_paiement": "1 phrase sur les conditions de paiement"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ---- CONTRAT COMPLET : généré uniquement après paiement ----
async function generateFullContractWithAI(formData) {
  const prompt = `Tu es un expert juridique spécialisé dans les contrats freelance français. Génère un contrat de prestation de services COMPLET en JSON.

DONNÉES DU CONTRAT :
- Prestataire : ${formData.freelanceName}, ${formData.freelanceJob}, ${formData.freelanceEmail}
- Client : ${formData.clientName}, ${formData.clientCompany || 'Particulier'}, ${formData.clientEmail}
- Mission : ${formData.missionTitle}
- Description : ${formData.missionDescription}
- Durée : ${formData.duration}
- Tarif : ${formData.rate} € (${formData.rateType})
- Livrable : ${formData.deliverable}
- Date début : ${formData.startDate}

Réponds UNIQUEMENT avec un JSON valide (sans backticks) :
{
  "contractNumber": "FC-${new Date().getFullYear()}-XXXX",
  "date": "date du jour en français",
  "objet": "2-3 phrases précises sur l'objet",
  "prestations": ["liste détaillée des prestations"],
  "obligations_freelance": ["liste des obligations du prestataire"],
  "obligations_client": ["liste des obligations du client"],
  "conditions_paiement": "texte complet sur conditions et délais",
  "propriete_intellectuelle": "clause propriété intellectuelle adaptée",
  "confidentialite": "clause de confidentialité complète",
  "resiliation": "conditions de résiliation détaillées",
  "litiges": "clause litiges, droit français, tribunal compétent"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ---- Main App ----
export default function ContratFreelanceApp() {
  const [step, setStep] = useState("landing");
  const [formData, setFormData] = useState({
    freelanceName: "", freelanceJob: "", freelanceEmail: "",
    clientName: "", clientCompany: "", clientEmail: "",
    missionTitle: "", missionDescription: "", duration: "",
    rate: "", rateType: "forfait", deliverable: "", startDate: ""
  });
  const [contractData, setContractData] = useState(null);
  const [error, setError] = useState(null);

  const update = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleGenerate = async () => {
    setStep("generating");
    setError(null);
    try {
      const data = await generatePreviewWithAI(formData);
      setContractData(data);
      setTimeout(() => setStep("preview"), 3200);
    } catch (e) {
      setError("Erreur lors de la génération. Veuillez réessayer.");
      setStep("form");
    }
  };
const handlePayment = () => {
  window.location.href = "https://buy.stripe.com/eVqfZa6GE4rgaKr8FxcV207";
};

  const handleDownload = () => {
    const content = buildContractText(formData, contractData);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrat-${formData.clientName.replace(/\s/g, "-").toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const buildContractText = (form, contract) => `
CONTRAT DE PRESTATION DE SERVICES
N° ${contract?.contractNumber || 'FC-2024-001'}
Date : ${contract?.date || new Date().toLocaleDateString('fr-FR')}

═══════════════════════════════════════

ENTRE LES SOUSSIGNÉS :

PRESTATAIRE : ${form.freelanceName}
Profession : ${form.freelanceJob}
Email : ${form.freelanceEmail}

CLIENT : ${form.clientName}
${form.clientCompany ? `Société : ${form.clientCompany}` : ''}
Email : ${form.clientEmail}

═══════════════════════════════════════

ARTICLE 1 - OBJET DU CONTRAT
${contract?.objet || ''}

ARTICLE 2 - PRESTATIONS
${(contract?.prestations || []).map(p => `• ${p}`).join('\n')}

ARTICLE 3 - CONDITIONS FINANCIÈRES
Tarif : ${form.rate} € (${form.rateType})
${contract?.conditions_paiement || ''}

ARTICLE 4 - OBLIGATIONS DU PRESTATAIRE
${(contract?.obligations_freelance || []).map(o => `• ${o}`).join('\n')}

ARTICLE 5 - OBLIGATIONS DU CLIENT
${(contract?.obligations_client || []).map(o => `• ${o}`).join('\n')}

ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE
${contract?.propriete_intellectuelle || ''}

ARTICLE 7 - CONFIDENTIALITÉ
${contract?.confidentialite || ''}

ARTICLE 8 - RÉSILIATION
${contract?.resiliation || ''}

ARTICLE 9 - LITIGES
${contract?.litiges || ''}

═══════════════════════════════════════

Fait en deux exemplaires originaux.

Le Prestataire : _______________________     Le Client : _______________________
${form.freelanceName}                        ${form.clientName}

Date et signature :                          Date et signature :
`;

  return (
    <div className="app">
      <style>{STYLE}</style>

      <nav className="nav">
        <div className="nav-brand">Contrat<span>.</span>Pro</div>
        <div className="nav-badge">Contrats juridiques par IA</div>
      </nav>

      {/* LANDING */}
      {step === "landing" && (
        <div className="landing">
          <div className="badge">✦ Alimenté par l'intelligence artificielle</div>
          <h1 className="hero-title">
            Votre contrat
            <em>en 60 secondes</em>
          </h1>
          <p className="hero-sub">
            Générez un contrat freelance professionnel, juridiquement solide, personnalisé pour votre mission. Téléchargez. Envoyez. Soyez payé.
          </p>
          <button className="cta-btn" onClick={() => setStep("form")}>
            <span>→ Créer mon contrat</span>
          </button>
          <p className="pricing-note">9€ par contrat · Paiement sécurisé · Téléchargement immédiat</p>

          <div className="features">
            <div className="feature">
              <div className="feature-num">01</div>
              <div className="feature-title">Remplissez le formulaire</div>
              <div className="feature-text">Vos infos, celles du client, la mission et le tarif. 2 minutes maximum.</div>
            </div>
            <div className="feature">
              <div className="feature-num">02</div>
              <div className="feature-title">L'IA rédige tout</div>
              <div className="feature-text">Clauses sur mesure, propriété intellectuelle, conditions de paiement et résiliation.</div>
            </div>
            <div className="feature">
              <div className="feature-num">03</div>
              <div className="feature-title">Téléchargez & signez</div>
              <div className="feature-text">PDF professionnel prêt à l'envoi. Juridiquement solide pour le droit français.</div>
            </div>
          </div>

          <div className="social-proof">
            <span>⭐ 4.9/5</span>
            <span className="dot">·</span>
            <span>+2 400 contrats générés</span>
            <span className="dot">·</span>
            <span>Droit français</span>
          </div>
        </div>
      )}

      {/* FORM */}
      {step === "form" && (
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Votre contrat sur mesure</h2>
            <p className="form-subtitle">Remplissez les informations ci-dessous — l'IA se charge du reste.</p>
            {error && <p style={{color: 'var(--rust)', fontSize: 13, marginTop: 12}}>{error}</p>}
          </div>

          <div className="form-section">
            <div className="section-label">Vos informations (prestataire)</div>
            <div className="form-grid">
              <div className="field">
                <label>Nom complet *</label>
                <input placeholder="Marie Dupont" value={formData.freelanceName} onChange={e => update("freelanceName", e.target.value)} />
              </div>
              <div className="field">
                <label>Métier / Titre *</label>
                <input placeholder="Développeur Web Freelance" value={formData.freelanceJob} onChange={e => update("freelanceJob", e.target.value)} />
              </div>
              <div className="field col-span-2">
                <label>Email professionnel *</label>
                <input placeholder="marie@dupont.fr" value={formData.freelanceEmail} onChange={e => update("freelanceEmail", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Informations client</div>
            <div className="form-grid">
              <div className="field">
                <label>Nom du client *</label>
                <input placeholder="Jean Martin" value={formData.clientName} onChange={e => update("clientName", e.target.value)} />
              </div>
              <div className="field">
                <label>Société (si applicable)</label>
                <input placeholder="Martin SAS" value={formData.clientCompany} onChange={e => update("clientCompany", e.target.value)} />
              </div>
              <div className="field col-span-2">
                <label>Email du client *</label>
                <input placeholder="jean@martin-sas.fr" value={formData.clientEmail} onChange={e => update("clientEmail", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">La mission</div>
            <div className="form-grid">
              <div className="field col-span-2">
                <label>Titre de la mission *</label>
                <input placeholder="Création d'un site e-commerce sur Shopify" value={formData.missionTitle} onChange={e => update("missionTitle", e.target.value)} />
              </div>
              <div className="field col-span-2">
                <label>Description détaillée *</label>
                <textarea placeholder="Décrivez les tâches, le périmètre, les livrables attendus..." value={formData.missionDescription} onChange={e => update("missionDescription", e.target.value)} />
              </div>
              <div className="field col-span-2">
                <label>Livrable principal *</label>
                <input placeholder="Site Shopify complet, hébergé et fonctionnel" value={formData.deliverable} onChange={e => update("deliverable", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Conditions financières</div>
            <div className="form-grid-3">
              <div className="field">
                <label>Tarif (€) *</label>
                <input type="number" placeholder="3500" value={formData.rate} onChange={e => update("rate", e.target.value)} />
              </div>
              <div className="field">
                <label>Type de tarif *</label>
                <select value={formData.rateType} onChange={e => update("rateType", e.target.value)}>
                  <option value="forfait">Forfait global</option>
                  <option value="jour">Tarif journalier (TJM)</option>
                  <option value="heure">Tarif horaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>
              <div className="field">
                <label>Durée *</label>
                <input placeholder="3 semaines" value={formData.duration} onChange={e => update("duration", e.target.value)} />
              </div>
              <div className="field">
                <label>Date de début *</label>
                <input type="date" value={formData.startDate} onChange={e => update("startDate", e.target.value)} />
              </div>
            </div>
          </div>

          <button className="submit-btn" onClick={handleGenerate}
            disabled={!formData.freelanceName || !formData.clientName || !formData.missionTitle || !formData.rate}>
            <span>⚡ Générer mon contrat avec l'IA</span>
          </button>
          <p style={{textAlign:'center', marginTop: 12, fontSize: 12, color: 'var(--muted)', fontFamily: "'DM Mono', monospace"}}>
            Paiement demandé uniquement après prévisualisation
          </p>
        </div>
      )}

      {/* GENERATING */}
      {step === "generating" && (
        <div className="generating">
          <h2 className="gen-title">Rédaction en cours…</h2>
          <p className="gen-sub">Notre IA rédige votre contrat sur mesure</p>
          <div className="progress-bar">
            <div className="progress-fill" />
          </div>
          <div className="gen-steps">
            {["Analyse de votre mission", "Rédaction des clauses juridiques", "Adaptation au droit français", "Finalisation du document"].map((s, i) => (
              <div className="gen-step" key={i}>
                <div className="step-dot" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {step === "preview" && contractData && (
        <div className="preview-container">
          <div className="preview-header">
            <div>
              <h2 className="preview-title">Aperçu de votre contrat</h2>
              <p style={{fontSize: 13, color: 'var(--muted)', fontFamily: "'DM Mono', monospace", marginTop: 4}}>
                Version préliminaire — payez pour télécharger en PDF
              </p>
            </div>
            <div className="preview-actions">
              <button className="btn-secondary" onClick={() => setStep("form")}>← Modifier</button>
              <button className="btn-primary" onClick={() => setStep("payment")}>Débloquer le PDF →</button>
            </div>
          </div>

          <div className="contract-doc">
            <div className="contract-watermark">APERÇU</div>
            <div className="contract-inner">
              <div className="contract-letterhead">
                <div>
                  <div className="contract-brand">Contrat<span>.</span>Pro</div>
                  <div style={{fontSize: 12, color: 'var(--muted)', marginTop: 4, fontFamily: "'DM Sans', sans-serif"}}>
                    Contrats freelance professionnels
                  </div>
                </div>
                <div className="contract-meta">
                  <div>N° {contractData.contractNumber}</div>
                  <div style={{marginTop: 4}}>{contractData.date}</div>
                </div>
              </div>

              <div className="contract-main-title">Contrat de Prestation de Services</div>
              <div className="contract-subtitle">Mission Freelance · Droit Français</div>

              <div className="parties-grid">
                <div className="party-box">
                  <div className="party-role">Prestataire</div>
                  <div className="party-name">{formData.freelanceName}</div>
                  <div className="party-detail">{formData.freelanceJob}</div>
                  <div className="party-detail">{formData.freelanceEmail}</div>
                </div>
                <div className="party-box">
                  <div className="party-role">Client</div>
                  <div className="party-name">{formData.clientName}</div>
                  {formData.clientCompany && <div className="party-detail">{formData.clientCompany}</div>}
                  <div className="party-detail">{formData.clientEmail}</div>
                </div>
              </div>

              <div className="contract-section">
                <h3>Article 1 — Objet du contrat</h3>
                <p>{contractData.objet}</p>
              </div>

              <div className="contract-section">
                <h3>Article 2 — Prestations</h3>
                <ul>{(contractData.prestations || []).map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>

              <div className="contract-section">
                <h3>Article 3 — Conditions financières</h3>
                <table className="payment-table">
                  <tbody>
                    <tr><td className="label">Type de tarif</td><td className="value">{formData.rateType}</td></tr>
                    <tr><td className="label">Durée</td><td className="value">{formData.duration}</td></tr>
                    <tr><td className="label">Date de début</td><td className="value">{formData.startDate}</td></tr>
                    <tr className="total-row"><td className="label">Montant total</td><td className="value">{formData.rate} €</td></tr>
                  </tbody>
                </table>
                <p style={{marginTop: 12}}>{contractData.conditions_paiement}</p>
              </div>

              <div className="contract-section">
                <h3>Article 4 — Obligations du prestataire</h3>
                <ul>{(contractData.obligations_freelance || []).map((o, i) => <li key={i}>{o}</li>)}</ul>
              </div>

              <div className="contract-section">
                <h3>Article 5 — Obligations du client</h3>
                <ul>{(contractData.obligations_client || []).map((o, i) => <li key={i}>{o}</li>)}</ul>
              </div>

              <div className="contract-section">
                <h3>Article 6 — Propriété intellectuelle</h3>
                <p>{contractData.propriete_intellectuelle}</p>
              </div>

              <div className="contract-section" style={{filter: step === 'preview' ? 'blur(4px)' : 'none', userSelect: 'none'}}>
                <h3>Article 7 — Confidentialité</h3>
                <p>{contractData.confidentialite}</p>
              </div>

              <div className="contract-section" style={{filter: 'blur(4px)', userSelect: 'none'}}>
                <h3>Article 8 — Résiliation & Litiges</h3>
                <p>🔒 Débloquez le PDF pour accéder aux clauses complètes de résiliation et litiges...</p>
              </div>

              <div className="signatures" style={{filter: 'blur(4px)', userSelect: 'none'}}>
                <div className="sig-block">
                  <div className="sig-role">Prestataire</div>
                  <div className="sig-line">{formData.freelanceName}</div>
                </div>
                <div className="sig-block">
                  <div className="sig-role">Client</div>
                  <div className="sig-line">{formData.clientName}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: 24}}>
            <button className="btn-primary" style={{padding: '16px 48px', fontSize: 13}} onClick={() => setStep("payment")}>
              🔓 Débloquer & télécharger le PDF complet — 9€
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT */}
      {step === "payment" && (
        <div className="payment-screen">
          <div className="payment-card">
            <div className="payment-icon">📄</div>
            <h2>Télécharger votre contrat</h2>
            <p>Votre contrat juridique personnalisé est prêt</p>
            <div className="price-display">9€</div>
            <div className="price-period">Paiement unique · Ce contrat uniquement</div>
            <div className="pay-features">
              {["Contrat complet avec toutes les clauses", "Export en PDF haute qualité", "Droit français, juridiquement solide", "Accès immédiat après paiement", "Support par email inclus"].map((f, i) => (
                <div className="pay-feature" key={i}><span className="check">✓</span> {f}</div>
              ))}
            </div>
            <button className="pay-btn" onClick={handlePayment}>
              → Payer 9€ et télécharger
            </button>
            <p className="secure-note">🔒 Paiement sécurisé par Stripe · SSL 256-bit</p>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === "success" && (
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2 className="success-title">Paiement confirmé !</h2>
          <p className="success-sub">
            Votre contrat est prêt. Téléchargez-le, envoyez-le à votre client et commencez votre mission en toute sérénité.
          </p>
          <button className="download-btn" onClick={handleDownload}>
            ⬇ Télécharger mon contrat
          </button>
          <p style={{marginTop: 24, fontSize: 12, color: 'var(--muted)', fontFamily: "'DM Mono', monospace"}}>
            Un email de confirmation vous a été envoyé à {formData.freelanceEmail}
          </p>
          <button className="btn-secondary" style={{margin: '24px auto', display: 'block'}}
            onClick={() => { setStep("landing"); setFormData({ freelanceName:"",freelanceJob:"",freelanceEmail:"",clientName:"",clientCompany:"",clientEmail:"",missionTitle:"",missionDescription:"",duration:"",rate:"",rateType:"forfait",deliverable:"",startDate:"" }); setContractData(null); }}>
            ← Créer un autre contrat
          </button>
        </div>
      )}
    </div>
  );
}
