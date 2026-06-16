const box = document.createElement("div");
const style = document.createElement("style");

style.innerHTML = `
@keyframes floatIn {
from { transform: translateY(40px); opacity:0; }
to { transform: translateY(0); opacity:1; }
}

@keyframes cardPop{
from{ transform:scale(0.9); opacity:0; }
to{ transform:scale(1); opacity:1; }
}
`;

document.head.appendChild(style);

box.style.position = "fixed";
box.style.bottom = "30px";
box.style.right = "30px";
box.style.width = "320px";
box.style.padding = "18px";
box.style.borderRadius = "18px";
box.style.background = "linear-gradient(135deg,#1e3a8a,#7c3aed)";
box.style.color = "white";
box.style.fontFamily = "Arial";
box.style.boxShadow = "0 15px 40px rgba(0,0,0,0.4)";
box.style.zIndex = "999999";
box.style.animation = "floatIn 0.5s ease";

box.innerHTML = `

<h3 style="margin-top:0;">🛒 Voicekart</h3>

<button id="voiceBtn"
style="padding:10px 14px;border:none;background:#3b82f6;color:white;border-radius:8px;cursor:pointer;">
🎤 Speak </button>

<button id="viewCart"
style="margin-top:8px;padding:8px 12px;border:none;background:#22c55e;color:white;border-radius:6px;cursor:pointer;">
🛒 View Cart </button>

<button id="compareCart"
style="margin-top:8px;padding:8px 12px;border:none;background:#f59e0b;color:white;border-radius:6px;cursor:pointer;">
🔍 Compare Cart </button>

<button id="compareOnline"
style="margin-top:8px;padding:8px 12px;border:none;background:#ef4444;color:white;border-radius:6px;cursor:pointer;">
🌐 Compare Online </button>

<div id="results" style="margin-top:12px;"></div>
`;

document.body.appendChild(box);

document.getElementById("voiceBtn").addEventListener("click", startVoice);
document.getElementById("viewCart").onclick = showCart;
document.getElementById("compareCart").onclick = compareCart;
document.getElementById("compareOnline").onclick = compareOnline;

/* ---------- VOICE SEARCH ---------- */

function startVoice(){

const results = document.getElementById("results");

results.innerHTML = "🎤 Listening...";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";

recognition.start();

recognition.onresult = function(event){

const text = event.results[0][0].transcript.toLowerCase();

const msg = new SpeechSynthesisUtterance("Searching for " + text);
speechSynthesis.speak(msg);

results.innerHTML = "🔍 Searching...";

setTimeout(() => {

const parsed = parseQuery(text);
showResults(parsed.product, parsed.price);

}, 800);

}
}

function parseQuery(text){

let priceMatch = text.match(/\d+/);
let price = priceMatch ? priceMatch[0] : null;

let product = text
.replace(/\d+/g,"")
.replace(/under|below|rs|rupees/gi,"")
.trim();

return { product, price };
}

/* ---------- SEARCH RESULTS ---------- */

function showResults(product, price){

const results = document.getElementById("results");

let searchText = product;
if(price) searchText += " under " + price;

const query = searchText.replace(/\s+/g,"+");

const amazon = "https://www.amazon.in/s?k=" + query;
const flipkart = "https://www.flipkart.com/search?q=" + query;
const myntra = "https://www.myntra.com/" + query;

results.innerHTML = `

 <div style="background:rgba(255,255,255,0.15);padding:14px;border-radius:14px;display:flex;flex-direction:column;gap:8px;animation:cardPop 0.4s ease;">

 <h4>${product}</h4>

${price ? `<p>Budget: ₹${price}</p>` : ""}

 <div style="display:flex;flex-wrap:wrap;gap:8px;">

<a href="${amazon}" target="_blank"
style="background:#f59e0b;padding:6px 10px;border-radius:6px;color:black;text-decoration:none;">
Amazon</a>

<a href="${flipkart}" target="_blank"
style="background:#60a5fa;padding:6px 10px;border-radius:6px;color:black;text-decoration:none;">
Flipkart</a>

<a href="${myntra}" target="_blank"
style="background:#ec4899;padding:6px 10px;border-radius:6px;color:white;text-decoration:none;">
Myntra</a>

<button id="openAll"
style="background:#22c55e;padding:6px 10px;border-radius:6px;color:white;border:none;cursor:pointer;">
🌐 All Stores </button>

</div>
</div>
 `;

document.getElementById("openAll").onclick = () => {
window.open(amazon,"_blank");
window.open(flipkart,"_blank");
window.open(myntra,"_blank");
};
}

