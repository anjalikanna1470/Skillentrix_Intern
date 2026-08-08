const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyidTWITklYdlCH04J-K58I4mWuZ8PsdTj86zbfgOrY4qpkNXjvYXBqe2V5cCc5Bsyn/exec";
// =========================
// PORTFOLIO JAVASCRIPT
// =========================


// =========================
// MOBILE NAVIGATION
// =========================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// Close mobile menu after clicking a navigation link

const navigationLinks = document.querySelectorAll(".nav-links a");

navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });

});


// =========================
// DARK / LIGHT THEME
// =========================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("portfolioTheme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.textContent = "☀️";

} else {

    document.body.classList.remove("light-theme");

    themeToggle.textContent = "🌙";

}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLightTheme =
        document.body.classList.contains("light-theme");

    if (isLightTheme) {

        themeToggle.textContent = "☀️";

        localStorage.setItem(
            "portfolioTheme",
            "light"
        );

    } else {

        themeToggle.textContent = "🌙";

        localStorage.setItem(
            "portfolioTheme",
            "dark"
        );

    }

});


// =========================
// CURRENT YEAR
// =========================

const currentYear =
    document.getElementById("currentYear");

currentYear.textContent =
    new Date().getFullYear();


// =========================
// CONTACT FORM
// =========================

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");


// Submit contact form

contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Get form values

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const subject =
        document.getElementById("subject").value.trim();

    const message =
        document.getElementById("message").value.trim();


    // Validate fields

    if (!name || !email || !subject || !message) {

        formMessage.textContent =
            "Please fill in all fields.";

        formMessage.style.color = "#ef4444";

        return;

    }


    // Create response object

    const newResponse = {

        id: Date.now(),

        name: name,

        email: email,

        subject: subject,

        message: message,

        timestamp: new Date().toISOString()

    };


    // Show sending message

    formMessage.textContent =
        "Sending message...";

    formMessage.style.color =
        "#8b5cf6";


    try {

        /*
         * Send data to Google Apps Script.
         *
         * We use text/plain to avoid a browser
         * preflight request.
         */

        await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(newResponse)

        });


        // Success

        formMessage.textContent =
            "Message sent successfully!";

        formMessage.style.color =
            "#22c55e";


        // Clear form

        contactForm.reset();


        console.log(
            "Response sent to Google Sheets:",
            newResponse
        );


    } catch (error) {

        console.error(
            "Error sending response:",
            error
        );


        formMessage.textContent =
            "Unable to send message. Please try again.";

        formMessage.style.color =
            "#ef4444";

    }

});


// =========================
// ADMIN LOGIN
// =========================

const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("loginMessage");

const adminLogin =
    document.getElementById("adminLogin");

const adminResponses =
    document.getElementById("adminResponses");


// Temporary admin credentials
// We will improve this later.

const ADMIN_USERNAME = "admin";

const ADMIN_PASSWORD = "admin123";

let adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn") === "true";


// Handle admin login

adminLoginForm.addEventListener("submit", (event) => {

    event.preventDefault();


    const username =
        document
            .getElementById("adminUsername")
            .value
            .trim();

    const password =
        document
            .getElementById("adminPassword")
            .value;


    if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
) {

    sessionStorage.setItem(
        "adminLoggedIn",
        "true"
    );

    adminLoggedIn = true;

    adminLogin.classList.add("hidden");

    adminResponses.classList.remove("hidden");

    displayResponses();

    loginMessage.textContent = "";

} else {

    loginMessage.textContent =
        "Invalid username or password.";

    loginMessage.style.color =
        "#ef4444";

}

});


// =========================
// RESTORE ADMIN SESSION
// =========================

if (adminLoggedIn) {

    adminLogin.classList.add("hidden");

    adminResponses.classList.remove("hidden");

    displayResponses();

}

// =========================
// DISPLAY RESPONSES
// =========================

const responsesContainer =
    document.getElementById(
        "responsesContainer"
    );


// =========================
// DISPLAY GOOGLE SHEETS RESPONSES
// =========================

async function displayResponses() {

    responsesContainer.innerHTML = `
        <div class="response-card">
            <h3>Loading responses...</h3>
            <p class="response-message">
                Please wait while responses are retrieved.
            </p>
        </div>
    `;


    try {

        const response = await fetch(
            GOOGLE_SCRIPT_URL
        );


        const data = await response.json();


        if (!data.success) {

            throw new Error(
                data.error || "Unable to retrieve responses."
            );

        }


        const responses = data.responses || [];


        responsesContainer.innerHTML = "";


        // No responses

        if (responses.length === 0) {

            responsesContainer.innerHTML = `
                <div class="response-card">
                    <h3>No responses yet</h3>

                    <p class="response-message">
                        No contact form responses
                        have been received.
                    </p>
                </div>
            `;

            return;

        }


        // Newest responses first

        const newestFirst =
            [...responses].reverse();


        newestFirst.forEach((response) => {

            const responseCard =
                document.createElement("div");


            responseCard.className =
                "response-card";


            const formattedTime =
                new Date(
                    response.timestamp
                ).toLocaleString();


            responseCard.innerHTML = `

                <h3>
                    ${escapeHTML(response.name)}
                </h3>

                <p class="response-email">
                    ${escapeHTML(response.email)}
                </p>

                <p class="response-subject">
                    Subject:
                    ${escapeHTML(response.subject)}
                </p>

                <p class="response-message">
                    ${escapeHTML(response.message)}
                </p>

                <p class="response-time">
                    Received:
                    ${formattedTime}
                </p>

            `;


            responsesContainer.appendChild(
                responseCard
            );

        });


    } catch (error) {

        console.error(
            "Error retrieving responses:",
            error
        );


        responsesContainer.innerHTML = `
            <div class="response-card">

                <h3>
                    Unable to load responses
                </h3>

                <p class="response-message">
                    Please check the Google Apps
                    Script connection.
                </p>

            </div>
        `;

    }

}


// =========================
// SECURITY HELPER
// =========================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


// =========================
// LOGOUT
// =========================

const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {

    sessionStorage.removeItem(
        "adminLoggedIn"
    );

    adminLoggedIn = false;

    adminResponses.classList.add("hidden");

    adminLogin.classList.remove("hidden");

    adminLoginForm.reset();

});


// =========================
// OPEN ADMIN PANEL
// =========================

// For now, open the admin panel
// using the browser console.
//
// Later we will add a proper
// Admin button/navigation link.


function openAdminPanel() {

    const adminSection =
        document.getElementById(
            "adminSection"
        );

    adminSection.classList.remove(
        "hidden"
    );

    adminSection.scrollIntoView({
        behavior: "smooth"
    });

}


// Make function available globally

window.openAdminPanel =
    openAdminPanel;

const adminLink =
    document.getElementById("adminLink");

adminLink.addEventListener("click", (event) => {

    event.preventDefault();

    openAdminPanel();

});

// =========================
// REFRESH RESPONSES
// =========================

const refreshResponses =
    document.getElementById(
        "refreshResponses"
    );

refreshResponses.addEventListener(
    "click",
    () => {

        displayResponses();

    }
);