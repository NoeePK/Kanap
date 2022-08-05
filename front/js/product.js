// Essai numéro 4 - Ca fonctionne !
// PAS TOUCHE sans l'avis de Delphine ! 

// Récupérer l'id dans l'url :
const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

console.log(productPageURL);
console.log(productId);

// ************************************************
// Récupération du produit dans l'API
// Important : utiliser try et catch !

const fetchData = async () => {
    try {
        // Récupérer l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Récupérer les produits dans .json
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

    // Insertion de l'image
    const imageDiv = document.getElementsByClassName('item__img');
    // Préciser que c'est la première (comme c'est pas un id)
    imageDiv[0].appendChild(productImg);

    // Insertion nom, prix, description
    document.getElementById('title').innerText = product.name;
    document.getElementById('price').innerText = product.price;
    document.getElementById('description').innerText = product.description;

    // Insertion options des couleurs
    const color = product.colors;

    // Pour chaque couleur...
    color.forEach(color => {
        // ... créer une option...
        const colorOption = document.createElement('option');
        // ... avec la couleur comme nom et comme valeur...
        colorOption.innerText = color;
        colorOption.value = color;
        // ... et ajouter l'option créée dans l'élément 'select'
        document.getElementById('colors').appendChild(colorOption);
    })
};

// ************************************************
// Insertion de la carte produit

const insertProductPage = async () => {
    // Récupérer le bon produit dans une Promise
    let products = await fetchData();
    // Utiliser la Promise pour insérer la carte
    return fetchData().then(insertSingleCard(products));
}

insertProductPage();

// *************************************************
// *************************************************

// Essai 4 : Récupérer les infos du formulaire

const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur le btn
addToCartBtn.addEventListener("click", (event) => {
    // Empêcher la réactualisation de la page lors du clic
    event.preventDefault();

    // Récupérer la valeur de la couleur/quantité choisie
    const itemColor = document.getElementById('colors').value;
    const itemQuantity = document.getElementById('quantity').value;

    // Stocker les 3 valeurs dans un objet
    // Le prix aussi ?
    const itemDetails = {
        id: productId,
        color: itemColor,
        quantity: itemQuantity
    };

    console.log(itemDetails);

    // Utiliser parse pour rendre le contenu lisible en JS
    let itemInLocalStorage = JSON.parse(localStorage.getItem('product'));
    // Trouver un nom plus court si possible

    // Essai : changement de place
    // Stocker les valeurs dans le localStorage
    const addToCart = async () => {
        // Push le produit dans l'array
        itemInLocalStorage.push(itemDetails);

        // https://tutowebdesign.com/localstorage-javascript.php
        // Utiliser stringify avant de mettre dans le localStorage
        localStorage.setItem("product", JSON.stringify(itemInLocalStorage));
    };

    // **************************************
    // FONCTIONS A METTRE EN PLACE***********

// ESSAI avec RETURN

    // SI : la quantité est inf/égale à 0 OU sup à 100...
    if (itemQuantity <= 0 || itemQuantity > 100) {
        // ... envoyer ce message d'alerte...
        return alert("Veuillez choisir un nombre d'article valide (entre 1 et 100)");
        // ... et ne pas ajouter le produit au panier
        // Comment annuler l'ajout au panier ?
    };

    // SI : la couleur n'a pas été sélectionnée...
    // == ou === ?
    if (itemColor == "") {
        // ... envoyer ce message d'alerte...
        return alert("Veuillez choisir une couleur pour procéder à l'ajout");
        // ... et ne pas ajouter le produit au panier
        // Même problème qu'au-dessus
    };

    // Article identique déjà dans le panier
    // Refactoring : const avec comparaison du panier et du nouvel ajout
    const alreadyInCart = itemInLocalStorage.id === productId && itemInLocalStorage.color === itemColor;

    // SI : id et color identiques déjà dans le panier...
    if (alreadyInCart) {
        // ... additionner la quantité actuelle et la nouvelle quantité
        itemInLocalStorage.quantity += itemQuantity;
        // Pourquoi ça remplace l'ancienne valeur par la nouvelle ?
        // Utiliser push ?
    }
    // SI : Client a déjà un panier mais id et couleur différents...
    if (itemInLocalStorage) {
        // ... ajouter le produit au panier
        addToCart();
        console.log('Ajouté au panier');
    }
    // SINON : Client n'a pas de panier
    else {
        // Créer l'array
        itemInLocalStorage = [];
        // ... et ajouter le produit au panier
        addToCart();
        console.log('Création du panier');
    }
});

// *******************************
// ******Formules à créer et améliorations******
// *******************************
// Article ajouté : mssg de confirmation de l'ajout
// Optimiser les noms + optimiser les formules au max
// Apprendre à exporter/importer des fonctions JS