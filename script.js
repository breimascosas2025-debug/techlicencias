// Cart Management
let cart = [];

// Add to cart function
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${productName} agregado al carrito`);
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartBadge = document.querySelector('.cart-badge');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <p>Tu carrito está vacío</p>
                <p style="font-size: 0.9rem;">Agrega productos para comenzar</p>
            </div>
        `;
        if (cartBadge) cartBadge.style.display = 'none';
    } else {
        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item-row" style="padding: 16px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #1E293B;">${item.name}</div>
                        <div style="font-size: 0.9rem; color: #64748B;">₡${item.price.toLocaleString()} x ${item.quantity}</div>
                    </div>
                    <div style="text-align: right; margin-right: 16px;">
                        <div style="font-weight: 600; color: #00D9FF;">₡${itemTotal.toLocaleString()}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background: #EF4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">Eliminar</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = total.toLocaleString();
        
        if (cartBadge) {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = 'flex';
        }
    }
    
    // Update floating cart panel
    updateFloatingCart();
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Update floating cart panel
function updateFloatingCart() {
    const cartItemsList = document.querySelector('.cart-items-list');
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="cart-empty-msg">Tu carrito está vacío</div>';
    } else {
        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">₡${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `;
        });
        cartItemsList.innerHTML = html;
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let total = 0;
    let items = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        items += `${item.name} (x${item.quantity}): ₡${itemTotal.toLocaleString()}\n`;
    });
    
    const message = `Hola, me gustaría comprar:\n\n${items}\nTotal: ₡${total.toLocaleString()}\n\nPor favor, confirma disponibilidad y procedimiento de pago.`;
    
    const whatsappNumber = '50660941491';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Clear cart
function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        updateCart();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Floating cart toggle
function toggleCart() {
    const cartPanel = document.querySelector('.cart-panel');
    cartPanel.classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Cart button functionality
const cartButton = document.querySelector('.cart-button');
if (cartButton) {
    cartButton.addEventListener('click', toggleCart);
}

// Close cart panel when clicking outside
document.addEventListener('click', (e) => {
    const cartPanel = document.querySelector('.cart-panel');
    const floatingCart = document.querySelector('.floating-cart');
    
    if (cartPanel && floatingCart && !floatingCart.contains(e.target)) {
        cartPanel.classList.remove('active');
    }
});

// Load cart from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
