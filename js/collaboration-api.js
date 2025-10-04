/**
 * API Client dla Systemu Współpracy SSPO
 * Bezpieczna komunikacja z backendem
 */

class CollaborationAPI {
    constructor() {
        this.baseURL = this.detectAPIURL();
        this.token = localStorage.getItem('sspo_auth_token');
        this.currentUser = null;
        this.eventListeners = new Map();
        
        console.log(`🔌 API URL: ${this.baseURL}`);
        
        // Jeśli mamy token, sprawdź czy jest ważny
        if (this.token) {
            this.validateToken();
        }
    }

    detectAPIURL() {
        // W production używamy api.regulamin.sspo.com.pl
        // W lokalnym development używamy localhost:3000
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // Na produkcji
        return 'http://api.regulamin.sspo.com.pl/api';
    }

    // ==================== POMOCNICZE ====================

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`❌ API Error [${endpoint}]:`, error);
            throw error;
        }
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => callback(data));
        }
    }

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    // ==================== AUTENTYKACJA ====================

    async register(email, password, name) {
        try {
            const data = await this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, name })
            });

            this.token = data.token;
            this.currentUser = data.user;
            localStorage.setItem('sspo_auth_token', this.token);
            
            this.emit('auth:login', this.currentUser);
            
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const data = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            this.token = data.token;
            this.currentUser = data.user;
            localStorage.setItem('sspo_auth_token', this.token);
            
            this.emit('auth:login', this.currentUser);
            
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async validateToken() {
        try {
            const data = await this.request('/auth/me');
            this.currentUser = data.user;
            this.emit('auth:login', this.currentUser);
            return true;
        } catch (error) {
            // Token nieprawidłowy, wyloguj
            this.logout();
            return false;
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('sspo_auth_token');
        this.emit('auth:logout');
    }

    isLoggedIn() {
        return !!this.token && !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasRole(roles) {
        if (!this.currentUser) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(this.currentUser.role);
    }

    // ==================== KOMENTARZE ====================

    async getComments(articleId) {
        try {
            const data = await this.request(`/comments/${articleId}`);
            return data.comments;
        } catch (error) {
            console.error('Błąd pobierania komentarzy:', error);
            return [];
        }
    }

    async addComment(articleId, text, parentId = null) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany aby dodać komentarz');
        }

        try {
            const data = await this.request('/comments', {
                method: 'POST',
                body: JSON.stringify({ articleId, text, parentId })
            });

            this.emit('comment:added', data.comment);
            return data.comment;
        } catch (error) {
            throw new Error(`Błąd dodawania komentarza: ${error.message}`);
        }
    }

    async deleteComment(commentId) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany');
        }

        try {
            await this.request(`/comments/${commentId}`, {
                method: 'DELETE'
            });

            this.emit('comment:deleted', commentId);
            return true;
        } catch (error) {
            throw new Error(`Błąd usuwania komentarza: ${error.message}`);
        }
    }

    // ==================== POPRAWKI ====================

    async getAmendments(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const data = await this.request(`/amendments?${params}`);
            return data.amendments;
        } catch (error) {
            console.error('Błąd pobierania poprawek:', error);
            return [];
        }
    }

    async addAmendment(articleId, originalText, proposedText, reason) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany aby dodać poprawkę');
        }

        if (!this.hasRole(['contributor', 'reviewer', 'admin'])) {
            throw new Error('Nie masz uprawnień do dodawania poprawek (wymagana rola: contributor lub wyżej)');
        }

        try {
            const data = await this.request('/amendments', {
                method: 'POST',
                body: JSON.stringify({ articleId, originalText, proposedText, reason })
            });

            this.emit('amendment:added', data.amendment);
            return data.amendment;
        } catch (error) {
            throw new Error(`Błąd dodawania poprawki: ${error.message}`);
        }
    }

    async voteOnAmendment(amendmentId, voteType) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany aby głosować');
        }

        if (!this.hasRole(['reviewer', 'admin'])) {
            throw new Error('Nie masz uprawnień do głosowania (wymagana rola: reviewer lub admin)');
        }

        if (!['for', 'against', 'abstain'].includes(voteType)) {
            throw new Error('Nieprawidłowy typ głosu');
        }

        try {
            await this.request(`/amendments/${amendmentId}/vote`, {
                method: 'POST',
                body: JSON.stringify({ voteType })
            });

            this.emit('amendment:voted', { amendmentId, voteType });
            return true;
        } catch (error) {
            throw new Error(`Błąd głosowania: ${error.message}`);
        }
    }

    async updateAmendmentStatus(amendmentId, status) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany');
        }

        if (!this.hasRole(['admin'])) {
            throw new Error('Nie masz uprawnień (wymagana rola: admin)');
        }

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            throw new Error('Nieprawidłowy status');
        }

        try {
            await this.request(`/amendments/${amendmentId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });

            this.emit('amendment:status_changed', { amendmentId, status });
            return true;
        } catch (error) {
            throw new Error(`Błąd aktualizacji statusu: ${error.message}`);
        }
    }

    // ==================== UŻYTKOWNICY (ADMIN) ====================

    async getUsers() {
        if (!this.hasRole(['admin'])) {
            throw new Error('Nie masz uprawnień (wymagana rola: admin)');
        }

        try {
            const data = await this.request('/users');
            return data.users;
        } catch (error) {
            throw new Error(`Błąd pobierania użytkowników: ${error.message}`);
        }
    }

    async updateUserRole(userId, role) {
        if (!this.hasRole(['admin'])) {
            throw new Error('Nie masz uprawnień (wymagana rola: admin)');
        }

        if (!['viewer', 'contributor', 'reviewer', 'admin'].includes(role)) {
            throw new Error('Nieprawidłowa rola');
        }

        try {
            await this.request(`/users/${userId}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role })
            });

            this.emit('user:role_changed', { userId, role });
            return true;
        } catch (error) {
            throw new Error(`Błąd zmiany roli: ${error.message}`);
        }
    }
}

