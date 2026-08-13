function openForm(type) {
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    const form = document.getElementById(type + "-form");

    if (form) {
        form.classList.add("active");
    }
}

function closeForm() {
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });
}
