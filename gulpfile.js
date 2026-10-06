import gulp from "gulp";
import { config } from "./gulp/config.js";
import { html } from "./gulp/tasks/html.js";
import { serve } from "./gulp/tasks/server.js";
import { watchFiles } from "./gulp/tasks/watch.js";

async function showMode() {
  console.log(`Build mode: ${config.isProd ? "prod" : "dev"}`);
}

const build = gulp.series(showMode, html);
const dev = gulp.series(build, serve, watchFiles);

export default config.isProd ? build : dev;
