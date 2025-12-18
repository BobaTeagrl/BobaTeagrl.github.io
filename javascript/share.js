export function initShare() {
    window.toggleShareMenu = (id, e) => {
        e.stopPropagation();
        const menu = document.getElementById(`share-menu-${id}`);

        document.querySelectorAll('.share-menu')
            .forEach(m => m !== menu && m.classList.remove('active'));

        menu.classList.toggle('active');
    };

    window.copyPhotoLink = (id, e) => {
        e.stopPropagation();

        const url = new URL(`${id}.html`, location.origin).href;

        navigator.clipboard.writeText(url).then(() => {
            show('Photo link copied! 📋');
            closeAllMenus();
        });
    };

    // Add this function
    function closeAllMenus() {
        document.querySelectorAll('.share-menu')
            .forEach(m => m.classList.remove('active'));
    }

    document.addEventListener('click', () => {
        closeAllMenus();
    });

    function show(msg) {
        const n = document.createElement('div');
        n.className = 'copy-notification';
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
}