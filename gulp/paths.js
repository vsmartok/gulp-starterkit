const build = "./build";

export const paths = {
  build,
  html: {
    src: ["./src/html/**/*.njk", "!./src/html/**/_*/**/*.njk"],
    base: "./src/html",
    dest: build,
    data: "./src/html/_data",
    watch: ["./src/html/**/*.njk", "./src/html/_data/*.json"],
  },
  css: {
    src: [
      "./src/css/**/*.{sass,scss,css}",
      "!./src/css/**/_*.{sass,scss,css}",
      "!./src/css/vendors/**",
    ],
    base: "./src/css",
    dest: `${build}/assets/css`,
    watch: "./src/css/**/*.{sass,scss,css}",
  },
};
