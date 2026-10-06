export const paths = {
  html: {
    src: ["./src/html/**/*.njk", "!./src/html/**/_*/**/*.njk"],
    base: "./src/html",
    dest: "./build",
    data: "./src/html/_data",
    watch: ["./src/html/**/*.njk", "./src/html/_data/*.json"],
  },
};
