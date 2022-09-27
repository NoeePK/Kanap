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
        // Récupérer le contenu de l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Récupérer la réponse dans .json
        const data = await response.json();
        // Renvoyer le produit
        return data;
    } catch (err) {
        console.log("Erreur");
        return null;
    }
};

// ************************************************
// Créer la carte produit
// ************************************************

const createCard = (produit) => {
    let productImg = document.createElement('img');
    productImg.src = produit.imageUrl;
    productImg.alt = produit.altTxt;
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
};

// ************************************************
// Inserer la carte produit
// ************************************************

const insertCard = async () => {
    // Récupérer le bon produit dans une Promise
    const data = await fetchProduct(productId);
    // Utiliser la réponse de la promesse comme paramètre pour insérer la carte (avec .then)
    return fetchProduct().then(createCard(data));
};

// ************************************************
// Ajouter au panier
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

        // Empêcher la saisie d'une quantité négative
        const noNegativRegex = /^[0-9]*[1-9][0-9]*$/;

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

            // SI : Inputs valides
            if (!(inputColor == "" || inputQuantity == "" || inputQuantity == 0 ||
                inputQuantity > 100 || (noNegativRegex.test(inputQuantity) == false))) {
                // SI : Panier existe déjà
                if (cart) {
                    // Comparaison du panier et du nouvel ajout
                    const alreadyInCart = cart.find(
                        (product) =>
                            product.itemId === productId &&
                            product.itemColor === inputColor
                    );
                    // SI : Produit(couleur aussi) identique déjà dans panier
                    if (alreadyInCart) {
                        // Somme des deux quantités
                        const newQuantity = Number(alreadyInCart.itemQuantity) + Number(inputQuantity);
                        // SI : Somme des quantités < 100
                        if (newQuantity <= 100) {
                            alreadyInCart.itemQuantity = newQuantity;
                            localStorage.setItem("product", JSON.stringify(cart));
                            successMessage();
                        }
                        // SINON : Somme des quantité > 100
                        else {
                            alert("100 produits identiques maximum");
                            return;
                        }
                    }
                    // SINON : Ce produit n'est pas encore dans le panier
                    else {
                        addToCart(cart, itemDetails);
                        successMessage();
                    }
                }
                // SINON : Panier n'existe pas 
                else {
                    cart = [];
                    addToCart(cart, itemDetails);
                    successMessage();
                }
            }

            // Input couleur et/ou quantité vide
            if (inputColor == "" || inputQuantity == "" || inputQuantity == 0) {
                alert("Veuillez sélectionner une couleur ET une quantité pour procéder à l'ajout au panier.");
                return;
            }

            // Input quantité > 100
            if (inputQuantity > 100) {
                alert("Vous ne pouvez pas commander plus de 100 exemplaires du même produit.");
                return;
            }

            // Input quantité négatif
            if (noNegativRegex.test(inputQuantity) == false) {
                alert("Vous ne pouvez pas acheter une quantité négative d'un produit");
                return;
            }

        };

        
        processAdding();
    });
}

insertCard();

