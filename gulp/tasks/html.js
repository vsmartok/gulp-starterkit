import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import nunjucksRender from "gulp-nunjucks-render";
import { paths } from "../paths.js";
import { loadData } from "../data.js";
import { withErrorHandling } from "../with-error-handling.js";

async function buildHtml() {
  const data = loadData(paths.html.data);

  await pipeline(
    gulp.src(paths.html.src, { base: paths.html.base }),
    nunjucksRender({
      path: paths.html.base,
      ext: ".html",
      data,
      envOptions: {
        autoescape: true,
        throwOnUndefined: true,
      },
    }),
    gulp.dest(paths.html.dest).resume(),
  );
}

export const html = withErrorHandling("html", buildHtml);
