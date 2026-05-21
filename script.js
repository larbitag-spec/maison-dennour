const heroBanner = document.querySelector(".hero-banner");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".nav");
const catalogItems = Array.from(document.querySelectorAll(".catalog-item"));
const catalogTriggers = Array.from(document.querySelectorAll(".catalog-trigger"));
const menuDrilldowns = Array.from(document.querySelectorAll(".menu-drilldown"));
const overlay = document.querySelector(".overlay");
const cartLink = document.querySelector(".cart-link");
const cartPanel = document.querySelector(".cart-panel");
const cartItems = document.querySelector(".cart-items");
const emptyCart = document.querySelector(".empty-cart");
const cartTotal = document.querySelector(".cart-total strong");
const closePanelButtons = Array.from(document.querySelectorAll(".panel-close, .panel-close-action"));
const productCards = Array.from(document.querySelectorAll(".product-card"));
const productButtons = Array.from(document.querySelectorAll(".product-card button"));
const heroProductLinks = Array.from(document.querySelectorAll(".hero-product-link"));
const homeLinks = Array.from(document.querySelectorAll("[data-home-link]"));
const productDetail = document.querySelector(".product-detail");
const backToHome = document.querySelector(".back-to-home");
const detailAddCart = document.querySelector(".detail-add-cart");
const detailQuantity = document.querySelector(".detail-quantity");
const relatedProducts = document.querySelector(".related-products");
const tabButtons = Array.from(document.querySelectorAll(".tab-list button"));
const cart = [];
let activeProduct;

if (heroBanner) {
  const slides = Array.from(heroBanner.querySelectorAll(".banner-slide"));
  const dots = Array.from(heroBanner.querySelectorAll(".slider-dots span"));
  const prev = heroBanner.querySelector(".slider-prev");
  const next = heroBanner.querySelector(".slider-next");
  let currentSlide = 0;
  let sliderTimer;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentSlide);
    });
  };

  const startSlider = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || slides.length < 2) return;
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => showSlide(currentSlide + 1), 4500);
  };

  const restartSlider = () => {
    window.clearInterval(sliderTimer);
    startSlider();
  };

  prev.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartSlider();
  });
  next.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartSlider();
  });
  heroBanner.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
  heroBanner.addEventListener("mouseleave", startSlider);
  heroBanner.addEventListener("focusin", () => window.clearInterval(sliderTimer));
  heroBanner.addEventListener("focusout", startSlider);
  showSlide(0);
  startSlider();
}

let toastTimer;

const toast = document.createElement("div");
toast.className = "cart-toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

const formatPrice = (value) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);

const parsePrice = (value) => Number(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

const makeReference = (title) =>
  `MDN-${Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0).toString().slice(0, 5)}`;

const getProductData = (card) => {
  const title = card?.querySelector("h3")?.textContent.trim() || "Produit Maison d'Ennour";
  const priceText = card?.querySelector(".price")?.textContent.trim() || "0,00 €";
  const tag = card?.querySelector(".tag")?.textContent.trim() || "Livre";
  const image = card?.querySelector("img")?.getAttribute("src") || "assets/logo-maison-ennour.svg";

  return {
    title,
    price: parsePrice(priceText),
    priceText,
    tag,
    image,
    reference: makeReference(title),
    description: `Un ouvrage du rayon ${tag.toLowerCase()}, présenté avec les informations essentielles pour aider le lecteur à choisir rapidement.`,
    longDescription: `${title} est mis en avant dans cette maquette avec une fiche claire : disponibilité, prix, résumé, catégories et informations complémentaires, comme sur une vraie page produit Maison d'Ennour.`,
  };
};

const setOverlay = () => {
  const panelOpen = cartPanel?.classList.contains("is-open");
  const menuOpen = mainNav?.classList.contains("is-open");
  overlay?.classList.toggle("is-visible", Boolean(panelOpen || menuOpen));
};

const openCart = () => {
  cartPanel?.classList.add("is-open");
  cartPanel?.setAttribute("aria-hidden", "false");
  cartLink?.setAttribute("aria-expanded", "true");
  setOverlay();
};

const closeCart = () => {
  cartPanel?.classList.remove("is-open");
  cartPanel?.setAttribute("aria-hidden", "true");
  cartLink?.setAttribute("aria-expanded", "false");
  setOverlay();
};

const closeMenu = () => {
  mainNav?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  closeCatalogMenus();
  setOverlay();
};

function closeCatalogMenus(exceptItem) {
  catalogItems.forEach((item) => {
    if (item === exceptItem) return;
    item.classList.remove("is-open");
    item.querySelector(".catalog-trigger")?.setAttribute("aria-expanded", "false");
    item.querySelectorAll("[data-menu-panel]").forEach((panel) => {
      panel.hidden = true;
    });
    item.querySelectorAll(".menu-drilldown").forEach((trigger) => {
      trigger.classList.remove("is-active");
    });
  });
}

const toggleMenu = () => {
  const isOpen = mainNav?.classList.toggle("is-open");
  menuToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));

  if (isOpen) {
    closeCart();
  }

  setOverlay();
};

