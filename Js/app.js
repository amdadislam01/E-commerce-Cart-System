
const productsGrid = document.getElementById('products-grid');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartOverlay = document.querySelector('.cart-overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const toastNotification = document.getElementById('toast-notification');
const toastMessage = document.querySelector('.toast-message');

// Sample Product Data (In a real app, this would come from an API)
const products = [
    {
        id: 1,
        title: "Wireless Headphones",
        description: "High-quality wireless headphones with noise.",
        price: 199.99,
        image: "Image/product-1.png"
    },
    {
        id: 2,
        title: "Smart Watch",
        description: "Feature-rich smartwatch with health monitoring.",
        price: 249.99,
        image: "Image/product-2.png"
    },
    {
        id: 3,
        title: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with 20h battery life.",
        price: 129.99,
        image: "Image/product-3.png"
    },
    {
        id: 4,
        title: "Laptop Backpack",
        description: "Ergonomic backpack with USB charging port.",
        price: 59.99,
        image: "Image/product-4.png"
    },
    {
        id: 5,
        title: "Wireless Keyboard",
        description: "Slim wireless keyboard with silent keys.",
        price: 79.99,
        image: "Image/product-5.png"
    },
    {
        id: 6,
        title: "4K Action Camera",
        description: "Waterproof 4K action camera with accessories.",
        price: 179.99,
        image: "Image/product-6.png"
    }
];

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display products
function displayProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    toastNotification.classList.add(type);
    toastMessage.textContent = message;
    toastNotification.classList.add('active');

    setTimeout(() => {
        toastNotification.classList.remove('active');
        setTimeout(() => {
            toastNotification.classList.remove(type);
        }, 300);
    }, 3000);
}

// Event Listeners
cartIcon.addEventListener('click', () => {
    cartOverlay.classList.add('active');
    cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    cartSidebar.classList.remove('active');
});

// Initialize the app
displayProducts();
updateCartCount();

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(item => item.id === productId);

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Increase quantity
        existingItem.quantity += 1;
    } else {
        // Add new item to cart
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update UI
    updateCartCount();
    displayCartItems();

    // Show notification
    showToast(`${product.title} added to cart!`);
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Display cart items in sidebar
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <button class="cart-item-remove">Remove</button>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);
    const item = cart.find(item => item.id === productId);

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // Remove item if quantity is 1
        cart = cart.filter(item => item.id !== productId);
    }

    // Update storage and UI
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);
    const item = cart.find(item => item.id === productId);

    item.quantity += 1;

    // Update storage and UI
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.closest('.cart-item').dataset.id);

    cart = cart.filter(item => item.id !== productId);

    // Update storage and UI
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();

    // Show notification
    showToast('Item removed from cart', 'warning');
}

// Clear cart
document.querySelector('.clear-cart').addEventListener('click', () => {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showToast('Cart cleared', 'warning');
});

// Proceed to checkout
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }

    //  checkout page
    showToast('Proceeding to checkout', 'success');
    setTimeout(() => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    }, 1500);
});

// Initialize cart display when page loads
document.addEventListener('DOMContentLoaded', displayCartItems);