// transifex.js
export async function updateTranslation({ translatedString, resource, stringHash }) {
  if (!translatedString || !resource || !stringHash) {
    throw new Error("translatedString, resource, and stringHash are required");
  }

  const org = "o:360learning";
  const project = "p:360learning-kb-test";
  const language = "l:fr_FR";

  const resourceId = `r:${resource}`;
  const stringId = `s:${stringHash}`;

  const fullId = `${org}:${project}:${resourceId}:${stringId}:${language}`;
  const url = `https://rest.api.transifex.com/resource_translations/${encodeURIComponent(fullId)}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.TRANSIFEX_API_KEY}`,
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json"
    },
    body: JSON.stringify({
      data: {
        id: fullId,
        type: "resource_translations",
        attributes: {
          strings: { other: translatedString },
          reviewed: false
        }
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errMsg = data?.errors?.[0]?.detail || "Failed to update translation";
    throw new Error(`Transifex API error (${response.status}): ${errMsg}`);
  }

  return data;
}
