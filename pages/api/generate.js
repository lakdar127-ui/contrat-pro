export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { formData, type } = req.body;

  const isPreview = type === "preview";

  const prompt = isPreview
    ? `Tu es un expert juridique. Génère UNIQUEMENT les 3 premiers articles d'un contrat freelance en JSON.
DONNÉES : Prestataire: ${formData.freelanceName}, ${formData.freelanceJob}. Client: ${formData.clientName}. Mission: ${formData.missionTitle}. Tarif: ${formData.rate}€ (${formData.rateType}). Durée: ${formData.duration}.
Réponds UNIQUEMENT en JSON valide sans backticks :
{"contractNumber":"FC-2026-XXXX","date":"date du jour","objet":"description","prestations":["item1","item2"],"conditions_paiement":"texte"}`
    : `Tu es un expert juridique. Génère un contrat freelance COMPLET en JSON.
DONNÉES : Prestataire: ${formData.freelanceName}, ${formData.freelanceJob}, ${formData.freelanceEmail}. Client: ${formData.clientName}, ${formData.clientCompany || ""}, ${formData.clientEmail}. Mission: ${formData.missionTitle}. Description: ${formData.missionDescription}. Durée: ${formData.duration}. Tarif: ${formData.rate}€ (${formData.rateType}). Livrable: ${formData.deliverable}. Début: ${formData.startDate}.
Réponds UNIQUEMENT en JSON valide sans backticks :
{"contractNumber":"FC-2026-XXXX","date":"date du jour","objet":"texte","prestations":["item"],"obligations_freelance":["item"],"obligations_client":["item"],"conditions_paiement":"texte","propriete_intellectuelle":"texte","confidentialite":"texte","resiliation":"texte","litiges":"texte"}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: isPreview ? 800 : 2000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      let errorDetail = "";
      try {
        const errorBody = await response.text();
        errorDetail = errorBody;
      } catch {
        // ignore parsing error of error body
      }
      console.error("Erreur HTTP depuis l'API Anthropic :", response.status, errorDetail);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'appel à l'API d'intelligence artificielle." });
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.content)) {
      console.error("Réponse inattendue de l'API Anthropic (champ content manquant ou invalide) :", data);
      return res
        .status(500)
        .json({ error: "Réponse inattendue de l'API d'intelligence artificielle." });
    }

    const text = data.content.map((item) => item.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseError) {
      console.error("Erreur lors du parsing JSON de la réponse Anthropic :", parseError, clean);
      return res
        .status(500)
        .json({ error: "Réponse IA invalide, impossible de générer le contrat." });
    }

    res.status(200).json(parsed);
  } catch (e) {
    console.error("Erreur inattendue dans l'API /api/generate :", e);
    res.status(500).json({ error: "Erreur génération" });
  }
}