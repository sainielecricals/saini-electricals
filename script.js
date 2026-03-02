const password = "dhairya123";
const whatsapp = "919548021272";

/* ===== DATA ===== */
let data = JSON.parse(localStorage.getItem("sainiData")) || {
  "Solar": [
    {
      name: "Solar Panel 550W",
      price: 28000,
      specs: "High efficiency mono panel",
      usage: "Homes, shops, solar systems",
      reviews: "Log iska output aur durability pasand karte hain",
      warranty: "25 years performance warranty"
    }
  ]
};
save();

function save() {
  localStorage.setItem("sainiData", JSON.stringify(data));
}

/* ===== RENDER PRODUCTS ===== */
const products = document.getElementById("products");

function render() {
  products.innerHTML = "";

  for (let cat in data) {
    const sec = document.createElement("div");
    sec.innerHTML = `<h2>${cat}</h2>`;
    data[cat].forEach((p, i) => {
      sec.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <p class="price">₹ ${p.price}</p>

        <button onclick="order('${cat}',${i})">Order</button>

        <div class="edit-only hidden">
          <textarea placeholder="Specifications">${p.specs || ""}</textarea>
          <textarea placeholder="Best Use">${p.usage || ""}</textarea>
          <textarea placeholder="Reviews">${p.reviews || ""}</textarea>
          <textarea placeholder="Warranty">${p.warranty || ""}</textarea>
          <button class="save-btn" onclick="saveDetails('${cat}',${i},this)">
            Save Details
          </button>
          <button onclick="del('${cat}',${i})">Delete</button>
        </div>
      </div>`;
    });
    products.appendChild(sec);
  }
}
render();

/* ===== ACTIONS ===== */
function order(c, i) {
  const p = data[c][i];
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(p.name)}`);
}
function del(c, i) {
  data[c].splice(i, 1);
  save(); render(); editMode();
}

/* ===== SAVE EXTRA DETAILS ===== */
function saveDetails(c, i, btn) {
  const box = btn.parentElement;
  const fields = box.querySelectorAll("textarea");

  data[c][i].specs = fields[0].value;
  data[c][i].usage = fields[1].value;
  data[c][i].reviews = fields[2].value;
  data[c][i].warranty = fields[3].value;

  save();
  alert("Details saved for chatbot ✅");
}

/* ===== EDIT MODE ===== */
function editMode() {
  document.querySelectorAll(".edit-only")
    .forEach(e => e.classList.remove("hidden"));
}

if (new URLSearchParams(location.search).get("edit") === password) {
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="admin-bar">
      <input id="newCat" placeholder="New Category">
      <button onclick="addCat()">Add Category</button><br>
      <select id="catSel"></select>
      <input id="newName" placeholder="Product Name">
      <input id="newPrice" placeholder="Price">
      <button onclick="addProd()">Add Product</button>
    </div>
  `);
  updateSel();
  editMode();
}

function updateSel() {
  catSel.innerHTML = "";
  for (let c in data) catSel.innerHTML += `<option>${c}</option>`;
}
function addCat() {
  if (!newCat.value) return;
  if (!data[newCat.value]) {
    data[newCat.value] = [];
    save(); render(); updateSel();
  }
}
function addProd() {
  if (!newName.value || !newPrice.value) return;
  data[catSel.value].push({
    name: newName.value,
    price: newPrice.value,
    specs: "",
    usage: "",
    reviews: "",
    warranty: ""
  });
  save(); render(); editMode();
  newName.value = newPrice.value = "";
}

/* ===== CHATBOT ===== */
function toggleChat() {
  chatBox.classList.toggle("hidden");
}

function sendMessage() {
  if (!userInput.value) return;
  addChat(userInput.value, "user");

  setTimeout(() => {
    addChat(getReply(userInput.value), "bot");
  }, 400);

  userInput.value = "";
}

function addChat(text, type) {
  const d = document.createElement("div");
  d.className = type === "user" ? "user-message" : "bot-message";
  d.innerHTML = text;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getReply(msg) {
  msg = msg.toLowerCase();
  for (let c in data) {
    for (let p of data[c]) {
      if (msg.includes(p.name.toLowerCase())) {
        return `
<b>${p.name}</b><br>
💰 ₹${p.price}<br>
📝 ${p.specs}<br>
🏠 ${p.usage}<br>
⭐ ${p.reviews}<br>
🛡️ Warranty: ${p.warranty}<br><br>
👉 <a href="https://wa.me/${whatsapp}" target="_blank">
Chat on WhatsApp 📲</a>`;
      }
    }
  }
  return `👋 Welcome to Saini Electricals<br>
Product ka naam likhiye, main details bata dunga 😊`;
}
