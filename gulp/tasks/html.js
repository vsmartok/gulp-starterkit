import gulp from "gulp";
import nunjucksRender from "gulp-nunjucks-render";
import { paths } from "../paths.js";

export function html() {
  return gulp
    .src(paths.html.src, { base: paths.html.base })
    .pipe(
      nunjucksRender({
        path: paths.html.base,
        ext: ".html",
        envOptions: {
          autoescape: true,
          throwOnUndefined: true,
        },
      }),
    )
    .pipe(gulp.dest(paths.html.dest));
}
