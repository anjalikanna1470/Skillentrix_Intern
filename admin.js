const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyidTWITklYdlCH04J-K58I4mWuZ8PsdTj86zbfgOrY4qpkNXjvYXBqe2V5cCc5Bsyn/exec";


const loginForm =
    document.getElementById("adminLoginForm");

const loginBox =
    document.getElementById("adminLogin");

const dashboard =
    document.getElementById("adminResponses");

const container =
    document.getElementById("responsesContainer");

const loginMessage =
    document.getElementById("loginMessage");

const refreshButton =
    document.getElementById("refreshResponses");

const logoutButton =
    document.getElementById("logoutButton");

const themeToggle =
    document.getElementById("themeToggle");


/* =========================
   DEMO LOGIN
========================= */

const USERNAME = "admin";
const PASSWORD = "admin123";


/* =========================
   THEME
========================= */

if (
    localStorage.getItem("portfolioTheme") === "light"
) {
    document.body.classList.add("light-theme");

    if (themeToggle) {
        themeToggle.textContent = "☀️";
    }
}

themeToggle?.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    themeToggle.textContent =
        isLight ? "☀️" : "🌙";

    localStorage.setItem(
        "portfolioTheme",
        isLight ? "light" : "dark"
    );
});


/* =========================
   SECURITY HELPER
========================= */

function escapeHTML(value = "") {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* =========================
   LOAD RESPONSES
========================= */

async function displayResponses() {

    if (!container) return;

    container.innerHTML = `
        <div class="response-card">
            <h3>Loading responses...</h3>
            <p class="response-message">
                Please wait...
            </p>
        </div>
    `;


    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL
            );

        if (!response.ok) {
            throw new Error(
                "Unable to connect to server."
            );
        }


        const data =
            await response.json();


        if (!data.success) {
            throw new Error(
                data.error ||
                "Unable to retrieve responses."
            );
        }


        const responses =
            data.responses || [];


        if (!responses.length) {

            container.innerHTML = `
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


        container.innerHTML = "";


        [...responses]
            .reverse()
            .forEach(response => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "response-card";


                const received =
                    response.timestamp
                        ? new Date(
                            response.timestamp
                        ).toLocaleString()
                        : "Unknown";


                card.innerHTML = `
                    <h3>
                        ${escapeHTML(
                            response.name
                        )}
                    </h3>

                    <p class="response-email">
                        ${escapeHTML(
                            response.email
                        )}
                    </p>

                    <p class="response-subject">
                        Subject:
                        ${escapeHTML(
                            response.subject
                        )}
                    </p>

                    <p class="response-message">
                        ${escapeHTML(
                            response.message
                        )}
                    </p>

                    <p class="response-time">
                        Received:
                        ${received}
                    </p>
                `;


                container.appendChild(card);

            });


    } catch (error) {

        console.error(
            "Error retrieving responses:",
            error
        );


        container.innerHTML = `
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


/* =========================
   LOGIN
========================= */

loginForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const username =
            document
                .getElementById(
                    "adminUsername"
                )
                ?.value
                .trim();


        const password =
            document
                .getElementById(
                    "adminPassword"
                )
                ?.value;


        if (
            username === USERNAME &&
            password === PASSWORD
        ) {

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );


            loginBox?.classList.add(
                "hidden"
            );

            dashboard?.classList.remove(
                "hidden"
            );


            if (loginMessage) {
                loginMessage.textContent = "";
            }


            displayResponses();


        } else {

            if (loginMessage) {

                loginMessage.textContent =
                    "Invalid username or password.";

                loginMessage.style.color =
                    "#ef4444";
            }
        }
    }
);


/* =========================
   RESTORE LOGIN
========================= */

if (
    sessionStorage.getItem(
        "adminLoggedIn"
    ) === "true"
) {

    loginBox?.classList.add(
        "hidden"
    );

    dashboard?.classList.remove(
        "hidden"
    );

    displayResponses();
}


/* =========================
   REFRESH
========================= */

refreshButton?.addEventListener(
    "click",
    displayResponses
);


/* =========================
   LOGOUT
========================= */

logoutButton?.addEventListener(
    "click",
    () => {

        sessionStorage.removeItem(
            "adminLoggedIn"
        );

        dashboard?.classList.add(
            "hidden"
        );

        loginBox?.classList.remove(
            "hidden"
        );

        loginForm?.reset();

        if (loginMessage) {
            loginMessage.textContent = "";
        }
    }
);