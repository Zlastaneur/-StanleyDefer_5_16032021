import { getProductFromStorage, updateCountInfo, APIurl, saveProductInStorage } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("cartPage")) return;

    /* ----- Variables and constants ----- */
    const cart = [];
    const cartList = document.querySelector(".cartList");
    const cartTotalValue = document.getElementById("cartTotalValue");
    const form = document.getElementById("form");
    //---
    const observerDelete = new MutationObserver(function () {
        const deleteButtons = document.querySelectorAll(".fa-trash-alt");
        observerDelete.disconnect();
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", deleteProduct);
        }
    });
    observerDelete.observe(document.body, {
        childList: true,
        subtree: true,
    });
    //---
    const observerMinus = new MutationObserver(function () {
        const minusBtn = document.querySelectorAll(".minus");
        observerMinus.disconnect();
        for (let i = 0; i < minusBtn.length; i++) {
            minusBtn[i].addEventListener("click", minusQty);
        }
    });

    observerMinus.observe(document.body, {
        childList: true,
        subtree: true,
    });
    //---
    const observerPlus = new MutationObserver(function () {
        const plusBtn = document.querySelectorAll(".plus");
        observerPlus.disconnect();
        for (let i = 0; i < plusBtn.length; i++) {
            plusBtn[i].addEventListener("click", plusQty);
        }
    });

    observerPlus.observe(document.body, {
        childList: true,
        subtree: true,
    });

    /* ---------- */
    loadCart();

    /* ----- Function ------- */
    function loadCart() {
        checkProductInCart();
        groupProductsInCart();
        displayProducts();
        updateCountInfo();
        updateTotalInfo();
    }

    function displayProducts() {
        cart.forEach((product) => addToCartList(product));
    }

    function checkProductInCart() {
        const products = getProductFromStorage();

        if (products.length == 0) {
            document.querySelector("#cart").style.display = "none";
            document.querySelector(".shoppingCart").style.visibility = "hidden";
            document.querySelector("#emptyCart").style.display = "flex";
        }

        if (products.length > 0) {
            document.querySelector("#emptyCart").style.display = "none";
        }
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
                                <a href="../product/?id=${product.id}" class="shoppingCart">
                                <h3 class="productName" id="${product.id}">${product.name}</h3>
                                </a>
                                    <i class="delete fas fa-trash-alt"></i>
                                    <div class="priceQty">
                                        <p class="quantity"><button class="button quantityBtn minus">-</button>Quantité :<span id="quantityNbr">${product.qty}</span><button class="button quantityBtn plus">+</button></p>
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
        const total = products.reduce((acc, product) => {
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
        const updatedProducts = products.filter((product) => {
            return product.id !== cartItem.dataset.id;
        });
        if (updatedProducts == 0) {
            localStorage.removeItem("products");
        } else {
            localStorage.setItem("products", JSON.stringify(updatedProducts));
        }

        checkProductInCart();
        groupProductsInCart();
        updateCountInfo();
        updateTotalInfo();
    }

    function minusQty(e) {
        const item = e.target.closest(".product");
        const products = getProductFromStorage();
        const currentId = item.dataset.id;
        const findIndex = products.findIndex((obj) => obj.id === currentId);

        if (findIndex >= 0) products.splice(findIndex, 1);

        const wantedProducts = products;

        localStorage.setItem("products", JSON.stringify(wantedProducts));
        checkProductInCart();
        updateTotalInfo();
        updateQty(e);
    }

    function plusQty(e) {
        const product = e.target.closest(".product");
        const productInfo = {
            qty: 1,
            id: product.querySelector(".description h3").id,
            imgSrc: product.querySelector(".product img").src,
            name: product.querySelector(".productName").textContent,
            price: product.querySelector(".productPrice").textContent,
        };
        saveProductInStorage(productInfo);
        updateTotalInfo();
        updateQty(e);
    }

    function updateQty(e) {
        const item = e.target.closest(".product");
        const qty = item.querySelector("#quantityNbr");
        const products = getProductFromStorage();
        const wantedProducts = products.filter((product) => {
            return product.id === item.dataset.id;
        });

        const total = wantedProducts.length.toString();

        qty.textContent = total;

        if (qty.innerHTML == "0") item.remove();
    }

    /* ------- Form ------- */

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendOrder();
    });

    verifyValidity(document.getElementById("firstname"), (e) => e.target.value.length > 1);
    verifyValidity(document.getElementById("lastname"), (e) => e.target.value.length > 1);
    verifyValidity(document.getElementById("email"), (e) => {
        const emailRegex =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return emailRegex.test(e.target.value);
    });
    verifyValidity(document.getElementById("address"), (e) => e.target.value.length > 8);
    verifyValidity(document.getElementById("city"), (e) => e.target.value.length > 1);

    function verifyValidity(elt, condition) {
        elt.oninput = (e) => {
            if (condition(e)) {
                validInputElt(e.target);
            } else {
                neutralInputElt(e.target);
            }
        };

        elt.onblur = (e) => {
            if (!condition(e)) {
                invalidInputElt(e.target);
            }
        };
    }

    function validInputElt(elt) {
        elt.style.borderBottom = "solid 1px green";
    }

    function neutralInputElt(elt) {
        elt.style.borderBottom = "";
    }

    function invalidInputElt(elt) {
        elt.style.borderBottom = "solid 1px red";
    }
});

function sendOrder() {
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const emailRegex =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (
        !(
            firstName.length > 1 &&
            lastName.length > 1 &&
            emailRegex.test(email) &&
            address.length > 8 &&
            city.length > 1
        )
    ) {
        alert("Champs incorrects, merci de remplir correctement le formulaire");
        return;
    }

    const items = getProductFromStorage();

    const order = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email,
        },
        products: [],
    };

    items.forEach((item) => order.products.push(item.id));

    const postOptions = {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
    };

    fetch(`${APIurl}/order`, postOptions)
        .then((response) => response.json())
        .then((json) => {
            const orderTotal = cartTotalValue.textContent;
            const orderId = json.orderId;
            document.querySelector("input[name = 'orderTotal']").value = orderTotal;
            document.querySelector("input[name = 'orderId']").value = orderId;
            localStorage.removeItem("products");
            //window.location.href = `./../confirmation/index.html?orderId=${json.orderId}&orderTotal=${cartTotalValue.textContent}`;
            form.submit();
        })
        .catch(() => {
            alert(error);
        });
}
