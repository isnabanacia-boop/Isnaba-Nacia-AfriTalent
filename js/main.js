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