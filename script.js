// 2026 Investment Map interactive script

// Deep clone helper to avoid mutating original data
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Initial dataset defining themes, their descriptions, and default items
const initialData = {
  Stabilize: [
    {
      id: 'stabilize-dpf',
      name: 'Data & Platform Foundation',
      value:
        'Trusted, governed data & stable integrations. Fewer incidents, faster change, analytics‑ready datasets.',
      items: [
        {
          id: 'dpf-1',
          name: 'Snowflake & Matillion & Cloud & Datalab Support',
          value: 'Foundational data and pipelines',
          cost: 6.0,
          bau: false,
        },
      ],
    },
    {
      id: 'stabilize-cr',
      name: 'Compliance & Reporting Readiness (Reg Ops)',
      value:
        'Zero‑surprise compliance. Monthly SARS & PAYE at scale, lower remediation effort, audit‑ready lineage.',
      items: [
        {
          id: 'cr-1',
          name: 'SARS, PAYE & AML/FATCA uplift',
          value: 'Monthly reporting and compliance enhancements',
          cost: 6.3,
          bau: false,
        },
      ],
    },
    {
      id: 'stabilize-decom',
      name: 'Decommission & Simplify Estate',
      value:
        'Cut cost & complexity. Retire legacy (Xplan/FO), standardise on IG/RPP, fewer systems to support.',
      items: [
        {
          id: 'decom-1',
          name: 'Legacy retirement and consolidation',
          value: 'Remove dependencies on Xplan & Front Office',
          cost: 8.0,
          bau: false,
        },
      ],
    },
    {
      id: 'stabilize-omq',
      name: 'Operating Model & Quality',
      value:
        'Predictable delivery & run. Single UAT, clear ownership, DSP→BAU, faster & safer releases.',
      items: [
        {
          id: 'omq-1',
          name: 'UAT consolidation & DSP exit',
          value: 'Consolidate testing & enable BAU handover',
          cost: 2.5,
          bau: false,
        },
      ],
    },
  ],
  Enhance: [
    {
      id: 'enhance-channel',
      name: 'Channel Enablement (IG)',
      value:
        'Consistent, low‑friction comms. Governed templates, WA channel, adviser links; lower handling time & errors.',
      items: [
        {
          id: 'channel-1',
          name: 'Integrated channels & templates',
          value: 'Standardised comms via IG & WA',
          cost: 2.6,
          bau: false,
        },
      ],
    },
    {
      id: 'enhance-journey',
      name: 'Journey Simplification & Data Quality',
      value:
        'Cleaner data, fewer handoffs. IG↔MOM flows, in‑app auth, consent alignment, enhanced leads.',
      items: [
        {
          id: 'journey-1',
          name: 'Simplify flows & auth',
          value: 'Align IG and MOM processes',
          cost: 15.0,
          bau: false,
        },
      ],
    },
    {
      id: 'enhance-practice',
      name: 'Practice & CRM Uplift',
      value:
        'Smoother practice ops & insight. PM features, portfolio/plan in MOM, reporting hub; less swivel‑chair.',
      items: [
        {
          id: 'practice-1',
          name: 'Practice management & reporting',
          value: 'Enhance PM and CRM capabilities',
          cost: 8.0,
          bau: false,
        },
      ],
    },
    {
      id: 'enhance-training',
      name: 'Training & Self‑Help',
      value:
        'Deflect tickets & speed adoption. Standardised in‑app help, Digihelp & Service‑Guru support.',
      items: [
        {
          id: 'training-1',
          name: 'Self‑help tooling & content',
          value: 'Digihelp, Service Guru & Whatfix (BAU)',
          cost: 0.0,
          bau: true,
        },
      ],
    },
  ],
  Transform: [
    {
      id: 'transform-insight',
      name: 'Insight‑Led Decisioning',
      value:
        'Decisions at the speed of question. NLP search, AI insights to frontline; self‑serve adoption.',
      items: [
        {
          id: 'insight-1',
          name: 'ThoughtSpot & AI Insights',
          value: 'Deploy ThoughtSpot & AI‑augmented analytics',
          cost: 2.1,
          bau: false,
        },
      ],
    },
    {
      id: 'transform-privacy',
      name: 'Privacy‑Safe Data Collaboration',
      value:
        'Richer targeting without risk. Compliant sharing, audience enrichment, model‑ready data.',
      items: [
        {
          id: 'privacy-1',
          name: 'Omnisient Platform',
          value: 'Implement secure data collaboration',
          cost: 1.5,
          bau: false,
        },
      ],
    },
    {
      id: 'transform-reviews',
      name: 'Always‑On Digital Reviews',
      value:
        'Persistent advice loop. WA‑scheduled reviews, next‑best action, higher completion.',
      items: [
        {
          id: 'reviews-1',
          name: 'WA‑based annual reviews',
          value: 'Implement digital review journeys',
          cost: 2.5,
          bau: false,
        },
      ],
    },
    {
      id: 'transform-shifts',
      name: 'Strategic Platform Shifts',
      value:
        'Simpler strategic stack. IG‑centred FNA replacing legacy; integrated journeys; big‑ticket savings.',
      items: [
        {
          id: 'shifts-1',
          name: 'Platform consolidation & FNA shift',
          value: 'IG‑centred FNA & integrated journeys',
          cost: 20.0,
          bau: false,
        },
      ],
    },
  ],
};

