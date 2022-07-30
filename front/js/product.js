// Essai numéro 4

// PAS TOUCHE ! Ca fonctionne !
// Récupérer l'id dans l'url :

const productPageURL = window.location.href;
const url = new URL(productPageURL);
const productId = url.searchParams.get("id");

console.log(productPageURL);
console.log(productId);

// ************************************************

// Essai avec try et catch
// Récupération des data de l'API
const fetchData = async (productId) => {
    try {
        // Prendre l'API
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        // Mettre le contenu de l'API dans .json
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

// Essai avec try et catch
// Récupérer le produit grâce à l'id :
const fetchTheProduct = async () => {
    try {
    return fetchData(productId).then(insertSingleCard(products));
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

// Trouver pourquoi la promise est pending
const product = fetchTheProduct();
console.log(product);

// ************************************************

const imgDiv = document.querySelector('.item__img');

/*Essai 2 : Création et insertion d'une seule carte dans la page produit*/
const insertSingleCard = async (product) => {
    // Div : item__img
    let productImg = document.createElement('img');
    productImg.src = product.imageUrl;
    productImg.alt = product.altTxt;
    imgDiv.appendChild(productImg);

    // Div : item__content__titlePrice
    document.getElementById('title').innerText = product.name;
    document.getElementById('price').innerText = product.price;

    // Div : item__content__description
    document.getElementById('description').innerText = product.description;

    // // Div : colors et form
    // // Faire une function for comme dans fetchEachProduct
    // for (color in product in products) {
    //     const colorOption = insertSingleCard(products[product[color]])
    //     select.appendChild(colorOption);
    // }

}

insertSingleCard(product);