import { writeFileSync, mkdirSync } from "node:fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ScenarioSchema } from "../src/engine/schema";
import { scenarios } from "../src/data/scenarios";
writeFileSync(
  "docs/scenario.schema.json",
  JSON.stringify(zodToJsonSchema(ScenarioSchema, "Scenario"), null, 2) + "\n",
);
mkdirSync("examples", { recursive: true });
for (const s of scenarios)
  writeFileSync(`examples/${s.id}.json`, JSON.stringify(s, null, 2) + "\n");
