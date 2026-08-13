// ======================================================
// BOOKLOOP - SUPABASE DATABASE
// ======================================================

// अपनी Supabase details यहाँ डालें
const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";
const SUPABASE_KEY = "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================================
// OPEN FORM
// ======================================================

function openForm(type) {

    // सभी forms बंद करें
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    // जिस form पर click हुआ उसे खोलें
    const form = document.getElementById(type + "-form");

    if (form) {
        form.classList.add("active");
        window.scrollTo(0, 0);
    }
}


// ======================================================
// CLOSE FORM
// ======================================================

function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    // सभी forms के submit को पकड़ें
    document.querySelectorAll(".popup-form").forEach(function(form) {

        form.addEventListener("submit", function(event) {

            event.preventDefault();

            saveBook(form);

        });

    });

    // Database से books दिखाएँ
    loadBooks();

});


// ======================================================
// SAVE BOOK IN SUPABASE
// ======================================================

async function saveBook(form) {

    const button = form.querySelector(
        'button[type="submit"]'
    );

    if (button) {
        button.disabled = true;
        button.textContent = "Saving...";
    }


    try {

        const formData = new FormData(form);

        const book = {

            book_title: formData.get("book_title") || null,

            author: formData.get("author") || null,

            category: formData.get("category") || null,

            course: formData.get("course") || null,

            semester: formData.get("semester") || null,

            book_condition:
                formData.get("book_condition") || null,

            price:
                formData.get("price")
                    ? Number(formData.get("price"))
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


        // ----------------------------------------------
        // SUPABASE INSERT
        // ----------------------------------------------

        const { error } = await supabaseClient
            .from("books")
            .insert([book]);


        if (error) {

            console.error(error);

            alert(
                "Data save नहीं हुआ।\n\n" +
                error.message
            );

            return;
        }


        // ----------------------------------------------
        // SUCCESS
        // ----------------------------------------------

        alert(
            "Book successfully saved!"
        );


        // Form खाली करें
        form.reset();


        // Form बंद करें
        closeForm();


        // Explore Books फिर से load करें
        loadBooks();


    }

    catch (error) {

        console.error(error);

        alert(
            "कुछ समस्या हुई। कृपया फिर से कोशिश करें।"
        );

    }

    finally {

        if (button) {

            button.disabled = false;
            if (form.id === "sell-form") {
                button.textContent = "Sell Your Book";
            }

            else if (form.id === "exchange-form") {
                button.textContent = "Exchange Book";
            }

            else if (form.id === "donate-form") {
                button.textContent = "Donate Book";
            }

        }

    }

}


// ======================================================
// LOAD BOOKS FROM DATABASE
// ======================================================

async function loadBooks() {

    const bookGrid =
        document.getElementById("bookGrid");

    if (!bookGrid) return;


    bookGrid.innerHTML = 
        <p>Loading books...</p>
    ;


    const { data: books, error } =
        await supabaseClient
            .from("books")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        bookGrid.innerHTML = 
            <p>
                Books load नहीं हो सकीं।
            </p>
        ;

        return;
    }


    // अगर कोई book नहीं है
    if (!books || books.length === 0) {

        bookGrid.innerHTML = 
            <p>
                अभी कोई book listed नहीं है।
            </p>
        ;

        return;
    }


    // पुराना content हटाएँ
    bookGrid.innerHTML = "";


    // हर database book की card बनाएँ
    books.forEach(function(book) {

        const card =
            document.createElement("div");

        card.className = "book-card";


        // Listing type
        let type = "";

        if (book.listing_type === "sell") {
            type = "FOR SALE";
        }

        else if (book.listing_type === "exchange") {
            type = "EXCHANGE";
        }

        else if (book.listing_type === "donate") {
            type = "DONATE";
        }


        // Price / exchange / donate
        let price = "";

        if (
            book.listing_type === "sell" &&
            book.price !== null
        ) {

            price = "₹" + book.price;

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


        card.innerHTML = 

            <div class="book-image purple">
                📚
            </div>

            <div class="book-info">

                <span class="tag">
                    ${escapeHTML(type)}
                </span>

                <h3>
                    ${escapeHTML(
                        book.book_title || ""
                    )}
                </h3>

                ${
                    book.author
                    ? <p>${escapeHTML(book.author)}</p>
                    : ""
                }

                ${
                    book.category
                    ? <p>${escapeHTML(book.category)}</p>
                    : ""
                }

                ${
                    book.course
                    ? <p>${escapeHTML(book.course)}</p>
                    : ""
                }

                ${
                    book.location
                    ? <p>📍 ${escapeHTML(book.location)}</p>
                    : ""
                }

                ${
                    book.listing_type === "exchange"
                    && book.wanted_book
                    ? <p>Want: ${escapeHTML(book.wanted_book)}</p>
                    : ""
                }

                <div class="book-bottom">

                    <strong>
                        ${escapeHTML(price)}
                    </strong>

                    <button
                        type="button"
                        onclick="viewBook('${book.id}')">
                        View
                    </button>

                </div>

            </div>

        ;


        bookGrid.appendChild(card);

    });

}
// ======================================================
// VIEW BOOK DETAILS
// ======================================================

async function viewBook(id) {

    const { data: book, error } =
        await supabaseClient
            .from("books")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        console.error(error);

        alert(
            "Book details नहीं मिल सके।"
        );

        return;
    }


    let details =

        "Book: " +
        (book.book_title || "") +

        "\nAuthor: " +
        (book.author || "") +

        "\nCategory: " +
        (book.category || "") +

        "\nCourse: " +
        (book.course || "") +

        "\nCondition: " +
        (book.book_condition || "") +

        "\nLocation: " +
        (book.location || "") +

        "\nContact: " +
        (book.contact_number || "");


    if (book.listing_type === "sell") {

        details +=
            "\nPrice: ₹" +
            (book.price || "");

    }

    if (book.listing_type === "exchange") {

        details +=
            "\nWanted Book: " +
            (book.wanted_book || "");

    }

    if (book.listing_type === "donate") {

        details +=
            "\nType: Donate";

    }


    if (book.description) {

        details +=
            "\nDetails: " +
            book.description;

    }


    alert(details);

}


// ======================================================
// SAFE TEXT
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
