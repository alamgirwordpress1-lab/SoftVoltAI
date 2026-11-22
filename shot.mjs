import { chromium, devices } from "playwright";
import fs from "fs";
const urls = JSON.parse(fs.readFileSync("urls.json", "utf8"));
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
const rep = [];
for (const u of urls) {
  const slug = u.split("/").slice(-2)[0];
  for (const [mode, ctxOpt] of [["d", { viewport: { width: 1440, height: 900 } }], ["m", { ...devices["iPhone 13"], deviceScaleFactor: 1 }]]) {
    const ctx = await b.newContext(ctxOpt); const p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120))); p.on("requestfailed", (r) => errs.push("FAIL " + r.url().slice(0, 110)));
    p.on("response", (r) => { if (r.status() >= 400) errs.push(r.status() + " " + r.url().slice(0, 110)); });
    await p.goto(u, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(async () => { for (const i of document.images) i.loading = "eager"; window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 1500)); window.scrollTo(0, 0); await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 15000); }))); });
    await p.waitForTimeout(1500);
    const info = await p.evaluate(() => ({ imgs: document.images.length, bad: [...document.images].filter(i => i.naturalWidth === 0).map(i => i.src.slice(0, 100)), hscroll: document.documentElement.scrollWidth > innerWidth + 2, h: document.body.scrollHeight, bgBad: 0 }));
    rep.push({ slug, mode, ...info, errs: [...new Set(errs)].slice(0, 8) });
    await p.screenshot({ path: `out/${slug}-${mode}.png`, fullPage: true });
    await ctx.close();
  }
}
fs.writeFileSync("out/report.json", JSON.stringify(rep, null, 1));
await b.close();
