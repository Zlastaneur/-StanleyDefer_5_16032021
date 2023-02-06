export const APIurl = "https://backend-production-2f1f.up.railway.app/api/cameras";

// Converts price
export function price(price) {
    return `${price / 100}€`;
}

export function purchaseProduct(e) {
    const product = e.target.closest(".item");
    getProductInfo(product);
}

export function getProductInfo(product) {
    const productInfo = {
        qty: 1,
        id: product.querySelector(".cardText h3").id,
        imgSrc: product.querySelector(".item img").src,
        name: product.querySelector(".cardName").textContent,
        price: product.querySelector(".cardPrice").textContent,
    };

    saveProductInStorage(productInfo);
}

export function saveProductInStorage(item) {
    const products = getProductFromStorage();
    products.push(item);
    localStorage.setItem("products", JSON.stringify(products));
    updateCountInfo();
}

export function getProductFromStorage() {
    return localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];
}

export function updateCountInfo() {
    const cartCountInfo = document.getElementById("cartCount");
    const countInfo = findCountInfo();
    cartCountInfo.textContent = countInfo.productCount;
}

export function findCountInfo() {
    const products = getProductFromStorage();
    return {
        productCount: products.length,
    };
}
