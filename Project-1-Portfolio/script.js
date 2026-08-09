const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyidTWITklYdlCH04J-K58I4mWuZ8PsdTj86zbfgOrY4qpkNXjvYXBqe2V5cCc5Bsyn/exec";


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
    navLinks?.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("active");
    });
});


/* =========================
   THEME
========================= */

const themeToggle =
    document.getElementById("themeToggle");

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
        document.body.classList.contains("light-theme");

    themeToggle.textContent =
        isLight ? "☀️" : "🌙";

    localStorage.setItem(
        "portfolioTheme",
        isLight ? "light" : "dark"
    );
});


/* =========================
   CURRENT YEAR
========================= */

const year =
    document.getElementById("currentYear");

if (year) {
    year.textContent =
        new Date().getFullYear();
}


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

contactForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        const data = {
            id: Date.now(),
            name: document
                .getElementById("name")
                ?.value.trim(),

            email: document
                .getElementById("email")
                ?.value.trim(),

            subject: document
                .getElementById("subject")
                ?.value.trim(),

            message: document
                .getElementById("message")
                ?.value.trim(),

            timestamp:
                new Date().toISOString()
        };


        if (
            !data.name ||
            !data.email ||
            !data.subject ||
            !data.message
        ) {

            formMessage.textContent =
                "Please fill in all fields.";

            formMessage.style.color =
                "#ef4444";

            return;
        }


        formMessage.textContent =
            "Sending message...";

        formMessage.style.color =
            "#8b5cf6";


        try {

            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },
                        body:
                            JSON.stringify(data)
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Request failed."
                );
            }


            formMessage.textContent =
                "Message sent successfully!";

            formMessage.style.color =
                "#22c55e";

            contactForm.reset();

        } catch (error) {

            console.error(
                "Error sending message:",
                error
            );

            formMessage.textContent =
                "Unable to send message. Please try again.";

            formMessage.style.color =
                "#ef4444";
        }

    }
);