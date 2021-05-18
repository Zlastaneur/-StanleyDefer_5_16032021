document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("confirmationPage")) return;

    (() => {
        const orderId = new URL(location.href).searchParams.get("orderId") || "ERREUR";
        document.getElementById("orderID").textContent = orderId;
    })();

    (() => {
        const orderTotal = new URL(location.href).searchParams.get("orderTotal") || "ERREUR";
        document.getElementById("orderTotal").textContent = orderTotal;
    })();
});
