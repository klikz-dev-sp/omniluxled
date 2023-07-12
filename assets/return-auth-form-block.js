const purchaseWay1 = document.getElementById("ContactForm-purchase-method-direct");
purchaseWay1.addEventListener('change', function() {
    document.getElementById("orderNumberInput").classList.remove("d-none");
    document.getElementById("businessNameInput").classList.add("d-none");
});

const purchaseWay2 = document.getElementById("ContactForm-purchase-method-nodirect");
purchaseWay2.addEventListener('change', function() {
    document.getElementById("orderNumberInput").classList.add("d-none");
    document.getElementById("businessNameInput").classList.remove("d-none");
});