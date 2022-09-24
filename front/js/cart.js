// ************************************************
// Variables
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));

// Sélection des parties du DOM
const section = document.getElementById('cart__items');
const priceSpan = document.getElementById("totalPrice");
const quantitySpan = document.getElementById("totalQuantity");
const orderBtn = document.getElementById("order");

// Array pour les totaux
let cartTotalPrice = [];
let cartTotalQuantity = [];

// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchProducts = async (id) => {
    try {
        // Récupérer le contenu de l'API
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        // Récupérer les id des produits
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log("Problème avec l'API !");
        return null;
    }
};

// ************************************************
// Afficher les totaux
// ************************************************

// Total panier vide + message
const emptyCart = () => {
    const emptyCartMessage = document.querySelector('h1');
    // ... afficher ce nouveau titre h1
    emptyCartMessage.innerText = "Votre panier est vide";
    priceSpan.innerText = 0;
    quantitySpan.innerText = 0;
};

// Total initial du panier
const totalCart = () => {
    // Initialisation des variables
    let totalPrice = 0;
    let totalQuantity = 0;

    // Pour chaque prix dans l'array 
    for (const price of cartTotalPrice) {
        // Additionner
        totalPrice += price;
    }

    // Pour chaque quantité dans l'array
    for (const quantity of cartTotalQuantity) {
        // Additionner
        totalQuantity += quantity;
    }

    // Afficher les totaux à leur place
    priceSpan.innerText = totalPrice;
    quantitySpan.innerText = totalQuantity;
};

// Total modifié du panier
const newTotalCart = async () => {

    // Afficher la nouvelle quantité :
    const newTotalQuantity = async () => {
        let totalQuantity = 0;
        for (const item of cart) {
            totalQuantity += parseInt(item.itemQuantity);
        }
        quantitySpan.innerText = totalQuantity;
    };
    newTotalQuantity();

    // Afficher le nouveau prix :
    const newTotalPrice = async () => {
        let totalPrice = 0;

        for (const item of cart) {
            const targetId = item.itemId;
            const targetQuantity = item.itemQuantity;
            // Fetch : Prix unitaire du produit
            const data = await fetchProducts(targetId);
            const unitPrice = parseInt(data.price)
            // Prix total du produit selon sa quantité
            const subTotalPrice = unitPrice * targetQuantity;
            // Additionner les sous-totaux pour obtenir le prix total du panier
            totalPrice += subTotalPrice;
        }
        priceSpan.innerText = totalPrice;
    };
    newTotalPrice();
};

// ************************************************
// Afficher les cartes produit
// ************************************************

const displayProducts = async () => {
    // SI : panier est vide ou n'existe pas...
    if (cart === null || !cart || cart.length === 0) {
        emptyCart();
    }
    // SINON : afficher les produits présents dans le panier
    else {
        // Pour chaque produit dans le panier...
        cart.forEach(product => {
            // Récupérer id, couleur et quantité
            let itemId = product.itemId;
            let itemColor = product.itemColor;
            let itemQuantity = product.itemQuantity;

            // Promesse : initialisation (avec chaque id)
            const data = fetchProducts(itemId);
            // Promesse : résolution (avec .then)
            data.then((productDetails) => {
                // Prix unitaire de chaque produit
                const price = parseInt(productDetails.price);

                // Prix total de chaque produit
                const totalPrice = price * itemQuantity;

                // Push des totaux pour calculer totalCart()
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
                settingsQuantity.appendChild(productQuantity);

                const settingsDelete = document.createElement('div');
                settingsDelete.classList.add('cart__item__content__settings__delete');
                settings.appendChild(settingsDelete);

                const deleteItem = document.createElement('p');
                deleteItem.classList.add('deleteItem');
                deleteItem.innerText = "Supprimer";
                settingsDelete.appendChild(deleteItem);

                section.appendChild(article);

                totalCart(cartTotalPrice, cartTotalQuantity);
                changeQuantity();
                deleteProduct();
            })
        })
    }
};

displayProducts();
console.table(cart);

// ************************************************
// Supprimer un produit
// ************************************************

const deleteProduct = () => {
    const deleteBtn = document.querySelectorAll(".deleteItem");
    // Pour chaque bouton "supprimer"
    deleteBtn.forEach((element) => {
        // Ecouter l'événement "clic"
        element.addEventListener("click", (event) => {
            event.preventDefault();
            // Sélectionner l'article du DOM à modifier
            let targetArticle = element.closest('article');
            // Récupérer uniquement les produits à garder
            cart = cart.filter(item => item.itemId !== targetArticle.dataset.id && item.itemColor !== targetArticle.dataset.color);
            // Ecraser l'ancien panier avec le panier modifié
            localStorage.setItem("product", JSON.stringify(cart));
            console.table(cart);
            // Supprimer "article" de "section" dans le DOM
            section.removeChild(targetArticle);

            // SI : panier contient encore des produits
            if (!(cart === null || !cart || cart.length === 0)) {
                // Mettre les totaux à jour
                newTotalCart();
            }
            // SINON : panier est vide
            else {
                // Afficher le message et mettre les totaux à 0
                emptyCart();
            }

        })
    })
};

// ************************************************
// Modifier la quantité d'un produit
// ************************************************

// Empêcher la saisie d'une quantité négative
const noNegativRegex = /^[0-9]*[1-9][0-9]*$/;

