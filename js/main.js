document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. Smooth Scroll & Navbar ================= */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ================= 2. Scroll Reveal ================= */
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        reveals.forEach(reveal => {
            const revealTop = reveal.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    /* ================= 3. Testimonial Carousel ================= */
    const track = document.getElementById('testimonial-track');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    let currentIndex = 0;
    let autoPlayInterval;

    const updateSlides = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    };

    const nextSlide = () => {
        currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
        updateSlides(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
        updateSlides(currentIndex);
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    startAutoPlay(); // Start on load

    /* ================= 4. Modal ================= */
    const modal = document.getElementById('menu-modal');
    const closeBtn = document.getElementById('close-modal');
    const requestBtns = document.querySelectorAll('.request-menu-btn');
    const modalMenuHidden = document.getElementById('modal-menu-hidden');
    const selectedMenuName = document.getElementById('selected-menu-name');
    let focusedElementBeforeModal;

    const openModal = (menuName, initiatorBtn) => {
        focusedElementBeforeModal = initiatorBtn;
        modalMenuHidden.value = menuName;
        selectedMenuName.textContent = menuName;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus trap initial focus
        setTimeout(() => document.getElementById('modal-name').focus(), 100);
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus();
        }
    };

    requestBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const menuName = e.target.getAttribute('data-menu');
            openModal(menuName, e.target);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard accessibility for modal (Esc to close, Tab to trap focus)
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        }

        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });

    /* ================= 5. Form Validation & Toast ================= */
    const showToast = (message, type = 'success') => {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger reflow for animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const validateForm = (formElement) => {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            const group = input.closest('.form-group');
            if (!input.value.trim()) {
                isValid = false;
                group?.classList.add('has-error');
            } else if (input.type === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input.value)) {
                isValid = false;
                group?.classList.add('has-error');
                const errMsg = group.querySelector('.error-msg');
                if (errMsg) errMsg.textContent = 'Email inválido.';
            } else {
                group?.classList.remove('has-error');
            }
        });
        
        return isValid;
    };

    // Remove error class on input
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('input', (e) => {
            const group = e.target.closest('.form-group');
            group?.classList.remove('has-error');
        });
    });

    // Contact Form Submit
    const contactForm = document.getElementById('reservation-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                showToast('¡Solicitud enviada con éxito! Nos pondremos en contacto pronto.', 'success');
                contactForm.reset();
            } else {
                showToast('Por favor, completa correctamente todos los campos requeridos.', 'error');
            }
        });
    }

    // Modal Form Submit
    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(modalForm)) {
                closeModal();
                showToast(`¡Solicitud para ${modalMenuHidden.value} enviada! Te contactaremos a la brevedad.`, 'success');
                modalForm.reset();
            } else {
                showToast('Por favor, completa los campos del formulario.', 'error');
            }
        });
    }
});