const renderCart = () => {
  if (!cartItems || !cartTotal) return;

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartLink?.style.setProperty("--cart-count", `"${totalCount}"`);
  cartTotal.textContent = formatPrice(totalPrice);
  emptyCart?.classList.toggle("is-hidden", totalCount > 0);

  cartItems.querySelectorAll(".cart-item").forEach((item) => item.remove());

  cart.forEach((item) => {
    const article = document.createElement("article");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const quantity = document.createElement("span");

    article.className = "cart-item";
    image.src = item.image;
    image.alt = "";
    title.textContent = item.title;
    price.textContent = formatPrice(item.price);
    quantity.textContent = `x${item.quantity}`;
    content.append(title, price);
    article.append(image, content, quantity);
    cartItems.appendChild(article);
  });
};

const addToCart = (product, quantity = 1) => {
  const existingItem = cart.find((item) => item.title === product.title);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  renderCart();
  openCart();
  showToast(`${product.title} ajouté au panier`);
};

const fillDetail = (product) => {
  activeProduct = product;
  productDetail.querySelector(".detail-crumb").textContent = product.title;
  productDetail.querySelector(".detail-image").src = product.image;
  productDetail.querySelector(".detail-image").alt = product.title;
  productDetail.querySelector(".detail-title").textContent = product.title;
  productDetail.querySelector(".detail-reference span").textContent = product.reference;
  productDetail.querySelector(".detail-price").textContent = formatPrice(product.price);
  productDetail.querySelector(".detail-description").textContent = product.description;
  productDetail.querySelector(".detail-long-description").textContent = product.longDescription;
  productDetail.querySelector(".detail-categories").innerHTML =
    `Catégories : <a href="#">${product.tag}</a>, <a href="#">Livres</a>, <a href="#">Maison d'Ennour</a>`;
  detailQuantity.value = 1;
};

const renderRelatedProducts = (selectedTitle) => {
  if (!relatedProducts) return;
  relatedProducts.innerHTML = "";

  productCards
    .map(getProductData)
    .filter((product) => product.title !== selectedTitle)
    .slice(0, 4)
    .forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div>
          <p class="tag">${product.tag}</p>
          <h3>${product.title}</h3>
          <p class="price">${formatPrice(product.price)}</p>
        </div>
        <button type="button">Ajouter au panier</button>
      `;
      card.addEventListener("click", () => openProduct(product));
      card.querySelector("button").addEventListener("click", (event) => {
        event.stopPropagation();
        addToCart(product);
      });
      relatedProducts.appendChild(card);
    });
};

const openProduct = (product) => {
  if (!productDetail) return;
  fillDetail(product);
  renderRelatedProducts(product.title);
  productDetail.hidden = false;
  document.body.classList.add("product-view");
  closeCart();
  closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const closeProduct = () => {
  document.body.classList.remove("product-view");
  if (productDetail) {
    productDetail.hidden = true;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

productCards.forEach((card) => {
  card.addEventListener("click", () => openProduct(getProductData(card)));
});

productButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const product = getProductData(button.closest(".product-card"));

    if (button.textContent.toLowerCase().includes("ajouter")) {
      addToCart(product);
    } else {
      openProduct(product);
    }
  });
});

heroProductLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const requestedTitle = link.dataset.productTitle;
    const productCard = productCards.find((card) => {
      return card.querySelector("h3")?.textContent.trim() === requestedTitle;
    });

    if (productCard) {
      openProduct(getProductData(productCard));
    }
  });
});

detailAddCart?.addEventListener("click", () => {
  if (!activeProduct) return;
  const quantity = Math.max(1, Number(detailQuantity?.value) || 1);
  addToCart(activeProduct, quantity);
});

backToHome?.addEventListener("click", closeProduct);
homeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeProduct();
    closeCart();
    closeMenu();
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedTab = button.dataset.tab;
    tabButtons.forEach((tabButton) => {
      tabButton.classList.toggle("is-active", tabButton === button);
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === selectedTab);
    });
  });
});

cartLink?.addEventListener("click", (event) => {
  event.preventDefault();
  openCart();
  closeMenu();
});

menuToggle?.addEventListener("click", toggleMenu);
catalogTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const item = trigger.closest(".catalog-item");
    const isOpen = item.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
    closeCatalogMenus(item);
  });
});
menuDrilldowns.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const menu = button.closest(".catalog-menu");
    const panel = menu?.querySelector(`[data-menu-panel="${button.dataset.target}"]`);

    if (!menu || !panel) return;
    const nextHidden = !panel.hidden;

    menu.querySelectorAll("[data-menu-panel]").forEach((menuPanel) => {
      if (menuPanel !== panel) {
        menuPanel.hidden = true;
      }
    });
    menu.querySelectorAll(".menu-drilldown").forEach((trigger) => {
      if (trigger !== button) {
        trigger.classList.remove("is-active");
      }
    });

    panel.hidden = nextHidden;
    button.classList.toggle("is-active", !nextHidden);
  });
});
document.querySelectorAll(".catalog-menu").forEach((menu) => {
  menu.addEventListener("click", (event) => {
    if (event.target.closest(".menu-drilldown, .menu-back")) {
      event.stopPropagation();
    }
  });
});
overlay?.addEventListener("click", () => {
  closeCart();
  closeMenu();
});
closePanelButtons.forEach((button) => button.addEventListener("click", closeCart));
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("menu-drilldown") || link.classList.contains("menu-back")) return;
    closeCatalogMenus();
    closeMenu();
  });
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".catalog-item")) {
    closeCatalogMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeMenu();
    closeCatalogMenus();
  }
});

const searchForm = document.querySelector(".search");

searchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchForm.querySelector("input")?.value.trim();
  showToast(query ? `Recherche : ${query}` : "Entrez un livre, un auteur ou une collection");
});
