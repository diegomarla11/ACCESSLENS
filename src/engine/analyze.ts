import { parseScenario, type Scenario } from "./schema";
export const ruleIds = ["AL-01", "AL-02", "AL-03"] as const;
export type RuleId = (typeof ruleIds)[number];
export type Finding = {
  id: string;
  rule: RuleId;
  identityId: string;
  title: string;
  status: "risk" | "clear" | "unknown" | "not-applicable";
  severity: "Alta" | "Media" | null;
  reason: string;
  evidence: string[];
  proposal: string;
};
export function permissionsFor(s: Scenario, identityId: string): string[] {
  const u = s.identities.find((x) => x.id === identityId);
  if (!u) throw new Error("Identidad inexistente");
  return [
    ...new Set(
      u.roleIds.flatMap(
        (id) => s.roles.find((r) => r.id === id)!.permissionIds,
      ),
    ),
  ].sort();
}
export function analyze(input: unknown): Finding[] {
  const s = parseScenario(input);
  return s.identities.flatMap((u) => {
    const effective = permissionsFor(s, u.id);
    const admin = effective.some(
      (id) => s.permissions.find((p) => p.id === id)!.action === "admin",
    );
    return ruleIds.map((rule) => {
      const base = {
        id: `${rule}:${u.id}`,
        rule,
        identityId: u.id,
        severity: null,
        reason: "No se cumple la condición de riesgo.",
        evidence: [
          `identities.${u.id}.enabled = ${u.enabled}`,
          `roles = ${u.roleIds.join(", ") || "(ninguno)"}`,
          `permisos efectivos = ${effective.join(", ") || "(ninguno)"}`,
        ],
        proposal: "",
      } as Finding;
      if (rule === "AL-01") {
        base.title = "Baja con acceso activo";
        base.proposal = "Deshabilitar la identidad en la copia del escenario.";
        base.evidence.push(`employment = ${u.employment}`);
        if (u.kind !== "human") base.status = "not-applicable";
        else if (u.enabled === false || u.employment === "active")
          base.status = "clear";
        else if (u.enabled === null || u.employment === "unknown") {
          base.status = "unknown";
          base.reason = "Falta confirmar la baja o el estado de la cuenta.";
        } else {
          base.status = "risk";
          base.severity = "Alta";
          base.reason =
            "La persona está dada de baja, pero su identidad sigue habilitada. No se comprueban sesiones ni accesos externos.";
        }
      } else if (rule === "AL-02") {
        base.title = "Administrador sin MFA";
        base.proposal =
          "Marcar MFA como habilitado en los metadatos de la copia. No configura MFA real.";
        base.evidence.push(`mfa = ${u.mfa}`, `permiso admin = ${admin}`);
        if (u.kind !== "human") base.status = "not-applicable";
        else if (!admin || u.enabled === false || u.mfa === true)
          base.status = "clear";
        else if (u.enabled === null || u.mfa === null) {
          base.status = "unknown";
          base.reason =
            "No se conoce MFA o el estado de la cuenta administrativa.";
        } else {
          base.status = "risk";
          base.severity = "Alta";
          base.reason =
            "Una identidad habilitada tiene permisos admin y MFA figura desactivado. El escenario no acredita la configuración de un proveedor.";
        }
      } else {
        base.title = "Servicio con permisos excesivos";
        base.proposal =
          "Sustituir sus roles por un rol exclusivo que conserve solo los permisos actuales incluidos en la lista necesaria. No concede permisos nuevos.";
        base.evidence.push(
          `requiredPermissionIds = ${u.requiredPermissionIds === null ? "desconocido" : u.requiredPermissionIds.join(", ") || "(ninguno)"}`,
        );
        if (u.kind !== "service") base.status = "not-applicable";
        else if (u.enabled === false) base.status = "clear";
        else if (
          u.requiredPermissionIds !== null &&
          effective.every((p) => u.requiredPermissionIds!.includes(p))
        )
          base.status = "clear";
        else if (u.enabled === null || u.requiredPermissionIds === null) {
          base.status = "unknown";
          base.reason =
            "Falta conocer el estado o la lista de permisos necesarios validada por el propietario.";
        } else {
          base.status = "risk";
          base.severity = "Media";
          base.reason =
            "Los permisos concedidos superan la lista necesaria declarada. La gravedad depende de esa lista y del modelo simplificado.";
          base.evidence.push(
            `exceso = ${effective.filter((p) => !u.requiredPermissionIds!.includes(p)).join(", ")}`,
          );
        }
      }
      return base;
    });
  });
}
export function remediate(input: unknown, findingId: string): Scenario {
  const s = structuredClone(parseScenario(input));
  const f = analyze(s).find((f) => f.id === findingId);
  if (!f || f.status !== "risk")
    throw new Error("Solo se pueden corregir hallazgos de riesgo vigentes");
  const u = s.identities.find((u) => u.id === f.identityId)!;
  if (f.rule === "AL-01") u.enabled = false;
  if (f.rule === "AL-02") u.mfa = true;
  if (f.rule === "AL-03") {
    // Remediation can only remove access. A declared requirement is not an
    // authorization to grant a permission the service does not already hold.
    const retainedPermissions = permissionsFor(s, u.id).filter((permission) =>
      u.requiredPermissionIds!.includes(permission),
    );
    if (s.roles.length >= 200) {
      throw new Error(
        "No se puede crear el rol de corrección: el escenario ya contiene 200 roles.",
      );
    }
    let id = "least-privilege";
    let n = 1;
    while (s.roles.some((r) => r.id === id)) id = `least-privilege-${n++}`;
    s.roles.push({
      id,
      name: `Mínimo privilegio · ${u.name}`.slice(0, 120),
      permissionIds: retainedPermissions,
    });
    u.roleIds = [id];
  }
  return parseScenario(s);
}
