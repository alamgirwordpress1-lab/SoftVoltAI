import { chromium, devices } from "playwright";
import fs from "fs";
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
for (const f of fs.readdirSync("ag")) {
  const slug = f.replace(".html", "");
  for (const [mode, opt] of [["d", { viewport: { width: 1440, height: 900 } }], ["m", { ...devices["iPhone 13"], deviceScaleFactor: 1 }]]) {
    const ctx = await b.newContext(opt); const p = await ctx.newPage(); const errs=[];
    p.on("pageerror", e => errs.push(String(e).slice(0,100)));
    await p.goto("file://" + process.cwd() + "/ag/" + f, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(async () => { document.querySelectorAll('.rv').forEach(e=>e.classList.add('in')); for (const i of document.images) i.loading = "eager"; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 15000); }))); });
    await p.waitForTimeout(2000);
    const bad = await p.evaluate(() => [...document.images].filter(i => i.naturalWidth === 0 && i.currentSrc && !i.closest('dialog')).length);
    console.log("SHOT", slug, mode, "bad", bad, errs.join("|"));
    await p.evaluate(()=>scrollTo(0,0)); await p.waitForTimeout(400);
    if (mode === "d") await p.screenshot({ path: `out/${slug}.png` });
    await p.screenshot({ path: `out/${slug}-${mode}-full.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
