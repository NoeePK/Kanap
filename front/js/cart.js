// ************************************************
// Panier
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));
const emptyCart = document.querySelector('h1');
let products = {};

// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchProducts = async () => {
    try {
        // Récupérer le produit dans l'API
        const response = await fetch(`http://localhost:3000/api/products`);
        // Récupérer les produits de l'API dans .json
        const APIProducts = await response.json();
        const products = {};
        // parse de tous les produits de l'API
        const allProducts = await JSON.parse(APIProducts);
        // Pour chaque produit dans allProducts...
        allProducts.forEach(product => {
            // produit = chaque id d'un produit dans tous les produits
            products[product._id] = product;
        })
        return products;

    } catch (err) {
        console.log("Problème avec l'API !");
        return null;
    }
};
console.log("Promesse :");
console.log(fetchProducts());

console.log("Panier :");
console.log(cart);

products = await fetchProducts();

// ************************************************
// Affichage du panier
// ************************************************

const insertArticle = async () => {
    if (cart === null) {
    emptyCart.innerText = "Votre panier est vide";
    return;
} else {
    console.log("Panier garni");
    cart.forEach(product => {
        cart.appendChild(await createArticle(product));
    })
}

}



// ************************************************
// Création d'une carte produit
// ************************************************

const createArticle = async (product) => {
    const section = document.getElementById('cart__items');

    cart.forEach(product => {
        let productId = product.id;
        let productColor = product.color;
        let productQuantity = product.quantity;

        const data = fetchProducts(productId);
        data.then((productDetails) => {

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
            productImg.src = productDetails.imageUrl;
            productImg.alt = productDetails.altTxt;
            itemImg.appendChild(productImg);

            const itemContent = document.createElement('div');
            itemContent.classList.add('cart__item__content');
            article.appendChild(itemContent);

            const description = document.createElement('div');
            description.classList.add('cart__item__content__description');
            itemContent.appendChild(description);

            const productName = document.createElement('h2');
            productName.innerText = productDetails.name;
            description.appendChild(productName);

            const colorOption = document.createElement('p');
            colorOption.innerText = productColor;
            description.appendChild(colorOption);

            const productPrice = document.createElement('p');
            productPrice.innerText = productDetails.price;
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
        })
    });
};







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