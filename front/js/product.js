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
    } catch (err) {
        console.log("Erreur");
        return null;
    }
};

// ************************************************
// Création de la carte produit
// ************************************************

const createCard = (produit) => {
    // Création de l'image
    let productImg = document.createElement('img');
    productImg.src = produit.imageUrl;
    productImg.alt = produit.altTxt;

    // Insertion de l'image
    const imageDiv = document.getElementsByClassName('item__img');
    imageDiv[0].appendChild(productImg);

    // Insertion nom, prix, description (+ espace avant €)
    document.getElementById('title').innerText = produit.name;
    document.getElementById('price').innerText = produit.price + " ";
    document.getElementById('description').innerText = produit.description;

    // Insertion options des couleurs
    const color = produit.colors;

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
    const data = await fetchProduct(productId);
    // Utiliser la Promise pour insérer la carte (avec .then)
    return fetchProduct().then(createCard(data));
};

// ************************************************
// Bouton : Ajout au panier
// ************************************************

const addToCartBtn = document.getElementById('addToCart');

// Déclencher l'ajout au clic sur "Ajouter au panier"
addToCartBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // ************************************************
    // Création du Panier
    // ************************************************

    // parse => contenu du panier lisible en JS
    const cart = JSON.parse(localStorage.getItem('product'));

    // Fonction : Stocker les valeurs dans le panier
    const addToCart = (cart, itemDetails) => {
        // Push le produit dans le panier
        cart.push(itemDetails);

        // stringify => contenu du panier accepté par le localStorage
        localStorage.setItem("product", JSON.stringify(cart));
    };

    // ************************************************
    // Vérification et ajout des inputs
    // ************************************************

    const processAdding = () => {
        // Récupérer la valeur de la couleur/quantité choisie
        const inputColor = document.getElementById('colors').value;
        const inputQuantity = document.getElementById('quantity').value;

        // Stocker les 3 valeurs dans un objet
        const itemDetails = {
            itemId: productId,
            itemColor: inputColor,
            itemQuantity: inputQuantity
        };

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
        // Vérifications des inputs
        // *************************************************



        // Somme des deux quantités
        const newQuantity = itemQuantity + Number(inputQuantity);

        if (!(inputColor == "" || inputQuantity == "" || inputQuantity == 0 || inputQuantity > 100 || Math.sign(-1))) {
            if (cart) {
                // Comparaison du panier et du nouvel ajout
                const alreadyInCart = cart.find(
                    (product) =>
                        product.itemId === productId &&
                        product.itemColor === inputColor
                );
                if (alreadyInCart) {

                    if (newQuantity < 100) {
                        alreadyInCart.itemQuantity = newQuantity;
                        localStorage.setItem("product", JSON.stringify(cart));
                        successMessage();


                    } else {
                        alert("100 produits identiques maximum");
                        return;
                    }
                } else {
                    addToCart(cart, itemDetails);
                    successMessage();
                }
            } else {
                cart = [];
                addToCart(cart, itemDetails);
                successMessage();
            }
        } else {
            alert("Veuillez remplir les champs avec des valeurs valides");
            return;
        }
    };

    processAdding();
});

insertCard();

