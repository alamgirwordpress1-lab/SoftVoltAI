import { chromium } from "playwright";
import fs from "fs";
const urls = JSON.parse(fs.readFileSync("urls.json", "utf8"));
fs.mkdirSync("out", { recursive: true });
const b = await chromium.launch();
for (const u of urls) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(u, { waitUntil: "networkidle", timeout: 60000 });
  await p.evaluate(async () => { for (const i of document.images) i.loading = "eager"; await Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 15000); }))); });
  await p.waitForTimeout(2500);
  const bad = await p.evaluate(() => [...document.images].filter(i => i.naturalWidth === 0).map(i => i.src));
  const slug = u.split("/").slice(-2)[0];
  console.log(slug, "images", await p.evaluate(() => document.images.length), "bad", bad.length, bad.join(" "));
  await p.screenshot({ path: `out/${slug}.png` });
  await p.close();
}
await b.close();
