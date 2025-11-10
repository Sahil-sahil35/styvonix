// --- GLOBAL DATA STORE ---
let allSiteProducts = [];
let siteData = {};

// --- GLOBAL MODAL LOGIC ---
function openContactModal(subject = "General Inquiry") {
    const modal = document.getElementById('contactModal');
    const modalSubject = document.getElementById('modalInquirySubject');
    if (modal && modalSubject) {
        modalSubject.textContent = subject;
        modal.style.display = 'block';
        document.body.classList.add('no-scroll');
        modal.querySelector('.close-modal').addEventListener('click', closeContactModal);
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// --- SHARED FUNCTIONALITY ---
async function fetchGlobalData(basePath = '/') {
    if (allSiteProducts.length > 0 && Object.keys(siteData).length > 0) return;
    try {
        const [productsResponse, siteDataResponse] = await Promise.all([
            fetch(`${basePath}data/products.json`),
            fetch(`${basePath}data/data.json`)
        ]);
        const productsData = await productsResponse.json();
        allSiteProducts = productsData.products || [];
        siteData = await siteDataResponse.json();
    } catch (error) {
        console.error('Error fetching global data:', error);
    }
}

// Replace the existing function in public/js/main.js
function createCategoryDropdown() {
    if (!siteData.categories) {
        console.error("Category data not available to build dropdown.");
        return;
    }
    const categories = siteData.categories.map(c => c.name);

    const generateLinks = () => {
        return categories.map(category => {
            // This line automatically converts spaces to hyphens for the URL
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
            const categoryUrl = `/category/${categorySlug}`;
            return `<a href="${categoryUrl}">${category}</a>`;
        }).join('');
    };

    const desktopDropdown = document.querySelector('.desktop-categories-dropdown');
    if (desktopDropdown) {
        desktopDropdown.innerHTML = generateLinks();
    }
    
    const mobileDropdown = document.querySelector('.mobile-categories-dropdown');
    if (mobileDropdown) {
        mobileDropdown.innerHTML = generateLinks();
    }
    
    const mobileCategoryToggle = document.querySelector('.mobile-category-toggle');
    if (mobileCategoryToggle && mobileDropdown) {
        if (!mobileCategoryToggle.dataset.listenerAttached) {
            mobileCategoryToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mobileDropdown.classList.toggle('active');
                this.classList.toggle('open');
            });
            mobileCategoryToggle.dataset.listenerAttached = 'true';
        }
    }
}
function openMapModal() {
    // PASTE the <iframe> code from Google Maps here
    const mapIframeHtml = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3221.828880290941!2d77.1667795798199!3d28.695372718409665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0216273b1be3%3A0x57e9e3fd0194da4a!2sBasment%2C%20C%202%2C%2013%2C%20Ashok%20Vihar%20II%2C%20Pocket%20C%202%2C%20Phase%20II%2C%20Ashok%20Vihar%2C%20New%20Delhi%2C%20Delhi%2C%20110052!5e1!3m2!1sen!2sin!4v1758702313997!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

    // This part stays the same
    mapContainer.innerHTML = mapIframeHtml;
    mapModal.style.display = 'block';
    document.body.classList.add('no-scroll');
    mapModal.querySelector('.close-map-modal').addEventListener('click', closeMapModal);
}


function closeMapModal() {
    mapModal.style.display = 'none';
    mapContainer.innerHTML = ''; // Clear the iframe to stop it loading
    document.body.classList.remove('no-scroll');
}  


