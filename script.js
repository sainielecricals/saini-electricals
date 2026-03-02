const password="dhairya123";
const whatsapp="919548021272";

/* DATA */
let data=JSON.parse(localStorage.getItem("sainiData"))||{
  Solar:[{name:"Solar Panel 550W",price:28000}],
  Inverter:[{name:"Inverter 1100VA",price:6500}]
};
save();

function save(){localStorage.setItem("sainiData",JSON.stringify(data));}

/* RENDER */
const products=document.getElementById("products");
function render(){
  products.innerHTML="";
  for(let c in data){
    const sec=document.createElement("div");
    sec.innerHTML=`<h2>${c}</h2>`;
    data[c].forEach((p,i)=>{
      sec.innerHTML+=`
      <div>
        ${p.name} – ₹${p.price}
        <button onclick="order('${c}',${i})">Order</button>
        <button onclick="del('${c}',${i})">Delete</button>
      </div>`;
    });
    products.appendChild(sec);
  }
}
render();

/* ADMIN MODE */
if(new URLSearchParams(location.search).get("edit")===password){
  adminRoot.innerHTML=`
  <div class="admin-bar">
    <input id="cat" placeholder="Category">
    <button onclick="addCat()">Add Category</button><br>
    <select id="sel"></select>
    <input id="name" placeholder="Product">
    <input id="price" placeholder="Price">
    <button onclick="addProd()">Add Product</button>
  </div>`;
  updateSel();
}

function updateSel(){
  sel.innerHTML="";
  for(let c in data)sel.innerHTML+=`<option>${c}</option>`;
}
function addCat(){
  if(!cat.value)return;
  if(!data[cat.value]){data[cat.value]=[];save();render();updateSel();}
}
function addProd(){
  data[sel.value].push({name:name.value,price:price.value});
  save();render();
}

/* ACTIONS */
function del(c,i){data[c].splice(i,1);save();render();}
function order(c,i){
  window.open(`https://wa.me/${whatsapp}?text=${data[c][i].name}`);
}

/* CHAT */
chatToggle.onclick=()=>chatBox.classList.toggle("hidden");
chatClose.onclick=()=>chatBox.classList.add("hidden");
sendBtn.onclick=send;
voiceBtn.onclick=startVoice;

function send(){
  if(!userInput.value)return;
  chatMessages.innerHTML+=`<div class="user">${userInput.value}</div>`;
  chatMessages.innerHTML+=`<div class="bot">WhatsApp kare 👉 ${whatsapp}</div>`;
  userInput.value="";
}

/* VOICE */
function startVoice(){
  if(!("webkitSpeechRecognition"in window))return alert("Chrome use karo");
  const r=new webkitSpeechRecognition();
  r.lang="en-IN";
  r.onresult=e=>userInput.value=e.results[0][0].transcript;
  r.start();
}
