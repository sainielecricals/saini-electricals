const password = "dhairya123";
const whatsapp = "919548021272";

/* ===== DATA INIT ===== */
let data = JSON.parse(localStorage.getItem("sainiData"));
if (!data) {
  data = {
    "Solar": [{
      name:"Solar Panel 550W",
      price:28000,
      specs:"",
      usage:"",
      reviews:"",
      warranty:""
    }]
  };
  save();
}

function save(){
  localStorage.setItem("sainiData",JSON.stringify(data));
}

/* ===== RENDER ===== */
const products = document.getElementById("products");

function render(){
  products.innerHTML="";
  for(let cat in data){
    let sec=document.createElement("div");
    sec.className="category";
    sec.innerHTML=`<h2>${cat}</h2>`;

    data[cat].forEach((p,i)=>{
      sec.innerHTML+=`
      <div class="card">
        <h3>${p.name}</h3>
        <p>₹ ${p.price}</p>

        <button onclick="order('${cat}',${i})">Order</button>

        <div class="edit hidden">
          <textarea placeholder="Specifications">${p.specs}</textarea>
          <textarea placeholder="Best Use">${p.usage}</textarea>
          <textarea placeholder="Reviews">${p.reviews}</textarea>
          <textarea placeholder="Warranty">${p.warranty}</textarea>
          <button onclick="saveExtra('${cat}',${i},this)">Save</button>
          <button onclick="del('${cat}',${i})">Delete</button>
        </div>
      </div>`;
    });

    products.appendChild(sec);
  }
}
render();

/* ===== ACTIONS ===== */
function order(c,i){
  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(data[c][i].name)}`);
}

function del(c,i){
  data[c].splice(i,1);
  save();render();editMode();
}

function saveExtra(c,i,btn){
  let t=btn.parentElement.querySelectorAll("textarea");
  data[c][i].specs=t[0].value;
  data[c][i].usage=t[1].value;
  data[c][i].reviews=t[2].value;
  data[c][i].warranty=t[3].value;
  save();
  alert("Saved for chatbot ✅");
}

/* ===== EDIT MODE ===== */
function editMode(){
  document.querySelectorAll(".edit").forEach(e=>e.classList.remove("hidden"));
}

if(new URLSearchParams(location.search).get("edit")===password){
  document.getElementById("admin").innerHTML=`
    <input id="newCat" placeholder="Category">
    <button onclick="addCat()">Add Category</button><br><br>
    <select id="catSel"></select>
    <input id="newName" placeholder="Product name">
    <input id="newPrice" placeholder="Price">
    <button onclick="addProd()">Add Product</button>
  `;
  updateSel();
  editMode();
}

function updateSel(){
  catSel.innerHTML="";
  for(let c in data) catSel.innerHTML+=`<option>${c}</option>`;
}

function addCat(){
  if(!newCat.value) return;
  data[newCat.value]=[];
  save();render();updateSel();
}

function addProd(){
  data[catSel.value].push({
    name:newName.value,
    price:newPrice.value,
    specs:"",
    usage:"",
    reviews:"",
    warranty:""
  });
  save();render();editMode();
}

/* ===== CHAT ===== */
function toggleChat(){
  chatBox.classList.toggle("hidden");
}

function sendMessage(){
  if(!userInput.value) return;
  addChat(userInput.value,"user");

  setTimeout(()=>{
    addChat(botReply(userInput.value),"bot");
  },400);

  userInput.value="";
}

function addChat(t,type){
  let d=document.createElement("div");
  d.className=type==="user"?"user-message":"bot-message";
  d.innerHTML=t;
  chatMessages.appendChild(d);
}

function botReply(msg){
  msg=msg.toLowerCase();
  for(let c in data){
    for(let p of data[c]){
      if(msg.includes(p.name.toLowerCase())){
        return `<b>${p.name}</b><br>
₹${p.price}<br>
${p.specs}<br>
${p.usage}<br>
${p.reviews}<br>
Warranty: ${p.warranty}`;
      }
    }
  }
  return "Product ka naam likhiye 😊";
}
