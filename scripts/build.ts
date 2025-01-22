import path from "node:path";
import esbuild from "esbuild";

const package_json = process.env.npm_package_json;
if (!package_json) {
  throw new Error("npm_package_json not found in env");
}
const rootDir = path.dirname(package_json);

const entryPoints = [
  { in: path.join(rootDir, "src", "scripts", "index.ts"), out: "scripts" },
  { in: path.join(rootDir, "src", "styles", "index.css"), out: "styles" },
];

async function runBuild(minify: boolean) {
  const before = performance.now();
  const result = await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    outdir: path.join(rootDir, "dist"),
    format: "cjs",
    target: ["chrome96"],
    loader: {
      ".png": "dataurl",
      ".gif": "dataurl",
      ".woff": "dataurl",
      ".woff2": "dataurl",
      ".ttf": "dataurl",
      ".html": "text",
      ".css": "css",
    },
    logLevel: "info",
    metafile: true,
    minify: minify,
  });
  const after = performance.now();
  console.log(`Build took ${(after - before).toFixed(2)}ms`);
  return result;
}

runBuild(process.argv.includes("--minify")).catch(console.error);
