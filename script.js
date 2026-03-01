const password = "dhairya123";
const whatsappNumber = "919548021272";

const defaultData = {
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

let data = JSON.parse(localStorage.getItem("sainiData")) || defaultData;

function saveData(){
localStorage.setItem("sainiData",JSON.stringify(data));
}

const container=document.getElementById("products");

function renderProducts(){
container.innerHTML="";
for(let category in data){
let section=document.createElement("div");
section.className="category";
section.innerHTML=`<h2>${category}</h2><div class="products"></div>`;
container.appendChild(section);

let box=section.querySelector(".products");

data[category].forEach((product,index)=>{
let image=product.image || "https://via.placeholder.com/250";
let card=document.createElement("div");
card.className="card";

card.innerHTML=`
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

function orderProduct(category,index){
let product=data[category][index];
let msg=`I want details about ${product.name} - Price ₹${product.price}`;
window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`);
}

function deleteProduct(category,index){
data[category].splice(index,1);
saveData();
renderProducts();
enableEditMode();
}

function scrollToProducts(){
document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

function createFilters(){
let filterBar=document.getElementById("filterBar");
filterBar.innerHTML=`<button onclick="showAll()">All</button>`;
for(let category in data){
let btn=document.createElement("button");
btn.innerText=category;
btn.onclick=()=>filterCategory(category);
filterBar.appendChild(btn);
}
}

function filterCategory(category){
document.querySelectorAll(".category").forEach(sec=>{
sec.style.display=(sec.querySelector("h2").innerText===category)?"block":"none";
});
}

function showAll(){
document.querySelectorAll(".category").forEach(sec=>sec.style.display="block");
}

function searchProducts(){
let input=document.getElementById("searchInput").value.toLowerCase();
document.querySelectorAll(".card").forEach(card=>{
let name=card.querySelector("h3").innerText.toLowerCase();
card.style.display=name.includes(input)?"block":"none";
});
}

const urlParams=new URLSearchParams(window.location.search);
if(urlParams.get("edit")===password){
enableEditMode();
}

function enableEditMode(){
alert("Edit Mode Activated");

let adminBar=document.createElement("div");
adminBar.className="admin-bar";

let options=Object.keys(data).map(cat=>`<option value="${cat}">${cat}</option>`).join("");

adminBar.innerHTML=`
<select id="newCategory">${options}</select>
<input type="text" id="newName" placeholder="Product Name">
<input type="number" id="newPrice" placeholder="Price">
<button onclick="addProduct()">Add Product</button>
`;

document.body.insertBefore(adminBar,container);

document.querySelectorAll(".price span").forEach(span=>{
span.contentEditable=true;
span.addEventListener("blur",()=>{
let name=span.parentElement.parentElement.querySelector("h3").innerText;
for(let cat in data){
data[cat].forEach(product=>{
if(product.name===name){product.price=span.innerText;}
});
}
saveData();
});
});

document.querySelectorAll(".img-input").forEach(input=>{
input.classList.remove("hidden");
input.addEventListener("change",function(){
const reader=new FileReader();
reader.onload=()=>{
let card=input.parentElement;
card.querySelector("img").src=reader.result;
let name=card.querySelector("h3").innerText;
for(let cat in data){
data[cat].forEach(product=>{
if(product.name===name){product.image=reader.result;}
});
}
saveData();
};
reader.readAsDataURL(this.files[0]);
});
});

document.querySelectorAll(".delete-btn").forEach(btn=>btn.classList.remove("hidden"));
}

function addProduct(){
let cat=document.getElementById("newCategory").value;
let name=document.getElementById("newName").value;
let price=document.getElementById("newPrice").value;

if(name && price){
data[cat].push({name:name,price:price});
saveData();
renderProducts();
createFilters();
enableEditMode();
}
}
function toggleChat(){
document.getElementById("chatBox").classList.toggle("hidden");
}

function handleKey(event){
if(event.key==="Enter"){
sendMessage();
}
}

function sendMessage(){
let input=document.getElementById("userInput");
let message=input.value.toLowerCase();
if(!message) return;

addMessage("You",input.value);
input.value="";

let reply="Sorry, please contact us on WhatsApp.";

if(message.includes("ac")){
reply="We recommend Blue Star 1.5 Ton AC. Price ₹36500. Same day delivery in Roorkee.";
}
else if(message.includes("solar")){
reply="We provide Solar Panels, Solar Inverter & Batteries. Contact us for best price.";
}
else if(message.includes("inverter")){
reply="We have 1100VA Inverter & Batteries available.";
}
else if(message.includes("delivery")){
reply="Yes! Same Day Delivery Available in Roorkee.";
}
else if(message.includes("price")){
reply="Please tell product name to know exact price.";
}
else if(message.includes("location")){
reply="We are located in Roorkee. Contact 9548021272.";
}

setTimeout(()=>addMessage("Assistant",reply),500);
}

function addMessage(sender,text){
let chat=document.getElementById("chatMessages");
let msg=document.createElement("div");
msg.innerHTML="<b>"+sender+":</b> "+text;
chat.appendChild(msg);
chat.scrollTop=chat.scrollHeight;
}
function toggleChat() {
    document.getElementById("chatBox").classList.toggle("hidden");
}

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value.trim();
    if (message === "") return;

    addMessage(message, "user-message");
    input.value = "";

    showTyping();

    setTimeout(() => {
        removeTyping();
        let reply = getBotReply(message);
        addMessage(reply, "bot-message");
    }, 1000);
}

function addMessage(text, className) {
    let msgDiv = document.createElement("div");
    msgDiv.className = className;
    msgDiv.innerText = text;
    document.getElementById("chatMessages").appendChild(msgDiv);
}

function showTyping(){
    let typing = document.createElement("div");
    typing.className = "bot-message";
    typing.id = "typing";
    typing.innerText = "Typing...";
    document.getElementById("chatMessages").appendChild(typing);
}

function removeTyping(){
    let typing = document.getElementById("typing");
    if(typing) typing.remove();
}

function getBotReply(message) {
    message = message.toLowerCase();

    if (message.includes("ac"))
        return "We have Blue Star & Voltas AC. Starting ₹28,000.";

    if (message.includes("inverter"))
        return "Inverter available from ₹7,500 with warranty.";

    if (message.includes("battery"))
        return "Battery options 150Ah, 200Ah & 230Ah available.";

    if (message.includes("price"))
        return "Please tell product name for exact price.";

    return "For more details please click WhatsApp below 👇";
}