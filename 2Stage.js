let currentPage = 1;
const imagesPerPage = 25;
let startPage = 0;
// Function to fetch images when the "Fetch Images" button is clicked
function fetchImages() {
    const start = parseInt(document.getElementById('start').value);
    startPage = Math.floor((start - 1) / imagesPerPage) + 1; // Calculate start page
    currentPage = startPage;
    const imageContainer = document.getElementById('imageContainer');
    const progressBar = document.getElementById('progressBar');
    let totalRequests = imagesPerPage * 15; // Total number of fetch requests
    let completedRequests = 0; // Number of completed fetch requests

    imageContainer.innerHTML = ''; // Clear previous images
    progressBar.style.width = '0%'; // Reset progress bar
    progressBar.style.display = 'block'; // Show progress bar

    // Function to update progress bar
    function updateProgressBar() {
        completedRequests++;
        const progress = Math.round((completedRequests / totalRequests) * 100);
        progressBar.style.width = progress + '%';
        if (completedRequests === totalRequests) {
            // All requests completed
            progressBar.style.display = 'none'; // Hide progress bar
        }
    }

    // Function to handle fetch response
    function handleResponse(response, type) {
        if (response.ok) {
            const img = document.createElement('img');
            img.src = response.url;
            img.alt = `Item ${type}`;
            const container = document.createElement('div');
            container.className = 'image-container';
            container.appendChild(img);
            imageContainer.appendChild(container);
        } else if (response.status === 403) {
            const container = document.createElement('div');
            container.className = 'image-container';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `<span>Item ${type} (coming soon)</span>`;
            container.appendChild(placeholder);
            imageContainer.appendChild(container);
        }
        updateProgressBar();
    }

    // Calculate range for current page
    const startImage = (currentPage - startPage) * imagesPerPage + start;
    const endImage = startImage + imagesPerPage - 1;

    // Fetch images for current page
    for (let i = startImage; i <= endImage; i++) {
        for (let j = 0; j < 15; j++) {
            const type = ['200', '210', '220', '230', '240', '201', '211', '221', '231', '241'][j];
            const imageUrl = `https://image.cocoppaplay.com/image1/theme/${type}${i}/L/m_theme_${type}${i}_shop.png`;
            fetch(imageUrl)
                .then(response => handleResponse(response, type))
                .catch(error => {
                    console.error('Error fetching image:', error);
                    updateProgressBar(); // Update progress even for failed requests
                });
        }
    }

    // Update pagination
    updatePagination();
}


// Function to update pagination buttons and indicator
function updatePagination() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const totalPages = Math.ceil((startPage + 1) * imagesPerPage / imagesPerPage);

    // Enable/disable previous and next page buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Update page indicator
    pageIndicator.textContent = `Page ${currentPage}`;
}

// Function to navigate to the previous page
function prevPage() {
    const start = parseInt(document.getElementById('start').value);
    const adjustedStart = Math.max(start - imagesPerPage, 1); // Adjusted starting point
    document.getElementById('start').value = adjustedStart;
    fetchImages();
}

// Function to navigate to the next page
function nextPage() {
    const start = parseInt(document.getElementById('start').value);
    const adjustedStart = start + imagesPerPage; // Adjusted starting point
    document.getElementById('start').value = adjustedStart;
    fetchImages();
}



// Add event listener for "Fetch Images" button
document.getElementById('fetchBtn').addEventListener('click', fetchImages);

// Add event listeners for pagination buttons
document.getElementById('prevPageBtn').addEventListener('click', prevPage);
document.getElementById('nextPageBtn').addEventListener('click', nextPage);

// Fetch images for the default start point (optional)
// fetchImages();
