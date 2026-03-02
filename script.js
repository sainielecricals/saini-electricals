const password="dhairya123";
const whatsapp="919548021272";

/* INIT DATA */
let data=JSON.parse(localStorage.getItem("sainiData"));
if(!data){
  data={
    "☀️ Solar Section":[
      {name:"Solar Panel 550W",price:28000},
      {name:"Solar Inverter 5KW",price:45000}
    ],
    "⚡ Power Backup":[
      {name:"Inverter 1100VA",price:6500}
    ]
  };
  save();
}
function save(){localStorage.setItem("sainiData",JSON.stringify(data));}

/* RENDER */
const box=document.getElementById("products");
function render(){
  box.innerHTML="";
  for(let c in data){
    const sec=document.createElement("div");
    sec.innerHTML=`<h2 class="cat-title">${c}</h2><div class="products"></div>`;
    box.appendChild(sec);
    const wrap=sec.querySelector(".products");
    data[c].forEach((p,i)=>{
      wrap.innerHTML+=`
        <div class="card">
          <img src="${p.image||'https://via.placeholder.com/250'}">
          <input type="file" class="img-input hidden">
          <h3>${p.name}</h3>
          <p class="price">₹ <span>${p.price}</span></p>
          <button onclick="order('${c}',${i})">Order</button>
          <button class="delete-btn hidden" onclick="del('${c}',${i})">Delete</button>
        </div>`;
    });
  }
}
render();
filters();

/* FILTER */
function filters(){
  const f=document.getElementById("filterBar");
  f.innerHTML=`<button onclick="showAll()">All</button>`;
  for(let c in data){
    f.innerHTML+=`<button onclick="filter('${c}')">${c}</button>`;
  }
}
function filter(c){
  document.querySelectorAll(".category").forEach(s=>{
    s.style.display=s.querySelector("h2").innerText===c?"block":"none";
  });
}
function showAll(){
  document.querySelectorAll(".category").forEach(s=>s.style.display="block");
}

/* ORDER */
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
  document.body.insertAdjacentHTML("afterbegin",
    `<div class="admin-bar">
      <input id="newCat" placeholder="New Category">
      <button onclick="addCat()">Add Category</button>
    </div>`);
  editMode();
}
function addCat(){
  const n=document.getElementById("newCat").value.trim();
  if(!n)return;
  data[n]=[];
  save();render();filters();
}

/* CHAT */
function toggleChat(){document.getElementById("chatBox").classList.toggle("hidden");}
function sendMessage(){
  const i=document.getElementById("userInput");
  if(!i.value)return;
  add(i.value,"user");
  setTimeout(()=>add("WhatsApp kare 👉 https://wa.me/"+whatsapp,"bot"),400);
  i.value="";
}
function add(t,type){
  const c=document.getElementById("chatMessages");
  const d=document.createElement("div");
  d.className=type+"-message";
  d.innerHTML=t;
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

/* VOICE */
function startVoice(){
  if(!("webkitSpeechRecognition"in window))return alert("Chrome use kare");
  const r=new webkitSpeechRecognition();
  r.lang="en-IN";
  r.onresult=e=>document.getElementById("userInput").value=e.results[0][0].transcript;
  r.start();
}
