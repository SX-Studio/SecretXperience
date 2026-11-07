// Usage: node tools/foley_scan.js <project_dir>  → writes <project_dir>/foley.json  (needs window.__WANT_FOLEY support in the page)
const { chromium } = require("playwright"); const path = require("path"); const fs = require("fs");
(async () => { const dir = path.resolve(process.argv[2] || ".");
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const b = await chromium.launch({ proxy, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-certificate-errors"] }); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true });
  pg.on("pageerror", (e) => console.error("pageerror", e.message)); await pg.addInitScript(() => { window.__WANT_FOLEY = true; window.__timelines = window.__timelines || {}; });
  await pg.goto("file://" + path.join(dir, "index.html")); await pg.waitForFunction(() => window.__FOLEY, null, { timeout: 600000 });
  const data = await pg.evaluate(() => window.__FOLEY); fs.writeFileSync(path.join(dir, "foley.json"), JSON.stringify(data, null, 0));
  console.log("events", data.events.length, "cards", (data.cards || []).length); await b.close(); })().catch((e) => { console.error(e); process.exit(1); });
