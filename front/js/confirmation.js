// ************************************************
// Récupérer l'orderId dans l'url :
// ************************************************
const currentPageURL = window.location.href;
const url = new URL(currentPageURL);
const orderId = url.searchParams.get("orderId");

// ************************************************
// Afficher l'orderId :
// ************************************************
let orderSpan = document.getElementById("orderId");
orderSpan.innerText = orderId;


