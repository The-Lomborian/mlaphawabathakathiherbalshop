/* Mlaphi Wa Bathakathi Herbal Shop — vanilla JS */
localStorage.removeItem("mw_products_v1");
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Imbiza Cleansing Herbs", cat: "Healing", price: 180, img: "img/p1.jpg", desc: "A hand-tied bundle of wild-harvested herbs, traditionally brewed to cleanse the body and restore balance." },
  { id: 2, name: "Hlasela Imali", cat: "Business & Money", price: 320, img: "img/hlasela-imali.jpg", desc: "A traditional remedy for promotion, business growth and attracting money into your life." },
  { id: 3, name: "Imphepho Smudge Bundle", cat: "Cleansing", price: 95, img: "img/p3.jpg", desc: "Sacred African sage, burned to purify your home, invite ancestral blessings and calm the spirit." },
  { id: 4, name: "Hlasela Success Soap", cat: "Cleansing", price: 210, img: "img/hlasela-soap.jpg", desc: "A handmade herbal soap packed with sacred herbs to wash away bad luck and open the way to success." },
  { id: 5, name: "Spiritual Cleansing Kit", cat: "Spiritual", price: 450, img: "img/p5.jpg", desc: "Candle, sea salt, herb blend and pouch — everything for a complete ritual of renewal and protection." },
  { id: 6, name: "Herbal Healing Balm", cat: "Body", price: 165, img: "img/p6.jpg", desc: "Beeswax balm infused with indigenous botanicals to soothe aches, skin irritations and tired muscles." },
  { id: 7, name: "Ancestral Herbal Tea", cat: "Wellness", price: 140, img: "img/p7.jpg", desc: "A calming blend of rooibos, petals and wild herbs for peaceful sleep and inner stillness." },
  { id: 8, name: "Isivikelo Protection Bark", cat: "Protection", price: 280, img: "img/p8.jpg", desc: "Potent bark and roots bound in gold thread, traditionally used to shield the home and family." },
];

const getProducts = () => JSON.parse(localStorage.getItem("mw_products_v2") || "null") || DEFAULT_PRODUCTS;
const saveProducts = (p) => localStorage.setItem("mw_products_v2", JSON.stringify(p));
const getCart = () => JSON.parse(localStorage.getItem("mw_cart") || "[]");
const saveCart = (c) => { localStorage.setItem("mw_cart", JSON.stringify(c)); updateCount(); };
const R = (n) => "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 2 });

function updateCount() {
  const n = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => { el.textContent = n; el.style.display = n ? "grid" : "none"; });
}

function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart(cart);
  const p = getProducts().find((x) => x.id === id);
  toast(p.name + " added to cart");
}

function renderLayout() {
  const header = document.getElementById("site-header");
  if (header) header.outerHTML = `
  <header class="site-header"><div class="container nav">
    <a href="index.html" class="brand"><img src="img/logo.jpg" alt="Mlaphi Wa Bathakathi logo"><span class="gold-text">MLAPHI WA BATHAKATHI</span></a>
    <nav class="nav-links"><a href="index.html">Home</a><a href="shop.html" class="nav-shop">Shop Now</a><a href="cart.html" class="cart-link" aria-label="Cart"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><span class="cart-count">0</span></a></nav>
  </div></header>`;
  const footer = document.getElementById("site-footer");
  if (footer) footer.outerHTML = `
  <footer class="site-footer"><div class="container">
    <div class="brand"><img src="img/logo.jpg" alt=""><span class="gold-text">MLAPHI WA BATHAKATHI</span></div>
    <p>Traditional herbal remedies · Proudly South African</p>
    <p style="margin-top:.6rem">© ${new Date().getFullYear()} Mlaphi Wa Bathakathi Herbal Shop</p>
  </div></footer>`;
}

function productCard(p) {
  return `<article class="card">
    <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="body"><span class="cat">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="row"><span class="price">${R(p.price)}</span><button class="btn btn-gold" onclick="addToCart(${p.id})">Add to Cart</button></div>
    </div></article>`;
}

function renderGrid(selector, items) {
  const el = document.querySelector(selector);
  if (el) el.innerHTML = items.map(productCard).join("");
}

function renderCart() {
  const wrap = document.getElementById("cart");
  if (!wrap) return;
  const products = getProducts();
  const cart = getCart().filter((i) => products.find((p) => p.id === i.id));
  if (!cart.length) {
    wrap.innerHTML = `<div class="empty"><h2>Your cart is empty</h2><p>Discover remedies crafted with ancestral wisdom.</p><a href="shop.html" class="btn btn-gold">Visit the Shop</a></div>`;
    return;
  }
  let subtotal = 0;
  const rows = cart.map((i) => {
    const p = products.find((x) => x.id === i.id); subtotal += p.price * i.qty;
    return `<div class="cart-item"><img src="${p.img}" alt="${p.name}">
      <div><h3>${p.name}</h3><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div>
      <button class="remove" onclick="changeQty(${p.id},-999)">Remove</button></div>
      <span class="price">${R(p.price * i.qty)}</span></div>`;
  }).join("");
  wrap.innerHTML = `<div class="cart-wrap"><div>${rows}</div>
    <aside class="summary"><h2>Summary</h2>
      <div class="sum-row"><span>Subtotal</span><span>${R(subtotal)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>At checkout</span></div>
      <div class="sum-row total"><span>Total</span><span class="price">${R(subtotal)}</span></div>
      <a href="checkout.html" class="btn btn-gold btn-block">Checkout</a>
    </aside></div>`;
}

