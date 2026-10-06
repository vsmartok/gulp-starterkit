import gulp from "gulp";
import nunjucksRender from "gulp-nunjucks-render";
import { paths } from "../paths.js";
import { loadData } from "../data.js";

export function html() {
  const data = loadData(paths.html.data);

  return gulp
    .src(paths.html.src, { base: paths.html.base })
    .pipe(
      nunjucksRender({
        path: paths.html.base,
        ext: ".html",
        data,
        envOptions: {
          autoescape: true,
          throwOnUndefined: true,
        },
      }),
    )
    .pipe(gulp.dest(paths.html.dest));
}
