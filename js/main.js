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
/* ================================================================
   ========== COMMIT 8 - FILTRAGE & VALIDATION FORMULAIRE ==========
   ================================================================ */

// ===== 1. FILTRAGE DYNAMIQUE DES FREELANCES =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Vérifier si on est sur la page freelances
    const freelanceCards = document.querySelectorAll('.freelance-card');
    const filterButtons = document.querySelectorAll('.filters .btn');
    
    if (freelanceCards.length > 0 && filterButtons.length > 0) {
        
        // Ajouter l'événement click sur chaque bouton de filtre
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Enlever la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Ajouter la classe active au bouton cliqué
                this.classList.add('active');
                
                // Récupérer la catégorie sélectionnée
                const category = this.getAttribute('data-category');
                
                // Filtrer les cartes
                freelanceCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        // Ajouter une animation d'apparition
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

// ===== 2. VALIDATION DU FORMULAIRE DE CONTACT =====
document.addEventListener('DOMContentLoaded', function() {
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        
        // Références des champs
        const nomInput = document.getElementById('nom');
        const emailInput = document.getElementById('email');
        const sujetSelect = document.getElementById('sujet');
        const messageTextarea = document.getElementById('message');
        const formSuccess = document.getElementById('formSuccess');
        
        // Fonction pour afficher une erreur
        function showError(input, message) {
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.textContent = message;
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
            }
        }
        
        // Fonction pour effacer l'erreur
        function clearError(input) {
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (errorDiv) {
                errorDiv.textContent = '';
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            }
        }
        
        // Fonction pour valider un champ
        function validateField(input) {
            const value = input.value.trim();
            
            // Validation du nom
            if (input.id === 'nom') {
                if (value.length < 2) {
                    showError(input, 'Le nom doit contenir au moins 2 caractères');
                    return false;
                } else {
                    clearError(input);
                    return true;
                }
            }
            
            // Validation de l'email
            if (input.id === 'email') {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                    showError(input, 'Veuillez entrer une adresse email valide');
                    return false;
                } else {
                    clearError(input);
                    return true;
                }
            }
            
            // Validation du sujet
            if (input.id === 'sujet') {
                if (value === '') {
                    showError(input, 'Veuillez sélectionner un sujet');
                    return false;
                } else {
                    clearError(input);
                    return true;
                }
            }
            
            // Validation du message
            if (input.id === 'message') {
                if (value.length < 20) {
                    showError(input, 'Le message doit contenir au moins 20 caractères');
                    return false;
                } else {
                    clearError(input);
                    return true;
                }
            }
            
            return true;
        }
        
        // Ajouter les événements de validation en temps réel
        [nomInput, emailInput, sujetSelect, messageTextarea].forEach(input => {
            if (input) {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        validateField(this);
                    }
                });
            }
        });
        
        // Soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Valider tous les champs
            const isNomValid = validateField(nomInput);
            const isEmailValid = validateField(emailInput);
            const isSujetValid = validateField(sujetSelect);
            const isMessageValid = validateField(messageTextarea);
            
            // Vérifier si tous les champs sont valides
            if (isNomValid && isEmailValid && isSujetValid && isMessageValid) {
                // Afficher le message de succès
                formSuccess.classList.remove('d-none');
                formSuccess.textContent = '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Enlever les classes de validation
                [nomInput, emailInput, sujetSelect, messageTextarea].forEach(input => {
                    if (input) {
                        input.classList.remove('is-valid', 'is-invalid');
                        const errorDiv = input.parentElement.querySelector('.error-message');
                        if (errorDiv) {
                            errorDiv.textContent = '';
                        }
                    }
                });
                
                // Masquer le message après 5 secondes
                setTimeout(function() {
                    formSuccess.classList.add('d-none');
                }, 5000);
                
            } else {
                // Faire défiler jusqu'au premier champ invalide
                const firstInvalid = document.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
});

// ===== ANIMATION FADE-IN POUR LES CARTES FILTRÉES =====
// Ajouter l'animation CSS si elle n'existe pas
if (!document.getElementById('fadeInStyle')) {
    const style = document.createElement('style');
    style.id = 'fadeInStyle';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
}


