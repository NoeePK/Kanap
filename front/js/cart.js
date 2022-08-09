// Récupérer le contenu du localStorage
const cart = JSON.parse(window.localStorage.getItem('product'));


// ************************************************
// Création d'une carte produit
// ************************************************

const insertArticle = async (product) => {
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', product.id);
    article.setAttribute('data-color', product.color);

    let itemImg = document.createElement('div');
    divImg.classList.add('cart__item__img');
    article.appendChild(itemImg);
    
    let productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;
    itemImg.appendChild(productImg);

    let itemContent = document.createElement('div');
    itemContent.classList.add('cart__item__content');
    article.appendChild(itemContent);

    let description = document.createElement('div');
    description.classList.add('cart__item__content__description');
    
    itemContent.appendChild(description);




    let settings = document.createElement('div');
    itemContent.appendChild(settings);
} 










// ************************************************
// Insertion des cartes produit
// ************************************************

// Pour chaque produit dans le panier...
cart.forEach(product => {
    // ... créer un article et l'insérer dans la section
    document.getElementById('cart__items').appendChild(insertArticle(product));
});
