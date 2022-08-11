const itemSection = document.getElementById("items");

// Récupération des produits de l'API
const fetchEachProduct = async () => {
    try {
    // Récupérer l'API
    const response = await fetch('http://localhost:3000/api/products');
    // Récupérer les produits dans .json
    const products = await response.json();
    let product = {};
    // Pour chaque produit dans products...
    for (product in products) {
        const productLink = insertCards(products[product]);
        // .... créer une carte dans la section
        itemSection.appendChild(productLink);
    }}
    catch (err) {
        console.log('Démarrez le serveur : node server');
    }
};

fetchEachProduct();

// ************************************************************

/*Création et insertion des cartes
dans la page d'accueil*/

function insertCards(product) {

    let productLink = document.createElement('a');
    // Trouver le bon href
    productLink.href = `./product.html?id=` + product._id;
    itemSection.appendChild(productLink);

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
}

insertCards();