/*********************
  BASIC CONFIG
*********************/
const password = "dhairya123";
const whatsappNumber = "919548021272";

/*********************
  LIVE DATA ONLY
*********************/
let data = JSON.parse(localStorage.getItem("sainiData")) || {};
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
      const star = product.popular ? "⭐ Popular" : "";

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${image}">
        <input type="file" class="img-input hidden">

        <h3>${product.name}</h3>
        <small style="color:#ffcc00">${star}</small>

        <p class="price">₹ <span>${product.price}</span></p>

        <button onclick="orderProduct('${category}', ${index})">Order</button>

        <button class="popular-btn hidden"
          onclick="togglePopular('${category}', ${index})">
          ⭐ Pin Popular
        </button>

        <button class="delete-btn hidden"
          onclick="deleteProduct('${category}', ${index})">
          Delete
        </button>
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
  const p = data[category][index];
  const msg = `I want details about ${p.name} - Price ₹${p.price}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`);
}

function deleteProduct(category, index) {
  data[category].splice(index, 1);
  saveData();
  renderProducts();
  enableEditMode();
}

function togglePopular(category, index) {
  data[category][index].popular = !data[category][index].popular;
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

/*********************
  EDIT MODE
*********************/
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("edit") === password) enableEditMode();

function enableEditMode() {
  document.querySelectorAll(".img-input").forEach(i => i.classList.remove("hidden"));
  document.querySelectorAll(".delete-btn").forEach(b => b.classList.remove("hidden"));
  document.querySelectorAll(".popular-btn").forEach(b => b.classList.remove("hidden"));

  document.querySelectorAll(".price span").forEach(span => {
    span.contentEditable = true;
    span.onblur = () => {
      const name = span.closest(".card").querySelector("h3").innerText;
      for (let cat in data) {
        data[cat].forEach(p => {
          if (p.name === name) p.price = span.innerText;
        });
      }
      saveData();
    };
  });
}

/*********************
  CHATBOT
*********************/
function toggleChat() {
  const box = document.getElementById("chatBox");
  box.classList.toggle("hidden");

  if (!box.classList.contains("hidden")) {
    const chat = document.getElementById("chatMessages");
    if (!chat.children.length) {
      addChat(renderWelcome(), "bot");
    }
  }
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
  CHAT CONTENT
*********************/
function renderWelcome() {
  let html = `
👋 <b>Welcome to Saini Electricals</b><br>
Popular products 👇<br><br>
`;

  getPopularProducts().forEach(p => {
    html += `• ${p.name} – ₹${p.price}<br>`;
  });

  html += `
<br>
👉 <a href="https://wa.me/${whatsappNumber}" target="_blank"
style="color:#00ff88;font-weight:bold;">
Chat on WhatsApp 📲
</a>`;
  return html;
}

function getPopularProducts() {
  let list = [];
  for (let cat in data) {
    data[cat].forEach(p => {
      if (p.popular) list.push(p);
    });
  }
  return list;
}

function getBotReply(msg) {
  msg = msg.toLowerCase();

  for (let cat in data) {
    if (msg.includes(cat.toLowerCase())) {
      return formatCategory(cat);
    }
    for (let p of data[cat]) {
      if (msg.includes(p.name.toLowerCase())) {
        return formatProduct(p);
      }
    }
  }

  return renderWelcome();
}

function formatCategory(cat) {
  let html = `<b>${cat}</b><br><br>`;
  data[cat].forEach(p => {
    html += `• ${p.name} – ₹${p.price}<br>`;
  });
  return html;
}

function formatProduct(p) {
  return `
<b>${p.name}</b><br>
💰 ₹${p.price}<br><br>
👉 <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Details about " + p.name
  )}" target="_blank"
style="color:#00ff88;font-weight:bold;">
Chat on WhatsApp 📲
</a>`;
}
