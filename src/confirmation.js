document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("confirmationPage")) return;

    // Get the Order ID and the total amount and put them in the recap
    (() => {
        const orderId = new URL(location.href).searchParams.get("orderId") || "ERREUR";
        document.getElementById("orderID").textContent = orderId;
    })();

    (() => {
        const orderTotal = new URL(location.href).searchParams.get("orderTotal") || "ERREUR";
        document.getElementById("orderTotal").textContent = orderTotal;
    })();
});
