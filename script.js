/*********************
  BASIC CONFIG
*********************/
const password = "dhairya123";
const whatsappNumber = "919548021272";

/*********************
  INIT DATA (SAFE)
*********************/
let data = JSON.parse(localStorage.getItem("sainiData"));

if (!data || Object.keys(data).length === 0) {
  data = {
    "☀️ Solar Section": [
      { name: "Solar Panel 550W", price: 28000 },
      { name: "Solar Inverter 5KW", price: 45000 }
    ],
    "⚡ Power Backup": [
      { name: "Inverter 1100VA", price: 6500 }
    ],
    "❄️ Cooling & Air": [
      { name: "Blue Star 1.5 Ton AC", price: 36500 }
    ]
  };
  saveData();
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
  FILTER
*********************/
function createFilters() {
  const filterBar = document.getElementById("filterBar");
  if (!filterBar) return;

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
  EDIT MODE (FIXED)
*********************/
function enableEditMode() {
  if (document.getElementById("editBadge")) return;

  document.body.insertAdjacentHTML(
    "afterbegin",
    `<div id="editBadge" style="
      position:fixed;
      top:10px;
      left:10px;
      background:#ff7a00;
      color:#000;
      padding:6px 12px;
      border-radius:6px;
      font-weight:bold;
      z-index:9999;">
      ✏️ EDIT MODE
    </div>`
  );

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

  // Image upload
  document.querySelectorAll(".img-input").forEach(input => {
    input.onchange = function () {
      const reader = new FileReader();
      reader.onload = () => {
        const card = input.parentElement;
        card.querySelector("img").src = reader.result;

        const name = card.querySelector("h3").innerText;
        for (let cat in data) {
          data[cat].forEach(p => {
            if (p.name === name) p.image = reader.result;
          });
        }
        saveData();
      };
      reader.readAsDataURL(this.files[0]);
    };
  });
}

/*********************
  CHAT
*********************/
function toggleChat() {
  document.getElementById("chatBox").classList.toggle("hidden");
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  addChat(msg, "user");
  input.value = "";

  setTimeout(() => {
    addChat(renderWelcome(), "bot");
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

function renderWelcome() {
  let html = `<b>Welcome to Saini Electricals</b><br><br>`;
  for (let cat in data) {
    data[cat].forEach(p => {
      if (p.popular) html += `• ${p.name} – ₹${p.price}<br>`;
    });
  }
  html += `<br><a href="https://wa.me/${whatsappNumber}" target="_blank">Chat on WhatsApp 📲</a>`;
  return html;
}

/*********************
  EDIT MODE TRIGGER (IMPORTANT)
*********************/
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("edit") === password) {
    enableEditMode();
  }
});
/*********************
  ADMIN PANEL (ADD PRODUCTS + CATEGORY)
*********************/
function showAdminPanel() {
  if (document.getElementById("adminPanel")) return;

  const panel = document.createElement("div");
  panel.id = "adminPanel";
  panel.className = "admin-bar";

  panel.innerHTML = `
    <h3>🛠 Admin Panel</h3>

    <input id="newCategory" placeholder="New Category Name">
    <button onclick="addCategory()">Add Category</button>

    <hr>

    <select id="categorySelect"></select><br>
    <input id="productName" placeholder="Product Name">
    <input id="productPrice" placeholder="Price">
    <button onclick="addProduct()">Add Product</button>
  `;

  document.body.prepend(panel);
  updateCategorySelect();
}

function updateCategorySelect() {
  const select = document.getElementById("categorySelect");
  if (!select) return;

  select.innerHTML = "";
  Object.keys(data).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function addCategory() {
  const name = document.getElementById("newCategory").value.trim();
  if (!name) return alert("Category name likh bhai");

  if (!data[name]) {
    data[name] = [];
    saveData();
    renderProducts();
    createFilters();
    updateCategorySelect();
  }
}

function addProduct() {
  const cat = document.getElementById("categorySelect").value;
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();

  if (!name || !price) return alert("Product name + price dono likh");

  data[cat].push({ name, price });
  saveData();
  renderProducts();
  createFilters();
  enableEditMode();
}

