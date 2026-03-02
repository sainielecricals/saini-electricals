const password="dhairya123";
const whatsapp="919548021272";

/* DATA */
let data=JSON.parse(localStorage.getItem("sainiData"));
if(!data){
  data={
    "Solar":[{name:"Solar Panel 550W",price:28000}],
    "Inverter":[{name:"Inverter 1100VA",price:6500}]
  };
  save();
}
function save(){localStorage.setItem("sainiData",JSON.stringify(data));}

/* RENDER */
const products=document.getElementById("products");
function render(){
  products.innerHTML="";
  for(let cat in data){
    const sec=document.createElement("div");
    sec.innerHTML=`<h2>${cat}</h2><div class="products"></div>`;
    products.appendChild(sec);
    const box=sec.querySelector(".products");

    data[cat].forEach((p,i)=>{
      box.innerHTML+=`
      <div class="card">
        <img src="${p.image||'https://via.placeholder.com/250'}">
        <input type="file" class="img-input hidden">
        <h3>${p.name}</h3>
        <p class="price">₹ <span>${p.price}</span></p>
        <button onclick="order('${cat}',${i})">Order</button>
        <button class="delete-btn hidden" onclick="del('${cat}',${i})">Delete</button>
      </div>`;
    });
  }
}
render();filters();

/* FILTER */
function filters(){
  const f=document.getElementById("filterBar");
  f.innerHTML=`<button onclick="showAll()">All</button>`;
  for(let c in data)f.innerHTML+=`<button onclick="filter('${c}')">${c}</button>`;
}
function filter(c){
  document.querySelectorAll("#products>div").forEach(d=>{
    d.style.display=d.querySelector("h2").innerText===c?"block":"none";
  });
}
function showAll(){
  document.querySelectorAll("#products>div").forEach(d=>d.style.display="block");
}

/* ACTIONS */
function order(c,i){
  const p=data[c][i];
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(p.name+" ₹"+p.price)}`);
}
function del(c,i){
  data[c].splice(i,1);
  save();render();editMode();
}

/* EDIT MODE */
function editMode(){
  document.querySelectorAll(".delete-btn,.img-input").forEach(e=>e.classList.remove("hidden"));
}
if(new URLSearchParams(location.search).get("edit")===password){
  document.body.insertAdjacentHTML("afterbegin",`
  <div class="admin-bar">
    <input id="newCat" placeholder="Category">
    <button onclick="addCat()">Add Category</button><br>
    <select id="catSel"></select>
    <input id="newName" placeholder="Product">
    <input id="newPrice" placeholder="Price">
    <button onclick="addProd()">Add Product</button>
  </div>`);
  updateSelect();editMode();
}

function updateSelect(){
  const s=document.getElementById("catSel");
  if(!s)return;
  s.innerHTML="";
  for(let c in data)s.innerHTML+=`<option>${c}</option>`;
}
function addCat(){
  const n=newCat.value.trim();
  if(!n)return;
  if(!data[n]){data[n]=[];save();render();filters();updateSelect();}
}
function addProd(){
  const c=catSel.value;
  if(!newName.value||!newPrice.value)return;
  data[c].push({name:newName.value,price:newPrice.value});
  save();render();editMode();
  newName.value="";newPrice.value="";
}

/* CHAT */
function toggleChat(){chatBox.classList.toggle("hidden");}
function sendMessage(){
  if(!userInput.value)return;
  add(userInput.value,"user");
  setTimeout(()=>add("WhatsApp kare 👉 https://wa.me/"+whatsapp,"bot"),400);
  userInput.value="";
}
function add(t,type){
  const d=document.createElement("div");
  d.className=type+"-message";
  d.innerHTML=t;
  chatMessages.appendChild(d);
  chatMessages.scrollTop=chatMessages.scrollHeight;
}

/* VOICE */
function startVoice(){
  if(!("webkitSpeechRecognition"in window))return alert("Chrome use kare");
  const r=new webkitSpeechRecognition();
  r.lang="en-IN";
  r.onresult=e=>userInput.value=e.results[0][0].transcript;
  r.start();
}