const changeQuantity = () => {
    // Sélectionner les inputs
    const quantityInput = document.querySelectorAll(".itemQuantity");
    // Pour chaque input...
    quantityInput.forEach((element) => {
        // ... ajouter l'eventListener "change"
        element.addEventListener("change", (event) => {
            event.preventDefault();
            // Nouvelle quantité = quantité entrée dans l'input
            const newQuantity = Number(element.value);
            // Sélectionner l'article du DOM à modifier
            let targetArticle = element.closest('article');
            // Sélectionner le produit à modifier (id et couleur identiques)
            let selectedProduct = cart.find(item => item.itemId === targetArticle.dataset.id && item.itemColor === targetArticle.dataset.color);
            // SI : input est une quantité valide (même conditions que product.js)
            if (newQuantity > 0 && newQuantity <= 100 && (noNegativRegex.test(newQuantity) == true)) {
                // Convertir la string de l'input
                const parseNewQuantity = parseInt(newQuantity);
                // Ecraser l'ancienne quantité avec la nouvelle
                selectedProduct.itemQuantity = parseNewQuantity;
                // Enregistrer les modifications dans le localStorage
                localStorage.setItem("product", JSON.stringify(cart));
                // Mettre les totaux à jour
                newTotalCart();
            }
            else {
                alert("Veuillez indiquer une quantité entre 1 et 100.");
                // Réactualiser la page dès que l'input perd le focus
                location.reload();
            }
        })
    })
};

// ************************************************
// Validation du formulaire
// ************************************************

// Input
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('email');

// Regex
const noNumberRegex = /[a-zA-Z '-,]{1,31}$/i;
const emailRegex = /[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,3}$/i;

// Message d'erreur
const nameErrorMessage = "Veuillez indiquer un nom ne comportant ni chiffres ni caractères spéciaux (exceptions : accent, trait d'union, espace et apostrophe)";
const emailErrorMessage = "Veuillez indiquer une adresse email valide (exemple : JeanBonbeur@gmail.com)";

// Emplacement du message d'erreur (messageSpot)
const firstNameErr = document.getElementById('firstNameErrorMsg');
const lastNameErr = document.getElementById('lastNameErrorMsg');
const cityErr = document.getElementById('cityErrorMsg');
const emailErr = document.getElementById('emailErrorMsg');

// ************************************************
// Commander
// ************************************************

// Récupérer fiche contact et récap de commande
const getOrder = () => {
    // Créer un tableau pour y mettre les produits
    let products = [];

    //Pour chaque produit dans le panier...
    cart.forEach(item => {
        // ... mettre son id dans le tableau
        products.push(item.itemId);
    });

    // Récupérer la fiche contact :
    let contact = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: addressInput.value,
        city: cityInput.value,
        email: emailInput.value
    };

    // Afficher un message de succès :
    alert("Commande effectuée avec succès. Vous allez être redirigé.e vers une page de confirmation.");
    // Envoyer l'objet "contact" et le tableau des produits à l'API
    postOrder(contact, products);
    
};

// Envoyer fiche contact et récap de commande
const postOrder = async (contact, products) => {
    try {
        const response = await fetch('http://localhost:3000/api/products/order', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ contact, products }),
        })
        const data = await response.json();
        return getOrderId(data);
    }
    catch (err) {
        console.log("Erreur");
        return null;
    }
};

// Récupérer orderId envoyé par l'API
const getOrderId = async (data) => {
    // Diriger vers la page de confirmation
    window.location.href = `./confirmation.html?orderId=` + data.orderId;
    // Vider le localStorage
    localStorage.clear();
};

if (orderBtn) {
    // Déclencher l'envoi au clic sur "Commander"
    orderBtn.addEventListener("click", (event) => {

        // SI : Panier est rempli
        if (cart && cart !== null && cart.length !== 0) {

            //SI : les inputs sont remplis
            if (firstNameInput.value && lastNameInput.value && addressInput.value && cityInput.value && emailInput.value) {

                //SI : les regex sont respectés
                if ((noNumberRegex.test(firstNameInput.value) == true) &&
                    (noNumberRegex.test(lastNameInput.value) == true) &&
                    (noNumberRegex.test(cityInput.value) == true) &&
                    (emailRegex.test(emailInput.value) == true)) {
                    getOrder();
                }

                //SINON : les regex ne sont pas respectés
                else {
                    alert("Veuillez vérifier les champs du formulaire.");
                    event.preventDefault();

                    // Pointer vers l'input erroné
                    if (noNumberRegex.test(firstNameInput.value) == false) {
                        firstNameErr.innerText = nameErrorMessage;
                    }
                    if (noNumberRegex.test(lastNameInput.value) == false) {
                        lastNameErr.innerText = nameErrorMessage;
                    }
                    if (noNumberRegex.test(cityInput.value) == false) {
                        cityErr.innerText = nameErrorMessage;
                    }
                    if (emailRegex.test(emailInput.value) == false) {
                        emailErr.innerText = emailErrorMessage;
                    }
                }
            }

            //SINON: les inputs ne sont pas remplis
            else {
                alert("Veuillez remplir tous les champs du formulaire.");
                event.preventDefault();
            }
        }

        //SINON: Panier est vide
        else {
            alert("Veuillez remplir votre panier avant de passer commande.");
            event.preventDefault();
        }
    })
}