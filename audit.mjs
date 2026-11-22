import fs from "fs";
const B="https://www.softvoltai.com", UA="Mozilla/5.0 (compatible; SVAudit/2.0)";
const get=async(u,o={})=>{const t=Date.now();try{const r=await fetch(u,{redirect:"manual",headers:{"user-agent":UA},...o});const txt=o.method==="HEAD"?"":await r.text();return{s:r.status,loc:r.headers.get("location"),ms:Date.now()-t,txt}}catch(e){return{s:0,err:String(e),txt:""}}};
const out={checks:{},pages:[],linkStatus:{},demos:[]};
for(const u of ["http://www.softvoltai.com/","http://softvoltai.com/","https://softvoltai.com/","https://www.softvoltai.com/services/","https://www.softvoltai.com/xyz-404"]){const r=await get(u);out.checks[u]=r.s+" "+(r.loc||"")}
out.robots=(await get(B+"/robots.txt")).txt;
const sm=await get(B+"/sitemap.xml");let urls=[...sm.txt.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1].trim());out.sitemapCount=urls.length;
const pick=(re,t)=>(t.match(re)||[])[1]||"";
const links=new Map();
for(const u of urls){
  const r=await get(u),t=r.txt;
  const body=t.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g," ");
  const main=(body.match(/<main[\s\S]*<\/main>/)||[body])[0];
  const words=main.replace(/<[^>]+>/g," ").replace(/&[a-z#0-9]+;/g," ").split(/\s+/).filter(w=>/[a-z]/i.test(w)).length;
  for(const m of t.matchAll(/href="(\/[^"#]*)"/g)){const l=m[1].split("?")[0];if(/\.(webp|png|jpg|svg|ico|css|js|txt|xml|json)$/.test(l)||l.startsWith("/_next")||l.startsWith("/api"))continue;if(!links.has(l))links.set(l,new Set());links.get(l).add(u.replace(B,""))}
  const h2s=[...t.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].length;
  out.pages.push({u:u.replace(B,""),s:r.s,loc:r.loc,ms:r.ms,title:pick(/<title[^>]*>([^<]*)<\/title>/,t),desc:pick(/<meta name="description" content="([^"]*)"/,t),canon:pick(/<link rel="canonical" href="([^"]*)"/,t),robots:pick(/<meta name="robots" content="([^"]*)"/,t),h1:(t.match(/<h1[\s>]/g)||[]).length,h2s,words,ld:[...new Set([...t.matchAll(/"@type":"([A-Za-z]+)"/g)].map(m=>m[1]))].join(","),og:pick(/property="og:image" content="([^"]*)"/,t),ogt:pick(/property="og:title" content="([^"]*)"/,t),imgNoAlt:(t.match(/<img(?![^>]*\balt=)[^>]*>/g)||[]).length,emptyAlt:(main.match(/<img[^>]*alt=""[^>]*>/g)||[]).length,kb:Math.round(t.length/1024),lang:pick(/<html[^>]*lang="([^"]*)"/,t)});
}
for(const [l,from] of links){const r=await get(B+l,{method:"HEAD"});if(r.s!==200)out.linkStatus[l]={s:r.s,loc:r.loc,from:[...from].slice(0,5),n:from.size}}
// demos
const pt=(await get(B+"/portfolios")).txt;
const demos=[...new Set([...pt.matchAll(/href="(\/portfolio\/[^"]+index\.html)"/g)].map(m=>m[1]))];
for(const d of demos){const r=await get(B+d);out.demos.push({d,s:r.s,noindex:/<meta name="robots" content="noindex/.test(r.txt),title:pick(/<title[^>]*>([^<]*)<\/title>/,r.txt).slice(0,50)})}
fs.mkdirSync("res",{recursive:true});fs.writeFileSync("res/audit.json",JSON.stringify(out,null,1));console.log("ok",out.pages.length,demos.length);
