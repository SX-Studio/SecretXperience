// node get_var.cjs <project_dir> <window var> → prints JSON
const { chromium } = require("playwright"); const path = require("path");
(async () => { const dir = path.resolve(process.argv[2]), v = process.argv[3];
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-certificate-errors"] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true }); pg.on("pageerror", (e) => console.error("pageerror", e.message));
  await pg.addInitScript(() => { window.__timelines = window.__timelines || {}; }); await pg.goto("file://" + path.join(dir, "index.html"));
  await pg.waitForFunction((n) => window[n] !== undefined, v, { timeout: 300000 }); console.log(JSON.stringify(await pg.evaluate((n) => window[n], v))); await b.close(); })().catch((e) => { console.error(e); process.exit(1); });
