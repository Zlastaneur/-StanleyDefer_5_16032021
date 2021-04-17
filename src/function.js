export function price(price) {
    return `${price / 100}€`;
}

export function fetchAPI() {
    fetch("https://orinoco-backend-p5.herokuapp.com/api/cameras").then((res) => res.json());
}
