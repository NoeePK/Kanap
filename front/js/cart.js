// ************************************************
// Variables
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));

// Sélection des parties du DOM
const emptyCart = document.querySelector('h1');
const section = document.getElementById('cart__items');
const article = document.querySelectorAll('.cart__item');

// Les boutons
// const deleteBtn = document.querySelectorAll(".deleteItem");
const quantityInput = document.querySelectorAll(".itemQuantity");
const orderBtn = document.getElementById("order");

// Variables pour les totaux
let cartTotalPrice = [];
let cartTotalQuantity = [];

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
        // Afficher 0 pour tous les totaux
        let cartTotalPrice = 0;
        let cartTotalQuantity = 0;
        totalCart(cartTotalPrice, cartTotalQuantity);
    }
    // SINON : afficher les produits
    else {
        // Pour chaque produit dans le panier...
        cart.forEach(product => {
            let itemId = product.itemId;
            let itemColor = product.itemColor;
            let itemQuantity = product.itemQuantity;

            const data = fetchProducts(itemId);
            data.then((productDetails) => {
                const price = Number(productDetails.price);
                const totalPrice = price * itemQuantity;

                cartTotalPrice.push(totalPrice);
                cartTotalQuantity.push(itemQuantity);

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
                productQuantity.addEventListener("change", changeQuantity());
                settingsQuantity.appendChild(productQuantity);

                const settingsDelete = document.createElement('div');
                settingsDelete.classList.add('cart__item__content__settings__delete');
                settings.appendChild(settingsDelete);

                const deleteItem = document.createElement('p');
                deleteItem.classList.add('deleteItem');
                // deleteItem.addEventListener('click', deleteProduct());
                deleteItem.innerText = "Supprimer";
                settingsDelete.appendChild(deleteItem);

                section.appendChild(article);

                totalCart(cartTotalPrice, cartTotalQuantity);
            })
        })
    }
};

createArticle();
console.table(cart);

// ************************************************
// Afficher les totaux
// ************************************************

// Total pour chaque article selon la quantité :
const totalCart = (cartTotalPrice, cartTotalQuantity) => {
    const priceSpan = document.getElementById("totalPrice");
    const quantitySpan = document.getElementById("totalQuantity");

    let totalPrice = 0;
    let totalQuantity = 0;

    for (price of cartTotalPrice) {
        totalPrice += price;
    }

    for (quantity of cartTotalQuantity) {
        totalQuantity += quantity;
    }

    // Ces deux totaux sont affichés
    priceSpan.innerText = totalPrice;
    quantitySpan.innerText = totalQuantity;
};

// ************************************************
// Supprimer un produit
// ************************************************

function deleteProduct() {
    let deleteBtn = document.querySelectorAll(".cart__item .deleteItem");
    // Sélectionner l'item le plus proche du bouton supprimer
    deleteBtn.forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", () => {
            for (let i = 0; i < cart.length; i++)
                if (
                    cart[i].itemId === deleteBtn.dataset.id &&
                    cart[i].itemColor === deleteBtn.dataset.color
                ) {
                    // Créer un nouveau tableau pour remplacement
                    let newCart = JSON.parse(localStorage.getItem("product"));
                    // Splice pour retirer le produit choisi
                    newCart.splice(i, 1);
                    // Ecraser l'ancien panier avec le nouveau
                    localStorage.cart = JSON.stringify(newCart);
                    // Actualiser les totaux sans reload de la page
                    totalCart(cartTotalPrice, cartTotalQuantity);

                }
        })
    })
}

// ************************************************
// Modifier la quantité d'un produit
// ************************************************

const changeQuantity = () => {

    // Pour chaque input de quantité...
    quantityInput.forEach(function (element) {
        // ... ajouter un événement "change"
        element.addEventListener("change", (e) => {
            // Créer nouveau tableau pour remplacement
            let newCart = cart;
            // Parcourir le nouveau panier
            for (item of newCart) {
                // Sélectionner le bon produit à modifier
                if (
                    item.itemId === quantityInput.dataset.id &&
                    item.itemColor === quantityInput.dataset.color
                ) {
                    if (!(quantityInput == "" || quantityInput <= 0 || quantityInput > 100)) {
                        // Ancienne quantité remplacée par la nouvelle
                        item.itemQuantity = e.target.value;
                        // Ecraser l'ancien panier avec le nouveau
                        localStorage.cart = JSON.stringify(newCart);
                        // Changer la value dans le DOM
                        quantityInput.value = e.target.value;
                        // Actualiser les totaux SANS reload ou AVEC reload ?
                        alert("Quantité modifiée avec succès");
                    }
                    else {
                        alert("Cette quantité n'est pas valide");
                        return
                    }
                }
            }
        })
    })
}


// ************************************************
// Validation du formulaire
// ************************************************

// // Regex
const noNumberRegex = /^[a-zA-Z '-,]{1,31}$/i;
const mailRegex = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;

// Emplacement des messages d'erreur
const firstNameErr = document.getElementById('firstNameErrorMsg');
const lastNameErr = document.getElementById('lastNameErrorMsg');
const addressErr = document.getElementById('addressErrorMsg');
const cityErr = document.getElementById('cityErrorMsg');
const emailErr = document.getElementById('emailErrorMsg');



// // ************************************************
// // Commander
// // ************************************************

const order = async () => {
    orderBtn.addEventListener("click", () => {
        // Récupérer la fiche contact :
        let contact = {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            email: document.getElementById("email").value
        };
        // SI : regex sont respectés...
        if (
            (noNumberRegex.test(contact.firstName) == true) &
            (noNumberRegex.test(contact.lastName) == true) &
            (noNumberRegex.test(contact.city) == true) &
            (mailRegex.test(contact.email) == true)
        ) {
            // ...  créer un tableau pour y mettre les produits...
            let productID = [];
            //Pour chaque produit dans le panier...
            cart.forEach(item => {
                // ... mettre son id dans le tableau
                productID.push(item.itemId);
            });
            // Voir si ça fonctionne :
            console.log(productID);
            console.log(contact);

            // Afficher un message de succès :
            alert("Commande effectuée avec succès");
            // Envoyer la fiche contact et le tableau de la commande


        }
        // SINON : regex ne sont pas respectés
        else if (noNumberRegex.test(contact.firstName) == false) {
            firstNameErr.innerText = "Veuillez indiquer un nom valide.";
        }
        else if (noNumberRegex.test(contact.lastName) == false) {
            lastNameErr.innerText = "Veuillez indiquer un nom valide.";
        }
        else if (noNumberRegex.test(contact.city) == false) {
            cityErr.innerText = "Veuillez indiquer une ville valide.";
        }
        else if (mailRegex.test(contact.email) == false) {
            emailErr.innerText = "Veuillez indiquer une adresse mail valide.";
        }
        else if (!(contact.address)) {
            addressErr.innerText = "Veuillez remplir ce champ.";
        }
    })
}


// SI : form valide => post order