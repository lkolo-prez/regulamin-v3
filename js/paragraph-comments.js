/**
 * 🎯 Paragraph Comments Extension
 * Dodaje inline komentarze przy konkretnych paragrafach dokumentu
 */

class ParagraphComments {
    constructor(api) {
        this.api = api;
        this.activeAnnotations = new Map();
    }

    init() {
        // Hook Docsify aby dodać ikony komentarzy
        if (window.$docsify) {
            const originalHook = window.$docsify.plugins || [];
            
            window.$docsify.plugins = [
                ...originalHook,
                (hook, vm) => {
                    hook.doneEach(() => {
                        this.addCommentIcons();
                        this.highlightCommentedParagraphs();
                    });
                }
            ];
        }
    }

    addCommentIcons() {
        const article = document.querySelector('article.markdown-section');
        if (!article) return;

        // Dodaj ikony komentarzy do każdego paragrafu
        const paragraphs = article.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
        
        paragraphs.forEach((el, index) => {
            // Skip jeśli już ma ikonę
            if (el.querySelector('.sspo-comment-icon')) return;
            
            // Wygeneruj unikalny ID dla paragrafu
            const paragraphId = this.generateParagraphId(el, index);
            el.setAttribute('data-paragraph-id', paragraphId);
            
            // Wrapper dla paragrafu z ikoną
            const wrapper = document.createElement('div');
            wrapper.className = 'sspo-paragraph-wrapper';
            wrapper.style.position = 'relative';
            
            const icon = document.createElement('button');
            icon.className = 'sspo-comment-icon';
            icon.innerHTML = '💬';
            icon.title = 'Dodaj komentarz do tego fragmentu';
            icon.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showParagraphComments(paragraphId, el);
            };
            
            // Sprawdź czy są komentarze
            this.checkParagraphComments(paragraphId).then(count => {
                if (count > 0) {
                    icon.innerHTML = `💬 ${count}`;
                    icon.classList.add('has-comments');
                    el.classList.add('sspo-has-comments');
                }
            });
            
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.insertBefore(icon, el);
        });
    }

    generateParagraphId(element, index) {
        const articleId = this.getCurrentArticleId();
        const text = element.textContent.substring(0, 50).replace(/\W+/g, '-');
        return `${articleId}:para-${index}-${text}`;
    }

    getCurrentArticleId() {
        const path = window.location.hash.replace('#/', '').replace('.md', '');
        return path || 'index';
    }

    async checkParagraphComments(paragraphId) {
        try {
            const comments = await this.api.getComments(paragraphId);
            return comments.length;
        } catch (error) {
            return 0;
        }
    }

    async showParagraphComments(paragraphId, element) {
        // Pobierz komentarze dla tego paragrafu
        const comments = await this.api.getComments(paragraphId);
        
        // Pokaż modal z komentarzami
        const modal = this.createCommentsModal(paragraphId, element, comments);
        document.body.appendChild(modal);
    }

    createCommentsModal(paragraphId, element, comments) {
        const overlay = document.createElement('div');
        overlay.className = 'sspo-modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'sspo-modal';
        modal.innerHTML = `
            <div class="sspo-modal-header">
                <h3>💬 Komentarze do fragmentu</h3>
                <button class="sspo-close-btn" onclick="this.closest('.sspo-modal-overlay').remove()">×</button>
            </div>
            <div class="sspo-modal-body">
                <div class="sspo-paragraph-preview">
                    <strong>Fragment dokumentu:</strong>
                    <blockquote>${element.textContent.substring(0, 200)}${element.textContent.length > 200 ? '...' : ''}</blockquote>
                </div>
                
                <div class="sspo-comments-list" id="para-comments-${paragraphId}">
                    ${this.renderCommentsList(comments)}
                </div>
                
                ${this.api.isLoggedIn() ? `
                    <div class="sspo-comment-form">
                        <textarea id="para-comment-text-${paragraphId}" 
                                  class="sspo-form-control" 
                                  placeholder="Twój komentarz do tego fragmentu..."
                                  rows="3"></textarea>
                        <button class="sspo-btn primary" onclick="paragraphComments.submitComment('${paragraphId}', '${element.getAttribute('data-paragraph-id')}')">
                            📝 Dodaj komentarz
                        </button>
                    </div>
                ` : `
                    <div class="sspo-alert info">
                        🔐 Zaloguj się aby dodać komentarz do tego fragmentu
                    </div>
                `}
            </div>
        `;
        
        overlay.appendChild(modal);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
        
        return overlay;
    }

    renderCommentsList(comments) {
        if (comments.length === 0) {
            return `
                <div class="sspo-empty-state">
                    <div class="sspo-empty-state-icon">💭</div>
                    <p>Brak komentarzy do tego fragmentu</p>
                    <small>Bądź pierwszy który skomentuje!</small>
                </div>
            `;
        }
        
        return comments.map(comment => `
            <div class="sspo-comment-card">
                <div class="sspo-comment-header">
                    <div class="sspo-comment-author">
                        <div class="sspo-comment-avatar">${comment.userName.charAt(0).toUpperCase()}</div>
                        <div class="sspo-comment-author-info">
                            <h4>${comment.userName}</h4>
                            <span class="sspo-comment-date">${new Date(comment.createdAt).toLocaleString('pl-PL')}</span>
                        </div>
                    </div>
                </div>
                <div class="sspo-comment-text">${this.escapeHtml(comment.text)}</div>
            </div>
        `).join('');
    }

    async submitComment(paragraphId, dataId) {
        const textarea = document.getElementById(`para-comment-text-${paragraphId}`);
        const text = textarea.value.trim();
        
        if (!text) {
            alert('Komentarz nie może być pusty');
            return;
        }
        
        try {
            await this.api.addComment(dataId, text);
            
            // Reload comments
            const comments = await this.api.getComments(dataId);
            const commentsList = document.getElementById(`para-comments-${paragraphId}`);
            commentsList.innerHTML = this.renderCommentsList(comments);
            
            textarea.value = '';
            
            // Update icon count
            this.updateCommentIcon(dataId);
            
        } catch (error) {
            alert('Błąd: ' + error.message);
        }
    }

    updateCommentIcon(paragraphId) {
        const element = document.querySelector(`[data-paragraph-id="${paragraphId}"]`);
        if (!element) return;
        
        const wrapper = element.parentElement;
        const icon = wrapper?.querySelector('.sspo-comment-icon');
        if (!icon) return;
        
        this.checkParagraphComments(paragraphId).then(count => {
            if (count > 0) {
                icon.innerHTML = `💬 ${count}`;
                icon.classList.add('has-comments');
                element.classList.add('sspo-has-comments');
            }
        });
    }

    highlightCommentedParagraphs() {
        // Dodaj wizualne oznaczenie paragrafów z komentarzami
        document.querySelectorAll('.sspo-has-comments').forEach(el => {
            el.style.borderLeft = '3px solid var(--sspo-primary)';
            el.style.paddingLeft = '12px';
            el.style.marginLeft = '-15px';
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export globally
window.ParagraphComments = ParagraphComments;
