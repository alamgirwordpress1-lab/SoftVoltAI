/**
 * Lets the WordPress build scripts import the site's TypeScript content
 * directly: resolves the "@/…" alias the app uses and the missing ".ts"
 * extension, which Node's type stripping does not do on its own.
 *
 *   node --experimental-strip-types --import ./wordpress/alias-loader.mjs <script>
 */
import fs from "node:fs";
import path from "node:path";
import { register } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function candidate(base) {
  for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
    const file = base + suffix;
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return pathToFileURL(file).href;
  }
  return null;
}

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const hit = candidate(path.join(root, specifier.slice(2)));
    if (hit) return next(hit, context);
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const hit = candidate(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
    if (hit) return next(hit, context);
  }
  return next(specifier, context);
}

// registering from the main thread; the same file then serves as the hooks module
if (!globalThis.__softvoltAliasRegistered) {
  globalThis.__softvoltAliasRegistered = true;
  register(import.meta.url);
}
