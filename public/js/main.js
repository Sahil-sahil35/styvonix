// The `window.allSiteData` and `window.allSiteProducts` global variables are now
// defined in an inline script in `src/layouts/Layout.astro`, populated with
// data fetched from Sanity on the server.

// =================================================================================
// INITIALIZATION FUNCTIONS
// These functions are called by other scripts (e.g., home.js) or on DOMContentLoaded
// to populate the UI with the global data.
// =================================================================================

function initProducts(products) {
    // This function might be used by other pages, so we keep it.
    // It's a placeholder if no other script uses it directly.
}

function initCategories(categories) {
    // This function might be used by other pages, so we keep it.
}

function initFeatures(features) {
    // This function might be used by other pages, so we keep it.
}

function initFooter(footerData, contactData) {
    const footerContent = document.querySelector('.footer-content');
    if (!footerContent) return;

    const sections = footerContent.querySelectorAll('.footer-section');
    if (sections.length < 3) return;

    // Section 1: Shop Links
    if (sections[0] && footerData.shopLinks) {
        let shopLinksHtml = '<h3>Shop Links</h3>';
        shopLinksHtml += footerData.shopLinks.map(link => {
            if (link.isModalTrigger) {
                return `<a href="#" class="js-contact-modal-trigger">${link.name}</a>`;
            }
            let finalHref = link.link.replace('index.html', '/').replace('.html', '').replace('html/', '/');
            return `<a href="${finalHref}">${link.name}</a>`;
        }).join('');
        sections[0].innerHTML = shopLinksHtml;
    }

    // Section 2: Categories
    if (sections[1] && footerData.categories) {
        let categoryLinksHtml = '<h3>Categories</h3>';
        categoryLinksHtml += footerData.categories.map(cat => {
            const categorySlug = cat.name.toLowerCase().replace(/\s+/g, '-');
            return `<a href="/category/${categorySlug}">${cat.name}</a>`;
        }).join('');
        sections[1].innerHTML = categoryLinksHtml;
    }

    // Section 3: Contact Info
    if (sections[2] && contactData) {
        sections[2].innerHTML = `<h3>Contact Info</h3>
            <a href="mailto:${contactData.email}">${contactData.email}</a>
            <a href="tel:${contactData.phone}">${contactData.phone}</a>
            <p id="footerAddress" >${contactData.address}</p>
            <p>${contactData.hours}</p>`;

        const footerAddress = document.getElementById('footerAddress');
        if (footerAddress) {
            footerAddress.addEventListener('click', openMapModal);
        }
    }

    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        footerBottom.innerHTML = `<p>&copy; ${new Date().getFullYear()} Styvonix Future Pvt. Ltd. All rights reserved.</p>`;
    }
}


function createCategoryDropdown() {
    if (typeof window.allSiteData === 'undefined' || !window.allSiteData.categories) {
        console.error("Category data is not available on the window object.");
        return;
    }

    const categories = window.allSiteData.categories || [];
    const desktopContainer = document.querySelector('.desktop-categories-dropdown');
    const mobileContainer = document.querySelector('.mobile-categories-dropdown');

    if (!desktopContainer || !mobileContainer) return;

    const categoryLinks = categories.map(category => {
        const slug = category.name.toLowerCase().replace(/\s+/g, '-');
        return `<a href="/category/${slug}">${category.name}</a>`;
    }).join('');

    desktopContainer.innerHTML = categoryLinks;
    mobileContainer.innerHTML = categoryLinks;
}

// =================================================================================
// UTILITY FUNCTIONS
// =================================================================================

function openContactModal(subject = '') {
    const modal = document.getElementById('contactModal');
    const subjectSpan = document.getElementById('modalInquirySubject');
    if (modal && subjectSpan) {
        subjectSpan.textContent = subject ? `Inquiry about ${subject}` : 'Your Inquiry';
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

function openMapModal() {
    const modal = document.getElementById('mapModal');
    if(modal) modal.style.display = 'block';
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

function addToCart(productId, buttonElement) {
    if (typeof window.allSiteProducts === 'undefined') return;
    const product = window.allSiteProducts.find(p => p.id === productId);
    if (!product) { return; }

    const imageUrl = (product.images && product.images.length > 0 && product.images[0].asset) ? product.images[0].asset.url : '';

    const item = { 
        id: product.id, 
        name: product.name, 
        price: (product.salePrice ?? product.price) || 0, 
        qty: 1, 
        thumbnail: imageUrl,
        specs: [ product.specs?.meshSize ? `Mesh: ${product.specs.meshSize}`: null ].filter(Boolean),
        negotiable: product.negotiable || false,
        slug: product.slug.current
    };

    let cart = [];
    try { cart = JSON.parse(sessionStorage.getItem('cartItems') || '[]'); } catch { cart = []; }

    const existingIndex = cart.findIndex(it => it.id === item.id);
    if (existingIndex >= 0) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push(item);
    }

    sessionStorage.setItem('cartItems', JSON.stringify(cart));
    const totalCount = cart.reduce((n, it) => n + it.qty, 0);
    sessionStorage.setItem('cartCount', String(totalCount));

    const cartCountBadge = document.querySelector('.cart-count');
    if (cartCountBadge) cartCountBadge.textContent = String(totalCount);

    showToast('Added to cart');

    if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Added!';
        buttonElement.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 1200);
    }
}

