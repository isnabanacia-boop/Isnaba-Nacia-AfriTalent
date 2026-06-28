/* ================================================================
   ========== COMMIT 6 - JAVASCRIPT ==========
   ================================================================ */

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 1. DARK MODE avec localStorage =====
    // Créer le toggle Dark Mode dans la navbar
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        // Vérifier si le toggle existe déjà (éviter les doublons)
        const existingToggle = document.getElementById('darkModeToggle');
        if (!existingToggle) {
            const darkModeLi = document.createElement('li');
            darkModeLi.className = 'nav-item';
            darkModeLi.innerHTML = `
                <button class="btn btn-outline-primary btn-sm" id="darkModeToggle" style="border-radius: 50px; padding: 5px 15px;">
                    <i class="bi bi-moon-fill"></i>
                </button>
            `;
            navbarNav.appendChild(darkModeLi);
        }
    }
    
    // Récupérer le toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Vérifier le mode sauvegardé dans localStorage
    const currentMode = localStorage.getItem('darkMode');
    
    if (currentMode === 'enabled') {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
    }
    
    // Événement du toggle Dark Mode
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                this.innerHTML = '<i class="bi bi-sun-fill"></i>';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                this.innerHTML = '<i class="bi bi-moon-fill"></i>';
            }
        });
    }
    
    // ===== 2. NAVBAR DYNAMIQUE AU SCROLL =====
    const navbar = document.querySelector('.navbar');
    
    // ===== 3. BOUTON RETOUR EN HAUT =====
    // Créer le bouton s'il n'existe pas déjà
    let backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Retour en haut de la page');
        document.body.appendChild(backToTopBtn);
    }
    
    // ===== Gestionnaire unique pour le scroll =====
    window.addEventListener('scroll', function() {
        // Navbar dynamique
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Bouton retour en haut
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Clic sur le bouton retour en haut
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===== 4. COPYRIGHT DYNAMIQUE =====
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // ===== 5. ACTIVER LE LIEN ACTIF DANS LA NAVBAR =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
/* ================================================================
   ========== COMMIT 7 - COMPTEURS ANIMÉS & FADE-IN ==========
   ================================================================ */

// ===== 1. COMPTEURS ANIMÉS AU SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Fonction pour animer un compteur
    function animateCounter(element, target, duration) {
        const start = 0;
        const startTime = performance.now();
        const isFloat = target % 1 !== 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function pour un effet plus naturel
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (target - start) * easeOutQuart;
            
            if (isFloat) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.round(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isFloat) {
                    element.textContent = target.toFixed(1);
                } else {
                    element.textContent = target;
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Fonction pour extraire la valeur numérique d'un élément
    function getNumericValue(element) {
        const text = element.textContent.trim();
        // Enlever les espaces, les symboles +, %, etc.
        const cleanText = text.replace(/[+\s%]/g, '');
        return parseFloat(cleanText) || 0;
    }
    
    // Fonction pour extraire le suffixe (+, %, etc.)
    function getSuffix(element) {
        const text = element.textContent.trim();
        const match = text.match(/[+\s%]/g);
        return match ? match.join('') : '';
    }
    
    // Observer les compteurs
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        // Stocker les valeurs originales
        const statData = [];
        statNumbers.forEach(stat => {
            const originalText = stat.textContent.trim();
            const targetValue = getNumericValue(stat);
            const suffix = getSuffix(stat);
            statData.push({
                element: stat,
                target: targetValue,
                suffix: suffix,
                originalText: originalText,
                animated: false
            });
        });
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statItem = statData.find(item => item.element === entry.target);
                    if (statItem && !statItem.animated) {
                        statItem.animated = true;
                        // Déterminer la durée selon la valeur
                        const duration = Math.min(2000, 500 + statItem.target * 2);
                        // Ajouter le suffixe après l'animation
                        animateCounter(statItem.element, statItem.target, duration);
                    }
                }
            });
        }, observerOptions);
        
        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    // ===== 2. ANIMATIONS FADE-IN AU SCROLL =====
    const sections = document.querySelectorAll('section, .hero, .featured-article, .recent-articles, .faq-section, .newsletter');
    
    if (sections.length > 0) {
        // Ajouter la classe fade-section à toutes les sections
        sections.forEach((section, index) => {
            section.classList.add('fade-section');
            // Ajouter un délai progressif pour un effet cascade
            const delay = Math.min(index % 4, 3);
            if (delay > 0) {
                section.classList.add('delay-' + delay);
            }
        });
        
        const fadeOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Une fois visible, on peut arrêter de l'observer
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, fadeOptions);
        
        sections.forEach(section => {
            fadeObserver.observe(section);
        });
    }
    
}); 