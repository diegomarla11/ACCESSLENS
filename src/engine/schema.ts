import { z } from "zod";
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/);
export const ScenarioSchema = z
  .object({
    schemaVersion: z.literal("1.0"),
    id,
    name: z.string().min(1).max(120),
    description: z.string().max(600),
    resources: z
      .array(z.object({ id, name: z.string().min(1).max(120) }).strict())
      .max(200),
    permissions: z
      .array(
        z
          .object({
            id,
            resourceId: id,
            action: z.enum(["read", "write", "admin"]),
          })
          .strict(),
      )
      .max(200),
    roles: z
      .array(
        z
          .object({
            id,
            name: z.string().min(1).max(120),
            permissionIds: z.array(id).max(200),
          })
          .strict(),
      )
      .max(200),
    identities: z
      .array(
        z
          .object({
            id,
            name: z.string().min(1).max(120),
            kind: z.enum(["human", "service"]),
            employment: z.enum(["active", "terminated", "unknown"]),
            enabled: z.boolean().nullable(),
            mfa: z.boolean().nullable(),
            roleIds: z.array(id).max(200),
            requiredPermissionIds: z.array(id).max(200).nullable(),
          })
          .strict(),
      )
      .max(200),
  })
  .strict()
  .superRefine((s, ctx) => {
    for (const key of [
      "resources",
      "permissions",
      "roles",
      "identities",
    ] as const) {
      const ids = s[key].map((x) => x.id);
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "IDs duplicados",
        });
    }
    const check = (
      ids: string[],
      allowed: string[],
      path: (string | number)[],
    ) => {
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: "custom",
          path,
          message: "Referencias duplicadas",
        });
      ids.forEach((x) => {
        if (!allowed.includes(x))
          ctx.addIssue({
            code: "custom",
            path,
            message: `Referencia inexistente: ${x}`,
          });
      });
    };
    s.permissions.forEach((p, i) =>
      check(
        [p.resourceId],
        s.resources.map((x) => x.id),
        ["permissions", i, "resourceId"],
      ),
    );
    s.roles.forEach((r, i) =>
      check(
        r.permissionIds,
        s.permissions.map((x) => x.id),
        ["roles", i, "permissionIds"],
      ),
    );
    s.identities.forEach((u, i) => {
      check(
        u.roleIds,
        s.roles.map((x) => x.id),
        ["identities", i, "roleIds"],
      );
      if (u.requiredPermissionIds)
        check(
          u.requiredPermissionIds,
          s.permissions.map((x) => x.id),
          ["identities", i, "requiredPermissionIds"],
        );
    });
  });
export type Scenario = z.infer<typeof ScenarioSchema>;
export function parseScenario(input: unknown): Scenario {
  return ScenarioSchema.parse(input);
}
