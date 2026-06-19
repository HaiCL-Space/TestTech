const STORAGE_KEY = "pages_and_co_bag";

export function getBag() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

export function saveBag(bag) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bag));
  } catch (e) {
    console.error("Error saving bag to localStorage:", e);
  }
}

export function getBagCount() {
  const bag = getBag();
  return bag.reduce((total, item) => total + (item.quantity || 1), 0);
}

export function addToBag(book, quantity = 1) {
  const bag = getBag();
  const existingItem = bag.find((item) => item.title === book.title);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    bag.push({
      title: book.title,
      author: book.author,
      priceSale: book.priceSale,
      priceOriginal: book.priceOriginal || null,
      coverColor: book.coverColor || "color-green",
      quantity: quantity,
    });
  }

  saveBag(bag);
  dispatchBagUpdate();
}

export function updateQuantity(title, quantity) {
  let bag = getBag();
  const itemIndex = bag.findIndex((item) => item.title === title);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      bag.splice(itemIndex, 1);
    } else {
      bag[itemIndex].quantity = quantity;
    }
    saveBag(bag);
    dispatchBagUpdate();
  }
}

export function removeFromBag(title) {
  let bag = getBag();
  bag = bag.filter((item) => item.title !== title);
  saveBag(bag);
  dispatchBagUpdate();
}

export function clearBag() {
  localStorage.removeItem(STORAGE_KEY);
  dispatchBagUpdate();
}

function dispatchBagUpdate() {
  const count = getBagCount();
  window.dispatchEvent(
    new CustomEvent("bag-updated", { detail: { count, isTotal: true } }),
  );
}
