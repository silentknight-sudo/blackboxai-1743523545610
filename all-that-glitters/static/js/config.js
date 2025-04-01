const API_BASE_URL = 'http://localhost:5000/api';

const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    orders: `${API_BASE_URL}/orders`,
    productsByCategory: (category) => `${API_BASE_URL}/products/${category}`
};

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(endpoint, options);
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
    }

    return result;
}

// Cart management
const CartManager = {
    getCart() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    },

    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    removeFromCart(productId) {
        const cart = this.getCart().filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartUI();
    },

    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartUI();
    },

    getTotal() {
        return this.getCart().reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const itemCount = this.getCart().reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = itemCount;
        }
    }
};

// Auth management
const AuthManager = {
    isLoggedIn() {
        return !!localStorage.getItem('user');
    },

    getUser() {
        return JSON.parse(localStorage.getItem('user') || 'null');
    },

    async login(email, password) {
        const response = await apiCall(API_ENDPOINTS.login, 'POST', { email, password });
        localStorage.setItem('user', JSON.stringify(response));
        return response;
    },

    async register(name, email, password) {
        const response = await apiCall(API_ENDPOINTS.register, 'POST', { name, email, password });
        return response;
    },

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    },

    updateAuthUI() {
        const user = this.getUser();
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const profileBtn = document.querySelector('.profile-btn');

        if (user) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (profileBtn) {
                profileBtn.style.display = 'block';
                profileBtn.textContent = user.name;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (profileBtn) profileBtn.style.display = 'none';
        }
    }
};

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateCartUI();
    AuthManager.updateAuthUI();
});