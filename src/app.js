(() => {
"use strict";
const db=window.RIMCI_INGREDIENTS||[];
const $=id=>document.getElementById(id);
const normalize=s=>String(s).toLocaleLowerCase("pl").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let owned;
try{owned=new Set(JSON.parse(localStorage.getItem("rimci-owned-v1")||"[]"))}catch{owned=new Set()}
const save=()=>{localStorage.setItem("rimci-owned-v1",JSON.stringify([...owned]));$("ownedCount").textContent=owned.size};
const flags={standard:"Dodatek technologiczny",context:"Sprawdź kontekst",preference:"Preferencja: unikać",regulatory:"Ograniczenie regulacyjne"};
function card(x){return '<article class="card"><h3>'+esc(x.name)+'</h3><span class="pill '+(x.flag==="preference"||x.flag==="regulatory"?"preference":x.flag==="context"?"caution":"")+'">'+esc(flags[x.flag])+'</span><p>'+esc(x.role)+'</p><p class="muted">'+esc(x.aliases.join(" · "))+'</p><div class="actions"><small>'+esc(x.category)+'</small><button data-own="'+esc(x.id)+'" aria-label="Zmień status posiadania">'+(owned.has(x.id)?"✓ Mam":"＋ Dodaj")+'</button></div></article>'}
function render(){
const q=normalize($("search").value),cat=$("category").value;
const found=db.filter(x=>(!cat||x.category===cat)&&normalize([x.name,...x.aliases,x.role].join(" ")).includes(q));
$("count").textContent=found.length+" z "+db.length+" składników";
$("items").innerHTML=found.map(card).join("")||"<p>Brak wyników.</p>";
$("owned").innerHTML=db.filter(x=>owned.has(x.id)).map(card).join("")||"<p>Jeszcze niczego nie zaznaczono.</p>";
save()
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-own]");if(!b)return;const id=b.dataset.own;if(owned.has(id))owned.delete(id);else owned.add(id);render()});
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("hidden",v.id!==b.dataset.tab));render()}));
for(const cat of [...new Set(db.map(x=>x.category))].sort()){const o=document.createElement("option");o.value=cat;o.textContent=cat;$("category").append(o)}
$("search").addEventListener("input",render);$("category").addEventListener("change",render);
$("runAnalysis").addEventListener("click",()=>{
const parts=$("composition").value.split(/[,;\\n]+/).map(s=>s.trim()).filter(Boolean);
const strip=s=>normalize(s).replace(/\\s*\\([^)]*\\)\\s*/g," ").replace(/\\s+/g," ").trim();
const candidates=part=>{const raw=strip(part);const withoutDose=raw.replace(/\\s+\\d+(?:[.,]\\d+)?\\s*(?:mg|mcg|µg|ug|g|iu|j\\.?m\\.?)\\b.*$/i,"").trim();return [raw,withoutDose].filter(Boolean)};
$("analysis").innerHTML=parts.map(part=>{const keys=candidates(part);const x=db.find(i=>[i.name,...i.aliases].some(a=>keys.includes(strip(a))));return '<article class="card"><h3>'+esc(part)+'</h3><p>'+(x?'✓ '+esc(x.name)+' — '+esc(x.role):'Nie rozpoznano jednoznacznie. Sprawdź nazwę, ilość i etykietę.')+'</p></article>'}).join("")||"<p>Wklej skład.</p>";
});
$("export").addEventListener("click",()=>{const payload=JSON.stringify(db.filter(x=>owned.has(x.id)),null,2);const blob=new Blob([payload],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="rimci-moje-skladniki.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
render();
})();