document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('playBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingSpans = [
        document.querySelector('.loading-geometry'),
        document.querySelector('.loading-vibes'),
        document.querySelector('.loading-monster')
    ];

    function setTextGradient(progress) {
        // progress: 0 - 100
        loadingSpans.forEach(span => {
            if (span) span.style.backgroundSize = progress + '% 100%';
        });
    }

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            // Tampilkan loading
            loadingOverlay.classList.remove('hide');
            loadingProgress.style.width = '0%';
            let progress = 0;
            setTextGradient(0);
            const interval = setInterval(() => {
                progress += Math.random() * 5 + 3; // lebih lambat
                if (progress >= 100) progress = 100;
                loadingProgress.style.width = progress + '%';
                setTextGradient(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        loadingOverlay.classList.add('hide');
                        window.location.href = 'charactercreation.html';
                    }, 600);
                }
            }, 120);
        });
    }

    // Sembunyikan loading saat pertama kali
    loadingOverlay.classList.add('hide');
    setTextGradient(0);

    // Navbar active underline
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}); 