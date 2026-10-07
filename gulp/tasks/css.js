import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import { paths } from "../paths.js";
import { config } from "../config.js";
import { withErrorHandling } from "../with-error-handling.js";

const sass = gulpSass(dartSass);

async function buildCss() {
  await pipeline(
    gulp.src(paths.css.src, { base: paths.css.base, sourcemaps: config.isDev }),
    sass.sync({ style: "expanded" }),
    gulp
      .dest(paths.css.dest, {
        sourcemaps: config.isDev ? "." : false,
      })
      .resume(),
  );
}

export const css = withErrorHandling("css", buildCss);
