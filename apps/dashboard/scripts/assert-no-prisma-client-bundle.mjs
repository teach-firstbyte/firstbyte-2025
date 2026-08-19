/**
 * Fails if Prisma ended up in a browser bundle.
 *
 * Run after `next build`. Reads .next/static/chunks, which is exactly what gets
 * served to browsers, so this catches the property we actually care about rather
 * than a proxy for it.
 *
 * Why not an ESLint rule: the realistic way this regresses is transitive. A
 * "use client" component imports an innocent-looking helper in lib/, and that
 * helper imports @prisma/client. A lint rule keyed on the "use client" directive
 * sees nothing wrong with either file. Checking the built output sees the shim
 * however many hops away it was pulled in from.
 *
 * If this fails: find the client component whose import chain reaches
 * @prisma/client and route it through src/lib/enums.ts instead. Server code is
 * unaffected -- route handlers, server actions, and server components should keep
 * importing @prisma/client directly.
 */
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const CHUNKS_DIR = ".next/static/chunks";

// Identifiers from @prisma/client's browser shim (index-browser.js). Matching on
// these rather than the bare string "prisma" avoids firing on unrelated words in
// application code, minified or not.
const MARKERS = [
  "PrismaClient",
  "prismaVersion",
  "PrismaClientKnownRequestError",
];

async function jsFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await jsFiles(path)));
    else if (entry.name.endsWith(".js")) found.push(path);
  }
  return found;
}

let files;
try {
  files = await jsFiles(CHUNKS_DIR);
} catch {
  console.error(`No ${CHUNKS_DIR}. Run \`next build\` first.`);
  process.exit(1);
}

const offenders = [];
for (const file of files) {
  const source = await readFile(file, "utf8");
  const hits = MARKERS.filter((marker) => source.includes(marker));
  if (hits.length > 0) offenders.push({ file, hits });
}

if (offenders.length > 0) {
  console.error("@prisma/client reached the client bundle:\n");
  for (const { file, hits } of offenders) {
    console.error(`  ${file} — ${hits.join(", ")}`);
  }
  console.error(
    "\nRoute the offending client component's enum imports through src/lib/enums.ts.",
  );
  process.exit(1);
}

console.log(`No Prisma in ${files.length} client chunks.`);
