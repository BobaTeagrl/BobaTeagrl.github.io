import { initTerminalTyping } from './terminal.js';
import { initLazyLoad } from './lazyload.js';
import { initModal, openPhoto } from './modal.js';
import { initShare } from './share.js';
import { initDeepLink } from './deeplink.js';

initTerminalTyping();
initLazyLoad();
initModal();
initShare();
initDeepLink();

document.querySelectorAll('.photo-terminal').forEach(el => {
    el.addEventListener('click', e => {
        if (e.target.closest('.share-button') || e.target.closest('.share-menu')) return;
        openPhoto(Number(el.dataset.photoId), el);
    });
});
