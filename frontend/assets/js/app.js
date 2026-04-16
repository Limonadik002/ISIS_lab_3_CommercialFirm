document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        clients: () => ClientsModule.render(),
        employees: () => EmployeesModule.render(),
        suppliers: () => SuppliersModule.render(),
        pricelists: () => PricelistsModule.render(),
        models: () => CarModelsModule.render(),
        deals: () => DealsModule.render(),
        supplieroffers: () => SupplierOffersModule.render(),
        modelsindeal: () => ModelsInDealModule.render(),
        report: () => ReportModule.render()
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