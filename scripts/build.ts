import fs from "node:fs";
import path from "node:path";

import dotenv from "dotenv";
import tepi from "trilium-etapi";
import * as esbuild from "esbuild";

const package_json = process.env.npm_package_json;
if (!package_json) {
  throw new Error("npm_package_json not found in env");
}
const rootDir = path.dirname(package_json);

dotenv.config();
if (!process.env.TRILIUM_ETAPI_TOKEN) {
  throw new Error("TRILIUM_ETAPI_TOKEN not found in env");
}
if (process.env.TRILIUM_ETAPI_TOKEN) {
  tepi.token(process.env.TRILIUM_ETAPI_TOKEN);
}

if (!process.env.PAGE_TEMPLATE_ID) {
  throw new Error("PAGE_TEMPLATE_ID not found in env");
}
if (!process.env.ITEM_TEMPLATE_ID) {
  throw new Error("ITEM_TEMPLATE_ID not found in env");
}
if (!process.env.TOC_TEMPLATE_ID) {
  throw new Error("TOC_TEMPLATE_ID not found in env");
}
const templateMap: Record<string, string> = {
  page: process.env.PAGE_TEMPLATE_ID,
  tree_item: process.env.ITEM_TEMPLATE_ID,
  toc_item: process.env.TOC_TEMPLATE_ID,
};

async function sendTemplates() {
  for (const template in templateMap) {
    const templatePath = path.join(
      rootDir,
      "src",
      "templates",
      `${template}.ejs`,
    );
    const contents = fs.readFileSync(templatePath).toString();
    await tepi.putNoteContentById(templateMap[template], contents);
  }
}

if (process.argv.includes("--only-templates")) {
  await sendTemplates();
  process.exit(0);
}

const bundleMap = {
  "scripts.js": process.env.JS_NOTE_ID,
  "styles.css": process.env.CSS_NOTE_ID,
};

const triliumPlugin: esbuild.Plugin = {
  name: "Trilium",
  setup(build) {
    build.onEnd(async (result) => {
      if (!result.metafile) return;

      const bundles = Object.keys(result.metafile.outputs);
      for (const bundle of bundles) {
        const filename = path.basename(bundle);
        const noteId = bundleMap[filename as keyof typeof bundleMap];
        if (!noteId) {
          console.info(`No note id found for bundle ${bundle}`);
          continue;
        }

        const bundlePath = path.join(rootDir, bundle);
        if (!fs.existsSync(bundlePath)) {
          console.error(`Could not find bundle ${bundle}`);
          continue;
        }

        const contents = fs.readFileSync(bundlePath).toString();
        await tepi.putNoteContentById(noteId, contents);
      }
    });
  },
};

const modules = ["scripts", "styles"];
const entryPoints: { in: string; out: string }[] = [];
const makeEntry = (mod: string) => ({
  in: path.join(
    rootDir,
    "src",
    mod,
    mod === "styles" ? "index.css" : "index.ts",
  ),
  out: mod,
});

const modulesRequested = process.argv.filter((a) => a.startsWith("--module="));
for (const mod of modulesRequested) {
  const module = mod?.replace("--module=", "") ?? "";
  if (modules.includes(module)) entryPoints.push(makeEntry(module));
}

if (!entryPoints.length) {
  for (const mod of modules) entryPoints.push(makeEntry(mod));
}

async function runBuild() {
  const before = performance.now();
  await esbuild.build({
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
    plugins: [triliumPlugin],
    logLevel: "info",
    metafile: true,
    minify: process.argv.includes("--minify"),
  });
  const after = performance.now();
  if (process.argv.includes("--templates")) await sendTemplates();
  console.log(`Build actually took ${(after - before).toFixed(2)}ms`);
}

runBuild().catch(console.error);
