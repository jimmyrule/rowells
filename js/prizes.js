(function () {

// Get the table element
const table = document.getElementById('csvTablePrizes');
if (!table) return; // Exit if table isn't present

// Get CSV paths from data attributes
const prizesCsvPath = table.dataset.csvPrizes;
const teamsCsvPath = table.dataset.csvTeams;

// Exit if any required paths are missing
if (!prizesCsvPath || !teamsCsvPath) {
    console.warn('CSV file paths not specified on table element.');
    return;
}

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
    return fetch(url).then(response => response.text()).then(parseCSV);
}

// Fetch CSV files and generate the table
Promise.all([fetchCSV(prizesCsvPath), fetchCSV(teamsCsvPath)])
    .then(([file1Data, file2Data]) => {
        // Create lookup map from file2Data
        const lookupMap = file2Data.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {});

        // Get the table body element safely
        const table = document.getElementById('csvTablePrizes');
        if (!table) return; // Exit early if table is not present on this page

        const tbody = table.querySelector('tbody');

        // Populate the table
        file1Data.forEach(row => {
            const tr = document.createElement('tr');

            // Prize column
            const tdPrize = document.createElement('td');
            tdPrize.textContent = row.prize;

            const icon = document.createElement('i');
            icon.classList.add('fa-regular', 'fa-circle-question', 'ms-2', 'help-text'); // Bootstrap spacing + color
            icon.setAttribute('data-bs-toggle', 'tooltip');
            icon.setAttribute('data-bs-placement', 'right');
            icon.setAttribute('title', row.description);
            icon.setAttribute('tabindex', '0');
            tdPrize.appendChild(icon);

            tr.appendChild(tdPrize);

            // Amount column
            const tdAmount = document.createElement('td');
            tdAmount.classList.add('text-center');
            tdAmount.textContent = row.amount;
            tr.appendChild(tdAmount);

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
                const placeholder = document.createElement('i');
                placeholder.classList.add('fas');
                placeholder.classList.add('fa-volleyball-ball');
                placeholder.classList.add('fa-2x');
                placeholder.classList.add('text-dark-grey');
                tdTeam.appendChild(placeholder);

                const placeholderLabel = document.createElement('p');
                placeholderLabel.textContent = "tbc";
                placeholderLabel.classList.add('text-dark-grey');
                tdTeam.appendChild(placeholderLabel);
            }
            tr.appendChild(tdTeam);

            // Append row to table body
            tbody.appendChild(tr);
        });

        // Re-initialize Bootstrap tooltips after DOM update
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger: 'hover focus click'
          });
        });

    })
    .catch(error => console.error('Error fetching CSV files:', error));

    })();
