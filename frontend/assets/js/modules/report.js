const ReportModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Отчёт о реализации автомобилей</h2>
            <div class="row mb-3">
                <div class="col-md-3">
                    <label>Месяц</label>
                    <select id="monthSelect" class="form-select"></select>
                </div>
                <div class="col-md-3">
                    <label>Год</label>
                    <select id="yearSelect" class="form-select"></select>
                </div>
                <div class="col-md-2 align-self-end">
                    <button id="generateBtn" class="btn btn-primary">Сформировать</button>
                </div>
            </div>
            <div id="reportContainer"></div>
        `;
        await this.loadFilters();
        document.getElementById('generateBtn').onclick = () => this.generateReport();
    },
    async loadFilters() {
        const data = await API.report.get();
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        data.months.forEach(m => {
            const option = document.createElement('option');
            option.value = m.value;
            option.textContent = m.name;
            monthSelect.appendChild(option);
        });
        data.years.forEach(y => {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            yearSelect.appendChild(option);
        });
        const now = new Date();
        monthSelect.value = now.getMonth() + 1;
        yearSelect.value = now.getFullYear();
    },
    async generateReport() {
        const month = document.getElementById('monthSelect').value;
        const year = document.getElementById('yearSelect').value;
        const data = await API.report.get(month, year);
        if (data.length === 0) {
            document.getElementById('reportContainer').innerHTML = '<div class="alert alert-info">Нет данных за выбранный период</div>';
            return;
        }
        const grouped = {};
        data.forEach(item => {
            if (!grouped[item.firm]) grouped[item.firm] = [];
            grouped[item.firm].push(item);
        });
        let html = '<table class="table table-bordered"><thead class="table-dark"><tr><th>Наименование модели</th><th>Цена, руб.</th><th>Предпродажная подготовка, руб.</th><th>Транспортные издержки, руб.</th><th>Стоимость, руб.</th></thead><tbody>';
        let grandTotal = 0;
        for (const [firm, items] of Object.entries(grouped)) {
            html += `<tr class="table-secondary"><td colspan="5"><strong>Фирма: ${this.escape(firm)}</strong></td></tr>`;
            let firmTotal = 0;
            for (const item of items) {
                html += `<tr>
                    <td>${this.escape(item.Model_name)}</td>
                    <td>${Number(item.Price).toFixed(2)}</td>
                    <td>${Number(item.prep_cost).toFixed(2)}</td>
                    <td>${Number(item.transport_cost).toFixed(2)}</td>
                    <td>${Number(item.total_cost).toFixed(2)}</td>
                </tr>`;
                firmTotal += Number(item.total_cost);
            }
            html += `<tr class="table-info"><td colspan="4"><strong>Итого по фирме:</strong></td><td><strong>${firmTotal.toFixed(2)}</strong></td></tr>`;
            grandTotal += firmTotal;
        }
        html += `<tr class="table-success"><td colspan="4"><strong>Общий итог:</strong></td><td><strong>${grandTotal.toFixed(2)}</strong></td></tr>`;
        html += '</tbody></table>';
        document.getElementById('reportContainer').innerHTML = html;
    },
    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};