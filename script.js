const whatsapp="919548021272";

/* DATA */
let data={
  "Solar Section":[
    {name:"Solar Panel 550W",price:28000},
    {name:"Solar Inverter 5KW",price:45000}
  ],
  "Power Backup":[
    {name:"Inverter 1100VA",price:6500}
  ]
};

/* RENDER */
const products=document.getElementById("products");
const filterBar=document.getElementById("filterBar");

function render(){
  products.innerHTML="";
  filterBar.innerHTML='<button onclick="showAll()">All</button>';

  for(let cat in data){
    filterBar.innerHTML+=`<button onclick="filterCategory('${cat}')">${cat}</button>`;

    let section=document.createElement("div");
    section.className="category";
    section.innerHTML=`<h2>${cat}</h2>`;

    data[cat].forEach(p=>{
      section.innerHTML+=`
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹ ${p.price}</p>
        <button onclick="order('${p.name}')">Order</button>
      </div>`;
    });

    products.appendChild(section);
  }
}
render();

/* FUNCTIONS */
function order(name){
  window.open(`https://wa.me/${whatsapp}?text=Details about ${name}`);
}

function filterCategory(cat){
  document.querySelectorAll(".category").forEach(c=>{
    c.style.display=c.querySelector("h2").innerText===cat?"block":"none";
  });
}

function showAll(){
  document.querySelectorAll(".category").forEach(c=>c.style.display="block");
}

function scrollToProducts(){
  document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

/* CHAT */
function toggleChat(){
  document.getElementById("chatBox").classList.toggle("hidden");
}

function sendMessage(){
  if(!userInput.value)return;
  chatMessages.innerHTML+=`<div style="text-align:right">${userInput.value}</div>`;
  chatMessages.innerHTML+=`<div>WhatsApp kare 👉 ${whatsapp}</div>`;
  userInput.value="";
}
