import { chromium, devices } from "playwright";
import fs from "fs";
const urls = JSON.parse(fs.readFileSync("urls.json", "utf8"));
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
for (const u of urls) {
  const slug = u.split("/").slice(-2)[0];
  for (const [mode, opt] of [["d", { viewport: { width: 1440, height: 900 } }], ["m", { ...devices["iPhone 13"], deviceScaleFactor: 1 }]]) {
    const ctx = await b.newContext(opt); const p = await ctx.newPage();
    await p.goto(u, { waitUntil: "networkidle", timeout: 60000 });
    await p.evaluate(async () => { for (const i of document.images) i.loading = "eager"; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 15000); }))); });
    await p.waitForTimeout(2500);
    const bad = await p.evaluate(() => [...document.images].filter(i => i.naturalWidth === 0 && i.currentSrc).map(i => i.currentSrc.slice(0, 90)));
    console.log("SHOT", slug, mode, "imgs", await p.evaluate(() => document.images.length), "bad", bad.length, bad.join(" "));
    if (mode === "d") await p.screenshot({ path: `out/${slug}.png` });
    await p.screenshot({ path: `out/${slug}-${mode}-full.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
