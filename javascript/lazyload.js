export function initLazyLoad() {
    const images = document.querySelectorAll('.lazy-load');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const img = entry.target;
            const container = img.closest('.photo-content');
            const placeholder = container.querySelector('.photo-placeholder');
            const loading = container.querySelector('.loading-text');

            placeholder.style.display = 'none';
            loading.style.display = 'flex';

            const overlay = document.createElement('div');
            overlay.className = 'decryption-overlay';
            container.appendChild(overlay);

            const preload = new Image();
            preload.onload = () => {
                img.src = preload.src;
                img.classList.add('loaded');
                loading.style.display = 'none';
                setTimeout(() => overlay.remove(), 2000);
            };

            preload.onerror = () => {
                loading.textContent = 'ERROR: FILE_NOT_FOUND';
            };

            preload.src = img.dataset.src;
            observer.unobserve(img);
        });
    });

    images.forEach(img => observer.observe(img));
}