// ==================== INTEGRATION Z ISTNIEJĄCYM SYSTEMEM ====================

// Jeśli istnieje stary CollaborationSystem używający localStorage,
// podmieniamy go na wersję z API
if (typeof CollaborationSystem !== 'undefined') {
    console.warn('⚠️ Wykryto stary CollaborationSystem - zostanie nadpisany przez wersję z API');
}

class CollaborationSystem {
    constructor() {
        this.api = new CollaborationAPI();
        this.currentArticle = null;
        this.comments = [];
        this.amendments = [];
        
        // Event handlers
        this.setupEventHandlers();
        
        console.log('✅ System współpracy zainicjalizowany z backendem API');
    }

    setupEventHandlers() {
        // Aktualizuj UI po zmianach
        this.api.on('auth:login', (user) => {
            console.log('✅ Zalogowano:', user);
            this.updateAuthUI();
        });

        this.api.on('auth:logout', () => {
            console.log('👋 Wylogowano');
            this.updateAuthUI();
        });

        this.api.on('comment:added', async () => {
            if (this.currentArticle) {
                await this.loadComments(this.currentArticle);
            }
        });

        this.api.on('amendment:added', async () => {
            await this.loadAmendments();
        });

        this.api.on('amendment:voted', async () => {
            await this.loadAmendments();
        });
    }

    // ==================== AUTENTYKACJA ====================

