import fs from "fs";
const B = "https://www.softvoltai.com";
const UA = "Mozilla/5.0 (compatible; SVAudit/1.0)";
const get = async (u, opt = {}) => { const t = Date.now(); try { const r = await fetch(u, { redirect: "manual", headers: { "user-agent": UA }, ...opt }); const txt = opt.method === "HEAD" ? "" : await r.text(); return { s: r.status, loc: r.headers.get("location"), ms: Date.now() - t, txt, h: Object.fromEntries(r.headers) }; } catch (e) { return { s: 0, err: String(e), ms: Date.now() - t, txt: "" }; } };
const out = { checks: {}, pages: [] };
for (const u of ["http://softvoltai.com/", "https://softvoltai.com/", "http://www.softvoltai.com/", "https://www.softvoltai.com/services/", "https://www.softvoltai.com/nope-404-test"]) { const r = await get(u); out.checks[u] = r.s + " " + (r.loc || ""); }
const robots = await get(B + "/robots.txt"); out.robots = robots.txt;
const sm = await get(B + "/sitemap.xml"); out.sitemapStatus = sm.s;
let urls = [...sm.txt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const subs = urls.filter((u) => u.endsWith(".xml"));
for (const s of subs) { const r = await get(s); urls.push(...[...r.txt.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())); }
urls = [...new Set(urls.filter((u) => !u.endsWith(".xml")))];
out.sitemapCount = urls.length;
const pick = (re, t) => (t.match(re) || [])[1] || "";
const linked = new Set();
for (const u of urls) {
  const r = await get(u);
  const t = r.txt;
  const body = t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ");
  const main = (body.match(/<main[\s\S]*<\/main>/) || [body])[0];
  const words = main.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").split(/\s+/).filter((w) => /[a-z]/i.test(w)).length;
  const links = [...t.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  links.forEach((l) => linked.add(B + l.replace(/\/$/, "")));
  out.pages.push({
    u: u.replace(B, ""), s: r.s, loc: r.loc, ms: r.ms, cache: r.h?.["cf-cache-status"] || r.h?.["x-nextjs-cache"] || "",
    title: pick(/<title[^>]*>([^<]*)<\/title>/, t), desc: pick(/<meta name="description" content="([^"]*)"/, t),
    canon: pick(/<link rel="canonical" href="([^"]*)"/, t), robots: pick(/<meta name="robots" content="([^"]*)"/, t),
    h1: (t.match(/<h1[\s>]/g) || []).length, h1t: pick(/<h1[^>]*>([\s\S]*?)<\/h1>/, t).replace(/<[^>]+>/g, "").slice(0, 90),
    words, ld: [...new Set([...t.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]))].join(","),
    og: !!t.match(/property="og:image"/), imgNoAlt: (t.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length, kb: Math.round(t.length / 1024),
    hreflang: !!t.match(/hreflang/), inlinks: links.length,
  });
}
const sset = new Set(urls.map((u) => u.replace(/\/$/, "")));
out.orphans = urls.filter((u) => !linked.has(u.replace(/\/$/, ""))).map((u) => u.replace(B, ""));
out.linkedNotInSitemap = [...linked].filter((l) => !sset.has(l) && !/\.(webp|png|jpg|svg|xml|ico|html|txt|css|js)$/.test(l) && !l.includes("/_next") && !l.includes("/api") && !l.includes("/portfolio/")).map((u) => u.replace(B, "")).slice(0, 80);
// broken internal links
const bl = [];
for (const l of out.linkedNotInSitemap) { const r = await get(B + l, { method: "HEAD" }); if (r.s >= 400 || r.s === 0) bl.push(l + " " + r.s); }
out.broken = bl;
fs.mkdirSync("res", { recursive: true });
fs.writeFileSync("res/crawl.json", JSON.stringify(out, null, 1));
console.log("pages", out.pages.length);
