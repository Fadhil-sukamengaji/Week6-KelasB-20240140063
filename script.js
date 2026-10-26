document.addEventListener('DOMContentLoaded', () => {
    
    //Form DOM, Event Handling & Rating Radio
    const interactiveForm = document.getElementById('interactiveForm');
    const usernameInput = document.getElementById('username');
    const userMessageInput = document.getElementById('userMessage');
    const formFeedback = document.getElementById('formFeedback');
    const formResult = document.getElementById('formResult');
    
    const outName = document.getElementById('outName');
    const outRating = document.getElementById('outRating');
    const outMessage = document.getElementById('outMessage');
    const outTime = document.getElementById('outTime');
    
    const reviewContainer = outMessage.parentElement; 

    interactiveForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const nameValue = usernameInput.value.trim();

        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const ratingValue = selectedRating ? selectedRating.value : '';
        
        const messageValue = userMessageInput.value.trim();

        if (nameValue === '' || ratingValue === '') {
            formFeedback.textContent = 'Error: Nama dan Rating Toko wajib diisi!';
            formFeedback.className = 'feedback-msg error-text';
            formResult.classList.add('hidden');
            return;
        }

        if (nameValue.length < 3) {
            formFeedback.textContent = 'Error: Nama minimal harus 3 karakter!';
            formFeedback.className = 'feedback-msg error-text';
            formResult.classList.add('hidden');
            return;
        }

        formFeedback.textContent = 'Terima kasih! Penilaian Anda berhasil dikirim.';
        formFeedback.className = 'feedback-msg success';

        outName.textContent = nameValue;
        
        const starCount = parseInt(ratingValue);
        outRating.textContent = '⭐'.repeat(starCount) + ` (${ratingValue}/5)`;

        if (messageValue !== '') {
            outMessage.textContent = messageValue;
            reviewContainer.classList.remove('hidden');
        } else {
            reviewContainer.classList.add('hidden');
        }

        outTime.textContent = new Date().toLocaleTimeString('id-ID');

        formResult.classList.remove('hidden');
        interactiveForm.reset();
    });


    //Fetch API Produk Elektronik, Konversi IDR & Search
    const productGrid = document.getElementById('productGrid');
    const loadingStatus = document.getElementById('loadingStatus');
    const errorStatus = document.getElementById('errorStatus');
    const reloadBtn = document.getElementById('reloadBtn');
    const searchInput = document.getElementById('searchInput');

    const API_URL = 'https://dummyjson.com/products/category/smartphones'; 
    let allProducts = [];
    const USD_TO_IDR = 18165;

    async function fetchProducts() {
        loadingStatus.classList.remove('hidden');
        errorStatus.classList.add('hidden');
        productGrid.innerHTML = '';

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            const data = await response.json();
            allProducts = data.products;
            
            loadingStatus.classList.add('hidden');
            displayProducts(allProducts);

        } catch (error) {
            loadingStatus.classList.add('hidden');
            errorStatus.classList.remove('hidden');
            errorStatus.textContent = `Gagal memuat data produk smartphone: ${error.message}`;
            console.error('Fetch Error:', error);
        }
    }

    function displayProducts(products) {
        productGrid.innerHTML = '';

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Tidak ada produk smartphone yang ditemukan.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const priceInIDR = product.price * USD_TO_IDR;
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(priceInIDR);

            card.innerHTML = `
                <div>
                    <img src="${product.thumbnail}" alt="${product.title}" class="product-img">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-category">${product.category}</p>
                </div>
                <div>
                    <p class="product-price">${formattedPrice}</p>
                </div>
            `;

            productGrid.appendChild(card);
        });
    }

    // Fitur Pencarian
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(keyword)
        );
        displayProducts(filteredProducts);
    });

    reloadBtn.addEventListener('click', () => {
        searchInput.value = '';
        fetchProducts();
    });

    fetchProducts();
});