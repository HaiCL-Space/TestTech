export async function loadComponent(selector, componentName) {
  const container = document.querySelector(selector);
  if (!container) return null;

  // 1. Prepare CSS load promise (to run in parallel with HTML fetch)
  const cssId = `css-${componentName}`;
  let cssPromise = Promise.resolve();

  if (!document.getElementById(cssId)) {
    cssPromise = new Promise((resolve) => {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = `./components/${componentName}/${componentName}.css?v=${Date.now()}`;
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Resolve even on error to avoid blocking the load flow
      document.head.appendChild(link);
    });
  }

  // 2. Fetch HTML template
  const htmlPromise = fetch(
    `./components/${componentName}/${componentName}.html?v=${Date.now()}`,
  ).then(async (resHTML) => {
    if (!resHTML.ok)
      throw new Error(`Failed to load component HTML: ${componentName}`);
    return resHTML.text();
  });

  // Wait for both CSS to load/apply and HTML template text to be retrieved
  const [_, htmlText] = await Promise.all([cssPromise, htmlPromise]);
  container.innerHTML = htmlText;

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

