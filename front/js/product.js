// ************************************************
// Récupérer l'id dans l'url :
// ************************************************
const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

// ************************************************
// Récupération du produit dans l'API
// ************************************************

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
// ************************************************

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
// ************************************************

const insertProductPage = async () => {
    // Récupérer le bon produit dans une Promise
    let products = await fetchData();
    // Utiliser la Promise pour insérer la carte
    return fetchData().then(insertSingleCard(products));
};

insertProductPage();

// ************************************************
// Ajout au panier après vérification
// ************************************************

const checkFormInput = async () => {

    // ************************************************
    // Récupérer les inputs du formulaire
    // ************************************************

    // Récupérer la valeur de la couleur/quantité choisie
    const itemColor = document.getElementById('colors').value;
    const itemQuantity = document.getElementById('quantity').value;

    // Stocker les 3 valeurs dans un objet
    const itemDetails = {
        id: productId,
        color: itemColor,
        quantity: itemQuantity
    };

    console.log(itemDetails);

    // ****************************************************
    // Création du panier dans le localStorage
    // ****************************************************

    // Utiliser parse pour rendre le contenu lisible en JS
    let itemInLocalStorage = JSON.parse(localStorage.getItem('product'));

    // ************************************************
    // Fonction 'ajout au panier'
    // ************************************************

    // Stocker les valeurs dans le panier
    const addToCart = async () => {
        // Push le produit dans le panier
        itemInLocalStorage.push(itemDetails);

        // Utiliser stringify avant de mettre dans le localStorage
        localStorage.setItem("product", JSON.stringify(itemInLocalStorage));

        // Confirmer l'ajout
        alert("Article(s) ajouté(s) au panier");
    };

    // ****************************************************
    // Vérification : validité des inputs
    // ****************************************************

    // SI : la quantité est inf/égale à 0 OU sup à 100 OU négative...
    if (itemQuantity <= 0 || itemQuantity > 100 || Math.sign(-1)) {
        // ... envoyer ce message pour corriger ou retourner à l'accueil

    };

    // SI : la couleur n'a pas été sélectionnée...
    if (itemColor == "") {
        // ... envoyer ce message pour corriger ou retourner à l'accueil

    };

    // ****************************************************
    // Vérification : doublons
    // ****************************************************

    // Comparaison du panier et du nouvel ajout
    const alreadyInCart = itemInLocalStorage.id === productId && itemInLocalStorage.color === itemColor;

    // SI : id et color identiques déjà dans le panier...
    if (alreadyInCart) {
        // ... vérifier si la somme des quantités est sup à 100
        if (itemInLocalStorage.quantity += itemQuantity > 100) {
            confirm("Nombre maximum du même article atteint \nOK pour accéder au panier sans modifier Annuler pour modifier") 
        }



        // ... additionner la quantité actuelle et la nouvelle quantité
        ;

        
        // SI : la nouvelle quantité est sup à 100...
        if (itemInLocalStorage.quantity > 100) {
            // ... envoyer un mss d'alerte et empêcher l'ajout
            // Ou ne pas ajouter surplus et prévenir
            alert("Nombre maximum du même article atteint")
        }
        // SINON : remplacer l'ancienne quantité par la somme dans le localStorage 
        else {
            addToCart();
            console.log('Quantité modifiée')
        }

    }

    // ****************************************************
    // Ajout au panier
    // ****************************************************

    // SI : Client a déjà un panier mais id et couleur différents...
    if (itemInLocalStorage) {
        // ... ajouter le produit au panier
        addToCart();
    }
    // SINON : Client n'a pas de panier
    else {
        // Créer le panier...
        itemInLocalStorage = [];
        // ... et ajouter le produit au panier
        addToCart();
    }
};

// *************************************************
// Envoi du formulaire valide
// *************************************************

const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur le btn
addToCartBtn.addEventListener("click", (event) => {
    // Empêcher la réactualisation de la page lors du clic
    event.preventDefault();
    // Vérifier le produit et l'ajouter au panier
    checkFormInput();
});