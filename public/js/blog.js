document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTS ---
    const blogGrid = document.getElementById('blogGrid');
    const allArticleCards = Array.from(blogGrid.querySelectorAll('.blog-card'));
    const paginationContainer = document.getElementById('blogPagination');
    const searchInput = document.getElementById('blogSearch');
    const filterChips = document.querySelectorAll('.filter-chip');

    // --- STATE ---
    let currentPage = 1;
    const articlesPerPage = 6;

    // --- EVENT LISTENERS ---
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentPage = 1;
            filterAndRender();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            filterAndRender();
        });
    }

    if (paginationContainer) {
        paginationContainer.addEventListener('click', (e) => {
            e.preventDefault();
            const pageLink = e.target.closest('.page-link');
            if (pageLink) {
                const pageNum = parseInt(pageLink.dataset.page, 10);
                if (pageNum !== currentPage) {
                    currentPage = pageNum;
                    filterAndRender();
                    window.scrollTo({ top: document.querySelector('.blog-content').offsetTop, behavior: 'smooth' });
                }
            }
        });
    }
    
    // --- LOGIC ---
    function filterAndRender() {
        const activeChip = document.querySelector('.filter-chip.active');
        const category = activeChip ? activeChip.dataset.category : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        const visibleCards = allArticleCards.filter(card => {
            const cardCategory = card.dataset.category;
            const cardTitle = card.dataset.title;
            const cardExcerpt = card.dataset.excerpt;
            
            const categoryMatch = category === 'all' || cardCategory === category;
            const searchMatch = !searchTerm || cardTitle.includes(searchTerm) || cardExcerpt.includes(searchTerm);
            
            return categoryMatch && searchMatch;
        });
        
        renderPage(visibleCards, currentPage);
    }
    
    function renderPage(cards, page) {
        allArticleCards.forEach(card => card.style.display = 'none');

        if (cards.length === 0) {
            blogGrid.innerHTML = '<p>No articles found matching your criteria.</p>';
            renderPagination(0, articlesPerPage, 1);
        } else if (blogGrid.querySelector('p')) {
            blogGrid.innerHTML = '';
            cards.forEach(card => blogGrid.appendChild(card));
        }
        
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;

        cards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'block' : 'none';
        });

        renderPagination(cards.length, articlesPerPage, page);
    }

    function renderPagination(totalArticles, articlesPerPage, currentPage) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalArticles / articlesPerPage);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.dataset.page = i;
            pageLink.className = 'page-link' + (i === currentPage ? ' active' : '');
            paginationContainer.appendChild(pageLink);
        }
    }
    
    // --- INITIALIZATION ---
    filterAndRender();
});