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
      <h2 class="cat-title" data-cat="${category}">${category}</h2>
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
  createFilters();
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
      sec.querySelector(".cat-title").innerText === category ? "block" : "none";
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
  enableDesignEditor();
}

function enableEditMode() {
  if (document.querySelector(".admin-bar")) return;

  alert("Edit Mode Activated");

  // Category rename
  document.querySelectorAll(".cat-title").forEach(title => {
    const oldName = title.innerText;
    title.contentEditable = true;

    title.addEventListener("blur", () => {
      const newName = title.innerText.trim();
      if (!newName || newName === oldName) return;

      data[newName] = data[oldName];
      delete data[oldName];
      saveData();
      renderProducts();
      createFilters();
      enableEditMode();
    });
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

  // Editable price
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

  document.querySelectorAll(".delete-btn").forEach(btn =>
    btn.classList.remove("hidden")
  );
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
  CHATBOT
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

  addChat(msg, "user-message");
  input.value = "";

  setTimeout(() => {
    addChat(getBotReply(msg), "bot-message");
  }, 600);
}

function addChat(text, cls) {
  let chat = document.getElementById("chatMessages");
  let div = document.createElement("div");
  div.className = cls;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getBotReply(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("ac"))
    return "Blue Star 1.5 Ton AC available. Same day delivery.";

  if (msg.includes("solar"))
    return "Solar panel & inverter available. Free consultation.";

  if (msg.includes("inverter"))
    return "1100VA inverter available from ₹6,500.";

  if (msg.includes("delivery"))
    return "Yes! Same day delivery in Roorkee.";

  if (msg.includes("price"))
    return "Product ka naam bataye, exact price bata denge.";

  return "Madad ke liye WhatsApp kare 👉 https://wa.me/919548021272";
}

/*********************
  DESIGN EDIT MODE
*********************/
function loadDesign() {
  const design = JSON.parse(localStorage.getItem("designSettings")) || {};
  for (let key in design) {
    if (key !== "--hero-bg") {
      document.documentElement.style.setProperty(key, design[key]);
    }
  }
}

function saveDesign(key, value) {
  let design = JSON.parse(localStorage.getItem("designSettings")) || {};
  design[key] = value;
  localStorage.setItem("designSettings", JSON.stringify(design));
}

function enableDesignEditor() {
  if (document.getElementById("designEditor")) return;

  let panel = document.createElement("div");
  panel.className = "admin-bar";
  panel.id = "designEditor";

  panel.innerHTML = `
    <h3>🎨 Design Editor</h3>
    <label>Primary Color</label>
    <input type="color" onchange="updateColor('--primary-color',this.value)">
    <label>Background Color</label>
    <input type="color" onchange="updateColor('--bg-dark',this.value)">
    <label>Chat Color 1</label>
    <input type="color" onchange="updateColor('--chat-gradient-1',this.value)">
    <label>Chat Color 2</label>
    <input type="color" onchange="updateColor('--chat-gradient-2',this.value)">
    <br><br>
    <label>Hero Background</label>
    <input type="file" accept="image/*" onchange="uploadHeroBg(this)">
    <br><br>
    <button onclick="resetDesign()">Reset Design</button>
  `;

  document.body.insertBefore(panel, document.body.firstChild);
}

function updateColor(variable, value) {
  document.documentElement.style.setProperty(variable, value);
  saveDesign(variable, value);
}

function uploadHeroBg(input) {
  const reader = new FileReader();
  reader.onload = () => {
    document.querySelector(".hero").style.backgroundImage =
      `url('${reader.result}')`;
    saveDesign("--hero-bg", `url('${reader.result}')`);
  };
  reader.readAsDataURL(input.files[0]);
}

function applyHeroBg() {
  const design = JSON.parse(localStorage.getItem("designSettings")) || {};
  if (design["--hero-bg"]) {
    document.querySelector(".hero").style.backgroundImage = design["--hero-bg"];
  }
}

function resetDesign() {
  localStorage.removeItem("designSettings");
  location.reload();
}

loadDesign();
applyHeroBg();
