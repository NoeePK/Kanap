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

// Essai 2 : Ajout au panier

// Créer l'array des 3 valeurs

const cartArray = async () => {
    // Récupérer la valeur de l'option choisie
    const colorSelect = document.getElementById('colors');
    const colorChoice = colorSelect.options[colorSelect.selectedIndex].text;

    // Récupérer la valeur de la quantité choisie
    const itemQuantity = document.getElementById('quantity').value;

    // Tout récupérer dans un array
    const cartItems = [[localStorage.setItem("id", productId)], [localStorage.setItem("color", colorChoice)], [localStorage.setItem("quantity", itemQuantity)]
    ];
}

cartArray();
console.log(cartArray())

// Ajouter au panier
const addToCart = async () => {
    try {
        cartArray();
    }
    catch (err) {
        console.log(err)
        return null
    }
}


// Déclencher l'ajout au panier avec le clic
const addToCartBtn = document.getElementById('addToCart');
addToCartBtn.addEventListener("click", addToCart());





