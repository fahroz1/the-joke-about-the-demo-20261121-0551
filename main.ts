import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One-line joke about working beside AI coding agents, demo angle.
const JOKE =
  "Live demo: my AI agent fixed the bug, wrote the tests, deployed to prod \u2014 then turned to the audience and asked what I actually do here.";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const length = [...JOKE].length;
  if (length < 1 || length > 280) {
    fail(`joke must be 1-280 Unicode code points, got ${length}`);
  }
  if (JOKE.trim().length === 0) {
    fail("joke must not be only whitespace");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JOKE, "utf8");

  if (!existsSync(OUTPUT_FILE)) {
    fail(`failed to write ${OUTPUT_FILE}`);
  }
  const size = statSync(OUTPUT_FILE).size;
  if (size === 0) {
    fail(`${OUTPUT_FILE} is empty`);
  }

  console.log(`wrote ${OUTPUT_FILE} (${length} characters, ${size} bytes)`);
}

main();
