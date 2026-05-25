/**
 * Corporate Portfolio Architecture Script
 * Handles responsive layout mechanics, view filtration engines, 
 * and asynchronous interface execution.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initPortfolioFilters();
    initContactForm();
});

/**
 * Handles the responsive drop-down animation states for mobile displays.
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!navToggle || !navMenu) return;

    // Toggle overlay dropdown visibility state on hamburger button tap
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Automatically collapse layout overlay when a targeted anchor path is chosen
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/**
 * Handles classification visibility updates across the portfolio nodes.
 */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const caseCards = document.querySelectorAll('.case-card');

    if (filterButtons.length === 0 || caseCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active style states across sibling components
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Apply active focus styling state onto targeted selection node
            e.currentTarget.classList.add('active');

            const targetCategory = e.currentTarget.getAttribute('data-filter');

            // Apply visual filter settings
            caseCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (targetCategory === 'all' || cardCategory === targetCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Performs asynchronous API data capture on consultation pitches via Web3Forms.
 */
function initContactForm() {
    const contactForm = document.getElementById('portfolioContactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!contactForm || !submitBtn) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Prevent dual clicks by updating UI loading state
        const baselineBtnText = submitBtn.textContent;
        submitBtn.textContent = "Transmitting Message...";
        submitBtn.disabled = true;

        // Automatically structure the key-value attributes from the form fields
        const formData = new FormData(contactForm);
        const objectData = Object.fromEntries(formData);
        const jsonPayload = JSON.stringify(objectData);

        // Ship data off asynchronously via background fetch
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: jsonPayload
        })
        .then(async (response) => {
            let jsonRes = await response.json();
            if (response.status === 200) {
                // Success Handling UI
                alert(`Thank you, ${objectData.name}. Your direct brief was transmitted cleanly. I will evaluate your target objectives and follow up within 24 business hours.`);
                contactForm.reset();
            } else {
                // Server-side baseline error response handling
                console.error(jsonRes);
                alert(jsonRes.message || "Transmission failed. Please check endpoint configurations.");
            }
        })
        .catch(error => {
            // Client-side connectivity exception safety catch
            console.error(error);
            alert("A localized connection fault occurred. Please verify internet connectivity.");
        })
        .finally(() => {
            // Restore visual layout interactive components back to operational default
            submitBtn.textContent = baselineBtnText;
            submitBtn.disabled = false;
        });
    });
}