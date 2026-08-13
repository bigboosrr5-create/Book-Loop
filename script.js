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
        // ======================================
// SUPABASE SE BOOKS EXPLORE MEIN DIKHAYEN
// ======================================

async function loadBooks() {

    const bookGrid = document.getElementById("bookGrid");

    if (!bookGrid) return;

    bookGrid.innerHTML = "<p>Loading books...</p>";

    const { data: books, error } = await supabaseClient
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {

        console.error(error);

        bookGrid.innerHTML =
            "<p>Books load नहीं हो सकीं।</p>";

        return;
    }

    if (!books || books.length === 0) {

        bookGrid.innerHTML =
            "<p>अभी कोई book listed नहीं है।</p>";

        return;
    }

    bookGrid.innerHTML = "";

    books.forEach(function(book) {

        const card = document.createElement("div");

        card.className = "book-card";

        let type = "";

        if (book.listing_type === "sell") {
            type = "FOR SALE";
        } else if (book.listing_type === "exchange") {
            type = "EXCHANGE";
        } else if (book.listing_type === "donate") {
            type = "DONATE";
        }

        let price = "";

        if (book.listing_type === "sell" && book.price != null) {
            price = "₹" + book.price;
        } else if (book.listing_type === "exchange") {
            price = "Exchange";
        } else if (book.listing_type === "donate") {
            price = "Free";
        }

        card.innerHTML = 
            <div class="book-image purple">
                📚
            </div>

            <div class="book-info">

                <span class="tag">${type}</span>

                <h3>${book.book_title || ""}</h3>

                <p>${book.author || ""}</p>

                <p>${book.category || ""}</p>

                <p>${book.course || ""}</p>

                <p>📍 ${book.location || ""}</p>

                <div class="book-bottom">

                    <strong>${price}</strong>

                    <button type="button">
                        View
                    </button>

                </div>

            </div>
        ;

        bookGrid.appendChild(card);

    });
}
                          

    });

});
document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});
