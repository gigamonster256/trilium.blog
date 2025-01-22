import fs from "node:fs";
import path from "node:path";
import tepi from "trilium-etapi";

const package_json = process.env.npm_package_json;
if (!package_json) {
  throw new Error("npm_package_json not found in env");
}
const rootDir = path.dirname(package_json);

if (!process.env.TRILIUM_ETAPI_TOKEN) {
  console.log("TRILIUM_ETAPI_TOKEN not found in env");
  console.log(
    "Please set the TRILIUM_ETAPI_TOKEN environment variable to automate the deployment",
  );
  console.log(
    "See https://triliumnext.github.io/Docs/Wiki/etapi.html for more information on how to get the token",
  );
  process.exit(1);
}
tepi.token(process.env.TRILIUM_ETAPI_TOKEN);

if (!process.env.PAGE_TEMPLATE_ID) {
  throw new Error("PAGE_TEMPLATE_ID not found in env");
}
if (!process.env.ITEM_TEMPLATE_ID) {
  throw new Error("ITEM_TEMPLATE_ID not found in env");
}
if (!process.env.TOC_TEMPLATE_ID) {
  throw new Error("TOC_TEMPLATE_ID not found in env");
}

const templateMap = {
  page: process.env.PAGE_TEMPLATE_ID,
  tree_item: process.env.ITEM_TEMPLATE_ID,
  toc_item: process.env.TOC_TEMPLATE_ID,
};

if (!process.env.JS_NOTE_ID) {
  console.log("JS_NOTE_ID not found in env");
  console.log("Skipping upload of scripts.js");
  throw new Error("JS_NOTE_ID not found in env");
}

if (!process.env.CSS_NOTE_ID) {
  console.log("CSS_NOTE_ID not found in env");
  console.log("Skipping upload of styles.css");
  throw new Error("CSS_NOTE_ID not found in env");
}

const bundleMap = {
  "scripts.js": process.env.JS_NOTE_ID,
  "styles.css": process.env.CSS_NOTE_ID,
};

async function uploadTemplates() {
  for (const template in templateMap) {
    const templatePath = path.join(
      rootDir,
      "src",
      "templates",
      `${template}.ejs`,
    );
    const contents = fs.readFileSync(templatePath);
    await tepi.putNoteContentById(templateMap[template], contents);
  }
}

async function uploadBundles() {
  for (const bundle in bundleMap) {
    const bundlePath = path.join(rootDir, "dist", bundle);
    const noteId: string = bundleMap[bundle];

    if (!fs.existsSync(bundlePath)) {
      console.error(`Could not find bundle ${bundle}`);
      continue;
    }

    const contents = fs.readFileSync(bundlePath);
    await tepi.putNoteContentById(noteId, contents);
  }
}

async function main() {
  await uploadTemplates();
  await uploadBundles();
}

// Just run main directly
main().catch(console.error);
