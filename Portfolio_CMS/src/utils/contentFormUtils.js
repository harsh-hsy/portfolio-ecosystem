export function listToLines(items = []) {
  return items.join("\n");
}

export function linesToList(value = "") {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function csvToList(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function listToCsv(items = []) {
  return items.join(", ");
}

export function createSocials(profile) {
  return [
    { label: "GitHub", href: profile.github, icon: "github" },
    { label: "LinkedIn", href: profile.linkedin, icon: "linkedin" },
    { label: "Email", href: `mailto:${profile.email}`, icon: "email" },
  ];
}

export function getSection(portfolio, key) {
  return portfolio?.sections?.[key] ?? {};
}

export function updateSection(portfolio, key, section) {
  return {
    ...portfolio,
    sections: {
      ...(portfolio.sections ?? {}),
      [key]: {
        ...(portfolio.sections?.[key] ?? {}),
        ...section,
      },
    },
  };
}

export function toPrettyJson(value) {
  return JSON.stringify(value ?? [], null, 2);
}

export function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    const error = new Error("Invalid JSON format. Please fix the editor content before saving.");
    error.fallback = fallback;
    throw error;
  }
}

export function factsToLines(facts = []) {
  return facts
    .map((fact) => [fact.label, fact.value, fact.icon].filter(Boolean).join(" | "))
    .join("\n");
}

export function linesToFacts(value = "") {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", factValue = "", icon = "user"] = line
        .split("|")
        .map((item) => item.trim());

      return { label, value: factValue, icon };
    });
}