// Replace the entire initFooter function in public/js/main.js with this one.
function initFooter() {
    if (!siteData.footer || !siteData.site) return;
    const { footer: footerData, site: { contact: contactData } } = siteData;
    const footerContent = document.querySelector('.footer-content');
    if (!footerContent) return;
    
    const sections = footerContent.querySelectorAll('.footer-section');

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

             document.getElementById('footerAddress').addEventListener('click', openMapModal);
    }

    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        footerBottom.innerHTML = `<p>&copy; ${new Date().getFullYear()} Styvonix Future Pvt. Ltd. All rights reserved.</p>`;
    }
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
    const product = allSiteProducts.find(p => p.id === productId);
    if (!product) { return; }
    // FIX: Added 'negotiable: product.negotiable' to the item object
    const item = { 
        id: product.id, 
        name: product.name, 
        price: (product.salePrice ?? product.price) || 0, 
        qty: 1, 
        thumbnail: product.images[0] || '', 
        specs: [ product.specs?.meshSize ? `Mesh: ${product.specs.meshSize}`: null, product.specs?.type ? `Type: ${product.specs.type}`: null ].filter(Boolean),
        negotiable: product.negotiable || false,
        slug: product.slug // Pass slug for the link in the cart
    };
    let cart = [];
    try { cart = JSON.parse(sessionStorage.getItem('cartItems') || '[]'); } catch { cart = []; }
    const existingIndex = cart.findIndex(it => it.id === item.id);
    if (existingIndex >= 0) { cart[existingIndex].qty += 1; } else { cart.push(item); }
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
        setTimeout(() => { buttonElement.textContent = originalText; buttonElement.style.background = ''; }, 1200);
    }
}



document.addEventListener('DOMContentLoaded', async function() {
    await fetchGlobalData('/');
    
    createCategoryDropdown();
    initFooter();

    // --- START: EVENT LISTENERS ---
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

    // Cart Button & Count
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            window.location.href = '/cart';
        });
    }
    const cartCountBadge = document.querySelector('.cart-count');
    if (cartCountBadge) cartCountBadge.textContent = sessionStorage.getItem('cartCount') || '0';

    // Global Contact Modal Triggers
    document.body.addEventListener('click', function(e) {
        if (e.target.matches('.js-contact-modal-trigger')) {
            e.preventDefault();
            openContactModal();
        }
    });
    
    // --- START: MODAL FORM SUBMISSION FIX ---
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
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            throw new Error(data["errors"].map(error => error["message"]).join(", "));
                        }
                        throw new Error('Oops! There was a problem submitting your form');
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
    // --- END: MODAL FORM SUBMISSION FIX ---

    // Search Modal
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    function openSearchModal() { if (searchModal) { searchModal.style.display = 'block'; if (searchInput) searchInput.focus(); document.body.classList.add('no-scroll'); } }
    function closeSearchModal() { if (searchModal) { searchModal.style.display = 'none'; if (searchInput) searchInput.value = ''; if (searchResults) searchResults.innerHTML = ''; document.body.classList.remove('no-scroll'); } }
    document.querySelectorAll('.search-btn').forEach(btn => btn.addEventListener('click', openSearchModal));
    const closeSearchBtn = document.querySelector('.close-search');
    if(closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearchModal);
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            if (term.length < 2) return;
            const filtered = allSiteProducts.filter(p => p.name.toLowerCase().includes(term)).slice(0, 10);
            if(filtered.length === 0) { searchResults.innerHTML = `<div class="search-result-item">No products found</div>`; return; }
            filtered.forEach(product => {
                const item = document.createElement('div');
                item.className = 'search-result-item';
                const imagePath = product.images[0] || '';
                item.innerHTML = `<div style="display: flex; align-items: center;"><img src="${imagePath}" alt="${product.name}" style="width: 50px; height: 50px; margin-right: 15px; object-fit: cover;"><div><div class="search-result-name">${product.name}</div></div></div>`;
                item.addEventListener('click', () => { window.location.href = `/product/${product.slug}`; });
                searchResults.appendChild(item);
            });
        });
    }
    window.addEventListener('click', (event) => { if (event.target === searchModal) closeSearchModal(); });

    // Back to Top Button
     const backToTopButton = document.getElementById("backToTopBtn");
    if (backToTopButton) {
        const fabContainer = backToTopButton.parentElement; // Get the .fab-container
        window.onscroll = function() {
            const isScrolled = document.body.scrollTop > 100 || document.documentElement.scrollTop > 100;
            backToTopButton.style.display = isScrolled ? "block" : "none";
            // ADDED THIS LINE to toggle a class on the parent container
            if (fabContainer) {
                fabContainer.classList.toggle('btt-hidden', !isScrolled);
            }
        };
        backToTopButton.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    // --- END: BACK TO TOP BUTTON
 

});