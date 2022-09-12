// ************************************************
// Variables
// ************************************************

let cart = JSON.parse(localStorage.getItem('product'));

// Sélection des parties du DOM
const emptyCart = document.querySelector('h1');
const section = document.getElementById('cart__items');
const article = document.querySelectorAll('.cart__item');

// Les boutons
const deleteBtn = document.querySelectorAll(".deleteItem");
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
                const price = Number(productDetails.price);
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

    // Initialisation des variables
    let totalPrice = 0;
    let totalQuantity = 0;

    // Pour chaque prix dans l'array 
    for (price of cartTotalPrice) {
        // Additionner
        totalPrice += price;
    }

    // Pour chaque quantité dans l'array
    for (quantity of cartTotalQuantity) {
        // Additionner
        totalQuantity += quantity;
    }

    // Afficher les totaux à leur place
    priceSpan.innerText = totalPrice;
    quantitySpan.innerText = totalQuantity;
};

// ************************************************
// Supprimer un produit
// ************************************************

// Essai 9 : let

// Pour chaque bouton "supprimer"...
for (let selectedBtn = 0; selectedBtn < deleteBtn.length; selectedBtn++) {
    // ... écouter le clic sur le bouton
    deleteBtn[selectedBtn].addEventListener("click", function () {
        console.log("Clic effectué");
        // Récupérer les bons id et couleur
        let itemIdToDelete = cart[selectedBtn].itemId;
        console.log(itemIdToDelete);
        let itemColorToDelete = cart[selectedBtn].itemColor;
        // Créer un nouveau panier avec les produits à garder
        const newCart = cart.filter(el => el.itemId !== itemIdToDelete && el.itemColor !== itemColorToDelete);
        // Ecraser l'ancien panier avec le nouveau
        localStorage.setItem("product", JSON.stringify(newCart));
        // Prévenir l'utilisateur et actualiser la page
        alert("Suppression effectuée.");
        location.reload();
    })
}


// ************************************************
// Modifier la quantité d'un produit
// ************************************************

const changeQuantity = () => {
    // Pour chaque élément input du DOM...
    for (let i = 0; i < quantityInput.length; i++) {
        // ... ajouter un eventListener "change"
        quantityInput[i].addEventListener("change", function () {
            // Récupérer l'ancienne quantité
            const pastQuantity = cart[i].itemQuantity;
            console.log(pastQuantity);
            // Récupérer la nouvelle quantité sous forme de nombre
            const newQuantity = Number(quantityInput[i]);
            console.log(newQuantity);

            // Vérifier que la nouvelle quantité est valide :
            if (!(newQuantity < 0 || newQuantity > 100 || newQuantity == "")) {
                cart[i].itemQuantity = newQuantity;
                localStorage.setItem("product", JSON.stringify(cart));
                totalCart(cartTotalPrice, cartTotalQuantity);
                location.reload();
            }
            else {
                alert("Veuillez choisir une quantité valide (entre 1 et 100");
                return;
            }
        })
    }
}

changeQuantity();

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