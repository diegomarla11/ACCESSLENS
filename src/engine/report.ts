import { analyze } from "./analyze";
import { parseScenario, type Scenario } from "./schema";
export const statusLabels = {
  risk: "Riesgo",
  clear: "Sin hallazgo",
  unknown: "No evaluado",
  "not-applicable": "No aplica",
};
export function reportData(before: Scenario, after: Scenario) {
  return {
    formatVersion: "1.0",
    laboratory: true,
    scope:
      "Datos sintéticos; sin conexión a proveedores. Solo tres reglas del modelo propio.",
    before: { scenario: parseScenario(before), evaluations: analyze(before) },
    after: { scenario: parseScenario(after), evaluations: analyze(after) },
  };
}
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function reportHtml(before: Scenario, after: Scenario): string {
  const d = reportData(before, after);
  const section = (label: string, data: typeof d.before) =>
    `<h2>${label}</h2><p>${data.evaluations.filter((f) => f.status === "risk").length} riesgos · ${data.evaluations.filter((f) => f.status === "unknown").length} no evaluados</p>${data.evaluations.map((f) => `<article><h3>${escape(f.title)} · ${escape(f.identityId)}</h3><p>${statusLabels[f.status]} ${f.severity || ""}</p><p>${escape(f.reason)}</p><ul>${f.evidence.map((e) => `<li>${escape(e)}</li>`).join("")}</ul><p>Propuesta: ${escape(f.proposal)}</p></article>`).join("")}`;
  return `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>AccessLens · Informe</title><style>body{font:15px system-ui;max-width:900px;margin:40px auto;padding:20px;color:#182d29}article{border-top:1px solid #ccc;padding:12px 0;break-inside:avoid}li{overflow-wrap:anywhere}@media print{body{margin:0}}</style><h1>AccessLens · ${escape(after.name)}</h1><p>${escape(d.scope)} Informe imprimible mediante Archivo → Imprimir.</p>${section("Antes", d.before)}${section("Después", d.after)}</html>`;
}
