// Function to parse CSV string into array of objects
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].trim().split(',');
    return lines.slice(1).map(line => {
        const values = line.trim().split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = values[i].trim();
            return obj;
        }, {});
    });
}

// Function to fetch CSV file from the server
function fetchCSV(url) {
    return fetch(url)
        .then(response => response.text())
        .then(parseCSV);
}

// Fetch CSV files and generate the table
Promise.all([fetchCSV('/assets/files/prizes.csv'), fetchCSV('/assets/files/teams.csv')])
    .then(([file1Data, file2Data]) => {
        // Create lookup map from file2Data
        const lookupMap = file2Data.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {});

        // Get the table body element
        const tbody = document.getElementById('csvTablePrizes').querySelector('tbody');

        // Populate the table
        file1Data.forEach(row => {
            const tr = document.createElement('tr');

            // Prize column
            const tdPrize = document.createElement('td');
            tdPrize.textContent = row.prize;

            // Add label to prize column
            const label = document.createElement('p');
            tdPrize.classList.add('help-text');
            label.textContent = row.description;
            tdPrize.appendChild(label);
            tr.appendChild(tdPrize);

            // Team column
            const tdTeam = document.createElement('td');
            tdTeam.classList.add('text-center');
            tdTeam.classList.add('text-small');
            if (lookupMap[row.team] && lookupMap[row.team].url) {
                const img = document.createElement('img');
                img.src = '/assets/images/' + lookupMap[row.team].url + '.png';
                img.alt = lookupMap[row.team].name;
                img.height = '30'
                tdTeam.appendChild(img);

                const label = document.createElement('p');
                label.textContent = lookupMap[row.team].name;
                tdTeam.appendChild(label);

            } else {
                tdTeam.textContent = '';
            }
            tr.appendChild(tdTeam);

            // Amount column
            const tdAmount = document.createElement('td');
            tdAmount.classList.add('text-center');
            tdAmount.textContent = row.amount;
            tr.appendChild(tdAmount);

            // Append row to table body
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error fetching CSV files:', error));
