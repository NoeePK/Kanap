
let order = JSON.parse(localStorage.getItem("order"));
let orderSpan = document.getElementById("orderId");
console.log(order);
orderSpan.innerText = order;
    


