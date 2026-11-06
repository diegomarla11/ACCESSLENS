import { readFileSync, statSync } from "node:fs";
import { analyze } from "../src/engine/analyze";
import { parseScenario } from "../src/engine/schema";
import { scenarios } from "../src/data/scenarios";
try {
  const args = process.argv.slice(2);
  const fail = args.includes("--fail-on-risk");
  const files = args.filter((x) => x !== "--fail-on-risk");
  const inputs = files.length
    ? files.map((path) => {
        if (!statSync(path).isFile() || statSync(path).size > 1_000_000)
          throw new Error("Entrada inválida o demasiado grande");
        const raw = readFileSync(path, "utf8");
        if (Buffer.byteLength(raw) > 1_000_000)
          throw new Error("Entrada demasiado grande");
        return parseScenario(JSON.parse(raw));
      })
    : scenarios;
  const results = inputs.map((s) => ({
    scenario: s.id,
    evaluations: analyze(s),
  }));
  console.log(JSON.stringify(results, null, 2));
  if (
    fail &&
    results.some((r) => r.evaluations.some((f) => f.status === "risk"))
  )
    process.exitCode = 1;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
