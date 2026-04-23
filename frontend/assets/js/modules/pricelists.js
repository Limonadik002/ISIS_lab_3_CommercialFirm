const PricelistsModule = {
    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <h2>Прайс-лист</h2>
            <div id="tableContainer"><div class="spinner-border"></div></div>
        `;
        await this.loadTable();
    },

    async loadTable() {
        const list = await API.pricelists.getAll();
        let html = `<table class="table table-bordered"><thead class="table-dark">
            <th>Цена</th>
            <th>Модель</th>
        </tr></thead><tbody>`;
        for (const p of list) {
            html += `<tr>
                <td>${Number(p.Price).toFixed(2)}</td>
                <td>${this.escape(p.Model_name || '—')}</td>
            </tr>`;
        }
        html += `</tbody></table>`;
        document.getElementById('tableContainer').innerHTML = html;
    },

    escape(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
    }
};