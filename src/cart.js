import { getProductFromStorage, updateCountInfo } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("cartPage")) return;
    console.log("Page chargée");

    /* ----- Variables and constants ----- */
    const cartList = document.querySelector(".cartList");
    const cartTotalValue = document.getElementById("cartTotalValue");
    //let cartItemID = 1;
    let cart = [];

    /* ----- Event Listeners ----- */
    loadCart();

    cartList.addEventListener("click", deleteProduct);

    /* ----- Function ------- */
    function updateTotalInfo() {
        let cartInfo = findTotalInfo();
        updateCountInfo();
        cartTotalValue.textContent = cartInfo.total;
    }

    function addToCartList(product) {
        const cartItem = document.createElement("div");
        console.log(cartItem);
        cartItem.classList.add("product");
        cartItem.setAttribute("data-id", `${product.id}`);
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

    function loadCart() {
        let products = getProductFromStorage();
        console.log(products);
        /*if (products.length < 1) {
            cartItemID = 1;
        } else {
            cartItemID = products[products.length - 1].id;
            cartItemID++;
        }*/
        /*let results = products.reduce(function (results, product) {
            (results[product._id] = results[product._id] || []).push(product);
            return results;
        }, {});*/

        products.reduce(function (res, value) {
            if (!res[value._id]) {
                res[value._id] = { _id: value._id, qty: 0, name: value.name, price: value.price, imgSrc: value.imgSrc };
                cart.push(res[value._id]);
            }
            res[value._id].qty += value.qty;
            return res;
        }, {});

        console.log(cart);
        console.log(products);
        cart.forEach((product) => addToCartList(product));
        updateCountInfo();
        updateTotalInfo();
    }

    function findTotalInfo() {
        let products = getProductFromStorage();
        let total = products.reduce((acc, product) => {
            let price = parseFloat(product.price);
            return (acc += price);
        }, 0);
        return {
            total: total.toFixed(2),
        };
    }

    function deleteProduct(e) {
        let cartItem;
        if (e.target.tagName === "I") {
            cartItem = e.target.closest(".product");
            cartItem.remove();
        }

        let products = getProductFromStorage();
        let updatedProducts = products.filter((product) => {
            return product.id !== parseInt(cartItem.dataset.id);
        });

        localStorage.setItem("products", JSON.stringify(updatedProducts));
        updateCountInfo();
        updateTotalInfo();
    }

    /*// Event Listener on add to cart button
        const observer = new MutationObserver(function () {
        const addProducts = document.querySelectorAll(".addCart");
        console.log(addProducts);
        observer.disconnect();

        for (let i = 0; i < addProducts.length; i++) {
            addProducts[i].addEventListener("click", () => {
                console.log("Added to cart");
            });
        }
    });*/

    /* // Start observing
    observer.observe(document.body, {
        //document.body is node target to observe
        childList: true, //This is a must have for the observer with subtree
        subtree: true, //Set to true if changes must also be observed in descendants.
    });

    // Remove product from cart
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        const button = removeCartItemButtons[i];
        button.addEventListener("click", function (event) {
            let buttonClicked = event.target;
            buttonClicked.closest(".product").remove();
            updateTotalPrice();
        });
    }*/

    /*-------------- Function ----------------*/

    /* function updateTotalPrice() {
        const items = productContainer.getElementsByClassName("product");
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            const priceElement = item.getElementsByClassName("productPrice")[0];
            let price = parseFloat(priceElement.innerHTML.replace("€", ""));
            total = total + price;
            console.log(total);
        }
        document.getElementsByClassName("total")[0].innerHTML = total + "€";
    }

    updateTotalPrice();*/
});
