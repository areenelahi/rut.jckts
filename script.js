
/* ==================================
   RUT STORE SETTINGS
================================== */

// Replace with your business WhatsApp number.
// Format: country code + number, without + or spaces.
const RUT_WHATSAPP_NUMBER = "92XXXXXXXXXX";


/* ==================================
   PRODUCT CATALOGUE
================================== */

const products = [
  {
    id: 1,
    name: "Vintage Leather Jacket",
    category: "PRE-LOVED",
    price: 4500,
    image: "jacket1.jpg"
  },
  {
    id: 2,
    name: "Classic Black Jacket",
    category: "NEW ARRIVAL",
    price: 3800,
    image: "jacket2.jpg"
  },
  {
    id: 3,
    name: "Vintage Denim Jacket",
    category: "PRE-LOVED",
    price: 3200,
    image: "jacket3.jpg"
  },
  {
    id: 4,
    name: "Oversized Streetwear",
    category: "NEW ARRIVAL",
    price: 4200,
    image: "jacket4.jpg"
  },
  {
    id: 5,
    name: "Brown Suede Jacket",
    category: "PRE-LOVED",
    price: 5000,
    image: "jacket5.webp"
  },
  {
    id: 6,
    name: "Everyday Outerwear",
    category: "NEW ARRIVAL",
    price: 3500,
    image: "jacket6.jpg"
  }
];


/* ==================================
   PAGE ELEMENTS
================================== */

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const bagCount = document.getElementById("bag-count");

const checkoutForm = document.getElementById("checkout-form");
const checkoutMessage = document.getElementById("checkout-message");


/* ==================================
   LOAD SAVED CART
================================== */

let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem("rut-cart"));

  if (Array.isArray(savedCart)) {
    cart = savedCart
      .filter(item =>
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 20
      );
  }
} catch (error) {
  cart = [];
}


/* ==================================
   FORMAT PRICE
================================== */

function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}


/* ==================================
   DISPLAY PRODUCTS
================================== */

function displayProducts() {
  productList.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";

    img.onerror = function() {
      imageBox.innerHTML = "";

      const placeholder = document.createElement("div");
      placeholder.className = "image-placeholder";
      placeholder.textContent = product.name;

      imageBox.appendChild(placeholder);
    };

    imageBox.appendChild(img);

    const info = document.createElement("div");
    info.className = "product-info";

    const category = document.createElement("p");
    category.className = "product-tag";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-button";
    button.type = "button";
    button.textContent = "ADD TO BAG";

    button.addEventListener("click", () => {
      addToCart(product.id);
    });

    info.append(category, name, price, button);
    card.append(imageBox, info);

    productList.appendChild(card);
  });
}


/* ==================================
   SAVE CART
================================== */

function saveCart() {
  try {
    localStorage.setItem("rut-cart", JSON.stringify(cart));
  } catch (error) {
    checkoutMessage.textContent =
      "Your browser could not save the bag. Please continue carefully.";
  }
}


/* ==================================
   ADD TO CART
================================== */

function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.quantity >= 20) {
      alert("Maximum quantity reached.");
      return;
    }

    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  updateCart();
}


/* ==================================
   CHANGE QUANTITY
================================== */

function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  if (item.quantity > 20) {
    item.quantity = 20;
  }

  updateCart();
}


/* ==================================
   REMOVE FROM CART
================================== */

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
}


/* ==================================
   UPDATE SHOPPING BAG
================================== */

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    const lineTotal = product.price * item.quantity;

    total += lineTotal;
    totalItems += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = product.name;

    const price = document.createElement("small");
    price.textContent = formatPrice(lineTotal);

    info.append(name, price);

    const quantity = document.createElement("div");
    quantity.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");

    minus.addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    const number = document.createElement("span");
    number.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");

    plus.addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    quantity.append(minus, number, plus);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "REMOVE";

    remove.addEventListener("click", () => {
      removeFromCart(product.id);
    });

    row.append(info, quantity, remove);
    cartItems.appendChild(row);
  });

  if (totalItems === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Your bag is currently empty.";

    cartItems.appendChild(empty);
  }

  cartTotal.textContent = formatPrice(total);
  bagCount.textContent = totalItems;

  saveCart();
}


/* ==================================
   CHECKOUT AND WHATSAPP ORDER
================================== */

checkoutForm.addEventListener("submit", function(event) {
  event.preventDefault();

  checkoutMessage.textContent = "";

  if (cart.length === 0) {
    checkoutMessage.textContent =
      "Your shopping bag is empty. Add a jacket first.";
    return;
  }

  if (!/^\d{10,15}$/.test(RUT_WHATSAPP_NUMBER)) {
    checkoutMessage.textContent =
      "Please add your correct WhatsApp number in script.js.";
    return;
  }

  if (!checkoutForm.reportValidity()) {
    return;
  }

  const formData = new FormData(checkoutForm);

  const customer = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    city: formData.get("city").trim(),
    address: formData.get("address").trim(),
    notes: formData.get("notes").trim()
  };

  let orderTotal = 0;
  const orderLines = [];

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);

    if (!product) return;

    const lineTotal = product.price * item.quantity;
    orderTotal += lineTotal;

    orderLines.push(
      `${product.name} x ${item.quantity} = ${formatPrice(lineTotal)}`
    );
  });

  const message = `
HELLO RUT! I WOULD LIKE TO PLACE AN ORDER.

CUSTOMER DETAILS

Name: ${customer.name}
Phone: ${customer.phone}
City: ${customer.city}
Delivery address: ${customer.address}

ORDER DETAILS

${orderLines.join("\n")}

SUBTOTAL: ${formatPrice(orderTotal)}

Order notes: ${customer.notes || "None"}

Please confirm availability, delivery charges and payment details.

Thank you!
  `.trim();

  const whatsappURL =
    "https://wa.me/" +
    RUT_WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  const newWindow = window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    checkoutMessage.textContent =
      "WhatsApp could not open. Please allow pop-ups and try again.";
    return;
  }

  checkoutMessage.textContent =
    "Your order message is ready in WhatsApp. Review it and press Send.";
});


/* ==================================
   FOOTER YEAR
================================== */

document.getElementById("year").textContent =
  new Date().getFullYear();


/* ==================================
   START WEBSITE
================================== */

displayProducts();
updateCart();
