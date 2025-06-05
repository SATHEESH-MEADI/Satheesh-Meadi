document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll("section").forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        observer.observe(section);
    });

    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 200) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            window.location.href = `mailto:smeadi1@umbc.edu?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0AFrom: ${email}`;
            contactForm.reset();
        });
    }
});


document.addEventListener("DOMContentLoaded", function() {
    const typed = new Typed('.multiple-text', {
        strings: ['Data Engineer','Data Analyst','Software Engineer','Data Scientist', 'AI Enthusiast', 'Tech Innovator','Machine Learning Engineer'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 1000,
        loop: true
    });
});
