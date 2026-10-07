import gulp from "gulp";
import { paths } from "../paths.js";
import { html } from "./html.js";
import { css } from "./css.js";
import { js } from "./js.js";
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

async function rebuildJs() {
  const success = await js();

  if (success) {
    server.reload();
  }
}

export function watchFiles() {
  gulp.watch(paths.css.watch, rebuildCss);
  gulp.watch(paths.js.watch, rebuildJs);

  return gulp.watch(paths.html.watch, rebuildHtml);
}
