// ************************************************
// Récupérer les produits dans l'API
// ************************************************

const fetchEachProduct = async () => {
    try {
        // Récupérer l'API
        const response = await fetch('http://localhost:3000/api/products');
        // Récupérer les produits dans .json
        const products = await response.json();
        let product = {};
        // Pour chaque produit dans l'API...
        for (product in products) {
            // ... créer une carte...
            const productLink = createCards(products[product]);
            // ... et l'insérer dans la section
            document.getElementById("items").appendChild(productLink);
        }
    }
    catch (err) {
        console.log('Démarrez le serveur : node server');
    }
};
 
fetchEachProduct();

// ************************************************
// Création d'une carte produit
// ************************************************

const createCards = (product) => {

    let productLink = document.createElement('a');
    // Trouver le bon href
    productLink.href = `./product.html?id=` + product._id;

    let productArticle = document.createElement('article');

    let productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;
    productArticle.appendChild(productImg);

    let productName = document.createElement('h3');
    productName.classList.add('productName');
    productName.innerText = product.name;
    productArticle.appendChild(productName);

    let productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.innerText = product.description;
    productArticle.appendChild(productDescription);

    productLink.appendChild(productArticle);

    return productLink;
};