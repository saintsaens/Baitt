// Only run on pages that start with the specific URL
const targetPrefix = "https://app.transifex.com/360learning/360learning-kb-test/translate/#fr_FR";

if (window.location.href.startsWith(targetPrefix)) {
    console.log("BAITT locked and loaded");

    window.addEventListener("load", () => {
        const actionsUl = document.querySelector("#toolbelt ul.actions");
        if (!actionsUl) return;

        // Create li + button
        const li = document.createElement("li");
        li.className = "u-borderRight-divider";

        const a = document.createElement("a");
        a.href = "javascript:!";
        a.role = "button";
        a.className = "u-display-block u-padding-2x u-color-important";
        a.textContent = "BAITT";
        a.title = "Click BAITT";

        // Core BAITT call function
        async function runBAITT() {
            try {
                const sourceDiv = document.querySelector("#source-string");
                const translatedDiv = document.querySelector("#translated-string");
                if (!sourceDiv || !translatedDiv) {
                    console.error("Source or translated string element not found");
                    return;
                }

                const question = sourceDiv.innerText || sourceDiv.textContent;

                const response = await fetch("http://localhost:3000/api/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question })
                });

                const data = await response.json();

                translatedDiv.innerHTML = data.answer;
            } catch (err) {
                console.error("Error calling backend:", err);
            }
        }

        // Button click
        a.addEventListener("click", runBAITT);

        // Keyboard shortcut ⌘+G
        document.addEventListener("keydown", (e) => {
            if (e.metaKey && e.key.toLowerCase() === "g") {
                e.preventDefault();   // stop browser "find next"
                e.stopPropagation();  // stop bubbling
                runBAITT();
            }
        });

        li.appendChild(a);
        actionsUl.appendChild(li);
    });
}