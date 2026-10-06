import gulp from "gulp";
import { paths } from "../paths.js";
import { html } from "./html.js";
import { reload } from "./server.js";

export function watchFiles() {
  return gulp.watch(paths.html.watch, gulp.series(html, reload));
}
