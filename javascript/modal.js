let currentIndex = -1;
let photoEls = [];

export function initModal() {
    photoEls = Array.from(document.querySelectorAll('.photo-terminal'));

    const modal = document.getElementById('photoModal');
    const closeBtn = document.getElementById('modalClose');

    closeBtn.addEventListener('click', closeModal);



    document.addEventListener('keydown', e => {
        if (modal.style.display !== 'block') return;

        if (e.key === 'Escape') {
            closeModal();
        }

        if (e.key === 'ArrowRight') {
            navigate(1);
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft') {
            navigate(-1);
            e.preventDefault();
        }
    });

    window.goNextPhoto = () => navigate(1);
    window.goPrevPhoto = () => navigate(-1);

    modal.addEventListener('click', e => {
        if (e.target.closest('#modalContent')) return;
        closeModal();
    });


}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
}


    document.addEventListener('keydown', e => {
        const modal = document.getElementById('photoModal');
        if (modal.style.display !== 'block') return;

        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }

        if (e.key === 'ArrowRight') {
            navigate(1);
            e.preventDefault();
        }

        if (e.key === 'ArrowLeft') {
            navigate(-1);
            e.preventDefault();
        }
    });

    // expose for buttons
    window.goNextPhoto = () => navigate(1);
    window.goPrevPhoto = () => navigate(-1);


export function openPhoto(id, el) {
    const modal = document.getElementById('photoModal');
    const content = document.getElementById('modalContent');

    photoEls = Array.from(document.querySelectorAll('.photo-terminal'));
    currentIndex = photoEls.indexOf(el);

    if (currentIndex === -1) return;

    const img = el.querySelector('.photo-image');
    const src = img.dataset.full || img.src;

    content.innerHTML = `
        <div class="modal-photo">
            <h3>PHOTO_${String(id).padStart(3, '0')}.RAW</h3>
           <img src="${src}" class="modal-image">
            ${navMarkup()}
        </div>
    `;

    modal.style.display = 'block';
}

function navigate(delta) {
    if (currentIndex === -1 || photoEls.length === 0) return;

    currentIndex = (currentIndex + delta + photoEls.length) % photoEls.length;
    const el = photoEls[currentIndex];
    const id = el.dataset.photoId;

    openPhoto(Number(id), el);
}

function navMarkup() {
    return `
        <div class="modal-nav">
            <button class="nav-btn" onclick="goPrevPhoto()">←</button>
            <span class="nav-hint">Use ← → keys</span>
            <button class="nav-btn" onclick="goNextPhoto()">→</button>
        </div>
    `;
}
