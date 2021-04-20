import "./product.js";
import { price } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("homepage")) return;

    const header = document.querySelector("header");

    // Array of images
    let images = [
        "public/img/car.jpg",
        "public/img/newYork.jpg",
        "public/img/paris.jpg",
        "public/img/photographer.jpg",
    ];

    // Header animation on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Search for the API data
    fetch("https://orinoco-backend-p5.herokuapp.com/api/cameras")
        .then((res) => res.json())
        .then((data) => injectHtml(data))
        .catch((err) => console.error(err));

    // Add the html in the page
    function injectHtml(data) {
        const listProducts = document.querySelector("#productList .container");
        data.forEach((product, index) => {
            function productHTML() {
                listProducts.innerHTML += ` 
                <div class="card">
                    <img class="cardImage" src="${product.imageUrl}" alt="${product.name}"/>
                    <div class="cardText">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>${price(product.price)}</strong></p>
                        <div class="action">
                            <a href="product/?id=${product._id}"> 
                                <button class="button seeMore">
                                        Voir le produit
                                </button>
                            </a>
                            <button class="button addCart">
                                <img src="./public/img/shopping-cart.svg" />
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
