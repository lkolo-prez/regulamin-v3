/**
 * 🚀 System Współpracy SSPO - Complete Integration
 * Version: 2.0.0
 * Backend API + Frontend UI + Real-time Updates
 */

// ==================== API CLIENT ====================

class CollaborationAPI {
    constructor() {
        this.baseURL = this.detectAPIURL();
        this.token = localStorage.getItem('sspo_auth_token');
        this.currentUser = null;
        this.eventListeners = new Map();
        this.cache = new Map();
        
        console.log(`🔌 API Connected: ${this.baseURL}`);
        
        if (this.token) {
            this.validateToken();
        }
    }

    detectAPIURL() {
        const hostname = window.location.hostname;
        
        // W produkcji używamy relatywnej ścieżki (nginx proxy)
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            return '/api';
        }
        
        // Lokalnie bezpośrednio do backendu
        return 'http://localhost:3000/api';
    }

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

    // ==================== AUTHENTICATION ====================

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
            this.logout();
            return false;
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('sspo_auth_token');
        this.cache.clear();
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

    // ==================== COMMENTS ====================

    async getComments(articleId) {
        try {
            const data = await this.request(`/comments/${articleId}`);
            this.cache.set(`comments:${articleId}`, data.comments);
            return data.comments;
        } catch (error) {
            console.error('Błąd pobierania komentarzy:', error);
            return this.cache.get(`comments:${articleId}`) || [];
        }
    }

    async addComment(articleId, text, parentId = null) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany aby dodać komentarz');
        }

        const data = await this.request('/comments', {
            method: 'POST',
            body: JSON.stringify({ articleId, text, parentId })
        });

        this.emit('comment:added', data.comment);
        this.cache.delete(`comments:${articleId}`);
        return data.comment;
    }

    async deleteComment(commentId) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany');
        }

        await this.request(`/comments/${commentId}`, {
            method: 'DELETE'
        });

        this.emit('comment:deleted', commentId);
        return true;
    }

    // ==================== AMENDMENTS ====================

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
            throw new Error('Musisz być zalogowany');
        }

        if (!this.hasRole(['contributor', 'reviewer', 'admin'])) {
            throw new Error('Brak uprawnień (wymagana rola: contributor)');
        }

        const data = await this.request('/amendments', {
            method: 'POST',
            body: JSON.stringify({ articleId, originalText, proposedText, reason })
        });

        this.emit('amendment:added', data.amendment);
        return data.amendment;
    }

    async voteOnAmendment(amendmentId, voteType) {
        if (!this.isLoggedIn()) {
            throw new Error('Musisz być zalogowany');
        }

        if (!this.hasRole(['reviewer', 'admin'])) {
            throw new Error('Brak uprawnień (wymagana rola: reviewer)');
        }

        await this.request(`/amendments/${amendmentId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ voteType })
        });

        this.emit('amendment:voted', { amendmentId, voteType });
        return true;
    }

    async updateAmendmentStatus(amendmentId, status) {
        if (!this.hasRole(['admin'])) {
            throw new Error('Brak uprawnień (wymagana rola: admin)');
        }

        await this.request(`/amendments/${amendmentId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });

        this.emit('amendment:status_changed', { amendmentId, status });
        return true;
    }

    // ==================== USERS (ADMIN) ====================

    async getUsers() {
        if (!this.hasRole(['admin'])) {
            throw new Error('Brak uprawnień (wymagana rola: admin)');
        }

        const data = await this.request('/users');
        return data.users;
    }

    async updateUserRole(userId, role) {
        if (!this.hasRole(['admin'])) {
            throw new Error('Brak uprawnień (wymagana rola: admin)');
        }

        await this.request(`/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role })
        });

        this.emit('user:role_changed', { userId, role });
        return true;
    }
}

// ==================== UI SYSTEM ====================

class CollaborationUI {
    constructor(api) {
        this.api = api;
        this.currentArticle = null;
        this.comments = [];
        this.amendments = [];
        
        this.init();
    }

    init() {
        this.createToolbar();
        this.setupEventListeners();
        this.updateAuthUI();
        
        // Auto-refresh co 30 sekund jeśli zalogowany
        setInterval(() => {
            if (this.api.isLoggedIn() && this.currentArticle) {
                this.loadComments(this.currentArticle);
            }
        }, 30000);
        
        console.log('✅ UI System initialized');
    }

    setupEventListeners() {
        this.api.on('auth:login', () => {
            this.updateAuthUI();
            this.showNotification('Zalogowano pomyślnie!', 'success');
        });

        this.api.on('auth:logout', () => {
            this.updateAuthUI();
            this.showNotification('Wylogowano', 'info');
        });

        this.api.on('comment:added', () => {
            if (this.currentArticle) {
                this.loadComments(this.currentArticle);
            }
        });

        this.api.on('amendment:added', () => {
            this.showNotification('Poprawka dodana pomyślnie!', 'success');
        });

        this.api.on('amendment:voted', () => {
            this.showNotification('Głos oddany!', 'success');
        });
    }

    // ==================== TOOLBAR ====================

    createToolbar() {
        // Dodaj klasę do body aby aktywować padding
        document.body.classList.add('sspo-has-toolbar');
        
        const toolbar = document.createElement('div');
        toolbar.className = 'sspo-toolbar';
        toolbar.innerHTML = `
            <div class="sspo-toolbar-content">
                <div class="sspo-toolbar-left">
                    <h3>
                        📚 System Prawny SSPO
                        <span class="sspo-toolbar-badge">v2.1</span>
                    </h3>
                    <div class="sspo-user-info" id="sspo-user-info">
                        <span>👋 Niezalogowany</span>
                    </div>
                </div>
                <div class="sspo-toolbar-right">
                    <button class="sspo-btn secondary" onclick="collaborationSystem.showAmendments()">
                        📝 Poprawki
                    </button>
                    <button class="sspo-btn secondary" onclick="collaborationSystem.showAbout()">
                        ℹ️ O systemie
                    </button>
                    <button class="sspo-btn primary" id="sspo-auth-button">
                        🔐 Zaloguj się
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertBefore(toolbar, document.body.firstChild);
        
        // Setup auth button
        document.getElementById('sspo-auth-button').addEventListener('click', () => {
            if (this.api.isLoggedIn()) {
                this.showUserMenu();
            } else {
                this.showLoginModal();
            }
        });
    }

    updateAuthUI() {
        const user = this.api.getCurrentUser();
        const userInfo = document.getElementById('sspo-user-info');
        const authButton = document.getElementById('sspo-auth-button');
        
        if (user) {
            const roleColors = {
                admin: '👑',
                reviewer: '⭐',
                contributor: '✍️',
                viewer: '👁️'
            };
            
            userInfo.innerHTML = `
                <span>${roleColors[user.role] || '👤'} ${user.name}</span>
                <span class="sspo-user-role-badge">${user.role}</span>
            `;
            
            authButton.textContent = `👤 ${user.name.split(' ')[0]}`;
            authButton.className = 'sspo-btn primary';
        } else {
            userInfo.innerHTML = '<span>👋 Niezalogowany</span>';
            authButton.textContent = '🔐 Zaloguj się';
            authButton.className = 'sspo-btn primary';
        }
        
        this.updateArticleButtons();
    }

    updateArticleButtons() {
        // Usuń istniejące przyciski
        const existingActions = document.querySelectorAll('.sspo-article-actions');
        existingActions.forEach(el => el.remove());
        
        // Dodaj nowe jeśli na stronie artykułu
        const article = document.querySelector('article');
        if (article) {
            const actions = document.createElement('div');
            actions.className = 'sspo-article-actions';
            
            const articleId = this.extractArticleId();
            
            actions.innerHTML = `
                <button class="sspo-btn secondary sm" onclick="collaborationSystem.showCommentsModal('${articleId}')">
                    💬 Komentarze
                </button>
                ${this.api.hasRole(['contributor', 'reviewer', 'admin']) ? `
                    <button class="sspo-btn secondary sm" onclick="collaborationSystem.showAmendmentModal('${articleId}')">
                        ✏️ Zaproponuj poprawkę
                    </button>
                ` : ''}
            `;
            
            article.insertBefore(actions, article.firstChild);
        }
    }

    extractArticleId() {
        const path = window.location.hash.replace('#/', '').replace('.md', '');
        return path || 'index';
    }

    // ==================== LOGIN MODAL ====================

    showLoginModal() {
        const modal = this.createModal(`
            <div class="sspo-sspo-auth-tabs">
                <button class="sspo-auth-tab active" data-tab="login">Zaloguj się</button>
                <button class="sspo-auth-tab" data-tab="register">Zarejestruj się</button>
            </div>
            
            <form id="login-form" class="sspo-auth-form active">
                <div class="sspo-form-group">
                    <label>📧 Email:</label>
                    <input type="email" id="login-email" required placeholder="twoj@email.pl">
                </div>
                <div class="sspo-form-group">
                    <label>🔒 Hasło:</label>
                    <input type="password" id="login-password" required placeholder="••••••••">
                </div>
                <button type="submit" class="sspo-btn primary" style="width: 100%;">
                    Zaloguj się
                </button>
                <div class="sspo-auth-error" style="display:none;"></div>
            </form>
            
            <form id="register-form" class="sspo-auth-form">
                <div class="sspo-form-group">
                    <label>👤 Imię i nazwisko:</label>
                    <input type="text" id="register-name" required placeholder="Jan Kowalski">
                </div>
                <div class="sspo-form-group">
                    <label>📧 Email:</label>
                    <input type="email" id="register-email" required placeholder="twoj@email.pl">
                </div>
                <div class="sspo-form-group">
                    <label>🔒 Hasło (min. 8 znaków):</label>
                    <input type="password" id="register-password" required minlength="8" placeholder="••••••••">
                </div>
                <button type="submit" class="sspo-btn primary" style="width: 100%;">
                    Zarejestruj się
                </button>
                <div class="sspo-auth-error" style="display:none;"></div>
            </form>
        `, '🔐 Logowanie do systemu SSPO');

        // Tab switching
        modal.querySelectorAll('.sspo-auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.sspo-auth-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.sspo-auth-form').forEach(f => f.classList.remove('active'));
                tab.classList.add('active');
                const formId = tab.dataset.tab === 'login' ? 'login-form' : 'register-form';
                modal.querySelector(`#${formId}`).classList.add('active');
            });
        });

        // Login form
        modal.querySelector('#login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = modal.querySelector('#login-email').value;
            const password = modal.querySelector('#login-password').value;
            const errorDiv = modal.querySelector('#login-form .sspo-auth-error');
            const button = e.target.querySelector('button[type="submit"]');

            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Logowanie...';

            const result = await this.api.login(email, password);
            
            if (result.success) {
                this.closeModal(modal);
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
                button.disabled = false;
                button.textContent = 'Zaloguj się';
            }
        });

        // Register form
        modal.querySelector('#register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = modal.querySelector('#register-name').value;
            const email = modal.querySelector('#register-email').value;
            const password = modal.querySelector('#register-password').value;
            const errorDiv = modal.querySelector('#register-form .sspo-auth-error');
            const button = e.target.querySelector('button[type="submit"]');

            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Rejestracja...';

            const result = await this.api.register(email, password, name);
            
            if (result.success) {
                this.closeModal(modal);
            } else {
                errorDiv.textContent = result.error;
                errorDiv.style.display = 'block';
                button.disabled = false;
                button.textContent = 'Zarejestruj się';
            }
        });
    }

    showUserMenu() {
        const user = this.api.getCurrentUser();
        if (!user) return;

        const menu = document.createElement('div');
        menu.className = 'sspo-user-menu';
        menu.innerHTML = `
            <div class="sspo-user-menu-item"><strong>👤 ${user.name}</strong></div>
            <div class="sspo-user-menu-item">📧 ${user.email}</div>
            <div class="sspo-user-menu-item">🎭 Rola: ${user.role}</div>
            <hr>
            <div class="sspo-user-menu-item" onclick="collaborationSystem.showChangePassword()">🔑 Zmień hasło</div>
            ${user.role === 'admin' ? '<div class="sspo-user-menu-item" onclick="collaborationSystem.showAdminPanel()">⚙️ Panel administratora</div>' : ''}
            <div class="sspo-user-menu-item" onclick="collaborationSystem.showMyActivity()">📊 Moja aktywność</div>
            <hr>
            <div class="sspo-user-menu-item" onclick="collaborationSystem.ui.api.logout(); window.location.reload();">🚪 Wyloguj się</div>
        `;
        
        document.body.appendChild(menu);
        
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    showChangePassword() {
        const modal = this.createModal(`
            <form id="change-password-form">
                <div class="sspo-form-group">
                    <label>Obecne hasło:</label>
                    <input type="password" id="current-password" required minlength="8">
                </div>
                <div class="sspo-form-group">
                    <label>Nowe hasło (min. 8 znaków):</label>
                    <input type="password" id="new-password" required minlength="8">
                </div>
                <div class="sspo-form-group">
                    <label>Potwierdź nowe hasło:</label>
                    <input type="password" id="confirm-password" required minlength="8">
                </div>
                <div id="password-error" class="sspo-auth-error" style="display:none"></div>
                <div class="sspo-modal-footer">
                    <button type="button" class="sspo-btn secondary" onclick="this.closest('.sspo-modal-overlay').remove()">Anuluj</button>
                    <button type="submit" class="sspo-btn primary">💾 Zmień hasło</button>
                </div>
            </form>
        `, '🔑 Zmiana hasła');

        document.getElementById('change-password-form').onsubmit = async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorDiv = document.getElementById('password-error');

            if (newPassword !== confirmPassword) {
                errorDiv.textContent = 'Nowe hasła nie są identyczne';
                errorDiv.style.display = 'block';
                return;
            }

            try {
                await this.api.request('/users/me/password', {
                    method: 'PATCH',
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                modal.remove();
                this.showNotification('✅ Hasło zostało zmienione', 'success');
            } catch (error) {
                errorDiv.textContent = error.message || 'Błąd zmiany hasła';
                errorDiv.style.display = 'block';
            }
        };
    }

    // ==================== COMMENTS ====================

    async showCommentsModal(articleId) {
        this.currentArticle = articleId;
        const comments = await this.api.getComments(articleId);
        
        const modal = this.createModal(`
            <div class="comments-section">
                <div class="comments-header">
                    <h3>
                        💬 Komentarze
                        <span class="comment-count">${comments.length}</span>
                    </h3>
                </div>
                
                ${this.api.isLoggedIn() ? `
                    <form id="add-comment-form" class="sspo-form-group">
                        <textarea id="comment-text" placeholder="Dodaj komentarz..." required></textarea>
                        <button type="submit" class="sspo-btn primary">Dodaj komentarz</button>
                    </form>
                ` : '<div class="alert alert-info">🔐 Zaloguj się aby dodawać komentarze</div>'}
                
                <div id="comments-list">
                    ${comments.length === 0 ? `
                        <div class="empty-state">
                            <div class="empty-state-icon">💭</div>
                            <div class="empty-state-text">Brak komentarzy</div>
                        </div>
                    ` : comments.map(c => this.renderComment(c)).join('')}
                </div>
            </div>
        `, `💬 Komentarze: ${articleId}`, 'large');

        if (this.api.isLoggedIn()) {
            modal.querySelector('#add-comment-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = modal.querySelector('#comment-text').value;
                
                try {
                    await this.api.addComment(articleId, text);
                    modal.querySelector('#comment-text').value = '';
                    
                    // Refresh comments
                    const updated = await this.api.getComments(articleId);
                    modal.querySelector('#comments-list').innerHTML = updated.map(c => this.renderComment(c)).join('');
                    modal.querySelector('.comment-count').textContent = updated.length;
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            });
        }
    }

    renderComment(comment) {
        const initials = comment.user_name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??';
        const date = new Date(comment.created_at).toLocaleString('pl-PL');
        
        return `
            <div class="comment-card">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-avatar">${initials}</div>
                        <div class="comment-author-info">
                            <h4>${comment.user_name || 'Anonim'}</h4>
                            <span class="comment-date">${date}</span>
                        </div>
                    </div>
                    ${this.api.getCurrentUser()?.id === comment.user_id || this.api.hasRole(['admin']) ? `
                        <div class="comment-actions">
                            <button class="sspo-btn ghost sm" onclick="collaborationSystem.deleteComment(${comment.id})">
                                🗑️ Usuń
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="comment-text">${this.escapeHtml(comment.text)}</div>
            </div>
        `;
    }

    async deleteComment(commentId) {
        if (!confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;
        
        try {
            await this.api.deleteComment(commentId);
            this.showNotification('Komentarz usunięty', 'success');
            
            if (this.currentArticle) {
                const modal = document.querySelector('.sspo-modal-overlay');
                if (modal) {
                    const updated = await this.api.getComments(this.currentArticle);
                    modal.querySelector('#comments-list').innerHTML = updated.map(c => this.renderComment(c)).join('');
                    modal.querySelector('.comment-count').textContent = updated.length;
                }
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // ==================== AMENDMENTS ====================

    async showAmendmentModal(articleId) {
        if (!this.api.hasRole(['contributor', 'reviewer', 'admin'])) {
            this.showNotification('Brak uprawnień (wymagana rola: contributor)', 'error');
            return;
        }

        const modal = this.createModal(`
            <form id="amendment-form">
                <div class="sspo-form-group">
                    <label>📄 Artykuł:</label>
                    <input type="text" value="${articleId}" disabled>
                </div>
                
                <div class="sspo-form-group">
                    <label>❌ Tekst oryginalny (do zmiany):</label>
                    <textarea id="original-text" required placeholder="Skopiuj fragment tekstu, który chcesz zmienić..."></textarea>
                </div>
                
                <div class="sspo-form-group">
                    <label>✅ Tekst proponowany (nowy):</label>
                    <textarea id="proposed-text" required placeholder="Wpisz nową wersję tekstu..."></textarea>
                </div>
                
                <div class="sspo-form-group">
                    <label>💡 Uzasadnienie (min. 10 znaków):</label>
                    <textarea id="amendment-reason" required minlength="10" placeholder="Wyjaśnij dlaczego proponujesz tę zmianę..."></textarea>
                </div>
                
                <button type="submit" class="sspo-btn primary" style="width: 100%;">
                    ✅ Prześlij poprawkę
                </button>
            </form>
        `, '✏️ Zaproponuj poprawkę');

        modal.querySelector('#amendment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = modal.querySelector('#original-text').value;
            const proposedText = modal.querySelector('#proposed-text').value;
            const reason = modal.querySelector('#amendment-reason').value;
            const button = e.target.querySelector('button[type="submit"]');
            
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> Wysyłanie...';
            
            try {
                await this.api.addAmendment(articleId, originalText, proposedText, reason);
                this.closeModal(modal);
            } catch (error) {
                this.showNotification(error.message, 'error');
                button.disabled = false;
                button.innerHTML = '✅ Prześlij poprawkę';
            }
        });
    }

    async showAmendments() {
        const amendments = await this.api.getAmendments();
        
        const modal = this.createModal(`
            <div class="amendments-section">
                ${amendments.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">📝</div>
                        <div class="empty-state-text">Brak poprawek</div>
                    </div>
                ` : amendments.map(a => this.renderAmendment(a)).join('')}
            </div>
        `, '📝 Wszystkie poprawki', 'large');
    }

    renderAmendment(amendment) {
        const date = new Date(amendment.created_at).toLocaleString('pl-PL');
        const canVote = this.api.hasRole(['reviewer', 'admin']);
        const isAdmin = this.api.hasRole(['admin']);
        
        return `
            <div class="amendment-card">
                <div class="amendment-header">
                    <div class="amendment-meta">
                        <div class="amendment-author">👤 ${amendment.user_name}</div>
                        <div class="amendment-date">📅 ${date}</div>
                    </div>
                    <span class="amendment-status ${amendment.status}">
                        ${amendment.status === 'pending' ? '⏳' : amendment.status === 'approved' ? '✅' : '❌'}
                        ${amendment.status}
                    </span>
                </div>
                
                <div class="amendment-changes">
                    <div class="amendment-text-block original">
                        <h5>❌ Tekst oryginalny:</h5>
                        <p>${this.escapeHtml(amendment.original_text)}</p>
                    </div>
                    <div class="amendment-text-block proposed">
                        <h5>✅ Tekst proponowany:</h5>
                        <p>${this.escapeHtml(amendment.proposed_text)}</p>
                    </div>
                </div>
                
                <div class="amendment-reason">
                    <h5>💡 Uzasadnienie:</h5>
                    <p>${this.escapeHtml(amendment.reason)}</p>
                </div>
                
                <div class="amendment-voting">
                    <div class="vote-option">
                        <span class="vote-count for">${amendment.votes_for}</span>
                        <span class="vote-label">Za</span>
                    </div>
                    <div class="vote-option">
                        <span class="vote-count against">${amendment.votes_against}</span>
                        <span class="vote-label">Przeciw</span>
                    </div>
                    <div class="vote-option">
                        <span class="vote-count abstain">${amendment.votes_abstain}</span>
                        <span class="vote-label">Wstrzymuję się</span>
                    </div>
                </div>
                
                <div class="amendment-actions">
                    ${canVote && amendment.status === 'pending' ? `
                        <button class="sspo-btn success sm" onclick="collaborationSystem.voteAmendment(${amendment.id}, 'for')">
                            👍 Za
                        </button>
                        <button class="sspo-btn danger sm" onclick="collaborationSystem.voteAmendment(${amendment.id}, 'against')">
                            👎 Przeciw
                        </button>
                        <button class="sspo-btn secondary sm" onclick="collaborationSystem.voteAmendment(${amendment.id}, 'abstain')">
                            ⏸️ Wstrzymuję się
                        </button>
                    ` : ''}
                    ${isAdmin && amendment.status === 'pending' ? `
                        <button class="sspo-btn success sm" onclick="collaborationSystem.updateAmendmentStatus(${amendment.id}, 'approved')">
                            ✅ Zatwierdź
                        </button>
                        <button class="sspo-btn danger sm" onclick="collaborationSystem.updateAmendmentStatus(${amendment.id}, 'rejected')">
                            ❌ Odrzuć
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    async voteAmendment(amendmentId, voteType) {
        try {
            await this.api.voteOnAmendment(amendmentId, voteType);
            
            // Refresh amendments list
            const modal = document.querySelector('.sspo-modal-overlay');
            if (modal) {
                const amendments = await this.api.getAmendments();
                modal.querySelector('.amendments-section').innerHTML = amendments.map(a => this.renderAmendment(a)).join('');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    async updateAmendmentStatus(amendmentId, status) {
        try {
            await this.api.updateAmendmentStatus(amendmentId, status);
            
            // Refresh amendments list
            const modal = document.querySelector('.sspo-modal-overlay');
            if (modal) {
                const amendments = await this.api.getAmendments();
                modal.querySelector('.amendments-section').innerHTML = amendments.map(a => this.renderAmendment(a)).join('');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    // ==================== ADMIN PANEL ====================

    async showAdminPanel() {
        if (!this.api.hasRole(['admin'])) {
            this.showNotification('Brak uprawnień', 'error');
            return;
        }

        const users = await this.api.getUsers();
        
        const modal = this.createModal(`
            <div class="sspo-admin-tabs">
                <button class="sspo-admin-tab active" data-tab="users">👥 Użytkownicy</button>
                <button class="sspo-admin-tab" data-tab="stats">📊 Statystyki</button>
            </div>
            
            <div class="sspo-admin-content">
                <div id="admin-users" class="sspo-admin-tab-content active">
                    <table class="sspo-admin-table">
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
                                        <select data-user-id="${u.id}" class="sspo-role-select">
                                            <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>👁️ Viewer</option>
                                            <option value="contributor" ${u.role === 'contributor' ? 'selected' : ''}>✍️ Contributor</option>
                                            <option value="reviewer" ${u.role === 'reviewer' ? 'selected' : ''}>⭐ Reviewer</option>
                                            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>👑 Admin</option>
                                        </select>
                                    </td>
                                    <td>${u.last_login ? new Date(u.last_login).toLocaleString('pl-PL') : 'Nigdy'}</td>
                                    <td>
                                        <button class="sspo-btn sm secondary sspo-btn-save-role" data-user-id="${u.id}">💾</button>
                                        <button class="sspo-btn sm warning sspo-btn-reset-password" data-user-id="${u.id}" data-user-email="${u.email}">🔑</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div id="admin-stats" class="sspo-admin-tab-content" style="display:none">
                    <div class="sspo-stats-grid">
                        <div class="sspo-stat-card">
                            <div class="sspo-stat-value">${users.length}</div>
                            <div class="sspo-stat-label">👥 Użytkowników</div>
                        </div>
                        <div class="sspo-stat-card">
                            <div class="sspo-stat-value">${users.filter(u => u.role === 'admin').length}</div>
                            <div class="sspo-stat-label">👑 Administratorów</div>
                        </div>
                        <div class="sspo-stat-card">
                            <div class="sspo-stat-value">${users.filter(u => u.role === 'reviewer').length}</div>
                            <div class="sspo-stat-label">⭐ Recenzentów</div>
                        </div>
                        <div class="sspo-stat-card">
                            <div class="sspo-stat-value">${users.filter(u => u.role === 'contributor').length}</div>
                            <div class="sspo-stat-label">✍️ Współtwórców</div>
                        </div>
                    </div>
                    
                    <div class="sspo-alert info" style="margin-top: 2rem">
                        <strong>ℹ️ Domyślne konto administratora:</strong><br>
                        Email: <code>admin@sspo.com.pl</code><br>
                        Hasło: <code>ChangeMe123!</code><br>
                        <br>
                        <strong>⚠️ WAŻNE:</strong> Zmień hasło administratora zaraz po pierwszym logowaniu!
                    </div>
                </div>
            </div>
        `, '⚙️ Panel Administratora', 'large');

        // Tab switching
        modal.querySelectorAll('.sspo-admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                modal.querySelectorAll('.sspo-admin-tab').forEach(t => t.classList.remove('active'));
                modal.querySelectorAll('.sspo-admin-tab-content').forEach(c => c.style.display = 'none');
                
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                modal.querySelector(`#admin-${tabId}`).style.display = 'block';
            });
        });

        // Save role buttons
        modal.querySelectorAll('.sspo-btn-save-role').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.getAttribute('data-user-id');
                const select = modal.querySelector(`.sspo-role-select[data-user-id="${userId}"]`);
                const newRole = select.value;
                
                try {
                    await this.api.updateUserRole(userId, newRole);
                    this.showNotification('✅ Rola zaktualizowana', 'success');
                } catch (error) {
                    this.showNotification(error.message, 'error');
                }
            });
        });

        // Reset password buttons
        modal.querySelectorAll('.sspo-btn-reset-password').forEach(btn => {
            btn.addEventListener('click', () => {
                const userId = btn.getAttribute('data-user-id');
                const userEmail = btn.getAttribute('data-user-email');
                this.showResetPasswordModal(userId, userEmail);
            });
        });
    }

    showResetPasswordModal(userId, userEmail) {
        const modal = this.createModal(`
            <form id="reset-password-form">
                <div class="sspo-alert info">
                    Resetowanie hasła dla użytkownika: <strong>${userEmail}</strong>
                </div>
                <div class="sspo-form-group">
                    <label>Nowe hasło (min. 8 znaków):</label>
                    <input type="text" id="new-admin-password" required minlength="8" value="NoweHaslo123!">
                    <small>Wygenerowane automatycznie. Możesz zmienić.</small>
                </div>
                <div id="reset-error" class="sspo-auth-error" style="display:none"></div>
                <div class="sspo-modal-footer">
                    <button type="button" class="sspo-btn secondary" onclick="this.closest('.sspo-modal-overlay').remove()">Anuluj</button>
                    <button type="submit" class="sspo-btn warning">🔑 Resetuj hasło</button>
                </div>
            </form>
        `, '🔑 Reset hasła użytkownika');

        document.getElementById('reset-password-form').onsubmit = async (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-admin-password').value;
            const errorDiv = document.getElementById('reset-error');

            try {
                await this.api.request(`/users/${userId}/reset-password`, {
                    method: 'PATCH',
                    body: JSON.stringify({ newPassword })
                });

                modal.remove();
                this.showNotification(`✅ Hasło zresetowane dla ${userEmail}`, 'success');
                
                // Show password to admin
                const infoModal = this.createModal(`
                    <div class="sspo-alert success">
                        <h4>✅ Hasło zostało zresetowane</h4>
                        <p><strong>Email:</strong> ${userEmail}</p>
                        <p><strong>Nowe hasło:</strong> <code>${newPassword}</code></p>
                        <br>
                        <p>⚠️ Przekaż to hasło użytkownikowi bezpiecznym kanałem!</p>
                    </div>
                    <div class="sspo-modal-footer">
                        <button class="sspo-btn primary" onclick="this.closest('.sspo-modal-overlay').remove()">OK</button>
                    </div>
                `, '✅ Hasło zresetowane');
            } catch (error) {
                errorDiv.textContent = error.message || 'Błąd resetowania hasła';
                errorDiv.style.display = 'block';
            }
        };
    }

    // ==================== MY ACTIVITY ====================

    async showMyActivity() {
        const user = this.api.getCurrentUser();
        if (!user) return;

        const comments = await this.api.getComments('all');
        const amendments = await this.api.getAmendments({ userId: user.id });
        
        const myComments = comments.filter(c => c.user_id === user.id);
        
        const modal = this.createModal(`
            <div class="alert alert-info">
                <strong>👤 ${user.name}</strong><br>
                📧 ${user.email}<br>
                🎭 Rola: ${user.role}
            </div>
            
            <h4>💬 Moje komentarze (${myComments.length}):</h4>
            ${myComments.length === 0 ? '<p>Brak komentarzy</p>' : myComments.map(c => this.renderComment(c)).join('')}
            
            <h4 style="margin-top: 2rem;">📝 Moje poprawki (${amendments.length}):</h4>
            ${amendments.length === 0 ? '<p>Brak poprawek</p>' : amendments.map(a => this.renderAmendment(a)).join('')}
        `, '📊 Moja aktywność', 'large');
    }

    // ==================== ABOUT ====================

    showAbout() {
        this.createModal(`
            <div class="alert alert-info">
                <h3>📚 System Współpracy SSPO</h3>
                <p><strong>Wersja:</strong> 2.0.0</p>
                <p><strong>Backend API:</strong> ${this.api.baseURL}</p>
            </div>
            
            <h4>🎯 Funkcje:</h4>
            <ul>
                <li>✅ System autentykacji JWT</li>
                <li>✅ Role i uprawnienia (viewer, contributor, reviewer, admin)</li>
                <li>✅ Komentarze do artykułów</li>
                <li>✅ Propozycje poprawek</li>
                <li>✅ System głosowania</li>
                <li>✅ Panel administracyjny</li>
            </ul>
            
            <h4>👥 Role:</h4>
            <ul>
                <li><strong>👁️ Viewer:</strong> Przeglądanie dokumentów, dodawanie komentarzy</li>
                <li><strong>✍️ Contributor:</strong> Viewer + dodawanie poprawek</li>
                <li><strong>⭐ Reviewer:</strong> Contributor + głosowanie na poprawki</li>
                <li><strong>👑 Admin:</strong> Wszystko + zarządzanie użytkownikami</li>
            </ul>
            
            <div class="alert alert-success" style="margin-top: 1rem;">
                <strong>🚀 System gotowy do użycia!</strong><br>
                Zaloguj się aby zacząć współpracę.
            </div>
        `, 'ℹ️ O systemie', 'large');
    }

    // ==================== UTILITIES ====================

    createModal(content, title = 'Modal', size = '') {
        const overlay = document.createElement('div');
        overlay.className = 'sspo-modal-overlay';
        overlay.innerHTML = `
            <div class="sspo-modal ${size}">
                <div class="sspo-modal-header">
                    <h3>${title}</h3>
                    <button class="sspo-close-btn">×</button>
                </div>
                <div class="sspo-modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.sspo-close-btn').addEventListener('click', () => {
            this.closeModal(overlay);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal(overlay);
            }
        });
        
        return overlay;
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = 'position: fixed; top: 100px; right: 20px; z-index: 10002; min-width: 300px; animation: slideUp 0.3s ease;';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ==================== INITIALIZATION ====================

let collaborationSystem;

document.addEventListener('DOMContentLoaded', () => {
    const api = new CollaborationAPI();
    const ui = new CollaborationUI(api);
    
    // Initialize paragraph comments if available
    if (window.ParagraphComments) {
        window.paragraphComments = new ParagraphComments(api);
        window.paragraphComments.init();
        console.log('✅ Paragraph Comments Extension loaded');
    }
    
    collaborationSystem = {
        api,
        ui,
        showLoginModal: () => ui.showLoginModal(),
        showUserMenu: () => ui.showUserMenu(),
        showCommentsModal: (id) => ui.showCommentsModal(id),
        showAmendmentModal: (id) => ui.showAmendmentModal(id),
        showAmendments: () => ui.showAmendments(),
        showAdminPanel: () => ui.showAdminPanel(),
        showMyActivity: () => ui.showMyActivity(),
        showAbout: () => ui.showAbout(),
        deleteComment: (id) => ui.deleteComment(id),
        voteAmendment: (id, type) => ui.voteAmendment(id, type),
        updateAmendmentStatus: (id, status) => ui.updateAmendmentStatus(id, status)
    };
    
    // Watch for route changes
    window.addEventListener('hashchange', () => {
        ui.updateArticleButtons();
        // Reinit paragraph comments on page change
        if (window.paragraphComments) {
            setTimeout(() => window.paragraphComments.addCommentIcons(), 100);
        }
    });
    
    console.log('✅ Collaboration System v2.1.0 loaded');
    console.log('🔌 Backend:', api.baseURL);
    console.log('👤 User:', api.getCurrentUser()?.name || 'Not logged in');
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
