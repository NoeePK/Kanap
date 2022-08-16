// ************************************************
// Récupérer panier dans le localStorage
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));

// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchProducts = async (productId) => {
    try {
        // Récupérer le produit dans l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Récupérer les produits dans .json
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Problème avec l'API !");
        return null;
    }
};

// ************************************************
// Création d'une carte produit
// ************************************************

const createArticle = async () => {

    cart.forEach(product => {
        let productId = product.id;
        let productColor = product.color;
        let productQuantity = product.quantity;

        const data = fetchProducts(productId);

        // Création des cartes
        const section = document.getElementById('cart__items');

        const article = document.createElement('article');
        article.classList.add('cart__item');
        article.setAttribute('data-id', productId);
        article.setAttribute('data-color', productColor);
        section.appendChild(article);

        const itemImg = document.createElement('div');
        itemImg.classList.add('cart__item__img');
        article.appendChild(itemImg);

        const productImg = document.createElement('img');
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;
        itemImg.appendChild(productImg);

        const itemContent = document.createElement('div');
        itemContent.classList.add('cart__item__content');
        article.appendChild(itemContent);

        const description = document.createElement('div');
        description.classList.add('cart__item__content__description');
        itemContent.appendChild(description);

        const productName = document.createElement('h2');
        productName.innerText = product.name;
        description.appendChild(productName);

        const colorOption = document.createElement('p');
        colorOption.innerText = productColor;
        description.appendChild(colorOption);

        const productPrice = document.createElement('p');
        productPrice.innerText = product.price;
        description.appendChild(productPrice);

        const settings = document.createElement('div');
        settings.classList.add('cart__item__content__settings');
        itemContent.appendChild(settings);

        const settingsQuantity = document.createElement('div');
        settingsQuantity.classList.add('cart__item__content__settings__quantity');
        settings.appendChild(settingsQuantity);

        const quantity = document.createElement('p');
        quantity.innerText = "Qté : ";
        settingsQuantity.appendChild(quantity);

        const itemQuantity = document.createElement('input');
        itemQuantity.classList.add('itemQuantity');
        itemQuantity.setAttribute('type', 'number');
        itemQuantity.setAttribute('name', 'itemQuantity');
        itemQuantity.setAttribute('min', 1);
        itemQuantity.setAttribute('max', 100);
        itemQuantity.setAttribute('value', productQuantity);
        settingsQuantity.appendChild(itemQuantity);

        const settingsDelete = document.createElement('div');
        settingsDelete.classList.add('cart__item__content__settings__delete');
        settings.appendChild(settingsDelete);

        const deleteItem = document.createElement('p');
        deleteItem.classList.add('deleteItem');
        deleteItem.innerText = "Supprimer";
        settingsDelete.appendChild(deleteItem);
    });

};


// ************************************************
// Insertion des cartes produit
// ************************************************

const insertArticle = async () => {

    const data = await fetchProducts(productId);

    // SI panier existe
    if (cart) {
        // Créer une carte pour chaque produit dans le panier
        createArticle();
    } else {
        // SINON alerter que le panier n'existe pas
        alert("Votre panier est vide");
    }

};

insertArticle();




// ************************************************
// ************************************************
// ************************************************


// Fonction if panier vide

// Fonction : calculer total et l'insérer dans la page

// ************************************************
// ************************************************
// ************************************************

// Validation du formulaire

const userDetails = () => {
    const orderBtn = document.getElementById('order');
    // Regex pour les noms : pas de chiffres (mais autoriser - pour noms composés)
    // const nameRegex = /^[a-zA-Z]/i ;
    // Regex pour l'adresse :
    // Regex pour l'email


    // Messages d'erreur
}