export async function loadComponent(selector, componentName) {
    const container = document.querySelector(selector);
    if (!container) return null;

    // 1. Load HTML Template
    const resHTML = await fetch(`./components/${componentName}/${componentName}.html`);
    if (!resHTML.ok) throw new Error(`Failed to load component HTML: ${componentName}`);
    container.innerHTML = await resHTML.text();

    // 2. Load CSS if not already present
    const cssId = `css-${componentName}`;
    if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = `./components/${componentName}/${componentName}.css`;
        document.head.appendChild(link);
    }

    // 3. Load & Run JS Module if it exists
    try {
        const modulePath = `../../components/${componentName}/${componentName}.js`;
        const module = await import(modulePath);
        if (module.init && typeof module.init === 'function') {
            module.init(container);
        }
    } catch (e) {
        // Silent catch for CSS/HTML-only components
    }
    return container;
}
