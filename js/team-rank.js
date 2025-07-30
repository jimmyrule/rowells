(function () {
  // Get the table element
  const table = document.getElementById('csvTableTeamRank');
  if (!table) return;

  // Get CSV path
  const teamRankCsvPath = table.dataset.csvTeamRank;
  if (!teamRankCsvPath) {
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
  fetchCSV(teamRankCsvPath)
    .then(file1Data => {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      file1Data.forEach(row => {
        const tr = document.createElement('tr');

        // Rank column
        const tdRank = document.createElement('td');
        tdRank.textContent = row.rank;
        tr.appendChild(tdRank);

        // Team name column
        const tdTeamName = document.createElement('td');
        tdTeamName.textContent = row.team;
        tr.appendChild(tdTeamName);

        // Flag column
        const tdFlag = document.createElement('td');
        tdFlag.classList.add('text-center');
        const img = document.createElement('img');
        img.src = '/assets/images/' + row.url + '.svg';
        img.alt = row.team;
        img.width = '50'
        tdFlag.appendChild(img);
        tr.appendChild(tdFlag);

        // Prize count column
        const tdPrizeCount = document.createElement('td');
        tdPrizeCount.textContent = row.prizeCount;
        tr.appendChild(tdPrizeCount);

        // Prize total column
        const tdPrizeTotal = document.createElement('td');
        tdPrizeTotal.textContent = row.prizeTotal;
        tr.appendChild(tdPrizeTotal);

        tbody.appendChild(tr);
      });
    })
    .catch(error => console.error('Error fetching CSV file:', error));
})();
