(function () {
  // Get the table element
  const table = document.getElementById('csvTablePrizeRank');
  if (!table) return;

  // Get CSV path
  const prizeRankCsvPath = table.dataset.csvPrizeRank;
  if (!prizeRankCsvPath) {
    console.warn('CSV file path not specified on table element.');
    return;
  }

  // Parse CSV string into array of objects
  function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].trim().split(',');
    return lines.slice(1).map(line => {
      const values = line.trim().split(',');
      return headers.reduce((obj, header, i) => {
        obj[header] = values[i]?.trim() ?? '';
        return obj;
      }, {});
    });
  }

  // Fetch CSV file from server
  function fetchCSV(url) {
    return fetch(url).then(response => response.text()).then(parseCSV);
  }

  // Fetch and build table
  fetchCSV(prizeRankCsvPath)
    .then(file1Data => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      file1Data.forEach(row => {
        const tr = document.createElement('tr');

        // Rank column
        const tdRank = document.createElement('td');
        tdRank.textContent = row.rank;
        tr.appendChild(tdRank);

        // Player column
        const tdName = document.createElement('td');
        tdName.textContent = row.player;
        tr.appendChild(tdName);

        // Prize total column
        const tdPrizeTotal = document.createElement('td');
        tdPrizeTotal.textContent = row.prizeTotal;
        tr.appendChild(tdPrizeTotal);

        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error('Error fetching CSV file:', error));
})();
