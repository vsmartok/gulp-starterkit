import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";
import { checkImageNames } from "../check-image-names.js";
import { createWebp } from "../create-webp.js";

async function buildImages() {
  for (const group of paths.images) {
    await checkImageNames(group);
  }

  await Promise.all(
    paths.images.map((group) =>
      pipeline(
        gulp.src(group.src, {
          base: group.base,
          encoding: false,
          nocase: true,
        }),
        createWebp,
        gulp.dest(group.dest).resume(),
      ),
    ),
  );
}

export const images = withErrorHandling("images", buildImages);
