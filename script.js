// Initialize variables
let tickets = localStorage.getItem('tickets') ? parseInt(localStorage.getItem('tickets')) : 0;
let pityCounter = localStorage.getItem('pityCounter') ? parseInt(localStorage.getItem('pityCounter')) : 80;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let currentPage = 1;

// DOM Elements
const ticketCountDisplay = document.getElementById('ticketCount');
const pityCounterDisplay = document.getElementById('pityCounter');
const pullResultsList = document.getElementById('pullResults');
const inventoryList = document.getElementById('inventoryList');
const inventoryPages = document.getElementById('inventoryPages');

// Update UI
function updateUI() {
  ticketCountDisplay.textContent = tickets;
  pityCounterDisplay.textContent = pityCounter;
  renderPullResults();
  renderInventory();
}

// Get Random Item with Pity System
function getRandomItem() {
  const items = [
    { name: 'Sticker', rarity: 'N-', chance: 0.75 },
    { name: 'Phone Strap', rarity: 'R-', chance: 0.24 },
    { name: 'Keychain', rarity: 'SR-', chance: 0.01 },
  ];

  // Check if pity is triggered
  if (pityCounter === 0) {
    pityCounter = 80; // Reset pity counter
    return 'Keychain';
  }

  // Roll for random item
  let roll = Math.random();
  let cumulativeChance = 0;

  for (const item of items) {
    cumulativeChance += item.chance;
    if (roll < cumulativeChance) {
      if (item.rarity === 'SR-') {
        pityCounter = 80; // Reset pity counter for Super Rare items
      } else {
        pityCounter -= 1; // Decrease pity counter for other items
      }
      return `${item.rarity} ${item.name}`;
    }
  }
}

// Single Pull
document.getElementById('singlePull').addEventListener('click', () => {
  if (tickets >= 1) {
    tickets -= 1;
    const item = getRandomItem();
    inventory.push(item);
    pullResultsList.innerHTML = `<li>${item}</li>`; // Show result

    // Save to localStorage
    localStorage.setItem('tickets', tickets);
    localStorage.setItem('pityCounter', pityCounter);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    updateUI();
  } else {
    alert('Not enough tickets!');
  }
});

// 10-Pull
document.getElementById('tenPull').addEventListener('click', () => {
  if (tickets >= 10) {
    tickets -= 10;
    pullResultsList.innerHTML = ''; // Clear previous results
    for (let i = 0; i < 10; i++) {
      const item = getRandomItem();
      inventory.push(item);
      pullResultsList.innerHTML += `<li>${item}</li>`; // Show results
    }

    // Save to localStorage
    localStorage.setItem('tickets', tickets);
    localStorage.setItem('pityCounter', pityCounter);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    updateUI();
  } else {
    alert('Not enough tickets!');
  }
});

// Add Single Pull Ticket
document.getElementById('addSingleTicket').addEventListener('click', () => {
  tickets += 1;
  localStorage.setItem('tickets', tickets);
  updateUI();
});

// Add 10-Pull Ticket
document.getElementById('addTenTicket').addEventListener('click', () => {
  tickets += 10;
  localStorage.setItem('tickets', tickets);
  updateUI();
});

// Reset Pity
document.getElementById('resetPity').addEventListener('click', () => {
  pityCounter = 80;
  localStorage.setItem('pityCounter', pityCounter);
  updateUI();
});

// Reset All Data
document.getElementById('resetAll').addEventListener('click', () => {
  tickets = 0;
  pityCounter = 80;
  inventory = [];
  currentPage = 1;

  // Clear localStorage
  localStorage.clear();

  updateUI();
});

// Render Pull Results
function renderPullResults() {
  // Already handled in pull logic
}

// Render Inventory with Pagination
function renderInventory() {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Display current page's items
  inventoryList.innerHTML = inventory.slice(startIndex, endIndex)
    .map(item => `<li>${item}</li>`)
    .join('');

  // Generate pagination buttons
  inventoryPages.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.onclick = () => {
      currentPage = i;
      renderInventory();
    };
    inventoryPages.appendChild(button);
  }
}

// Initial UI Update
updateUI();