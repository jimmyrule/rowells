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
Promise.all([fetchCSV('/assets/files/players.csv'), fetchCSV('/assets/files/teams.csv')])
    .then(([file1Data, file2Data]) => {
        // Create lookup map from file2Data
        const lookupMap = file2Data.reduce((map, obj) => {
            map[obj.id] = obj;
            return map;
        }, {});

        // Get the table body element
        const tbody = document.getElementById('csvTableDraw').querySelector('tbody');

        // Populate the table
        file1Data.forEach(row => {
            const tr = document.createElement('tr');

            // Name column
            const tdName = document.createElement('td');
            tdName.textContent = row.name;

            // Add label to name column if the player has a prize winning team 1
            if (lookupMap[row.team1] && lookupMap[row.team1].prize === 'TRUE') {
                const label3 = document.createElement('i');
                label3.classList.add('fas');
                label3.classList.add('fa-money-bill-wave');
                label3.classList.add('prize');
                tdName.appendChild(label3);
            }

            // Add label to name column if the player has a prize winning team 2
            if (lookupMap[row.team2] && lookupMap[row.team2].prize === 'TRUE') {
                const label4 = document.createElement('i');
                label4.classList.add('fas');
                label4.classList.add('fa-money-bill-wave');
                label4.classList.add('prize');
                tdName.appendChild(label4);
            }

            tr.appendChild(tdName);

            // Team 1 column
            const tdTeam1 = document.createElement('td');
            tdTeam1.classList.add('text-center');
            tdTeam1.classList.add('text-small');
            if (lookupMap[row.team1] && lookupMap[row.team1].url) {
                const img1 = document.createElement('img');
                img1.src = '/assets/images/' + lookupMap[row.team1].url + '.png';
                img1.alt = lookupMap[row.team1].name;
                img1.height = '30'
                tdTeam1.appendChild(img1);

                const label1 = document.createElement('p');
                label1.textContent = lookupMap[row.team1].name;
                tdTeam1.appendChild(label1);

                if (lookupMap[row.team1].eliminated === 'TRUE') {
                    tdTeam1.classList.add('eliminated');
                }
            } else {
                //tdTeam1.textContent = '';
                const labelPlace = document.createElement('i');
                labelPlace.classList.add('fas');
                labelPlace.classList.add('fa-volleyball-ball');
                labelPlace.classList.add('fa-2x');
                labelPlace.classList.add('text-dark-grey');
                tdTeam1.appendChild(labelPlace);
            }
            tr.appendChild(tdTeam1);

            // Team 2 column
            const tdTeam2 = document.createElement('td');
            tdTeam2.classList.add('text-center');
            tdTeam2.classList.add('text-small');
            if (lookupMap[row.team2] && lookupMap[row.team2].url) {
                const img2 = document.createElement('img');
                img2.src = '/assets/images/' + lookupMap[row.team2].url + '.png';
                img2.alt = lookupMap[row.team2].name;
                img2.height = '30'
                tdTeam2.appendChild(img2);

                const label2 = document.createElement('p');
                label2.textContent = lookupMap[row.team2].name;
                tdTeam2.appendChild(label2);

                if (lookupMap[row.team2].eliminated === 'TRUE') {
                    tdTeam2.classList.add('eliminated');
                }
            } else {
                tdTeam2.textContent = '';
                //const labelPlace = document.createElement('i');
                //labelPlace.classList.add('fas');
                //labelPlace.classList.add('fa-volleyball-ball');
                //labelPlace.classList.add('fa-2x');
                //labelPlace.classList.add('text-dark-grey');
                //tdTeam2.appendChild(labelPlace);
            }
            tr.appendChild(tdTeam2);

            // Append row to table body
            tbody.appendChild(tr);
        });
    })
    .catch(error => console.error('Error fetching CSV files:', error));
