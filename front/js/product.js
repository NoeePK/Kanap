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

    // Attribut required pour les inputs
    document.getElementById('colors').required = true;
    document.getElementById('quantity').required = true;
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
// Message pour utilisateurs
// **************************************************

const successMessage = () => {
    if (window.confirm("Article(s) ajouté(s) au panier. \nOK pour rester sur cette page ANNULER pour accéder au panier.")) {
        location.reload;
    } else {
        window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
    }
};

// *************************************************
// Envoi du formulaire
// *************************************************

const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur "Ajouter au panier"
addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // parse => contenu du panier lisible en JS
    const cart = JSON.parse(localStorage.getItem('product'));

    // Récupérer la valeur de la couleur/quantité choisie
    const inputColor = document.getElementById('colors').value;
    const inputQuantity = document.getElementById('quantity').value;

    // Stocker les 3 valeurs dans un objet
    const itemDetails = {
        itemId: productId,
        itemColor: inputColor,
        itemQuantity: inputQuantity
    };

    // Fonction : Stocker les valeurs dans le panier
    const addToCart = () => {
        // Push le produit dans le panier
        cart.push(itemDetails);

        // stringify => contenu du panier accepté par le localStorage
        localStorage.setItem("product", JSON.stringify(cart));
    };

    // *************************************************
    // Vérifications des inputs
    // *************************************************

    // SI : les inputs sont vides ou incorrects...
    if (!inputColor) {
        alert("Veuillez sélectionner une couleur.")
        return
    };

    if (!inputQuantity || inputQuantity == 0) {
        alert("Veuillez sélectionner une quantité.")
        return
    };

    if (inputQuantity > 100 || Math.sign(-1)) {
        alert("Veuillez sélectionner une quantité valide.");
        return
    }
    else if (cart) {
        // Comparaison du panier et du nouvel ajout
        const alreadyInCart = cart.find(
            (product) =>
                product.itemId === productId &&
                product.itemColor === inputColor
        );
        if (!alreadyInCart) {
            // ... ajouter le produit au panier
            addToCart();
            successMessage();
        }
        else {
            // Somme des deux quantités
            const newQuantity = Number(itemQuantity) + Number(inputQuantity);
            // SINON : Somme des quantités < 100
            if (newQuantity < 100) {
                // Somme des deux quantités remplace ancienne
                alreadyInCart.itemQuantity = newQuantity
                // stringify et ajout au panier
                localStorage.setItem("product", JSON.stringify(cart));
                successMessage();
            }
            // SINON : Somme des quantités > 100...
            else {
                // forcer la correction
                alert("Quantité max du même article : 100.");
                return;
            }
        }
    }
    // SI : le client n'a pas de panier...
    else {
        // ... créer le panier...
        cart =[];
        // ... ajouter le produit au panier
        addToCart();
        successMessage();
    }
})
