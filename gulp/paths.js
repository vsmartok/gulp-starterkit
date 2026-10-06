export const paths = {
  html: {
    src: ["./src/html/**/*.njk", "!./src/html/**/_*/**/*.njk"],
    base: "./src/html",
    dest: "./build",
    watch: "./src/html/**/*.njk",
  },
};
