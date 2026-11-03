/* Rozszerzenie RIMCI: szczegółowe karty, powiązania i katalog produktów.
   Plan dawkowania NIE jest generowany automatycznie bez oceny leków i przeciwwskazań. */
(() => {
const db=window.RIMCI_INGREDIENTS||[], details=window.RIMCI_ACTIVE_DETAILS||{};
const normalize=s=>String(s).toLocaleLowerCase("pl").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const section=document.getElementById("supplementManager");
section.innerHTML='<h3>Dodaj suplement</h3><p class="muted">Podaj konkretny produkt i jego producenta. Skład wpisuj dokładnie z etykiety.</p><label>Producent / nazwa <input id="prodName" placeholder="np. Swanson — Magnesium Citrate"></label><label>Skład z etykiety <textarea id="prodIngredients" rows="5" placeholder="Skład i ilości deklarowane na opakowaniu"></textarea></label><button id="saveProduct">Dodaj do moich suplementów</button><div id="productList" class="cards"></div><button id="exportSupplements">Eksportuj suplementy JSON</button>';
let products=[];try{products=JSON.parse(localStorage.getItem("rimci-products-v1")||"[]")}catch{}
const save=()=>{localStorage.setItem("rimci-products-v1",JSON.stringify(products));document.getElementById("ownedCount").textContent=products.length};
function renderProducts(){document.getElementById("ownedCount").textContent=products.length;document.getElementById("productList").innerHTML=products.map((p,i)=>'<article class="card"><h3>'+escape(p.name)+'</h3><p>'+escape(p.ingredients)+'</p><button data-remove-product="'+i+'">Usuń</button></article>').join("")||"<p>Brak produktów.</p>"}
document.getElementById("saveProduct").addEventListener("click",()=>{const name=document.getElementById("prodName").value.trim(),ingredients=document.getElementById("prodIngredients").value.trim();if(!name||!ingredients)return alert("Podaj nazwę i skład.");products.push({name,ingredients,createdAt:new Date().toISOString()});save();renderProducts();document.getElementById("prodName").value="";document.getElementById("prodIngredients").value=""});
document.addEventListener("click",e=>{const target=e.target.closest("[data-remove-product]");if(!target)return;products.splice(Number(target.dataset.removeProduct),1);save();renderProducts()});
document.getElementById("exportSupplements").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(products,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="rimci-moje-suplementy.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
renderProducts();
const info=document.createElement("dialog");info.style.cssText="background:#14221d;color:#e7f4ed;border:1px solid #416253;border-radius:16px;max-width:min(92vw,680px);max-height:85vh;overflow:auto;padding:24px";document.body.append(info);
const oldCards=()=>document.querySelectorAll(".card");
const addDetailButtons=()=>{oldCards().forEach(card=>{if(card.querySelector("[data-details]"))return;const h=card.querySelector("h3");if(!h)return;const x=db.find(x=>x.name===h.textContent);if(!x)return;const btn=document.createElement("button");btn.textContent="Karta i powiązania";btn.dataset.details=x.id;card.append(btn)})};
const observer=new MutationObserver(addDetailButtons);observer.observe(document.querySelector("main"),{childList:true,subtree:true});addDetailButtons();
document.addEventListener("click",e=>{const button=e.target.closest("[data-details]");if(!button)return;const x=db.find(x=>x.id===button.dataset.details);if(!x)return;const d=details[x.id];const links=d?.links?.map(([id,type,why])=>'<li><strong>'+escape(db.find(y=>y.id===id)?.name||id)+'</strong> ('+escape(type)+'): '+escape(why)+'</li>').join("")||"<li>Powiązania wymagają opracowania.</li>";
info.innerHTML='<button id="closeDetails" style="float:right">Zamknij ×</button><h2>'+escape(x.name)+'</h2><p class="muted">'+escape(x.aliases.join(", "))+'</p><h3>Funkcja i mechanizm</h3><p>'+escape(d?.mechanism||x.role)+'</p><h3>Działania niepożądane / nadmiar</h3><p>'+escape(d?.cautions||"Brak szczegółowej karty — nie oznacza to braku ryzyka.")+'</p><h3>Przyjmowanie</h3><p>'+escape(d?.taking||"Wymaga sprawdzenia postaci, ilości i przeciwwskazań.")+'</p><h3>Powiązania</h3><ul>'+links+'</ul><p class="muted">Wersja robocza, bez automatycznych zaleceń dawkowania.</p>';
info.showModal();document.getElementById("closeDetails").onclick=()=>info.close()});
info.addEventListener("click",e=>{if(e.target===info)info.close()});
})();
