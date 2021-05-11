import { getProductFromStorage, updateCountInfo } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("cartPage")) return;

    /* ----- Variables and constants ----- */
    const cart = [];
    const cartList = document.querySelector(".cartList");
    const cartTotalValue = document.getElementById("cartTotalValue");

    const observer = new MutationObserver(function () {
        const deleteButtons = document.querySelectorAll(".fa-trash-alt");
        observer.disconnect();
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", deleteProduct);
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    /* ---------- */
    loadCart();

    /* ----- Function ------- */
    function loadCart() {
        groupProductsInCart();
        cart.forEach((product) => addToCartList(product));
        updateCountInfo();
        updateTotalInfo();
    }

    function groupProductsInCart() {
        const products = getProductFromStorage();
        products.reduce(function (res, value) {
            if (!res[value.id]) {
                res[value.id] = { id: value.id, qty: 0, name: value.name, price: value.price, imgSrc: value.imgSrc };
                cart.push(res[value.id]);
            }
            res[value.id].qty += value.qty;
            return res;
        }, {});
    }

    function addToCartList(product) {
        const cartItem = document.createElement("div");
        cartItem.classList.add("product");
        cartItem.dataset.id = product.id;
        cartItem.innerHTML = `<img class="productImage" src="${product.imgSrc}" alt="">
                                <div class="description">
                                    <h3 class="productName">${product.name}</h3>
                                    <i class="delete fas fa-trash-alt"></i>
                                    <div class="price">
                                        <p>Quantité : ${product.qty}</p>
                                        <p>Prix : <span class="productPrice">${product.price}</span></p>
                                    </div>
                                </div>`;
        cartList.appendChild(cartItem);
    }

    function updateTotalInfo() {
        const cartInfo = findTotalInfo();
        updateCountInfo();
        cartTotalValue.textContent = cartInfo.total;
    }

    function findTotalInfo() {
        const products = getProductFromStorage();
        let total = products.reduce((acc, product) => {
            let price = parseFloat(product.price);
            return (acc += price);
        }, 0);
        return {
            total: total.toFixed(2),
        };
    }

    function deleteProduct(e) {
        const cartItem = e.target.closest(".product");
        cartItem.remove();

        const products = getProductFromStorage();
        let updatedProducts = products.filter((product) => {
            return product.id !== cartItem.dataset.id;
        });

        localStorage.setItem("products", JSON.stringify(updatedProducts));

        groupProductsInCart();
        updateCountInfo();
        updateTotalInfo();
    }
});
