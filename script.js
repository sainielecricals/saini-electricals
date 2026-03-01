/*********************
  BASIC CONFIG
*********************/
const password = "dhairya123";
const whatsappNumber = "919548021272";

/*********************
  DEFAULT DATA
*********************/
const defaultData = {
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

let data = JSON.parse(localStorage.getItem("sainiData")) || defaultData;

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
    let section = document.createElement("div");
    section.className = "category";

    section.innerHTML = `
      <h2 class="cat-title">${category}</h2>
      <div class="products"></div>
    `;

    container.appendChild(section);
    let box = section.querySelector(".products");

    data[category].forEach((product, index) => {
      let image = product.image || "https://via.placeholder.com/250";
      let card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${image}">
        <input type="file" class="img-input hidden">
        <h3>${product.name}</h3>
        <p class="price">₹ <span>${product.price}</span></p>
        <button onclick="orderProduct('${category}',${index})">Order</button>
        <button class="delete-btn hidden" onclick="deleteProduct('${category}',${index})">Delete</button>
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
  let product = data[category][index];
  let msg = `I want details about ${product.name} - Price ₹${product.price}`;
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
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

function createFilters() {
  let filterBar = document.getElementById("filterBar");
  filterBar.innerHTML = `<button onclick="showAll()">All</button>`;

  for (let category in data) {
    let btn = document.createElement("button");
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
  document.querySelectorAll(".category").forEach(sec => (sec.style.display = "block"));
}

function searchProducts() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".card").forEach(card => {
    let name = card.querySelector("h3").innerText.toLowerCase();
    card.style.display = name.includes(input) ? "block" : "none";
  });
}

/*********************
  EDIT MODE (ADMIN)
*********************/
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("edit") === password) {
  enableEditMode();
}

function enableEditMode() {
  alert("Edit Mode Activated");

  // Category rename enable
  document.querySelectorAll(".cat-title").forEach(title => {
    title.contentEditable = true;
    title.addEventListener("blur", () => {
      let oldName = Object.keys(data).find(k => k === title.dataset.old);
      let newName = title.innerText;

      if (!oldName || oldName === newName) return;

      data[newName] = data[oldName];
      delete data[oldName];
      saveData();
      renderProducts();
      createFilters();
      enableEditMode();
    });
    title.dataset.old = title.innerText;
  });

  // Admin bar
  let adminBar = document.createElement("div");
  adminBar.className = "admin-bar";

  let options = Object.keys(data)
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");

  adminBar.innerHTML = `
    <select id="newCategory">${options}</select>
    <input type="text" id="newName" placeholder="Product Name">
    <input type="number" id="newPrice" placeholder="Price">
    <button onclick="addProduct()">Add Product</button>
  `;

  document.body.insertBefore(adminBar, container);

  // Editable prices
  document.querySelectorAll(".price span").forEach(span => {
    span.contentEditable = true;
    span.addEventListener("blur", () => {
      let name = span.closest(".card").querySelector("h3").innerText;
      for (let cat in data) {
        data[cat].forEach(p => {
          if (p.name === name) p.price = span.innerText;
        });
      }
      saveData();
    });
  });

  // Image upload
  document.querySelectorAll(".img-input").forEach(input => {
    input.classList.remove("hidden");
    input.addEventListener("change", function () {
      const reader = new FileReader();
      reader.onload = () => {
        let card = input.parentElement;
        card.querySelector("img").src = reader.result;
        let name = card.querySelector("h3").innerText;
        for (let cat in data) {
          data[cat].forEach(p => {
            if (p.name === name) p.image = reader.result;
          });
        }
        saveData();
      };
      reader.readAsDataURL(this.files[0]);
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => btn.classList.remove("hidden"));
}

function addProduct() {
  let cat = document.getElementById("newCategory").value;
  let name = document.getElementById("newName").value;
  let price = document.getElementById("newPrice").value;

  if (name && price) {
    data[cat].push({ name, price });
    saveData();
    renderProducts();
    createFilters();
    enableEditMode();
  }
}

/*********************
  CHATBOT (FINAL)
*********************/
function toggleChat() {
  document.getElementById("chatBox").classList.toggle("hidden");
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

function sendMessage() {
  let input = document.getElementById("userInput");
  let msg = input.value.trim();
  if (!msg) return;

  addChat(msg, "user");
  input.value = "";

  setTimeout(() => {
    addChat(getBotReply(msg), "bot");
  }, 600);
}

function addChat(text, type) {
  let chat = document.getElementById("chatMessages");
  let div = document.createElement("div");
  div.className = type;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getBotReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("ac"))
    return "Blue Star 1.5 Ton AC available. Same day delivery. WhatsApp 👉 https://wa.me/919548021272";

  if (msg.includes("solar"))
    return "Solar panel & inverter available. Free consultation 👉 https://wa.me/919548021272";

  if (msg.includes("inverter"))
    return "1100VA inverter available from ₹6,500.";

  if (msg.includes("delivery"))
    return "Yes! Same day delivery in Roorkee.";

  if (msg.includes("price"))
    return "Product ka naam bataye, exact price bata denge.";

  return "Madad ke liye WhatsApp kare 👉 https://wa.me/919548021272";
}
