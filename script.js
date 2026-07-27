// ---- Shopping cart state ----
// Each cart item: { name: string, price: number, qty: number }
let cart = [];

// ---- DOM references ----
const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const addToCartButtons = document.querySelectorAll('.products .card button');

// ---- Wire up every "Add to Cart" button ----
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        addToCart(name, price);
    });
});

// ---- Add an item (or bump its quantity if it's already in the cart) ----
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    renderCart();
}

// ---- Remove an item entirely ----
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
}

// ---- Change quantity by +1 / -1, removing the item if it hits 0 ----
function changeQty(name, delta) {
    const item = cart.find(item => item.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(name);
    } else {
        renderCart();
    }
}

// ---- Redraw the cart list, count, and total from current state ----
function renderCart() {
    // Empty state
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p id="empty-cart-msg" style="color: var(--ink-soft); font-size: 14px;">Your cart is empty.</p>';
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} ${item.qty > 1 ? `x${item.qty}` : ''}</span>
                <span style="display: flex; align-items: center; gap: 10px;">
                    $${(item.price * item.qty).toFixed(2)}
                    <button class="qty-btn" onclick="changeQty('${item.name}', -1)" style="padding: 2px 8px; border-radius: 5px; border: none; cursor: pointer;">-</button>
                    <button class="qty-btn" onclick="changeQty('${item.name}', 1)" style="padding: 2px 8px; border-radius: 5px; border: none; cursor: pointer;">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')" style="padding: 2px 8px; border-radius: 5px; border: none; cursor: pointer; background:#e74c3c; color:white;">✕</button>
                </span>
            </div>
        `).join('');
    }

    // Total item count (sum of quantities)
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalCount;

    // Total price
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalEl.textContent = totalPrice.toFixed(2);
}

// ---- Initial render (cart starts empty) ----
renderCart();