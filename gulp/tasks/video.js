import { pipeline } from "node:stream/promises";
import gulp from "gulp";
import { paths } from "../paths.js";
import { withErrorHandling } from "../with-error-handling.js";

async function buildVideo() {
  await Promise.all(
    paths.video.map((group) =>
      pipeline(
        gulp.src(group.src, {
          base: group.base,
          encoding: false,
        }),
        gulp.dest(group.dest).resume(),
      ),
    ),
  );
}

export const video = withErrorHandling("video", buildVideo);
