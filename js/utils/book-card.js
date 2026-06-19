export function truncate(str, max = 22) {
  return str.length > max ? str.slice(0, max).trimEnd() + '...' : str;
}

function buildTagHTML(tag) {
  if (!tag) return '';
  if (tag === 'bestseller') {
    return `<span class="cover-tag tag-bestseller">BESTSELLER</span>`;
  }
  if (tag === 'new') {
    return `<span class="cover-tag tag-new">NEW</span>`;
  }
  return '';
}

export function buildCard(book) {
  const originalHTML = book.priceOriginal
    ? `<span class="price-original">${book.priceOriginal}</span>`
    : '';
  return `
    <a href="./detail.html?title=${encodeURIComponent(book.title)}" class="book-card">
      <div class="book-cover-wrapper">
        <div class="book-cover ${book.coverColor}">
          ${buildTagHTML(book.tag)}
          <div class="cover-text">
            <span class="cover-title">${book.title}</span>
            <span class="cover-author">${book.author}</span>
          </div>
        </div>
      </div>
      <h3 class="book-title">${truncate(book.title)}</h3>
      <p class="book-author">${book.author}</p>
      <div class="book-pricing">
        <span class="price-sale">${book.priceSale}</span>
        ${originalHTML}
        <span class="book-rating"><span class="star-icon">&#9733;</span> ${book.rating}</span>
      </div>
    </a>`;
}
