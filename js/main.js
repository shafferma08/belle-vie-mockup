document.addEventListener('DOMContentLoaded', () => {
    // Scroll Effects
    const header = document.querySelector('header');
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const body = document.querySelector('body');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close menu on link click
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileOverlay.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animateSections = document.querySelectorAll('.fade-in-section');
    animateSections.forEach(section => {
        observer.observe(section);
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let testimonialInterval;

    const showTestimonial = (index) => {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    };

    const nextTestimonial = () => {
        if (testimonials.length === 0) return;
        let next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    };

    const startSlider = () => {
        testimonialInterval = setInterval(nextTestimonial, 5000);
    };

    const stopSlider = () => {
        clearInterval(testimonialInterval);
    };

    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    const resetInterval = () => {
        stopSlider();
        startSlider();
    };

    if (testimonials.length > 0) {
        startSlider();

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
                resetInterval();
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(prev);
                resetInterval();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextTestimonial();
                resetInterval();
            });
        }
    }

    // Interactive Gallery Lightbox Logic
    const initLightbox = () => {
        // Create Lightbox HTML (Single instance shared)
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-close"><i class="fas fa-times"></i></div>
            <div class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></div>
            <div class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></div>
            <div class="lightbox-content-wrapper">
                <img class="lightbox-content" src="" alt="Enlarged gallery image">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxCap = lightbox.querySelector('.lightbox-caption');
        const lightboxCounter = lightbox.querySelector('.lightbox-counter');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentGalleryItems = [];
        let currentIndex = 0;

        const updateLightbox = (index) => {
            if (currentGalleryItems.length === 0) return;

            const item = currentGalleryItems[index];

            // If item ends up undefined (safety check)
            if (!item) return;

            // Check if it's a video item or image item
            if (item.classList.contains('video-item')) {
                // For now, if we have video items in grid, we might want to skip or handle differently 
                // but current constraints suggest mostly images. 
                // If it's the video iframe, we can't easily show it in this img tag lightbox.
                // Current philosophy page only has images. 
                // If clicked, we might just ignore or show nothing. 
                // Let's assume standard image behavior for now as requested for Philosophy page.
            }

            const img = item.querySelector('.gallery-image');
            if (img) {
                const bgUrl = getComputedStyle(img).backgroundImage;
                const src = bgUrl.slice(4, -1).replace(/"/g, "");
                const caption = item.getAttribute('data-caption') || "";

                lightboxImg.style.display = 'block';
                lightboxImg.style.opacity = '0';

                setTimeout(() => {
                    lightboxImg.src = src;
                    lightboxCap.textContent = caption;
                    lightboxCounter.textContent = `${index + 1} / ${currentGalleryItems.length}`;
                    lightboxImg.style.opacity = '1';
                }, 200);
            }

            currentIndex = index;
        };

        const openLightbox = (item) => {
            // Find the parent grid of the clicked item
            const parentGrid = item.closest('.gallery-grid, .gallery-slider');
            if (!parentGrid) return; // Should be in a grid

            // Get all items ONLY in this grid
            // Filter out video items if they shouldn't appear in lightbox image slider
            currentGalleryItems = Array.from(parentGrid.querySelectorAll('.gallery-item:not(.video-item)'));

            // Find index of clicked item
            currentIndex = currentGalleryItems.indexOf(item);

            if (currentIndex === -1) return; // Clicked item not found (?)

            updateLightbox(currentIndex);
            lightbox.classList.add('active');
            body.style.overflow = 'hidden';
        };

        // Attach click events to all gallery items
        // We use delegation or just attach to all current ones
        const allItems = document.querySelectorAll('.gallery-item:not(.video-item)');
        allItems.forEach(item => {
            item.addEventListener('click', () => {
                openLightbox(item);
            });
        });

        const nextImage = () => {
            if (currentGalleryItems.length === 0) return;
            let next = (currentIndex + 1) % currentGalleryItems.length;
            updateLightbox(next);
        };

        const prevImage = () => {
            if (currentGalleryItems.length === 0) return;
            let prev = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
            updateLightbox(prev);
        };

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prevImage();
        });

        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
            nextImage();
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            body.style.overflow = 'auto';
            lightboxImg.src = ''; // Clear source
        };

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-nav')) {
                if (e.target === lightbox) closeLightbox();
            }
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    };

    initLightbox();

    // Gallery Slider Navigation Logic
    const initGallerySliders = () => {
        const sliders = document.querySelectorAll('.gallery-slider-wrapper');

        sliders.forEach(wrapper => {
            const slider = wrapper.querySelector('.gallery-slider');
            const prevBtn = wrapper.querySelector('.slider-prev');
            const nextBtn = wrapper.querySelector('.slider-next');

            if (!slider || !prevBtn || !nextBtn) return;

            const scrollAmount = 320; // Width of card (300) + gap (1.5rem ~ 20px approx)

            nextBtn.addEventListener('click', () => {
                slider.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            prevBtn.addEventListener('click', () => {
                slider.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
        });
    };

    initGallerySliders();
});
