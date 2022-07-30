/*Essai 6 FONCTIONNE ! Ne pas toucher avant d'avoir l'avis de Delphine !*/


const itemSection = document.getElementById("items");

// Récupération des data de l'API
const fetchData = async () => {
    // Prendre l'API
    const response = await fetch('http://localhost:3000/api/products');

    // Mettre le contenu de l'API dans .json
    const data = await response.json();

    return data;
};

// Récupérer des data d'un produit à la fois
async function fetchEachProduct() {
    // Produits = résultat du fetch précédent
    products = await fetchData();
    let product = {};
    // Création d'une carte pour chaque Id dans l'API
    for (product in products) {
        const productLink = insertProductCard(products[product])
        itemSection.appendChild(productLink)
    }
};

fetchEachProduct();


/*Création et insertion des cartes
dans la page d'accueil*/

function insertProductCard(product) {

    let productLink = document.createElement('a');
    // Ne pas oublier les guillemets inversés ici
    // Trouver le bon href
    // productLink.href = window.location.href + `/${product._id}`;
    // productLink.href = `http://localhost:3000/api/products/${id}`
    productLink.href = 'product.html?id=' + product._id;
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

    return productLink
};

insertProductCard();


