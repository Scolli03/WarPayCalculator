// ==UserScript== 
// @name         War Payment Calculator
// @namespace    http://tampermonkey.net/
// @version      3.10.8
// @description  try to take over the world!
// @author       Scolli03 [3150751]
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL  https://raw.githubusercontent.com/Scolli03/WarPayCalculator/main/warpaycalculator.js
// @updateURL    https://raw.githubusercontent.com/Scolli03/WarPayCalculator/main/warpaycalculator.js
// ==/UserScript==

(function() {

    let selector = '.your-faction';
    let list_item = 'li.your ';

    let winnor = document.querySelector('.t-blue').textContent;

    if (winnor !== 'Misfit Mafia') {
        selector = '.enemy-faction';
        list_item = 'li.enemy ';
    }

    // Select the initial element using the provided CSS selector
    const yourFactionTable = document.querySelector(selector);

    // Find the unordered list within this element
    const ulElement = yourFactionTable.querySelector('ul.members-list');

    // Get all list items within the unordered list
    const listItems = ulElement.querySelectorAll(list_item);

    // Initialize an array to store the extracted data
    const extractedData = [];

    // List of names to exclude
    const excludedNames = ['BobbyCholo', 'FatChickBathWTR'];

    // Loop through each list item
    listItems.forEach(item => {
        // Extract the Member name
        const memberName = item.querySelector('.member .userInfoBox___LRjPl').textContent.trim();

        // Extract the Attack count
        const attackCount = parseInt(item.querySelector('.points').textContent.trim(), 10);

        // Only add the member data if the attack count is greater than zero
        if (attackCount > 0 && !excludedNames.includes(memberName)) {
            // Store the extracted data in an object
            const memberData = {
                memberName,
                attackCount
            };

            // Add the object to the array
            extractedData.push(memberData);
        }
    });

    // Create a form element for the inputs
    const form = document.createElement('form');
    form.classList.add('input-form');

    // Create input field for Total Winnings
    const totalWinningsInput = document.createElement('input');
    totalWinningsInput.type = 'number';
    totalWinningsInput.placeholder = 'Total Winnings';
    totalWinningsInput.id = 'total-winnings';

    // Append the input to the form
    form.appendChild(totalWinningsInput);

    // Create labels for Leadership Pay and Faction Costs
    const leadershipPayLabel = document.createElement('label');
    leadershipPayLabel.textContent = 'Leadership Pay: $0.00';
    leadershipPayLabel.style.display = 'block';

    // Create a label for Leadership Pay percentage
    const leadershipPayPercentageLabel = document.createElement('label');
    leadershipPayPercentageLabel.textContent = 'Leadership %';
    leadershipPayPercentageLabel.style.whiteSpace = 'nowrap';
    leadershipPayPercentageLabel.style.display = 'flex';
    leadershipPayPercentageLabel.style.alignItems = 'center';

    // Append the label to the form
    form.appendChild(leadershipPayPercentageLabel);


    // add an input field for leadership pay percentage
    const leadershipPayInput = document.createElement('input');
    leadershipPayInput.type = 'number';
    leadershipPayInput.placeholder = 'Leadership Pay %';
    leadershipPayInput.id = 'leadership-pay';
    leadershipPayInput.value = '25';

    // Append the input to the form
    form.appendChild(leadershipPayInput);

    const factionCostsLabel = document.createElement('label');
    factionCostsLabel.textContent = 'Faction Costs: $0.00';
    factionCostsLabel.style.display = 'block';

    // Create a label for Faction Costs percentage
    const factionpercentageLabel = document.createElement('label');
    factionpercentageLabel.textContent = 'Faction %';
    factionpercentageLabel.style.whiteSpace = 'nowrap';
    factionpercentageLabel.style.display = 'flex';
    factionpercentageLabel.style.alignItems = 'center';
    
    // Append the label to the form
    form.appendChild(factionpercentageLabel);

    // add an input field for faction costs percentage
    const factionCostsInput = document.createElement('input');
    factionCostsInput.type = 'number';
    factionCostsInput.placeholder = 'Faction Costs %';
    factionCostsInput.id = 'faction-costs';
    factionCostsInput.value = '25';

    // Append the input to the form
    form.appendChild(factionCostsInput);

    // Append the input to the form
    form.appendChild(factionCostsInput);


    // Create a div container for the form, labels, and table
    const container = document.createElement('div');
    container.style.marginTop = '20px'; // Add space between the main element and the container
    container.appendChild(form);
    container.appendChild(leadershipPayLabel);
    container.appendChild(factionCostsLabel);

    // Create a table element
    const table = document.createElement('table');
    table.border = '1';
    table.classList.add('dark-theme-table');

    // Create the table header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    const headers = ['Member Name', 'Attack Count', 'Payout'];
    headers.forEach(text => {
        const cell = document.createElement('th');
        cell.textContent = text;
        headerRow.appendChild(cell);
    });

    // Create the table body
    const tbody = table.createTBody();
    extractedData.forEach(data => {
        const row = tbody.insertRow();
        const memberNameCell = row.insertCell();
        memberNameCell.textContent = data.memberName;

        const attackCountCell = row.insertCell();
        attackCountCell.textContent = data.attackCount;

        // Calculate the payout and add it to the last cell
        const payoutCell = row.insertCell();
        payoutCell.textContent = '0.00'; // Initial value, will be updated by event listeners
    });

    // Append the table to the container
    container.appendChild(table);

    // Create a spacer div
    const spacer = document.createElement('div');
    spacer.style.height = '20px'; // Adjust the height as needed

    // Append the spacer to the container before the total paid label
    container.appendChild(spacer);

    // Create a label for the total amount paid to members
    const totalPaidLabel = document.createElement('label');
    totalPaidLabel.textContent = 'Total Amount Paid to Members: $0.00';
    totalPaidLabel.style.display = 'block';
    totalPaidLabel.style.textAlign = 'right'; // Align the label to the right

    // Append the total paid label to the container
    container.appendChild(totalPaidLabel);

    // Create a label for the pay per hit
    const payPerHitLabel = document.createElement('label');
    payPerHitLabel.textContent = 'Pay Per Hit: $0.00';
    payPerHitLabel.style.display = 'block';
    payPerHitLabel.style.textAlign = 'right'; // Align the label to the right

    // Append the pay per hit label to the container
    container.appendChild(payPerHitLabel);

    // Find the element with role="main"
    const mainElement = document.querySelector('[role="main"]');

    // Append the container to the main element
    mainElement.appendChild(container);

    // Add dark theme styling
    const style = document.createElement('style');
    style.textContent = `
.dark-theme-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #333;
    color: #fff; /* Set font color to white */
    font-size: 16px; /* Increase font size for table text */
}
.dark-theme-table th, .dark-theme-table td {
    padding: 10px;
    border: 1px solid #555;
    color: #fff; /* Ensure font color is white for table cells */
    text-align: center; /* Center text in table cells */
}
.dark-theme-table th {
    background-color: #3a3a3a;
}
.dark-theme-table tr:nth-child(even) {
    background-color: #3a3a3a;
}
.dark-theme-table tr:hover {
    background-color: #555;
}
.input-form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}
.input-form input {
    padding: 5px;
    font-size: 14px;
    background-color: #333; /* Dark background */
    color: #fff; /* White font color */
    border: 1px solid #555; /* Border color */
}
label {
    font-size: 18px; /* Increase font size for labels */
    margin-bottom: 10px; /* Add space between labels */
    width: 100%; /* Ensure the label takes the full width */
}
@media (max-width: 600px) {
    .dark-theme-table th, .dark-theme-table td {
        padding: 5px;
        font-size: 12px;
    }
    .input-form {
        flex-direction: column;
    }
    .input-form input {
        margin-bottom: 10px;
    }
}
`;
    document.head.appendChild(style);

    // function to adjust they way the total winnings is divided where it calculates either faction costs or leadership pay when either of the inputs are changed and the remaining amount is divided among the members
    class adjustTotalWinnings {
        constructor(event) {
            const totalWinnings = parseFloat(totalWinningsInput.value || 0);
            const leadershipPayPercentage = parseFloat(leadershipPayInput.value || 0);
            const factionCostsPercentage = parseFloat(factionCostsInput.value || 0);

            if (leadershipPayPercentage + factionCostsPercentage > 100) {
                alert('The sum of Leadership Pay and Faction Costs percentages cannot exceed 100%');
                event.target.value = ''; // Clear the current value of the input
                return;
            }

            const input = this;
            input.value = ''; // Clear the current value of the input

            const leadershipPay = totalWinnings * (leadershipPayPercentage / 100);
            const factionCosts = totalWinnings * (factionCostsPercentage / 100);
            const totalAmountForMembers = totalWinnings - leadershipPay - factionCosts;

            //Calculate total hits excluding the attack counts of excluded members
            const totalHits = extractedData.reduce((sum, data) => {
                if (!excludedNames.includes(data.memberName)) {
                    return sum + data.attackCount;
                }
                return sum;
            }, 0);

            leadershipPayLabel.textContent = `Leadership Pay: $${leadershipPay.toFixed(2)}`;
            factionCostsLabel.textContent = `Faction Costs: $${factionCosts.toFixed(2)}`;

            let totalPaidToMembers = 0;
            let totalPPH = 0;
            tbody.querySelectorAll('tr').forEach((row, index) => {
                const attackCount = extractedData[index].attackCount;
                const payout = (attackCount / totalHits) * totalAmountForMembers;
                const pph = payout / attackCount;

                if (totalPPH !== pph) {
                    totalPPH = pph;
                    payPerHitLabel.textContent = `Pay Per Hit: $${pph.toFixed(2)}`;
                }

                totalPaidToMembers += payout;
                const payoutCell = row.cells[2];
                payoutCell.textContent = payout.toFixed(2);
            });

            totalPaidLabel.textContent = `Total Amount Paid to Members: $${totalPaidToMembers.toFixed(2)}`;
        }
    }


    // Update the table when the form inputs change
    leadershipPayInput.addEventListener('input', adjustTotalWinnings);

    // Update the table whenever the "Total Winnings" input changes
    totalWinningsInput.addEventListener('input', adjustTotalWinnings);

    // Update the table whenever the "Faction Costs" input changes
    factionCostsInput.addEventListener('input', adjustTotalWinnings);
})();