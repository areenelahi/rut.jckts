
/* ==================================
   RUT STORE SETTINGS
================================== */

const whatsappNumber = "923710998109";


/* ==================================
   PRODUCT CATALOGUE
================================== */

const products = [
  {
    id: 101,
    name: "Bombar Jacket",
    category: "JACKET",
    price: 5499,
    image: "pic4.jpeg",
    images: [
      "pic4.jpeg",
      "pic2.jpeg",
      "pic3.jpeg",
      "pic1.jpeg",
      "pic5.jpeg"
    ]
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
   FORMAT PRICE
================================== */

function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-PK");
}


/* ==================================
   SHOPPING CART STORAGE
================================== */

let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem("rut-cart"));

  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(item =>
      products.some(product => product.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 20
    );
  }
} catch (error) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("rut-cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Could not save shopping bag", error);
  }
}


/* ==================================
   DISPLAY JACKET PRODUCTS
================================== */

function displayProducts() {
  if (!productList) {
    console.error("Product list element not found");
    return;
  }

  productList.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("article");
    card.className = "product-card";

    // Main jacket image

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";

    const mainImage = document.createElement("img");
    mainImage.src = product.image;
    mainImage.alt = product.name;
    mainImage.loading = "lazy";

    mainImage.onerror = function () {
      mainImage.style.display = "none";

      let placeholder = imageBox.querySelector(".image-placeholder");

      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.className = "image-placeholder";
        imageBox.appendChild(placeholder);
      }

      placeholder.textContent = "Image not found";
    };

    mainImage.onload = function () {
      mainImage.style.display = "block";

      const placeholder = imageBox.querySelector(".image-placeholder");
      if (placeholder) placeholder.remove();
    };

    imageBox.appendChild(mainImage);

    // Five jacket photos

    const gallery = document.createElement("div");
    gallery.className = "product-gallery";

    const images = product.images || [product.image];

    images.forEach((image, index) => {

      const thumbnail = document.createElement("button");
      thumbnail.type = "button";
      thumbnail.className = "gallery-thumbnail";
      thumbnail.setAttribute(
        "aria-label",
        "View jacket photo " + (index + 1)
      );

      if (index === 0) {
        thumbnail.classList.add("active");
      }

      const thumbnailImage = document.createElement("img");
      thumbnailImage.src = image;
      thumbnailImage.alt = product.name + " photo " + (index + 1);
      thumbnailImage.loading = "lazy";

      thumbnail.appendChild(thumbnailImage);

      thumbnail.addEventListener("click", () => {

        mainImage.src = image;
        mainImage.alt = thumbnailImage.alt;

        gallery.querySelectorAll(".gallery-thumbnail")
          .forEach(btn => btn.classList.remove("active"));

        thumbnail.classList.add("active");
      });

      gallery.appendChild(thumbnail);
    });

    // Product details

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

    // Add to bag

    const button = document.createElement("button");
    button.className = "add-button";
    button.type = "button";
    button.textContent = "ADD TO BAG";

    button.addEventListener("click", () => {
      addToCart(product.id);
    });

    info.append(category, name, price, button);

    card.append(imageBox, gallery, info);

    productList.appendChild(card);
  });
}


/* ==================================
   ADD TO CART
================================== */

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

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
  if (!cartItems || !cartTotal || !bagCount) return;

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
   WHATSAPP CHECKOUT
================================== */

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (checkoutMessage) {
      checkoutMessage.textContent = "";
    }

    if (cart.length === 0) {
      if (checkoutMessage) {
        checkoutMessage.textContent =
          "Your shopping bag is empty. Add a jacket first.";
      }
      return;
    }

    if (!/^\d{10,15}$/.test(whatsappNumber)) {
      if (checkoutMessage) {
        checkoutMessage.textContent =
          "Please check the WhatsApp number in script.js.";
      }
      return;
    }

    if (!checkoutForm.reportValidity()) return;

    const formData = new FormData(checkoutForm);

    const customer = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      notes: String(formData.get("notes") || "").trim()
    };

    if (!customer.name || !customer.phone ||
        !customer.city || !customer.address) {
      if (checkoutMessage) {
        checkoutMessage.textContent =
          "Please complete all required delivery details.";
      }
      return;
    }

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

Shipping charges: Please confirm.

Order notes: ${customer.notes || "None"}

Please confirm availability and payment details.

Thank you!
    `.trim();

    const whatsappURL =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    window.location.href = whatsappURL;
  });
}


/* ==================================
   FOOTER YEAR
================================== */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* ==================================
   START WEBSITE
================================== */

displayProducts();
updateCart();

