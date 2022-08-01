// Essai numéro 4 - Ca fonctionne !
// PAS TOUCHE sans l'avis de Delphine ! 

// Récupérer l'id dans l'url :
const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

console.log(productPageURL);
console.log(productId);

// ************************************************

// Récupération des data de l'API
// Important : utiliser try et catch !
const fetchData = async () => {
    try {
        // Prendre l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Mettre le contenu de l'API dans .json
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

// ************************************************

// Création de la carte produit
const insertSingleCard = async (product) => {
    // Création de l'image
    let productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    // Insertion de <img>
    const imageDiv = document.getElementsByClassName('item__img');
    imageDiv[0].appendChild(productImg);

    // Insertion nom et prix
    document.getElementById('title').innerText = product.name;
    document.getElementById('price').innerText = product.price;

    // Insertion description
    document.getElementById('description').innerText = product.description;

    // Insertion options des couleurs
    /* Etape : faire une boucle forEach */

    const color = product.colors;

    color.forEach(color => {
        const colorOption = document.createElement('option');
        colorOption.innerText = color;
        colorOption.value = color;
        document.getElementById('colors').appendChild(colorOption);
    })
};

let products = {};

// Insertion de la carte produit :
const insertProductPage = async () => {
    // Récupérer le bon produit dans une Promise
    products = await fetchData(productId);
    // Utiliser la Promise pour insérer la carte
    return fetchData(productId).then(insertSingleCard(products));
}

insertProductPage();

// ************************************************************
// ************************************************************

// Essai 3 : Ajout au panier

// Récupérer les 3 valeurs
const cartItems = async () => {
    
};

// Ajouter au panier
const addToCart = async () => {

    // https://tutowebdesign.com/localstorage-javascript.php
    // Utiliser stringify pour transformer l'objet
    let itemInfo = JSON.stringify(item);

    // Mettre l'objet dans le localStorage
    localStorage.setItem("item", itemInfo);

};

// Raccourci pour le btn addToCart
const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur le btn
addToCartBtn.addEventListener("click", async () => {
    // Récupérer la valeur de la couleur choisie
    const itemColor = document.getElementById('colors').value;

    // Récupérer la valeur de la quantité choisie
    const itemQuantity = document.getElementById('quantity').value;

    // Tout stocker dans un objet
    /* Ca ne fonctionne pas : item n'est pas défini, donc essai avec item défini petit à petit*/
    const itemDetails = {
        id: productId,
        color: itemColor,
        quantity: itemQuantity,
    };
    const item = object.assign(itemDetails);


    // Ajouter if quantity = 0 avec mssg
    // Ajouter if quantity > 100 alert mssg
    // Article identique déjà dans le panier mettre +1

    addToCart();
});



console.log(localStorage);



