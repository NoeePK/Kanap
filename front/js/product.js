// ************************************************
// Récupérer l'id dans l'url :
// ************************************************
const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

console.log(productId);

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

// *************************************************
// Envoi du formulaire
// *************************************************

const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur le btn
addToCartBtn.addEventListener("click", (event) => {
    // Empêcher la réactualisation de la page lors du clic
    event.preventDefault();

    // ************************************************
    // Récupérer les inputs du formulaire
    // ************************************************

    // Récupérer la valeur de la couleur/quantité choisie
    const inputId = productId;
    const inputColor = document.getElementById('colors').value;
    const inputQuantity = document.getElementById('quantity').value;

    // Stocker les 3 valeurs dans un objet
    const itemDetails = {
        id: inputId,
        color: inputColor,
        quantity: inputQuantity
    };

    console.log(itemDetails);

    // ****************************************************
    // Correction des inputs
    // ****************************************************

    // Messages possibles selon la situation
    const validInput = "Article(s) ajouté(s) au panier. \nOK pour rester sur cette page Annuler pour accéder au panier.";
    const maxInput = "Nombre maximum du même article atteint. \nOK pour modifier, Annuler pour accéder au panier sans modifier.";
    const invalidInput = "Veuillez choisir une couleur et une quantité valide. \nOK pour modifier, Annuler pour accéder au panier sans modifier.";


    // Fonction confirmation à utiliser avec une des options ci-dessus
    function confirmMessage(userMessage) {
        const userChoice = window.confirm(userMessage);

        if (userChoice) {
            location.reload();
        }
        else {
            window.location.href = "cart.html";
        }
    };

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
        confirmMessage(validInput);
    };

    // ****************************************************
    // Vérification : validité des inputs
    // ****************************************************

    // SI : la quantité est entre 1 et 100, positive, et une couleur sélectionnée...
    if (inputQuantity <= 0 || inputQuantity > 100 || Math.sign(-1) || inputColor == "") {
        // ... envoyer ce message pour corriger ou retourner à l'accueil
        confirmMessage(invalidInput);
    };

    // ****************************************************
    // Vérification : doublons
    // ****************************************************

    // Comparaison du panier et du nouvel ajout
    const alreadyInCart = itemInLocalStorage.id === productId && itemInLocalStorage.color === inputColor;
    const newQuantity = itemInLocalStorage.quantity += inputQuantity;

    // SI : id et color identiques déjà dans le panier...
    if (alreadyInCart) {
        // ... vérifier si la somme des quantités est sup à 100
        if (newQuantity > 100) {
            // Si true : forcer la correction ou l'abandon
            confirmMessage(maxInput);
        }
        else {
            // Si false : additionner new et old quantité
            newQuantity;
            confirmMessage(validInput);
        }
    };

    // ****************************************************
    // Inputs valides : Ajout au panier
    // ****************************************************

    // SI : Client a déjà un panier sans doublon...
    if (itemInLocalStorage) {
        // ... ajouter le produit au panier
        addToCart();
        // Confirmer l'ajout
        confirmMessage(validInput);

    }
    // SINON : Client n'a pas de panier...
    else {
        // Créer le panier...
        itemInLocalStorage = [];
        // ... ajouter le produit au panier
        addToCart();
        // Confirmer l'ajout
        confirmMessage(validInput);
    }
});