// ======================================================
// FORM OPEN / CLOSE
// ======================================================

function openForm(type) {

    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function (form) {
        form.classList.remove("active");
    });

    const selectedForm =
        document.getElementById(type + "-form");

    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}
// ======================================================
// CLOSE FORM
// ======================================================

function closeForm() {

    const forms =
        document.querySelectorAll(".popup-form");

    forms.forEach(function (form) {
        form.classList.remove("active");
    });
}
// ======================================================
// SUPABASE DATABASE CONNECTION
// ======================================================

const SUPABASE_URL =
    "https://ewammndvxdenjrhaazsh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

let supabaseClient = null;

if (typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
} else {
    console.error(
        "Supabase library load नहीं हुई। index.html में Supabase CDN script check करें।"
    );
}


// ======================================================
// GET FORM DATA
// ======================================================

function getBookData(form) {
    const formData = new FormData(form);

    const priceValue = formData.get("price");

    return {
        book_title: formData.get("book_title") || null,
        author: formData.get("author") || null,
        category: formData.get("category") || null,
        course: formData.get("course") || null,
        semester: formData.get("semester") || null,
        book_condition: formData.get("book_condition") || null,

        price:
            priceValue !== null && priceValue !== ""
                ? Number(priceValue)
                : null,

        location: formData.get("location") || null,
        contact_number: formData.get("contact_number") || null,
        description: formData.get("description") || null,
        listing_type: formData.get("listing_type") || null,
        wanted_book: formData.get("wanted_book") || null
    };
}


// ======================================================
// SAVE FORM DATA TO SUPABASE
// ======================================================

async function saveBookForm(form) {

    if (!supabaseClient) {

        alert(
            "❌ Supabase connection नहीं मिली।\n\n" +
            "Supabase script को index.html में check करें।"
        );

        return;
    }

    const submitButton =
        form.querySelector('button[type="submit"]');

    const oldButtonText =
        submitButton ? submitButton.textContent : "";

    try {

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Saving...";
        }

        const bookData = getBookData(form);

        console.log(
            "Book data:",
            bookData
        );


        // IMPORTANT:
        // Native GitHub Pages POST को रोकना
        form.removeAttribute("action");
        form.removeAttribute("method");


        // ==============================================
        // SAVE TO SUPABASE
        // ==============================================

        const { data, error } =
            await supabaseClient
                .from("books")
                .insert(bookData)
                .select();


        // ==============================================
        // ERROR
        // ==============================================

        if (error) {
            console.error(
                "Supabase Insert Error:",
                error
            );

            alert(
                "❌ Data save नहीं हुआ!\n\n" +
                error.message
            );

            return;
        }


        // ==============================================
        // SUCCESS
        // ==============================================

        console.log(
            "Book saved successfully:",
            data
        );

        alert(
            "✅ Book successfully saved!"
        );

        form.reset();

        closeForm();

        await loadBooks();

    }

    catch (error) {

        console.error(
            "Unexpected Error:",
            error
        );

        alert(
            "❌ कुछ समस्या आ गई!\n\n" +
            error.message
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                oldButtonText || "Submit";
        }
    }
}


// ======================================================
// HANDLE ALL POPUP FORM SUBMITS
// ======================================================

document.addEventListener(
    "submit",
    function (event) {

        const form = event.target;

        if (!form.matches(".popup-form")) {
            return;
        }


        // ==============================================
        // IMPORTANT 405 FIX
        // ==============================================

        event.preventDefault();

        event.stopPropagation();


        // Save through Supabase
        saveBookForm(form);

    },
    true
);


// ======================================================
// LOAD BOOKS FROM SUPABASE
// ======================================================

async function loadBooks() {

    const bookGrid =
        document.getElementById("bookGrid");


    if (!bookGrid) {

        console.log(
            "bookGrid नहीं मिला।"
        );

        return;
    }


    if (!supabaseClient) {

        bookGrid.innerHTML =
            "<p>Supabase connection नहीं मिली।</p>";

        return;
    }


    bookGrid.innerHTML =
        "<p>Loading books...</p>";


    try {

        const { data: books, error } =
            await supabaseClient
                .from("books")
                .select("*")
                .order("id", {
                    ascending: false
                });


        // ==============================================
        // ERROR
        // ==============================================

        if (error) {

            console.error(
                "Supabase Load Error:",
                error
            );

            bookGrid.innerHTML =
                "<p>Books load नहीं हो सकीं।</p>";

            return;
        }


        // ==============================================
        // NO BOOKS
        // ==============================================

        if (!books || books.length === 0) {

            bookGrid.innerHTML =
                "<p>अभी कोई book listed नहीं है।</p>";

            return;
        }


        bookGrid.innerHTML = "";


        // ==============================================
        // CREATE BOOK CARDS
        // ==============================================

        books.forEach(function (book) {

            let type = "BOOK";

            let price = "";


            if (book.listing_type === "sell") {

                type = "FOR SALE";

            }

            else if (
                book.listing_type === "exchange"
            ) {

                type = "EXCHANGE";

            }

            else if (
                book.listing_type === "donate"
            ) {

                type = "DONATE";

            }


            // ==========================================
            // PRICE
            // ==========================================

            if (
                book.listing_type === "sell" &&
                book.price !== null &&
                book.price !== ""
            ) {
                price =
                    "₹" + book.price;

            }

            else if (
                book.listing_type === "exchange"
            ) {

                price = "Exchange";

            }

            else if (
                book.listing_type === "donate"
            ) {

                price = "Free";

            }


            // ==========================================
            // CARD
            // ==========================================

            const card =
                document.createElement("div");

            card.className =
                "book-card";


            // ==========================================
            // OPTIONAL DATA
            // ==========================================

            const authorHTML =
                book.author
                    ? <p>📖 ${escapeHTML(book.author)}</p>
                    : "";


            const categoryHTML =
                book.category
                    ? <p>${escapeHTML(book.category)}</p>
                    : "";


            const courseHTML =
                book.course
                    ? <p>${escapeHTML(book.course)}</p>
                    : "";


            const semesterHTML =
                book.semester
                    ? <p>${escapeHTML(book.semester)}</p>
                    : "";


            const locationHTML =
                book.location
                    ? <p>📍 ${escapeHTML(book.location)}</p>
                    : "";


            // ==========================================
            // CARD HTML
            // ==========================================

            card.innerHTML = 

                <div class="book-image purple">
                    📚
                </div>

                <div class="book-info">

                    <span class="tag">
                        ${type}
                    </span>

                    <h3>
                        ${escapeHTML(
                            book.book_title || "Book"
                        )}
                    </h3>

                    ${authorHTML}

                    ${categoryHTML}

                    ${courseHTML}

                    ${semesterHTML}

                    ${locationHTML}

                    <div class="book-bottom">

                        <strong>
                            ${price}
                        </strong>

                        <button
                            type="button"
                            onclick="showBookDetails('${String(book.id).replace(/'/g, "\\'")}')">
                            View
                        </button>

                    </div>

                </div>

            ;


            bookGrid.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Books loading error:",
            error
        );

        bookGrid.innerHTML =
            "<p>Books load करते समय समस्या आई।</p>";
    }
}


// ======================================================
// HTML ESCAPE
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// ======================================================
// LOAD BOOKS WHEN WEBSITE OPENS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBooks();

    }
);
                
