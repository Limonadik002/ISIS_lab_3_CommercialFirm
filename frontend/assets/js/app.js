document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        clients: () => ClientsModule.render()
    };

    function loadPage(page) {
        if (pages[page]) pages[page]();
        else document.getElementById('app').innerHTML = '<h2>Страница не найдена</h2>';
    }

    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(link.dataset.page);
        });
    });

    loadPage('clients');
});