// =================================================================================
// DOMContentLoaded EVENT LISTENER
// Main entry point for client-side script execution.
// =================================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Data is now globally available on the `window` object.
    // We can now safely call all initialization functions.
    
    if (window.allSiteData) {
        createCategoryDropdown();
        initFooter(window.allSiteData.footer, window.allSiteData.contact);
    }

    // --- EVENT LISTENERS ---
    const header = document.getElementById('header');
    if (header) window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 50); });

    // Mobile Menu
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileMenuButton && mobileNav) {
        mobileMenuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        mobileNav.querySelectorAll('a:not(.mobile-category-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Mobile Category Toggle
    const mobileCategoryToggle = document.querySelector('.mobile-category-toggle');
    if (mobileCategoryToggle) {
        mobileCategoryToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = document.querySelector('.mobile-categories-dropdown');
            if (dropdown) dropdown.classList.toggle('active');
        });
    }

    // Cart Button & Count
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) cartBtn.addEventListener('click', () => { window.location.href = '/cart'; });

    const cartCountBadge = document.querySelector('.cart-count');
    if (cartCountBadge) cartCountBadge.textContent = sessionStorage.getItem('cartCount') || '0';

    // Global Contact Modal Triggers
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.js-contact-modal-trigger')) {
            e.preventDefault();
            openContactModal();
        }
    });
    
    // Contact Modal Logic
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const closeModalBtn = contactModal ? contactModal.querySelector('.close-modal') : null;
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeContactModal);
    if (contactModal) window.addEventListener('click', (event) => { if (event.target === contactModal) closeContactModal(); });
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            fetch(form.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    showToast('Thank you! Your message has been sent.');
                    form.reset();
                    closeContactModal();
                } else {
                    response.json().then(data => {
                        const errorMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'An unknown error occurred.';
                        throw new Error(errorMsg);
                    });
                }
            }).catch(error => {
                showToast('Error: ' + error.message, false);
            }).finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
        });
    }

    // Search Modal
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    function openSearchModal() { if (searchModal) { searchModal.style.display = 'block'; if (searchInput) searchInput.focus(); document.body.classList.add('no-scroll'); } }
    function closeSearchModal() { if (searchModal) { searchModal.style.display = 'none'; if (searchInput) searchInput.value = ''; if (searchResults) searchResults.innerHTML = ''; document.body.classList.remove('no-scroll'); } }

    document.querySelectorAll('.search-btn').forEach(btn => btn.addEventListener('click', openSearchModal));
    const closeSearchBtn = document.querySelector('.close-search');
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchModal);

    if (searchInput && searchResults && typeof window.allSiteProducts !== 'undefined') {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            if (term.length < 2) return;

            const filtered = window.allSiteProducts.filter(p => p.name.toLowerCase().includes(term)).slice(0, 10);

            if(filtered.length === 0) {
                searchResults.innerHTML = `<div class="search-result-item">No products found</div>`;
                return;
            }

            filtered.forEach(product => {
                const item = document.createElement('div');
                item.className = 'search-result-item';

                const imageUrl = (product.images && product.images.length > 0 && product.images[0].asset) ? product.images[0].asset.url : '';

                item.innerHTML = `<div style="display: flex; align-items: center;">
                                    <img src="${imageUrl}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 15px; object-fit: cover;">
                                    <div><div class="search-result-name">${product.name}</div></div>
                                  </div>`;
                item.addEventListener('click', () => { window.location.href = `/product/${product.slug.current}`; });
                searchResults.appendChild(item);
            });
        });
    }
    window.addEventListener('click', (event) => { if (event.target === searchModal) closeSearchModal(); });

    // Back to Top Button
    const backToTopButton = document.getElementById("backToTopBtn");
    if (backToTopButton) {
        const fabContainer = backToTopButton.parentElement;
        window.onscroll = function() {
            const isScrolled = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
            backToTopButton.style.display = isScrolled ? "block" : "none";
            if (fabContainer) {
                fabContainer.classList.toggle('btt-hidden', !isScrolled);
            }
        };
        backToTopButton.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
