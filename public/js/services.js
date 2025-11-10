document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTS ---
    const serviceGrid = document.getElementById('serviceGrid');
    const allServiceCards = Array.from(serviceGrid.querySelectorAll('.service-card'));
    const paginationContainer = document.getElementById('servicePagination');
    const searchInput = document.getElementById('serviceSearch');

    // --- STATE ---
    let currentPage = 1;
    const servicesPerPage = 6;

    // --- EVENT LISTENERS ---
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
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                }
            }
        });
    }

    serviceGrid.addEventListener('click', function(e) {
        const contactButton = e.target.closest('.service-contact-btn');
        if (contactButton) {
            handleContactClick(contactButton.dataset.id);
        }
    });

    function initTagScroller() {
        // Find scrollers ONLY on cards that are currently visible
        const containers = document.querySelectorAll('.service-card[style*="display: flex"] .tags-scroll-container');

        containers.forEach(container => {
            // Check if this scroller has already been initialized
            if (container.dataset.scrollerInit) return;

            const tagsWrapper = container.querySelector('.product-tags');
            if (!tagsWrapper) return;

            // Only activate scroller if the content is overflowing
            if (tagsWrapper.scrollWidth > tagsWrapper.clientWidth) {
                // Duplicate the tags for a seamless loop
                tagsWrapper.innerHTML += tagsWrapper.innerHTML;
                container.classList.add('autoscroll-tags');
                // Mark as initialized
                container.dataset.scrollerInit = 'true';
            }
        });
    }
    
    // --- LOGIC ---
    function filterAndRender() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        const visibleCards = allServiceCards.filter(card => {
            if (!searchTerm) return true; // Show all if search is empty
            const title = card.dataset.title || '';
            const excerpt = card.dataset.excerpt || '';
            const isVisible = title.includes(searchTerm) || excerpt.includes(searchTerm);
            return isVisible;
        });

        renderPage(visibleCards, currentPage);
    }
    
    function renderPage(cards, page) {
        // Hide all cards first
        allServiceCards.forEach(card => card.style.display = 'none');

        if (cards.length === 0) {
            serviceGrid.innerHTML = '<p>No services found matching your criteria.</p>';
            renderPagination(0, servicesPerPage, 1);
            return;
        } else if (serviceGrid.querySelector('p')) {
             serviceGrid.innerHTML = ''; // Clear 'no results' message if it exists
             cards.forEach(card => serviceGrid.appendChild(card));
        }

        const startIndex = (page - 1) * servicesPerPage;
        const endIndex = startIndex + servicesPerPage;

        cards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? 'flex' : 'none';
        });
        
        renderPagination(cards.length, servicesPerPage, page);

        initTagScroller();
    }

    function renderPagination(totalServices, servicesPerPage, currentPage) {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalServices / servicesPerPage);

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

    function handleContactClick(serviceId) {
        // The global `openContactModal` is available from main.js
        // We need to find the service title from the DOM element.
        const card = serviceGrid.querySelector(`.service-contact-btn[data-id="${serviceId}"]`).closest('.service-card');
        const title = card ? card.querySelector('h3').textContent : 'Service Inquiry';
        if (typeof openContactModal === 'function') {
            openContactModal(title);
        } else {
            console.error('openContactModal function not found.');
        }
    }

    // --- INITIALIZATION ---
    filterAndRender(); // Initial render of the first page
});