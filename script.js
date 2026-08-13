// ======================================================
// FORM OPEN / CLOSE
// ======================================================

function openForm(type) {

    // सभी popup forms बंद करें
    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function (form) {
        form.classList.remove("active");
    });

    // चुना हुआ form खोलें
    const selectedForm = document.getElementById(type + "-form");

    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}


// ======================================================
// CLOSE FORM
// ======================================================

function closeForm() {

    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function (form) {
        form.classList.remove("active");
    });

}


// ======================================================
// SUPABASE CONNECTION
// ======================================================

const SUPABASE_URL =
    "https://ewammndvxdenjrhaazsh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";


// Check Supabase library
if (typeof supabase === "undefined") {

    console.error("Supabase library load नहीं हुई।");

} else {

    const supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


    // ==================================================
    // SAVE FORM DATA
    // ==================================================

    document.addEventListener("DOMContentLoaded", function () {

        const forms = document.querySelectorAll(".popup-form");

        forms.forEach(function (form) {

            form.addEventListener("submit", async function (event) {

                event.preventDefault();

                // Button को दोबारा click होने से रोकें
                const submitButton =
                    form.querySelector('button[type="submit"]');

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = "Saving...";
                }


                try {

                    const formData = new FormData(form);


                    // ======================================
                    // FORM DATA
                    // ======================================

                    const priceValue = formData.get("price");

                    const bookData = {

                        book_title:
                            formData.get("book_title") || null,

                        author:
                            formData.get("author") || null,

                        category:
                            formData.get("category") || null,

                        course:
                            formData.get("course") || null,

                        semester:
                            formData.get("semester") || null,

                        book_condition:
                            formData.get("book_condition") || null,

                        price:
                            priceValue !== null &&
                            priceValue !== ""
                                ? Number(priceValue)
                                : null,

                        location:
                            formData.get("location") || null,

                        contact_number:
                            formData.get("contact_number") || null,

                        description:
                            formData.get("description") || null,

                        listing_type:
                            formData.get("listing_type") || null,

                        wanted_book:
                            formData.get("wanted_book") || null
                    };


                    console.log(
                        "Database में भेजा जा रहा data:",
                        bookData
                    );
                    // ======================================
                    // INSERT INTO SUPABASE
                    // ======================================

                    const { data, error } =
                        await supabaseClient
                            .from("books")
                            .insert(bookData)
                            .select();


                    // ======================================
                    // ERROR
                    // ======================================

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


                    // ======================================
                    // SUCCESS
                    // ======================================

                    console.log(
                        "Data successfully saved:",
                        data
                    );

                    alert(
                        "✅ Book successfully listed!"
                    );


                    // Form खाली करें
                    form.reset();


                    // Form बंद करें
                    closeForm();


                    // Books दोबारा load करें
                    loadBooks();

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

                    // Button वापस enable करें
                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Submit";
                    }
                }

            });

        });

    });


    // ==================================================
    // LOAD BOOKS
    // ==================================================

    async function loadBooks() {

        const bookGrid =
            document.getElementById("bookGrid");


        if (!bookGrid) {

            console.log(
                "bookGrid नहीं मिला।"
            );

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


            // ==========================================
            // LOAD ERROR
            // ==========================================

            if (error) {

                console.error(
                    "Supabase Load Error:",
                    error
                );

                bookGrid.innerHTML =
                    "<p>Books load नहीं हो सकीं।</p>";

                return;
            }


            // ==========================================
            // NO BOOKS
            // ==========================================

            if (!books || books.length === 0) {

                bookGrid.innerHTML =
                    "<p>अभी कोई book listed नहीं है।</p>";

                return;
            }


            // पुराने cards हटाएँ
            bookGrid.innerHTML = "";


            // ==========================================
            // CREATE BOOK CARDS
            // ==========================================

            books.forEach(function (book) {

                let type = "BOOK";
                let price = "";
                // Listing type
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


                // Price
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


                // ======================================
                // CARD
                // ======================================

                const card =
                    document.createElement("div");

                card.className =
                    "book-card";


                // ======================================
                // CARD HTML
                // ======================================

                card.innerHTML = 

                    <div class="book-image purple">
                        📚
                    </div>

                    <div class="book-info">

                        <span class="tag">
                            ${type}
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

        catch (error) {

            console.error(
                "Books loading error:",
                error
            );

            bookGrid.innerHTML =
                "<p>Books load करते समय समस्या आई।</p>";
        }

    }


    // ==================================================
    // LOAD BOOKS WHEN WEBSITE OPENS
    // ==================================================

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            loadBooks();

        }
    );

}
                
                    
