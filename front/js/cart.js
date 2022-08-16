// ************************************************
// Panier
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));
const emptyCart = document.querySelector('h1');
const section = document.getElementById('cart__items');

// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchProducts = async () => {
    try {
        // Récupérer le produit dans l'API
        const response = await fetch(`http://localhost:3000/api/products`);
        // Récupérer les produits dans .json
        const product = await response.json();

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

        // Création des cartes


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
// Affichage du panier
// ************************************************

if (cart === null) {
    emptyCart.innerText = "Votre panier est vide";
} else {
    console.log("Panier garni");
    let product = {};
    for (product in cart) {
        const article = createArticle(cart[product]);
        section.appendChild(article);
    }
}







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