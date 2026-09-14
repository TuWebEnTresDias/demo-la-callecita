/* ============================================
   LA CALLECITA — Landing Page Scripts
   Cafetería y Pastelería Artesanal
   La Plata, Buenos Aires
   ============================================ */

(function () {
    'use strict';

    // ---- DOM Elements ----
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const contactForm = document.getElementById('contactForm');
    const revealElements = document.querySelectorAll('.reveal');

    // ---- Header Scroll Behavior ----
    let lastScrollY = 0;
    let ticking = false;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleHeaderScroll);
            ticking = true;
        }
    }, { passive: true });

    // ---- Mobile Menu ----
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMobileMenu);
    });

    // Also close when clicking the CTA inside mobile menu
    var mobileCTA = document.querySelector('.mobile-cta');
    if (mobileCTA) {
        mobileCTA.addEventListener('click', closeMobileMenu);
    }

    // ---- Scroll Reveal Animation ----
    function setupRevealObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything immediately
            revealElements.forEach(function (el) {
                el.classList.add('visible');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    setupRevealObserver();

    // ---- Smooth Scroll for Anchor Links ----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var headerHeight = header.offsetHeight;
                var targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact Form → WhatsApp ----
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('name').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var messageSelect = document.getElementById('message');
            var messageText = messageSelect.options[messageSelect.selectedIndex].text;
            var details = document.getElementById('details').value.trim();

            if (!name || !phone) {
                // Simple visual feedback
                if (!name) document.getElementById('name').focus();
                else document.getElementById('phone').focus();
                return;
            }

            var whatsappNumber = '5492214181945';
            var msg = 'Hola La Callecita! 👋\n\n';
            msg += 'Soy ' + name + '.\n';
            msg += 'Consulta: ' + messageText + '\n';
            if (details) {
                msg += '\nDetalles: ' + details + '\n';
            }
            msg += '\n(Teléfono de contacto: ' + phone + ')';

            var encodedMsg = encodeURIComponent(msg);
            var whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + encodedMsg;

            window.open(whatsappURL, '_blank', 'noopener');
        });
    }

    // ---- Parallax subtle effect on hero ----
    var heroBg = document.querySelector('.hero-bg img');
    if (heroBg) {
        var parallaxTicking = false;

        window.addEventListener('scroll', function () {
            if (!parallaxTicking) {
                window.requestAnimationFrame(function () {
                    var scrollY = window.scrollY;
                    var heroHeight = document.querySelector('.hero').offsetHeight;

                    if (scrollY < heroHeight) {
                        var parallaxOffset = scrollY * 0.3;
                        heroBg.style.transform = 'scale(1.05) translateY(' + parallaxOffset + 'px)';
                    }
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    // ---- Active nav link highlighting ----
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function highlightNavOnScroll() {
        var scrollY = window.scrollY + 120;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', function () {
        window.requestAnimationFrame(highlightNavOnScroll);
    }, { passive: true });

    // ---- Gallery lightbox-like interaction ----
    var galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = item.querySelector('img');
            if (!img) return;

            // Create a simple fullscreen overlay
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 0.3s ease;';

            var fullImg = document.createElement('img');
            fullImg.src = img.src;
            fullImg.alt = img.alt;
            fullImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:12px;transform:scale(0.95);transition:transform 0.3s ease;';

            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            // Trigger animation
            requestAnimationFrame(function () {
                overlay.style.opacity = '1';
                fullImg.style.transform = 'scale(1)';
            });

            // Close on click
            overlay.addEventListener('click', function () {
                overlay.style.opacity = '0';
                fullImg.style.transform = 'scale(0.95)';
                setTimeout(function () {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }, 300);
            });

            // Close on Escape key
            function handleEsc(e) {
                if (e.key === 'Escape') {
                    overlay.style.opacity = '0';
                    fullImg.style.transform = 'scale(0.95)';
                    setTimeout(function () {
                        if (document.body.contains(overlay)) {
                            document.body.removeChild(overlay);
                            document.body.style.overflow = '';
                        }
                    }, 300);
                    document.removeEventListener('keydown', handleEsc);
                }
            }
            document.addEventListener('keydown', handleEsc);
        });
    });

})();
