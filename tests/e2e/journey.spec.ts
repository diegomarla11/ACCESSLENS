import { test, expect } from "playwright/test";
test("recorrido: escenarios, evidencia, corrección, exportaciones y reinicio", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("button", { name: /Recorrido de 2 minutos/ }).click();
  await expect(page.getByLabel("Recorrido guiado")).toContainText(
    "1. Elige un caso",
  );
  await page.getByRole("button", { name: "Siguiente →" }).click();
  await page.getByRole("button", { name: "Siguiente →" }).click();
  await page.getByRole("button", { name: "Finalizar" }).click();
  for (const name of [
    "Una baja pendiente",
    "Sin segundo factor",
    "Demasiado poder",
  ]) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    const risk = page.locator(".finding.risk");
    await expect(risk).toHaveCount(1);
    await risk.locator("summary").click();
    await expect(risk.locator(".evidence")).toBeVisible();
    await risk.getByRole("button", { name: /Aplicar corrección/ }).click();
    await expect(page.locator(".finding.risk")).toHaveCount(0);
    await expect(page.locator(".comparison")).toContainText("1 → 0");
    await page.getByRole("tab", { name: /Inventario/ }).click();
    await page
      .getByRole("combobox", { name: "Tipo de entidad" })
      .selectOption("roles");
    await expect(page.locator(".inventory-list")).toContainText(
      "Administración",
    );
    await page.getByRole("tab", { name: /Hallazgos/ }).click();
    const jsonEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: /Exportar JSON/ }).click();
    expect((await jsonEvent).suggestedFilename()).toBe(
      "accesslens-results.json",
    );
    const htmlEvent = page.waitForEvent("download");
    await page.getByRole("button", { name: /Informe HTML/ }).click();
    expect((await htmlEvent).suggestedFilename()).toBe(
      "accesslens-report.html",
    );
    await page.getByRole("button", { name: /Reiniciar escenario/ }).click();
    await expect(page.locator(".finding.risk")).toHaveCount(1);
  }
});
test("vista móvil, resumen inglés y navegación por teclado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Saltar al análisis" }),
  ).toBeFocused();
  await page.getByRole("tab", { name: /Hallazgos/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Inventario/ })).toBeFocused();
  await expect(page.getByRole("tab", { name: /Inventario/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: /Hallazgos/ })).toBeFocused();
  await page.getByRole("button", { name: /English summary/ }).click();
  await expect(page.locator("[lang=en]")).toBeVisible();
  await page.getByRole("button", { name: /Sin segundo factor/ }).click();
  await expect(page.locator(".finding.unknown")).toContainText("No evaluado");
});

test("accesibilidad automática de los tres escenarios", async ({ page }) => {
  await page.goto("/");
  for (const name of [
    "Una baja pendiente",
    "Sin segundo factor",
    "Demasiado poder",
  ]) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    await page.addScriptTag({ path: "node_modules/axe-core/axe.min.js" });
    const violations = await page.evaluate(async () => {
      const axe = (
        window as unknown as {
          axe: { run(options: unknown): Promise<{ violations: unknown[] }> };
        }
      ).axe;
      return (
        await axe.run({
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        })
      ).violations;
    });
    expect(violations).toEqual([]);
  }
});
