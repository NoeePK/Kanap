// ************************************************
// Contenu du panier dans le localStorage
// ************************************************

const cart = JSON.parse(localStorage.getItem('product'));
console.log(cart);


// ************************************************
// Récupération du produit dans l'API
// ************************************************

const fetchData = async (productId) => {
    try {
        // Récupérer l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Récupérer les produits dans .json
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};



// ************************************************
// Récupérer les produits 
// ************************************************

// Pour chaque produit dans le panier...
cart.forEach(product => {
    let id = product.id;
    let color = product.color;
    let quantity = product.quantity; 
   
});

// ************************************************
// Création d'une carte produit
// ************************************************

const insertArticle = async (product) => {
    let article = document.createElement('article');
    article.classList.add('cart__item');
    article.setAttribute('data-id', id);
    article.setAttribute('data-color', itemColor);

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

    let productName = document.createElement('h2');
    productName.innerText = product.name;
    description.appendChild(productName);

    let productColor = document.createElement('p');
    productColor.innerText = product.color;
    description.appendChild(productColor);

    let productPrice = document.createElement('p');
    productPrice.innerText = product.price;
    description.appendChild(productPrice);

    let settings = document.createElement('div');
    settings.classList.add('cart__item__content__settings');
    itemContent.appendChild(settings);

    let settingsQuantity = document.createElement('div');
    settingsQuantity.classList.add('cart__item__content__settings__quantity');
    settings.appendChild(settingsQuantity);

    let quantity = document.createElement('p');
    quantity.innerText = "Qté : ";
    settingsQuantity.appendChild(quantity);

    let itemQuantity = document.createElement('input');
    itemQuantity.classList.add('itemQuantity');
    itemQuantity.setAttribute('type', 'number');
    itemQuantity.setAttribute('name', 'itemQuantity');
    itemQuantity.setAttribute('min', 1);
    itemQuantity.setAttribute('max', 100);
    itemQuantity.setAttribute('value', quantity);
    settingsQuantity.appendChild(itemQuantity);

    let settingsDelete = document.createElement('div');
    settingsDelete.classList.add('cart__item__content__settings__delete');
    settings.appendChild(settingsDelete);

    let deleteItem = document.createElement('p');
    deleteItem.classList.add('deleteItem');
    deleteItem.innerText = "Supprimer";
    settingsDelete.appendChild(deleteItem);
};





// ************************************************
// ************************************************
// ************************************************

 // ... créer un article et l'insérer dans la section
    // document.getElementById('cart__items').appendChild(insertArticle(product);
// Fonction if panier vide










