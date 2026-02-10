document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(24px)";
        section.style.transition = "all 0.6s ease";
        observer.observe(section);
    });

    const typed = new Typed('.multiple-text', {
        strings: [
            'Data Engineer',
            'Applied AI Researcher',
            'ML Engineer',
            'PhD Researcher'
        ],
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1200,
        loop: true
    });

    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }
});
