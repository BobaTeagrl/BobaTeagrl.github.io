let currentIndex = -1;
let photoEls = [];

// Touch/swipe state
let touchStartX = 0;
let touchStartY = 0;

export function initModal() {
    photoEls = Array.from(document.querySelectorAll('.photo-terminal'));

    const modal = document.getElementById('photoModal');
    const closeBtn = document.getElementById('modalClose');

    closeBtn.addEventListener('click', closeModal);

    // Keyboard nav
    document.addEventListener('keydown', e => {
        if (modal.style.display !== 'flex') return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') { navigate(1); e.preventDefault(); }
        if (e.key === 'ArrowLeft')  { navigate(-1); e.preventDefault(); }
    });

    window.goNextPhoto = () => navigate(1);
    window.goPrevPhoto = () => navigate(-1);
    // The close on click off if you loose it again idiot
    modal.addEventListener('click', e => {
        if (e.target.closest('#modalContent')) return;
        closeModal();
    });

    // Swipe gestures on the modal
    modal.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    modal.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        // Swipe down to close (must be more vertical than horizontal)
        if (dy > 60 && Math.abs(dy) > Math.abs(dx)) {
            closeModal();
            return;
        }

        // Swipe left/right to navigate (must be more horizontal than vertical)
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            navigate(dx < 0 ? 1 : -1);
        }
    }, { passive: true });
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    const scrollY = document.body.style.top;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, -parseInt(scrollY || '0'));
}

export function openPhoto(id, el) {
    const modal = document.getElementById('photoModal');
    const content = document.getElementById('modalContent');

    photoEls = Array.from(document.querySelectorAll('.photo-terminal'));
    currentIndex = photoEls.indexOf(el);  // ← set FIRST

    if (currentIndex === -1) return;      // ← NOW this check is valid

    const img = el.querySelector('.photo-image');
    const thumbSrc = img.dataset.src || img.src;
    const fullSrc = img.dataset.full;

    content.innerHTML = `
        <div class="modal-photo">
            <h3>PHOTO_${String(id).padStart(3, '0')}.RAW</h3>
            <div class="modal-image-container">
                <img src="${thumbSrc}" class="modal-thumbnail" alt="Loading...">
                <img class="modal-full-image" alt="Photo ${id}">
                <div class="modal-loading">LOADING FULL RESOLUTION...</div>
            </div>
            ${navMarkup()}
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';

    loadFullImage(fullSrc);
}

function loadFullImage(fullSrc) {
    const fullImg = document.querySelector('.modal-full-image');
    const thumb   = document.querySelector('.modal-thumbnail');
    const loading = document.querySelector('.modal-loading');

    const preloader = new Image();

    preloader.onload = () => {
        fullImg.src = preloader.src;
        fullImg.classList.add('loaded');
        setTimeout(() => {
            thumb.classList.add('hidden');
            loading.style.display = 'none';
        }, 500);
    };

    preloader.onerror = () => {
        loading.textContent = 'ERROR: FAILED TO LOAD';
        loading.style.color = '#ff4444';
    };

    preloader.src = fullSrc;
}

function navigate(delta) {
    if (currentIndex === -1 || photoEls.length === 0) return;
    currentIndex = (currentIndex + delta + photoEls.length) % photoEls.length;
    const el = photoEls[currentIndex];
    openPhoto(Number(el.dataset.photoId), el);
}

function navMarkup() {
    return `
        <div class="modal-nav" onclick="event.stopPropagation()">
            <button class="nav-btn" onclick="goPrevPhoto()">←</button>
            <span class="nav-hint">← → keys | swipe</span>
            <button class="nav-btn" onclick="goNextPhoto()">→</button>
        </div>
    `;
}