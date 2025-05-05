document.addEventListener('DOMContentLoaded', () => {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const productItems = document.querySelectorAll('.product-item');
    const dropdownButton = document.getElementById('categoryDropdown');

    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedCategory = item.getAttribute('data-category');
            dropdownButton.textContent = item.textContent;

            productItems.forEach(product => {
                const productCategory = product.getAttribute('data-category');
                if (selectedCategory === 'all' || productCategory === selectedCategory) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
});