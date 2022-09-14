// updateTotalCart :comment sortir l'addition de la boucle ?


// ************************************************
// Variables
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));

// Sélection des parties du DOM
const emptyCart = document.querySelector('h1');
const section = document.getElementById('cart__items');
const priceSpan = document.getElementById("totalPrice");
const quantitySpan = document.getElementById("totalQuantity");

// Les boutons
const orderBtn = document.getElementById("order");

// Variables pour les totaux
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

createArticle();
console.table(cart);

// ************************************************
// Afficher les totaux
// ************************************************

// Totaux prix et quantité initiaux
const totalCart = (cartTotalPrice, cartTotalQuantity) => {
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

// Totaux prix et quantité modifiés
const updateTotalCart = () => {
    // Initialisation des variables
    let cartTotalQuantity = [];
    let cartTotalPrice = [];
    let totalQuantity = 0;
    let totalPrice = 0;

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

            console.log(targetId);
            console.log("Quantité du produit : " + targetQuantity);
            console.log("Prix unitaire du produit : " + targetPrice);
            console.log("Total pour ce produit : " + newTotalPrice);

            // Pour chaque quantité dans l'array
            for (const quantity of cartTotalQuantity) {
                // Additionner
                totalQuantity += quantity;
            }

            // Pour chaque prix dans l'array 
            for (const price of cartTotalPrice) {
                // Additionner
                totalPrice += price;
            }

            console.log("Array de toutes les quantité à additionner : " + cartTotalQuantity);
            console.log("Array de tous les prix à additionner : " + cartTotalPrice);
            console.log("Prix total : " + totalPrice);
            console.log("Quantité totale : " + totalQuantity);

            // Afficher les totaux à leur place
            quantitySpan.innerText = totalQuantity;
            priceSpan.innerText = totalPrice;


        })
    }
}



// ************************************************
// Supprimer un produit
// ************************************************

// Essai 11 : 

const deleteProduct = () => {
    const deleteBtn = document.querySelectorAll(".deleteItem");
    deleteBtn.forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            // Sélectionner l'article du DOM à modifier
            let targetArticle = element.closest('article');
            cart = cart.filter(item => item.itemId !== targetArticle.dataset.id || item.itemColor !== targetArticle.dataset.itemColor);
            // Ecraser l'ancien panier avec le panier modifié
            localStorage.setItem("product", JSON.stringify(cart));

            // Supprimer "article" de "section" dans le DOM
            section.removeChild(targetArticle);
            updateTotalCart();

            // // SI : panier est vide ou n'existe pas...
            // if (cart === null || !cart) {
            //     // ... afficher ce nouveau titre h1
            //     emptyCart.innerText = "Votre panier est vide";
            //     // Afficher 0 pour tous les totaux
            //     let cartTotalPrice = 0;
            //     let cartTotalQuantity = 0;
            //     totalCart(cartTotalPrice, cartTotalQuantity);
            // }
            // else {
            //     cartTotalPrice = cartTotalPrice 
            //     totalCart()
            // }

        })
    })
}


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
                updateTotalCart();

            }
            else {
                alert("Veuillez indiquer une quantité valide (entre 0 et 100).")
                return;
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

order();

// SI : form valide => post order