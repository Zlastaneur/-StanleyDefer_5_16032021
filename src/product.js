import { price, updateCountInfo, APIurl } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("productPage")) return;

    updateCountInfo();

    // Search for the id in URL
    function getID() {
        return new URL(window.location.href).searchParams.get("id");
    }

    // Fetch the right product
    fetch(`${APIurl}/${getID()}`)
        .then((res) => res.json())
        .then((data) => injectHtml(data));

    // Add the html in the page
    function injectHtml(product) {
        const detailProduct = document.querySelector("#productDetail");
        detailProduct.innerHTML += ` 
                <div class="horizontalCard item">
                    <img class="cardImage" src="${product.imageUrl}" alt="${product.name}" />
                    <div class="cardText">
                        <h3 class="cardName" id="${product._id}">${product.name}</h3>
                        <select name="cameraLens" class="cameraLens">
                        ${product.lenses.map((lense) => `<option>${lense}</option>`).join(", ")}
                        </select>
                        <p>${product.description}</p>
                        <p><strong class="cardPrice">${price(product.price)}</strong></p>
                        <div class="action">
                            <button class="button addCart">
                                <span class="addToCart">Ajouter au panier</span>
                                <img class="shoppingCart" src="../public/img/shopping-cart.svg" />
                                <span class="addedToCart">Produit ajouté</span>
                                <img class="faShoppingCart" src="../public/img/shopping-cart.svg" />
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
    }
});
