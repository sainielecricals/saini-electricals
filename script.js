const password = "dhairya123";
const whatsapp = "919548021272";

/* =====================
   DATA (SAFE STRUCTURE)
===================== */
let data = JSON.parse(localStorage.getItem("sainiData")) || {
  Solar: [
    {
      name: "Solar Panel 550W",
      price: 28000,
      specs: "",
      bestUse: "",
      reviews: "",
      warranty: ""
    }
  ],
  Inverter: [
    {
      name: "Inverter 1100VA",
      price: 6500,
      specs: "",
      bestUse: "",
      reviews: "",
      warranty: ""
    }
  ]
};
save();

function save() {
  localStorage.setItem("sainiData", JSON.stringify(data));
}

/* =====================
   RENDER PRODUCTS
===================== */
const products = document.getElementById("products");

function render() {
  products.innerHTML = "";
  for (let c in data) {
    const sec = document.createElement("div");
    sec.innerHTML = `<h2>${c}</h2>`;

    data[c].forEach((p, i) => {
      sec.innerHTML += `
      <div style="margin:10px 0">
        <b>${p.name}</b> – ₹${p.price}
        <button onclick="order('${c}',${i})">Order</button>
        <button onclick="del('${c}',${i})">Delete</button>

        ${
          isEditMode()
            ? `
        <div style="margin-top:6px">
          <textarea placeholder="Specifications"
            onblur="saveExtra('${c}',${i},'specs',this.value)">${p.specs || ""}</textarea><br>

          <textarea placeholder="Best Use"
            onblur="saveExtra('${c}',${i},'bestUse',this.value)">${p.bestUse || ""}</textarea><br>

          <textarea placeholder="Reviews summary"
            onblur="saveExtra('${c}',${i},'reviews',this.value)">${p.reviews || ""}</textarea><br>

          <textarea placeholder="Warranty"
            onblur="saveExtra('${c}',${i},'warranty',this.value)">${p.warranty || ""}</textarea>
        </div>
        `
            : ""
        }
      </div>`;
    });

    products.appendChild(sec);
  }
}
render();

/* =====================
   ADMIN MODE
===================== */
const adminRoot = document.getElementById("adminRoot");

function isEditMode() {
  return new URLSearchParams(location.search).get("edit") === password;
}

if (isEditMode()) {
  adminRoot.innerHTML = `
  <div class="admin-bar">
    <input id="cat" placeholder="Category">
    <button onclick="addCat()">Add Category</button><br>

    <select id="sel"></select>
    <input id="name" placeholder="Product">
    <input id="price" placeholder="Price">
    <button onclick="addProd()">Add Product</button>
  </div>`;
  updateSel();
}

function updateSel() {
  sel.innerHTML = "";
  for (let c in data) sel.innerHTML += `<option>${c}</option>`;
}

function addCat() {
  if (!cat.value) return;
  if (!data[cat.value]) {
    data[cat.value] = [];
    save();
    render();
    updateSel();
  }
}

function addProd() {
  if (!name.value || !price.value) return;
  data[sel.value].push({
    name: name.value,
    price: price.value,
    specs: "",
    bestUse: "",
    reviews: "",
    warranty: ""
  });
  save();
  render();
}

/* =====================
   ACTIONS
===================== */
function del(c, i) {
  data[c].splice(i, 1);
  save();
  render();
}

function order(c, i) {
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(data[c][i].name)}`);
}

function saveExtra(c, i, key, val) {
  data[c][i][key] = val;
  save();
}

/* =====================
   CHAT
===================== */
chatToggle.onclick = () => chatBox.classList.toggle("hidden");
chatClose.onclick = () => chatBox.classList.add("hidden");
sendBtn.onclick = send;
voiceBtn.onclick = startVoice;

function send() {
  if (!userInput.value) return;

  const msg = userInput.value.toLowerCase();
  chatMessages.innerHTML += `<div class="user">${userInput.value}</div>`;

  chatMessages.innerHTML += `<div class="bot">${getBotReply(msg)}</div>`;
  userInput.value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* =====================
   CHAT LOGIC (HINGLISH)
===================== */
function getBotReply(msg) {
  for (let c in data) {
    for (let p of data[c]) {
      if (msg.includes(p.name.toLowerCase())) {
        return formatProduct(p);
      }
    }
  }
  return `👋 Welcome to Saini Electricals<br>
Solar, Inverter, AC, Batteries available.<br>
👉 WhatsApp: ${whatsapp}`;
}

function formatProduct(p) {
  return `
<b>${p.name}</b><br>
💰 Price: ₹${p.price}<br><br>

<b>Specifications:</b><br>
${p.specs || autoSpecs(p.name)}<br><br>

<b>Best Use:</b><br>
${p.bestUse || "Home & commercial electrical use"}<br><br>

<b>Reviews:</b><br>
${p.reviews || "⭐ Trusted by customers in Roorkee"}<br><br>

<b>Warranty:</b><br>
${p.warranty || "Manufacturer warranty available"}<br><br>

👉 <a href="https://wa.me/${whatsapp}" target="_blank">Chat on WhatsApp 📲</a>
`;
}

/* AUTO SPECS (SAFE, NO INTERNET) */
function autoSpecs(name) {
  if (name.toLowerCase().includes("solar"))
    return "High efficiency panel, long life, low maintenance.";
  if (name.toLowerCase().includes("inverter"))
    return "Pure sine wave output, fast charging, battery protection.";
  return "Good quality electrical product.";
}

/* =====================
   VOICE
===================== */
function startVoice() {
  if (!("webkitSpeechRecognition" in window))
    return alert("Chrome use karo");

  const r = new webkitSpeechRecognition();
  r.lang = "en-IN";
  r.onresult = e => (userInput.value = e.results[0][0].transcript);
  r.start();
}
