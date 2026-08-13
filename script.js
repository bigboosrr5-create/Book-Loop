// ==========================================
// BOOKLOOP - SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";
const SUPABASE_KEY = "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// OPEN FORM
// ==========================================

function openForm(type) {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    const form = document.getElementById(type + "-form");

    if (form) {
        form.classList.add("active");
        window.scrollTo(0, 0);
    }
}


// ==========================================
// CLOSE FORM
// ==========================================

function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

}


// ==========================================
// SAVE FORM DATA TO SUPABASE
// ==========================================

async function saveBook(form) {

    const formData = new FormData(form);

    const listingType = formData.get("listing_type");

    const bookData = {

        book_title: formData.get("book_title"),
        author: formData.get("author"),
        category: formData.get("category"),
        course: formData.get("course"),
        semester: formData.get("semester"),
        book_condition: formData.get("book_condition"),
        location: formData.get("location"),
        contact_number: formData.get("contact_number"),
        description: formData.get("description"),
        listing_type: listingType

    };


    // ------------------------------------------
    // PRICE - केवल Sell में
    // ------------------------------------------

    const price = formData.get("price");

    if (price !== null && price !== "") {
        bookData.price = Number(price);
    } else {
        bookData.price = null;
    }


    // ------------------------------------------
    // EXCHANGE BOOK
    // ------------------------------------------

    const wantedBook = formData.get("wanted_book");

    if (wantedBook !== null) {
        bookData.wanted_book = wantedBook;
    }


    // ------------------------------------------
    // INSERT INTO SUPABASE
    // ------------------------------------------

    const { data, error } = await supabaseClient
        .from("books")
        .insert([bookData])
        .select();


    if (error) {

        console.error("Supabase Error:", error);

        alert(
            "Data save नहीं हुआ।\n\n" +
            error.message
        );

        return false;
    }


    // ------------------------------------------
    // SUCCESS
    // ------------------------------------------

    alert("Book successfully listed!");

    form.reset();

    closeForm();

    // Explore Books को तुरंत refresh करें
    loadBooks();

    return true;
}


// ==========================================
// FORM SUBMIT EVENTS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function(form) {

        form.addEventListener("submit", async function(event) {

            // पुराना /sell-book आदि URL पर जाने से रोकें
            event.preventDefault();

            const button = form.querySelector(
                'button[type="submit"]'
            );

            if (button) {
                button.disabled = true;
                button.textContent = "Saving...";
            }


            try {

                await saveBook(form);

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

        });

    }


    // Website खुलते ही database से books लाएँ
    loadBooks();

});


// ==========================================
// LOAD BOOKS FROM SUPABASE
// ==========================================

async function loadBooks() {

    const bookGrid = document.getElementById("bookGrid");

    if (!bookGrid) return;


    bookGrid.innerHTML = 
        <p class="loading-books">
            Loading books...
        </p>
    ;


    const { data: books, error } = await supabaseClient
        .from("books")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error("Load Books Error:", error);

        bookGrid.innerHTML = 
            <p class="loading-books">
                Books load नहीं हो सकीं।
            </p>
        ;

        return;
    }


    // कोई book नहीं है
    if (!books || books.length === 0) {

        bookGrid.innerHTML = 
            <p class="loading-books">
                अभी कोई book listed नहीं है।
            </p>
        ;

        return;
    }


    // पुराना content हटाएँ
    bookGrid.innerHTML = "";


    // हर book की card बनाएँ
    books.forEach(function(book) {

        const card = document.createElement("div");

        card.className = "book-card";


        // ------------------------------------------
        // Listing Type
        // ------------------------------------------

        let typeText = "";

        if (book.listing_type === "sell") {
            typeText = "FOR SALE";
        }

        else if (book.listing_type === "exchange") {
            typeText = "EXCHANGE";
        }

        else if (book.listing_type === "donate") {
            typeText = "DONATE";
        }

        else {
            typeText = "BOOK";
        }


        // ------------------------------------------
        // Price
        // ------------------------------------------

        let priceText = "";

        if (
            book.listing_type === "sell" &&
            book.price !== null
        ) {

            priceText = "₹" + book.price;

        }

        else if (book.listing_type === "exchange") {

            priceText = "Exchange";

        }

        else if (book.listing_type === "donate") {

            priceText = "Free";

        }


        // ------------------------------------------
        // Exchange wanted book
        // ------------------------------------------

        let wantedText = "";

        if (
            book.listing_type === "exchange" &&
            book.wanted_book
        ) {

            wantedText = 
                <p>
                    Want: ${escapeHTML(book.wanted_book)}
                </p>
            ;

        }


        // ------------------------------------------
        // BOOK CARD
        // ------------------------------------------

        card.innerHTML = `

            <div class="book-image purple">
                📚
            </div>

            <div class="book-info">

                <span class="tag">
                    ${typeText}
                </span>

                <h3>
                    ${escapeHTML(book.book_title || "")}
                </h3>

                <p>
                    ${escapeHTML(book.author || "")}
                </p>

                <p>
                    ${escapeHTML(book.category || "")}
                </p>

                <p>
                    ${escapeHTML(book.course || "")}
                </p>

                <p>
                    ${escapeHTML(book.location || "")}
                </p>

                ${wantedText}

                <div class="book-bottom">

                    <strong>
                        ${priceText}
                    </strong>
                    <button
                        type="button"
                        onclick="viewBook('${book.id}')">
                        View
                    </button>

                </div>

            </div>
        `;


        bookGrid.appendChild(card);

    });

}


// ==========================================
// VIEW BOOK
// ==========================================

async function viewBook(id) {

    const { data: book, error } = await supabaseClient
        .from("books")
        .select("*")
        .eq("id", id)
        .single();


    if (error) {

        alert("Book details load नहीं हो सके।");

        console.error(error);

        return;
    }


    let message =

        "Book: " + (book.book_title || "") +
        "\nAuthor: " + (book.author || "") +
        "\nCategory: " + (book.category || "") +
        "\nCourse: " + (book.course || "") +
        "\nCondition: " + (book.book_condition || "") +
        "\nLocation: " + (book.location || "") +
        "\nContact: " + (book.contact_number || "");


    if (book.listing_type === "sell") {

        message +=
            "\nPrice: ₹" + (book.price || "");

    }

    else if (book.listing_type === "exchange") {

        message +=
            "\nWanted Book: " +
            (book.wanted_book || "");

    }

    else if (book.listing_type === "donate") {

        message += "\nType: Donate";

    }


    if (book.description) {

        message +=
            "\nDetails: " +
            book.description;

    }


    alert(message);

}


// ==========================================
// SECURITY - HTML ESCAPE
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
