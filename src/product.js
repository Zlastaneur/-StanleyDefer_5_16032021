import { fetchAPI, price } from "./function.js";

if (document.getElementById("productPage")) {
    document.addEventListener("DOMContentLoaded", function () {
        const detailProduct = document.querySelector("#productDetail");
        const API_URL = `https://orinoco-backend-p5.herokuapp.com/api/cameras/${getURL()}`;

        function getURL() {
            return new URL(window.location.href).searchParams.get("id");
        }

        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => injectHtml(data));

        function injectHtml(product) {
            detailProduct.innerHTML += ` 
                <div class="horizontalCard">
                    <img class="cardImage" src="${product.imageUrl}" alt="${product.name}" />
                    <div class="cardText">
                        <h3>${product.name}</h3>
                        <select name="cameraLens" class="cameraLens">
                            <option value="">${product.lenses[0]}</option>
                            <option value="">${product.lenses[1]}</option>
                        </select>
                        <p>${product.description}</p>
                        <p><strong>${price(product.price)}</strong></p>
                        <div class="action">
                            <button class="button addCart">
                                <p>Ajouter au panier</p> <img src="../public/img/shopping-cart.svg" />
                            </button>
                            <div class="quantity">
                                <label for="quantity">Quantité</label>
                                <input type="text" name="quantity">
                            </div>
                        </div>
                    </div>
                </div>`;
        }
    });
}
