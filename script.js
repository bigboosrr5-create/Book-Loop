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
// EXPLORE BOOKS FROM SUPABASE
// ======================================

async function loadBooks() {

    const bookGrid = document.getElementById("bookGrid");

    if (!bookGrid) {
        console.log("bookGrid नहीं मिला");
        return;
    }

    bookGrid.innerHTML = "<p>Loading books...</p>";

    const { data: books, error } = await supabaseClient
        .from("books")
        .select("*");

    if (error) {

        console.error("Supabase Error:", error);

        bookGrid.innerHTML =
            "<p>Books load नहीं हो सकीं।</p>";

        return;
    }

    if (!books || books.length === 0) {

        bookGrid.innerHTML =
            "<p>अभी कोई book listed नहीं है।</p>";

        return;
    }

    // पुराने/demo books हटाएँ
    bookGrid.innerHTML = "";

    books.forEach(function(book) {

        let type = "BOOK";

        if (book.listing_type === "sell") {
            type = "FOR SALE";
        }

        if (book.listing_type === "exchange") {
            type = "EXCHANGE";
        }

        if (book.listing_type === "donate") {
            type = "DONATE";
        }


        let price = "";

        if (book.listing_type === "sell") {

            if (book.price !== null && book.price !== "") {
                price = "₹" + book.price;
            }

        }

        if (book.listing_type === "exchange") {
            price = "Exchange";
        }

        if (book.listing_type === "donate") {
            price = "Free";
        }


        const card = document.createElement("div");

        card.className = "book-card";


        card.innerHTML = 

            <div class="book-image purple">
                📚
            </div>

            <div class="book-info">

                <span class="tag">
                    ${book.listing_type === "exchange" ? "EXCHANGE" :
                      book.listing_type === "donate" ? "DONATE" :
                      "FOR SALE"}
                </span>

                <h3>
                    ${book.book_title || "Book"}
                </h3>

                ${
                    book.author
                    ? <p>📖 ${book.author}</p>
                    : ""
                }

                ${
                    book.category
                    ? <p>${book.category}</p>
                    : ""
                }

                ${
                    book.course
                    ? <p>${book.course}</p>
                    : ""
                }

                ${
                    book.semester
                    ? <p>${book.semester}</p>
                    : ""
                }

                ${
                    book.location
                    ? <p>📍 ${book.location}</p>
                    : ""
                }

                <div class="book-bottom">

                    <strong>
                        ${price}
                    </strong>

                    <button
                        type="button"
                        onclick="showBookDetails('${book.id}')">
                        View
                    </button>

                </div>

            </div>
        ;


        bookGrid.appendChild(card);

    });

}
                          // ======================================
// LOAD BOOKS WHEN WEBSITE OPENS
// ======================================

document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});
