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
                // Get source text
                const sourceDiv = document.querySelector("#source-string");
                if (!sourceDiv) {
                    console.error("Source element not found");
                    return;
                }
                const question = (sourceDiv.innerText || sourceDiv.textContent).trim();

                // Get resource from link
                const link = document.querySelector('a[original-title="View string in its resource of origin"]');
                if (!link) {
                    console.error("No matching resource link found");
                    return;
                }
                const resourceMatch = link.href.match(/(HTML-articles-[^/]+)/);
                const resource = resourceMatch ? resourceMatch[1] : null;
                if (!resource) {
                    console.error("Resource slug not found");
                    return;
                }

                // Get string hash
                const labelDiv = Array.from(document.querySelectorAll('div'))
                    .find(div => div.textContent.trim() === "String Hash");
                const stringHash = labelDiv?.nextElementSibling?.textContent.trim() || null;
                if (!stringHash) {
                    console.error("String hash not found");
                    return;
                }
                console.log(`Calling backend with resource=${resource} and stringHash=${stringHash} and question=${question}`);
                // Call backend
                const response = await fetch("http://localhost:3000/api/ask", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question, resource, stringHash })
                });

                const data = await response.json();
                return data.answer;

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