    async showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'collaboration-modal-overlay';
        modal.innerHTML = `
            <div class="collaboration-modal">
                <div class="collaboration-modal-header">
                    <h3>🔐 Logowanie do systemu SSPO</h3>
                    <button class="close-btn" onclick="this.closest('.collaboration-modal-overlay').remove()">×</button>
                </div>
                <div class="collaboration-modal-body">
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Zaloguj się</button>
                        <button class="auth-tab" data-tab="register">Zarejestruj się</button>
                    </div>
                    
                    <form id="login-form" class="auth-form active">
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label>Hasło:</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn-primary">Zaloguj się</button>
                        <div class="auth-error" style="display:none; color: red; margin-top: 10px;"></div>
                    </form>
                    
                    <form id="register-form" class="auth-form">
                        <div class="form-group">
                            <label>Imię i nazwisko:</label>
                            <input type="text" id="register-name" required>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="register-email" required>
                        </div>
                        <div class="form-group">
                            <label>Hasło (min. 8 znaków):</label>
                            <input type="password" id="register-password" required minlength="8">
                        </div>
                        <button type="submit" class="btn-primary">Zarejestruj się</button>
                        <div class="auth-error" style="display:none; color: red; margin-top: 10px;"></div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Przełączanie zakładek
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const formId = tab.dataset.tab === 'login' ? 'login-form' : 'register-form';
                modal.querySelector(`#${formId}`).classList.add('active');
            });
        });

        // Logowanie
        modal.querySelector('#login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = modal.querySelector('#login-email').value;
            const password = modal.querySelector('#login-password').value;
            const errorDiv = modal.querySelector('#login-form .auth-error');

            const result = await this.api.login(email, password);
            
            if (result.success) {
                modal.remove();
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
            }
        });

        // Rejestracja
        modal.querySelector('#register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = modal.querySelector('#register-name').value;
            const email = modal.querySelector('#register-email').value;
            const password = modal.querySelector('#register-password').value;
            const errorDiv = modal.querySelector('#register-form .auth-error');

            const result = await this.api.register(email, password, name);
            
            if (result.success) {
                modal.remove();
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
            }
        });
    }

    updateAuthUI() {
        const user = this.api.getCurrentUser();
        const authButtons = document.querySelectorAll('.auth-button');
        
        authButtons.forEach(btn => {
            if (user) {
                btn.textContent = `👤 ${user.name} (${user.role})`;
                btn.onclick = () => this.showUserMenu();
            } else {
                btn.textContent = '🔐 Zaloguj się';
                btn.onclick = () => this.showLoginModal();
            }
        });
    }

    showUserMenu() {
        const user = this.api.getCurrentUser();
        if (!user) return;

        const menu = document.createElement('div');
        menu.className = 'user-menu-dropdown';
        menu.innerHTML = `
            <div class="user-menu-item"><strong>${user.name}</strong></div>
            <div class="user-menu-item">${user.email}</div>
            <div class="user-menu-item">Rola: ${user.role}</div>
            <hr>
            ${user.role === 'admin' ? '<div class="user-menu-item" onclick="collaborationSystem.showAdminPanel()">⚙️ Panel administratora</div>' : ''}
            <div class="user-menu-item" onclick="collaborationSystem.api.logout()">🚪 Wyloguj się</div>
        `;
        
        // Pozycjonowanie menu (możesz dostosować)
        document.body.appendChild(menu);
        
        // Zamknij po kliknięciu poza menu
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }

    // ==================== KOMENTARZE ====================

    async loadComments(articleId) {
        this.currentArticle = articleId;
        this.comments = await this.api.getComments(articleId);
        this.renderComments();
    }

    async addComment(articleId, text, parentId = null) {
        try {
            await this.api.addComment(articleId, text, parentId);
        } catch (error) {
            alert(error.message);
            if (error.message.includes('zalogowany')) {
                this.showLoginModal();
            }
        }
    }

    renderComments() {
        // Logika renderowania komentarzy
        // ... (podobna do starej wersji)
    }

    // ==================== POPRAWKI ====================

    async loadAmendments(filters = {}) {
        this.amendments = await this.api.getAmendments(filters);
        this.renderAmendments();
    }

    async addAmendment(articleId, originalText, proposedText, reason) {
        try {
            await this.api.addAmendment(articleId, originalText, proposedText, reason);
        } catch (error) {
            alert(error.message);
            if (error.message.includes('zalogowany')) {
                this.showLoginModal();
            }
        }
    }

    async voteOnAmendment(amendmentId, voteType) {
        try {
            await this.api.voteOnAmendment(amendmentId, voteType);
        } catch (error) {
            alert(error.message);
        }
    }

    renderAmendments() {
        // Logika renderowania poprawek
        // ... (podobna do starej wersji)
    }

    // ==================== PANEL ADMINISTRACYJNY ====================

    async showAdminPanel() {
        if (!this.api.hasRole(['admin'])) {
            alert('Brak uprawnień');
            return;
        }

        try {
            const users = await this.api.getUsers();
            
            const modal = document.createElement('div');
            modal.className = 'collaboration-modal-overlay';
            modal.innerHTML = `
                <div class="collaboration-modal" style="max-width: 800px;">
                    <div class="collaboration-modal-header">
                        <h3>⚙️ Panel Administratora</h3>
                        <button class="close-btn" onclick="this.closest('.collaboration-modal-overlay').remove()">×</button>
                    </div>
                    <div class="collaboration-modal-body">
                        <h4>Zarządzanie użytkownikami:</h4>
                        <table class="admin-users-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Imię</th>
                                    <th>Email</th>
                                    <th>Rola</th>
                                    <th>Ostatnie logowanie</th>
                                    <th>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td>${u.id}</td>
                                        <td>${u.name}</td>
                                        <td>${u.email}</td>
                                        <td>
                                            <select data-user-id="${u.id}" class="role-select">
                                                <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                                                <option value="contributor" ${u.role === 'contributor' ? 'selected' : ''}>Contributor</option>
                                                <option value="reviewer" ${u.role === 'reviewer' ? 'selected' : ''}>Reviewer</option>
                                                <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                                            </select>
                                        </td>
                                        <td>${u.last_login ? new Date(u.last_login).toLocaleString('pl-PL') : 'Nigdy'}</td>
                                        <td>
                                            <button class="btn-save-role" data-user-id="${u.id}">💾 Zapisz</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Obsługa zmiany ról
            modal.querySelectorAll('.btn-save-role').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const userId = parseInt(btn.dataset.userId);
                    const roleSelect = modal.querySelector(`select[data-user-id="${userId}"]`);
                    const newRole = roleSelect.value;

                    try {
                        await this.api.updateUserRole(userId, newRole);
                        alert('Rola zaktualizowana!');
                    } catch (error) {
                        alert(`Błąd: ${error.message}`);
                    }
                });
            });

        } catch (error) {
            alert(`Błąd: ${error.message}`);
        }
    }
}

// Inicjalizacja globalnego obiektu
let collaborationSystem;

document.addEventListener('DOMContentLoaded', () => {
    collaborationSystem = new CollaborationSystem();
    
    // Dodaj przycisk logowania jeśli nie istnieje
    if (!document.querySelector('.auth-button')) {
        const authBtn = document.createElement('button');
        authBtn.className = 'auth-button';
        authBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 1000;';
        document.body.appendChild(authBtn);
        collaborationSystem.updateAuthUI();
    }
});

console.log('✅ Collaboration API loaded - Backend connected');
