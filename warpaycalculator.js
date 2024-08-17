// ==UserScript== 
// @name         War Payment Calculator
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  try to take over the world!
// @author       Scolli03 [3150751]
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL  https://raw.githubusercontent.com/Scolli03/WarPayCalculator/main/warpaycalculator.js
// @updateURL    https://raw.githubusercontent.com/Scolli03/WarPayCalculator/main/warpaycalculator.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==
/* global $, waitForKeyElements */

waitForKeyElements('html body#body.d.body.webp-support.r.regular.with-sidebar.dark-mode div.content.responsive-sidebar-container.logged-in div#mainContainer.container div.content-wrapper.summer div#react-root div div.rankReportWrap___xjAui.chain.chain-report-wrap.war-report-wrap div.f-war-list.war-new div.desc-wrap div.faction-war.membersWrap___NbYLx div.tab-menu-cont.cont-gray.bottom-round.tabMenuCont___v65Yc.your-faction.profile-mode.right div.members-cont.membersCont___USwcq.profileMode___Ypqwo', 
function loadpaytable() {
    
    'use strict';
    // Select the initial element using the provided CSS selector
    const yourFactionTable = document.querySelector('html body#body.d.body.webp-support.r.regular.with-sidebar.dark-mode div.content.responsive-sidebar-container.logged-in div#mainContainer.container div.content-wrapper.summer div#react-root div div.rankReportWrap___xjAui.chain.chain-report-wrap.war-report-wrap div.f-war-list.war-new div.desc-wrap div.faction-war.membersWrap___NbYLx div.tab-menu-cont.cont-gray.bottom-round.tabMenuCont___v65Yc.your-faction.profile-mode.right div.members-cont.membersCont___USwcq.profileMode___Ypqwo');

    // Find the unordered list within this element
    const ulElement = yourFactionTable.querySelector('ul.members-list');

    // Get all list items within the unordered list
    const listItems = ulElement.querySelectorAll('li.your');

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

    const factionCostsLabel = document.createElement('label');
    factionCostsLabel.textContent = 'Faction Costs: $0.00';
    factionCostsLabel.style.display = 'block';

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

    // Function to update the payouts and labels
    function updatePayouts() {
        const totalWinnings = parseFloat(totalWinningsInput.value || 0);
        const leadershipPay = totalWinnings * 0.30;
        const factionCosts = totalWinnings * 0.20;
        const totalAmountForMembers = totalWinnings * 0.50; // Assuming 50% for members

        // Calculate total hits excluding the attack counts of excluded members
        const totalHits = extractedData.reduce((sum, data) => {
            if (!excludedNames.includes(data.memberName)) {
                return sum + data.attackCount;
            }
            return sum;
        }, 0);

        leadershipPayLabel.textContent = `Leadership Pay: $${leadershipPay.toFixed(2)}`;
        factionCostsLabel.textContent = `Faction Costs: $${factionCosts.toFixed(2)}`;

        let totalPaidToMembers = 0;

        tbody.querySelectorAll('tr').forEach((row, index) => {
            const attackCount = extractedData[index].attackCount;
            const payout = (attackCount / totalHits) * totalAmountForMembers;
            totalPaidToMembers += payout;
            const payoutCell = row.cells[2];
            payoutCell.textContent = payout.toFixed(2);
        });

        totalPaidLabel.textContent = `Total Amount Paid to Members: $${totalPaidToMembers.toFixed(2)}`;
    }

    // Update the table whenever the "Total Winnings" input changes
    totalWinningsInput.addEventListener('input', updatePayouts);
})();