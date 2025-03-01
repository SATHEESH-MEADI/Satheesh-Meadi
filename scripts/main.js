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
