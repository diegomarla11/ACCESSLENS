import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { scenarios } from "./data/scenarios";
import { analyze, permissionsFor, remediate } from "./engine/analyze";
import { reportData, reportHtml, statusLabels } from "./engine/report";
import "./style.css";
const codeUrl = (import.meta as ImportMeta & { env: Record<string, string> })
  .env.VITE_REPOSITORY_URL;
function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function App() {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(() => structuredClone(scenarios[0]));
  const [tab, setTab] = useState<"review" | "inventory">("review");
  const [filter, setFilter] = useState("attention");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("identities");
  const [tour, setTour] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [english, setEnglish] = useState(false);
  const original = scenarios[index];
  const before = analyze(original);
  const results = analyze(current);
  const risks = results.filter((f) => f.status === "risk");
  const unknown = results.filter((f) => f.status === "unknown");
  const previous = before.filter((f) => f.status === "risk").length;
  const changed = JSON.stringify(original) !== JSON.stringify(current);
  function select(i: number) {
    setIndex(i);
    setCurrent(structuredClone(scenarios[i]));
    setNotice("Escenario cargado.");
    setFilter("attention");
  }
  const tourSteps = [
    {
      title: "1. Elige un caso",
      text: "Prueba uno de los tres escenarios. Todos los datos son ficticios.",
    },
    {
      title: "2. Sigue la evidencia",
      text: "Abre un hallazgo y revisa sus metadatos, la gravedad y los permisos que lo explican.",
    },
    {
      title: "3. Corrige y compara",
      text: "Aplica una corrección en memoria. Revisa el antes/después y exporta el informe.",
    },
  ];
  return (
    <>
      <a className="skip" href="#workspace">
        Saltar al análisis
      </a>
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brandmark">◈</span>access<span>lens</span>
          <span className="lab">LAB</span>
        </a>
        <nav aria-label="Principal">
          <a href="#workspace">Laboratorio</a>
          <a href="#about">Sobre el proyecto</a>
          {codeUrl ? (
            <a href={codeUrl} target="_blank" rel="noreferrer">
              Código ↗
            </a>
          ) : (
            <span>Código · pendiente de publicar</span>
          )}
        </nav>
        <span className="local">
          <i /> Procesamiento local
        </span>
      </header>
      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">IDENTIDAD · ACCESO · EVIDENCIA</div>
            <h1>
              ¿Quién conserva acceso
              <br />
              cuando ya no debería?
            </h1>
            <p>
              Revisa una organización ficticia, descubre riesgos y prueba cómo
              corregirlos. Todo en tu navegador, con evidencia en cada decisión.
            </p>
            <div className="hero-actions">
              <a className="primary button" href="#workspace">
                Explorar el laboratorio <span>↗</span>
              </a>
              <button
                className="text-button"
                onClick={() => {
                  setTour(0);
                  setTab("review");
                  document
                    .getElementById("workspace")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Recorrido de 2 minutos <span>→</span>
              </button>
            </div>
          </div>
          <aside className="hero-note">
            <span className="note-icon">⌁</span>
            <h2>
              Los accesos cuentan
              <br />
              una historia.
            </h2>
            <p>
              Una baja olvidada.
              <br />
              Un segundo factor ausente.
              <br />
              Un permiso de más.
            </p>
            <span className="note-foot">
              3 riesgos de acceso habituales.
              <br />
              100% datos sintéticos.
            </span>
          </aside>
        </section>
        <section id="workspace" aria-label="Laboratorio de revisión">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EL LABORATORIO</span>
              <h2>De la sospecha a la evidencia</h2>
            </div>
            <span className="pill">
              Sin cuenta · Sin conexión a proveedores
            </span>
          </div>
          {tour !== null && (
            <aside className="tour" aria-label="Recorrido guiado">
              <div>
                <strong>{tourSteps[tour].title}</strong>
                <p>{tourSteps[tour].text}</p>
              </div>
              <div>
                <button
                  onClick={() =>
                    tour === 2 ? setTour(null) : setTour(tour + 1)
                  }
                >
                  {tour === 2 ? "Finalizar" : "Siguiente →"}
                </button>
                <button className="text-button" onClick={() => setTour(null)}>
                  Cerrar recorrido
                </button>
              </div>
            </aside>
          )}
          <div className="workspace">
            <aside className="sidebar">
              <div className="sidebar-label">
                ESCENARIOS <span>03</span>
              </div>
              {scenarios.map((s, i) => (
                <button
                  key={s.id}
                  aria-pressed={index === i}
                  className={`scenario ${index === i ? "selected" : ""}`}
                  onClick={() => select(i)}
                >
                  <span className="scenario-num">0{i + 1}</span>
                  <span>
                    <strong>
                      {
                        [
                          "Una baja pendiente",
                          "Sin segundo factor",
                          "Demasiado poder",
                        ][i]
                      }
                    </strong>
                    <small>
                      {
                        [
                          "Ciclo de vida · Offboarding",
                          "Autenticación · MFA",
                          "Privilegios · Servicios",
                        ][i]
                      }
                    </small>
                  </span>
                  <span aria-hidden="true">{index === i ? "↗" : "›"}</span>
                </button>
              ))}
              <div className="sidebar-bottom">
                <span className="small-label">ENTORNO DE PRUEBA</span>
                <strong>Organización Atlas</strong>
                <p>
                  Los cambios viven en esta pestaña. Puedes reiniciar cuando
                  quieras.
                </p>
                <button
                  className="reset"
                  onClick={() => {
                    select(index);
                    setNotice("Escenario reiniciado a su estado original.");
                  }}
                >
                  ↺ Reiniciar escenario
                </button>
              </div>
            </aside>
            <div className="analysis">
              <div className="analysis-header">
                <div>
                  <span className="small-label">
                    REVISIÓN DE ACCESOS / {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{original.name.slice(5)}</h3>
                  <p>{original.description}</p>
                </div>
                <span className="pill green">● Motor determinista</span>
              </div>
              <div className="stats">
                <div>
                  <span>Riesgos detectados</span>
                  <strong className="risk-number">
                    {risks.length}
                    <small> en el escenario actual</small>
                  </strong>
                </div>
                <div>
                  <span>No evaluados</span>
                  <strong>
                    {unknown.length}
                    <small> datos insuficientes</small>
                  </strong>
                </div>
                <div>
                  <span>Antes → Después</span>
                  <strong className="comparison">
                    {previous} <span>→</span> {risks.length}
                    <small>
                      {changed ? " copia modificada" : " sin cambios"}
                    </small>
                  </strong>
                </div>
              </div>
              <div
                className="tabs"
                role="tablist"
                aria-label="Vistas"
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? "review"
                      : event.key === "End"
                        ? "inventory"
                        : tab === "review"
                          ? "inventory"
                          : "review";
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }}
              >
                <button
                  id="tab-review"
                  tabIndex={tab === "review" ? 0 : -1}
                  aria-controls="panel-review"
                  role="tab"
                  aria-selected={tab === "review"}
                  onClick={() => setTab("review")}
                >
                  Hallazgos <span>{risks.length + unknown.length}</span>
                </button>
                <button
                  id="tab-inventory"
                  tabIndex={tab === "inventory" ? 0 : -1}
                  aria-controls="panel-inventory"
                  role="tab"
                  aria-selected={tab === "inventory"}
                  onClick={() => setTab("inventory")}
                >
                  Inventario <span>{current.identities.length}</span>
                </button>
              </div>
              {changed && (
                <details className="change-log">
                  <summary>Ver cambios respecto al original</summary>
                  <ul>
                    {current.identities.flatMap((identity) => {
                      const old = original.identities.find(
                        (u) => u.id === identity.id,
                      )!;
                      return (["enabled", "mfa", "roleIds"] as const)
                        .filter(
                          (key) =>
                            JSON.stringify(old[key]) !==
                            JSON.stringify(identity[key]),
                        )
                        .map((key) => (
                          <li key={`${identity.id}-${key}`}>
                            <strong>{identity.name}</strong> · {key}:{" "}
                            <code>{JSON.stringify(old[key])}</code> →{" "}
                            <code>{JSON.stringify(identity[key])}</code>
                          </li>
                        ));
                    })}
                  </ul>
                  <p>Solo se ha modificado esta copia sintética.</p>
                </details>
              )}
              <div role="status" className="notice">
                {notice}
              </div>
              {tab === "review" ? (
                <div
                  id="panel-review"
                  role="tabpanel"
                  aria-labelledby="tab-review"
                >
                  <div className="list-heading">
                    <h4>Lo que merece tu atención</h4>
                    <label className="filter">
                      Mostrar{" "}
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="attention">
                          Riesgos y no evaluados
                        </option>
                        <option value="all">Todas las evaluaciones</option>
                        <option value="risk">Solo riesgos</option>
                      </select>
                    </label>
                  </div>
                  <div className="findings">
                    {results
                      .filter(
                        (f) =>
                          filter === "all" ||
                          (filter === "risk"
                            ? f.status === "risk"
                            : ["risk", "unknown"].includes(f.status)),
                      )
                      .map((f) => (
                        <article className={`finding ${f.status}`} key={f.id}>
                          <div className="finding-top">
                            <span className={`severity ${f.status}`}>
                              {f.status === "risk"
                                ? `● ${f.severity}`
                                : statusLabels[f.status]}
                            </span>
                            <code>{f.rule}</code>
                            <span className="identity-tag">
                              {
                                current.identities.find(
                                  (u) => u.id === f.identityId,
                                )?.name
                              }
                            </span>
                          </div>
                          <h4>{f.title}</h4>
                          <p>{f.reason}</p>
                          <details>
                            <summary>Evidencia y corrección propuesta</summary>
                            <ul className="evidence">
                              {f.evidence.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                            <p>
                              <strong>Propuesta:</strong> {f.proposal}
                            </p>
                          </details>
                          {f.status === "risk" && (
                            <button
                              className="fix"
                              onClick={() => {
                                try {
                                  setCurrent(remediate(current, f.id));
                                  setNotice(
                                    `Corrección aplicada a ${f.identityId}. Resultados recalculados en la copia.`,
                                  );
                                } catch (error) {
                                  setNotice(
                                    error instanceof Error
                                      ? error.message
                                      : "No se ha podido aplicar la corrección.",
                                  );
                                }
                              }}
                            >
                              Aplicar corrección en la copia <span>→</span>
                            </button>
                          )}
                          {f.status === "unknown" && (
                            <p className="unknown-note">
                              No se interpreta la falta de datos como seguridad.
                            </p>
                          )}
                        </article>
                      ))}
                    {!results.some(
                      (f) =>
                        filter === "all" ||
                        (filter === "risk"
                          ? f.status === "risk"
                          : ["risk", "unknown"].includes(f.status)),
                    ) && (
                      <div className="empty">
                        <strong>Sin riesgos en esta vista</strong>
                        <p>
                          Consulta todas las evaluaciones para revisar los
                          controles. Esto no garantiza la seguridad de una
                          organización.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  id="panel-inventory"
                  role="tabpanel"
                  aria-labelledby="tab-inventory"
                >
                  <div className="inventory-tools">
                    <label>
                      Tipo de entidad
                      <select
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                      >
                        <option value="identities">Identidades</option>
                        <option value="roles">Roles</option>
                        <option value="permissions">Permisos</option>
                        <option value="resources">Recursos</option>
                      </select>
                    </label>
                    <label>
                      Buscar
                      <input
                        placeholder="Nombre, ID o permiso…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="inventory-list">
                    {current[
                      kind as
                        | "identities"
                        | "roles"
                        | "permissions"
                        | "resources"
                    ]
                      .filter((x) =>
                        JSON.stringify(x)
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((x) => (
                        <details key={x.id}>
                          <summary>
                            <strong>{"name" in x ? x.name : x.id}</strong>
                            <code>{x.id}</code>
                          </summary>
                          <pre>{JSON.stringify(x, null, 2)}</pre>
                          {kind === "identities" && (
                            <p>
                              Permisos efectivos:{" "}
                              {permissionsFor(current, x.id).join(", ") ||
                                "Ninguno"}
                            </p>
                          )}
                        </details>
                      ))}
                  </div>
                </div>
              )}
              <div className="export">
                <span>CONSERVA LA EVIDENCIA</span>
                <button
                  onClick={() =>
                    download(
                      "accesslens-results.json",
                      JSON.stringify(reportData(original, current), null, 2),
                      "application/json",
                    )
                  }
                >
                  ↓ Exportar JSON
                </button>
                <button
                  onClick={() =>
                    download(
                      "accesslens-report.html",
                      reportHtml(original, current),
                      "text/html",
                    )
                  }
                >
                  ↓ Informe HTML imprimible
                </button>
              </div>
            </div>
          </div>
          <div className="workspace-caption">
            <span>◈ Análisis real sobre un modelo propio y acotado.</span>
            <span>3 reglas · Datos sintéticos · Sin backend</span>
          </div>
        </section>
        <section id="about" className="about">
          <div>
            <span className="eyebrow">CONSTRUIDO PARA ENTENDER</span>
            <h2>
              Un laboratorio pequeño.
              <br />
              Decisiones explicables.
            </h2>
            <p>
              Proyecto personal de <strong>Diego Martínez Lafuente</strong>,
              graduado en Ingeniería Informática por la USAL. Una forma práctica
              de aprender revisión de accesos, mínimo privilegio, pruebas y
              CI/CD.
            </p>
            <button
              className="text-button"
              aria-expanded={english}
              onClick={() => setEnglish(!english)}
            >
              English summary {english ? "−" : "+"}
            </button>
            {english && (
              <p lang="en">
                AccessLens is a browser-based access review lab built with React
                and TypeScript. It evaluates synthetic identities using three
                deterministic rules, explains evidence and supports reversible
                scenario changes and report exports. It is a learning project,
                not a production IAM product or proof of professional cloud
                experience.
              </p>
            )}
          </div>
          <div className="limits">
            <h3>Qué puedes comprobar</h3>
            <p>
              Motor compartido con CLI, esquema validado, permisos derivados de
              roles y correcciones que recalculan cada resultado.
            </p>
            <h3>Dónde termina el MVP</h3>
            <p>
              No consulta accesos reales, sesiones, políticas AWS ni MFA de un
              proveedor. No representa una auditoría completa ni una
              certificación. Keycloak, AWS e IA son ampliaciones pendientes.
            </p>
            {codeUrl ? (
              <a href={codeUrl} target="_blank" rel="noreferrer">
                Consultar código y documentación ↗
              </a>
            ) : (
              <span>Repositorio pendiente de publicación.</span>
            )}
          </div>
        </section>
      </main>
      <footer>
        <span className="brand">◈ accesslens</span>
        <span>Hecho para aprender. Diseñado para poder explicarlo.</span>
        <a href="#">Volver arriba ↑</a>
      </footer>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
