export function autoScrollProducts() {
    const productsScroll = document.querySelector('.products-scroll');
    if (!productsScroll) return;

    let autoScrollInterval;
    let scrollDirection = 1;

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            const scrollAmount = 300 * scrollDirection;
            productsScroll.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });

            if (productsScroll.scrollLeft + productsScroll.clientWidth >= productsScroll.scrollWidth - 10) {
                scrollDirection = -1;
            } else if (productsScroll.scrollLeft <= 10) {
                scrollDirection = 1;
            }
        }, 3000);
    }

    startAutoScroll();

    productsScroll.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    productsScroll.addEventListener('mouseleave', () => startAutoScroll());
}
