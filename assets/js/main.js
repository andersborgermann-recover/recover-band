document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial check

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'light' || (!storedTheme && !prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .usp-card, .testimonial-card, .faq-item, .media-grid').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Repertoire Logic
    const songListContainer = document.getElementById('songList');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (songListContainer && typeof repertoireData !== 'undefined') {

        function renderSongs(songs) {
            songListContainer.innerHTML = '';

            // Add Header
            const header = document.createElement('div');
            header.className = 'song-list-header';
            header.innerHTML = `
                <div class="header-title">Titel</div>
                <div class="header-artist">Kunstner</div>
                <div class="header-tag">Genre</div>
            `;
            songListContainer.appendChild(header);

            if (songs.length === 0) {
                songListContainer.innerHTML += '<p style="text-align:center; padding: 2rem; color: var(--color-text-muted);">Ingen sange fundet.</p>';
                return;
            }

            songs.forEach(song => {
                const div = document.createElement('div');
                div.className = 'song-item';
                div.innerHTML = `
                    <div class="song-info">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                    <span class="song-tag">${song.tag}</span>
                `;
                songListContainer.appendChild(div);
            });
        }

        // Initial Render
        renderSongs(repertoireData);

        // Search Functionality
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            filterAndRender(searchTerm, activeFilter);
        });

        // Filter Functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');

                const searchTerm = searchInput.value.toLowerCase();
                const filter = btn.dataset.filter;

                filterAndRender(searchTerm, filter);
            });
        });

        function filterAndRender(searchTerm, filter) {
            const filtered = repertoireData.filter(song => {
                const matchesSearch = song.title.toLowerCase().includes(searchTerm) ||
                    song.artist.toLowerCase().includes(searchTerm);
                const matchesFilter = filter === 'all' || song.tag === filter;

                return matchesSearch && matchesFilter;
            });
            renderSongs(filtered);
        }
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const type = document.getElementById('type').value;
            const date = document.getElementById('date').value;
            const message = document.getElementById('message').value;

            const subject = `Booking forespørgsel: ${type} - ${date}`;
            const body = `Navn: ${name}
Email: ${email}
Type af fest: ${type}
Dato: ${date}

Besked:
${message}`;

            const mailtoLink = `mailto:andersborgermann@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.location.href = mailtoLink;
        });
    }
});
