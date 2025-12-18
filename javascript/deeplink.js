import { openPhoto } from './modal.js';

export function initDeepLink() {
    const params = new URLSearchParams(location.search);
    const id = params.get('photo');
    if (!id) return;

    const el = document.querySelector(`[data-photo-id="${id}"]`);
    if (!el) return;

    setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.border = '2px solid #f700ff';
    }, 500);
}
