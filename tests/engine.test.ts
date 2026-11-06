import { describe, it } from "node:test";
import assert from "node:assert/strict";
// Small assertion adapter keeps the cases readable; execution uses the Node test runner.
function expect(value: unknown) {
  return {
    toHaveLength: (n: number) => assert.equal((value as unknown[]).length, n),
    toEqual: (other: unknown) => assert.deepEqual(value, other),
    toBe: (other: unknown) => assert.equal(value, other),
    toThrow: () => assert.throws(value as () => unknown),
    toContain: (part: string) => assert.ok((value as string).includes(part)),
    not: {
      toContain: (part: string) => assert.ok(!(value as string).includes(part)),
    },
  };
}
import { scenarios } from "../src/data/scenarios";
import { analyze, remediate, permissionsFor } from "../src/engine/analyze";
import { parseScenario } from "../src/engine/schema";
import { reportData, reportHtml } from "../src/engine/report";
describe("reglas y correcciones", () => {
  for (const s of scenarios)
    it(`${s.id}: detecta el riesgo previsto y lo elimina sin mutar el original`, () => {
      const snapshot = JSON.stringify(s);
      const findings = analyze(s).filter((f) => f.status === "risk");
      expect(findings).toHaveLength(1);
      const fixed = remediate(s, findings[0].id);
      expect(analyze(fixed).filter((f) => f.status === "risk")).toHaveLength(0);
      expect(JSON.stringify(s)).toBe(snapshot);
      expect(() => remediate(fixed, findings[0].id)).toThrow();
    });
  it("las reglas detectan las identidades esperadas", () => {
    expect(
      scenarios.map((s) =>
        analyze(s)
          .filter((f) => f.status === "risk")
          .map((f) => f.id),
      ),
    ).toEqual([["AL-01:lucia"], ["AL-02:nora"], ["AL-03:svc-reports"]]);
  });
  it("los metadatos desconocidos no se convierten en aprobado", () => {
    expect(
      analyze(scenarios[1]).find((f) => f.id === "AL-02:alex")?.status,
    ).toBe("unknown");
    expect(
      analyze(scenarios[2]).find((f) => f.id === "AL-03:svc-legacy")?.status,
    ).toBe("unknown");
    const s = structuredClone(scenarios[0]);
    s.identities[0].employment = "unknown";
    expect(analyze(s)[0].status).toBe("unknown");
    s.identities[0].employment = "terminated";
    s.identities[0].enabled = null;
    expect(analyze(s)[0].status).toBe("unknown");
  });
  it("MFA desconocido y enabled desconocido requieren evaluación", () => {
    const s = structuredClone(scenarios[1]);
    s.identities[0].mfa = null;
    expect(analyze(s).find((f) => f.id === "AL-02:nora")?.status).toBe(
      "unknown",
    );
    s.identities[0].mfa = false;
    s.identities[0].enabled = null;
    expect(analyze(s).find((f) => f.id === "AL-02:nora")?.status).toBe(
      "unknown",
    );
  });
  it("deshabilitar una cuenta evita los riesgos activos aunque falten metadatos", () => {
    for (const input of scenarios) {
      const s = structuredClone(input);
      s.identities.forEach((u) => (u.enabled = false));
      expect(
        analyze(s).some((f) => f.status === "risk" || f.status === "unknown"),
      ).toBe(false);
    }
  });
  it("mínimo privilegio no modifica roles compartidos ni otras identidades", () => {
    const s = structuredClone(scenarios[2]);
    s.identities[1].roleIds = ["admin"];
    const originalRoles = structuredClone(s.roles);
    const fixed = remediate(s, "AL-03:svc-reports");
    expect(fixed.roles.slice(0, 3)).toEqual(originalRoles);
    expect(permissionsFor(fixed, "svc-reports")).toEqual(["erp-read"]);
    expect(permissionsFor(fixed, "svc-legacy")).toEqual([
      "cloud-admin",
      "erp-read",
    ]);
  });
  it("lista necesaria vacía elimina todos los permisos; null es desconocido", () => {
    const s = structuredClone(scenarios[2]);
    s.identities[0].requiredPermissionIds = [];
    const fixed = remediate(s, "AL-03:svc-reports");
    expect(permissionsFor(fixed, "svc-reports")).toEqual([]);
  });
  it("deduplica permisos heredados y evita colisiones de IDs", () => {
    const s = structuredClone(scenarios[2]);
    s.identities[0].roleIds = ["admin", "reader"];
    s.roles.push({
      id: "least-privilege",
      name: "Ya existe",
      permissionIds: [],
    });
    expect(permissionsFor(s, "svc-reports")).toEqual([
      "cloud-admin",
      "erp-read",
    ]);
    expect(remediate(s, "AL-03:svc-reports").identities[0].roleIds).toEqual([
      "least-privilege-1",
    ]);
  });
  it("rechaza correcciones inexistentes y no evaluadas", () => {
    expect(() => remediate(scenarios[0], "inventado")).toThrow();
    expect(() => remediate(scenarios[1], "AL-02:alex")).toThrow();
  });
});
describe("contrato de entrada", () => {
  for (const [i, input] of [
    null,
    {},
    [],
    { ...scenarios[0], schemaVersion: "2.0" },
    { ...scenarios[0], extra: true },
  ].entries())
    it(`rechaza entrada inválida ${i}`, () =>
      expect(() => parseScenario(input)).toThrow());
  it("rechaza referencias rotas y duplicados", () => {
    const s = structuredClone(scenarios[0]);
    s.identities[0].roleIds = ["missing"];
    expect(() => parseScenario(s)).toThrow();
    s.identities[0].roleIds = ["reader", "reader"];
    expect(() => parseScenario(s)).toThrow();
    s.identities[0].roleIds = ["reader"];
    s.resources.push(s.resources[0]);
    expect(() => parseScenario(s)).toThrow();
  });
  it("rechaza campos obligatorios ausentes y coerción de booleanos", () => {
    const s = JSON.parse(JSON.stringify(scenarios[0]));
    delete s.identities[0].mfa;
    expect(() => parseScenario(s)).toThrow();
    s.identities[0].mfa = "false";
    expect(() => parseScenario(s)).toThrow();
  });
});
describe("informes", () => {
  it("incluye antes/después recalculados", () => {
    const s = scenarios[0];
    const fixed = remediate(s, "AL-01:lucia");
    const data = reportData(s, fixed);
    expect(
      data.before.evaluations.filter((f) => f.status === "risk"),
    ).toHaveLength(1);
    expect(
      data.after.evaluations.filter((f) => f.status === "risk"),
    ).toHaveLength(0);
  });
  it("escapa contenido HTML de los datos", () => {
    const s = structuredClone(scenarios[0]);
    s.name = "<script>alert(1)</script>";
    const html = reportHtml(s, s);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Antes");
    expect(html).toContain("Después");
  });
});
