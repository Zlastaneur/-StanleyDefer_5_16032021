// Converts price
const cartCountInfo = document.getElementById("cartCount");
//let cartItemID = 1;

export function price(price) {
    return `${price / 100}€`;
}

export function purchaseProduct(e) {
    let product = e.target.closest(".item");
    getProductInfo(product);
}

export function getProductInfo(product) {
    let productInfo = {
        //id: cartItemID,
        qty: 1,
        _id: product.querySelector(".cardText h3").id,
        imgSrc: product.querySelector(".item img").src,
        name: product.querySelector(".cardName").textContent,
        price: product.querySelector(".cardPrice").textContent,
    };

    //cartItemID++;
    if (document.getElementById("cartPage")) {
        addToCartList(productInfo);
    }
    saveProductInStorage(productInfo);
}

export function saveProductInStorage(item) {
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem("products", JSON.stringify(products));
    updateCountInfo();
}

export function getProductFromStorage() {
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
}

export function updateCountInfo() {
    let countInfo = findCountInfo();
    cartCountInfo.textContent = countInfo.productCount;
}

export function findCountInfo() {
    let products = getProductFromStorage();
    return {
        productCount: products.length,
    };
}
