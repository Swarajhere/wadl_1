// Store the original product data extracted from the DOM
let products = [];
let sortDirection = 'lowToHigh'; // Track sorting direction

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const productList = document.getElementById('productList');
    const searchInput = document.getElementById('searchInput');
    const sortBtn = document.getElementById('sortBtn');

    // Extract products from the DOM
    const productElements = productList.getElementsByClassName('product');
    for (let element of productElements) {
        const name = element.querySelector('h3').textContent;
        const priceText = element.querySelector('p').textContent.replace('$', '');
        const price = parseFloat(priceText);
        const image = element.querySelector('img').src;
        products.push({ name, price, image, element: element.cloneNode(true) });
    }

    // Filter products based on search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        renderProducts(filteredProducts);
    });

    // Sort products by price
    sortBtn.addEventListener('click', () => {
        sortDirection = sortDirection === 'lowToHigh' ? 'highToLow' : 'lowToHigh';
        sortBtn.textContent = `Sort by Price (${sortDirection === 'lowToHigh' ? 'Low to High' : 'High to Low'})`;
        const sortedProducts = [...products].sort((a, b) => {
            return sortDirection === 'lowToHigh'
                ? a.price - b.price
                : b.price - a.price;
        });
        renderProducts(sortedProducts);
    });
});

// Render products to the DOM
function renderProducts(productsToRender) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    productsToRender.forEach(product => {
        productList.appendChild(product.element.cloneNode(true));
    });
}