class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart') || '[]');
        this.updateUI();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
                return;
            }
        }
        this.saveCart();
        this.updateUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateUI();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateUI() {
        // Update cart count in header
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }

        // Update cart page if we're on it
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartItemsContainer && cartTotal) {
            cartItemsContainer.innerHTML = this.items.map(item => `
                <div class="flex items-center hover:bg-gray-50 py-5 border-b" data-product-id="${item.id}">
                    <div class="flex w-2/5">
                        <div class="w-20">
                            <img class="h-24 rounded" src="${item.image_url}" alt="${item.name}">
                        </div>
                        <div class="flex flex-col justify-between ml-4 flex-grow">
                            <span class="font-bold text-sm">${item.name}</span>
                            <button class="remove-item font-semibold hover:text-red-500 text-gray-500 text-xs">Remove</button>
                        </div>
                    </div>
                    <div class="flex justify-center w-1/5">
                        <button class="quantity-btn minus text-gray-500 focus:outline-none focus:text-gray-600">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input class="quantity mx-2 border text-center w-12" type="text" value="${item.quantity}">
                        <button class="quantity-btn plus text-gray-500 focus:outline-none focus:text-gray-600">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <span class="text-center w-1/5 font-semibold text-sm">₹${item.price.toFixed(2)}</span>
                    <span class="text-center w-1/5 font-semibold text-sm">₹${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');

            cartTotal.textContent = `₹${this.getTotal().toFixed(2)}`;

            // Add event listeners for cart interactions
            this.addCartEventListeners();
        }
    }

    addCartEventListeners() {
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                this.removeItem(productId);
            });
        });

        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                const input = e.target.closest('.flex').querySelector('.quantity');
                const currentQty = parseInt(input.value);
                
                if (button.classList.contains('plus')) {
                    this.updateQuantity(productId, currentQty + 1);
                } else if (button.classList.contains('minus') && currentQty > 1) {
                    this.updateQuantity(productId, currentQty - 1);
                }
            });
        });

        // Quantity input
        document.querySelectorAll('.quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.closest('[data-product-id]').dataset.productId);
                const newQty = parseInt(e.target.value);
                if (newQty >= 1) {
                    this.updateQuantity(productId, newQty);
                } else {
                    e.target.value = 1;
                    this.updateQuantity(productId, 1);
                }
            });
        });
    }

    async checkout() {
        if (!Auth.isLoggedIn()) {
            window.location.href = 'login-new.html';
            return;
        }

        try {
            const user = Auth.getUser();
            const orderData = {
                user_id: user.id,
                total_amount: this.getTotal(),
                items: this.items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            this.clearCart();
            window.location.href = `order-confirmation.html?orderId=${data.order_id}`;
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to process checkout. Please try again.');
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
});