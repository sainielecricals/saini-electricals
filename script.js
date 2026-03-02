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
  hideSuggestions();
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
  CHATBOT (SMART + SYNCED)
*********************/
function toggleChat() {
  const box = document.getElementById("chatBox");
  box.classList.toggle("hidden");

  if (!box.classList.contains("hidden")) {
    const chat = document.getElementById("chatMessages");
    if (chat.children.length === 0) {
      addChat(`
👋 <b>Welcome to Saini Electricals!</b><br>
Bhai batao, kya chahiye aaj? 😊<br><br>
${renderQuickButtons()}
`, "bot");
    }
  }
  showRecentSearch();
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
  saveRecentSearch(msg);
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
  CHAT AUTO SUGGESTIONS
*********************/
const userInput = document.getElementById("userInput");
const suggestionBox = document.getElementById("chatSuggestions");

userInput.addEventListener("input", () => {
  const text = userInput.value.toLowerCase().trim();
  suggestionBox.innerHTML = "";

  if (!text) {
    suggestionBox.classList.add("hidden");
    return;
  }

  let results = [];

  // Category suggestions
  for (let cat in data) {
    if (cat.toLowerCase().includes(text)) {
      results.push({ type: "cat", value: cat });
    }
  }

  // Product suggestions
  for (let cat in data) {
    data[cat].forEach(p => {
      if (p.name.toLowerCase().includes(text)) {
        results.push({ type: "prod", value: p.name });
      }
    });
  }

  if (!results.length) {
    suggestionBox.classList.add("hidden");
    return;
  }

  results.slice(0, 6).forEach(item => {
    const div = document.createElement("div");
    div.className = item.type;
    div.innerText = item.value;

    div.onclick = () => {
      userInput.value = item.value;
      suggestionBox.classList.add("hidden");
      sendMessage(); // auto send
    };

    suggestionBox.appendChild(div);
  });

  suggestionBox.classList.remove("hidden");
});

// hide suggestions after send
function hideSuggestions(){
  suggestionBox.classList.add("hidden");
}
/*********************
  QUICK BUTTONS
*********************/
function renderQuickButtons() {
  let buttons = "";
  for (let cat in data) {
    buttons += `
      <button onclick="addChat(formatCategoryReply('${cat}'),'bot')"
      style="margin:4px;padding:6px 10px;border-radius:12px;
      background:#333;color:#fff;border:none;cursor:pointer;">
        ${cat}
      </button>
    `;
  }
  return `<div style="margin-top:10px;">${buttons}</div>`;
}

/*********************
  SMART BOT REPLY
*********************/
function getBotReply(msg) {
  msg = autoCorrect(msg);
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
        return formatProductReply(product);
      }
    }
  }

  return `
Samajh nahi aaya bhai 🤔<br>
Tu category ya product ka naam likh de.<br><br>
${renderQuickButtons()}
`;
}

/*********************
  CATEGORY REPLY
*********************/
function formatCategoryReply(category) {
  let reply = `🔹 <b>${category}</b><br><br>`;

  data[category].forEach(p => {
    reply += `
      <div style="margin-bottom:10px;">
        ${p.image ? `<img src="${p.image}" style="width:100%;border-radius:8px;">` : ""}
        <b>${p.name}</b><br>
        💰 ₹${p.price}
      </div>
    `;
  });

  reply += `
👉 <a href="https://wa.me/${whatsappNumber}" target="_blank"
style="color:#00ff88;font-weight:bold;">
WhatsApp pe baat kar lein 📲
</a>
`;

  return reply;
}

/*********************
  PRODUCT REPLY
*********************/
function formatProductReply(product) {
  return `
📦 <b>${product.name}</b><br>
${product.image ? `<img src="${product.image}" style="width:100%;border-radius:8px;">` : ""}
💰 Price: ₹${product.price}<br><br>
👉 <a href="https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Bhai " + product.name + " ke baare me details chahiye"
  )}" target="_blank"
style="color:#00ff88;font-weight:bold;">
WhatsApp pe baat karein 📲
</a>
`;
}
/*********************
  RECENT SEARCH
*********************/
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

function saveRecentSearch(text){
  if (!text) return;
  recentSearches = recentSearches.filter(t => t !== text);
  recentSearches.unshift(text);
  recentSearches = recentSearches.slice(0,5);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function showRecentSearch(){
  const box = document.getElementById("chatSuggestions");
  box.innerHTML = "";

  recentSearches.forEach(t => {
    const div = document.createElement("div");
    div.innerText = "🕘 " + t;
    div.onclick = () => {
      document.getElementById("userInput").value = t;
      sendMessage();
    };
    box.appendChild(div);
  });

  if (recentSearches.length) box.classList.remove("hidden");
}
/*********************
  AI SPELL CORRECTION
*********************/
function autoCorrect(msg){
  const map = {
    solr: "solar",
    invetr: "inverter",
    battry: "battery",
    wir: "wire",
    cabel: "cable",
    panal: "panel",
    acs: "ac"
  };

  let words = msg.split(" ");
  words = words.map(w => map[w] || w);
  return words.join(" ");
}
/*********************
  VOICE INPUT
*********************/
function startVoice(){
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice typing not supported");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "en-IN";
  rec.onresult = e => {
    const text = e.results[0][0].transcript;
    document.getElementById("userInput").value = text;
    document.getElementById("userInput").dispatchEvent(new Event("input"));
  };
  rec.start();
}

