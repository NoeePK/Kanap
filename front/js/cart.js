// totalCart :comment sortir l'addition de la boucle ?
// Quel regex pour adresse ?

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

// Totaux panier vide + message
const emptyCart = () => {
    const emptyCartMessage = document.querySelector('h1');
    // ... afficher ce nouveau titre h1
    emptyCartMessage.innerText = "Votre panier est vide";
    priceSpan.innerText = 0;
    quantitySpan.innerText = 0;
};

// Totaux calculés en direct
const totalCart = () => {
    // Calculer les totaux
    const computeTotalCart = (arrayTotal) => {
        // Initialisation des variables
        let cartTotalQuantity = [];
        let cartTotalPrice = [];

        // Pour chaque produit dans le panier
        for (const item of cart) {
            // Viser l'id et la quantité
            const targetId = item.itemId;
            const targetQuantity = parseInt(item.itemQuantity);

            // Promesse : initialisation (avec l'id sélectionné)
            const data = fetchProducts(targetId);
            // Promesse : résolution (avec .then)
            data.then((productDetails) => {
                // Prix unitaire de chaque produit
                const targetPrice = parseInt(productDetails.price);
                // Prix total de chaque produit selon leur quantité
                const newTotalPrice = targetPrice * targetQuantity;
                // Push des totaux dans les array des totaux
                cartTotalQuantity.push(targetQuantity);
                cartTotalPrice.push(newTotalPrice);

                return arrayTotal;
            })
        }
    };

    // Récupérer les totaux dans deux array
    computeTotalCart(cartTotalPrice);
    computeTotalCart(cartTotalQuantity);

    console.log("Array de tous les prix à additionner : " + cartTotalPrice);
    console.log("Array de toutes les quantité à additionner : " + cartTotalQuantity);

    // Additionner et afficher les totaux
    const displayTotalCart = (cartTotalPrice, cartTotalQuantity) => {
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

    displayTotalCart(cartTotalPrice, cartTotalQuantity)
}


// ************************************************
// Afficher les cartes produit
// ************************************************

const createArticle = async () => {
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

                totalCart();
                changeQuantity();
                deleteProduct();
            })

        })
    }
};

createArticle();
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
                totalCart();
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
            if (newQuantity > 0 && newQuantity <= 100 && Number.isInteger(newQuantity)) {
                // Convertir la string de l'input
                const parseNewQuantity = parseInt(newQuantity);
                // Ecraser l'ancienne quantité avec la nouvelle
                selectedProduct.itemQuantity = parseNewQuantity;
                // Enregistrer les modifications dans le localStorage
                localStorage.setItem("product", JSON.stringify(cart));
                // Comment update les totaux sans reload ?
                totalCart();
            }
            else {
                alert("Veuillez indiquer une quantité valide (entre 0 et 100).")
                return;
            }
        })
    })
};

// ************************************************
// Validation du formulaire
// ************************************************

// Inputs
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressInput = document.getElementById('address');
const cityInput = document.getElementById('city');
const emailInput = document.getElementById('email');

// Regex
const noNumberRegex = /[a-zA-Z '-,]{1,31}$/i;
const emailRegex = /[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,40}$/i;

// Types d'erreur
let firstNameNotValid;
let lastNameNotValid;
let addressNotValid;
let cityNotValid;
let emailNotValid;

// Messages d'erreur
// const addressErrorMessage = "Veuillez indiquer une adresse valide";
const nameErrorMessage = "Veuillez indiquer un nom valide";
const emailErrorMessage = "Veuillez indiquer une adresse email valide";

// Emplacement des messages d'erreur (messageSpot)
const firstNameErr = document.getElementById('firstNameErrorMsg');
const lastNameErr = document.getElementById('lastNameErrorMsg');
// const addressErr = document.getElementById('addressErrorMsg');
const cityErr = document.getElementById('cityErrorMsg');
const emailErr = document.getElementById('emailErrorMsg');

// Fonction pour vérifier les inputs (refactoring)
const checkForm = (input, regex, error, message, messageSpot) => {
    input.addEventListener("change", function () {
        let checkInput = regex.test(input.value);
        if (checkInput) {
            error = false;
        }
        else {
            error = true;
            messageSpot.innerText = message;
        }
    })
};

// Vérification de tous les inputs
checkForm(firstNameInput, noNumberRegex, firstNameNotValid, nameErrorMessage, firstNameErr);
checkForm(lastNameInput, noNumberRegex, lastNameNotValid, nameErrorMessage, lastNameErr);
// checkForm(addressInput, regex, addressNotValid, addressErrorMessage, addressErr);
checkForm(cityInput, noNumberRegex, cityNotValid, nameErrorMessage, cityErr);
checkForm(emailInput, emailRegex, emailNotValid, emailErrorMessage, emailErr);

// ************************************************
// Commander
// ************************************************

const order = async () => {
    orderBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // SI : panier est vide
        if (cart === null || !cart || cart.length === 0) {
            alert("Veuillez remplir votre panier avant de passer commande.");
        }
        // SINON : panier est rempli
        // SI : les inputs sont vides
        else if (!firstNameInput.value || !lastNameInput.value || !addressInput.value || !cityInput.value || !emailInput.value) {
            // Avertir l'utilisateur de son oubli
            alert("Veuillez remplir tous les champs du formulaire.");
            // Empêcher l'envoi du formulaire
            event.preventDefault();
        }
        // SINON : les inputs sont remplis
        // SI : les regex ne sont pas respectés
        else if (firstNameNotValid === true || lastNameNotValid === true || addressNotValid === true || cityNotValid === true || emailNotValid === true) {
            alert("Veuillez remplir tous les champs du formulaire.");
            event.preventDefault();
        }
        // SINON : les regex sont respectés
        else {
            // ...  créer un tableau pour y mettre les produits...
            let productID = [];
            //Pour chaque produit dans le panier...
            cart.forEach(item => {
                // ... mettre son id dans le tableau
                productID.push(item.itemId);
            });

            console.log(productID);

            // Récupérer la fiche contact :
            let contact = {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                address: addressInput.value,
                city: cityInput.value,
                email: emailInput.value
            };

            console.log(contact);

            // Afficher un message de succès :
            alert("Commande effectuée avec succès. Vous allez être redirigé.e vers une page de confirmation.");

            postOrder(contact, productID);
        }
    })
};

const postOrder = async (contact, productID) => {
    fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({contact, productID})
    })
    // Récupérer la réponse de l'API en format JSON
    .then((response) => response.json())
    // Envoyer la réponse dans l'URL et rediriger vers page de confirmation
    .then((result) => document.location.href = `confirmation.html?orderId=${result.orderId}`)
    // IMPORTANT : vider le localStorage
    // localStorage.clear();
};

order();