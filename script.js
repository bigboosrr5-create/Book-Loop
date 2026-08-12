/* =========================================
   BOOKLOOP - SUPABASE CONNECTION
========================================= */

const SUPABASE_URL =
    "https://ewammndvxdenjrhaazsh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_RybHu-aZHpHct_aJyXYNrA_gr1IFfbD";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


let currentType = "sell";


/* =========================================
   OPEN FORM
========================================= */

function openForm(type){

    currentType = type;

    const modal =
        document.getElementById("formModal");

    const priceField =
        document.getElementById("priceField");

    const wantedField =
        document.getElementById("wantedField");

    const formTitle =
        document.getElementById("formTitle");

    const formType =
        document.getElementById("formType");

    const formNote =
        document.getElementById("formNote");

    const formIcon =
        document.getElementById("formIcon");


    if(type === "sell"){

        formIcon.innerText = "💰";

        formType.innerText =
            "SELL YOUR BOOK";

        formTitle.innerText =
            "Sell Your Book";

        formNote.innerText =
            "Enter your book details and connect with interested readers.";

        priceField.classList.remove("hide");

        wantedField.classList.add("hide");
    }


    if(type === "exchange"){

        formIcon.innerText = "🔄";

        formType.innerText =
            "BOOK EXCHANGE";

        formTitle.innerText =
            "Exchange Your Book";

        formNote.innerText =
            "Tell us about your book and which book you want in exchange.";

        priceField.classList.add("hide");

        wantedField.classList.remove("hide");
    }


    if(type === "donate"){

        formIcon.innerText = "🎁";

        formType.innerText =
            "DONATE A BOOK";

        formTitle.innerText =
            "Donate Your Book";

        formNote.innerText =
            "Share your book with another reader.";

        priceField.classList.add("hide");

        wantedField.classList.add("hide");
    }


    document
        .getElementById("bookForm")
        .style.display = "block";


    document
        .getElementById("success")
        .classList.remove("active");


    modal.classList.add("active");
}


/* =========================================
   CLOSE FORM
========================================= */

function closeForm(){

    document
        .getElementById("formModal")
        .classList
        .remove("active");

}


/* =========================================
   SUBMIT BOOK
========================================= */

document
    .getElementById("bookForm")
    .addEventListener(
        "submit",
        async function(event){

            event.preventDefault();


            const submitButton =
                document.querySelector(
                    ".submit-btn"
                );


            submitButton.disabled = true;

            submitButton.innerText =
                "Saving Book...";


            const bookData = {

                book_title:
                    document
                        .getElementById("bookTitle")
                        .value
                        .trim(),

                author:
                    document
                        .getElementById("author")
                        .value
                        .trim(),

                category:
                    document
                        .getElementById("category")
                        .value
                        .trim(),

                course:
                    document
                        .getElementById("course")
                        .value
                        .trim(),

                semester:
                    document
                        .getElementById("semester")
                        .value
                        .trim(),
                        condition:
                    document
                        .getElementById("condition")
                        .value,

                price:
                    document
                        .getElementById("price")
                        .value || null,

                wanted_book:
                    document
                        .getElementById("wantedBook")
                        .value
                        .trim(),

                location:
                    document
                        .getElementById("location")
                        .value
                        .trim(),

                contact_number:
                    document
                        .getElementById("contact")
                        .value
                        .trim(),

                description:
                    document
                        .getElementById("description")
                        .value
                        .trim()

            };


            /* SAVE TO SUPABASE */

            const { data, error } =
                await supabaseClient
                    .from("books")
                    .insert([bookData])
                    .select();


            if(error){

                console.error(error);

                alert(
                    "Book save नहीं हुई.\n\n" +
                    error.message
                );

                submitButton.disabled = false;

                submitButton.innerText =
                    "Submit Listing →";

                return;
            }


            /* SUCCESS */

            document
                .getElementById("bookForm")
                .style.display = "none";


            document
                .getElementById("success")
                .classList
                .add("active");


            submitButton.disabled = false;

            submitButton.innerText =
                "Submit Listing →";


            /* COMMUNITY LIBRARY REFRESH */

            loadBooks();

        }
    );


