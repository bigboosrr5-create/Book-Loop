// ===============================
// BOOKLOOP FORM CONTROL
// ===============================

// सभी forms बंद करें
function closeAllForms() {
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });
}


// Sell / Exchange / Donate form खोलें
function openForm(type) {

    closeAllForms();

    let formId = "";

    if (type === "sell") {
        formId = "sell-form";
    }

    if (type === "exchange") {
        formId = "exchange-form";
    }

    if (type === "donate") {
        formId = "donate-form";
    }

    const form = document.getElementById(formId);

    if (form) {
        form.classList.add("active");

        // ऊपर से form दिखाई दे
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


// Back button
function closeForm() {
    closeAllForms();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// Page load होने पर सभी forms बंद रखें
document.addEventListener("DOMContentLoaded", function() {
    closeAllForms();
});
