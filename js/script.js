/* ====================================
   FRISCHHOLZ IMMOBILIEN - MAIN SCRIPT
   ==================================== */

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const faqQuestions = document.querySelectorAll('.faq-question');
const header = document.querySelector('.header');

// ====================================
// MOBILE NAVIGATION
// ====================================

/**
 * Toggle mobile navigation menu
 */
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

/**
 * Close mobile menu when a link is clicked
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

// ====================================
// HEADER SCROLL EFFECT
// ====================================

/**
 * Add shadow to header on scroll
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }
});

// ====================================
// ACTIVE NAV LINK
// ====================================

/**
 * Update active nav link based on scroll position
 */
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ====================================
// FAQ ACCORDION
// ====================================

/**
 * Toggle FAQ answer visibility
 */
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        
        // Close other open items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current item
        faqItem.classList.toggle('active');
    });
});

// ====================================
// CONTACT FORM VALIDATION & SUBMISSION
// ====================================

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (optional but if provided, should be valid)
 */
function isValidPhone(phone) {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d+\-\s()]+$/;
    return phoneRegex.test(phone) && phone.length >= 7;
}

/**
 * Show form message
 */
function showMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

/**
 * Handle contact form submission
 */
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('telefon').value.trim();
    const subject = document.getElementById('anliegen').value;
    const message = document.getElementById('nachricht').value.trim();
    const datenschutz = document.getElementById('datenschutz').checked;
    
    // Clear previous messages
    const messageDiv = document.getElementById('form-message');
    messageDiv.style.display = 'none';
    
    // Validation
    if (!name) {
        showMessage('Bitte geben Sie Ihren Namen ein.', 'error');
        return;
    }
    
    if (!email) {
        showMessage('Bitte geben Sie Ihre E-Mail-Adresse ein.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
        return;
    }
    
    if (phone && !isValidPhone(phone)) {
        showMessage('Bitte geben Sie eine gültige Telefonnummer ein.', 'error');
        return;
    }
    
    if (!subject) {
        showMessage('Bitte wählen Sie ein Anliegen aus.', 'error');
        return;
    }
    
    if (!message) {
        showMessage('Bitte geben Sie eine Nachricht ein.', 'error');
        return;
    }
    
    if (!datenschutz) {
        showMessage('Bitte akzeptieren Sie die Datenschutzerklärung.', 'error');
        return;
    }
    
    // Prepare form data
    const formData = {
        name: name,
        email: email,
        phone: phone || 'Nicht angegeben',
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Log form data (for demonstration)
    console.log('Formulardaten:', formData);
    
    // In a real scenario, you would send this to a backend service
    // For now, we'll show a success message
    // Example of how to connect to a real backend:
    
    /*
    // Option 1: Send to custom backend
    fetch('https://yourserver.com/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet. Wir kontaktieren Sie in Kürze.', 'success');
            contactForm.reset();
        } else {
            showMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        showMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
    });
    
    // Option 2: Send to Formspree (no backend needed)
    // Replace YOUR_FORMSPREE_ID with your actual Formspree ID
    // fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => {
    //     if (response.ok) {
    //         showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.', 'success');
    //         contactForm.reset();
    //     }
    // });
    
    // Option 3: Send to EmailJS (no backend needed)
    // Initialize EmailJS and send email
    // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    //     to_email: 'info@frischholz-gmbh.de',
    //     from_email: email,
    //     from_name: name,
    //     message: message,
    //     phone: phone
    // }).then(response => {
    //     showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.', 'success');
    //     contactForm.reset();
    // });
    */
    
    // For now, show success message and log to console
    showMessage('Vielen Dank! Ihre Nachricht wurde erfolgreich eingegeben. In einer produktiven Umgebung würde sie jetzt versendet werden. Bitte kontaktieren Sie uns auch direkt unter +49 2359 299071-0', 'success');
    contactForm.reset();
});

// ====================================
// SMOOTH SCROLL BEHAVIOR
// ====================================

/**
 * Smooth scroll to sections
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip skip-link
        if (href === '#main-content') return;
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ====================================

/**
 * Add animation to elements as they come into view
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll(
    '.trust-card, .leistung-card, .immobilien-card, .usp-card, .standort-card, .testimonial-card, .faq-item'
).forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ====================================
// LAZY LOADING IMAGES (Future enhancement)
// ====================================

/**
 * Simple lazy loading implementation
 * Can be enhanced with real images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Load image logic here
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Print current date
 */
function logInfo() {
    const date = new Date();
    console.log(`Frischholz & Cie. GmbH Website - ${date.toLocaleDateString('de-DE')}`);
}

logInfo();

// ====================================
// ACCESSIBILITY IMPROVEMENTS
// ====================================

/**
 * Keyboard navigation for FAQ
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('faq-question')) {
            e.preventDefault();
            e.target.click();
        }
    }
});

// ====================================
// PAGE LOAD COMPLETE
// ====================================

console.log('✓ Frischholz Immobilien Website vollständig geladen');
