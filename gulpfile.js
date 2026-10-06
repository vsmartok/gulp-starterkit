import gulp from "gulp";
import { config } from "./gulp/config.js";
import { html } from "./gulp/tasks/html.js";

async function showMode() {
  console.log(`Режим сборки: ${config.isProd ? "prod" : "dev"}`);
}

export default gulp.series(showMode, html);
