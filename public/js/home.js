document.addEventListener('DOMContentLoaded', function() {
    // Fetch data from data.json and products.json
    Promise.all([
        fetch('./data/data.json').then(res => res.json()),
        fetch('./data/products.json').then(res => res.json())
    ])
    .then(([data, productsData]) => {
        // initHeroStats(data.hero.stats);
        // initTestimonials(data.testimonials);
        initProducts(productsData.products);
        initCategories(data.categories);
        initFeatures(data.features);
        initFooter(data.footer, data.site.contact);
    })
    .catch(error => console.error('Error loading data:', error));
     
    // Load cart count from sessionStorage
    const cartCount = document.querySelector('.cart-count');
    if (cartCount && sessionStorage.getItem('cartCount')) {
        cartCount.textContent = sessionStorage.getItem('cartCount');
    }
});