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
            return data;
        } catch (error) {
            throw new Error(error.message);
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
            throw new Error(error.message);
        }
    }

    static logout() {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
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
}

// Initialize auth UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateAuthUI();
});