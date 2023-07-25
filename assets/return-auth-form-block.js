document.getElementById("ContactForm-purchase-method-direct").addEventListener('change', function() {
    document.getElementById("orderNumberInput").classList.remove("d-none");
    document.getElementById("businessNameInput").remove();
});

document.getElementById("ContactForm-purchase-method-nodirect").addEventListener('change', function() {
    document.getElementById("orderNumberInput").classList.add("d-none");
    document.getElementById("orderNumberInput").insertAdjacentHTML("afterend", "<div id='businessNameInput' class='form-group form-floating'><input type='text' id='ContactForm-business-name' name='contact[business_name]' class='form-control' placeholder='Business Name' required><label for='ContactForm-business-name'>Business Name</label></div>");
});

document.getElementById("ContactForm-return-method").addEventListener('click', function() {
    document.getElementById("heading_txt").innerHTML = "Return Authorization Form";
});

document.getElementById("ContactForm-replace-method").addEventListener('click', function() {
    document.getElementById("heading_txt").innerHTML = "Replace Authorization Form";
});

document.getElementById("product-add-btn").addEventListener('click', function() {
    let productTitle = document.getElementById("ContactForm-product").value
    let productList = document.getElementById("product-list")

    let wrapperId = productList.childElementCount
    document.getElementById("product-list").innerHTML += 
    '<div id="product-list-' + wrapperId + '" class="mb-1 d-flex align-items-center col-12" data-product-title="' + productTitle + '"><div style="flex:3">'
    + productTitle 
    + '</div><input type="hidden" name="contact[product_title_' + wrapperId + ']" value="'
     + productTitle + '"><input type="text" name="contact[product_serial_number_' + wrapperId + ']" class="form-control me-1" style="flex:1" placeholder="Serial No" required><div class="btn btn-primary" onclick="deleteProduct('+ wrapperId +')">-</div></div>'

});

function deleteProduct(wrapperId) {
    document.getElementById("product-list-" + wrapperId).remove()

}
