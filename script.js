// ======================================================
// BOOK-LOOP FINAL SCRIPT
// ======================================================


// ======================================================
// OPEN FORM
// ======================================================

function openForm(type) {

    const forms =
        document.querySelectorAll(".popup-form");

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
// ======================================================
// SUPABASE
// ======================================================

const SUPABASE_URL =
    "https://ewammndvxdenjrhaazsh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";


let supabaseClient = null;


if (typeof supabase !== "undefined") {

    supabaseClient =
        supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

} else {

    console.error(
        "Supabase library नहीं मिली।"
    );
}


// ======================================================
// GET FORM DATA
// ======================================================

function getBookData(form) {

    const formData =
        new FormData(form);

    const price =
        formData.get("price");


    return {

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
            price !== null &&
            price !== ""
                ? Number(price)
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
}


// ======================================================
// SAVE DATA TO SUPABASE
// ======================================================

async function saveBookForm(form) {

    if (!supabaseClient) {

        alert(
            "❌ Supabase connection नहीं मिली।"
        );

        return;
    }


    const button =
        form.querySelector(
            'button[type="submit"]'
        );


    try {

        if (button) {

            button.disabled = true;

            button.textContent =
                "Saving...";
        }


        // ----------------------------------------------
        // GET DATA
        // ----------------------------------------------

        const bookData =
            getBookData(form);


        console.log(
            "Data भेजा जा रहा है:",
            bookData
        );


        // ----------------------------------------------
        // STOP NORMAL HTML SUBMIT
        // ----------------------------------------------

        form.removeAttribute("action");

        form.removeAttribute("method");


        // ----------------------------------------------
        // INSERT INTO SUPABASE
        // ----------------------------------------------

        const result =
            await supabaseClient
                .from("books")
                .insert([bookData])
                .select();


        const data =
            result.data;

        const error =
            result.error;
        // ----------------------------------------------
        // ERROR
        // ----------------------------------------------

        if (error) {

            console.error(
                "Supabase Error:",
                error
            );


            alert(
                "❌ Data save नहीं हुआ!\n\n" +
                error.message
            );


            return;
        }


        // ----------------------------------------------
        // SUCCESS
        // ----------------------------------------------

        console.log(
            "Data saved:",
            data
        );


        alert(
            "✅ Data successfully saved!"
        );


        // Form clear
        form.reset();


        // Form close
        closeForm();


        // Books refresh
        loadBooks();

    }

    catch (error) {

        console.error(
            "Error:",
            error
        );


        alert(
            "❌ Error:\n\n" +
            error.message
        );

    }

    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "Submit";
        }
    }
}


// ======================================================
// FORM SUBMIT
// ======================================================
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".popup-form").forEach(function (form) {

        form.addEventListener("submit", function (event) {

            // पुराने /sell-book, /exchange-book, /donate-book URL पर जाने से रोकें
            event.preventDefault();

            alert("Form submit हो गया।");

        });

    });

});
// ======================================================
// LOAD BOOKS
// ======================================================

async function loadBooks() {

    const bookGrid =
        document.getElementById(
            "bookGrid"
        );


    if (!bookGrid) {

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

        const result =
            await supabaseClient
                .from("books")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: false
                    }
                );


        const books =
            result.data;

        const error =
            result.error;


        if (error) {

            console.error(
                "Load Error:",
                error
            );


            bookGrid.innerHTML =
                "<p>Books load नहीं हो सकीं।</p>";

            return;
        }


        if (
            !books ||
            books.length === 0
        ) {

            bookGrid.innerHTML =
                "<p>अभी कोई book listed नहीं है।</p>";

            return;
        }


        bookGrid.innerHTML =
            "";


        books.forEach(
            function (book) {

                let type =
                    "BOOK";

                let price =
                    "";


                // --------------------------------------
                // TYPE
                // --------------------------------------

                if (
                    book.listing_type ===
                    "sell"
                ) {

                    type =
                        "FOR SALE";

                }

                else if (
                    book.listing_type ===
                    "exchange"
                ) {

                    type =
                        "EXCHANGE";

                }
                else if (
                    book.listing_type ===
                    "donate"
                ) {

                    type =
                        "DONATE";
                }


                // --------------------------------------
                // PRICE
                // --------------------------------------

                if (
                    book.listing_type ===
                    "sell" &&
                    book.price !== null &&
                    book.price !== ""
                ) {

                    price =
                        "₹" +
                        book.price;

                }

                else if (
                    book.listing_type ===
                    "exchange"
                ) {

                    price =
                        "Exchange";

                }

                else if (
                    book.listing_type ===
                    "donate"
                ) {

                    price =
                        "Free";
                }


                // --------------------------------------
                // OPTIONAL INFORMATION
                // --------------------------------------

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


                // --------------------------------------
                // CARD
                // --------------------------------------

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "book-card";


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
                                book.book_title ||
                                "Book"
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
                                onclick="showBookDetails('${book.id}')">
                                View
                            </button>

                        </div>

                    </div>
                ;


                bookGrid.appendChild(
                    card
                );
            }
        );

    }

    catch (error) {

        console.error(
            "Books Error:",
            error
        );


        bookGrid.innerHTML =
            "<p>Books load करते समय समस्या आई।</p>";
    }
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)
    .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBooks();

    }
);
