import "./product.js";
import "./cart.js";
import "./home.js";
import "./confirmation.js";
import { purchaseProduct } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");

    // Header animation on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Event Listener on add to cart button
    const observer = new MutationObserver(function () {
        const addProducts = document.querySelectorAll(".addCart");

        addProducts.forEach((button) => {
            button.addEventListener("click", purchaseProduct);
            button.addEventListener("click", cartClick);
        });

        function cartClick() {
            let button = this;
            console.log(button);
            this.classList.add("clicked");

            setTimeout(() => {
                this.classList.remove("clicked");
            }, 2500);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});
