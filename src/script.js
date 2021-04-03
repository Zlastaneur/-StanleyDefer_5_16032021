document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");
    let images = [
        "../public/img/car.jpg",
        "../public/img/newYork.jpg",
        "../public/img/paris.jpg",
        "../public/img/photographer.jpg"
    ];

    window.addEventListener("scroll", () => {
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    fetch("https://orinoco-backend-p5.herokuapp.com/api/cameras")
        .then((res) => res.json())
        .then((data) => injectHtml(data))
        .catch((err) => console.error(err));

    function injectHtml(data) {
        const listProducts = document.querySelector("#productList .container");
        data.forEach((product, index) => {
            if (index >= 0 && index < 4) {
                listProducts.innerHTML += ` 
                <div class="card">
                    <img class="cardImage" src="${product.imageUrl}" alt="${product.name}"/>
                    <div class="cardText">
                        <h3>${product.name}</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                        <p><strong>${product.price / 100}€</strong></p>
                        <div class="action">
                            <button class="button seeMore">
                                Voir le produit
                            </button>
                            <button class="button addCart">
                                <img src="./public/img/shopping-cart.svg" />
                            </button>
                        </div>
                    </div>
                </div> `;
            listProducts.innerHTML += `<img src=' ${images[index]} ' class='bigCard'></img>`; 
            }
            
            else {
                listProducts.innerHTML += ` 
                <div class="card">
                    <img class="cardImage" src="${product.imageUrl}" alt="${product.name}"/>
                    <div class="cardText">
                        <h3>${product.name}</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                        <p><strong>${product.price / 100}€</strong></p>
                        <div class="action">
                            <button class="button seeMore">
                                Voir le produit
                            </button>
                            <button class="button addCart">
                                <img src="./public/img/shopping-cart.svg" />
                            </button>
                        </div>
                    </div>
                </div> `;
            }
        });
    }
});
