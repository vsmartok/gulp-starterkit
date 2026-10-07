import gulp from "gulp";
import { config } from "./gulp/config.js";
import { clean } from "./gulp/tasks/clean.js";
import { html } from "./gulp/tasks/html.js";
import { css } from "./gulp/tasks/css.js";
import { js } from "./gulp/tasks/js.js";
import { serve } from "./gulp/tasks/server.js";
import { watchFiles } from "./gulp/tasks/watch.js";

async function showMode() {
  console.log(`Build mode: ${config.isProd ? "prod" : "dev"}`);
}

const build = gulp.series(showMode, clean, gulp.parallel(html, css, js));
const dev = gulp.series(build, serve, watchFiles);

export default config.isProd ? build : dev;
