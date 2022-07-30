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
const fetchData = async () => {
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

// ************************************************

/*Essai 2 : Création et insertion d'une seule carte dans la page produit*/
const insertSingleCard = async (product) => {
    // Création de l'image
    let productImg = document.createElement('img');
    productImg.src = product.imageUrl; 
    productImg.alt = product.altTxt;
    // productImg.setAttribute('src', product.imageUrl);
    // productImg.setAttribute('alt', product.altTxt);

    // Insertion de <img>
    // Pourquoi l'image apparait deux fois ?
    const imageDiv = document.getElementsByClassName('item__img');
    imageDiv[0].appendChild(productImg);

    // Insertion nom et prix
    document.getElementById('title').innerText = product.name;
    document.getElementById('price').innerText = product.price;

    // Insertion description
    document.getElementById('description').innerText = product.description;

    // // Div : colors et form
    // // Faire une function for comme dans fetchEachProduct
    // for (color in product in products) {
    //     const colorOption = insertSingleCard(products[product[color]])
    //     select.appendChild(colorOption);
    // }

}

let products = {};

// Essai avec try et catch
// Récupérer le produit grâce à l'id :
const fetchTheProduct = async () => {
    products = await fetchData(productId);
    return fetchData(productId).then(insertSingleCard(products));
};

const insertProductPage = async () => {
    const product = await fetchTheProduct();
    insertSingleCard(product);
}

insertProductPage();
