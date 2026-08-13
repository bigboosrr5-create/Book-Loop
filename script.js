function openForm(type) {

    // सभी forms बंद करें
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    // चुना हुआ form खोजें
    const form = document.getElementById(type + "-form");

    if (form) {
        // form को page के ऊपर ले जाएँ
        document.body.appendChild(form);

        // popup खोलें
        form.classList.add("active");

        // page को पीछे से scroll होने से रोकें
        document.body.style.overflow = "hidden";
    }
}

function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    document.body.style.overflow = "";
}