function changeQty(id, d) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += d;
  cart = cart.filter((i) => i.qty > 0);
  saveCart(cart); renderCart();
}

function cartSubtotal() {
  const products = getProducts();
  return getCart().reduce((s, i) => { const p = products.find((x) => x.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0);
}

function initCheckout() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const ship = document.getElementById("shipping");
  const update = () => {
    const sub = cartSubtotal(); const s = Number(ship.value || 0);
    document.getElementById("co-sub").textContent = R(sub);
    document.getElementById("co-ship").textContent = R(s);
    document.getElementById("co-total").textContent = R(sub + s);
  };
  ship.addEventListener("change", update); update();
  const card = document.getElementById("card");
  card.addEventListener("input", () => { card.value = card.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); });
  const exp = document.getElementById("expiry");
  exp.addEventListener("input", () => { let v = exp.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); exp.value = v; });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!getCart().length) { toast("Your cart is empty"); return; }
    document.querySelector(".overlay").classList.add("show");
    const order = { id: "MW" + Math.floor(1000 + Math.random() * 9000), name: form.name.value, total: cartSubtotal() + Number(ship.value), date: new Date().toLocaleDateString("en-ZA"), status: "Paid" };
    const orders = JSON.parse(localStorage.getItem("mw_orders") || "[]"); orders.unshift(order);
    localStorage.setItem("mw_orders", JSON.stringify(orders));
    localStorage.setItem("mw_last_order", order.id);
    setTimeout(() => { saveCart([]); location.href = "success.html"; }, 2000);
  });
}

/* Admin */
function initAdminLogin() {
  const f = document.getElementById("login-form");
  if (!f) return;
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (f.password.value === "admin123") { sessionStorage.setItem("mw_admin", "1"); location.href = "admin-dashboard.html"; }
    else document.querySelector(".error").textContent = "Incorrect password. Please try again.";
  });
}

const MOCK_ORDERS = [
  { id: "MW2041", name: "Thandeka Ndlovu", total: 545, date: "17/10/2026", status: "Shipped" },
  { id: "MW2040", name: "Sipho Mokoena", total: 320, date: "16/10/2026", status: "Paid" },
  { id: "MW2039", name: "Lerato Khumalo", total: 1050, date: "15/10/2026", status: "Shipped" },
  { id: "MW2038", name: "Bongani Dlamini", total: 235, date: "14/10/2026", status: "Pending" },
];

function initDashboard() {
  if (!document.getElementById("orders-body")) return;
  if (sessionStorage.getItem("mw_admin") !== "1") { location.href = "admin-login.html"; return; }
  const orders = [...JSON.parse(localStorage.getItem("mw_orders") || "[]"), ...MOCK_ORDERS];
  document.getElementById("orders-body").innerHTML = orders.slice(0, 8).map((o) =>
    `<tr><td>${o.id}</td><td>${o.name}</td><td>${o.date}</td><td>${R(o.total)}</td><td><span class="pill ${o.status !== "Pending" ? "ok" : ""}">${o.status}</span></td></tr>`).join("");
  const renderInv = () => {
    const products = getProducts();
    document.getElementById("inv-body").innerHTML = products.map((p, i) =>
      `<tr><td><img src="${p.img}" alt="" style="width:42px;height:42px;object-fit:cover"></td><td>${p.name}</td><td>${p.cat}</td><td>${R(p.price)}</td><td>${p.stock ?? 12 + ((i * 7) % 30)}</td></tr>`).join("");
    document.getElementById("stat-products").textContent = products.length;
  };
  renderInv();
  document.getElementById("stat-orders").textContent = orders.length;
  document.getElementById("stat-revenue").textContent = R(orders.reduce((s, o) => s + o.total, 0));
  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target; const products = getProducts();
    products.push({ id: Date.now(), name: f.pname.value, cat: f.pcat.value, price: Number(f.pprice.value), stock: Number(f.pstock.value), img: f.pimg.value || "img/p1.jpg", desc: f.pdesc.value });
    saveProducts(products); f.reset(); renderInv(); toast("Product added to the shop");
  });
  document.getElementById("logout").addEventListener("click", () => { sessionStorage.removeItem("mw_admin"); location.href = "admin-login.html"; });
}

document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  updateCount();
  renderGrid("#featured", getProducts().slice(0, 3));
  renderGrid("#shop-grid", getProducts());
  renderCart();
  initCheckout();
  initAdminLogin();
  initDashboard();
  const on = document.getElementById("order-no");
  if (on) on.textContent = localStorage.getItem("mw_last_order") || "MW0000";
});