/* =========================================
   LOAD BOOKS FROM SUPABASE
========================================= */

async function loadBooks(){

    const grid =
        document.getElementById("bookGrid");


    if(!grid){
        return;
    }


    grid.innerHTML = 
        <div class="empty-books">
            <div class="empty-icon">⏳</div>
            <h3>Loading Books...</h3>
            <p>Please wait.</p>
        </div>
    ;


    const { data, error } =
        await supabaseClient
            .from("books")
            .select("*")
            .order("id", {
                ascending:false
            });


    if(error){

        console.error(error);

        grid.innerHTML = 
            <div class="empty-books">
                <div class="empty-icon">⚠️</div>
                <h3>Unable to load books</h3>
                <p>${error.message}</p>
            </div>
        ;

        return;
    }


    if(!data || data.length === 0){

        grid.innerHTML = 
            <div class="empty-books">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    No books listed yet
                </h3>

                <p>
                    Be the first reader to
                    share a book.
                </p>

                <button
                    onclick="openForm('sell')"
                >
                    + List Your Book
                </button>

            </div>
        ;

        return;
    }


    grid.innerHTML = "";


    data.forEach(function(book){

        const card =
            document.createElement("div");


        card.className =
            "book-card";


        let priceText = "Free";

        if(book.price){
            priceText =
                "₹" + book.price;
        }


        card.innerHTML = `

            <div class="book-image purple">
                📚
            </div>


            <div class="book-info">
            <span class="tag">
                    BOOK
                </span>


                <h3>
                    ${escapeHTML(
                        book.book_title || ""
                    )}
                </h3>


                ${
                    book.author
                    ?
                    <p>✍️ ${
                        escapeHTML(book.author)
                    }</p>
                    :
                    ""
                }


                ${
                    book.category
                    ?
                    <p>📖 ${
                        escapeHTML(book.category)
                    }</p>
                    :
                    ""
                }


                ${
                    book.course
                    ?
                    <p>🎓 ${
                        escapeHTML(book.course)
                    }</p>
                    :
                    ""
                }


                ${
                    book.location
                    ?
                    <p>📍 ${
                        escapeHTML(book.location)
                    }</p>
                    :
                    ""
                }


                <div class="book-bottom">

                    <strong>
                        ${priceText}
                    </strong>


                    <button
                        onclick='viewBook(${JSON.stringify(book)})'
                    >
                        View
                    </button>

                </div>

            </div>
        `;


        grid.appendChild(card);

    });

}


/* =========================================
   VIEW BOOK DETAILS
========================================= */

function viewBook(book){

    let message =
        "📚 " +
        (book.book_title || "Book");


    if(book.author){
        message +=
            "\n✍️ Author: " +
            book.author;
    }


    if(book.category){
        message +=
            "\n📖 Category: " +
            book.category;
    }


    if(book.course){
        message +=
            "\n🎓 Course: " +
            book.course;
    }


    if(book.semester){
        message +=
            "\n📚 Semester: " +
            book.semester;
    }


    if(book.condition){
        message +=
            "\n⭐ Condition: " +
            book.condition;
    }


    if(book.price){
        message +=
            "\n💰 Price: ₹" +
            book.price;
    }


    if(book.location){
        message +=
            "\n📍 Location: " +
            book.location;
    }


    if(book.contact_number){
        message +=
            "\n📞 Contact: " +
            book.contact_number;
    }


    if(book.description){
        message +=
            "\n\n" +
            book.description;
    }


    alert(message);

}


/* =========================================
   SECURITY HELPER
========================================= */

function escapeHTML(value){

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   START
========================================= */

loadBooks();
