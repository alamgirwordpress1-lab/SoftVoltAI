import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("out",{recursive:true});
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
for (const [n,u] of [["contact","/contact?v=1"],["home","/?v=1"],["quote","/quote?v=1"],["blog","/blog/white-label-seo-pricing?v=1"]]) {
  await p.goto("https://www.softvoltai.com"+u,{waitUntil:"networkidle"});
  await p.evaluate(()=>document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-in','revealed','in')));
  const links=await p.evaluate(()=>[...document.querySelectorAll('main a')].filter(a=>/brief|quote|call|contact|project/i.test(a.textContent)).map(a=>a.textContent.trim().slice(0,32)+' -> '+a.getAttribute('href')));
  console.log("LIVE",n,JSON.stringify([...new Set(links)]).slice(0,900));
  if(n==="contact"){ const f=await p.$('#message'); await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200); await f.screenshot({path:"out/contact.png"}); }
}
await b.close();
