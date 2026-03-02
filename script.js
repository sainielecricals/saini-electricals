/*********************
  BASIC CONFIG
*********************/
const password = "dhairya123";
const whatsappNumber = "919548021272";

/*********************
  LIVE DATA ONLY
*********************/
let data = JSON.parse(localStorage.getItem("sainiData"));

if (!data || typeof data !== "object") {
  data = {}; // empty start, no default
  localStorage.setItem("sainiData", JSON.stringify(data));
}

function saveData() {
  localStorage.setItem("sainiData", JSON.stringify(data));
}

/*********************
  PRODUCT RENDER
*********************/
const container = document.getElementById("products");

function renderProducts() {
  container.innerHTML = "";

  for (let category in data) {
    const section = document.createElement("div");
    section.className = "category";

    section.innerHTML = `
      <h2 class="cat-title">${category}</h2>
      <div class="products"></div>
    `;

    container.appendChild(section);
    const box = section.querySelector(".products");

    data[category].forEach((product, index) => {
      const image = product.image || "https://via.placeholder.com/250";
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${image}">
        <input type="file" class="img-input hidden">
        <h3>${product.name}</h3>
        <p class="price">₹ <span>${product.price}</span></p>
        <button onclick="orderProduct('${category}', ${index})">Order</button>
        <button class="delete-btn hidden"
          onclick="deleteProduct('${category}', ${index})">Delete</button>
      `;

      box.appendChild(card);
    });
  }
}

renderProducts();
createFilters();

/*********************
  PRODUCT ACTIONS
*********************/
function orderProduct(category, index) {
  const product = data[category][index];
  const msg = `I want details about ${product.name} - Price ₹${product.price}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`);
}

function deleteProduct(category, index) {
  data[category].splice(index, 1);
  saveData();
  renderProducts();
  enableEditMode();
}

/*********************
  FILTER & SEARCH
*********************/
function scrollToProducts() {
  document.getElementById("products")
    .scrollIntoView({ behavior: "smooth" });
}

function createFilters() {
  const filterBar = document.getElementById("filterBar");
  filterBar.innerHTML = `<button onclick="showAll()">All</button>`;

  for (let category in data) {
    const btn = document.createElement("button");
    btn.innerText = category;
    btn.onclick = () => filterCategory(category);
    filterBar.appendChild(btn);
  }
}

function filterCategory(category) {
  document.querySelectorAll(".category").forEach(sec => {
    sec.style.display =
      sec.querySelector("h2").innerText === category ? "block" : "none";
  });
}

function showAll() {
  document.querySelectorAll(".category")
    .forEach(sec => sec.style.display = "block");
}

function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    const name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(input) ? "block" : "none";
  });
}

/*********************
  EDIT MODE
*********************/
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("edit") === password) {
  enableEditMode();
  enableBgEditor();
  enableHeroBgEditor();
}

/*********************
  CHATBOT (DYNAMIC)
*********************/
function toggleChat() {
  const box = document.getElementById("chatBox");
  box.classList.toggle("hidden");

  if (!box.classList.contains("hidden")) {
    const chat = document.getElementById("chatMessages");
    if (chat.children.length === 0) {
      addChat(`
👋 <b>Welcome to Saini Electricals!</b><br>
How can I help you today?<br><br>
👉 <a href="https://wa.me/${whatsappNumber}" target="_blank"
style="color:#fff;font-weight:bold;">
Chat on WhatsApp
</a>
`, "bot");
    }
  }
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  addChat(msg, "user");
  input.value = "";

  setTimeout(() => {
    addChat(getBotReply(msg), "bot");
  }, 400);
}

function addChat(text, type) {
  const chat = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = type === "user" ? "user-message" : "bot-message";
  div.innerHTML = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

/*********************
  SMART BOT REPLY
*********************/
function getBotReply(msg) {
  msg = msg.toLowerCase();

  // CATEGORY MATCH
  for (let category in data) {
    if (msg.includes(category.toLowerCase())) {
      return formatCategoryReply(category);
    }
  }

  // PRODUCT MATCH
  for (let category in data) {
    for (let product of data[category]) {
      if (msg.includes(product.name.toLowerCase())) {
        return `
📦 <b>${product.name}</b><br>
💰 Price: ₹${product.price}<br><br>
👉 <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          "I want details about " + product.name
        )}" target="_blank"
style="color:#fff;font-weight:bold;">
Chat on WhatsApp
</a>`;
      }
    }
  }

  return `
🤖 You can ask about:<br>
• Solar<br>
• Inverter<br>
• AC<br>
• Batteries<br><br>
Type product or category name 👇
`;
}

function formatCategoryReply(category) {
  let reply = `🔹 <b>${category}</b><br><br>`;
  data[category].forEach(p => {
    reply += `• ${p.name} – ₹${p.price}<br>`;
  });

  reply += `<br>
👉 <a href="https://wa.me/${whatsappNumber}" target="_blank"
style="color:#fff;font-weight:bold;">
Chat on WhatsApp
</a>`;

  return reply;
}
