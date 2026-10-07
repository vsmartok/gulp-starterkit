import gulp from "gulp";
import { paths } from "../paths.js";
import { html } from "./html.js";
import { css } from "./css.js";
import { server } from "./server.js";

async function rebuildHtml() {
  const success = await html();

  if (success) {
    server.reload();
  }
}

async function rebuildCss() {
  const success = await css();

  if (success) {
    server.reload("*.css");
  }
}

export function watchFiles() {
  gulp.watch(paths.css.watch, rebuildCss);

  return gulp.watch(paths.html.watch, rebuildHtml);
}
