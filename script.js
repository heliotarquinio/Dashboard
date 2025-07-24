const search = document.querySelector('.input-group input'),
    table_rows = document.querySelectorAll('tbody tr'),
    table_headings = document.querySelectorAll('thead th');

// 1. Buscar dados na tabela
search.addEventListener('input', searchTable);

function searchTable() {
    table_rows.forEach((row, i) => {
        const row_text = row.textContent.toLowerCase();
        const search_value = search.value.toLowerCase();

        row.classList.toggle('hide', !row_text.includes(search_value));
        row.style.setProperty('--delay', i / 25 + 's');
    });

    document.querySelectorAll('tbody tr:not(.hide)').forEach((row, i) => {
        row.style.backgroundColor = (i % 2 === 0) ? 'transparent' : '#0000000b';
    });
}

// 2. Ordenar colunas da tabela
table_headings.forEach((head, i) => {
    let sort_asc = true;
    head.onclick = () => {
        table_headings.forEach(h => h.classList.remove('active'));
        head.classList.add('active');

        document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
        table_rows.forEach(row => {
            row.querySelectorAll('td')[i].classList.add('active');
        });

        head.classList.toggle('asc', sort_asc);
        sort_asc = head.classList.contains('asc') ? false : true;

        sortTable(i, sort_asc);
    };
});

function sortTable(column, sort_asc) {
    [...table_rows].sort((a, b) => {
        let valA = a.querySelectorAll('td')[column].textContent.trim().toLowerCase();
        let valB = b.querySelectorAll('td')[column].textContent.trim().toLowerCase();

        const numA = parseFloat(valA);
        const numB = parseFloat(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
            return sort_asc ? numA - numB : numB - numA;
        }

        return sort_asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }).forEach(row => document.querySelector('tbody').appendChild(row));
}

// 3. Exportar para PDF
const pdf_btn = document.querySelector('#toPDF');
const customers_table = document.querySelector('#customers_table');

const toPDF = function (table) {
    const html_code = `
    <!DOCTYPE html>
    <html>
    <head>
    <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <main class="table" id="customers_table">${table.innerHTML}</main>
    </body>
    </html>`;

    const new_window = window.open();
    new_window.document.write(html_code);
    new_window.document.close();

    setTimeout(() => {
        new_window.print();
        new_window.close();
    }, 400);
};

pdf_btn.onclick = () => {
    toPDF(customers_table);
};

// 4. Exportar para JSON
const json_btn = document.querySelector('#toJSON');

const toJSON = function (table) {
    const data = [];
    const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim().toLowerCase());

    table.querySelectorAll('tbody tr').forEach(row => {
        const obj = {};
        row.querySelectorAll('td').forEach((td, i) => {
            obj[headers[i]] = td.textContent.trim();
        });
        data.push(obj);
    });

    return JSON.stringify(data, null, 4);
};

json_btn.onclick = () => {
    const json = toJSON(customers_table);
    downloadFile(json, 'json', 'relatorio_meteorologico');
};

// 5. Exportar para CSV
const csv_btn = document.querySelector('#toCSV');

const toCSV = function (table) {
    const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim().toLowerCase()).join(',');
    const rows = [...table.querySelectorAll('tbody tr')].map(row =>
        [...row.querySelectorAll('td')].map(td => td.textContent.trim().replace(/,/g, '.')).join(',')
    ).join('\n');

    return headers + '\n' + rows;
};

csv_btn.onclick = () => {
    const csv = toCSV(customers_table);
    downloadFile(csv, 'csv', 'relatorio_meteorologico');
};

// 6. Exportar para Excel (formato .tsv)
const excel_btn = document.querySelector('#toEXCEL');

const toExcel = function (table) {
    const headers = [...table.querySelectorAll('th')].map(th => th.textContent.trim().toLowerCase()).join('\t');
    const rows = [...table.querySelectorAll('tbody tr')].map(row =>
        [...row.querySelectorAll('td')].map(td => td.textContent.trim()).join('\t')
    ).join('\n');

    return headers + '\n' + rows;
};

excel_btn.onclick = () => {
    const excel = toExcel(customers_table);
    downloadFile(excel, 'excel', 'relatorio_meteorologico');
};

// Função de download
function downloadFile(data, fileType, fileName = '') {
    const a = document.createElement('a');
    a.download = fileName + '.' + fileType;

    const mime_types = {
        json: 'application/json',
        csv: 'text/csv',
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    a.href = `data:${mime_types[fileType]};charset=utf-8,${encodeURIComponent(data)}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
