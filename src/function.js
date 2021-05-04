// Converts price
export function price(price) {
    return `${price / 100}€`;
}

export function purchaseProduct(e) {
    let product = e.target.closest(".item");
    getProductInfo(product);
}

export function getProductInfo(product) {
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector(".item img").src,
        name: product.querySelector(".cardName").textContent,
        price: product.querySelector(".cardPrice").textContent,
    };

    cartItemID++;
    if (document.getElementById("cartPage")) {
        addToCartList(productInfo);
    }
    saveProductInStorage(productInfo);
}

export function saveProductInStorage(item) {
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem("products", JSON.stringify(products));
    updateCartInfo();
}