// State: clone initial data so we can mutate
let data = deepClone(initialData);
let activeTab = 'Overview';

// DOM elements
const contentEl = document.getElementById('content');
const tabButtons = document.querySelectorAll('.tab');

// Helper to calculate theme total (sum of cost of non‑BAU items)
function calculateThemeTotal(theme) {
  return theme.items.reduce((sum, item) => {
    return sum + (item.bau ? 0 : Number(item.cost || 0));
  }, 0);
}

// Helper to calculate horizon total
function calculateHorizonTotal(horizonName) {
  const themes = data[horizonName] || [];
  return themes.reduce((sum, theme) => sum + calculateThemeTotal(theme), 0);
}

// Update totals in data (not persisted but for convenience)
function updateTotals() {
  // Nothing to persist: totals computed on the fly
}

// Render the entire view based on activeTab
function render() {
  contentEl.innerHTML = '';
  if (activeTab === 'Overview') {
    renderOverview();
  } else {
    renderHorizon(activeTab);
  }
}

// Render the overview tab: show summary cards and all themes
function renderOverview() {
  // Summary row for each horizon
  const summaryRow = document.createElement('div');
  summaryRow.className = 'summary-row';
  ['Stabilize', 'Enhance', 'Transform'].forEach((horizon) => {
    const summaryCard = document.createElement('div');
    summaryCard.className = 'summary-card';
    const title = document.createElement('div');
    title.className = 'summary-title';
    title.textContent = horizon;
    const total = document.createElement('div');
    total.className = 'summary-total';
    total.textContent = `R${calculateHorizonTotal(horizon).toFixed(1)}m`;
    summaryCard.appendChild(title);
    summaryCard.appendChild(total);
    summaryRow.appendChild(summaryCard);
  });
  contentEl.appendChild(summaryRow);

  // Grid of all theme cards
  const grid = document.createElement('div');
  grid.className = 'theme-grid';
  ['Stabilize', 'Enhance', 'Transform'].forEach((horizon) => {
    data[horizon].forEach((theme) => {
      const card = createThemeCard(horizon, theme);
      grid.appendChild(card);
    });
  });
  contentEl.appendChild(grid);
}

// Render a specific horizon tab
function renderHorizon(horizonName) {
  const themes = data[horizonName];
  if (!themes) return;
  // Grid of theme cards
  const grid = document.createElement('div');
  grid.className = 'theme-grid';
  themes.forEach((theme) => {
    grid.appendChild(createThemeCard(horizonName, theme));
  });
  contentEl.appendChild(grid);
  // Horizon total at bottom
  const totalEl = document.createElement('div');
  totalEl.className = 'horizon-total';
  totalEl.innerHTML = `${horizonName} total: <span>R${calculateHorizonTotal(
    horizonName
  ).toFixed(1)}m</span>`;
  contentEl.appendChild(totalEl);
}

