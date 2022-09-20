// ************************************************
// Variables et arrays
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
                productPrice.classList.add('price');
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
                // Mettre les totaux à jour
                newTotalCart();
            }
            else {
                alert("Veuillez indiquer une quantité valide (entre 0 et 100).")
                return;
            }
        })
    })
};

// ************************************************
// Variables pour le formulaire
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

// Type d'erreur
let firstNameNotValid;
let lastNameNotValid;
let addressNotValid;
let cityNotValid;
let emailNotValid;

// Message d'erreur
const nameErrorMessage = "Veuillez indiquer un nom ne comportant ni chiffres ni caractères spéciaux (exceptions : accent, trait d'union, espace et apostrophe)";
const emailErrorMessage = "Veuillez indiquer une adresse email valide (exemple : jeanbonbeur@gmail.com)";

// Emplacement du message d'erreur (messageSpot)
const firstNameErr = document.getElementById('firstNameErrorMsg');
const lastNameErr = document.getElementById('lastNameErrorMsg');
const cityErr = document.getElementById('cityErrorMsg');
const emailErr = document.getElementById('emailErrorMsg');

// ************************************************
// Validation du formulaire
// ************************************************

// Fonction universelle pour vérifier un input
const checkForm = (input, regex, error, message, messageSpot) => {
    input.addEventListener("change", function () {
        let checkInput = regex.test(input.value);
        if (checkInput) {
            error = false;
        }
        else {
            error = true;
            messageSpot.innerText = message;
            return;
        }
    })
};

// Fonction groupée pour vérifier tous les inputs
const validateForm = () => {
    // Vérification de tous les inputs
    checkForm(firstNameInput, noNumberRegex, firstNameNotValid, nameErrorMessage, firstNameErr);
    checkForm(lastNameInput, noNumberRegex, lastNameNotValid, nameErrorMessage, lastNameErr);
    checkForm(cityInput, noNumberRegex, cityNotValid, nameErrorMessage, cityErr);
    checkForm(emailInput, emailRegex, emailNotValid, emailErrorMessage, emailErr);
};

validateForm();

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

    console.log(products);

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
    // Envoyer l'objet "contact" et le tableau des produits à l'API
    postOrder(contact, products);
    getOrderId();

};

// // Algorithme 1 : Valider le formulaire de commande
// const validateOrder = async () => {
//     orderBtn.addEventListener("click", (event) => {
//         event.preventDefault();
//         // SI : panier est vide
//         if (cart === null || !cart || cart.length === 0) {
//             alert("Veuillez remplir votre panier avant de passer commande.");
//             event.preventDefault();
//         }
//         // SINON : panier est rempli
//         else {
//             // SI : les inputs sont vides
//             if (!firstNameInput.value || !lastNameInput.value || !addressInput.value || !cityInput.value || !emailInput.value) {
//                 // Avertir l'utilisateur de son oubli
//                 alert("Veuillez remplir tous les champs du formulaire.");
//                 event.preventDefault();
//             }
//             // SINON : les inputs sont remplis
//             else {
//                 // SI : les regex ne sont pas respectés
//                 if (firstNameNotValid === true || lastNameNotValid === true || addressNotValid === true || cityNotValid === true || emailNotValid === true) {
//                     // Avertir l'utilisateur de son erreur
//                     alert("Veuillez vérifier les champs du formulaire.");
//                     event.preventDefault();
//                 }
//                 // SINON : les regex sont respectés
//                 else {
//                     getOrder()
//                 }
//             }
//         }
//     })
// };

