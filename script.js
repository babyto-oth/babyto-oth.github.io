/* --------------------------------------------------
   PROJECT HOVER IMAGES & MASCOT SPIN
-------------------------------------------------- */

const projects = document.querySelectorAll(".project");
const preview = document.querySelector(".project-preview");
const previewImage1 = document.querySelector("#preview-image-1");
const previewImage2 = document.querySelector("#preview-image-2");
const mascot = document.querySelector(".mascot img");

/* Helper function to get a random pixel offset between min and max */
function getRandomOffset(min, max) {
    const val = Math.random() * (max - min) + min;
    // Randomly pick positive or negative direction
    return Math.random() < 0.5 ? val : -val; 
}

/* --------------------------------------------------
   PROJECT HOVERS
-------------------------------------------------- */

projects.forEach((project) => {

    project.addEventListener("mouseenter", () => {
        // 1. Load project preview images
        const img1 = project.dataset.img1;
        const img2 = project.dataset.img2;

        if (img1 && img2 && preview) {
            previewImage1.src = img1;
            previewImage2.src = img2;

            // Generate slight random offset for image overlap
            const x1 = getRandomOffset(10, 35);
            const y1 = getRandomOffset(10, 35);
            const x2 = getRandomOffset(10, 35);
            const y2 = getRandomOffset(10, 35);

            preview.style.setProperty("--x1", `${x1}px`);
            preview.style.setProperty("--y1", `${y1}px`);
            preview.style.setProperty("--x2", `${x2}px`);
            preview.style.setProperty("--y2", `${y2}px`);

            preview.classList.add("visible");
        }

        // 2. Trigger Y-Axis Spin on Mascot (if data-spin2 attribute exists)
        if (mascot && mascot.dataset.spin2) {
            mascot.src = mascot.dataset.spin2;
        }
    });

    project.addEventListener("mouseleave", () => {
        // 1. Hide preview images
        if (preview) {
            preview.classList.remove("visible");
        }

        // 2. Reset mascot back to static image
        if (mascot && mascot.dataset.static) {
            mascot.src = mascot.dataset.static;
        }
    });

});


/* --------------------------------------------------
   DIRECT MASCOT HOVER & CLICK REDIRECT
-------------------------------------------------- */

if (mascot) {
    const staticImage = mascot.dataset.static;
    const defaultGif = mascot.dataset.gif;

    mascot.addEventListener("mouseenter", () => {
        if (defaultGif) {
            mascot.src = defaultGif;
        }
    });

    mascot.addEventListener("mouseleave", () => {
        if (staticImage) {
            mascot.src = staticImage;
        }
    });

/* Mascot Click Handler: Redirects to Homepage if on a Project Page */
mascot.addEventListener("click", () => {
    if (document.querySelector(".project-page")) {
        window.location.href = "/"; // Pushes back to the root domain / homepage
    }
});
}

/* --------------------------------------------------
   PROJECT PAGE: MASCOT SPIN ON ACTIVE SCROLL
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const projectPage = document.querySelector('.project-page');
    if (!projectPage) return;

    const mascotImg = document.querySelector('.mascot img');
    if (!mascotImg) return;

    const staticSrc = mascotImg.getAttribute('data-static');
    const spinDownSrc = mascotImg.getAttribute('data-spin-down');
    const spinUpSrc = mascotImg.getAttribute('data-spin-up');

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            // SCROLLING DOWN -> spikey0.gif
            if (mascotImg.src !== spinDownSrc) {
                mascotImg.src = spinDownSrc;
            }
        } else if (currentScrollY < lastScrollY) {
            // SCROLLING UP -> spikey2.gif
            if (mascotImg.src !== spinUpSrc) {
                mascotImg.src = spinUpSrc;
            }
        }

        lastScrollY = currentScrollY;

        // Clear existing timer while actively scrolling
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // STOP SCROLLING DETECTOR: Reset to static image after 150ms of no scrolling
        scrollTimeout = setTimeout(() => {
            mascotImg.src = staticSrc;
        }, 150);
    });
});

/* --------------------------------------------------
   INTERACTIVE NUMBERED HOVER GALLERY
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const galleryButtons = document.querySelectorAll('.gallery-num');
    if (!galleryButtons.length) return;

    galleryButtons.forEach(button => {
        const switchImage = () => {
            const displayImg = document.getElementById('gallery-display');
            const displayCaption = document.getElementById('gallery-caption');

            if (!displayImg) return;

            const newSrc = button.getAttribute('data-src');
            const newCaption = button.getAttribute('data-caption');

            if (newSrc) displayImg.src = newSrc;
if (displayCaption && newCaption !== null) {
    displayCaption.innerHTML = newCaption;
}

            // Highlight active button
            galleryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };

        // Triggers on hover for desktop & tap for mobile
        button.addEventListener('mouseenter', switchImage);
        button.addEventListener('click', switchImage);
    });
});

/* --------------------------------------------------
   CONTACT MODAL TOGGLE & IN-PAGE AJAX SUBMISSION
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('contact-trigger');
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!modal) return;

    const openModal = (e) => {
        if (e) e.preventDefault();
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    if (trigger) trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on overlay background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // In-page Form Submission via Fetch API (Prevents Redirect)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const data = new FormData(form);

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.style.display = 'none';
                    status.style.display = 'block';
                    status.innerHTML = 'Thank you! Your message has been sent.';
                    
                    // Auto-close modal after 2.5 seconds and reset form
                    setTimeout(() => {
                        closeModal();
                        form.reset();
                        form.style.display = 'block';
                        status.style.display = 'none';
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send';
                    }, 2500);
                } else {
                    const result = await response.json();
                    status.style.display = 'block';
                    status.style.color = '#d9534f';
                    status.textContent = result.errors ? result.errors.map(error => error.message).join(", ") : "Oops! There was a problem submitting your form.";
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send';
                }
            } catch (error) {
                status.style.display = 'block';
                status.style.color = '#d9534f';
                status.textContent = "Oops! There was a problem submitting your form.";
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send';
            }
        });
    }
});