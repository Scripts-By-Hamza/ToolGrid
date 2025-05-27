// DOM Elements
const searchInput = document.getElementById('searchInput');
const toolkitBtn = document.getElementById('toolkitBtn');
const toolkitSidebar = document.getElementById('toolkitSidebar');
const closeToolkit = document.getElementById('closeToolkit');
const toolkitItems = document.getElementById('toolkitItems');
const categoryContainers = document.querySelectorAll('.category-content');

// State
let myToolkit = JSON.parse(localStorage.getItem('myToolkit')) || [];

// Initialize the app
function initializeApp() {
    renderAllResources();
    setupEventListeners();
    renderToolkit();
}

// Render all resources
function renderAllResources() {
    Object.keys(resources).forEach(category => {
        const container = document.getElementById(category);
        if (!container) return;
        
        container.innerHTML = resources[category]
            .map(resource => createResourceCard(resource))
            .join('');
    });
}

// Create resource card HTML
function createResourceCard(resource) {
    const isInToolkit = myToolkit.includes(resource.id);
    return `
        <div class="resource-item">
            <div class="resource-info">
                <a href="${resource.url}" target="_blank" class="resource-details">
                    <div class="resource-icon" id="icon-${resource.id}">
                        ${createResourceIcon(resource)}
                    </div>
                    <div>
                        <span class="resource-name">${resource.name}</span>
                        <span class="resource-description">${resource.description}</span>
                    </div>
                </a>
            </div>
            <button onclick="toggleToolkit('${resource.id}')" class="action-button" title="${isInToolkit ? 'Remove from Toolkit' : 'Add to Toolkit'}">
                <i class="fas fa-star ${isInToolkit ? 'text-yellow-400' : ''}"></i>
            </button>
        </div>
    `;
}

// Create resource icon
function createResourceIcon(resource) {
    if (resource.icon) {
        return `
            <img src="${resource.icon}" 
                 alt="${resource.name} icon" 
                 onerror="this.onerror=null; this.parentElement.innerHTML='<i class=\'fas ${resource.iconFallback}\'></i>';"
                 class="resource-img">
        `;
    }
    return `<i class="fas ${resource.iconFallback}"></i>`;
}

// Toggle toolkit item
function toggleToolkit(resourceId) {
    const index = myToolkit.indexOf(resourceId);
    if (index === -1) {
        myToolkit.push(resourceId);
    } else {
        myToolkit.splice(index, 1);
    }
    localStorage.setItem('myToolkit', JSON.stringify(myToolkit));
    renderAllResources();
    renderToolkit();
}

// Render toolkit sidebar
function renderToolkit() {
    const toolkitResources = myToolkit
        .map(id => findResourceById(id))
        .filter(Boolean);

    if (toolkitResources.length === 0) {
        toolkitItems.innerHTML = `
            <div class="toolkit-empty">
                <i class="fas fa-box-open fa-2x"></i>
                <p>Your toolkit is empty</p>
            </div>
        `;
        return;
    }

    toolkitItems.innerHTML = toolkitResources
        .map(resource => createResourceCard(resource))
        .join('');
}

// Find resource by ID
function findResourceById(id) {
    for (const category of Object.values(resources)) {
        const resource = category.find(r => r.id === id);
        if (resource) return resource;
    }
    return null;
}

// Search functionality
function searchResources(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        renderAllResources();
        return;
    }

    Object.keys(resources).forEach(category => {
        const container = document.getElementById(category);
        if (!container) return;

        const filteredResources = resources[category].filter(resource =>
            resource.name.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query) ||
            resource.tags.some(tag => tag.toLowerCase().includes(query))
        );

        container.innerHTML = filteredResources
            .map(resource => createResourceCard(resource))
            .join('');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchResources(e.target.value);
        });
    }

    // Toolkit sidebar
    if (toolkitBtn && toolkitSidebar && closeToolkit) {
        toolkitBtn.addEventListener('click', () => {
            toolkitSidebar.classList.add('open');
            renderToolkit();
        });

        closeToolkit.addEventListener('click', () => {
            toolkitSidebar.classList.remove('open');
        });

        // Close sidebar on outside click
        document.addEventListener('click', (e) => {
            if (!toolkitSidebar.contains(e.target) && !toolkitBtn.contains(e.target)) {
                toolkitSidebar.classList.remove('open');
            }
        });
    }
}

// Call initializeApp when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Scroll to Top Functionality
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Handle Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // Here you would typically send this to your backend
        alert('Thank you for subscribing! We\'ll keep you updated.');
        newsletterForm.reset();
    });
} 