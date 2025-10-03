/**
 * System Współpracy dla Regulaminu SSPO
 * Umożliwia komentowanie, zgłaszanie poprawek i współpracę
 */

class CollaborationSystem {
    constructor() {
        this.comments = [];
        this.amendments = [];
        this.versions = [];
        this.users = [];
        this.currentUser = this.getCurrentUser();
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.injectUI();
        console.log('📝 System Współpracy załadowany');
    }

    // ==================== DANE ====================
    
    loadData() {
        // Ładowanie z localStorage (może być zastąpione API)
        this.comments = JSON.parse(localStorage.getItem('sspo_comments') || '[]');
        this.amendments = JSON.parse(localStorage.getItem('sspo_amendments') || '[]');
        this.versions = JSON.parse(localStorage.getItem('sspo_versions') || '[]');
        this.users = JSON.parse(localStorage.getItem('sspo_users') || '[]');
    }

    saveData() {
        localStorage.setItem('sspo_comments', JSON.stringify(this.comments));
        localStorage.setItem('sspo_amendments', JSON.stringify(this.amendments));
        localStorage.setItem('sspo_versions', JSON.stringify(this.versions));
        localStorage.setItem('sspo_users', JSON.stringify(this.users));
    }

    getCurrentUser() {
        let user = JSON.parse(localStorage.getItem('sspo_current_user') || 'null');
        if (!user) {
            user = {
                id: this.generateId(),
                name: 'Gość',
                email: '',
                role: 'viewer',
                joinedAt: new Date().toISOString()
            };
            localStorage.setItem('sspo_current_user', JSON.stringify(user));
        }
        return user;
    }

    // ==================== KOMENTARZE ====================

    addComment(articleId, text, parentId = null) {
        const comment = {
            id: this.generateId(),
            articleId: articleId,
            parentId: parentId,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            text: text,
            createdAt: new Date().toISOString(),
            likes: 0,
            resolved: false
        };

        this.comments.push(comment);
        this.saveData();
        this.renderComments(articleId);
        return comment;
    }

    getCommentsForArticle(articleId) {
        return this.comments.filter(c => c.articleId === articleId && !c.parentId);
    }

    getReplies(commentId) {
        return this.comments.filter(c => c.parentId === commentId);
    }

    // ==================== POPRAWKI ====================

