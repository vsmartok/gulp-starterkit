import { config } from "./gulp/config.js";

export default async function () {
  console.log(`Режим сборки: ${config.isProd ? "prod" : "dev"}`);
}