/* ---------- CART VIEW ---------- */

function showCart(){

chrome.storage.local.get(["vkcart"], (data) => {

const cart = data.vkcart || [];

let html = `<h4>🛒 Voicekart Cart</h4>`;

if(cart.length === 0){
html += "<p>No products added yet.</p>";
}

cart.forEach((p,index) => {

html += `

   <div style="background:rgba(255,255,255,0.15);padding:10px;border-radius:10px;margin-top:8px">

<b>${p.title}</b><br>
💰 ${p.price}<br>
🏪 ${p.site}

   <div style="margin-top:6px">

<a href="${p.link}" target="_blank">Open</a>

<button data-index="${index}" class="removeItem">Remove</button>

   </div>

   </div>
   `;
 });

document.getElementById("results").innerHTML = html;

document.querySelectorAll(".removeItem").forEach(btn => {

btn.onclick = function(){

```
 const index = this.dataset.index;

 chrome.storage.local.get(["vkcart"], (data) => {

   let cart = data.vkcart || [];

   cart.splice(index,1);

   chrome.storage.local.set({ vkcart: cart });

   showCart();

 });
```

};

});

});

}

/* ---------- COMPARE CART ---------- */

function compareCart(){

chrome.storage.local.get(["vkcart"], (data) => {

const cart = data.vkcart || [];

if(cart.length < 2){
alert("Add at least 2 products to compare.");
return;
}

let best = cart[0];
let highest = cart[0];

cart.forEach(p => {

const price = parseInt(p.price.replace(/[^0-9]/g,""));

if(price < parseInt(best.price.replace(/[^0-9]/g,"")))
best = p;

if(price > parseInt(highest.price.replace(/[^0-9]/g,"")))
highest = p;

});

const bestPrice = parseInt(best.price.replace(/[^0-9]/g,""));
const highPrice = parseInt(highest.price.replace(/[^0-9]/g,""));

const savings = highPrice - bestPrice;

const message =
"Best deal is on " + best.site +
" for rupees " + bestPrice +
". You save rupees " + savings;

const msg = new SpeechSynthesisUtterance(message);
speechSynthesis.speak(msg);

document.getElementById("results").innerHTML = `

 <div style="background:rgba(255,255,255,0.15);padding:12px;border-radius:12px;">
 🔥 Best Deal<br><br>
 <b>${best.title}</b><br>
 ₹${bestPrice}<br>
 ${best.site}<br><br>
 💸 You save ₹${savings}
 </div>
 `;

});

}

/* ---------- COMPARE ONLINE ---------- */

