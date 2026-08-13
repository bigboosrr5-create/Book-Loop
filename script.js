// ===============================
// BOOKLOOP FORM + DATABASE
// ===============================

// ---------- SUPABASE ----------
const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";
const SUPABASE_KEY = "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ===============================
// OPEN FORM
// ===============================
function openForm(type) {

    // पहले सभी forms बंद
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    // सही form चुनें
    let formId = type + "-form";

    const form = document.getElementById(formId);

    // form खोलें
    if (form) {
        form.classList.add("active");
        window.scrollTo(0, 0);
    }
}


// ===============================
// CLOSE FORM
// ===============================
function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

}


// ===============================
// PAGE LOAD
// ===============================
document.addEventListener("DOMContentLoaded", function() {

    // सभी forms को शुरुआत में बंद रखें
    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });


    // तीनों forms पकड़ें
    const forms = document.querySelectorAll(".popup-form");

    forms.forEach(function(form) {

        form.addEventListener("submit", async function(event) {

            // GitHub पर /sell-book आदि URL पर जाने से रोकें
            event.preventDefault();

            await saveBook(form);

        });

    });


    // Database से books लाएँ
    loadBooks();

});


// ===============================
// SAVE BOOK
// ===============================
async function saveBook(form) {

    const formData = new FormData(form);

    const bookData = {

        book_title: formData.get("book_title") || null,

        author: formData.get("author") || null,

        category: formData.get("category") || null,

        course: formData.get("course") || null,

        semester: formData.get("semester") || null,

        book_condition:
            formData.get("book_condition") || null,

        location:
            formData.get("location") || null,

        contact_number:
            formData.get("contact_number") || null,

        description:
            formData.get("description") || null,

        listing_type:
            formData.get("listing_type") || null,

        wanted_book:
            formData.get("wanted_book") || null,

        price:
            formData.get("price")
                ? Number(formData.get("price"))
                : null
    };


    try {

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


        // Form खाली करें
        form.reset();

        // Form बंद करें
        closeForm();

        // Explore को refresh करें
        loadBooks();

    }

    catch (error) {

        console.error(error);

        alert(
            "Database connection में समस्या है।"
        );

    }

}


// ===============================
// LOAD BOOKS
// ===============================
async function loadBooks() {

    const bookGrid =
        document.getElementById("bookGrid");

    if (!bookGrid) {
        return;
    }


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
            "<p>Books load नहीं हो सकीं।</p>";

        return;
    }


    // कोई data नहीं
    if (!books || books.length === 0) {
        bookGrid.innerHTML =
            "<p>अभी कोई book listed नहीं है।</p>";

        return;
    }


    // पुराना data हटाएँ
    bookGrid.innerHTML = "";


    // Database की हर book दिखाएँ
    books.forEach(function(book) {

        const card =
            document.createElement("div");

        card.className = "book-card";


        let type = "";

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
                    📍 ${escapeHTML(book.location || "")}
                </p>

                ${
                    book.wanted_book
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


// ===============================
// VIEW BOOK
// ===============================
async function viewBook(id) {

    const { data: book, error } =
        await supabaseClient
            .from("books")
            .select("*")
            .eq("id", id)
            .single();


    if (error) {

        alert("Book details नहीं मिल सके।");

        return;
    }


    let text =
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

        text +=
            "\nPrice: ₹" +
            (book.price || "");

    }


    if (book.listing_type === "exchange") {

        text +=
            "\nWanted Book: " +
            (book.wanted_book || "");

    }


    if (book.listing_type === "donate") {

        text += "\nType: Donate";

    }


    if (book.description) {

        text +=
            "\nDetails: " +
            book.description;

    }


    alert(text);

}


// ===============================
// SECURITY
// ===============================
function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
