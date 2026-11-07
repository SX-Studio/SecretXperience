// node text_audit.cjs <project_dir> <duration>  → lists every on-screen word problem (exit 1 if any)
const { chromium } = require("playwright"); const path = require("path");
(async () => { const dir = path.resolve(process.argv[2]), D = +process.argv[3];
  const b = await chromium.launch({ proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined, args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-certificate-errors"] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, ignoreHTTPSErrors: true }); await pg.addInitScript(() => { window.__timelines = window.__timelines || {}; });
  await pg.goto("file://" + path.join(dir, "index.html")); await pg.waitForFunction(() => window.__TY, null, { timeout: 300000 });
  await pg.evaluate(() => Promise.all(Object.values((window.__hf || {}).buildReady || {})));
  const issues = await pg.evaluate((D) => window.__TY.audit(D, 0.1), D); await b.close();
  if (!issues.length) { console.log("TEXT AUDIT: clean (" + D + " s checked every 0.1 s)"); return; }
  console.log("TEXT AUDIT: " + issues.length + " issue(s)"); issues.forEach((i) => console.log(`  ${i.t.toFixed ? i.t.toFixed(2) : i.t}s  ${i.kind}: ${i.text}`)); process.exit(1); })().catch((e) => { console.error(e); process.exit(2); });
