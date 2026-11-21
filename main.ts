import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// One-line joke about an AI agent stealing the show during a live demo.
const JOKE =
  "Live demo: my AI agent fixed the bug, wrote the tests, deployed to prod \u2014 then turned to the audience and asked what I actually do here.";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function die(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function checkJoke(text: string): number {
  const chars = [...text].length;
  if (chars < 1 || chars > 280) {
    die(`joke must be 1-280 characters, got ${chars}`);
  }
  if (text.trim() === "") {
    die("joke must not be only whitespace");
  }
  return chars;
}

function run(): void {
  const chars = checkJoke(JOKE);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JOKE, "utf8");
  if (!existsSync(OUT_FILE)) {
    die(`could not write ${OUT_FILE}`);
  }
  const bytes = statSync(OUT_FILE).size;
  if (bytes === 0) {
    die(`${OUT_FILE} is empty`);
  }
  const back = readFileSync(OUT_FILE, "utf8");
  if (back !== JOKE) {
    die(`${OUT_FILE} did not round-trip`);
  }
  console.log(`wrote ${OUT_FILE} (${chars} characters, ${bytes} bytes) from ${SCRIPT_DIR}`);
}

run();
