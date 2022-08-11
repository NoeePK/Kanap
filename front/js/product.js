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
    })
};

// ************************************************
// Insertion de la carte produit
// ************************************************

const insertCard = async () => {
    // Récupérer le bon produit dans une Promise
    let product = await fetchProduct();
    createCard(product);

    // *************************************************
    // Envoi du formulaire
    // *************************************************

    const addToCartBtn = document.getElementById('addToCart');

    // Attribut required pour les inputs
    document.getElementById('colors').required = true;
    document.getElementById('quantity').required = true;


    // Déclencher l'ajout au clic
    addToCartBtn.addEventListener("click", (event) => {
        // Empêcher la réactualisation de la page lors du clic
        event.preventDefault();

        // *********************************************
        // Récupérer les inputs
        // *********************************************

        // Récupérer la valeur de la couleur/quantité choisie
        const inputColor = document.getElementById('colors').value;
        const inputQuantity = document.getElementById('quantity').value;

        // Stocker les 3 valeurs dans un objet
        const itemDetails = {
            id: productId,
            color: inputColor,
            quantity: inputQuantity
        };

        console.log(itemDetails);

        // **************************************************
        // Correction des inputs
        // **************************************************

        // Messages possibles selon la situation
        const invalidInput = "Veuillez choisir une couleur et une quantité valide. \nOK pour modifier, ANNULER pour accéder au panier sans modifier.";

        const maxInput = "Nombre maximum du même article atteint. \nOK pour modifier, ANNULER pour accéder au panier sans modifier.";

        const validInput = "Article(s) ajouté(s) au panier. \nOK pour rester sur cette page ANNULER pour accéder au panier.";

        // Message d'erreur ou de confirmation
        const confirmMessage = (message) => {
            if (window.confirm(message)) {
                location.reload;
            }
            else {
                window.location.href = "cart.html";
            }
        };

        // **********************************************
        // Création du panier dans le localStorage
        // *******************************************

        // Utiliser parse pour rendre le contenu lisible en JS
        let cart = JSON.parse(localStorage.getItem('product'));

        // ************************************************
        // Fonction : Ajout au panier
        // ************************************************

        // Stocker les valeurs dans le panier
        const addToCart = async () => {
            // Push le produit dans le panier
            cart.push(itemDetails);

            // Utiliser stringify avant de mettre dans le localStorage
            localStorage.setItem("product", JSON.stringify(cart));
        };

        // ****************************************************
        // Validation du formulaire
        // ****************************************************

        function validateForm() {

            // SI : la quantité est =0 ou >100 ou négative, et pas de couleur sélectionnée...
            if (inputQuantity <= 0 || inputQuantity > 100 || Math.sign(-1) || inputColor == "") {
                // ... envoyer ce message pour forcer la correction

                confirmMessage(invalidInput);
            };

            // Comparaison du panier et du nouvel ajout
            const alreadyInCart = cart.id === productId && cart.color === inputColor;
            // Somme des deux quantités
            const newQuantity = cart.quantity += inputQuantity;

            // SI : id et color identiques déjà dans le panier...
            if (alreadyInCart) {
                // ... vérifier si la somme des quantités est sup à 100
                if (newQuantity > 100) {
                    // Si true : forcer la correction ou l'abandon
                    confirmMessage(maxInput);
                }
                else {
                    // Si false : additionner les deux quantités
                    newQuantity;
                    confirmMessage(validInput);
                }
            };

            // SI : Client a déjà un panier (sans doublon)...
            if (cart) {
                // ... ajouter le produit au panier
                addToCart();
                // Confirmer l'ajout
                confirmMessage(validInput);
            }
            // SI : Client n'a pas de panier...
            else {
                // Créer le panier...
                cart = [];
                // ... ajouter le produit au panier
                addToCart();
                // Confirmer l'ajout
                confirmMessage(validInput);
            };
        };

        validateForm();
    });


};

insertCard();