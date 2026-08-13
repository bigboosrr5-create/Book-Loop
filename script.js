// ================================
// FORM OPEN / CLOSE
// ================================

function openForm(type) {

    // सभी forms बंद करें
    var forms = document.querySelectorAll(".popup-form");

    forms.forEach(function(form) {
        form.classList.remove("active");
    });

    // चुना हुआ form खोलें
    var selectedForm = document.getElementById(type + "-form");

    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}


// ================================
// BACK BUTTON
// ================================

function closeForm() {

    var forms = document.querySelectorAll(".popup-form");

    forms.forEach(function(form) {
        form.classList.remove("active");
    });

}
