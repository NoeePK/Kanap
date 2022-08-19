// ************************************************

// Fonction : calculer total prix/nb de produits
//  et les insérer dans la page
// Bouton supprimer
// Vérifier en direct les modifications de l'utilisateur
// inputs contraintes page produit (copier coller)
// total des prix (recalculer !!!)
// plan de test : faire en même temps !!!


// ************************************************
// Variables
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));
const emptyCart = document.querySelector('h1');
const section = document.getElementById('cart__items');
let cartTotalPrice = [];

// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchProducts = async (id) => {
    try {
        // Récupérer le produit dans l'API
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        // Récupérer les produits de l'API dans .json
        const itemId = await response.json();
        return itemId;
    }
    catch (err) {
        console.log("Problème avec l'API !");
        return null;
    }
};

// ************************************************
// Afficher les cartes produit
// ************************************************

const createArticle = async () => {
    // SI : panier est vide ou n'existe pas...
    if (cart === null || !cart) {
        // ... afficher ce nouveau titre h1
        emptyCart.innerText = "Votre panier est vide";
    }
    // SINON : afficher les produits
    else {
        console.log("Panier garni");

        // Pour chaque produit dans le panier...
        cart.forEach(product => {
            let itemId = product.itemId;
            let itemColor = product.itemColor;
            let itemQuantity = product.itemQuantity;

            const data = fetchProducts(itemId);
            cartTotalPrice.push(data);
            data.then((productDetails) => {
                const price = Number(productDetails.price);
                const totalPrice = price * itemQuantity;

                console.log(totalPrice);

                // Création des cartes
                const article = document.createElement('article');
                article.classList.add('cart__item');
                article.setAttribute('data-id', itemId);
                article.setAttribute('data-color', itemColor);

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
                colorOption.innerText = itemColor;
                description.appendChild(colorOption);

                const productPrice = document.createElement('p');
                productPrice.innerText = totalPrice + " €";
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

                const productQuantity = document.createElement('input');
                productQuantity.classList.add('itemQuantity');
                productQuantity.setAttribute('type', 'number');
                productQuantity.setAttribute('name', 'itemQuantity');
                productQuantity.setAttribute('min', 1);
                productQuantity.setAttribute('max', 100);
                productQuantity.setAttribute('value', itemQuantity);
                settingsQuantity.appendChild(productQuantity);

                const settingsDelete = document.createElement('div');
                settingsDelete.classList.add('cart__item__content__settings__delete');
                settings.appendChild(settingsDelete);

                const deleteItem = document.createElement('p');
                deleteItem.classList.add('deleteItem');
                deleteItem.innerText = "Supprimer";
                settingsDelete.appendChild(deleteItem);

                section.appendChild(article);
            })
        })
    }

};

createArticle();

// ************************************************
// Afficher le total
// ************************************************



const cartInfo = () => {
    const priceSpan = document.getElementById("totalPrice");
    const quantitySpan = document.getElementById("totalQuantity");
    
    for (let i = 0; i < array.lengh; i++) {
        cartTotalPrice =+ totalPrice;
    }

    priceSpan.innerText = cartTotalPrice;
}



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