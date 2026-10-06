import gulp from "gulp";
import { paths } from "../paths.js";
import { html } from "./html.js";
import { server } from "./server.js";

async function rebuildHtml() {
  const success = await html();

  if (success) {
    server.reload();
  }
}

export function watchFiles() {
  return gulp.watch(paths.html.watch, rebuildHtml);
}
