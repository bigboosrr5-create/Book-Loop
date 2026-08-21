// ======================================================
// BOOK-LOOP FINAL SCRIPT (FIXED)
// ======================================================

// ------------------------------------------------------
// SUPABASE CLIENT
// ------------------------------------------------------
const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";
const SUPABASE_KEY = "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

let supabaseClient = null;

if (typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
    console.error("Supabase library नहीं मिली।");
}

// ======================================================
// OPEN / CLOSE FORM POPUPS
// ======================================================

function openForm(type) {
    document.querySelectorAll(".popup-form").forEach(function (form) {
        form.classList.remove("active");
    });
    const selectedForm = document.getElementById(type + "-form");
    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}

function closeForm() {
    document.querySelectorAll(".popup-form").forEach(function (form) {
        form.classList.remove("active");
    });
}

// ======================================================
// GET FORM DATA
// ======================================================

function getBookData(form) {
    const formData = new FormData(form);
    const price = formData.get("price");

    return {
        book_title: formData.get("book_title") || null,
        author: formData.get("author") || null,
        category: formData.get("category") || null,
        course: formData.get("course") || null,
        semester: formData.get("semester") || null,
        book_condition: formData.get("book_condition") || null,
        price: price !== null && price !== "" ? Number(price) : null,
        location: formData.get("location") || null,
        contact_number: formData.get("contact_number") || null,
        description: formData.get("description") || null,
        listing_type: formData.get("listing_type") || null,
        wanted_book: formData.get("wanted_book") || null
    };
}

// ======================================================
// SAVE DATA TO SUPABASE
// ======================================================

async function saveBookForm(form) {
    if (!supabaseClient) {
        alert("❌ Supabase connection नहीं मिली।");
        return;
    }

    const button = form.querySelector('button[type="submit"]');

    try {
        if (button) {
            button.disabled = true;
            button.textContent = "Saving...";
        }

        const bookData = getBookData(form);
        console.log("Data भेजा जा रहा है:", bookData);

        const { data, error } = await supabaseClient
            .from("books")
            .insert([bookData])
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            alert("❌ Data save नहीं हुआ!\n\n" + error.message);
            return;
        }

        console.log("Data saved:", data);
        alert("✅ Data successfully saved!");

        form.reset();
        closeForm();
        loadBooks();

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error:\n\n" + error.message);

    } finally {
        if (button) {
            button.disabled = false;
            button.textContent = "Submit";
        }
    }
}

// ======================================================
// FORM SUBMIT — SINGLE HANDLER, ATTACHED ONCE
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".popup-form").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // stops the native POST that causes the 405
            saveBookForm(form);
        });
    });
});

// ======================================================
// LOAD BOOKS
// ======================================================

async function loadBooks() {
    const bookGrid = document.getElementById("bookGrid");
    if (!bookGrid) return;

    if (!supabaseClient) {
        bookGrid.innerHTML = "<p>Supabase connection नहीं मिली।</p>";
        return;
    }

    bookGrid.innerHTML = "<p>Loading books...</p>";

    try {
        const { data: books, error } = await supabaseClient
            .from("books")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Load Error:", error);
            bookGrid.innerHTML = "<p>Books load नहीं हो सकीं।</p>";
            return;
        }

        if (!books || books.length === 0) {
            bookGrid.innerHTML = "<p>अभी कोई book listed नहीं है।</p>";
            return;
        }

        bookGrid.innerHTML = "";

        books.forEach(function (book) {
            let type = "BOOK";
            let price = "";

            if (book.listing_type === "sell") {
                type = "FOR SALE";
            } else if (book.listing_type === "exchange") {
                type = "EXCHANGE";
            } else if (book.listing_type === "donate") {
                type = "DONATE";
            }

            if (book.listing_type === "sell" && book.price !== null && book.price !== "") {
                price = "₹" + book.price;
            } else if (book.listing_type === "exchange") {
                price = "Exchange";
            } else if (book.listing_type === "donate") {
                price = "Free";
            }

            const authorHTML = book.author ? `<p>📖 ${escapeHTML(book.author)}</p>` : "";
            const categoryHTML = book.category ? `<p>${escapeHTML(book.category)}</p>` : "";
            const courseHTML = book.course ? `<p>${escapeHTML(book.course)}</p>` : "";
            const semesterHTML = book.semester ? `<p>${escapeHTML(book.semester)}</p>` : "";
            const locationHTML = book.location ? `<p>📍 ${escapeHTML(book.location)}</p>` : "";

            const card = document.createElement("div");
            card.className = "book-card";

            card.innerHTML = `
                <div class="book-image purple">📚</div>
                <div class="book-info">
                    <span class="tag">${type}</span>
                    <h3>${escapeHTML(book.book_title || "Book")}</h3>
                    ${authorHTML}
                    ${categoryHTML}
                    ${courseHTML}
                    ${semesterHTML}
                    ${locationHTML}
                    <div class="book-bottom">
                        <strong>${price}</strong>
                        <button type="button" onclick="showBookDetails('${book.id}')">View</button>
                    </div>
                </div>
            `;

            bookGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Books Error:", error);
        bookGrid.innerHTML = "<p>Books load करते समय समस्या आई।</p>";
    }
}

// ======================================================
// ESCAPE HTML
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
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    loadBooks();
});
function showBookDetails(id) {

    if (!id) {
        console.error("Book ID नहीं मिली।");
        return;
    }

    window.location.href =
        "book-details.html?id=" +
        encodeURIComponent(id);
}
