/* Dodatkowe narzędzia kolekcji suplementów: import i analiza zapisanej etykiety. */
(() => {
"use strict";
const key="rimci-products-v1";
const panel=document.getElementById("supplementManager");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tools=document.createElement("div");
tools.innerHTML='<h3>Kopia zapasowa</h3><p class="muted">Import zastępuje obecną kolekcję. Najpierw wyeksportuj aktualną listę.</p><label>Importuj suplementy JSON <input id="importSupplements" type="file" accept=".json,application/json"></label><p id="importFeedback" class="muted" role="status"></p>';
panel.append(tools);
document.getElementById("importSupplements").addEventListener("change",async e=>{
const file=e.target.files?.[0],feedback=document.getElementById("importFeedback");
if(!file)return;
try{
if(file.size>2000000)throw Error("Plik jest za duży (maks. 2 MB).");
const incoming=JSON.parse(await file.text());
if(!Array.isArray(incoming)||incoming.length>1000||!incoming.every(p=>p&&typeof p.name==="string"&&p.name.length<=300&&typeof p.ingredients==="string"&&p.ingredients.length<=20000))throw Error("Niepoprawny format danych.");
if(!confirm("Import zastąpi wszystkie suplementy zapisane w tej przeglądarce. Kontynuować?"))return;
const clean=incoming.map(p=>({name:p.name,ingredients:p.ingredients,createdAt:typeof p.createdAt==="string"?p.createdAt:new Date().toISOString()}));
localStorage.setItem(key,JSON.stringify(clean));
feedback.textContent="Zaimportowano "+clean.length+" produktów. Odświeżam stronę.";
location.reload();
}catch(err){feedback.textContent="Import nieudany: "+err.message}finally{e.target.value=""}
});
function addAnalysisButtons(){
document.querySelectorAll("#productList article.card").forEach((card,i)=>{
if(card.querySelector("[data-analyze-saved]"))return;
const b=document.createElement("button");b.textContent="Analizuj ilości";b.dataset.analyzeSaved=String(i);card.append(b);
});
}
new MutationObserver(addAnalysisButtons).observe(document.getElementById("productList"),{childList:true});addAnalysisButtons();
document.addEventListener("click",e=>{
const b=e.target.closest("[data-analyze-saved]");if(!b)return;
let list=[];try{list=JSON.parse(localStorage.getItem(key)||"[]")}catch{}
const product=list[Number(b.dataset.analyzeSaved)];if(!product)return;
const tab=document.querySelector('[data-tab="dose-panel"]');
if(!tab){alert("Moduł dawek jest niedostępny.");return}
tab.click();
document.getElementById("doseInput").value=product.ingredients;
document.getElementById("doseAnalyze").click();
});
})();
