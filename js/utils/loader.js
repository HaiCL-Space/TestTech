export async function loadComponent(selector, componentName) {
  const container = document.querySelector(selector);
  if (!container) return null;

  // 1. Load HTML Template
  const resHTML = await fetch(
    `./components/${componentName}/${componentName}.html?v=${Date.now()}`,
  );
  if (!resHTML.ok)
    throw new Error(`Failed to load component HTML: ${componentName}`);
  container.innerHTML = await resHTML.text();

  // 2. Load CSS
  const cssId = `css-${componentName}`;
  if (!document.getElementById(cssId)) {
    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = `./components/${componentName}/${componentName}.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  // 3. Load & Run JS Module
  try {
    const modulePath = `../../components/${componentName}/${componentName}.js?v=${Date.now()}`;
    const module = await import(modulePath);
    if (module.init && typeof module.init === "function") {
      module.init(container);
    }
  } catch (e) {}
  return container;
}
