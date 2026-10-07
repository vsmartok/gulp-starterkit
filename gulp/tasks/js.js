import { glob } from "node:fs/promises";
import { build } from "esbuild";
import browserslistToEsbuild from "browserslist-to-esbuild";
import { paths } from "../paths.js";
import { config } from "../config.js";
import { withErrorHandling } from "../with-error-handling.js";

async function buildJs() {
  const entryPoints = await Array.fromAsync(glob(paths.js.src));

  if (entryPoints.length === 0) {
    return;
  }

  await build({
    entryPoints,
    outbase: paths.js.base,
    outdir: paths.js.dest,
    bundle: true,
    platform: "browser",
    target: browserslistToEsbuild(),
    format: "iife",
    sourcemap: config.isDev ? "linked" : false,
    minify: false,
    logLevel: "silent",
  });
}

export const js = withErrorHandling("js", buildJs);
