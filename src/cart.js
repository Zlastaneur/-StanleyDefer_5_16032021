import { getProductFromStorage, updateCountInfo, APIurl } from "./function.js";

document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("cartPage")) return;

    /* ----- Variables and constants ----- */
    const cart = [];
    const cartList = document.querySelector(".cartList");
    const cartTotalValue = document.getElementById("cartTotalValue");
    const form = document.getElementById("form");

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

    //submitButton.addEventListener("click", sendOrder);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        sendOrder();
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

    console.log(order);

    const postOptions = {
        method: "POST",
        body: JSON.stringify(order),
        headers: { "Content-Type": "application/json" },
    };

    fetch(`${APIurl}/order`, postOptions)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
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
