// Authentication related functions
class Auth {
    static async login(email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data));
            
            // Redirect to products page after successful login
            window.location.href = 'products.html';
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(name, email, password) {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = 'login-new.html';
    }

    static isLoggedIn() {
        return !!localStorage.getItem('user');
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user') || 'null');
    }

    static updateAuthUI() {
        const user = this.getUser();
        const loginBtn = document.querySelector('.login-btn');
        const signupBtn = document.querySelector('.signup-btn');
        const profileBtn = document.querySelector('.profile-btn');
        const cartCount = document.querySelector('.cart-count');

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

        // Update cart count if available
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = itemCount;
        }
    }
}

// Initialize auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateAuthUI();

    // Check if we're on the login page
    if (window.location.pathname.includes('login-new.html')) {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                try {
                    await Auth.login(email, password);
                } catch (error) {
                    if (errorMessage) {
                        errorMessage.textContent = error.message;
                        errorMessage.classList.remove('hidden');
                    }
                }
            });
        }
    }

    // Add logout functionality to any logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    });
});