// // Algorithme 2 : Valider le formulaire de commande
// const validateOrder = async () => {
//     orderBtn.addEventListener("click", (event) => {
//         event.preventDefault();
//         // SI : Panier est rempli
//         if (cart && cart !== null && cart.length !== 0) {
//             //SI : les inputs sont remplis
//             if (firstNameInput.value && lastNameInput.value && addressInput.value && cityInput.value && emailInput.value) {
//                 //SI : les regex sont respectés
//                 if (firstNameNotValid === false && lastNameNotValid === false && addressNotValid === false && cityNotValid === false && emailNotValid === false) {
//                     getOrder();
//                 }
//                 //SINON : les regex ne sont pas respectés
//                 else {
//                     alert("Veuillez vérifier les champs du formulaire.");
//                     event.preventDefault();
//                     validateForm();
//                 }
//             }
//             //SINON: les inputs ne sont pas remplis
//             else {
//                 alert("Veuillez remplir tous les champs du formulaire.");
//                 event.preventDefault();
//             }
//         }
//         //SINON: Panier est vide
//         else {
//             alert("Veuillez remplir votre panier avant de passer commande.");
//             event.preventDefault();
//         }
//     })
// };

// // Algorithme 3 : Valider le formulaire de commande
// const validateOrder = async () => {
//     orderBtn.addEventListener("click", (event) => {
//         event.preventDefault();
//         // SI : Inputs sont remplis
//         if (firstNameInput.value && lastNameInput.value &&
//             addressInput.value && cityInput.value && emailInput.value) {
//             // SI : Regex sont respectés
//             if (firstNameNotValid === false && lastNameNotValid === false &&
//                 addressNotValid === false && cityNotValid === false && emailNotValid === false) {
//                 // SI : Panier est rempli
//                 if (cart && cart !== null && cart.length !== 0) {
//                     getOrder();
//                 }
//                 // SINON : Panier est vide
//                 else {
//                     alert("Veuillez remplir votre panier avant de passer commande.");
//                     // Empêcher l'envoi du formulaire
//                     event.preventDefault();
//                     // Rediriger vers la page d'accueil
//                     window.location.href = "http://127.0.0.1:5500/front/html/index.html";
//                 }
//             }
//             // SINON : Regex ne sont pas respectés
//             alert("Veuillez vérifier les champs du formulaire.");
//             // Empêcher l'envoi du formulaire
//             event.preventDefault();
//             // COMMENT changer le statut "true" après que user ait modifiés les inputs ?
//             validateForm();
//         }
//         //SINON: les inputs ne sont pas remplis
//         else {
//             alert("Veuillez remplir tous les champs du formulaire.");
//             event.preventDefault();
//         }
//     })
// };

// Algorithme 0 :
const validateOrder = () => {
    orderBtn.addEventListener("click", (event) => {
        event.preventDefault();
        // SI : panier est vide
        if (cart === null || !cart || cart.length === 0) {
            alert("Veuillez remplir votre panier avant de passer commande.");
        }
        // SINON : panier est rempli

        else {
            // SI : les inputs sont vides
            if (!firstNameInput.value || !lastNameInput.value || !addressInput.value || !cityInput.value || !emailInput.value) {
                // Avertir l'utilisateur de son oubli
                alert("Veuillez remplir tous les champs du formulaire.");
                // Empêcher l'envoi du formulaire
                event.preventDefault();
            }
            // SINON : les inputs sont remplis
            else {
                // SI : les regex ne sont pas respectés
                if (firstNameNotValid === true || lastNameNotValid === true || addressNotValid === true || cityNotValid === true || emailNotValid === true) {
                    alert("Veuillez remplir tous les champs du formulaire.");
                    event.preventDefault();
                }
                // SINON : les regex sont respectés
                else {
                    getOrder();
                }
            }
        }


    })
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
        console.log(response);
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (err) {
        console.log("Erreur");
        return null;
    }
};

// Récupérer l'orderId envoyé par l'API
const getOrderId = async () => {
    // Récupérer 
    let data = await postOrder();
    // Diriger vers la page de confirmation
    window.location.href = `./confirmation.html?orderId=` + data.orderId;
    // Vider le localStorage
    localStorage.clear();
};

validateOrder();
