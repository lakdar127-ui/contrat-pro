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

    const data = await response.json();
    const text = data.content.map(i => i.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: "Erreur génération" });
  }
}