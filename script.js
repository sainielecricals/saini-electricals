const password = "dhairya123";
const whatsapp = "919548021272";

/* INIT DATA */
let data = JSON.parse(localStorage.getItem("sainiData"));
if(!data){
  data = {
    "☀️ Solar Section":[
      {name:"Solar Panel 550W",price:28000},
      {name:"Solar Inverter 5KW",price:45000}
    ],
    "⚡ Power Backup":[
      {name:"Inverter 1100VA",price:6500}
    ],
    "❄️ Cooling & Air":[
      {name:"Blue Star 1.5 Ton AC",price:36500}
    ]
  };
  saveData();
}

function saveData(){
  localStorage.setItem("sainiData",JSON.stringify(data));
}

/* RENDER */
const container=document.getElementById("products");

function render(){
  container.innerHTML="";
  for(let cat in data){
    const sec=document.createElement("div");
    sec.innerHTML=`<h2>${cat}</h2><div class="products"></div>`;
    const box=sec.querySelector(".products");
    data[cat].forEach((p,i)=>{
      const c=document.createElement("div");
      c.className="card";
      c.innerHTML=`
        <img src="${p.image||'https://via.placeholder.com/250'}">
        <h3>${p.name}</h3>
        <div class="price">₹${p.price}</div>
        <button onclick="order('${p.name}',${p.price})">Order</button>
      `;
      box.appendChild(c);
    });
    container.appendChild(sec);
  }
}
render(); createFilters();

/* FILTER */
function createFilters(){
  const f=document.getElementById("filterBar");
  f.innerHTML='<button onclick="render()">All</button>';
  for(let c in data){
    const b=document.createElement("button");
    b.innerText=c;
    b.onclick=()=>filter(c);
    f.appendChild(b);
  }
}
function filter(c){
  document.querySelectorAll("#products > div").forEach(s=>{
    s.style.display=s.querySelector("h2").innerText===c?"block":"none";
  });
}

/* ORDER */
function order(n,p){
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(n+" ₹"+p)}`);
}

/* CHAT */
function toggleChat(){
  document.getElementById("chatBox").classList.toggle("hidden");
}
function sendMessage(){
  const i=document.getElementById("userInput");
  if(!i.value)return;
  addChat(i.value,"user");
  setTimeout(()=>addChat("Product details ke liye WhatsApp kare 📲","bot"),500);
  i.value="";
}
function addChat(t,type){
  const d=document.createElement("div");
  d.className=type+"-message";
  d.innerHTML=t;
  chatMessages.appendChild(d);
}

/* VOICE */
function startVoice(){
  if(!("webkitSpeechRecognition"in window))return;
  const r=new webkitSpeechRecognition();
  r.lang="en-IN";
  r.onresult=e=>userInput.value=e.results[0][0].transcript;
  r.start();
}