    proposeAmendment(articleId, originalText, proposedText, reason) {
        const amendment = {
            id: this.generateId(),
            articleId: articleId,
            userId: this.currentUser.id,
            userName: this.currentUser.name,
            originalText: originalText,
            proposedText: proposedText,
            reason: reason,
            status: 'pending', // pending, approved, rejected
            votes: {
                for: 0,
                against: 0,
                abstain: 0
            },
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.amendments.push(amendment);
        this.saveData();
        this.showNotification('Poprawka zgłoszona pomyślnie!', 'success');
        return amendment;
    }

    getAmendmentsForArticle(articleId) {
        return this.amendments.filter(a => a.articleId === articleId);
    }

    voteOnAmendment(amendmentId, vote) {
        const amendment = this.amendments.find(a => a.id === amendmentId);
        if (amendment) {
            amendment.votes[vote]++;
            amendment.updatedAt = new Date().toISOString();
            this.saveData();
            this.showNotification('Głos oddany!', 'success');
        }
    }

    // ==================== WERSJE ====================

    createVersion(description) {
        const version = {
            id: this.generateId(),
            version: `v${this.versions.length + 1}.0`,
            description: description,
            createdBy: this.currentUser.name,
            createdAt: new Date().toISOString(),
            changes: this.amendments.filter(a => a.status === 'approved')
        };

        this.versions.push(version);
        this.saveData();
        return version;
    }

    // ==================== UI ====================

    injectUI() {
        // Dodaj pasek narzędzi współpracy
        this.addCollaborationToolbar();
        
        // Dodaj przyciski przy każdym artykule
        this.addArticleButtons();
        
        // Dodaj modal do komentarzy i poprawek
        this.addModals();
    }

    addCollaborationToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'collaboration-toolbar';
        toolbar.className = 'collab-toolbar';
        toolbar.innerHTML = `
            <div class="collab-toolbar-content">
                <div class="collab-toolbar-left">
                    <h3>🤝 System Współpracy</h3>
                    <span class="user-info">Zalogowany jako: <strong>${this.currentUser.name}</strong></span>
                </div>
                <div class="collab-toolbar-right">
                    <button class="collab-btn" onclick="collaborationSystem.showMyAmendments()">
                        📝 Moje Poprawki
                    </button>
                    <button class="collab-btn" onclick="collaborationSystem.showAllAmendments()">
                        📋 Wszystkie Poprawki (${this.amendments.length})
                    </button>
                    <button class="collab-btn" onclick="collaborationSystem.showVersions()">
                        📚 Historia Wersji
                    </button>
                    <button class="collab-btn primary" onclick="collaborationSystem.showUserSettings()">
                        👤 Ustawienia
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertBefore(toolbar, document.body.firstChild);
    }

    addArticleButtons() {
        // Obserwuj zmiany w DOM i dodawaj przyciski do artykułów
        const observer = new MutationObserver(() => {
            const articles = document.querySelectorAll('article h1, article h2, article h3');
            articles.forEach(heading => {
                if (!heading.querySelector('.article-actions')) {
                    const articleId = this.getArticleId(heading);
                    const actions = document.createElement('span');
                    actions.className = 'article-actions';
                    actions.innerHTML = `
                        <button class="action-btn" onclick="collaborationSystem.showComments('${articleId}')" title="Komentarze">
                            💬 ${this.getCommentsForArticle(articleId).length}
                        </button>
                        <button class="action-btn" onclick="collaborationSystem.showAmendmentForm('${articleId}')" title="Zaproponuj poprawkę">
                            ✏️ Poprawka
                        </button>
                        <button class="action-btn" onclick="collaborationSystem.highlightChanges('${articleId}')" title="Pokaż zmiany">
                            🔍 Zmiany
                        </button>
                    `;
                    heading.appendChild(actions);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    addModals() {
        const modalsHTML = `
            <!-- Modal dla komentarzy -->
            <div id="comments-modal" class="collab-modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>💬 Komentarze</h2>
                        <button class="close-btn" onclick="collaborationSystem.closeModal('comments-modal')">&times;</button>
                    </div>
                    <div class="modal-body" id="comments-container"></div>
                    <div class="modal-footer">
                        <textarea id="comment-text" placeholder="Napisz komentarz..." rows="3"></textarea>
                        <button class="collab-btn primary" onclick="collaborationSystem.submitComment()">Dodaj Komentarz</button>
                    </div>
                </div>
            </div>

            <!-- Modal dla poprawek -->
            <div id="amendment-modal" class="collab-modal" style="display: none;">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>✏️ Zaproponuj Poprawkę</h2>
                        <button class="close-btn" onclick="collaborationSystem.closeModal('amendment-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Oryginalny tekst:</label>
                            <textarea id="amendment-original" rows="4" readonly></textarea>
                        </div>
                        <div class="form-group">
                            <label>Proponowana zmiana:</label>
                            <textarea id="amendment-proposed" rows="4" placeholder="Wprowadź propozycję zmiany..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Uzasadnienie:</label>
                            <textarea id="amendment-reason" rows="3" placeholder="Uzasadnij swoją propozycję..."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="collab-btn" onclick="collaborationSystem.closeModal('amendment-modal')">Anuluj</button>
                        <button class="collab-btn primary" onclick="collaborationSystem.submitAmendment()">Zgłoś Poprawkę</button>
                    </div>
                </div>
            </div>

            <!-- Modal listy poprawek -->
            <div id="amendments-list-modal" class="collab-modal" style="display: none;">
                <div class="modal-content large">
                    <div class="modal-header">
                        <h2>📋 Lista Poprawek</h2>
                        <button class="close-btn" onclick="collaborationSystem.closeModal('amendments-list-modal')">&times;</button>
                    </div>
                    <div class="modal-body" id="amendments-list-container"></div>
                </div>
            </div>

            <!-- Modal historii wersji -->
            <div id="versions-modal" class="collab-modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>📚 Historia Wersji</h2>
                        <button class="close-btn" onclick="collaborationSystem.closeModal('versions-modal')">&times;</button>
                    </div>
                    <div class="modal-body" id="versions-container"></div>
                </div>
            </div>

            <!-- Modal ustawień użytkownika -->
            <div id="user-settings-modal" class="collab-modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>👤 Ustawienia Użytkownika</h2>
                        <button class="close-btn" onclick="collaborationSystem.closeModal('user-settings-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Imię i Nazwisko:</label>
                            <input type="text" id="user-name" value="${this.currentUser.name}">
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <input type="email" id="user-email" value="${this.currentUser.email}">
                        </div>
                        <div class="form-group">
                            <label>Rola:</label>
                            <select id="user-role">
                                <option value="viewer" ${this.currentUser.role === 'viewer' ? 'selected' : ''}>Przeglądający</option>
                                <option value="contributor" ${this.currentUser.role === 'contributor' ? 'selected' : ''}>Współtwórca</option>
                                <option value="reviewer" ${this.currentUser.role === 'reviewer' ? 'selected' : ''}>Recenzent</option>
                                <option value="admin" ${this.currentUser.role === 'admin' ? 'selected' : ''}>Administrator</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="collab-btn primary" onclick="collaborationSystem.saveUserSettings()">Zapisz</button>
                    </div>
                </div>
            </div>
        `;

        const modalsContainer = document.createElement('div');
        modalsContainer.innerHTML = modalsHTML;
        document.body.appendChild(modalsContainer);
    }

    // ==================== MODAL HANDLERS ====================

    showComments(articleId) {
        this.currentArticleId = articleId;
        this.renderComments(articleId);
        this.openModal('comments-modal');
    }

    renderComments(articleId) {
        const container = document.getElementById('comments-container');
        const comments = this.getCommentsForArticle(articleId);

        if (comments.length === 0) {
            container.innerHTML = '<p class="no-data">Brak komentarzy. Bądź pierwszy!</p>';
            return;
        }

        container.innerHTML = comments.map(comment => this.renderComment(comment)).join('');
    }

    renderComment(comment) {
        const replies = this.getReplies(comment.id);
        return `
            <div class="comment" data-id="${comment.id}">
                <div class="comment-header">
                    <strong>${comment.userName}</strong>
                    <span class="comment-date">${this.formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-body">${this.escapeHtml(comment.text)}</div>
                <div class="comment-actions">
                    <button class="action-link" onclick="collaborationSystem.likeComment('${comment.id}')">
                        👍 ${comment.likes}
                    </button>
                    <button class="action-link" onclick="collaborationSystem.replyToComment('${comment.id}')">
                        💬 Odpowiedz
                    </button>
                    ${comment.userId === this.currentUser.id ? `
                        <button class="action-link" onclick="collaborationSystem.deleteComment('${comment.id}')">
                            🗑️ Usuń
                        </button>
                    ` : ''}
                </div>
                ${replies.length > 0 ? `
                    <div class="comment-replies">
                        ${replies.map(reply => this.renderComment(reply)).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    submitComment() {
        const text = document.getElementById('comment-text').value.trim();
        if (!text) {
            this.showNotification('Proszę wprowadzić treść komentarza', 'warning');
            return;
        }

        this.addComment(this.currentArticleId, text);
        document.getElementById('comment-text').value = '';
        this.showNotification('Komentarz dodany!', 'success');
    }

    showAmendmentForm(articleId) {
        this.currentArticleId = articleId;
        const originalText = this.getArticleText(articleId);
        document.getElementById('amendment-original').value = originalText;
        document.getElementById('amendment-proposed').value = '';
        document.getElementById('amendment-reason').value = '';
        this.openModal('amendment-modal');
    }

    submitAmendment() {
        const originalText = document.getElementById('amendment-original').value;
        const proposedText = document.getElementById('amendment-proposed').value.trim();
        const reason = document.getElementById('amendment-reason').value.trim();

        if (!proposedText || !reason) {
            this.showNotification('Proszę wypełnić wszystkie pola', 'warning');
            return;
        }

        this.proposeAmendment(this.currentArticleId, originalText, proposedText, reason);
        this.closeModal('amendment-modal');
    }

    showAllAmendments() {
        const container = document.getElementById('amendments-list-container');
        const amendments = this.amendments;

        if (amendments.length === 0) {
            container.innerHTML = '<p class="no-data">Brak zgłoszonych poprawek.</p>';
        } else {
            container.innerHTML = this.renderAmendmentsList(amendments);
        }

        this.openModal('amendments-list-modal');
    }

    showMyAmendments() {
        const container = document.getElementById('amendments-list-container');
        const amendments = this.amendments.filter(a => a.userId === this.currentUser.id);

        if (amendments.length === 0) {
            container.innerHTML = '<p class="no-data">Nie zgłosiłeś jeszcze żadnych poprawek.</p>';
        } else {
            container.innerHTML = this.renderAmendmentsList(amendments);
        }

        this.openModal('amendments-list-modal');
    }

    renderAmendmentsList(amendments) {
        return amendments.map(amendment => `
            <div class="amendment-item ${amendment.status}">
                <div class="amendment-header">
                    <span class="amendment-status status-${amendment.status}">${this.getStatusLabel(amendment.status)}</span>
                    <span class="amendment-author">${amendment.userName}</span>
                    <span class="amendment-date">${this.formatDate(amendment.createdAt)}</span>
                </div>
                <div class="amendment-body">
                    <div class="amendment-section">
                        <label>Oryginalny tekst:</label>
                        <div class="text-box">${this.escapeHtml(amendment.originalText)}</div>
                    </div>
                    <div class="amendment-section">
                        <label>Proponowana zmiana:</label>
                        <div class="text-box proposed">${this.escapeHtml(amendment.proposedText)}</div>
                    </div>
                    <div class="amendment-section">
                        <label>Uzasadnienie:</label>
                        <div class="text-box">${this.escapeHtml(amendment.reason)}</div>
                    </div>
                </div>
                <div class="amendment-votes">
                    <button class="vote-btn" onclick="collaborationSystem.voteOnAmendment('${amendment.id}', 'for')">
                        👍 Za (${amendment.votes.for})
                    </button>
                    <button class="vote-btn" onclick="collaborationSystem.voteOnAmendment('${amendment.id}', 'against')">
                        👎 Przeciw (${amendment.votes.against})
                    </button>
                    <button class="vote-btn" onclick="collaborationSystem.voteOnAmendment('${amendment.id}', 'abstain')">
                        🤷 Wstrzymuję się (${amendment.votes.abstain})
                    </button>
                </div>
            </div>
        `).join('');
    }

    showVersions() {
        const container = document.getElementById('versions-container');
        const versions = this.versions;

        if (versions.length === 0) {
            container.innerHTML = '<p class="no-data">Brak zapisanych wersji.</p>';
        } else {
            container.innerHTML = versions.map(version => `
                <div class="version-item">
                    <h3>${version.version}</h3>
                    <p><strong>Utworzona przez:</strong> ${version.createdBy}</p>
                    <p><strong>Data:</strong> ${this.formatDate(version.createdAt)}</p>
                    <p><strong>Opis:</strong> ${version.description}</p>
                    <p><strong>Liczba zmian:</strong> ${version.changes.length}</p>
                    <button class="collab-btn" onclick="collaborationSystem.viewVersion('${version.id}')">Zobacz szczegóły</button>
                </div>
            `).join('');
        }

        this.openModal('versions-modal');
    }

    showUserSettings() {
        this.openModal('user-settings-modal');
    }

    saveUserSettings() {
        this.currentUser.name = document.getElementById('user-name').value;
        this.currentUser.email = document.getElementById('user-email').value;
        this.currentUser.role = document.getElementById('user-role').value;
        
        localStorage.setItem('sspo_current_user', JSON.stringify(this.currentUser));
        this.showNotification('Ustawienia zapisane!', 'success');
        this.closeModal('user-settings-modal');
        
        // Odśwież toolbar
        const toolbar = document.querySelector('.user-info strong');
        if (toolbar) toolbar.textContent = this.currentUser.name;
    }

    // ==================== POMOCNICZE ====================

    openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    getArticleId(element) {
        return element.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }

    getArticleText(articleId) {
        // Pobierz tekst artykułu na podstawie ID
        const headings = document.querySelectorAll('article h1, article h2, article h3');
        for (let heading of headings) {
            if (this.getArticleId(heading) === articleId) {
                let text = '';
                let sibling = heading.nextElementSibling;
                while (sibling && !['H1', 'H2', 'H3'].includes(sibling.tagName)) {
                    text += sibling.textContent + '\n';
                    sibling = sibling.nextElementSibling;
                }
                return text.trim();
            }
        }
        return '';
    }

    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString('pl-PL');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getStatusLabel(status) {
        const labels = {
            'pending': '⏳ Oczekuje',
            'approved': '✅ Zatwierdzona',
            'rejected': '❌ Odrzucona'
        };
        return labels[status] || status;
    }

    highlightChanges(articleId) {
        const amendments = this.getAmendmentsForArticle(articleId);
        if (amendments.length === 0) {
            this.showNotification('Brak zmian dla tego artykułu', 'info');
            return;
        }
        // Implementacja podświetlania zmian
        this.showNotification(`Znaleziono ${amendments.length} poprawek`, 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    likeComment(commentId) {
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            comment.likes++;
            this.saveData();
            this.renderComments(this.currentArticleId);
        }
    }

    replyToComment(commentId) {
        // Implementacja odpowiedzi na komentarz
        this.showNotification('Funkcja w przygotowaniu', 'info');
    }

    deleteComment(commentId) {
        if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
            this.comments = this.comments.filter(c => c.id !== commentId);
            this.saveData();
            this.renderComments(this.currentArticleId);
            this.showNotification('Komentarz usunięty', 'success');
        }
    }

    viewVersion(versionId) {
        // Implementacja podglądu wersji
        this.showNotification('Funkcja w przygotowaniu', 'info');
    }

    // ==================== EVENT LISTENERS ====================

    setupEventListeners() {
        // Zamknij modal po kliknięciu poza nim
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('collab-modal')) {
                e.target.style.display = 'none';
            }
        });

        // ESC zamyka modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.collab-modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }
}

// Inicjalizacja systemu po załadowaniu strony
let collaborationSystem;
window.addEventListener('DOMContentLoaded', () => {
    collaborationSystem = new CollaborationSystem();
});
