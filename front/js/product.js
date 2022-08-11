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

// **************************************************
// Messages pour utilisations
// **************************************************

// Message de confirmation
const successMessage = () => {
    if (window.confirm("Article(s) ajouté(s) au panier. \nOK pour rester sur cette page ANNULER pour accéder au panier.")) {
        location.reload;
    } else {
        window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
    }
};

// Messages possibles selon la situation
const invalidInput = "Veuillez choisir une couleur et une quantité valide. \nOK pour modifier, ANNULER pour accéder au panier sans ajouter.";

const maxInput = "Nombre maximum du même article atteint. \nOK pour modifier, ANNULER pour accéder au panier sans ajouter.";

// Message d'erreur
const errorMessage = (message) => {
    if (window.confirm(message)) {
        window.location.href;
    } else {
        window.location.href = "http://127.0.0.1:5500/front/html/cart.html";
    }
};

// ************************************************
// Insertion de la carte produit
// ************************************************

const insertCard = async () => {
    // Récupérer le bon produit dans une Promise
    let data = await fetchProduct();
    createCard(data);

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

        // Processus d'ajout du produit dans le panier
        const processAddition = () => {

            // *********************************************
            // Récupérer les inputs
            // *********************************************

            // Récupérer la valeur de la couleur/quantité choisie
            const inputColor = document.getElementById('colors').value;
            const inputQuantity = document.getElementById('quantity').value;

            // Stocker les 3 valeurs dans un objet
            const itemDetails = {
                itemId: productId,
                itemColor: inputColor,
                itemQuantity: inputQuantity
            };

            console.log(itemDetails);

            // parse => contenu du panier lisible en JS
            // Essai avec ou || pour que le cart soit reconnu
            const cart = JSON.parse(localStorage.getItem('product')) || [];

            // ************************************************
            // Fonction : Ajout au panier
            // ************************************************

            // Stocker les valeurs dans le panier
            const addToCart = () => {
                // Push le produit dans le panier
                cart.push(itemDetails);

                console.log('details qui ont été push' + ':' + cart.push(itemDetails));
                console.log('contenu de cart' + ':' + cart);

                // stringify => contenu du panier accepté par le localStorage
                localStorage.setItem("product", JSON.stringify(cart));

                // Confirmer ajout et proposer destinations
                successMessage();
            };

            // ****************************************************
            // Validation du formulaire
            // ****************************************************

            // SI : la quantité est <=0 ou >100 ou négative ou pas de couleur sélectionnée...
            if (inputQuantity <= 0 || inputQuantity > 100 || Math.sign(-1) || inputColor == "") {
                // ... envoyer ce message pour forcer la correction
                errorMessage(invalidInput);
                // Empêcher l'ajout au panier !!!!
            }

            // Essai 6 : id n'est pas reconnu. Changer de méthode pour comparer le panier.
            // Essai avec .find()

            // SI : Client a un panier...
            if (cart) {
                // Comparaison du panier et du nouvel ajout
                const alreadyInCart = cart.find(
                    (product) =>
                        product.itemId === productId &&
                        product.itemColor === inputColor
                );

                // Somme des deux quantités
                const newQuantity = Number(alreadyInCart.itemQuantity) + Number(inputQuantity);

                // SI : id et color identiques déjà dans le panier...
                if (alreadyInCart) {
                    // ... vérifier si la somme des quantités est sup à 100
                    if (newQuantity > 100) {
                        // Si true : forcer la correction ou l'abandon
                        errorMessage(maxInput);
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
            // SI : Client n'a pas de panier...
            else {
                // ... créer le panier...
                cart = [];
                // ... ajouter le produit au panier
                addToCart();
            }
        };
        // Appel du processus d'ajout
        processAddition();
    });

};
insertCard();