function compareOnline(){

let title =
  document.querySelector(".product-title")?.innerText ||
  document.querySelector("h1")?.innerText ||
  "Product";

let priceText =
  document.querySelector(".price,.product-price")?.innerText || "699";

let vkPrice = parseInt(priceText.replace(/[^0-9]/g,"")) || 699;

const amazonPrice = vkPrice + Math.floor(Math.random()*100);
const flipkartPrice = vkPrice + Math.floor(Math.random()*80);
const myntraPrice = vkPrice + Math.floor(Math.random()*120);

const query = encodeURIComponent(title);

const amazon = "https://www.amazon.in/s?k=" + query;
const flipkart = "https://www.flipkart.com/search?q=" + query;
const myntra = "https://www.myntra.com/" + query;

document.getElementById("results").innerHTML = `

<div style="background:rgba(255,255,255,0.15);padding:14px;border-radius:14px;animation:cardPop 0.4s ease;">

<h4>🔎 Price Comparison</h4>

<div style="display:flex;justify-content:space-between">
<b>VoiceKart</b>
<span>₹${vkPrice}</span>
</div>

<div style="display:flex;justify-content:space-between">
<b>Amazon</b>
<span>₹${amazonPrice}</span>
<a href="${amazon}" target="_blank">View</a>
</div>

<div style="display:flex;justify-content:space-between">
<b>Flipkart</b>
<span>₹${flipkartPrice}</span>
<a href="${flipkart}" target="_blank">View</a>
</div>

<div style="display:flex;justify-content:space-between">
<b>Myntra</b>
<span>₹${myntraPrice}</span>
<a href="${myntra}" target="_blank">View</a>
</div>

<button id="openAllStores"
style="margin-top:10px;background:#22c55e;border:none;padding:8px;border-radius:6px;color:white;cursor:pointer;">
🌐 Open All Stores
</button>

</div>
`;

document.getElementById("openAllStores").onclick = () => {
window.open(amazon,"_blank");
window.open(flipkart,"_blank");
window.open(myntra,"_blank");
};

}

/* ---------- PRODUCT SCRAPER ---------- */

function addCartButton(){

let title = "";
let price = "";
let site = location.hostname;
let link = location.href;

if(site.includes("amazon")){
const t = document.getElementById("productTitle");
const p = document.querySelector(".a-price-whole");
if(t && p){
title = t.innerText.trim();
price = p.innerText.trim();
}
}

if(site.includes("flipkart")){
const t = document.querySelector("span.B_NuCI, span.VU-ZEz");
const p = document.querySelector("div._30jeq3");
if(t && p){
title = t.innerText.trim();
price = p.innerText.trim();
}
}

if(site.includes("myntra")){
const t = document.querySelector("h1.pdp-name");
const p = document.querySelector("span.pdp-price");
if(t && p){
title = t.innerText.trim();
price = p.innerText.trim();
}
}

if(!title || !price) return;

createCartButton(title, price, site, link);
}

setTimeout(addCartButton,2000);

function createCartButton(title, price, site, link){

if(document.getElementById("voicekartAdd")) return;

const btn = document.createElement("button");

btn.id = "voicekartAdd";
btn.innerText = "➕ Add to Voicekart Cart";

btn.style.position = "fixed";
btn.style.top = "120px";
btn.style.right = "30px";
btn.style.padding = "10px 14px";
btn.style.background = "#22c55e";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "8px";
btn.style.cursor = "pointer";

document.body.appendChild(btn);

btn.onclick = () => {

const product = { title, price, site, link };

chrome.storage.local.get(["vkcart"], (data) => {

```
 const cart = data.vkcart || [];

 cart.push(product);

 chrome.storage.local.set({ vkcart: cart });

 alert("Added to Voicekart cart!");
```

});

};

}


/* ---------- DRAG EXTENSION BOX ---------- */

let isDragging = false;
let offsetX, offsetY;

box.addEventListener("mousedown", (e) => {

  isDragging = true;

  offsetX = e.clientX - box.getBoundingClientRect().left;
  offsetY = e.clientY - box.getBoundingClientRect().top;

  box.style.cursor = "grabbing";

});

document.addEventListener("mousemove", (e) => {

  if(!isDragging) return;

  box.style.left = (e.clientX - offsetX) + "px";
  box.style.top = (e.clientY - offsetY) + "px";

  box.style.right = "auto";
  box.style.bottom = "auto";

});

document.addEventListener("mouseup", () => {

  isDragging = false;
  box.style.cursor = "grab";

});