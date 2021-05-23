import { price, updateCountInfo, APIurl } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("homepage")) return;

    const spinner = document.getElementById("spinner");

    updateCountInfo();

    // Array of images
    let images = [
        "public/img/car.jpg",
        "public/img/newYork.jpg",
        "public/img/paris.jpg",
        "public/img/photographer.jpg",
    ];

    // Search for the API data
    fetch(`${APIurl}`)
        .then((res) => res.json())
        .then((data) => {
            hideSpinner();
            injectHtml(data);
        })
        .catch((err) => console.error(err));

    function hideSpinner() {
        spinner.remove();
    }

    // Add the html in the page
    function injectHtml(data) {
        const listProducts = document.querySelector("#productList .container");
        data.forEach((product, index) => {
            function productHTML() {
                listProducts.innerHTML += ` 
        <div class="card item" id="${product._id}">
            <img class="cardImage" src="${product.imageUrl}" alt="${product.name}"/>
            <div class="cardText">
                <h3 class="cardName" id="${product._id}">${product.name}</h3>
                <p>${product.description}</p>
                <p><strong class="cardPrice">${price(product.price)}</strong></p>
                <div class="action">
                    <a href="product/?id=${product._id}" class="button seeMore"> 
                            Voir plus
                    </a>
                    <button class="button addCart">
                        <span class="addToCart">Ajouter au panier</span>
                        <img class="shoppingCart" src="./public/img/shopping-cart.svg" />
                        <span class="addedToCart">Produit ajouté</span>
                        <img class="faShoppingCart" src="./public/img/shopping-cart.svg" />
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
            </div>
        </div> `;
            }
            if (index >= 0 && index < 4) {
                productHTML();
                listProducts.innerHTML += `<img src=' ${images[index]} ' class='bigCard'></img>`;
            } else {
                productHTML();
            }
        });
    }
});
