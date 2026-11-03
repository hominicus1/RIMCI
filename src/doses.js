/* RIMCI: analiza deklarowanych dawek z etykiet. Nie oblicza zaleceń medycznych. */
(() => {
"use strict";
const db=window.RIMCI_INGREDIENTS||[];
const norm=s=>String(s).toLocaleLowerCase("pl").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const units={mg:1,g:1000,kg:1000000,"µg":.001,"μg":.001,mcg:.001,ug:.001};
const unitPattern="(mg|mcg|µg|μg|ug|g|kg|IU|j\\.?m\\.?)";
const amountPattern=new RegExp("^(.*?)\\s*[:–-]?\\s*(\\d+(?:[.,]\\d+)?)\\s*"+unitPattern+"\\s*(.*)$","i");
const byAlias=new Map();
for(const item of db)for(const alias of [item.name,...item.aliases]){const key=norm(alias);if(!byAlias.has(key))byAlias.set(key,item)}
function parse(line){
 const raw=line.trim(),m=raw.match(amountPattern);
 if(!m)return {raw,status:"unknown",reason:"Nie rozpoznano ilości i jednostki"};
 const name=m[1].trim(),number=Number(m[2].replace(",",".")),unit=m[3].toLowerCase().replace(/\./g,""),tail=m[4].trim();
 if(!Number.isFinite(number)||number<=0)return {raw,status:"unknown",reason:"Niepoprawna ilość"};
 const found=byAlias.get(norm(name));
 if(!found)return {raw,status:"unknown",reason:"Nieznana nazwa substancji"};
 if(!Object.hasOwn(units,unit))return {raw,status:"review",ingredient:found.name,amount:number,unit,reason:"IU/JM: przelicznik zależy od substancji; nie sumuję automatycznie"};
 if(tail)return {raw,status:"review",ingredient:found.name,amount:number,unit,reason:"Dodatkowy opis wymaga weryfikacji: "+tail};
 return {raw,status:"ok",id:found.id,ingredient:found.name,amount:number,unit,mg:number*units[unit]};
}
function analyze(text){return text.split(/[;\n]+/).map(x=>x.trim()).filter(Boolean).map(parse)}
function renderResults(entries,container){
 const known=entries.filter(x=>x.status==="ok"),groups=new Map();
 for(const e of known){const g=groups.get(e.id)||{name:e.ingredient,mg:0,n:0};g.mg+=e.mg;g.n++;groups.set(e.id,g)}
 const rows=[...groups.values()].sort((a,b)=>a.name.localeCompare(b.name,"pl"));
 container.innerHTML='<h3>Rozpoznane deklaracje</h3><p class="muted">Sumy dotyczą tylko wpisów o tej samej rozpoznanej substancji i wyłącznie wpisanych ilości. Nie uwzględniają wielkości porcji, postaci chemicznych ani biodostępności.</p>'+
 (rows.length?'<div class="cards">'+rows.map(r=>'<article class="card"><h3>'+esc(r.name)+'</h3><p><strong>'+Number(r.mg.toPrecision(8))+' mg</strong> łącznie w podanych deklaracjach</p><small>'+r.n+' wpisów</small></article>').join("")+'</div>':'<p>Brak pozycji, które można bezpiecznie zsumować.</p>')+
 '<h3>Kontrola wierszy</h3><div class="cards">'+entries.map(e=>'<article class="card"><strong>'+esc(e.raw)+'</strong><p>'+esc(e.status==="ok"?"Rozpoznano: "+e.ingredient:e.reason)+'</p></article>').join("")+'</div>';
}
const main=document.querySelector("main"),section=document.createElement("section");
section.id="dose-panel";section.className="view hidden";
section.innerHTML='<h2>Porównanie deklarowanych ilości</h2><p class="muted">Każda substancja w osobnym wierszu, np. Witamina D3 25 µg. Nie wpisuj tu mieszanek złożonych ani wartości z różnych wielkości porcji bez ujednolicenia.</p><textarea id="doseInput" rows="9" placeholder="Witamina D3 25 µg&#10;Magnez 100 mg&#10;Magnez 150 mg&#10;Witamina B6 5 mg"></textarea><button id="doseAnalyze">Analizuj i sumuj</button><div id="doseResults"></div>';
main.append(section);
const button=document.createElement("button");button.dataset.tab="dose-panel";button.textContent="Dawki (beta)";document.querySelector("nav").append(button);
button.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b===button));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("hidden",v!==section))});
document.getElementById("doseAnalyze").addEventListener("click",()=>renderResults(analyze(document.getElementById("doseInput").value),document.getElementById("doseResults")));
window.RIMCI_DOSES={parse,analyze};
})();
