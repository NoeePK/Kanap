// CORRECTIONS A METTRE EN PLACE :
// Message confirm
// Empêcher ajout inputs invalides


// ************************************************
// Récupérer l'id dans l'url :
// ************************************************
const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

// ************************************************
// Récupérer le produit dans l'API
// ************************************************

const fetchProduct = async () => {
    try {
        // Récupérer l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Récupérer les produits dans .json
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log("Erreur");
        return null;
    }
};

// ************************************************
// Création de la carte produit
// ************************************************

const createCard = async (product) => {
    // Création de l'image
    let productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;

    // Insertion de l'image
    const imageDiv = document.getElementsByClassName('item__img');
    imageDiv[0].appendChild(productImg);

    // Insertion nom, prix, description (+ espace avant €)
    document.getElementById('title').innerText = product.name;
    document.getElementById('price').innerText = product.price + " ";
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
    });
};

// ************************************************
// Insertion de la carte produit
// ************************************************

const insertCard = async () => {
    // Récupérer le bon produit dans une Promise
    let data = await fetchProduct();
    // Créer la carte avec le produit récupéré
    createCard(data);
};

insertCard();

// **************************************************
// **************************************************
// **************************************************
// **************************************************
// **************************************************
// Début de la galère à partir d'ici

// **************************************************
// Messages pour utilisateurs
// **************************************************

// Message de confirmation
const successMessage = () => {
    if (window.confirm("Article(s) ajouté(s) au panier. \nOK pour rester sur cette page ANNULER pour accéder au panier.")) {
        location.reload;
    } else {
        window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
    }
};

// Messages d'erreur selon la situation
const invalidInput = "Veuillez choisir une couleur et/ou une quantité valide.";

const maxInput = "Quantité max du même article : 100.";



// *************************************************
// Envoi du formulaire
// *************************************************

const addToCartBtn = document.getElementById('addToCart');

// Attribut required pour les inputs
document.getElementById('colors').required = true;
document.getElementById('quantity').required = true;

// Déclencher l'ajout au clic sur "Ajouter au panier"
addToCartBtn.addEventListener("click", (event) => {
    // Empêcher la réactualisation de la page lors du clic
    event.preventDefault();

    // Récupérer la valeur de la couleur/quantité choisie
    const inputColor = document.getElementById('colors').value;
    const inputQuantity = document.getElementById('quantity').value;

    // Stocker les 3 valeurs dans un objet
    const itemDetails = {
        itemId: productId,
        itemColor: inputColor,
        itemQuantity: inputQuantity
    };

    // parse => contenu du panier lisible en JS
    const cart = JSON.parse(localStorage.getItem('product'));

    // Fonction : Stocker les valeurs dans le panier
    const addToCart = () => {
        // Push le produit dans le panier
        cart.push(itemDetails);

        // stringify => contenu du panier accepté par le localStorage
        localStorage.setItem("product", JSON.stringify(cart));
    };

    // SI : la quantité est <=0 ou >100 ou négative ou pas de couleur sélectionnée...
    if (inputQuantity == 0 || inputQuantity > 100 || Math.sign(-1) || inputColor == "") {
        // ... envoyer ce message pour forcer la correction
        alert(invalidInput);
        return;

        // séparer les alertes
    }
    // SINON : les inputs ont un format correct...
    else if (!inputQuantity == 0 || !inputQuantity > 100 || !Math.sign(-1) || !inputColor == "") {
        // SI : le client n'a pas de panier...
        if (!cart) {
            // ... créer le panier...
            cart = [];
            // ... ajouter le produit au panier
            addToCart();
            successMessage();

        }
    }

    // SI : Client a un panier...
    else if (cart) {
        // Comparaison du panier et du nouvel ajout
        const alreadyInCart = cart.find(
            (product) =>
                product.itemId === productId &&
                product.itemColor === inputColor
        );
        // SI : vérifier si id et color identiques déjà dans le panier...
        if (alreadyInCart) {
            // Somme des deux quantités
            const newQuantity = Number(itemQuantity) + Number(inputQuantity);
            // ... vérifier si la somme des quantités est sup à 100
            if (newQuantity > 100) {
                // Si true : forcer la correction ou l'abandon
                alert(maxInput);
                return;
            }
            else {
                // Si false : somme des deux quantités remplace ancienne
                alreadyInCart.itemQuantity = newQuantity
                // informations sont converti avec stringify
                localStorage.setItem("product", JSON.stringify(cart));
                // Message de confirmation
                successMessage();
            }
        }
        // SI : id et color ne sont pas identiques...
        else {
            // ... ajouter le produit au panier
            addToCart();
        }
    }
});
