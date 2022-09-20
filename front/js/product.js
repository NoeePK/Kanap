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

    // // Valeurs négatives
    // document.getElementById('quantity').setAttribute('inputmode', "numeric");
    // document.getElementById('quantity').setAttribute('pattern', "[1-100]*");

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

if (addToCartBtn) {

    // Déclencher l'ajout au clic sur "Ajouter au panier"
    addToCartBtn.addEventListener("click", () => {

        // ************************************************
        // Création du Panier
        // ************************************************

        // parse => contenu du panier lisible en JS
        let cart = JSON.parse(localStorage.getItem('product'));

        // Fonction : Stocker les valeurs dans le panier
        const addToCart = (cart, itemDetails) => {
            // Push le produit dans le panier
            cart.push(itemDetails);

            // stringify => contenu du panier accepté par le localStorage
            localStorage.setItem("product", JSON.stringify(cart));
        };

        // **************************************************
        // Message pour utilisateurs
        // **************************************************

        const successMessage = () => {
            if (window.confirm("Article(s) ajouté(s) au panier. \nOK pour rester sur cette page ANNULER pour accéder au panier.")) {
                location.reload();
            } else {
                window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
            }
        };

        // ************************************************
        // Récupération des inputs valides
        // ************************************************

        const processAdding = () => {
            // Récupérer la valeur des inputs
            const inputColor = document.getElementById('colors').value;
            const inputQuantity = document.getElementById('quantity').value;

            // Stocker les 3 valeurs dans un objet
            const itemDetails = {
                itemId: productId,
                itemColor: inputColor,
                itemQuantity: Number(inputQuantity)
            };

            // *************************************************
            // Vérification des inputs
            // *************************************************

            // Inputs valides
            if (!(inputColor == "" || inputQuantity == "" || inputQuantity == 0 || inputQuantity > 100)) {
                // Panier existe déjà
                if (cart) {
                    // Comparaison du panier et du nouvel ajout
                    const alreadyInCart = cart.find(
                        (product) =>
                            product.itemId === productId &&
                            product.itemColor === inputColor
                    );
                    // Produit(couleur aussi) identique déjà dans panier
                    if (alreadyInCart) {
                        // Somme des deux quantités
                        const newQuantity = Number(alreadyInCart.itemQuantity) + Number(inputQuantity);

                        // Somme des old et new quantité < 100
                        if (newQuantity <= 100) {
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
            }

            // Input couleur vide
            if (inputColor == "") {
                alert("Veuillez choisir une couleur.");
                return;
            }

            // Input quantité vide
            if (inputQuantity == "" || inputQuantity == 0) {
                alert("Veuillez choisir une quantité.");
                return;
            }

            // Input quantité > 100
            if (inputQuantity > 100) {
                alert("Vous ne pouvez pas acheter plus de 100 exemplaires du même produit.");
                return;
            }

            // // Input quantité négatif
            // if (!(Number.isInteger(inputQuantity))) {
            //     alert("Vous ne pouvez pas acheter une quantité négative d'un produit");
            //     return;
            // }

        };

        processAdding();
    });
}

insertCard();

