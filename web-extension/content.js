// Only run on pages that start with the specific URL
const targetPrefix = "https://app.transifex.com/360learning/360learning-kb-test/translate/#fr_FR";

if (window.location.href.startsWith(targetPrefix)) {
  console.log("BAITT locked and loaded");

  // Wait for the DOM to be ready
  window.addEventListener("load", () => {
    // Find the ul.actions inside #toolbelt
    const actionsUl = document.querySelector("#toolbelt ul.actions");
    if (!actionsUl) return;

    // Create a new li for the button
    const li = document.createElement("li");
    li.className = "u-borderRight-divider";

    // Create the button/link
    const a = document.createElement("a");
    a.href = "javascript:!";
    a.role = "button";
    a.className = "u-display-block u-padding-2x u-color-important";
    a.textContent = "BAITT";
    a.title = "Ask BAITT";

    // Click event triggers backend call using #source-string content
    a.addEventListener("click", async () => {
      try {
        const sourceDiv = document.querySelector("#source-string");
        const translatedDiv = document.querySelector("#translated-string");
        if (!sourceDiv) {
          console.error("#source-string not found");
          return;
        }
        if (!translatedDiv) {
          console.error("#translated-string not found");
          return;
        }

        // Strip HTML tags
        const question = sourceDiv.innerText || sourceDiv.textContent;

        // Call backend
        const response = await fetch("http://localhost:3000/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question })
        });

        const data = await response.json();

        // Insert answer into #translated-string
        translatedDiv.textContent = data.answer;

      } catch (err) {
        console.error("Error calling backend:", err);
      }
    });

    li.appendChild(a);
    actionsUl.appendChild(li);
  });
}