// Creates a card DOM element for a theme
function createThemeCard(horizonName, theme) {
  const card = document.createElement('div');
  card.className = 'theme-card';
  // Determine if expanded: store in property for toggling
  card.dataset.expanded = 'false';
  // Header row
  const header = document.createElement('div');
  header.className = 'theme-header';
  // Left side: arrow and title
  const left = document.createElement('div');
  left.className = 'theme-header-left';
  const toggleIcon = document.createElement('span');
  toggleIcon.className = 'toggle';
  left.appendChild(toggleIcon);
  const title = document.createElement('span');
  title.className = 'theme-title';
  title.textContent = theme.name;
  left.appendChild(title);
  header.appendChild(left);
  // Right side: total
  const totalSpan = document.createElement('span');
  totalSpan.className = 'theme-total';
  totalSpan.textContent = `R${calculateThemeTotal(theme).toFixed(1)}m`;
  header.appendChild(totalSpan);
  card.appendChild(header);
  // Value / description paragraph
  const valueEl = document.createElement('p');
  valueEl.className = 'theme-value';
  valueEl.textContent = theme.value;
  card.appendChild(valueEl);
  // Container for items; hidden by default
  const itemsContainer = document.createElement('div');
  itemsContainer.style.display = 'none';
  // Build table of items
  const table = document.createElement('table');
  table.className = 'items-table';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Initiative', 'Value', 'Cost (Rm)', 'BAU', ''].forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  // Populate rows
  theme.items.forEach((item) => {
    tbody.appendChild(createItemRow(horizonName, theme, item, totalSpan));
  });
  table.appendChild(tbody);
  itemsContainer.appendChild(table);
  // Add row button
  const footer = document.createElement('div');
  footer.className = 'items-footer';
  const addBtn = document.createElement('button');
  addBtn.className = 'add-row-btn';
  addBtn.textContent = '+ Add initiative';
  addBtn.addEventListener('click', () => {
    const newItem = {
      id: Date.now().toString(),
      name: '',
      value: '',
      cost: 0,
      bau: false,
    };
    theme.items.push(newItem);
    tbody.appendChild(createItemRow(horizonName, theme, newItem, totalSpan));
    updateView();
  });
  footer.appendChild(addBtn);
  itemsContainer.appendChild(footer);
  card.appendChild(itemsContainer);
  // Click handler to toggle
  header.addEventListener('click', () => {
    const expanded = card.dataset.expanded === 'true';
    if (expanded) {
      card.dataset.expanded = 'false';
      card.classList.remove('expanded');
      itemsContainer.style.display = 'none';
    } else {
      card.dataset.expanded = 'true';
      card.classList.add('expanded');
      itemsContainer.style.display = 'block';
    }
  });
  return card;
}

// Creates a row for an item with editing & deletion
function createItemRow(horizonName, theme, item, totalSpan) {
  const row = document.createElement('tr');
  // Initiative name
  const nameTd = document.createElement('td');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.value = item.name;
  nameInput.addEventListener('input', () => {
    item.name = nameInput.value;
  });
  nameTd.appendChild(nameInput);
  row.appendChild(nameTd);
  // Value
  const valueTd = document.createElement('td');
  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.value = item.value;
  valueInput.addEventListener('input', () => {
    item.value = valueInput.value;
  });
  valueTd.appendChild(valueInput);
  row.appendChild(valueTd);
  // Cost
  const costTd = document.createElement('td');
  const costInput = document.createElement('input');
  costInput.type = 'number';
  costInput.min = '0';
  costInput.step = '0.1';
  costInput.value = item.cost;
  costInput.addEventListener('input', () => {
    const val = parseFloat(costInput.value);
    item.cost = isNaN(val) ? 0 : val;
    // update theme total and horizon totals
    totalSpan.textContent = `R${calculateThemeTotal(theme).toFixed(1)}m`;
    updateTotalsView();
  });
  costTd.appendChild(costInput);
  row.appendChild(costTd);
  // BAU
  const bauTd = document.createElement('td');
  const bauInput = document.createElement('input');
  bauInput.type = 'checkbox';
  bauInput.checked = item.bau;
  bauInput.addEventListener('change', () => {
    item.bau = bauInput.checked;
    totalSpan.textContent = `R${calculateThemeTotal(theme).toFixed(1)}m`;
    updateTotalsView();
  });
  bauTd.appendChild(bauInput);
  row.appendChild(bauTd);
  // Delete button
  const deleteTd = document.createElement('td');
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.innerHTML = '×';
  delBtn.title = 'Delete initiative';
  delBtn.addEventListener('click', () => {
    // Remove item from theme
    const idx = theme.items.indexOf(item);
    if (idx > -1) theme.items.splice(idx, 1);
    row.remove();
    totalSpan.textContent = `R${calculateThemeTotal(theme).toFixed(1)}m`;
    updateTotalsView();
  });
  deleteTd.appendChild(delBtn);
  row.appendChild(deleteTd);
  return row;
}

// Update horizon totals and summary cards
function updateTotalsView() {
  // Update summary cards if in overview
  if (activeTab === 'Overview') {
    // Re-render summary row totals
    const summaryTotals = document.querySelectorAll('.summary-total');
    ['Stabilize', 'Enhance', 'Transform'].forEach((horizon, idx) => {
      summaryTotals[idx].textContent = `R${calculateHorizonTotal(horizon).toFixed(
        1
      )}m`;
    });
  }
  // Update horizon total text if in horizon view
  const totalEl = document.querySelector('.horizon-total span');
  if (totalEl) {
    totalEl.textContent = `R${calculateHorizonTotal(activeTab).toFixed(1)}m`;
  }
}

// Update view after any change: re-render all
function updateView() {
  render();
}

// Event listeners for tab buttons
tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Remove active class
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab;
    render();
  });
});

// Initial render
render();