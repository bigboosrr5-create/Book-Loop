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
// ======================================
// SUPABASE DATABASE CONNECTION
// ======================================

const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";
const SUPABASE_KEY = "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================
// SAVE FORM DATA
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function (form) {

        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            const formData = new FormData(form);

            const bookData = {
                book_title: formData.get("book_title") || null,
                author: formData.get("author") || null,
                category: formData.get("category") || null,
                course: formData.get("course") || null,
                semester: formData.get("semester") || null,
                book_condition: formData.get("book_condition") || null,
                price: formData.get("price")
                    ? Number(formData.get("price"))
                    : null,
                location: formData.get("location") || null,
                contact_number: formData.get("contact_number") || null,
                description: formData.get("description") || null,
                listing_type: formData.get("listing_type") || null,
                wanted_book: formData.get("wanted_book") || null
            };

            const { error } = await supabaseClient
                .from("books")
                .insert([bookData]);

            if (error) {

                console.error(error);

                alert(
                    "Data save नहीं हुआ:\n" +
                    error.message
                );

                return;
            }

            alert("Book successfully saved!");

            form.reset();

            closeForm();

        });

    });

});
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".popup-form").forEach(function (form) {

        form.addEventListener("submit", async function (event) {

            event.preventDefault();

            const formData = new FormData(form);

            const bookData = {
                book_title: formData.get("book_title") || null,
                author: formData.get("author") || null,
                category: formData.get("category") || null,
                course: formData.get("course") || null,
                semester: formData.get("semester") || null,
                book_condition: formData.get("book_condition") || null,
                price: formData.get("price")
                    ? Number(formData.get("price"))
                    : null,
                location: formData.get("location") || null,
                contact_number: formData.get("contact_number") || null,
                description: formData.get("description") || null,
                listing_type: formData.get("listing_type") || null,
                wanted_book: formData.get("wanted_book") || null
            };

            const { error } = await supabaseClient
                .from("books")
                .insert([bookData]);

            if (error) {
                alert("Data save नहीं हुआ:\n" + error.message);
                console.error(error);
                return;
            }

            alert("Data successfully saved!");

            form.reset();
            closeForm();

            if (typeof loadBooks === "function") {
                loadBooks();
            }

        });

    });

});
