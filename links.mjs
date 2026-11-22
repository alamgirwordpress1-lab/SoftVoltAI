import fs from "fs";
const B="https://www.softvoltai.com";
const sm=await (await fetch(B+"/sitemap.xml")).text();
const urls=[...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const agg={};
for(const u of urls){
  const t=await (await fetch(u)).text();
  const body=t.replace(/<header[\s\S]*?<\/header>/,"").replace(/<footer[\s\S]*?<\/footer>/,"");
  for(const m of body.matchAll(/<a[^>]*href="(\/contact[^"]*|\/quote[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)){
    const txt=m[2].replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,60);
    const k=m[1]+" | "+txt; (agg[k]=agg[k]||new Set()).add(u.replace(B,""));
  }
  const h=t.match(/<header[\s\S]*?<\/header>/); if(h) for(const m of h[0].matchAll(/<a[^>]*href="(\/contact[^"]*|\/quote[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)){const k="HEADER "+m[1]+" | "+m[2].replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,40);(agg[k]=agg[k]||new Set()).add("all")}
}
const out=Object.entries(agg).map(([k,v])=>`${k}  [${v.size}] ${[...v].slice(0,4).join(" ")}`).sort();
fs.mkdirSync("res",{recursive:true});fs.writeFileSync("res/links.txt",out.join("\n"));console.log(out.length);
