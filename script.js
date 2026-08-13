// ======================================
// FORM OPEN / CLOSE
// ======================================

function openForm(type) {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

    const selectedForm = document.getElementById(type + "-form");

    if (selectedForm) {
        selectedForm.classList.add("active");
    }
}


// ======================================
// BACK BUTTON
// ======================================

function closeForm() {

    document.querySelectorAll(".popup-form").forEach(function(form) {
        form.classList.remove("active");
    });

}


// ======================================
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL = "https://ewammndvxdenjrhaazsh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================
// FORM SUBMIT + SAVE DATA
// ======================================

document.addEventListener("DOMContentLoaded", function() {

    document.querySelectorAll(".popup-form").forEach(function(form) {

        form.addEventListener("submit", async function(event) {

            // 405 Not Allowed रोकें
            event.preventDefault();

            const formData = new FormData(form);

            const bookData = {

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


            const { error } = await supabaseClient
                .from("books")
                .insert([bookData]);


            if (error) {

                console.error("Save Error:", error);

                alert(
                    "Data save नहीं हुआ:\n" +
                    error.message
                );

                return;
            }


            alert("Book successfully saved!");


            form.reset();

            closeForm();

            // Save के बाद Explore को तुरंत refresh करें
            loadBooks();

        });

    });


    // Website खुलते ही books load करें
    loadBooks();

});


// ======================================
// LOAD BOOKS FROM SUPABASE
// ======================================

async function loadBooks() {

    const bookGrid =
        document.getElementById("bookGrid");


    if (!bookGrid) {

        console.log("bookGrid नहीं मिला");

        return;
    }


    bookGrid.innerHTML =
        "<p>Loading books...</p>";


    const { data: books, error } =
        await supabaseClient
            .from("books")
            .select("*");


    if (error) {

        console.error(
            "Explore Books Error:",
            error
        );

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

        let type = "FOR SALE";
        if (book.listing_type === "exchange") {
            type = "EXCHANGE";
        }


        if (book.listing_type === "donate") {
            type = "DONATE";
        }


        let price = "";


        if (
            book.listing_type === "sell" &&
            book.price !== null &&
            book.price !== ""
        ) {

            price = "₹" + book.price;

        }


        if (book.listing_type === "exchange") {
            price = "Exchange";
        }


        if (book.listing_type === "donate") {
            price = "Free";
        }


        const card =
            document.createElement("div");


        card.className = "book-card";


        // IMPORTANT: HTML को backticks के अंदर रखा गया है
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

                </div>

            </div>

        ;


        bookGrid.appendChild(card);

    });

}
        
