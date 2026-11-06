import { parseScenario, type Scenario } from "../engine/schema";
const common = {
  schemaVersion: "1.0",
  resources: [
    { id: "erp", name: "ERP de operaciones" },
    { id: "cloud", name: "Consola cloud ficticia" },
  ],
  permissions: [
    { id: "erp-read", resourceId: "erp", action: "read" },
    { id: "erp-write", resourceId: "erp", action: "write" },
    { id: "cloud-admin", resourceId: "cloud", action: "admin" },
  ],
  roles: [
    { id: "reader", name: "Lectura ERP", permissionIds: ["erp-read"] },
    {
      id: "operator",
      name: "Operación ERP",
      permissionIds: ["erp-read", "erp-write"],
    },
    {
      id: "admin",
      name: "Administración",
      permissionIds: ["erp-read", "cloud-admin"],
    },
  ],
};
const identity = {
  id: "demo",
  name: "Cuenta de ejemplo",
  kind: "human",
  employment: "active",
  enabled: true,
  mfa: true,
  roleIds: ["reader"],
  requiredPermissionIds: null,
};
export const scenarios: Scenario[] = [
  {
    ...common,
    id: "offboarding",
    name: "01 · Una baja pendiente",
    description:
      "Lucía dejó la organización. Su cuenta sigue habilitada y conserva acceso al ERP.",
    identities: [
      {
        ...identity,
        id: "lucia",
        name: "Lucía Vega",
        employment: "terminated",
        roleIds: ["operator"],
      },
      { ...identity, id: "pablo", name: "Pablo Gil", mfa: null },
    ],
  },
  {
    ...common,
    id: "mfa",
    name: "02 · Un acceso privilegiado",
    description:
      "Revisa una cuenta administrativa sin MFA y otra cuyos metadatos están incompletos.",
    identities: [
      {
        ...identity,
        id: "nora",
        name: "Nora Ruiz",
        roleIds: ["admin"],
        mfa: false,
      },
      {
        ...identity,
        id: "alex",
        name: "Álex Mora",
        roleIds: ["admin"],
        mfa: null,
      },
    ],
  },
  {
    ...common,
    id: "service",
    name: "03 · Un servicio con demasiado poder",
    description:
      "Un proceso de informes solo necesita leer el ERP, pero su rol también administra la consola cloud.",
    identities: [
      {
        ...identity,
        id: "svc-reports",
        name: "svc-informes",
        kind: "service",
        employment: "unknown",
        mfa: null,
        roleIds: ["admin"],
        requiredPermissionIds: ["erp-read"],
      },
      {
        ...identity,
        id: "svc-legacy",
        name: "svc-legado",
        kind: "service",
        employment: "unknown",
        mfa: null,
        requiredPermissionIds: null,
      },
    ],
  },
].map(parseScenario);
