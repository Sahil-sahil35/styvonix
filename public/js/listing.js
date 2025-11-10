document.addEventListener('DOMContentLoaded', function() {
    // --- ELEMENTS ---
    const productsGrid = document.querySelector('.products-grid');
    const allProductCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    const resultsCountEl = document.querySelector('.results-count');
    const paginationEl = document.querySelector('.pagination');
    const searchInput = document.querySelector('.filter-search input');
    const categoryCheckboxes = document.querySelectorAll('#category-filters input[type="checkbox"]');
    const materialChips = document.querySelectorAll('#material-chips .filter-chip');
    const priceRange = document.querySelector('.price-range');
    const priceRangeValues = document.querySelector('.price-range-values span:last-child');
    const sortSelect = document.getElementById('sort');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');

    // --- STATE ---
    let currentPage = 1;
    const itemsPerPage = 9;

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', () => debounce(applyFiltersAndSort));
    sortSelect.addEventListener('change', applyFiltersAndSort);
    priceRange.addEventListener('input', () => {
        priceRangeValues.textContent = `₹${priceRange.value}`;
        debounce(applyFiltersAndSort);
    });
    categoryCheckboxes.forEach(cb => cb.addEventListener('change', applyFiltersAndSort));
    materialChips.forEach(chip => chip.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('active');
        applyFiltersAndSort();
    }));
    clearFiltersBtn.addEventListener('click', resetAllFilters);
    filterToggle.addEventListener('click', () => {
        filterSidebar.classList.toggle('active');
        filterToggle.classList.toggle('active');
    });
     productsGrid.addEventListener('click', function(e) {
        if (e.target.matches('.add-to-cart')) {
            const productId = e.target.dataset.id;
            addToCart(productId, e.target);
        }
    });

    // --- LOGIC ---
    function applyFiltersAndSort() {
        currentPage = 1; // Reset to first page on any filter change

        // Get current filter values
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        const selectedMaterials = Array.from(materialChips).filter(chip => chip.classList.contains('active')).map(chip => chip.dataset.value);
        const maxPrice = parseFloat(priceRange.value);
        const sortBy = sortSelect.value;

        // 1. FILTER: Determine which cards are visible
        const visibleCards = allProductCards.filter(card => {
            const name = card.dataset.name;
            const desc = card.dataset.desc;
            const price = parseFloat(card.dataset.price);
            const categories = JSON.parse(card.dataset.category);
            const materials = JSON.parse(card.dataset.material);

            if (searchTerm && !name.includes(searchTerm) && !desc.includes(searchTerm)) return false;
            if (price > maxPrice) return false;
            if (selectedCategories.length > 0 && !categories.some(cat => selectedCategories.includes(cat))) return false;
            if (selectedMaterials.length > 0 && !materials.some(mat => selectedMaterials.includes(mat))) return false;

            return true;
        });

        // 2. SORT: Reorder the visible cards in the DOM
        const sortedCards = sortDom(visibleCards, sortBy);
        
        // Hide all cards initially
        allProductCards.forEach(card => card.style.display = 'none');
        
        // 3. PAGINATE: Show only the cards for the current page
        renderPage(sortedCards, currentPage);
    }
    
    function sortDom(cards, sortBy) {
        const sorted = [...cards].sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const idA = parseInt(a.dataset.idNum);
            const idB = parseInt(b.dataset.idNum);

            switch (sortBy) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'newest': return idB - idA;
                default: return 0; // Relevance (original order)
            }
        });

        // Re-append sorted elements to the grid
        sorted.forEach(card => productsGrid.appendChild(card));
        return sorted;
    }

    function renderPage(visibleCards, page) {
        const totalItems = visibleCards.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Show/hide cards based on pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        visibleCards.forEach((card, index) => {
            card.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });

        updateResultsCount(totalItems, page);
        renderPaginationControls(totalPages, page, visibleCards);
    }
    
    function updateResultsCount(total, page) {
        const start = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
        const end = Math.min(page * itemsPerPage, total);
        resultsCountEl.textContent = `Showing ${start}–${end} of ${total} products`;
    }

    function renderPaginationControls(totalPages, page, visibleCards) {
        paginationEl.innerHTML = '';
        if (totalPages <= 1) return;

        function createPageItem(text, pageNum, isDisabled = false, isActive = false) {
            const li = document.createElement('li');
            li.className = 'page-item';
            if (isDisabled) li.classList.add('disabled');
            if (isActive) li.classList.add('active');
            
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = text;
            a.dataset.page = pageNum;
            li.appendChild(a);
            return li;
        }
        
        // Add listeners
        paginationEl.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = e.target.dataset.page;
            if (targetPage && currentPage !== parseInt(targetPage)) {
                currentPage = parseInt(targetPage);
                renderPage(visibleCards, currentPage);
                window.scrollTo({ top: 400, behavior: 'smooth' });
            }
        });

        // Previous
        paginationEl.appendChild(createPageItem('Previous', page - 1, page === 1));
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
             paginationEl.appendChild(createPageItem(i, i, false, i === page));
        }

        // Next
        paginationEl.appendChild(createPageItem('Next', page + 1, page === totalPages));
    }

    function resetAllFilters() {
        searchInput.value = '';
        sortSelect.value = 'relevance';
        priceRange.value = priceRange.max;
        priceRangeValues.textContent = `₹${priceRange.max}`;
        categoryCheckboxes.forEach(cb => cb.checked = false);
        materialChips.forEach(chip => chip.classList.remove('active'));
        applyFiltersAndSort();
    }
    
    let debounceTimer;
    function debounce(func) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, 300);
    }
    
    // --- INITIALIZATION ---
    applyFiltersAndSort(); // Initial render
});