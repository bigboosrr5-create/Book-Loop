function openForm(type) {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    const form = document.getElementById(type + "-form");

    if (form) {
        form.classList.add("active");
        document.body.classList.add("form-open");
    }
}

function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    document.body.classList.remove("form-open");
}

function showMessage() {
    alert("Book details will be available here.");
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeForm();
    }
});
