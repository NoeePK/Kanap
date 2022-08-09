// Récupérer le contenu du localStorage
const cart = JSON.parse(window.localStorage.getItem('product'));

// Pour chaque produit dans le panier...
cart.forEach(product => {
    // ... créer un article récapitulatif
    insertArticle(product);
    // ... et l'insérer dans la section
document.getElementById('cart__items').appendChild(insertArticle);
})
