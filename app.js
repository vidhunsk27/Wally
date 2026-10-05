// ==============================================================================
// 1. SYSTEM INITIALIZATION & PLUGINS
// ==============================================================================
let iconTimeout;
function renderIcons() {
    clearTimeout(iconTimeout);
    iconTimeout = setTimeout(() => {
        try {
            if (typeof lucide !== 'undefined') lucide.createIcons();
        } catch(e) {}
    }, 50);
}

try { 
    renderIcons(); 
    if (typeof ChartDataLabels !== 'undefined' && typeof Chart !== 'undefined') {
        Chart.register(ChartDataLabels); 
        Chart.defaults.plugins.datalabels.display = false; 
    }
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#9ca3af'; 
        Chart.defaults.font.family = 'Fredoka'; 
        Chart.defaults.borderColor = 'rgba(255,255,255,0.05)'; 
    }
} catch(e) {
    console.warn("Chart Plugins initializing safely.");
}

// Safely handles both localhost server booting and direct file:// double-click testing
const isLocal = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1') || window.location.protocol === 'file:';
const API_BASE = isLocal ? 'http://localhost:3000/api' : '/api';
const apiHeaders = { 'Content-Type': 'application/json' };

// Safe JSON Parser to prevent fatal cache crashes
function safeGetJSON(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch(e) {
        return fallback;
    }
}

// ==============================================================================
// 2. RAW DATA SEED & ZERO-CREDIT MIGRATION
// ==============================================================================
const rawData = '[{"i":"1786233600000","t":"e","a":460.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1786233600000},{"i":"1786147200001","t":"e","a":418.75,"ac":"UPI","c":"Groceries","n":"","ts":1786147200000},{"i":"1786147200002","t":"e","a":95.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1786147200000},{"i":"1786147200003","t":"e","a":719.0,"ac":"UPI","c":"Subscriptions","n":"","ts":1786147200000},{"i":"1786147200004","t":"e","a":55.0,"ac":"UPI","c":"Groceries","n":"","ts":1786147200000},{"i":"1786147200005","t":"e","a":65.0,"ac":"UPI","c":"Transport","n":"","ts":1786147200000},{"i":"1786060800006","t":"e","a":163.0,"ac":"UPI","c":"Groceries","n":"","ts":1786060800000},{"i":"1785974400007","t":"e","a":130.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785974400000},{"i":"1785801600008","t":"e","a":240.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785801600000},{"i":"1785715200009","t":"i","a":39.84,"ac":"UPI","c":"Other","n":"","ts":1785715200000},{"i":"1785715200010","t":"e","a":115.0,"ac":"UPI","c":"Groceries","n":"","ts":1785715200000},{"i":"1785715200011","t":"e","a":161.72,"ac":"UPI","c":"Food & Dining","n":"","ts":1785715200000},{"i":"1785628800012","t":"e","a":64.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800013","t":"e","a":32.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800014","t":"e","a":16.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800015","t":"i","a":35.0,"ac":"UPI","c":"Other","n":"","ts":1785628800000},{"i":"1785628800016","t":"e","a":125.0,"ac":"UPI","c":"Groceries","n":"","ts":1785628800000},{"i":"1785628800017","t":"e","a":13.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800018","t":"e","a":35.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800019","t":"e","a":23.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785628800020","t":"e","a":27.0,"ac":"UPI","c":"Transport","n":"","ts":1785628800000},{"i":"1785542400021","t":"e","a":9750.0,"ac":"UPI","c":"Rent","n":"","ts":1785542400000},{"i":"1785542400022","t":"e","a":131.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785542400000},{"i":"1785542400023","t":"e","a":20000.0,"ac":"UPI","c":"Other","n":"","ts":1785542400000},{"i":"1785542400024","t":"i","a":50080.0,"ac":"UPI","c":"Salary","n":"","ts":1785542400000},{"i":"1785369600025","t":"e","a":165.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785369600000},{"i":"1785369600026","t":"e","a":167.72,"ac":"UPI","c":"Food & Dining","n":"","ts":1785369600000},{"i":"1785283200027","t":"e","a":198.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785283200000},{"i":"1785283200028","t":"e","a":153.0,"ac":"Credit Card","c":"Shopping","n":"Amazon India","ts":1785283200000},{"i":"1785196800029","t":"e","a":50.0,"ac":"UPI","c":"Groceries","n":"","ts":1785196800000},{"i":"1785110400030","t":"e","a":120.0,"ac":"UPI","c":"Groceries","n":"","ts":1785110400000},{"i":"1785110400031","t":"e","a":511.97,"ac":"Credit Card","c":"Entertainment","n":"","ts":1785110400000},{"i":"1785024000032","t":"e","a":421.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785024000000},{"i":"1785024000033","t":"e","a":35.0,"ac":"UPI","c":"Groceries","n":"","ts":1785024000000},{"i":"1785024000034","t":"e","a":164.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1785024000000},{"i":"1784937600035","t":"e","a":60.0,"ac":"UPI","c":"Groceries","n":"","ts":1784937600000},{"i":"1784937600036","t":"e","a":127.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784937600000},{"i":"1784764800037","t":"e","a":80.0,"ac":"UPI","c":"Groceries","n":"","ts":1784764800000},{"i":"1784678400038","t":"e","a":120.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784678400000},{"i":"1784678400039","t":"e","a":60.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784678400000},{"i":"1784592000040","t":"e","a":144.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784592000000},{"i":"1784592000041","t":"i","a":2800.0,"ac":"UPI","c":"Refund","n":"","ts":1784592000000},{"i":"1784592000042","t":"e","a":30.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784592000000},{"i":"1784505600043","t":"e","a":15.0,"ac":"UPI","c":"Groceries","n":"","ts":1784505600000},{"i":"1784505600044","t":"e","a":45.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784505600000},{"i":"1784419200045","t":"e","a":289.0,"ac":"UPI","c":"Groceries","n":"","ts":1784419200000},{"i":"1784419200046","t":"e","a":167.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784419200000},{"i":"1784419200047","t":"e","a":60.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784419200000},{"i":"1784332800048","t":"e","a":665.0,"ac":"Debit Card","c":"Electricity charges","n":"","ts":1784332800000},{"i":"1784332800049","t":"e","a":60.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1784332800000},{"i":"1784332800050","t":"e","a":35.0,"ac":"UPI","c":"Groceries","n":"THANGAM FRUITS AND VEGETABLES","ts":1784332800000},{"i":"1784332800051","t":"e","a":40.0,"ac":"UPI","c":"Transport","n":"METROPOLITAN TRANSPORT","ts":1784332800000},{"i":"1784332800052","t":"e","a":23.0,"ac":"UPI","c":"Other","n":"Cumta info","ts":1784332800000},{"i":"1784332800053","t":"i","a":62.0,"ac":"UPI","c":"Other","n":"SHIVAYOGESHJ","ts":1784332800000},{"i":"1784332800054","t":"e","a":32.0,"ac":"UPI","c":"Transport","n":"Rapido","ts":1784332800000},{"i":"1784332800055","t":"e","a":32.0,"ac":"UPI","c":"Transport","n":"Rapido","ts":1784332800000},{"i":"1784332800056","t":"e","a":206.0,"ac":"UPI","c":"Entertainment","n":"MOHAMED IMRAN FAREET","ts":1784332800000},{"i":"1784332800057","t":"e","a":681.17,"ac":"Credit Card","c":"Food & Dining","n":"Dominos Pizza","ts":1784332800000},{"i":"1784332800058","t":"e","a":10.0,"ac":"UPI","c":"Transport","n":"Indian Railway","ts":1784332800000},{"i":"1784332800059","t":"e","a":20.0,"ac":"UPI","c":"Other","n":"SHIVAYOGESH J","ts":1784332800000},{"i":"1784332800060","t":"e","a":13.0,"ac":"UPI","c":"Transport","n":"","ts":1784332800000},{"i":"1784332800061","t":"e","a":33.0,"ac":"UPI","c":"Transport","n":"","ts":1784332800000},{"i":"1784332800062","t":"e","a":5.0,"ac":"UPI","c":"Transport","n":"","ts":1784332800000},{"i":"1784246400063","t":"e","a":1654.0,"ac":"Credit Card","c":"Shopping","n":"Amazon India","ts":1784246400000},{"i":"1784246400064","t":"e","a":60.0,"ac":"UPI","c":"Groceries","n":"","ts":1784246400000},{"i":"1783987200065","t":"e","a":105.0,"ac":"UPI","c":"Food & Dining","n":"SWIGGY","ts":1783987200000},{"i":"1783900800066","t":"e","a":60.0,"ac":"UPI","c":"Groceries","n":"","ts":1783900800000},{"i":"1783814400067","t":"e","a":150.0,"ac":"UPI","c":"Other","n":"Haircut","ts":1783814400000},{"i":"1783728000068","t":"e","a":20000.0,"ac":"Debit Card","c":"Other","n":"","ts":1783728000000},{"i":"1783555200069","t":"e","a":211.0,"ac":"UPI","c":"Food & Dining","n":"Swiggy Ltd","ts":1783555200000},{"i":"1783468800070","t":"e","a":992.25,"ac":"Credit Card","c":"Transport","n":"AbhiBus","ts":1783468800000},{"i":"1783468800071","t":"e","a":894.0,"ac":"Credit Card","c":"Transport","n":"ABHIBUS COM","ts":1783468800000},{"i":"1783382400072","t":"e","a":30.0,"ac":"UPI","c":"Food & Dining","n":"THANGAM FRUITS AND VEGETABLES","ts":1783382400000},{"i":"1783382400073","t":"e","a":115.0,"ac":"UPI","c":"Food & Dining","n":"Swiggy Ltd","ts":1783382400000},{"i":"1783382400074","t":"e","a":11.0,"ac":"UPI","c":"Other","n":"","ts":1783382400000},{"i":"1783382400075","t":"e","a":10.0,"ac":"UPI","c":"Other","n":"","ts":1783382400000},{"i":"1783382400076","t":"e","a":35.0,"ac":"UPI","c":"Groceries","n":"THANGAM FRUITS AND VEGETABLES","ts":1783382400000},{"i":"1783209600077","t":"e","a":128.0,"ac":"UPI","c":"Food & Dining","n":"SWIGGY","ts":1783209600000},{"i":"1783209600078","t":"e","a":595.0,"ac":"UPI","c":"Food & Dining","n":"SWIGGY","ts":1783209600000},{"i":"1783209600079","t":"e","a":147.0,"ac":"UPI","c":"Groceries","n":"","ts":1783209600000},{"i":"1783123200080","t":"e","a":3250.0,"ac":"UPI","c":"Rent","n":"","ts":1783123200000},{"i":"1783123200081","t":"e","a":110.0,"ac":"UPI","c":"Groceries","n":"","ts":1783123200000},{"i":"1783036800082","t":"e","a":255.0,"ac":"UPI","c":"Food & Dining","n":"","ts":1783036800000},{"i":"1782950400083","t":"e","a":134.0,"ac":"UPI","c":"Other","n":"","ts":1782950400000},{"i":"1782950400084","t":"e","a":20.0,"ac":"UPI","c":"Groceries","n":"","ts":1782950400000},{"i":"1782864000085","t":"i","a":51091.0,"ac":"UPI","c":"Salary","n":"","ts":1782864000000},{"i":"1782864000086","t":"e","a":40.0,"ac":"UPI","c":"Groceries","n":"","ts":1782864000000},{"i":"1782864000087","t":"e","a":122.0,"ac":"UPI","c":"Food & Dining","n":"SWIGGY","ts":1782864000000}]';

let seedTransactions = [];
try {
    seedTransactions = JSON.parse(rawData).map(t => {
        let acct = t.ac || 'UPI';
        if (acct === 'Credit Card' || acct === 'Debit Card') acct = 'UPI';
        return { 
            id: String(t.i), 
            type: t.t === 'e' ? 'expense' : 'income', 
            amount: Number(t.a) || 0, 
            account: acct, 
            category: t.c || 'Other', 
            note: t.n || '', 
            timestamp: Number(t.ts) || Date.now(), 
            isRecurring: false 
        };
    });
} catch(e) {}

// ==============================================================================
// 3. GLOBAL STATE VARIABLES
// ==============================================================================
const LOCAL_TX_KEY = 'walletTransactionsBackupV2';
let transactions = []; 
let wishlistItems = []; 
let mediaItems = []; 
let deletedQueue = []; 
let growthItems = []; 
let customHabits = [];
let habitHistory = {};

let monthlyBudgets = { 'default': 25000 }; 
let ccLimit = 50000; 
let monthlyWishlistSavings = 0; 
let autoEmergencyFundAmt = 0;
let stagedCSVTransactions = [];

let currentType = 'expense'; 
let selectedMonth = 'all'; 
let searchQuery = ''; 
let currentFilter = 'all'; 
let currentChartIdx = 0; 
let statsChartIdx = 0;

let donutChart, lineChart, radarChart, cashflowChart, weeklyRhythmChart, allMonthsChart, monthlyTrendChart, accountChart, savingsTrendChartObj, burnChartObj, polarChartObj;
let expandedChartObj = null, allTimeChartObj = null, reportCharts = {};

let wishScrapeController = null;
let mediaScrapeController = null;
let aiTypingTimer = null; 
let mediaViewMode = 'grid';

let wbHistory = []; 
let currentTool = 'pen'; 
let penColor = '#ffffff'; 
let penWidth = 2; 
let isTextMode = false; 
let isDrawing = false; 
let startX, startY, savedImageData;

// ==============================================================================
// 4. CORE INITIALIZATION
// ==============================================================================
function init() {
    try { forceCleanSystemState(); } catch(e) {}
    try { populateCategories(); } catch(e) {}
    
    try {
        const dateInput = document.getElementById('date');
        if (dateInput) dateInput.valueAsDate = new Date();
    } catch(e) {}
    
    try { initCharts(); } catch(e) { console.error("Chart Init Failed", e); }
    try { checkAutoEmergencyFund(); } catch(e) {}
    try { updateUI(); } catch(e) { console.error("Update UI Failed", e); }
    try { updateChartStack(); } catch(e) {}
    try { updateStatsStack(); } catch(e) {}
    try { updateUndoBtn(); } catch(e) {}
    
    try {
        const savedTimetable = localStorage.getItem('walletGrowthTimetable');
        if (savedTimetable && document.getElementById('growthTimetable')) {
            document.getElementById('growthTimetable').value = savedTimetable;
        }
    } catch(e) {}
    
    try { renderGrowthList(); } catch(e) {}
    try { renderWishlist(); } catch(e) {}
    try { renderMedia(); } catch(e) {}
    try { loadHabits(); } catch(e) {}
    
    try { syncDataFromServer(); } catch(e) {}
    try { loadWorkspace(); } catch(e) {}
    try { setupEventListeners(); } catch(e) {}
    
    setTimeout(() => { try { initWhiteboard(); } catch(e) {} }, 200);
}

// ==============================================================================
// 5. GLOBAL EVENT DELEGATED TOOLTIP ENGINE (Fixing capitalization bug)
// ==============================================================================
function showTooltipForIcon(icon) {
    const infoText = icon.getAttribute('data-info');
    if (!infoText) return;
    
    let tooltipEl = document.getElementById('globalTooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'globalTooltip';
        document.body.appendChild(tooltipEl);
    }
    
    // Explicitly enforce normal text case rendering
    tooltipEl.innerHTML = infoText;
    tooltipEl.style.display = 'block';
    tooltipEl.style.visibility = 'hidden';
    tooltipEl.style.textTransform = 'none'; // Overriding CSS if needed
    
    void tooltipEl.offsetWidth;
    
    const iconRect = icon.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    
    let left = iconRect.left + (iconRect.width / 2);
    const halfWidth = tooltipRect.width / 2;
    
    if (left - halfWidth < 12) left = halfWidth + 12;
    else if (left + halfWidth > window.innerWidth - 12) left = window.innerWidth - 12 - halfWidth;
    
    let top, transform;
    if (iconRect.top - tooltipRect.height - 15 < 10) {
        top = iconRect.bottom + 10;
        transform = 'translate(-50%, 0)';
    } else {
        top = iconRect.top - 10;
        transform = 'translate(-50%, -100%)';
    }
    
    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.transform = transform;
    tooltipEl.style.visibility = 'visible';
    tooltipEl.style.opacity = '1';
    tooltipEl.style.zIndex = '2147483647';
}

function hideTooltip() {
    const tooltipEl = document.getElementById('globalTooltip');
    if (tooltipEl) {
        tooltipEl.style.opacity = '0';
        tooltipEl.style.visibility = 'hidden';
    }
}

document.addEventListener('mouseover', function(e) {
    const icon = e.target.closest('.info-icon');
    if (icon) showTooltipForIcon(icon);
});

document.addEventListener('mouseout', function(e) {
    const icon = e.target.closest('.info-icon');
    if (icon) hideTooltip();
});

// ==============================================================================
// 6. EVENT LISTENERS
// ==============================================================================
function setupEventListeners() {
    const txForm = document.getElementById('transactionForm');
    if (txForm) {
        txForm.addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            const amt = parseFloat(document.getElementById('amount').value); 
            if (!amt) return; 
            
            const d = new Date(document.getElementById('date').value); 
            d.setHours(new Date().getHours()); 
            const isRecurringCheck = document.getElementById('isRecurring');
            
            const newTx = { 
                id: String(Date.now()), 
                type: currentType, 
                amount: amt, 
                account: document.getElementById('account').value, 
                category: document.getElementById('category').value, 
                note: document.getElementById('note').value, 
                timestamp: d.getTime(), 
                isRecurring: isRecurringCheck ? isRecurringCheck.checked : false
            }; 
            
            transactions.push(newTx); 
            saveTransactionsLocally(); 
            
            document.getElementById('amount').value = ''; 
            document.getElementById('note').value = ''; 
            if (isRecurringCheck) isRecurringCheck.checked = false; 
            
            updateUI(); 
            try { 
                await fetch(`${API_BASE}/add-transaction`, { 
                    method: 'POST', headers: apiHeaders, body: JSON.stringify(newTx) 
                }); 
            } catch(err) {} 
        });
    }

    const wForm = document.getElementById('wishlistForm');
    if (wForm) {
        wForm.addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            const btn = e.target.querySelector('button[type="submit"]'); 
            const orig = btn.innerText; 
            btn.innerText = "Saving..."; 
            btn.disabled = true; 
            
            const linkVal = document.getElementById('wishLink').value;
            let fallbackCategory = 'MANUAL';
            try {
                if (linkVal) fallbackCategory = new URL(linkVal).hostname.replace('www.', '').split('.')[0].toUpperCase();
            } catch(err) {}

            const newItem = { 
                id: String(Date.now()), 
                title: document.getElementById('wishName').value, 
                price: parseFloat(document.getElementById('wishPrice').value) || 0, 
                link: linkVal, 
                imageUrl: document.getElementById('wishImage').value, 
                category: fallbackCategory, 
                wishCategory: document.getElementById('wishCategory').value, 
                timestamp: Date.now() 
            }; 
            
            wishlistItems.push(newItem); 
            saveWishlistLocally(); 
            e.target.reset(); 
            renderWishlist(); 
            
            try { 
                await fetch(`${API_BASE}/add-wishlist`, { 
                    method: 'POST', headers: apiHeaders, body: JSON.stringify(newItem) 
                }); 
            } catch (err) {} 
            finally { btn.innerText = orig; btn.disabled = false; } 
        });
    }

    const mForm = document.getElementById('mediaForm');
    if (mForm) {
        mForm.addEventListener('submit', async (e) => { 
            e.preventDefault(); 
            const btn = e.target.querySelector('button[type="submit"]'); 
            const orig = btn.innerText; 
            btn.innerText = "SAVING..."; 
            btn.disabled = true; 
            
            const statusVal = document.getElementById('mediaStatus').value;
            const ratingVal = statusVal === 'Completed' ? document.getElementById('mediaRating').value : 'Unrated';
            
            const newItem = { 
                id: String(Date.now()), 
                title: document.getElementById('mediaName').value, 
                price: parseFloat(document.getElementById('mediaPrice').value) || 0, 
                link: document.getElementById('mediaLink').value, 
                imageUrl: document.getElementById('mediaImage').value, 
                category: 'MEDIA NODE', 
                wishCategory: document.getElementById('mediaType').value, 
                mediaGenre: document.getElementById('mediaGenre').value, 
                mediaStatus: statusVal, 
                mediaRating: ratingVal, 
                mediaDetails: document.getElementById('mediaDetails').value || '', 
                isMedia: true, 
                timestamp: Date.now() 
            }; 
            
            mediaItems.push(newItem); 
            saveMediaLocally(); 
            e.target.reset(); 
            
            if (document.getElementById('ratingContainer')) document.getElementById('ratingContainer').style.display = 'none'; 
            renderMedia(); 
            
            try { 
                await fetch(`${API_BASE}/add-wishlist`, { 
                    method: 'POST', headers: apiHeaders, body: JSON.stringify(newItem) 
                }); 
            } catch (err) {} 
            finally { btn.innerText = orig; btn.disabled = false; } 
        });
    }
    
    document.addEventListener('click', (e) => { 
        const icon = e.target.closest('.info-icon'); 
        if (icon) { 
            e.stopPropagation(); 
            const tooltipEl = document.getElementById('globalTooltip'); 
            if (tooltipEl && tooltipEl.style.opacity === '1') hideTooltip(); 
            else showTooltipForIcon(icon); 
        } else { 
            hideTooltip(); 
        }
    });
    
    document.addEventListener('selectionchange', () => { 
        if (document.activeElement && document.activeElement.id === 'workspaceNotes') { 
            ['bold', 'italic', 'underline'].forEach(cmd => { 
                const btn = document.getElementById('btn-' + cmd); 
                if (btn) { 
                    if (document.queryCommandState(cmd)) btn.classList.add('editor-active-btn'); 
                    else btn.classList.remove('editor-active-btn'); 
                } 
            }); 
        } 
    });
    
    const wishLinkInput = document.getElementById('wishLink'); 
    if (wishLinkInput) {
        wishLinkInput.addEventListener('input', async () => { 
            setTimeout(async () => { 
                const url = wishLinkInput.value.trim(); 
                if (!url || !url.startsWith('http')) return; 
                
                if (wishScrapeController) wishScrapeController.abort(); 
                wishScrapeController = new AbortController(); 
                
                const lsi = document.getElementById('linkStatusIcon'); 
                if (lsi) { lsi.setAttribute('data-lucide', 'loader-2'); lsi.classList.add('animate-spin'); } 
                const cwb = document.getElementById('cancelWishScrapeBtn'); 
                if (cwb) cwb.classList.remove('hidden'); 
                renderIcons(); 
                
                try { 
                    const res = await fetch(`${API_BASE}/scrape-price`, { 
                        method: 'POST', headers: apiHeaders, body: JSON.stringify({url}), signal: wishScrapeController.signal 
                    }); 
                    const r = await res.json(); 
                    if (r.title && r.title !== 'Saved Product' && document.getElementById('wishName')) document.getElementById('wishName').value = r.title; 
                    if (r.price && document.getElementById('wishPrice')) document.getElementById('wishPrice').value = r.price; 
                    if (r.imageUrl && document.getElementById('wishImage')) document.getElementById('wishImage').value = r.imageUrl; 
                } catch(e) {} 
                finally { 
                    const lsi2 = document.getElementById('linkStatusIcon'); 
                    if (lsi2) { lsi2.setAttribute('data-lucide', 'link'); lsi2.classList.remove('animate-spin'); } 
                    const cwb2 = document.getElementById('cancelWishScrapeBtn'); 
                    if (cwb2) cwb2.classList.add('hidden'); 
                    renderIcons(); 
                } 
            }, 100); 
        });
    }

    const mediaLinkInput = document.getElementById('mediaLink'); 
    if (mediaLinkInput) {
        mediaLinkInput.addEventListener('input', async () => { 
            setTimeout(async () => { 
                const url = mediaLinkInput.value.trim(); 
                if (!url || !url.startsWith('http')) return; 
                
                if (mediaScrapeController) mediaScrapeController.abort(); 
                mediaScrapeController = new AbortController(); 
                
                const mlsi = document.getElementById('mediaLinkStatusIcon'); 
                if (mlsi) { mlsi.setAttribute('data-lucide', 'loader-2'); mlsi.classList.add('animate-spin'); } 
                const cmb = document.getElementById('cancelMediaScrapeBtn'); 
                if (cmb) cmb.classList.remove('hidden'); 
                renderIcons(); 
                
                try { 
                    const res = await fetch(`${API_BASE}/scrape-media`, { 
                        method: 'POST', headers: apiHeaders, body: JSON.stringify({url}), signal: mediaScrapeController.signal 
                    }); 
                    const r = await res.json(); 
                    if (r.title && document.getElementById('mediaName')) document.getElementById('mediaName').value = r.title; 
                    if (r.imageUrl && document.getElementById('mediaImage')) document.getElementById('mediaImage').value = r.imageUrl; 
                    if (r.mediaType && document.getElementById('mediaType')) document.getElementById('mediaType').value = r.mediaType; 
                    if (r.details && document.getElementById('mediaDetails')) document.getElementById('mediaDetails').value = r.details; 
                    if (r.price && document.getElementById('mediaPrice')) document.getElementById('mediaPrice').value = r.price; 
                    if (r.genre) { 
                        const sel = document.getElementById('mediaGenre'); 
                        if (sel) { 
                            for (let i = 0; i < sel.options.length; i++) { 
                                if (sel.options[i].value.toLowerCase() === r.genre.toLowerCase() || r.genre.toLowerCase().includes(sel.options[i].value.toLowerCase())) { 
                                    sel.selectedIndex = i; break; 
                                } 
                            } 
                        } 
                    } 
                } catch(e) {} 
                finally { 
                    const mlsi2 = document.getElementById('mediaLinkStatusIcon'); 
                    if (mlsi2) { mlsi2.setAttribute('data-lucide', 'link'); mlsi2.classList.remove('animate-spin'); } 
                    const cmb2 = document.getElementById('cancelMediaScrapeBtn'); 
                    if (cmb2) cmb2.classList.add('hidden'); 
                    renderIcons(); 
                } 
            }, 100); 
        });
    }
}

// ==============================================================================
// 7. SYSTEM STATE MANAGEMENT
// ==============================================================================
function normalizeTransaction(t) { 
    return { 
        id: String(t.id ?? t.i ?? Date.now()), 
        type: t.type ?? (t.t === 'e' ? 'expense' : 'income'), 
        amount: Number(t.amount ?? t.a) || 0, 
        account: t.account ?? t.ac ?? 'UPI', 
        category: t.category ?? t.c ?? 'Other', 
        note: t.note ?? t.n ?? '', 
        timestamp: Number(t.timestamp ?? t.ts) || Date.now(), 
        isRecurring: !!t.isRecurring 
    }; 
}

function forceCleanSystemState() { 
    try { 
        let txData = safeGetJSON(LOCAL_TX_KEY, []); 
        if (Array.isArray(txData) && txData.length > 0) {
            transactions = txData.map(normalizeTransaction).map(t => {
               if (t.account === 'Credit Card' || t.account === 'Debit Card') t.account = 'UPI';
               return t;
            });
        } else { 
            transactions = [...seedTransactions]; 
            localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(transactions)); 
        } 
    } catch(e) { transactions = [...seedTransactions]; } 
    
    ccLimit = parseFloat(localStorage.getItem('walletCCLimit')) || 50000;
    mediaItems = safeGetJSON('walletMediaBackup', []);
    wishlistItems = safeGetJSON('walletWishlistBackup', []);
    growthItems = safeGetJSON('walletGrowthBackup', []);
    monthlyBudgets = safeGetJSON('walletBudgets', { 'default': 25000 });
}

function saveTransactionsLocally() { localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(transactions)); }
function saveMediaLocally() { localStorage.setItem('walletMediaBackup', JSON.stringify(mediaItems)); }
function saveWishlistLocally() { localStorage.setItem('walletWishlistBackup', JSON.stringify(wishlistItems)); }

// ==============================================================================
// 8. CATEGORY SETTINGS & UI COLORS
// ==============================================================================
const EXPENSE_CATEGORIES = ['Food & Dining', 'Groceries', 'Transport', 'Utilities', 'Electricity charges', 'Mobile Recharge', 'Rent', 'Education', 'Travel', 'Shopping', 'Entertainment', 'Health', 'Subscriptions', 'Investments', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Refund', 'Cashback', 'Other'];
const CAT_COLORS = { 'Food & Dining': '#ef4444', 'Groceries': '#f97316', 'Transport': '#0ea5e9', 'Utilities': '#fbbf24', 'Shopping': '#a855f7', 'Salary': '#10b981', 'Other': '#6b7280' };

function getColor(cat) { 
    if (CAT_COLORS[cat]) return CAT_COLORS[cat]; 
    let hash = 0; 
    for (let i = 0; i < cat.length; i++) hash = cat.charCodeAt(i) + ((hash << 5) - hash); 
    return `hsl(${Math.abs(hash % 360)}, 70%, 55%)`; 
}

// ==============================================================================
// 9. VIEW SWITCHING & FILTERS
// ==============================================================================
function switchMainView(viewName) { 
    const views = ['dashboard', 'investments', 'wishlist', 'media', 'workspace', 'growth']; 
    if (!views.includes(viewName)) return; 
    
    views.forEach(v => { 
        const btn = document.getElementById('nav' + v.charAt(0).toUpperCase() + v.slice(1)); 
        const el = document.getElementById('view' + v.charAt(0).toUpperCase() + v.slice(1)); 
        if (!btn || !el) return;
        
        if (v === viewName) { 
            if(viewName === 'growth') {
                btn.className = 'nav-btn active flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-widest'; 
            } else {
                btn.className = 'nav-btn active flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg uppercase tracking-widest border border-white/20 bg-white/10'; 
            }
            el.classList.add('active'); 
            el.classList.remove('prev', 'next'); 
        } else { 
            if(v === 'growth') {
                btn.className = 'nav-btn flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-[#00e5ff] hover:text-white uppercase tracking-widest bg-[#00e5ff]/10 border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]';
            } else {
                btn.className = 'nav-btn flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-gray-500 hover:text-white uppercase tracking-widest border border-transparent'; 
            }
            el.classList.remove('active'); 
            el.classList.add('next'); 
        } 
    }); 
    
    if (viewName === 'workspace') setTimeout(initWhiteboard, 200); 
    if (viewName === 'dashboard') { updateUI(); updateChartStack(); updateStatsStack(); } 
    renderIcons(); 
}

function switchTab(type) { 
    currentType = type; 
    const tabExpense = document.getElementById('tabExpense');
    const tabIncome = document.getElementById('tabIncome');
    const currencySymbol = document.getElementById('currencySymbol');
    const submitBtn = document.getElementById('submitBtn');
    
    if (tabExpense) tabExpense.className = `flex-1 py-2 text-[10px] font-bold rounded uppercase tracking-widest ${type === 'expense' ? 'bg-white/10 text-[#ef4444] border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'text-gray-500 hover:text-white border border-transparent'}`; 
    if (tabIncome) tabIncome.className = `flex-1 py-2 text-[10px] font-bold rounded uppercase tracking-widest ${type === 'income' ? 'bg-white/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-gray-500 hover:text-white border border-transparent'}`; 
    if (currencySymbol) currencySymbol.className = `pl-4 text-2xl font-black drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] flex-shrink-0 ${type === 'expense' ? 'text-[#ef4444]' : 'text-[#10b981]'}`; 
    if (submitBtn) submitBtn.className = `w-full mt-2 text-white font-black py-4 rounded shadow-[0_0_15px_rgba(0,0,0,0.3)] uppercase tracking-widest text-sm transition-all ${type === 'expense' ? 'bg-gradient-to-r from-[#ef4444] to-[#b91c1c] border border-[#ef4444]/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-r from-[#10b981] to-[#047857] border border-[#10b981]/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]'}`; 
    populateCategories(); 
}

function populateCategories() { 
    const sel = document.getElementById('category'); 
    if (!sel) return; 
    sel.innerHTML = ''; 
    const categoriesArray = currentType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    categoriesArray.forEach(c => { sel.innerHTML += `<option value="${c}">${c}</option>`; }); 
}

function applyUniversalFilter(val) { 
    selectedMonth = val; 
    document.querySelectorAll('.universal-month-filter').forEach(el => { if (el.value !== val) el.value = val; }); 
    updateUI(); 
}

function updateSearch(val) { searchQuery = val; updateUI(); }
function addAmount(val) { const el = document.getElementById('amount'); if (el) el.value = (parseFloat(el.value) || 0) + val; }
function applyFilter(f) { currentFilter = f; updateUI(); }

function setCCLimit() { 
    const g = prompt(`Set Master Credit Card Limit (₹):`, ccLimit); 
    if (g && !isNaN(g)) { ccLimit = parseFloat(g); localStorage.setItem('walletCCLimit', ccLimit); updateUI(); } 
}

function setGoal() { 
    const g = prompt(`Set Fallback Budget Target for ${selectedMonth} (₹):`, monthlyBudgets[selectedMonth] || monthlyBudgets['default'] || 25000); 
    if (g && !isNaN(g)) { monthlyBudgets[selectedMonth] = parseFloat(g); localStorage.setItem('walletBudgets', JSON.stringify(monthlyBudgets)); updateUI(); } 
}

function setManualAllocationIncome() { 
    const amt = prompt("Set a manual Income override for the Allocation Matrix:\n(Enter 0 to revert to auto-calculated actuals)", localStorage.getItem('manualAllocIncome') || 0); 
    if (amt !== null && !isNaN(amt)) { localStorage.setItem('manualAllocIncome', parseFloat(amt)); updateUI(); } 
}

// ==============================================================================
// 10. EMERGENCY FUND & CREDIT CARD LOGIC
// ==============================================================================
function checkAutoEmergencyFund() { 
    autoEmergencyFundAmt = parseFloat(localStorage.getItem('walletAutoEmergency')) || 0; 
    if (autoEmergencyFundAmt <= 0) return; 
    const now = new Date(); 
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`; 
    const hasTransfer = transactions.some(t => t.account === 'Emergency' && t.note === 'Auto-Pilot Deposit' && `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === currentMonthKey); 
    
    if (!hasTransfer) { 
        const d = new Date(); d.setDate(1); d.setHours(12); 
        const newTx = { id: String(Date.now()), type: 'income', amount: autoEmergencyFundAmt, account: 'Emergency', category: 'Other', note: 'Auto-Pilot Deposit', timestamp: d.getTime(), isRecurring: true }; 
        transactions.push(newTx); saveTransactionsLocally(); 
    } 
}

function setEmergencyAutoPilot() { 
    autoEmergencyFundAmt = parseFloat(localStorage.getItem('walletAutoEmergency')) || 0; 
    const amt = prompt("Set Auto-Pilot Monthly Deposit for Emergency Fund (₹):\n\n(System will auto-inject this on the 1st of every active month)", autoEmergencyFundAmt); 
    if (amt && !isNaN(amt)) { localStorage.setItem('walletAutoEmergency', parseFloat(amt)); checkAutoEmergencyFund(); updateUI(); } 
}

function editEmergencyFund() { 
    let currentTotal = 0; 
    transactions.forEach(t => { if (t.account === 'Emergency') t.type === 'income' ? currentTotal += t.amount : currentTotal -= t.amount; }); 
    const amt = prompt(`Current Emergency Fund Calculated: ₹${currentTotal}\n\nEnter absolute exact balance to override & sync:`, currentTotal); 
    if (amt !== null && !isNaN(amt)) { 
        const diff = parseFloat(amt) - currentTotal; 
        if (diff !== 0) { 
            const newTx = { id: String(Date.now()), type: diff > 0 ? 'income' : 'expense', amount: Math.abs(diff), account: 'Emergency', category: 'Other', note: 'Balance Override Adjustment', timestamp: Date.now(), isRecurring: false }; 
            transactions.push(newTx); saveTransactionsLocally(); updateUI(); 
        } 
    } 
}

function addEmergencyFund() { 
    const amt = prompt("Inject Manual Capital to Emergency Fund (₹):"); 
    if (amt && !isNaN(amt)) { 
        const newTx = { id: String(Date.now()), type: 'income', amount: parseFloat(amt), account: 'Emergency', category: 'Other', note: 'Manual Addition', timestamp: Date.now(), isRecurring: false }; 
        transactions.push(newTx); saveTransactionsLocally(); updateUI(); 
    } 
}

function editCCBalance() { 
    let currentSpent = 0; 
    transactions.forEach(t => { 
        if (t.account === 'Credit Card' && (selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === selectedMonth)) { 
            if (t.type === 'expense') currentSpent += t.amount; else currentSpent -= t.amount; 
        } 
    }); 
    const amt = prompt(`Current CC Spent Calculated for Period: ₹${currentSpent}\n\nEnter absolute exact spent balance to override & sync:`, currentSpent); 
    if (amt !== null && !isNaN(amt)) { 
        const diff = parseFloat(amt) - currentSpent; 
        if (diff !== 0) { 
            const newTx = { id: String(Date.now()), type: diff > 0 ? 'expense' : 'income', amount: Math.abs(diff), account: 'Credit Card', category: 'Other', note: 'Balance Override Adjustment', timestamp: Date.now(), isRecurring: false }; 
            transactions.push(newTx); saveTransactionsLocally(); updateUI(); 
        } 
    } 
}

function payCCBill() { 
    const amt = prompt("Log a Credit Card Bill Payment (₹):"); 
    if (amt && !isNaN(amt)) { 
        const newTx = { id: String(Date.now()), type: 'income', amount: parseFloat(amt), account: 'Credit Card', category: 'Other', note: 'CC Bill Payment', timestamp: Date.now(), isRecurring: false }; 
        transactions.push(newTx); saveTransactionsLocally(); updateUI(); alert(`Logged ₹${amt} payment to Credit Card.`); 
    } 
}

// ==============================================================================
// 11. UTILITY & LEDGER CONTROLS
// ==============================================================================
function exportBackupJSON() { 
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions)); 
    const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", "Wally_Backup.json"); a.click(); 
}

function deleteTx(id) { 
    if (confirm("Delete entry?")) { 
        const idx = transactions.findIndex(t => t.id === id); 
        if (idx > -1) { 
            deletedQueue.push(transactions[idx]); transactions.splice(idx, 1); saveTransactionsLocally(); updateUI(); updateUndoBtn(); 
            try { fetch(`${API_BASE}/delete-transaction/${id}`, { method: 'DELETE' }); } catch(e) {} 
        } 
    } 
}

function duplicateTx(id) { 
    const tx = transactions.find(t => t.id === id); 
    if (!tx) return; 
    const newTx = { ...tx, id: String(Date.now()), timestamp: Date.now() }; 
    transactions.push(newTx); saveTransactionsLocally(); updateUI(); 
}

function toggleLedgerDetails(id) { 
    const details = document.getElementById(`details-${id}`); 
    const icon = document.getElementById(`chevron-${id}`); 
    if (details.classList.contains('open')) { details.classList.remove('open'); if (icon) icon.style.transform = 'rotate(0deg)'; } 
    else { details.classList.add('open'); if (icon) icon.style.transform = 'rotate(180deg)'; } 
}

function nukeLedger() { 
    if (confirm("DANGER: Are you sure you want to completely wipe all transactions?")) { 
        deletedQueue.push(...transactions); transactions = []; saveTransactionsLocally(); updateUI(); updateUndoBtn(); 
    } 
}

function undoLastDelete() { 
    if (deletedQueue.length > 0) { 
        const restored = deletedQueue.pop(); transactions.push(restored); saveTransactionsLocally(); updateUI(); updateUndoBtn(); 
    } 
}

function updateUndoBtn() { 
    const btn = document.getElementById('undoBtn'); 
    if (!btn) return; 
    if (deletedQueue.length > 0) { 
        btn.classList.remove('opacity-50', 'cursor-not-allowed'); btn.classList.add('text-[#00e5ff]', 'bg-[#00e5ff]/10'); 
        btn.innerHTML = `<i data-lucide="undo-2" class="w-3 h-3 mr-1"></i> Undo (${deletedQueue.length})`; 
    } else { 
        btn.classList.add('opacity-50', 'cursor-not-allowed'); btn.classList.remove('text-[#00e5ff]', 'bg-[#00e5ff]/10'); 
        btn.innerHTML = `<i data-lucide="undo-2" class="w-3 h-3 mr-1"></i> Undo`; 
    } 
    renderIcons(); 
}

// ==============================================================================
// 12. DYNAMIC MATRIX MODAL UI
// ==============================================================================
function configureAllocation() {
    let existingModal = document.getElementById('dynamicAllocModal');
    if (existingModal) existingModal.remove();
    let needs = safeGetJSON('allocNeedsCats', ['Groceries', 'Transport', 'Utilities', 'Electricity charges', 'Mobile Recharge', 'Rent', 'Education', 'Health']);
    let wants = safeGetJSON('allocWantsCats', ['Food & Dining', 'Travel', 'Shopping', 'Entertainment', 'Subscriptions']);
    let wealth = safeGetJSON('allocWealthCats', ['Investments']);

    const modalHtml = `
        <div id="dynamicAllocModal" class="fixed inset-0 bg-black/95 backdrop-blur-xl z-[999999] flex items-center justify-center p-4 animate-slide-up">
            <div class="glass-panel rounded-xl w-full max-w-2xl border border-[#00e5ff]/30 flex flex-col overflow-hidden max-h-[85vh] shadow-[0_0_50px_rgba(0,229,255,0.15)]">
                <div class="flex justify-between items-center p-5 border-b border-[#00e5ff]/20 bg-[#0a0a0c] shrink-0">
                    <h3 class="text-white font-black uppercase tracking-widest text-sm flex items-center drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"><i data-lucide="settings-2" class="w-5 h-5 mr-2 text-[#00e5ff]"></i> Configure Matrix Classes</h3>
                    <button type="button" onclick="document.getElementById('dynamicAllocModal').remove()" class="text-gray-500 hover:text-white bg-white/10 p-2 rounded"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
                <div class="p-6 overflow-y-auto ledger-scrollbar space-y-6 bg-black/40">
                    <div>
                        <h4 class="text-[#0ea5e9] font-bold uppercase tracking-widest text-xs mb-3 flex items-center"><i data-lucide="check-square" class="w-3 h-3 mr-1"></i> Core Map (50%)</h4>
                        <div class="flex flex-wrap gap-2">
                            ${EXPENSE_CATEGORIES.map(c => `<label class="flex items-center gap-2 bg-black/60 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-[#0ea5e9]/50 transition-colors"><input type="checkbox" value="${c}" ${needs.includes(c) ? 'checked' : ''} class="alloc-need form-check text-[#0ea5e9]"><span class="text-[10px] font-bold text-gray-300 uppercase">${c}</span></label>`).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-[#a855f7] font-bold uppercase tracking-widest text-xs mb-3 flex items-center"><i data-lucide="check-square" class="w-3 h-3 mr-1"></i> Discretion Map (25%)</h4>
                        <div class="flex flex-wrap gap-2">
                            ${EXPENSE_CATEGORIES.map(c => `<label class="flex items-center gap-2 bg-black/60 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-[#a855f7]/50 transition-colors"><input type="checkbox" value="${c}" ${wants.includes(c) ? 'checked' : ''} class="alloc-want form-check text-[#a855f7]"><span class="text-[10px] font-bold text-gray-300 uppercase">${c}</span></label>`).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="text-[#10b981] font-bold uppercase tracking-widest text-xs mb-3 flex items-center"><i data-lucide="check-square" class="w-3 h-3 mr-1"></i> Growth Map (20%)</h4>
                        <div class="flex flex-wrap gap-2">
                            ${EXPENSE_CATEGORIES.map(c => `<label class="flex items-center gap-2 bg-black/60 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-[#10b981]/50 transition-colors"><input type="checkbox" value="${c}" ${wealth.includes(c) ? 'checked' : ''} class="alloc-wealth form-check text-[#10b981]"><span class="text-[10px] font-bold text-gray-300 uppercase">${c}</span></label>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="p-5 border-t border-[#00e5ff]/20 bg-[#0a0a0c] flex justify-end gap-3 shrink-0">
                    <button onclick="document.getElementById('dynamicAllocModal').remove()" class="px-5 py-2.5 rounded bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 border border-white/10 shadow-sm">Abort</button>
                    <button onclick="saveDynamicAllocation()" class="px-5 py-2.5 rounded bg-[#00e5ff] hover:bg-[#0ea5e9] text-black text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(0,229,255,0.6)]"><i data-lucide="save" class="w-3 h-3 inline mr-1"></i> Lock Architecture</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    renderIcons();
}

function saveDynamicAllocation() {
    const getChecked = (cls) => Array.from(document.querySelectorAll('.' + cls + ':checked')).map(cb => cb.value);
    localStorage.setItem('allocNeedsCats', JSON.stringify(getChecked('alloc-need')));
    localStorage.setItem('allocWantsCats', JSON.stringify(getChecked('alloc-want')));
    localStorage.setItem('allocWealthCats', JSON.stringify(getChecked('alloc-wealth')));
    document.getElementById('dynamicAllocModal').remove();
    updateUI();
}

// ==============================================================================
// 13. CHARTS & STATS STACKS LOGIC
// ==============================================================================
function updateChartStack() { 
    const cards = document.querySelectorAll('.chart-stack-card'); 
    const total = cards.length; 
    if (total === 0) return; 
    cards.forEach((card, idx) => { 
        card.classList.remove('active', 'prev-card', 'next-card'); 
        if (idx === currentChartIdx) card.classList.add('active'); 
        else if (idx === (currentChartIdx - 1 + total) % total) card.classList.add('prev-card'); 
        else if (idx === (currentChartIdx + 1) % total) card.classList.add('next-card'); 
    }); 
    if (document.getElementById('deckIndicator')) document.getElementById('deckIndicator').innerText = `0${currentChartIdx + 1} / 0${total}`; 
    try {
        if (typeof Chart !== 'undefined') Object.values(Chart.instances).forEach(c => c.resize());
    } catch(e) {}
}

function nextChartStack() { 
    const total = document.querySelectorAll('.chart-stack-card').length; 
    currentChartIdx = (currentChartIdx + 1) % total; 
    updateChartStack(); 
}

function prevChartStack() { 
    const total = document.querySelectorAll('.chart-stack-card').length; 
    currentChartIdx = (currentChartIdx - 1 + total) % total; 
    updateChartStack(); 
}

function updateStatsStack() { 
    const cards = document.querySelectorAll('.stats-stack-card'); 
    const total = cards.length; 
    if (total === 0) return; 
    cards.forEach((card, idx) => { 
        card.classList.remove('active', 'prev-card', 'next-card'); 
        if (idx === statsChartIdx) card.classList.add('active'); 
        else if (idx === (statsChartIdx - 1 + total) % total) card.classList.add('prev-card'); 
        else if (idx === (statsChartIdx + 1) % total) card.classList.add('next-card'); 
    }); 
    if (document.getElementById('statsIndicator')) document.getElementById('statsIndicator').innerText = `0${statsChartIdx + 1} / 0${total}`; 
}

function nextStatsStack() { 
    const total = document.querySelectorAll('.stats-stack-card').length; 
    statsChartIdx = (statsChartIdx + 1) % total; 
    updateStatsStack(); 
}

function prevStatsStack() { 
    const total = document.querySelectorAll('.stats-stack-card').length; 
    statsChartIdx = (statsChartIdx - 1 + total) % total; 
    updateStatsStack(); 
}

function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
    const elDonut = document.getElementById('walletChart'); 
    if (elDonut) donutChart = new Chart(elDonut, { type: 'doughnut', data: { labels:[], datasets:[{data:[], backgroundColor:[], borderWidth: 0 }] }, options: { ...opts, cutout: '75%' } });
    
    const elAccount = document.getElementById('accountChart'); 
    if (elAccount) accountChart = new Chart(elAccount, { type: 'doughnut', data: { labels:['UPI', 'Debit Card', 'Credit Card', 'Cash'], datasets:[{data:[0,0,0,0], backgroundColor:['#00e5ff', '#3b82f6', '#a855f7', '#10b981'], borderWidth: 0 }] }, options: { ...opts, cutout: '70%', plugins: { legend: { display: true, position: 'bottom', labels: {color: '#9ca3af', font:{family:'Fredoka', size:10}} } } } });
    
    const elTrend = document.getElementById('trendChart'); 
    if (elTrend) lineChart = new Chart(elTrend, { type: 'line', data: { labels:[], datasets:[] }, options: { ...opts, scales: { x: { display: false }, y: { display: false } }, elements: { point: { radius: 0 } } } });
    
    const elRadar = document.getElementById('radarChart'); 
    if (elRadar) radarChart = new Chart(elRadar, { type: 'radar', data: { labels: ['Dining', 'Transport', 'Shopping', 'Utilities', 'Subs'], datasets: [{ data: [0,0,0,0,0], backgroundColor: 'rgba(0, 229, 255, 0.4)', borderColor: '#00e5ff', borderWidth: 2 }] }, options: { ...opts, scales: { r: { angleLines: { color: 'rgba(0,229,255,0.2)' }, grid: { color: 'rgba(0,229,255,0.2)' }, pointLabels: { color: '#00e5ff', font: { family: 'Fredoka', size: 10 } }, ticks: { display: false } } } } });
    
    const elCashflow = document.getElementById('cashflowChart'); 
    if (elCashflow) cashflowChart = new Chart(elCashflow, { type: 'bar', data: { labels: [], datasets: [ { label: 'Income', data: [], backgroundColor: '#10b981', borderRadius:4 }, { label: 'Expense', data: [], backgroundColor: '#ef4444', borderRadius:4 } ] }, options: { ...opts, scales: { x: { display: false }, y: { display: false } } } });
    
    const elWeekly = document.getElementById('weeklyRhythmChart'); 
    if (elWeekly) weeklyRhythmChart = new Chart(elWeekly, { type: 'bar', data: { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], datasets: [{ data: [0,0,0,0,0,0,0], backgroundColor: '#6366f1', borderRadius: 4 }] }, options: { ...opts, scales: { x: { display: false }, y: { display: false } } } });
    
    const elMonthly = document.getElementById('monthlyTrendChart'); 
    if (elMonthly) monthlyTrendChart = new Chart(elMonthly, { type: 'bar', data: { labels: [], datasets: [ { label: 'Expenses', data: [], backgroundColor: '#f97316', borderRadius: 4 } ] }, options: { ...opts, scales: { x: { display: false }, y: { display: false } } } });
    
    const elBurn = document.getElementById('burnTrajectoryChart'); 
    if (elBurn) burnChartObj = new Chart(elBurn, { type: 'line', data: { labels: [], datasets: [{ label: 'Cumulative Spend', data: [], borderColor: '#fbbf24', backgroundColor: 'rgba(251,191,36,0.1)', fill: true, tension: 0.4 }, { label: 'Budget Limit', data: [], borderColor: 'rgba(0,229,255,0.4)', borderDash: [5, 5], pointRadius: 0, fill: false }]}, options: { ...opts, scales: { x: { display: false }, y: { display: false } } } }); 
    
    const elSavings = document.getElementById('savingsTrendChart'); 
    if (elSavings) savingsTrendChartObj = new Chart(elSavings, { type: 'line', data: { labels: [], datasets: [{ label: 'Savings Rate %', data: [], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.2)', fill: true, tension: 0.4 }] }, options: { ...opts, scales: { x: { display: false }, y: { display: false } } } }); 

    const elPolar = document.getElementById('polarChart'); 
    if (elPolar) polarChartObj = new Chart(elPolar, { type: 'polarArea', data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] }, options: { ...opts, scales: { r: { display: false } } } }); 
}

function openChartModal(id, t) { 
    document.getElementById('expandModalTitle').innerHTML = `<i data-lucide="bar-chart-2" class="w-5 h-5 mr-2 text-[#00e5ff]"></i> ${t}`; 
    document.getElementById('expandedChartModal').classList.remove('hidden'); 
    renderIcons(); 
    
    if (expandedChartObj) expandedChartObj.destroy(); 
    const chartsMap = { walletChart: donutChart, accountChart: accountChart, radarChart: radarChart, trendChart: lineChart, weeklyRhythmChart: weeklyRhythmChart, cashflowChart: cashflowChart, monthlyTrendChart: monthlyTrendChart, burnTrajectoryChart: burnChartObj, savingsTrendChart: savingsTrendChartObj, polarChart: polarChartObj }; 
    const src = chartsMap[id]; 
    if (!src) return; 
    
    const cfg = { type: src.config.type, data: JSON.parse(JSON.stringify(src.data)), options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: id !== 'radarChart' && id !== 'monthlyTrendChart' && id !== 'polarChart', labels: {color:'#00e5ff', font: {family: 'Fredoka'}} } } } }; 
    if (id !== 'walletChart' && id !== 'radarChart' && id !== 'accountChart' && id !== 'burnTrajectoryChart' && id !== 'savingsTrendChart' && id !== 'polarChart') cfg.options.scales = { x: { grid: { display: false } }, y: { border: { display: false } } }; 
    if (id === 'radarChart') cfg.options.scales = { r: { angleLines: { color: 'rgba(0,229,255,0.2)' }, grid: { color: 'rgba(0,229,255,0.2)' }, pointLabels: { color: '#00e5ff', font: { family: 'Fredoka'} }, ticks: { display: false } } }; 
    if (id === 'burnTrajectoryChart' || id === 'savingsTrendChart') cfg.options.scales = { x: { grid: { color: 'rgba(0,229,255,0.2)' }, ticks: {color: '#00e5ff'} }, y: { grid: { color: 'rgba(0,229,255,0.2)' }, ticks: {color: '#00e5ff'} } }; 
    
    expandedChartObj = new Chart(document.getElementById('expandedChartCanvas'), cfg); 
}

function closeChartModal() { 
    document.getElementById('expandedChartModal').classList.add('hidden'); 
    if (expandedChartObj) expandedChartObj.destroy(); 
}

function openAllTimeChart() { 
    document.getElementById('allTimeModal').classList.remove('hidden'); 
    const sorted = [...transactions].sort((a,b)=>a.timestamp-b.timestamp); 
    const dataMap = {}; 
    const eDate = new Date(); eDate.setHours(23,59,59,999); 
    const sDate = sorted.length > 0 ? new Date(sorted[0].timestamp) : new Date(); sDate.setHours(0,0,0,0); 
    
    for (let d = new Date(sDate); d <= eDate; d.setDate(d.getDate()+1)) { 
        const key = d.getFullYear() + '-' + String(d.getMonth()).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); 
        dataMap[key] = { label: d.toLocaleDateString('en-GB',{day:'numeric',month:'short', year:'2-digit'}), i: 0, e: 0 }; 
    } 
    if (sorted.length) { 
        sorted.forEach(t => { 
            if (t.account === 'Emergency') return; 
            const d = new Date(t.timestamp); 
            if (d >= sDate && d <= eDate) { 
                const key = d.getFullYear() + '-' + String(d.getMonth()).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); 
                if (dataMap[key]) { if (t.type === 'income') dataMap[key].i += t.amount; else dataMap[key].e += t.amount; } 
            } 
        }); 
    } 
    const labels = Object.values(dataMap).map(d => d.label); 
    const incData = Object.values(dataMap).map(d => d.i); 
    const expData = Object.values(dataMap).map(d => d.e); 
    
    if (allTimeChartObj) allTimeChartObj.destroy(); 
    allTimeChartObj = new Chart(document.getElementById('allTimeChartCanvas'), { 
        type: 'line', data: { labels: labels, datasets: [ { label: 'Income', data: incData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }, { label: 'Expense', data: expData, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 } ] }, 
        options: { responsive: true, maintainAspectRatio: false, scales: { x: { grid: {display: false, color: 'rgba(0,229,255,0.1)'}, ticks: {color: '#00e5ff', font: {family: 'Fredoka'}} }, y: { grid: {color: 'rgba(0,229,255,0.1)'}, ticks: {color: '#00e5ff'} } }, plugins: { legend: { display: true, position: 'top', labels: {color:'#fff', font:{family:'Fredoka', size: 12}} } } } 
    }); 
}

function closeAllTimeChart() { 
    document.getElementById('allTimeModal').classList.add('hidden'); 
}

function updatePieChart() { 
    if (!donutChart) return; 
    let ft = transactions.filter(t => t.type === 'expense' && t.account !== 'Emergency' && (selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === selectedMonth)); 
    const cat = {}; let tot = 0; 
    ft.forEach(e => { cat[e.category] = (cat[e.category] || 0) + e.amount; tot += e.amount; }); 
    const s = Object.entries(cat).sort((a,b) => b[1] - a[1]); 
    
    if (document.getElementById('chartCenterText')) document.getElementById('chartCenterText').innerText = `₹${tot.toLocaleString()}`; 
    donutChart.data = { labels: s.map(c=>c[0]), datasets: [{ data: s.map(c=>c[1]), backgroundColor: s.map(c=>getColor(c[0])), borderWidth: 0 }] }; 
    donutChart.update(); 
    
    if (document.getElementById('topInsights')) {
        document.getElementById('topInsights').innerHTML = s.length ? s.map(([c, v]) => { 
            const p = Math.round((v/tot)*100); 
            return `<div><div class="flex justify-between text-[10px] font-bold mb-1 min-w-0"><span class="text-[#00e5ff] truncate pr-2">${c}</span><span class="text-gray-400 flex-shrink-0">₹${v} (${p}%)</span></div><div class="w-full bg-black/60 rounded h-1.5 border border-white/5"><div class="h-1.5 rounded" style="width: ${p}%; background-color: ${getColor(c)}"></div></div></div>`; 
        }).join('') : `<div class="flex flex-col items-center justify-center py-10 opacity-70"><i data-lucide="pie-chart" class="w-10 h-10 mb-2 text-[#00e5ff]"></i><p class="text-[10px] text-[#00e5ff] font-bold uppercase tracking-widest mt-2">No data</p></div>`; 
    }
    renderIcons(); 
}

function updateHistoryChart() { 
    const m = {}; 
    transactions.forEach(t => { 
        if (t.account === 'Emergency') return; 
        const k = `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}`; 
        if (!m[k]) m[k] = { i: 0, e: 0 }; 
        t.type === 'income' ? m[k].i += t.amount : m[k].e += t.amount; 
    }); 
    const s = Object.keys(m).sort().filter(k => selectedMonth === 'all' || k === selectedMonth); 
    const l = s.map(k => new Date(k.split('-')[0], k.split('-')[1]-1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).toUpperCase()); 
    
    if (allMonthsChart) { allMonthsChart.data.labels = l; allMonthsChart.data.datasets[0].data = s.map(k => m[k].i); allMonthsChart.data.datasets[1].data = s.map(k => m[k].e); allMonthsChart.update(); } 
    if (monthlyTrendChart) { monthlyTrendChart.data.labels = l; monthlyTrendChart.data.datasets[0].data = s.map(k => m[k].e); monthlyTrendChart.update(); } 
}

// ==============================================================================
// 14. MAIN UI UPDATE & MONTH TIMELINE BACKFILL ENGINE
// ==============================================================================
function updateUI() {
    let minTs = Date.now();
    if (transactions.length > 0) minTs = Math.min(...transactions.map(t => t.timestamp));
    const dStart = new Date(minTs); dStart.setDate(1);
    const dEnd = new Date(); dEnd.setDate(1);
    const allMonthsList = [];
    let curr = new Date(dStart);
    while (curr <= dEnd) { allMonthsList.push(`${curr.getFullYear()}-${String(curr.getMonth()+1).padStart(2,'0')}`); curr.setMonth(curr.getMonth()+1); }
    transactions.forEach(t => { const d = new Date(t.timestamp); const mStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; if (!allMonthsList.includes(mStr)) allMonthsList.push(mStr); });
    const nowStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    if (!allMonthsList.includes(nowStr)) allMonthsList.push(nowStr);
    const sortedMonths = [...new Set(allMonthsList)].sort().reverse();
    
    let safeMonth = selectedMonth;
    if (safeMonth !== 'all' && !sortedMonths.includes(safeMonth)) {
        safeMonth = 'all';
        selectedMonth = 'all';
    }
    
    document.querySelectorAll('.universal-month-filter').forEach(sel => { 
        let html = '<option value="all">ALL TIME</option>'; 
        sortedMonths.forEach(m => { const text = new Date(m.split('-')[0], m.split('-')[1] - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase(); html += `<option value="${m}">${text}</option>`; }); 
        sel.innerHTML = html; 
        sel.value = safeMonth; 
    });

    let aInc = 0, aExp = 0, totBal = 0, eFundTotal = 0;
    transactions.forEach(t => { 
        if (t.account === 'Emergency') { if (t.type === 'income') eFundTotal += t.amount; else eFundTotal -= t.amount; } 
        else { if (t.type === 'income') { aInc += t.amount; totBal += t.amount; } else { aExp += t.amount; totBal -= t.amount; } } 
    });
    if (document.getElementById('netBalance')) document.getElementById('netBalance').innerText = `₹${totBal.toLocaleString()}`; 
    if (document.getElementById('emergencyFundBalance')) document.getElementById('emergencyFundBalance').innerText = `₹${eFundTotal.toLocaleString()}`; 

    const ft = transactions.filter(t => t.account !== 'Emergency' && (selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === selectedMonth) && (currentFilter === 'all' || (currentFilter === 'income' && t.type === 'income') || (currentFilter === 'expense' && t.type === 'expense') || (currentFilter === 'High Impact' && t.amount > 10000)) && (!searchQuery || t.category.toLowerCase().includes(searchQuery.toLowerCase()) || (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()))) );
    
    let pInc = 0, pExp = 0, ccExp = 0, uUpi = 0, uDebit = 0, uCredit = 0, uCash = 0;
    let bNeeds = 0, bWants = 0, bWealth = 0, bCarefree = 0;
    let needsCats = safeGetJSON('allocNeedsCats', ['Groceries', 'Transport', 'Utilities', 'Electricity charges', 'Mobile Recharge', 'Rent', 'Education', 'Health']);
    let wantsCats = safeGetJSON('allocWantsCats', ['Food & Dining', 'Travel', 'Shopping', 'Entertainment', 'Subscriptions']);
    let wealthCats = safeGetJSON('allocWealthCats', ['Investments']);

    transactions.forEach(t => { 
        if (t.account === 'Emergency') return;
        if (t.type === 'income') { if (selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === selectedMonth) pInc += t.amount; } 
        else { 
            if (selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === selectedMonth) {
                pExp += t.amount; 
                if (t.account === 'Credit Card') { ccExp += t.amount; uCredit += t.amount; } 
                else if (t.account === 'Debit Card') { uDebit += t.amount; } 
                else if (t.account === 'UPI') { uUpi += t.amount; } 
                else { uCash += t.amount; }
                
                if (needsCats.includes(t.category)) bNeeds += t.amount; 
                else if (wantsCats.includes(t.category)) bWants += t.amount; 
                else if (wealthCats.includes(t.category)) bWealth += t.amount; 
                else bCarefree += t.amount;
            }
        } 
    });

    if (accountChart) { accountChart.data.datasets[0].data = [uUpi, uDebit, uCredit, uCash]; accountChart.update(); }
    if (document.getElementById('currMonthIncome')) document.getElementById('currMonthIncome').innerText = `₹${pInc.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
    if (document.getElementById('currMonthExpense')) document.getElementById('currMonthExpense').innerText = `₹${pExp.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    
    const manualOverride = parseFloat(localStorage.getItem('manualAllocIncome')) || 0;
    if (document.getElementById('allocIncomeDisplay')) document.getElementById('allocIncomeDisplay').innerText = `Income: ₹${(manualOverride > 0 ? manualOverride : pInc).toLocaleString()} ${manualOverride > 0 ? '(Manual)' : ''}`;
    
    let pNet = pInc - pExp; 
    if (document.getElementById('currMonthNet')) { 
        document.getElementById('currMonthNet').innerText = pNet >= 0 ? `NET: + ₹${pNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAVED` : `NET: - ₹${Math.abs(pNet).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DEFICIT`; 
        document.getElementById('currMonthNet').className = pNet >= 0 ? 'text-xs font-black uppercase tracking-widest text-[#00e5ff] truncate' : 'text-xs font-black uppercase tracking-widest text-[#ef4444] truncate'; 
    }
    
    if (document.getElementById('ccSpent')) document.getElementById('ccSpent').innerText = `₹${ccExp.toLocaleString()}`;
    if (document.getElementById('ccLimitText')) document.getElementById('ccLimitText').innerText = `Limit: ₹${ccLimit.toLocaleString()}`;
    if (document.getElementById('ccProgress')) document.getElementById('ccProgress').style.width = `${Math.min((ccExp/ccLimit)*100, 100)}%`;

    const curDay = selectedMonth === 'all' ? Math.max(1, (new Date().getTime() - ([...transactions].sort((a,b)=>a.timestamp-b.timestamp)[0]?.timestamp || new Date().getTime())) / 86400000) : (selectedMonth === `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}` ? Math.max(1, new Date().getDate()) : new Date(selectedMonth.split('-')[0], selectedMonth.split('-')[1], 0).getDate());
    const br = pExp / curDay; 
    const cb = monthlyBudgets[selectedMonth] || monthlyBudgets['default'] || 25000;
    
    const baseCalc = manualOverride > 0 ? manualOverride : (pInc > 0 ? pInc : cb);
    const limitNeeds = baseCalc * 0.50; const limitWants = baseCalc * 0.25; const targetWealth = baseCalc * 0.20; const limitCarefree = baseCalc * 0.05;

    if (document.getElementById('allocNeeds')) {
        document.getElementById('allocNeeds').innerText = `₹${bNeeds.toLocaleString('en-IN')} / ₹${limitNeeds.toLocaleString('en-IN')}`; document.getElementById('progNeeds').style.width = `${Math.min((bNeeds/limitNeeds)*100 || 0, 100)}%`;
        document.getElementById('allocWants').innerText = `₹${bWants.toLocaleString('en-IN')} / ₹${limitWants.toLocaleString('en-IN')}`; document.getElementById('progWants').style.width = `${Math.min((bWants/limitWants)*100 || 0, 100)}%`;
        document.getElementById('allocWealth').innerText = `₹${bWealth.toLocaleString('en-IN')} / ₹${targetWealth.toLocaleString('en-IN')}`; document.getElementById('progWealth').style.width = `${Math.min((bWealth/targetWealth)*100 || 0, 100)}%`;
        document.getElementById('allocCarefree').innerText = `₹${bCarefree.toLocaleString('en-IN')} / ₹${limitCarefree.toLocaleString('en-IN')}`; document.getElementById('progCarefree').style.width = `${Math.min((bCarefree/limitCarefree)*100 || 0, 100)}%`;
    }
    
    if (document.getElementById('recordCount')) document.getElementById('recordCount').innerText = ft.length; 
    if (document.getElementById('statBurnRate')) document.getElementById('statBurnRate').innerText = `₹${Math.round(br).toLocaleString()}`;
    const sr = pInc > 0 ? ((pInc - pExp) / pInc) * 100 : 0; 
    if (document.getElementById('statSavingsRate')) document.getElementById('statSavingsRate').innerText = `${Math.max(0, sr).toFixed(1)}%`;
    let tl = 0; ft.forEach(t => { if (t.type === 'expense' && t.isRecurring) tl += t.amount; }); 
    if (document.getElementById('statLiabilities')) document.getElementById('statLiabilities').innerText = `₹${tl.toLocaleString()}`;
    const run = br > 0 ? totBal / br : 0; 
    if (document.getElementById('statRunway')) document.getElementById('statRunway').innerText = `${Math.round(run)} DAYS`;

    let savingsScore = Math.min(35, (sr / 30) * 35); let runwayScore = Math.min(35, (run / 180) * 35); let liabScore = Math.max(0, 15 - ((tl / pInc) * 15)); let budgetScore = Math.max(0, 15 - ((pExp / cb) * 15));
    let hs = Math.round(savingsScore + runwayScore + liabScore + budgetScore); hs = Math.min(100, Math.max(10, isNaN(hs) ? 50 : hs));

    if (document.getElementById('healthScore')) { 
        document.getElementById('healthScore').innerText = `${hs}/100`; 
        document.getElementById('healthScore').className = `text-5xl font-black truncate w-full uppercase bubbly-text drop-shadow-md ${hs >= 90 ? 'text-[#00e5ff]' : (hs >= 75 ? 'text-[#10b981]' : (hs >= 50 ? 'text-[#fbbf24]' : (hs >= 30 ? 'text-[#f97316]' : 'text-[#ef4444]')))}`; 
    }
    
    if (document.getElementById('weatherIcon') && document.getElementById('weatherText')) { 
        const wIcn = document.getElementById('weatherIcon'); const wTxt = document.getElementById('weatherText'); 
        if (hs >= 90) { wIcn.innerHTML = `<i data-lucide="shield-check" class="w-4 h-4 text-cyan-400 mr-2"></i>`; wTxt.innerText = 'Elite'; wTxt.className = 'text-[10px] text-cyan-400 uppercase font-black tracking-widest ml-1'; } 
        else if (hs >= 75) { wIcn.innerHTML = `<i data-lucide="sun" class="w-4 h-4 text-emerald-400 mr-2"></i>`; wTxt.innerText = 'Excellent'; wTxt.className = 'text-[10px] text-emerald-400 uppercase font-black tracking-widest ml-1'; } 
        else if (hs >= 50) { wIcn.innerHTML = `<i data-lucide="cloud" class="w-4 h-4 text-yellow-400 mr-2"></i>`; wTxt.innerText = 'Stable'; wTxt.className = 'text-[10px] text-yellow-400 uppercase font-black tracking-widest ml-1'; } 
        else if (hs >= 30) { wIcn.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4 text-orange-400 mr-2"></i>`; wTxt.innerText = 'At Risk'; wTxt.className = 'text-[10px] text-orange-400 uppercase font-black tracking-widest ml-1'; } 
        else { wIcn.innerHTML = `<i data-lucide="cloud-lightning" class="w-4 h-4 text-rose-500 mr-2 animate-pulse"></i>`; wTxt.innerText = 'Critical'; wTxt.className = 'text-[10px] text-rose-500 uppercase font-black tracking-widest ml-1'; } 
    }

    const cd = {}; ft.filter(t=>t.type==='expense').forEach(e => cd[e.category] = (cd[e.category]||0)+e.amount);
    const sc = Object.entries(cd).sort((a,b)=>b[1]-a[1]);
    if (document.getElementById('statTopExpenseName')) document.getElementById('statTopExpenseName').innerText = sc.length ? sc[0][0] + ' (₹' + sc[0][1].toLocaleString() + ')' : 'OTHER';

    updatePieChart();
    if (radarChart) { radarChart.data.datasets[0].data = ['Food & Dining', 'Transport', 'Shopping', 'Utilities', 'Subscriptions'].map(c => cd[c] || 0); radarChart.update(); }
  
    const dt = [0,0,0,0,0,0,0]; 
    ft.filter(t=>t.type==='expense').forEach(t => { let day = new Date(t.timestamp).getDay(); dt[day === 0 ? 6 : day - 1] += t.amount; });
    if (weeklyRhythmChart) { weeklyRhythmChart.data.datasets[0].data = dt; weeklyRhythmChart.update(); }

    const sf = [...ft].sort((a,b) => sortDirection === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);
    const nwLbl = [...transactions].sort((a,b)=>a.timestamp-b.timestamp).map(t=>new Date(t.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'short'}));
    
    let globRb = 0; 
    const nwData = [...transactions].sort((a,b)=>a.timestamp-b.timestamp).map(t=>{ if (t.type === 'income') { globRb += t.amount; } else { globRb -= t.amount; } return globRb; });
    
    if (lineChart) { lineChart.data = { labels: nwLbl, datasets: [{ label: 'Net Worth', data: nwData, borderColor: '#0ea5e9', fill: true, backgroundColor: 'rgba(14,165,233,0.1)', tension: 0.4 }] }; lineChart.update(); }

    const d7 = {}; 
    if ([...ft].length) { 
        const sft = [...ft].sort((a,b)=>a.timestamp-b.timestamp); 
        const e = new Date(sft[sft.length-1].timestamp); e.setHours(0,0,0,0); 
        const s = new Date(e); s.setDate(s.getDate()-6); 
        for (let d = new Date(s); d <= e; d.setDate(d.getDate()+1)) { d7[d.toLocaleDateString('en-GB',{day:'numeric',month:'short'})]={i:0,e:0}; }
        sft.forEach(t=>{ 
            const ds = new Date(t.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'short'}); 
            if (d7[ds]) { if (t.type==='income') { d7[ds].i+=t.amount; } else { d7[ds].e+=t.amount; } }
        }); 
    }
    if (cashflowChart) { cashflowChart.data.labels = Object.keys(d7); cashflowChart.data.datasets[0].data = Object.values(d7).map(d=>d.i); cashflowChart.data.datasets[1].data = Object.values(d7).map(d=>d.e); cashflowChart.update(); }
  
    if (burnChartObj) {
        const mData = ft.filter(t => t.type === 'expense').sort((a,b)=>a.timestamp-b.timestamp);
        let cum = 0; 
        const burnData = mData.map(t => { cum += t.amount; return cum; });
        const burnLabels = mData.map(t => new Date(t.timestamp).getDate());
        const budgData = mData.map(() => cb); 
        burnChartObj.data.labels = burnLabels; burnChartObj.data.datasets[0].data = burnData; burnChartObj.data.datasets[1].data = budgData; burnChartObj.update();
    }

    if (savingsTrendChartObj) {
        const ms = {}; 
        transactions.forEach(t => { 
            if (t.account === 'Emergency') return; 
            const k = `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}`; 
            if (!ms[k]) ms[k] = { i: 0, e: 0 }; 
            if (t.type === 'income') { ms[k].i += t.amount; } else { ms[k].e += t.amount; }
        });
        const savKeys = Object.keys(ms).sort().slice(-6);
        const savLabels = savKeys.map(k => new Date(k.split('-')[0], k.split('-')[1]-1).toLocaleDateString('en-GB', { month: 'short' }));
        const savData = savKeys.map(k => ms[k].i > 0 ? Math.max(0, ((ms[k].i - ms[k].e) / ms[k].i) * 100).toFixed(1) : 0);
        savingsTrendChartObj.data.labels = savLabels; savingsTrendChartObj.data.datasets[0].data = savData; savingsTrendChartObj.update();
    }

    if (polarChartObj) {
        const pCats = {}; ft.filter(t=>t.type==='expense').forEach(e => { pCats[e.category] = (pCats[e.category] || 0) + e.amount; });
        const topPCats = Object.entries(pCats).sort((a,b)=>b[1]-a[1]).slice(0, 6);
        polarChartObj.data.labels = topPCats.map(c=>c[0]); polarChartObj.data.datasets[0].data = topPCats.map(c=>c[1]); polarChartObj.data.datasets[0].backgroundColor = topPCats.map(c=>getColor(c[0])); polarChartObj.update();
    }

    const recList = document.getElementById('recurringWidgetList');
    if (recList) {
        const recs = ft.filter(t => t.type === 'expense' && t.isRecurring); let recTot = 0;
        if (recs.length === 0) {
            recList.innerHTML = `<p class="text-[10px] text-gray-500 text-center mt-6 uppercase tracking-widest font-bold">No active bindings detected.</p>`;
        } else {
            recList.innerHTML = recs.map(t => {
                recTot += t.amount;
                return `<div class="flex justify-between items-center bg-black/60 p-2.5 rounded-xl border border-white/5"><div class="min-w-0 pr-2"><p class="text-[10px] font-bold text-yellow-400 uppercase truncate tracking-widest">${t.category}</p><p class="text-[9px] text-gray-400 truncate">${t.note || 'Subscription'}</p></div><span class="text-xs font-black text-rose-500 shrink-0 pl-2">₹${t.amount}</span></div>`;
            }).join('');
        }
        if (document.getElementById('recurringWidgetTotal')) document.getElementById('recurringWidgetTotal').innerText = `₹${recTot.toLocaleString()}`;
    }

    updateHistoryChart();

    const lst = document.getElementById('ledgerList');
    if (lst) { 
        lst.innerHTML = ft.length ? sf.map(t => `
            <div class="ledger-item flex flex-col p-4 mb-3 relative overflow-hidden bg-black/40 border-l-4 ${t.type==='income'?'border-l-[#10b981]':(t.account==='Emergency'?'border-l-[#0ea5e9]':'border-l-[#ef4444]')} shadow-sm cursor-pointer group" onclick="toggleLedgerDetails('${t.id}')">
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center space-x-4 min-w-0">
                        <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gray-400 flex-shrink-0 shadow-inner">
                            <i data-lucide="${t.type==='income'?'arrow-down-left':(t.account==='Emergency'?'alert-triangle':'credit-card')}" class="w-4 h-4"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <p class="font-bold text-[#e2e8f0] text-sm truncate tracking-wide">${t.category}</p>
                                ${t.isRecurring ? '<span class="bg-yellow-400/20 text-yellow-400 text-[8px] px-1.5 py-0.5 rounded border border-yellow-400/30 shadow-sm flex-shrink-0 tracking-widest">AUTO</span>' : ''}
                            </div>
                            <p class="text-xs text-gray-500 mt-1 truncate tracking-wider">${new Date(t.timestamp).toLocaleDateString('en-GB',{day:'numeric',month:'short', year:'2-digit'})}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 flex-shrink-0 pl-2">
                        <p class="font-black text-base md:text-lg ${t.type==='income'?'text-[#10b981]':'text-[#ef4444]'}">${t.type==='income'?'+':'-'}₹${t.amount.toLocaleString()}</p>
                        <i id="chevron-${t.id}" data-lucide="chevron-down" class="w-4 h-4 text-blue-400 opacity-50 transition-transform duration-300"></i>
                    </div>
                </div>
                <div id="details-${t.id}" class="ledger-details" onclick="event.stopPropagation()">
                    <div class="flex flex-col gap-3">
                        <div class="grid grid-cols-2 gap-4 bg-black/80 p-3 rounded-xl border border-white/5">
                            <div><p class="text-[9px] text-blue-400 uppercase tracking-widest font-bold">Vector</p><p class="text-xs text-gray-300 font-medium mt-0.5">${t.account}</p></div>
                            <div><p class="text-[9px] text-blue-400 uppercase tracking-widest font-bold">Data String</p><p class="text-xs text-gray-300 font-medium mt-0.5 truncate">${t.note || 'No parameter data'}</p></div>
                        </div>
                        <div class="flex gap-2 justify-end mt-1">
                            <button onclick="duplicateTx('${t.id}')" class="flex items-center px-3 py-1.5 bg-white/5 text-gray-300 hover:bg-[#00e5ff]/20 hover:text-[#00e5ff] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"><i data-lucide="copy" class="w-3 h-3 mr-1"></i> Clone</button>
                            <button onclick="openEditModal('${t.id}')" class="flex items-center px-3 py-1.5 bg-white/5 text-gray-300 hover:bg-[#0ea5e9]/20 hover:text-[#0ea5e9] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"><i data-lucide="edit" class="w-3 h-3 mr-1"></i> Modify</button>
                            <button onclick="deleteTx('${t.id}')" class="flex items-center px-3 py-1.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-black rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"><i data-lucide="trash-2" class="w-3 h-3 mr-1"></i> Purge</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('') : `<div class="flex flex-col items-center justify-center py-16 opacity-40 w-full border border-dashed border-[#00e5ff]/30 rounded-2xl mt-4"><i data-lucide="database" class="w-10 h-10 mb-3 text-[#00e5ff]"></i><p class="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest">Data Matrix Empty.</p></div>`; 
    }
    renderIcons();
}

// ==============================================================================
// 15. MODAL & EDIT FUNCTIONS
// ==============================================================================
function openEditModal(id) { 
    const tx = transactions.find(t => t.id === id); 
    if (!tx) return; 
    document.getElementById('editId').value = tx.id; 
    document.getElementById('editAmount').value = tx.amount; 
    document.getElementById('editNote').value = tx.note; 
    const d = new Date(tx.timestamp); 
    document.getElementById('editDate').value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; 
    const selCat = document.getElementById('editCategory'); selCat.innerHTML = ''; 
    (tx.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).forEach(c => { selCat.innerHTML += `<option value="${c}">${c}</option>`; }); 
    selCat.value = tx.category; document.getElementById('editAccount').value = tx.account; 
    document.getElementById('editModal').classList.remove('hidden'); renderIcons(); 
}

function closeEditModal() { 
    document.getElementById('editModal').classList.add('hidden'); 
}

function saveEditTx() { 
    const id = document.getElementById('editId').value; 
    const tx = transactions.find(t => t.id === id); 
    if (!tx) return; 
    tx.amount = parseFloat(document.getElementById('editAmount').value) || 0; 
    tx.category = document.getElementById('editCategory').value; 
    tx.account = document.getElementById('editAccount').value; 
    tx.note = document.getElementById('editNote').value; 
    const dateInput = document.getElementById('editDate').value; 
    if (dateInput) { const d = new Date(dateInput); d.setHours(12); tx.timestamp = d.getTime(); } 
    saveTransactionsLocally(); updateUI(); closeEditModal(); 
}

function openEditWishlistModal(id, isMedia) { 
    const item = isMedia ? mediaItems.find(i => i.id === id) : wishlistItems.find(i => i.id === id); 
    if (!item) return; 
    document.getElementById('ewId').value = item.id; 
    document.getElementById('ewIsMedia').value = isMedia ? 'true' : 'false'; 
    document.getElementById('ewTitle').value = item.title || ''; 
    document.getElementById('ewPrice').value = item.price || 0; 
    document.getElementById('ewStore').value = isMedia ? (item.mediaGenre || '') : (item.category || ''); 
    document.getElementById('ewStoreLabel').innerText = isMedia ? 'Genre' : 'Store Name'; 
    document.getElementById('ewImage').value = item.imageUrl || ''; 
    const catSel = document.getElementById('ewCategory'); catSel.innerHTML = ''; 
    if (isMedia) { 
        ['Movie', 'Book', 'Series', 'Anime'].forEach(c => catSel.innerHTML += `<option value="${c}">${c}</option>`); 
        catSel.value = item.wishCategory; document.getElementById('ewMediaExtras').classList.remove('hidden'); 
        document.getElementById('ewStatus').value = item.mediaStatus || 'Planned'; 
        document.getElementById('ewRating').value = item.mediaRating || 'Unrated'; 
        if (item.mediaStatus === 'Completed') document.getElementById('ewRatingContainer').classList.remove('hidden'); 
        else document.getElementById('ewRatingContainer').classList.add('hidden'); 
        document.getElementById('ewStatus').onchange = (e) => { 
            if (e.target.value === 'Completed') document.getElementById('ewRatingContainer').classList.remove('hidden'); 
            else document.getElementById('ewRatingContainer').classList.add('hidden'); 
        }; 
    } else { 
        ['Gadgets', 'Apparel', 'Lifestyle', 'Books', 'Electronics', 'Gaming', 'Furniture', 'Travel', 'Vehicles', 'Health', 'Other'].forEach(c => catSel.innerHTML += `<option value="${c}">${c}</option>`); 
        catSel.value = item.wishCategory; document.getElementById('ewMediaExtras').classList.add('hidden'); 
    } 
    document.getElementById('editWishlistModal').classList.remove('hidden'); 
}

function closeEditWishlistModal() { 
    document.getElementById('editWishlistModal').classList.add('hidden'); 
}

function saveEditWishlist() { 
    const id = document.getElementById('ewId').value; 
    const isMedia = document.getElementById('ewIsMedia').value === 'true'; 
    const item = isMedia ? mediaItems.find(i => i.id === id) : wishlistItems.find(i => i.id === id); 
    if (!item) return; 
    item.title = document.getElementById('ewTitle').value; 
    item.price = parseFloat(document.getElementById('ewPrice').value) || 0; 
    if (isMedia) item.mediaGenre = document.getElementById('ewStore').value; else item.category = document.getElementById('ewStore').value; 
    item.wishCategory = document.getElementById('ewCategory').value; 
    item.imageUrl = document.getElementById('ewImage').value; 
    if (isMedia) { 
        item.mediaStatus = document.getElementById('ewStatus').value; 
        item.mediaRating = item.mediaStatus === 'Completed' ? document.getElementById('ewRating').value : 'Unrated'; 
        saveMediaLocally(); renderMedia(); 
    } else { 
        saveWishlistLocally(); renderWishlist(); 
    } 
    closeEditWishlistModal(); 
}

// ==============================================================================
// 16. WORKSPACE TEXT DRAFT ENGINE
// ==============================================================================
function saveTextDraft() { 
    const notesEl = document.getElementById('workspaceNotes'); 
    if (!notesEl || !notesEl.innerHTML.trim()) return; 
    let drafts = safeGetJSON('textDrafts', []); 
    drafts.unshift({ id: Date.now(), content: notesEl.innerHTML, date: new Date().toLocaleDateString('en-GB', {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) }); 
    if (drafts.length > 10) drafts.pop(); 
    localStorage.setItem('textDrafts', JSON.stringify(drafts)); 
    notesEl.innerHTML = ''; renderTextDrafts(); 
}

function renderTextDrafts() { 
    let drafts = safeGetJSON('textDrafts', []); 
    const grid = document.getElementById('textDraftsGrid'); 
    if (!grid) return; 
    if (drafts.length === 0) { grid.innerHTML = '<p class="text-gray-500 text-[10px] uppercase font-bold tracking-widest py-4">No logical drafts saved in memory.</p>'; return; } 
    grid.innerHTML = drafts.map(d => `
        <div class="glass-panel p-3 rounded-xl min-w-[200px] max-w-[200px] flex-shrink-0 cursor-pointer hover:border-[#00e5ff]/50" onclick="restoreTextDraft(${d.id})">
            <div class="flex justify-between items-center mb-2">
                <span class="text-[9px] text-[#00e5ff] font-bold uppercase tracking-widest">${d.date}</span>
                <button onclick="event.stopPropagation(); deleteTextDraft(${d.id})" class="text-[#ef4444] hover:text-white bg-white/5 p-1 rounded transition-colors"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>
            <div class="text-xs text-gray-300 line-clamp-4 overflow-hidden">${d.content.replace(/<[^>]*>?/gm, ' ')}</div>
        </div>
    `).join(''); 
    renderIcons(); 
}

function restoreTextDraft(id) { 
    let drafts = safeGetJSON('textDrafts', []); 
    const d = drafts.find(x => x.id === id); 
    if (d) { if (confirm("Restore this draft? Current active editor content will be overwritten.")) document.getElementById('workspaceNotes').innerHTML = d.content; } 
}

function deleteTextDraft(id) { 
    if (!confirm("Purge this draft permanently?")) return; 
    let drafts = safeGetJSON('textDrafts', []); 
    drafts = drafts.filter(x => x.id !== id); 
    localStorage.setItem('textDrafts', JSON.stringify(drafts)); renderTextDrafts(); 
}

// ==============================================================================
// 17. BULK SMS & CSV STATEMENT PARSER
// ==============================================================================
function openBulkSMSModal() { document.getElementById('bulkSmsModal').classList.remove('hidden'); renderIcons(); }
function closeBulkSMSModal() { document.getElementById('bulkSmsModal').classList.add('hidden'); document.getElementById('bulkSmsInput').value = ''; }
function processBulkSMS() { 
    const text = document.getElementById('bulkSmsInput').value; if (!text.trim()) return; 
    parseCSVToStaging(text, true); closeBulkSMSModal(); 
}

function handleCSVUpload(e) { 
    const file = e.target.files[0]; if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = function(evt) { const text = evt.target.result; parseCSVToStaging(text, false); }; 
    reader.readAsText(file); e.target.value = ''; 
}

function parseCSVToStaging(textData, isSms = false) { 
    const lines = textData.split('\n'); stagedCSVTransactions = []; 
    lines.forEach((line, i) => { 
        if (!line.trim()) return; 
        let d = Date.now(); let a = 0; let t = 'expense'; let n = line.substring(0, 60); 
        if (isSms) { 
            const amtMatch = line.match(/(?:rs\.?|inr)\s*([\d,]+\.?\d*)/i); 
            if (amtMatch) a = parseFloat(amtMatch[1].replace(/,/g, '')); 
            if (line.toLowerCase().includes('credited') || line.toLowerCase().includes('received')) t = 'income'; 
            const dateMatch = line.match(/(\d{2})[-/](\d{2})[-/](\d{2,4})/); 
            if (dateMatch) { let year = dateMatch[3].length === 2 ? '20'+dateMatch[3] : dateMatch[3]; d = new Date(`${year}-${dateMatch[2]}-${dateMatch[1]}`).getTime(); } 
        } else { 
            const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, '')); 
            if (cols.length < 3) return; 
            cols.forEach(c => { 
                const parsedDate = new Date(c); 
                if (!isNaN(parsedDate) && c.length > 5 && parsedDate.getFullYear() > 2000) d = parsedDate.getTime(); 
                const parsedAmt = parseFloat(c.replace(/[^0-9.-]+/g,"")); 
                if (!isNaN(parsedAmt) && parsedAmt > 0 && parsedAmt !== d && parsedAmt !== new Date().getFullYear()) a = Math.abs(parsedAmt); 
                if (c.toLowerCase().includes('credit') || c.toLowerCase().includes('cr')) t = 'income'; 
            }); 
        } 
        if (a === 0 || isNaN(a)) return; 
        const isDup = transactions.some(tx => Math.abs(tx.amount - a) < 0.01 && tx.type === t && Math.abs(tx.timestamp - d) < 172800000); 
        stagedCSVTransactions.push({ id: 'stage_' + i + '_' + Date.now(), date: new Date(d).toISOString().split('T')[0], amount: a, type: t, note: n, account: 'UPI', category: 'Other', isDuplicate: isDup }); 
    }); 
    if (stagedCSVTransactions.length === 0) { alert("System could not automatically extract exact amounts/dates from this format block."); return; } 
    renderCSVStaging(); document.getElementById('csvReviewModal').classList.remove('hidden'); 
}

function renderCSVStaging() { 
    const container = document.getElementById('csvStagingArea'); 
    container.innerHTML = stagedCSVTransactions.map(tx => `
        <div class="bg-black/60 p-4 rounded-xl border ${tx.isDuplicate ? 'border-orange-500/50' : 'border-[#10b981]/30'} mb-2 relative group transition-colors">
            ${tx.isDuplicate ? '<span class="absolute -top-2.5 -right-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)] uppercase tracking-wider">Warning: Duplicate Trace</span>' : ''}
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div><label class="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">Timestamp</label><input type="date" id="csv_date_${tx.id}" value="${tx.date}" class="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-[#00e5ff]"></div>
                <div><label class="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">Vector Type</label><select id="csv_type_${tx.id}" class="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white uppercase font-bold"><option value="expense" ${tx.type === 'expense' ? 'selected' : ''}>Outbound</option><option value="income" ${tx.type === 'income' ? 'selected' : ''}>Inbound</option></select></div>
                <div><label class="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">Value</label><input type="number" id="csv_amt_${tx.id}" value="${tx.amount}" class="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-[#10b981] font-black"></div>
                <div><label class="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">Class Array</label><select id="csv_cat_${tx.id}" class="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-xs text-white">${EXPENSE_CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
                <div class="flex items-center gap-2"><div class="flex-grow"><label class="block text-[8px] text-gray-500 uppercase tracking-widest mb-1">Metadata</label><input type="text" id="csv_note_${tx.id}" value="${tx.note}" class="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-[10px] text-gray-300 truncate"></div><button onclick="removeStagedCSV('${tx.id}')" class="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-black p-2 rounded transition-colors mt-3 border border-[#ef4444]/30"><i data-lucide="trash-2" class="w-3 h-3"></i></button></div>
            </div>
        </div>
    `).join(''); 
    renderIcons(); 
}

function removeStagedCSV(id) { 
    stagedCSVTransactions = stagedCSVTransactions.filter(tx => tx.id !== id); 
    renderCSVStaging(); 
    if (stagedCSVTransactions.length === 0) closeCSVModal(); 
}

function closeCSVModal() { 
    document.getElementById('csvReviewModal').classList.add('hidden'); 
    stagedCSVTransactions = []; 
}

function commitCSVImport() { 
    let addedCount = 0; 
    stagedCSVTransactions.forEach(tx => { 
        const dateVal = document.getElementById(`csv_date_${tx.id}`).value; 
        const amtVal = parseFloat(document.getElementById(`csv_amt_${tx.id}`).value); 
        if (isNaN(amtVal) || amtVal <= 0) return; 
        const d = new Date(dateVal); d.setHours(12); 
        const newTx = { id: String(Date.now() + Math.floor(Math.random() * 10000)), type: document.getElementById(`csv_type_${tx.id}`).value, amount: amtVal, category: document.getElementById(`csv_cat_${tx.id}`).value, account: 'UPI', note: document.getElementById(`csv_note_${tx.id}`).value, timestamp: d.getTime(), isRecurring: false }; 
        transactions.push(newTx); addedCount++; 
    }); 
    saveTransactionsLocally(); updateUI(); closeCSVModal(); alert(`System injected ${addedCount} transactions to Ledger.`); 
}

// ==============================================================================
// 18. API & SERVER SYNC FUNCTIONS
// ==============================================================================
async function syncDataFromServer() { 
    try { 
        updateUI(); 
        if (typeof renderWishlist === 'function') renderWishlist(); 
        if (typeof renderMedia === 'function') renderMedia(); 
        
        const [txRes, wRes] = await Promise.all([ 
            fetch(`${API_BASE}/get-transactions`, {cache:'no-store'}).catch(e => null), 
            fetch(`${API_BASE}/get-wishlist`, {cache:'no-store'}).catch(e => null) 
        ]); 
        
        if (txRes && txRes.ok) { 
            const dbTx = (await txRes.json() || []).map(normalizeTransaction); 
            const m = new Map(transactions.map(t => [String(t.id), normalizeTransaction(t)])); 
            dbTx.forEach(t => m.set(String(t.id), normalizeTransaction(t))); 
            transactions = Array.from(m.values()).filter(t => Number.isFinite(t.amount) && t.timestamp); 
            saveTransactionsLocally(); 
        } 
        
        if (wRes && wRes.ok) { 
            const allWish = await wRes.json(); 
            if (Array.isArray(allWish)) { 
                wishlistItems = allWish.filter(w => !w.isMedia); 
                mediaItems = allWish.filter(w => w.isMedia); 
                saveMediaLocally(); 
                saveWishlistLocally(); 
            } 
        } 
    } catch(e) {
        console.log("Notice: Offline storage state active.");
    } finally { 
        saveTransactionsLocally(); 
        updateUI(); 
        if (typeof renderWishlist === 'function') renderWishlist(); 
        if (typeof renderMedia === 'function') renderMedia(); 
    } 
}

async function loadPendingTransactions() { 
    try { 
        const res = await fetch(`${API_BASE}/pending`); 
        if (res.ok) renderPendingUI(await res.json()); 
    } catch (e) {} 
}

function renderPendingUI(pendingTxns) { 
    const container = document.getElementById('pendingContainer'); 
    const list = document.getElementById('pending-list'); 
    if (!pendingTxns || pendingTxns.length === 0) { if (container) container.classList.add('hidden'); return; } 
    if (container) container.classList.remove('hidden'); 
    if (list) list.innerHTML = ''; 
    pendingTxns.forEach(txn => { 
        const isI = txn.type === 'income'; 
        list.innerHTML += `<div class="bg-black/60 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 border border-white/10 shadow-inner"><div class="flex-1 min-w-0"><div class="flex justify-between md:block"><span class="text-sm font-bold text-gray-200 capitalize truncate">${txn.sender || txn.merchant || 'Bank SMS'}</span><span class="font-black text-base md:hidden ${isI ? 'text-emerald-400' : 'text-rose-400'}">${isI ? '+' : '-'}₹${txn.amount}</span></div><p class="text-[10px] text-[#00e5ff] uppercase tracking-widest font-bold mt-1 inline-flex items-center bg-[#00e5ff]/10 px-2 py-1 rounded border border-[#00e5ff]/20 shadow-sm flex-shrink-0"><i data-lucide="sparkles" class="w-3 h-3 mr-1"></i> C.A.S.P.E.R. Tag: <span class="capitalize tracking-normal ml-1 truncate max-w-[150px]">${txn.category || 'Other'}</span></p><p class="text-gray-400 text-xs mt-2 italic font-medium tracking-wide break-words line-clamp-2">"${txn.rawMessage}"</p></div><div class="flex items-center justify-between md:justify-end md:space-x-4"><span class="hidden md:inline font-black text-xl mr-2 ${isI ? 'text-emerald-400' : 'text-rose-500'}">${isI ? '+' : '-'}₹${txn.amount}</span><div class="flex space-x-2 w-full md:w-auto"><button onclick="handleDecision('${txn.id}', 'reject')" class="flex-1 md:flex-none px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-rose-500/30 uppercase tracking-wider">Reject</button><button onclick="handleDecision('${txn.id}', 'approve')" class="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-emerald-500/30 uppercase tracking-wider">Approve</button></div></div></div>`; 
    }); 
    renderIcons(); 
}

async function handleDecision(id, action) { 
    try { 
        const res = await fetch(`${API_BASE}/${action}`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ id: id }) }); 
        const result = await res.json(); 
        if (result.success) { 
            if (action === 'approve' && result.data) { 
                transactions.push(result.data); 
                saveTransactionsLocally(); 
                updateUI(); 
            } 
            loadPendingTransactions(); 
        } 
    } catch (error) {} 
}

// ==============================================================================
// 19. C.A.S.P.E.R. AI LOGIC
// ==============================================================================
async function getCASPERInsights() { 
    const term = document.getElementById('aiTerminal'); const btn = document.getElementById('aiButton'); 
    if (btn) btn.disabled = true; clearTimeout(aiTypingTimer); 
    if (term) { term.classList.remove('hidden'); term.innerHTML = '<div class="flex flex-col items-center justify-center h-full opacity-60"><i data-lucide="cpu" class="w-10 h-10 mb-3 text-[#00e5ff] animate-pulse"></i><p class="text-center font-bold text-[10px] uppercase tracking-widest text-[#00e5ff]">Processing vectors...</p></div>'; renderIcons(); } 
    try { 
        const res = await fetch(`${API_BASE}/jarvis-advice`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ transactions: transactions, monthlyBudget: monthlyBudgets[selectedMonth]||25000 }) }); 
        const data = await res.json(); 
        if (term) { 
            term.innerHTML = ''; let i = 0; const txt = data.advice; 
            function typeWriter() { 
                if (i < txt.length) { term.innerHTML += txt.charAt(i); i++; aiTypingTimer = setTimeout(typeWriter, 15); } 
                else { if (btn) btn.disabled = false; } 
            } 
            typeWriter(); 
        } 
    } catch (err) { 
        if (term) term.innerHTML = '<span class="text-red-400">Mainframe Offline.</span>'; 
        if (btn) btn.disabled = false; 
    } 
}

async function getCASPERForecast() { 
    const term = document.getElementById('aiTerminal'); const btn = document.getElementById('aiForecastBtn'); 
    if (btn) btn.disabled = true; clearTimeout(aiTypingTimer); 
    if (term) { term.classList.remove('hidden'); term.innerHTML = '<div class="flex flex-col items-center justify-center h-full opacity-60"><i data-lucide="cpu" class="w-10 h-10 mb-3 text-[#00e5ff] animate-pulse"></i><p class="text-center font-bold text-[10px] uppercase tracking-widest text-[#00e5ff]">Computing trajectory...</p></div>'; renderIcons(); } 
    try { 
        const now = new Date(); const currM = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`; const prevM = `${now.getMonth()===0 ? now.getFullYear()-1 : now.getFullYear()}-${String(now.getMonth()===0 ? 12 : now.getMonth()).padStart(2,'0')}`; 
        const currData = transactions.filter(t => t.type==='expense' && `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === currM); 
        const prevData = transactions.filter(t => t.type==='expense' && `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}` === prevM); 
        const res = await fetch(`${API_BASE}/jarvis-predict`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ currentMonthData: currData, previousMonthData: prevData, currentBudget: monthlyBudgets[selectedMonth]||25000 }) }); 
        const data = await res.json(); 
        if (term) term.innerHTML = data.report; 
        if (btn) btn.disabled = false; 
    } catch (err) { 
        if (term) term.innerHTML = '<span class="text-red-400">Prediction Engine Offline.</span>'; 
        if (btn) btn.disabled = false; 
    } 
}

async function openAIReport() { 
    if (document.getElementById('aiReportModal')) document.getElementById('aiReportModal').classList.remove('hidden'); 
    if (document.getElementById('aiReportContent')) document.getElementById('aiReportContent').innerHTML = '<div class="flex flex-col items-center py-12 opacity-60"><i data-lucide="cpu" class="w-12 h-12 mb-4 text-[#00e5ff] animate-pulse"></i><p class="font-bold uppercase tracking-widest text-[#00e5ff] text-sm">C.A.S.P.E.R. is compiling...</p></div>'; 
    renderIcons(); 
    if (reportCharts) Object.values(reportCharts).forEach(c => c.destroy()); 
    reportCharts = {}; 
    const getCatData = (txs) => { const data = {}; txs.filter(t=>t.type==='expense').forEach(t => data[t.category] = (data[t.category]||0)+t.amount); return Object.entries(data).sort((a,b)=>b[1]-a[1]); }; 
    const getTimelineData = (txs) => { const dates = {}; [...txs].sort((a,b)=>a.timestamp-b.timestamp).forEach(t => { const d = new Date(t.timestamp); const m = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; if (!dates[m]) dates[m] = {i:0,e:0}; t.type === 'income' ? dates[m].i += t.amount : dates[m].e += t.amount; }); const labels = Object.keys(dates); return { labels, inc: labels.map(l=>dates[l].i), exp: labels.map(l=>dates[l].e) }; }; 
    const filtered = transactions.filter(t => selectedMonth === 'all' || `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth() + 1).padStart(2, '0')}` === selectedMonth); 
    const monthCats = getCatData(filtered), allCats = getCatData(transactions), monthTime = getTimelineData(filtered), allTime = getTimelineData(transactions); 
    const cOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }; 
    const pOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels:{color:'#9ca3af', font:{family:'Fredoka', size: 10}} } } }; 
    
    const elReportPieM = document.getElementById('reportPieMonth'); if (elReportPieM) reportCharts.pieMonth = new Chart(elReportPieM, { type: 'doughnut', data: { labels: monthCats.map(c=>c[0]), datasets: [{ data: monthCats.map(c=>c[1]), backgroundColor: monthCats.map(c=>getColor(c[0])), borderWidth: 0 }] }, options: pOpts }); 
    const elReportBarM = document.getElementById('reportBarMonth'); if (elReportBarM) reportCharts.barMonth = new Chart(elReportBarM, { type: 'bar', data: { labels: monthCats.slice(0,7).map(c=>c[0]), datasets: [{ label: 'Expenses', data: monthCats.slice(0,7).map(c=>c[1]), backgroundColor: '#ef4444', borderRadius:4 }] }, options: cOpts }); 
    const elReportPieA = document.getElementById('reportPieAll'); if (elReportPieA) reportCharts.pieAll = new Chart(elReportPieA, { type: 'doughnut', data: { labels: allCats.map(c=>c[0]), datasets: [{ data: allCats.map(c=>c[1]), backgroundColor: allCats.map(c=>getColor(c[0])), borderWidth: 0 }] }, options: pOpts }); 
    const elReportBarA = document.getElementById('reportBarAll'); if (elReportBarA) reportCharts.barAll = new Chart(elReportBarA, { type: 'bar', data: { labels: allTime.labels, datasets: [ { label:'Income', data:allTime.inc, backgroundColor:'#10b981', borderRadius:4 }, { label:'Expense', data:allTime.exp, backgroundColor:'#ef4444', borderRadius:4 } ] }, options: cOpts }); 
    const rCats = ['Food & Dining', 'Transport', 'Shopping', 'Utilities', 'Subscriptions']; 
    const elRadarM = document.getElementById('reportRadarMonth'); if (elRadarM) reportCharts.radarMonth = new Chart(elRadarM, { type: 'radar', data: { labels: rCats, datasets: [{ data: rCats.map(c => monthCats.find(m => m[0] === c)?.[1] || 0), backgroundColor: 'rgba(0, 229, 255, 0.4)', borderColor: '#00e5ff', borderWidth: 2 }] }, options: cOpts }); 
    const elRadarA = document.getElementById('reportRadarAll'); if (elRadarA) reportCharts.radarAll = new Chart(elRadarA, { type: 'radar', data: { labels: rCats, datasets: [{ data: rCats.map(c => allCats.find(m => m[0] === c)?.[1] || 0), backgroundColor: 'rgba(16, 185, 129, 0.4)', borderColor: '#10b981', borderWidth: 2 }] }, options: cOpts }); 
    const elTrendM = document.getElementById('reportTrendMonth'); if (elTrendM) reportCharts.trendMonth = new Chart(elTrendM, { type: 'line', data: { labels: monthTime.labels, datasets: [ { label:'Inc', data:monthTime.inc, borderColor:'#10b981' }, { label:'Exp', data:monthTime.exp, borderColor:'#ef4444' } ] }, options: cOpts }); 
    const elTrendA = document.getElementById('reportTrendAll'); if (elTrendA) reportCharts.trendAll = new Chart(elTrendA, { type: 'line', data: { labels: allTime.labels, datasets: [ { label:'Inc', data:allTime.inc, borderColor:'#10b981', fill:true, backgroundColor:'rgba(16, 185, 129, 0.2)' }, { label:'Exp', data:allTime.exp, borderColor:'#ef4444', fill:true, backgroundColor:'rgba(239, 68, 68, 0.2)' } ] }, options: cOpts }); 
    
    const mSums = {}; transactions.forEach(t => { const m = `${new Date(t.timestamp).getFullYear()}-${String(new Date(t.timestamp).getMonth()+1).padStart(2,'0')}`; if (!mSums[m]) mSums[m] = { inc:0, exp:0, cats:{} }; t.type === 'income' ? mSums[m].inc += t.amount : (mSums[m].exp += t.amount, mSums[m].cats[t.category] = (mSums[m].cats[t.category]||0)+t.amount); }); 
    try { 
        const res = await fetch(`${API_BASE}/jarvis-report`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ compiledMonths: mSums, monthlyBudget: monthlyBudgets[selectedMonth]||25000, selectedMonth: selectedMonth }) }); 
        if (document.getElementById('aiReportContent')) document.getElementById('aiReportContent').innerHTML = (await res.json()).report; 
    } catch(e) { 
        if (document.getElementById('aiReportContent')) document.getElementById('aiReportContent').innerHTML = '<span class="text-red-400">Process Failed. Offline Mode Active.</span>'; 
    } 
}

function closeAIReport() { 
    document.getElementById('aiReportModal').classList.add('hidden'); 
}

// ==============================================================================
// 20. PDF & EXCEL EXPORTS
// ==============================================================================
function exportReportPDF() { 
    const doc = new window.jspdf.jsPDF(); doc.setFontSize(16); doc.text("C.A.S.P.E.R. Report", 14, 15); doc.setFontSize(10); 
    if (document.getElementById('aiReportContent')) doc.text(doc.splitTextToSize(document.getElementById('aiReportContent').innerText, 180), 14, 25); 
    doc.save('CASPER_Report.pdf'); 
}

function exportReportExcel() { 
    const wb = XLSX.utils.book_new(); 
    if (document.getElementById('aiReportContent')) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(document.getElementById('aiReportContent').innerText.split('\n').filter(t=>t.trim()).map(t=>({"AI Insight":t}))), "Analysis"); 
    XLSX.writeFile(wb, "CASPER_Report.xlsx"); 
}

// ==============================================================================
// 21. WORKSPACE: WHITEBOARD & CANVAS LOGIC
// ==============================================================================
function loadWorkspace() {
    try { renderKeepNotes(); } catch(e) {}
    try { renderTextDrafts(); } catch(e) {}
    try { 
        fetch(`${API_BASE}/get-workspace`)
            .then(res => { if (res.ok) return res.json(); })
            .then(data => { 
                if (data && data.notes && document.getElementById('workspaceNotes')) document.getElementById('workspaceNotes').innerHTML = data.notes; 
                if (data && data.whiteboard && document.getElementById('whiteboardCanvas')) { 
                    const canvas = document.getElementById('whiteboardCanvas'); 
                    const img = new Image(); 
                    img.onload = () => canvas.getContext('2d').drawImage(img, 0, 0); 
                    img.src = data.whiteboard; 
                } 
            }).catch(e => null); 
    } catch(e) {} 
    try { renderRecentSaves(); } catch(e) {}
}

function exportWorkspacePDF() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF(); doc.setFontSize(12);
    const wText = document.getElementById('workspaceNotes') ? document.getElementById('workspaceNotes').innerText : ''; 
    let notes = safeGetJSON('keepNotes', []); 
    let kText = notes.map(n => (n.title ? n.title.toUpperCase() + '\n' : '') + n.body + '\n---').join('\n\n');
    const fullText = "DEEP WORKSPACE NOTES\n\n" + wText + "\n\n\nMEMORY CARDS\n\n" + kText; 
    doc.text(doc.splitTextToSize(fullText, 180), 10, 10); 
    doc.save('CASPER_Workspace.pdf');
}

function deleteLastSync() { 
    if (confirm("Delete the most recent workspace canvas save?")) { 
        let history = safeGetJSON('workspaceHistory', []); 
        if (history.length > 0) { history.shift(); localStorage.setItem('workspaceHistory', JSON.stringify(history)); renderRecentSaves(); } 
    } 
}

function renderRecentSaves() { 
    const history = safeGetJSON('workspaceHistory', []); 
    const grid = document.getElementById('recentSavesGrid'); 
    if (!grid) return; 
    if (history.length === 0) { grid.innerHTML = `<p class="text-gray-500 text-[10px] uppercase font-bold tracking-widest py-4">No canvas drafts saved.</p>`; return; } 
    grid.innerHTML = history.map((h, i) => `<div onclick="restoreWorkspace(${i})" class="glass-panel p-3 rounded-xl min-w-[200px] max-w-[200px] flex-shrink-0 cursor-pointer hover:border-[#00e5ff]/50"><div class="flex justify-between items-center mb-2"><span class="text-[9px] text-[#00e5ff] font-bold uppercase tracking-widest">${h.date}</span></div>${h.whiteboard && h.whiteboard.length > 50 ? `<div class="h-20 w-full opacity-70 bg-center bg-cover bg-no-repeat rounded-lg border border-white/10" style="background-image: url('${h.whiteboard}')"></div>` : `<div class="h-20 w-full flex items-center justify-center text-[#00e5ff] border border-white/5 rounded-lg"><i data-lucide="pen-tool" class="w-6 h-6"></i></div>`}</div>`).join(''); 
    renderIcons(); 
}

function restoreWorkspace(index) { 
    if (confirm("Restore this canvas draft? Current whiteboard content will be overwritten.")) { 
        const history = safeGetJSON('workspaceHistory', []); 
        const data = history[index]; 
        if (data && data.whiteboard && document.getElementById('whiteboardCanvas')) { 
            const canvas = document.getElementById('whiteboardCanvas'); 
            const img = new Image(); 
            img.onload = () => { canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height); canvas.getContext('2d').drawImage(img, 0, 0); }; 
            img.src = data.whiteboard; 
        } 
    } 
}

function saveWbDraft() {
    let wbData = ''; 
    if (document.getElementById('whiteboardCanvas')) wbData = document.getElementById('whiteboardCanvas').toDataURL(); 
    if (!wbData || wbData.length < 50) return; 
    let history = safeGetJSON('workspaceHistory', []); 
    history.unshift({ id: Date.now(), date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}), whiteboard: wbData }); 
    if (history.length > 8) history.pop(); 
    localStorage.setItem('workspaceHistory', JSON.stringify(history)); 
    renderRecentSaves();
}

function toggleWhiteboardFullscreen() {
    const wbContainer = document.getElementById('whiteboardContainer'); 
    if (!wbContainer) return; 
    wbContainer.classList.toggle('fullscreen-wb');
    setTimeout(() => { 
        const canvas = document.getElementById('whiteboardCanvas'); 
        if (canvas) { 
            const ctx = canvas.getContext('2d'); 
            const rect = canvas.getBoundingClientRect(); 
            const temp = ctx.getImageData(0,0,canvas.width, canvas.height); 
            canvas.width = rect.width; 
            canvas.height = rect.height; 
            ctx.putImageData(temp, 0, 0); 
        } 
    }, 300);
}

function insertChecklist() { 
    const id = 'chk_' + Date.now(); 
    const html = `<div class="chk-item"><input type="checkbox" id="${id}"><label for="${id}" contenteditable="true">New Task</label></div>`; 
    document.execCommand('insertHTML', false, html); 
    saveWorkspace(); 
}

function applyFontSize(val) { 
    document.execCommand("fontSize", false, "7"); 
    const fontElements = document.getElementById('workspaceNotes').getElementsByTagName("font"); 
    for (let i = 0, len = fontElements.length; i < len; ++i) { 
        if (fontElements[i].size == "7") { fontElements[i].removeAttribute("size"); fontElements[i].style.fontSize = val + "px"; } 
    } 
}

function adjustFontSize(change) { 
    const input = document.getElementById('wsFontSizeInput'); 
    if (input) { 
        let val = parseInt(input.value) + change; 
        if (val >= 8 && val <= 72) { input.value = val; applyFontSize(val); } 
    } 
}

function applyFontColor(color) { 
    document.execCommand('styleWithCSS', false, true); 
    document.execCommand('foreColor', false, color); 
}

async function saveWorkspace() {
    const notesEl = document.getElementById('workspaceNotes'); 
    if (!notesEl) return;
    notesEl.querySelectorAll('input[type="checkbox"]').forEach(cb => { 
        if (cb.checked) cb.setAttribute('checked', 'checked'); 
        else cb.removeAttribute('checked'); 
    });
    const saveBtn = document.querySelector('button[onclick="saveWorkspace()"]'); 
    let origText = ''; 
    if (saveBtn) { origText = saveBtn.innerHTML; saveBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i> Syncing'; renderIcons(); }
    let wbData = ''; 
    if (document.getElementById('whiteboardCanvas')) wbData = document.getElementById('whiteboardCanvas').toDataURL();
    try { 
        await fetch(`${API_BASE}/save-workspace`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ notes: notesEl.innerHTML, whiteboard: wbData }) }); 
        if (saveBtn) saveBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 mr-2"></i> Synced!'; 
    } catch(e) { 
        if (saveBtn) saveBtn.innerHTML = '<i data-lucide="x" class="w-4 h-4 mr-2"></i> Error'; 
    }
    renderIcons(); 
    setTimeout(() => { if (saveBtn) saveBtn.innerHTML = origText; renderIcons(); }, 2000);
}

function saveWbState() { 
    if (document.getElementById('whiteboardCanvas')) { 
        const canvas = document.getElementById('whiteboardCanvas'); 
        wbHistory.push(canvas.toDataURL()); 
        if (wbHistory.length > 20) wbHistory.shift(); 
    } 
}

function undoWhiteboard() { 
    if (wbHistory && wbHistory.length > 0 && document.getElementById('whiteboardCanvas')) { 
        wbHistory.pop(); 
        const canvas = document.getElementById('whiteboardCanvas'); 
        const ctx = canvas.getContext('2d'); 
        ctx.clearRect(0,0, canvas.width, canvas.height); 
        if (wbHistory.length > 0) { 
            const img = new Image(); 
            img.onload = () => ctx.drawImage(img, 0, 0); 
            img.src = wbHistory[wbHistory.length - 1]; 
        } 
    } 
}

// ==============================================================================
// 22. WHITEBOARD DRAWING PHYSICS
// ==============================================================================
function initWhiteboard() { 
    const canvas = document.getElementById('whiteboardCanvas'); 
    if (!canvas) return; 
    const ctx = canvas.getContext('2d'); 
    const rect = canvas.parentElement.getBoundingClientRect(); 
    if (canvas.width !== rect.width || canvas.height !== rect.height) { 
        canvas.width = rect.width; 
        canvas.height = rect.height; 
        if (wbHistory.length > 0) { 
            const img = new Image(); 
            img.onload = () => ctx.drawImage(img, 0, 0); 
            img.src = wbHistory[wbHistory.length - 1]; 
        } 
    } 
    if (wbHistory.length === 0) saveWbState(); 
    
    canvas.removeEventListener('mousedown', startPos); 
    canvas.removeEventListener('mousemove', draw); 
    canvas.removeEventListener('mouseup', endPos); 
    canvas.removeEventListener('mouseout', endPos); 
    
    canvas.addEventListener('mousedown', startPos); 
    canvas.addEventListener('mousemove', draw); 
    canvas.addEventListener('mouseup', endPos); 
    canvas.addEventListener('mouseout', endPos); 
    
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPos(e.touches[0]); }, {passive:false}); 
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); }, {passive:false}); 
    canvas.addEventListener('touchend', endPos); 

    function startPos(e) { 
        const bcr = canvas.getBoundingClientRect(); 
        const scaleX = canvas.width / bcr.width; 
        const scaleY = canvas.height / bcr.height; 
        const x = ((e.clientX ?? e.touches[0].clientX) - bcr.left) * scaleX; 
        const y = ((e.clientY ?? e.touches[0].clientY) - bcr.top) * scaleY; 

        if (isTextMode) { 
            const text = prompt("Enter Text Designation:"); 
            if (text) { 
                saveWbState(); 
                ctx.font = `${document.getElementById('wbFontSize')?document.getElementById('wbFontSize').value:24}px ${document.getElementById('wbFontFamily')?document.getElementById('wbFontFamily').value:'Fredoka'}`; 
                ctx.fillStyle = penColor; 
                ctx.fillText(text, x, y); 
            } 
            return; 
        } 
        
        isDrawing = true; 
        saveWbState(); 
        startX = x; 
        startY = y; 
        savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); 
        if (['pen', 'highlighter', 'eraser'].includes(currentTool)) { 
            ctx.beginPath(); 
            ctx.moveTo(startX, startY); 
            draw(e); 
        } 
    } 

    function draw(e) { 
        if (!isDrawing || isTextMode) return; 
        const bcr = canvas.getBoundingClientRect(); 
        const scaleX = canvas.width / bcr.width; 
        const scaleY = canvas.height / bcr.height; 
        const x = ((e.clientX ?? e.touches[0].clientX) - bcr.left) * scaleX; 
        const y = ((e.clientY ?? e.touches[0].clientY) - bcr.top) * scaleY; 
        
        ctx.lineWidth = penWidth; 
        ctx.lineCap = 'round'; 
        ctx.lineJoin = 'round'; 
        
        if (currentTool === 'eraser') { 
            ctx.globalCompositeOperation = 'destination-out'; 
            ctx.strokeStyle = 'rgba(0,0,0,1)'; 
        } else if (currentTool === 'highlighter') { 
            ctx.globalCompositeOperation = 'source-over'; 
            let c = /^#([A-Fa-f0-9]{3}){1,2}$/.test(penColor) ? penColor.substring(1).split('') : null; 
            if (c) { 
                if (c.length==3) c=[c[0],c[0],c[1],c[1],c[2],c[2]]; 
                c='0x'+c.join(''); 
                ctx.strokeStyle = `rgba(${(c>>16)&255}, ${(c>>8)&255}, ${c&255}, 0.4)`; 
            } else { 
                ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)'; 
            } 
        } else { 
            ctx.globalCompositeOperation = 'source-over'; 
            ctx.strokeStyle = penColor; 
        } 
        
        if (['pen', 'highlighter', 'eraser'].includes(currentTool)) { 
            ctx.lineTo(x, y); 
            ctx.stroke(); 
        } else { 
            ctx.putImageData(savedImageData, 0, 0); 
            ctx.beginPath(); 
            if (currentTool === 'line') { ctx.moveTo(startX, startY); ctx.lineTo(x, y); } 
            else if (currentTool === 'rect') { ctx.rect(startX, startY, x - startX, y - startY); } 
            else if (currentTool === 'circle') { ctx.arc(startX, startY, Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)), 0, 2 * Math.PI); } 
            else if (currentTool === 'arrow') { 
                const angle = Math.atan2(y - startY, x - startX); 
                ctx.moveTo(startX, startY); ctx.lineTo(x, y); 
                ctx.lineTo(x - 15 * Math.cos(angle - Math.PI / 6), y - 15 * Math.sin(angle - Math.PI / 6)); 
                ctx.moveTo(x, y); ctx.lineTo(x - 15 * Math.cos(angle + Math.PI / 6), y - 15 * Math.sin(angle + Math.PI / 6)); 
            } 
            ctx.stroke(); 
        } 
    } 
    function endPos() { if (isDrawing) { isDrawing = false; ctx.beginPath(); } } 
}

function setTool(tool) { 
    currentTool = tool; 
    isTextMode = false; 
    if (tool === 'eraser') { if (document.getElementById('wbWidthSlider')) document.getElementById('wbWidthSlider').value = 20; penWidth = 20; } 
    else if (tool === 'highlighter') { if (document.getElementById('wbWidthSlider')) document.getElementById('wbWidthSlider').value = 15; penWidth = 15; } 
    else if (tool === 'pen') { if (document.getElementById('wbWidthSlider')) document.getElementById('wbWidthSlider').value = 2; penWidth = 2; } 
    
    document.querySelectorAll('.wb-tool').forEach(btn => btn.classList.remove('tool-active')); 
    const activeBtn = document.getElementById('tool-' + tool); 
    if (activeBtn) activeBtn.classList.add('tool-active'); 
}

function setTextMode() { 
    isTextMode = true; 
    currentTool = 'text'; 
    document.querySelectorAll('.wb-tool').forEach(btn => btn.classList.remove('tool-active')); 
    if (document.getElementById('tool-text')) document.getElementById('tool-text').classList.add('tool-active'); 
}

function setPenWidth(w) { penWidth = w; }

function setPenColor(c) { 
    penColor = c; 
    if (document.getElementById('wbColorPicker')) document.getElementById('wbColorPicker').value = c; 
    if (currentTool === 'eraser' || isTextMode) { isTextMode = false; setTool('pen'); } 
}

function clearWhiteboard() { 
    if (confirm("Clear entire whiteboard buffer?")) { 
        saveWbState(); 
        if (document.getElementById('whiteboardCanvas')) document.getElementById('whiteboardCanvas').getContext('2d').clearRect(0, 0, 10000, 10000); 
    } 
}

// ==============================================================================
// 23. C.A.S.P.E.R. CHAT SYSTEM
// ==============================================================================
function toggleCasper() { 
    const chatWindow = document.getElementById('casperChatWindow'); 
    if (chatWindow.classList.contains('hidden')) { chatWindow.classList.remove('hidden'); chatWindow.classList.add('flex', 'animate-slide-up'); } 
    else { chatWindow.classList.add('hidden'); chatWindow.classList.remove('flex', 'animate-slide-up'); } 
}

function sendCasperMessage() { 
    const input = document.getElementById('casperInput'); 
    const msg = input.value.trim(); 
    if (!msg) return; 
    
    const body = document.getElementById('casperChatBody'); 
    body.innerHTML += `<div class="bg-black/60 border border-[#00e5ff]/40 p-3 rounded-xl rounded-tr-none w-10/12 ml-auto text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]">${msg}</div>`; 
    input.value = ''; 
    body.scrollTop = body.scrollHeight; 
    
    setTimeout(() => { 
        const loaderId = 'loader_' + Date.now(); 
        body.innerHTML += `<div id="${loaderId}" class="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-3 rounded-xl rounded-tl-none w-10/12 text-[#00e5ff] flex items-center gap-2"><i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Processing...</div>`; 
        renderIcons(); 
        body.scrollTop = body.scrollHeight; 
        
        setTimeout(() => { 
            document.getElementById(loaderId).remove(); 
            let responseText = "I have received your command. Logged: '" + msg + "'."; 
            const mLower = msg.toLowerCase(); 
            if (mLower.includes("explain") || mLower.includes("help") || mLower.includes("how to")) {
                responseText = "Welcome to Wally MK 3. <br><br><b>Dashboard:</b> Cashflow and telemetry analytics.<br><b>Investments:</b> Projections, debt clearance & FIRE metrics.<br><b>Wishlist:</b> Save target goals and savings speeds.<br><b>Vault:</b> Track media nodes.<br><b>Workspace:</b> Drafts and canvas focus space.<br><b>Growth:</b> Weakness analysis and automated countermeasures.<br><br>Use the 'Smart Entry' block on the Dashboard to paste SMS or CSV statements."; 
            }
            body.innerHTML += `<div class="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-3 rounded-xl rounded-tl-none w-10/12 text-[#00e5ff] shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">${responseText}</div>`; 
            body.scrollTop = body.scrollHeight; 
        }, 1500); 
    }, 400); 
}

// ==============================================================================
// 24. GROWTH & SELF-IMPROVEMENT LOGIC
// ==============================================================================
function addGrowthItem() { 
    const descInput = document.getElementById('growthDesc'); 
    const desc = descInput.value.trim(); 
    if (!desc) return; 

    const newItem = { id: 'growth_' + Date.now(), desc: desc, timestamp: Date.now() }; 
    growthItems.push(newItem); 
    localStorage.setItem('walletGrowthBackup', JSON.stringify(growthItems)); 
    descInput.value = ''; 
    renderGrowthList(); 
}

function renderGrowthList() { 
    const list = document.getElementById('growthList'); 
    if (!list) return; 
    if (growthItems.length === 0) { 
        list.innerHTML = `<p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center py-4">No active targets defined.</p>`; 
        return; 
    } 
    list.innerHTML = growthItems.map(item => `
        <div class="bg-black/60 border border-white/5 p-4 rounded-xl flex justify-between items-center gap-4 transition-colors hover:border-[#10b981]/50">
            <div class="flex-1 min-w-0">
                <p class="text-xs text-white font-bold truncate">${item.desc}</p>
                <p class="text-[9px] text-gray-500 uppercase tracking-widest mt-1">${new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="flex gap-2 shrink-0">
                <button onclick="generateCountermeasure('${item.id}')" class="bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-[0_0_10px_rgba(0,229,255,0.2)]"><i data-lucide="cpu" class="w-3 h-3 inline mr-1"></i> Analyze</button>
                <button onclick="deleteGrowthItem('${item.id}')" class="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444] hover:text-white p-1.5 rounded-lg transition-colors border border-[#ef4444]/30"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
            </div>
        </div>
    `).join(''); 
    renderIcons(); 
}

function deleteGrowthItem(id) { 
    growthItems = growthItems.filter(i => i.id !== id); 
    localStorage.setItem('walletGrowthBackup', JSON.stringify(growthItems)); 
    renderGrowthList(); 
}

function saveTimetable(val) { 
    localStorage.setItem('walletGrowthTimetable', val); 
}

function generateCountermeasure(id) { 
    const item = growthItems.find(i => i.id === id); 
    if (!item) return; 
    const term = document.getElementById('growthTerminal'); 
    if (!term) return; 

    term.innerHTML = '<div class="flex flex-col items-center justify-center h-full opacity-60"><i data-lucide="cpu" class="w-12 h-12 mb-3 text-[#00e5ff] animate-pulse"></i><p class="text-center font-bold text-xs uppercase tracking-widest text-[#00e5ff]">Synthesizing Countermeasures...</p></div>'; 
    renderIcons(); 

    setTimeout(() => { 
        let advice = ""; 
        const lowerDesc = item.desc.toLowerCase(); 

        if (lowerDesc.includes("bike") || lowerDesc.includes("riding")) { 
            advice = "<h3 class='text-white font-black uppercase tracking-widest border-b border-[#00e5ff]/30 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]'>PROTOCOL: TWO-WHEEL MASTERY</h3><p class='mb-2'><b class='text-[#fbbf24]'>Phase 1:</b> Master balance without pedals. Lower the seat so feet touch the ground and stride forward.</p><p class='mb-2'><b class='text-[#fbbf24]'>Phase 2:</b> Practice visual targeting. Do not look at the front wheel; look exactly where you want to go.</p><p><b class='text-[#fbbf24]'>Phase 3:</b> Momentum is stability. Speed generates gyroscopic force.</p>"; 
        } else if (lowerDesc.includes("english") || lowerDesc.includes("converse")) { 
            advice = "<h3 class='text-white font-black uppercase tracking-widest border-b border-[#00e5ff]/30 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]'>PROTOCOL: LINGUISTIC FLUENCY</h3><p class='mb-2'><b class='text-[#10b981]'>Phase 1:</b> Shadowing. Listen to English podcasts and repeat sentences out loud exactly as spoken to build muscle memory.</p><p class='mb-2'><b class='text-[#10b981]'>Phase 2:</b> Vocabulary blocks. Learn phrases, not individual words.</p><p><b class='text-[#10b981]'>Phase 3:</b> High-frequency exposure. Switch all device languages to English.</p>"; 
        } else if (lowerDesc.includes("inferiority") || lowerDesc.includes("complex")) { 
            advice = "<h3 class='text-white font-black uppercase tracking-widest border-b border-[#00e5ff]/30 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]'>PROTOCOL: COGNITIVE RECALIBRATION</h3><p class='mb-2'><b class='text-[#ef4444]'>Phase 1:</b> Isolate the variable. Lacking a specific skill is a data point, not a measure of overall worth.</p><p class='mb-2'><b class='text-[#ef4444]'>Phase 2:</b> The 'Day 1' Acceptance. Everyone starts at Level 0. Grant yourself permission to be a beginner.</p><p><b class='text-[#ef4444]'>Phase 3:</b> Micro-wins. Set a daily goal so small it is impossible to fail.</p>"; 
        } else if (lowerDesc.includes("guitar")) { 
            advice = "<h3 class='text-white font-black uppercase tracking-widest border-b border-[#00e5ff]/30 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]'>PROTOCOL: ACOUSTIC CONDITIONING</h3><p class='mb-2'><b class='text-[#a855f7]'>Phase 1:</b> Finger dexterity. Spend 10 minutes daily purely on pressing frets to build calluses.</p><p class='mb-2'><b class='text-[#a855f7]'>Phase 2:</b> The 4-Chord Axis. Learn G, C, D, and Em to unlock thousands of songs.</p><p><b class='text-[#a855f7]'>Phase 3:</b> Rhythm over accuracy. Play slowly and stay on beat.</p>"; 
        } else { 
            advice = `<h3 class='text-white font-black uppercase tracking-widest border-b border-[#00e5ff]/30 pb-2 mb-3 drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]'>PROTOCOL: GENERAL OPTIMIZATION</h3><p class='text-gray-400 italic mb-4'>Target Analyzed: "${item.desc}"</p><p class='mb-2'><b class='text-[#00e5ff]'>Phase 1:</b> Deconstruct the obstacle into 3 micro-tasks.</p><p class='mb-2'><b class='text-[#00e5ff]'>Phase 2:</b> Allocate exactly 15 minutes daily in your Active Schedule to execute Micro-Task 1.</p><p><b class='text-[#00e5ff]'>Phase 3:</b> Review progress weekly. Adjust vector as necessary.</p>`; 
        } 
        term.innerHTML = `<div class="space-y-2 animate-slide-up">${advice}</div>`; 
    }, 2000); 
}

// ==============================================================================
// 25. INVESTMENTS: FORECASTING LOGIC
// ==============================================================================
function forecastAsset() {
    const ticker = document.getElementById('stockTicker').value.trim().toUpperCase();
    if(!ticker) return;
    const term = document.getElementById('stockTerminal');
    term.innerHTML = '<div class="flex flex-col items-center justify-center h-full opacity-60"><i data-lucide="loader-2" class="w-8 h-8 mb-2 text-[#00e5ff] animate-spin"></i><p class="text-center font-bold uppercase tracking-widest text-[#00e5ff]">Connecting to Market API...</p></div>';
    renderIcons();

    setTimeout(() => {
        const forecasts = [
            `<h4 class="text-white font-black border-b border-[#00e5ff]/30 pb-1 mb-2">TARGET: ${ticker}</h4><p class="mb-2"><b>Short-Term Volatility:</b> HIGH. Recent market data indicates potential consolidation around current support levels.</p><p class="mb-2"><b>AI Confidence Score:</b> 72%. Technical indicators (RSI & MACD) show slightly oversold conditions.</p><p><b>Verdict:</b> Favorable for SIP accumulation. Wait for confirmation breakout before lump-sum injection.</p>`,
            `<h4 class="text-white font-black border-b border-[#00e5ff]/30 pb-1 mb-2">TARGET: ${ticker}</h4><p class="mb-2"><b>Short-Term Volatility:</b> LOW. Asset is currently tracking long-term moving averages tightly.</p><p class="mb-2"><b>AI Confidence Score:</b> 88%. Strong macroeconomic fundamentals supporting upward channel.</p><p><b>Verdict:</b> Hold or accumulate. Strong defensive asset for portfolio stability.</p>`,
            `<h4 class="text-white font-black border-b border-[#00e5ff]/30 pb-1 mb-2">TARGET: ${ticker}</h4><p class="mb-2"><b>Short-Term Volatility:</b> EXTREME. High speculative trading volume detected in the last 48 hours.</p><p class="mb-2"><b>AI Confidence Score:</b> 45%. Indicators are currently giving mixed signals.</p><p><b>Verdict:</b> High risk. Restrict exposure to Carefree (5%) matrix limits.</p>`
        ];
        const rand = forecasts[Math.floor(Math.random() * forecasts.length)];
        term.innerHTML = `<div class="animate-slide-up">${rand}</div>`;
    }, 1800);
}
// Attach to window so HTML can trigger it
window.forecastAsset = forecastAsset;

// ==============================================================================
// 26. MISC LISTENERS & GLOBAL BINDINGS
// ==============================================================================
let sortDirection = 'desc';
function toggleSort() { 
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc'; 
    const label = document.getElementById('sortLabel'); 
    if (label) label.innerText = sortDirection === 'desc' ? 'Newest' : 'Oldest'; 
    updateUI(); 
}

window.addEventListener('resize', () => requestAnimationFrame(() => {
    try {
        if (typeof Chart !== 'undefined') {
            Object.values(Chart.instances).forEach(c => c.resize());
        }
    } catch(e) {}
    
    try {
        const canvas = document.getElementById('whiteboardCanvas');
        if (canvas && canvas.parentElement) {
            const ctx = canvas.getContext('2d');
            const rect = canvas.parentElement.getBoundingClientRect();
            const temp = ctx.getImageData(0,0,canvas.width, canvas.height);
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.putImageData(temp, 0, 0);
        }
    } catch(e) {}
}));

// ==============================================================================
// 27. DYNAMIC HABIT MATRIX LOGIC
// ==============================================================================
function loadHabits() {
    customHabits = safeGetJSON('walletCustomHabits', [
        {id: 'h1', text: 'Read 10 Pages'},
        {id: 'h2', text: 'LEVEL//UP Fitness Protocol'},
        {id: 'h3', text: '15 Mins Skill Practice'},
        {id: 'h4', text: 'Zero Zero-Days (Consistency)'}
    ]);
    habitHistory = safeGetJSON('walletHabitHistory', {});
    
    renderHabits();
    renderHabitHistory();
}

function renderHabits() {
    const container = document.getElementById('dynamicHabitList');
    if (!container) return;
    
    const today = new Date().toLocaleDateString('en-CA');
    const todayData = habitHistory[today] || [];

    container.innerHTML = customHabits.map(h => `
        <div class="chk-item flex justify-between items-center group mb-2 bg-black/60 p-2 rounded border border-white/5 hover:border-[#a855f7]/50 transition-colors">
            <div class="flex items-center flex-grow">
                <input type="checkbox" id="${h.id}" ${todayData.includes(h.id) ? 'checked' : ''} onchange="saveHabits()" class="mr-3 accent-[#a855f7] cursor-pointer">
                <label for="${h.id}" class="text-xs text-white font-medium cursor-pointer w-full">${h.text}</label>
            </div>
            <button onclick="deleteHabit('${h.id}')" class="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-500/20 rounded"><i data-lucide="x" class="w-3 h-3"></i></button>
        </div>
    `).join('');
    renderIcons();
}

function addNewHabit() {
    const input = document.getElementById('newHabitInput');
    const val = input.value.trim();
    if (!val) return;
    
    customHabits.push({ id: 'h_' + Date.now(), text: val });
    localStorage.setItem('walletCustomHabits', JSON.stringify(customHabits));
    input.value = '';
    renderHabits();
    renderHabitHistory(); 
}

function deleteHabit(id) {
    if (confirm("Delete this habit tracker?")) {
        customHabits = customHabits.filter(h => h.id !== id);
        localStorage.setItem('walletCustomHabits', JSON.stringify(customHabits));
        renderHabits();
        renderHabitHistory(); 
    }
}

function saveHabits() {
    const today = new Date().toLocaleDateString('en-CA');
    const checkedIds = [];
    
    customHabits.forEach(h => {
        const el = document.getElementById(h.id);
        if (el && el.checked) checkedIds.push(h.id);
    });
    
    habitHistory[today] = checkedIds;
    localStorage.setItem('walletHabitHistory', JSON.stringify(habitHistory));
    renderHabitHistory();
}

function renderHabitHistory() {
    const logEl = document.getElementById('habitHistoryLog');
    if (!logEl) return;
    
    let html = '';
    const total = customHabits.length;
    
    for(let i=1; i<=3; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        const completed = habitHistory[dateStr] ? habitHistory[dateStr].length : 0;
        
        let colorClass = 'text-gray-500';
        if (completed === total && total > 0) colorClass = 'text-[#10b981]';
        else if (completed > 0) colorClass = 'text-[#fbbf24]';
        
        html += `<div class="flex justify-between items-center border-b border-white/5 pb-1 mt-1">
            <span class="text-gray-400">${d.toLocaleDateString('en-GB', {weekday:'short', month:'short', day:'numeric'})}</span>
            <span class="${colorClass} font-bold">${completed} / ${total}</span>
        </div>`;
    }
    
    logEl.innerHTML = html || '<p>No history yet.</p>';
}

window.addNewHabit = addNewHabit;
window.deleteHabit = deleteHabit;
window.saveHabits = saveHabits;

// Start everything when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    init(); 
});

// ==============================================================================
// WALLY MK 3 — UPGRADE PACK (additive add-on)
// Appended to the end of app.js. Everything above this line is the original file, unchanged.
// Nothing in app.js is modified. Functions that app.js already defines are
// left alone; this file only fills in ones that are missing and adds new modules.
// ==============================================================================
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const inr = n => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
    const getJ = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } };
    const setJ = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const mKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
    const icons = () => { try { if (typeof renderIcons === 'function') renderIcons(); } catch (e) {} };
    // Only define a global if app.js (or another script) has not already provided it.
    const idArg = v => (typeof v === 'number' && Number.isFinite(v)) ? String(v) : "'" + esc(String(v)).replace(/\\/g,'') + "'";
    const define = (name, fn) => { if (typeof window[name] !== 'function') window[name] = fn; };

    // ==========================================================================
    // A. INVESTMENT CALCULATORS (buttons existed in the HTML, logic was missing)
    // ==========================================================================
    define('calculateSIP', function () {
        const p = parseFloat($('sipAmount').value) || 0;
        const r = (parseFloat($('sipRate').value) || 0) / 100 / 12;
        const n = Math.round((parseFloat($('sipYears').value) || 0) * 12);
        const fv = r === 0 ? p * n : p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        $('sipResult').innerText = inr(fv);
        $('sipTotalInvested').innerText = `Invested: ${inr(p * n)} • Gains: ${inr(fv - p * n)}`;
    });

    define('calculateDebt', function () {
        let bal = parseFloat($('debtPrincipal').value) || 0;
        const r = (parseFloat($('debtRate').value) || 0) / 100 / 12;
        const pay = parseFloat($('debtMonthly').value) || 0;
        if (bal <= 0) { $('debtResult').innerText = '0 Months'; $('debtTotalInterest').innerText = 'Total Interest: ₹0'; return; }
        if (pay <= bal * r) {
            $('debtResult').innerText = 'Never';
            $('debtTotalInterest').innerText = `Payment must exceed ${inr(bal * r)}/mo interest`;
            return;
        }
        let months = 0, interest = 0;
        while (bal > 0.005 && months < 1200) {
            const i = bal * r; interest += i; bal = bal + i - pay; months++;
        }
        const y = Math.floor(months / 12), m = months % 12;
        $('debtResult').innerText = y > 0 ? `${y} Yr ${m} Mo` : `${months} Months`;
        $('debtTotalInterest').innerText = `Total Interest: ${inr(interest)}`;
    });

    define('calculateFIRE', function () {
        const yearly = (parseFloat($('fireExpenses').value) || 0) * 12;
        const swr = (parseFloat($('fireSWR').value) || 4) / 100;
        const buf = (parseFloat($('fireInf').value) || 0) / 100;
        const corpus = swr > 0 ? (yearly / swr) * (1 + buf) : 0;
        $('fireResult').innerText = inr(corpus);
        $('fireYearly').innerText = `Yearly Withdrawal: ${inr(yearly)}`;
    });

    // ==========================================================================
    // B. WISHLIST (render, velocity, delete, scrape-cancel, quick ideas)
    // ==========================================================================
    define('updateWishlistSavings', function (val) {
        monthlyWishlistSavings = parseFloat(val) || 0;
        localStorage.setItem('walletWishlistSavings', monthlyWishlistSavings);
        renderWishlist();
    });

    define('renderWishlist', function () {
        const grid = $('wishlistGrid'); if (!grid) return;
        if (!wishlistItems.length) {
            grid.innerHTML = `<div class="md:col-span-2 flex flex-col items-center justify-center py-16 opacity-50 border border-dashed border-[#00e5ff]/30 rounded-2xl"><i data-lucide="target" class="w-10 h-10 mb-3 text-[#00e5ff]"></i><p class="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest">No targets locked.</p></div>`;
            icons(); return;
        }
        const perDay = (monthlyWishlistSavings || 0) / 30;
        grid.innerHTML = wishlistItems.map(w => {
            const days = perDay > 0 ? Math.ceil((w.price || 0) / perDay) : null;
            const eta = days === null ? 'Set a savings plan' : (days <= 0 ? 'Ready now' : `${days} days until acquisition`);
            return `
            <div class="glass-panel rounded-2xl overflow-hidden flex flex-col">
                ${w.imageUrl ? `<div class="h-40 bg-black/60 flex items-center justify-center overflow-hidden"><img src="${esc(w.imageUrl)}" alt="" class="max-h-full max-w-full object-contain" onerror="this.parentElement.style.display='none'"></div>` : ''}
                <div class="p-4 flex flex-col gap-2 flex-grow">
                    <div class="flex justify-between items-start gap-2">
                        <p class="text-sm font-bold text-white line-clamp-2">${esc(w.title)}</p>
                        <span class="text-[8px] font-bold text-[#00e5ff] border border-[#00e5ff]/30 rounded px-1.5 py-0.5 uppercase tracking-widest shrink-0">${esc(w.wishCategory || w.category || 'Other')}</span>
                    </div>
                    <p class="text-2xl font-black text-[#10b981]">${inr(w.price)}</p>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-[#fbbf24] flex items-center"><i data-lucide="timer" class="w-3 h-3 mr-1"></i> ${eta}</p>
                    <div class="flex gap-2 justify-end mt-auto pt-2">
                        ${w.link ? `<a href="${esc(w.link)}" target="_blank" rel="noopener" class="px-3 py-1.5 bg-white/5 text-gray-300 hover:text-[#00e5ff] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">Open</a>` : ''}
                        <button onclick="openEditWishlistModal(${idArg(w.id)}, false)" class="px-3 py-1.5 bg-white/5 text-gray-300 hover:text-[#0ea5e9] border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">Modify</button>
                        <button onclick="deleteWishItem(${idArg(w.id)}, false)" class="px-3 py-1.5 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-black rounded-lg text-[10px] font-bold uppercase tracking-widest">Purge</button>
                    </div>
                </div>
            </div>`;
        }).join('');
        icons();
    });

    define('deleteWishItem', function (id, isMedia) {
        if (!confirm('Delete this item?')) return;
        if (isMedia) { mediaItems = mediaItems.filter(i => String(i.id) !== String(id)); saveMediaLocally(); renderMedia(); }
        else { wishlistItems = wishlistItems.filter(i => String(i.id) !== String(id)); saveWishlistLocally(); renderWishlist(); }
        // Best-effort cloud delete (assumes a /delete-wishlist/:id route mirroring /delete-transaction/:id)
        try { fetch(`${API_BASE}/delete-wishlist/${id}`, { method: 'DELETE' }).catch(() => {}); } catch (e) {}
    });

    define('cancelWishScrape', function () { try { if (wishScrapeController) wishScrapeController.abort(); } catch (e) {} });
    define('cancelMediaScrape', function () { try { if (mediaScrapeController) mediaScrapeController.abort(); } catch (e) {} });

    define('fillWish', function (name, price, cat) {
        if ($('wishName')) $('wishName').value = name;
        if ($('wishPrice')) $('wishPrice').value = price;
        if ($('wishCategory')) $('wishCategory').value = cat;
    });

    // ==========================================================================
    // C. VAULT / MEDIA (grid + kanban board)
    // ==========================================================================
    const STATUS_FLOW = ['Planned', 'In Progress', 'Completed'];
    const STATUS_LABEL = { 'Planned': 'Pending', 'In Progress': 'Active', 'Completed': 'Archived' };
    const STATUS_COLOR = { 'Planned': '#00e5ff', 'In Progress': '#fbbf24', 'Completed': '#10b981' };

    function mediaCard(m, compact) {
        const st = STATUS_FLOW.includes(m.mediaStatus) ? m.mediaStatus : 'Planned';
        const stars = Number(m.mediaRating) > 0 ? '⭐'.repeat(Number(m.mediaRating)) : '';
        const next = STATUS_FLOW[(STATUS_FLOW.indexOf(st) + 1) % 3];
        return `
        <div class="${compact ? 'bg-black/60 border border-white/10 rounded-xl' : 'glass-panel rounded-2xl'} overflow-hidden flex ${compact ? '' : 'min-h-[150px]'}">
            ${m.imageUrl ? `<img src="${esc(m.imageUrl)}" alt="" class="${compact ? 'w-14' : 'w-24'} object-cover shrink-0" onerror="this.style.display='none'">` : ''}
            <div class="p-3 flex flex-col gap-1 min-w-0 flex-grow">
                <p class="text-xs font-bold text-white line-clamp-2">${esc(m.title)}</p>
                <p class="text-[9px] font-bold uppercase tracking-widest text-[#a855f7]">${esc(m.wishCategory || 'Media')}${m.mediaGenre ? ' • ' + esc(m.mediaGenre) : ''}</p>
                ${!compact && m.mediaDetails ? `<p class="text-[10px] text-gray-400 line-clamp-2">${esc(m.mediaDetails)}</p>` : ''}
                <p class="text-[9px] font-black uppercase tracking-widest" style="color:${STATUS_COLOR[st]}">${STATUS_LABEL[st]} ${stars}</p>
                <div class="flex gap-1.5 mt-auto pt-1 flex-wrap">
                    <button onclick="advanceMediaStatus(${idArg(m.id)})" title="Move to ${STATUS_LABEL[next]}" class="px-2 py-1 bg-white/5 text-gray-300 hover:text-[#00e5ff] border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest">→ ${STATUS_LABEL[next]}</button>
                    <button onclick="openEditWishlistModal(${idArg(m.id)}, true)" class="px-2 py-1 bg-white/5 text-gray-300 hover:text-[#0ea5e9] border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest">Edit</button>
                    <button onclick="deleteWishItem(${idArg(m.id)}, true)" class="px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 hover:bg-[#ef4444] hover:text-black rounded text-[9px] font-bold uppercase tracking-widest">✕</button>
                </div>
            </div>
        </div>`;
    }

    define('renderMedia', function () {
        const grid = $('mediaGrid');
        if (grid) {
            grid.innerHTML = mediaItems.length ? mediaItems.map(m => mediaCard(m, false)).join('')
                : `<div class="md:col-span-2 flex flex-col items-center justify-center py-16 opacity-50 border border-dashed border-[#a855f7]/30 rounded-2xl"><i data-lucide="database" class="w-10 h-10 mb-3 text-[#a855f7]"></i><p class="text-[#a855f7] text-[10px] font-bold uppercase tracking-widest">Vault empty.</p></div>`;
        }
        const cols = { 'Planned': $('kb-planned'), 'In Progress': $('kb-progress'), 'Completed': $('kb-completed') };
        Object.keys(cols).forEach(st => {
            if (!cols[st]) return;
            const list = mediaItems.filter(m => (STATUS_FLOW.includes(m.mediaStatus) ? m.mediaStatus : 'Planned') === st);
            cols[st].innerHTML = list.length ? list.map(m => mediaCard(m, true)).join('') : `<p class="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Empty</p>`;
        });
        icons();
    });

    define('advanceMediaStatus', function (id) {
        const m = mediaItems.find(i => String(i.id) === String(id)); if (!m) return;
        const cur = STATUS_FLOW.includes(m.mediaStatus) ? m.mediaStatus : 'Planned';
        m.mediaStatus = STATUS_FLOW[(STATUS_FLOW.indexOf(cur) + 1) % 3];
        if (m.mediaStatus !== 'Completed') m.mediaRating = 'Unrated';
        saveMediaLocally(); renderMedia();
    });

    define('toggleMediaView', function () {
        mediaViewMode = mediaViewMode === 'grid' ? 'board' : 'grid';
        const board = mediaViewMode === 'board';
        if ($('mediaGrid')) $('mediaGrid').classList.toggle('hidden', board);
        if ($('mediaBoard')) $('mediaBoard').classList.toggle('hidden', !board);
        if ($('mediaViewText')) $('mediaViewText').innerText = board ? 'Grid' : 'Board';
        renderMedia();
    });

    // ==========================================================================
    // D. MEMORY CARDS (Keep-style notes in the Workspace)
    // ==========================================================================
    define('expandKeepInput', function () {
        if ($('keepTitle')) $('keepTitle').classList.remove('hidden');
        if ($('keepControls')) $('keepControls').classList.remove('hidden');
        if ($('keepBody')) $('keepBody').rows = 3;
    });
    define('closeKeepInput', function () {
        if ($('keepTitle')) { $('keepTitle').classList.add('hidden'); $('keepTitle').value = ''; }
        if ($('keepControls')) $('keepControls').classList.add('hidden');
        if ($('keepBody')) { $('keepBody').rows = 1; $('keepBody').value = ''; }
        if ($('keepSelectedColor')) $('keepSelectedColor').value = 'bg-black/60';
    });
    define('setKeepColor', function (c) { if ($('keepSelectedColor')) $('keepSelectedColor').value = c; });
    define('saveKeepNote', function () {
        const title = $('keepTitle').value.trim(), body = $('keepBody').value.trim();
        if (!title && !body) return closeKeepInput();
        const notes = getJ('keepNotes', []);
        notes.unshift({ id: Date.now(), title, body, color: $('keepSelectedColor').value || 'bg-black/60' });
        setJ('keepNotes', notes); closeKeepInput(); renderKeepNotes();
    });
    define('renderKeepNotes', function () {
        const grid = $('keepGrid'); if (!grid) return;
        const notes = getJ('keepNotes', []);
        grid.innerHTML = notes.map(n => `
            <div class="keep-card p-4 cursor-pointer ${esc(n.color || 'bg-black/60')}" onclick="openEditKeepModal(${Number(n.id)})">
                <div class="flex justify-between items-start gap-2">
                    <p class="text-sm font-bold text-[#00e5ff] break-words">${esc(n.title)}</p>
                    <button onclick="event.stopPropagation(); deleteKeepNote(${Number(n.id)})" class="text-[#ef4444] hover:text-white shrink-0"><i data-lucide="x" class="w-3 h-3"></i></button>
                </div>
                <p class="text-xs text-gray-300 mt-1 whitespace-pre-wrap break-words">${esc(n.body)}</p>
            </div>`).join('');
        icons();
    });
    define('deleteKeepNote', function (id) {
        if (!confirm('Delete this memory card?')) return;
        setJ('keepNotes', getJ('keepNotes', []).filter(n => n.id !== id)); renderKeepNotes();
    });
    define('openEditKeepModal', function (id) {
        const n = getJ('keepNotes', []).find(x => x.id === id); if (!n) return;
        $('editKeepId').value = n.id; $('editKeepTitle').value = n.title || ''; $('editKeepBody').value = n.body || '';
        $('editKeepSelectedColor').value = n.color || 'bg-black/60';
        $('editKeepModal').classList.remove('hidden');
    });
    define('setEditKeepColor', function (c) { if ($('editKeepSelectedColor')) $('editKeepSelectedColor').value = c; });
    define('closeEditKeepModal', function () { $('editKeepModal').classList.add('hidden'); });
    define('saveEditedKeepNote', function () {
        const id = Number($('editKeepId').value); const notes = getJ('keepNotes', []);
        const n = notes.find(x => x.id === id);
        if (n) { n.title = $('editKeepTitle').value.trim(); n.body = $('editKeepBody').value.trim(); n.color = $('editKeepSelectedColor').value; setJ('keepNotes', notes); }
        closeEditKeepModal(); renderKeepNotes();
    });

    // ==========================================================================
    // E. COGNITIVE STATE (energy / focus sliders now persist per day)
    // ==========================================================================
    const todayStr = () => new Date().toLocaleDateString('en-CA');
    define('saveMood', function () {
        const h = getJ('walletMoodHistory', {});
        h[todayStr()] = { energy: Number($('energySlider').value), focus: Number($('focusSlider').value) };
        setJ('walletMoodHistory', h);
    });
    function loadMood() {
        const m = getJ('walletMoodHistory', {})[todayStr()]; if (!m) return;
        if ($('energySlider')) { $('energySlider').value = m.energy; $('energyValue').innerText = m.energy + '/10'; }
        if ($('focusSlider')) { $('focusSlider').value = m.focus; $('focusValue').innerText = m.focus + '/10'; }
    }

    // ==========================================================================
    // F. SMART CATEGORY GUESSER (used by SMS/CSV staging + chat quick-add)
    // ==========================================================================
    const CAT_KEYWORDS = {
        'Food & Dining': ['swiggy', 'zomato', 'domino', 'pizza', 'restaurant', 'cafe', 'hotel', 'food', 'dining', 'lunch', 'dinner', 'breakfast', 'tea', 'coffee', 'biryani', 'kfc', 'mcdonald'],
        'Groceries': ['grocery', 'groceries', 'fruits', 'vegetable', 'bigbasket', 'blinkit', 'zepto', 'instamart', 'dmart', 'supermarket', 'milk'],
        'Transport': ['rapido', 'uber', 'ola', 'metro', 'railway', 'irctc', 'abhibus', 'redbus', 'bus', 'petrol', 'fuel', 'transport', 'auto', 'cab', 'cumta'],
        'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'shopping'],
        'Subscriptions': ['netflix', 'spotify', 'prime', 'hotstar', 'youtube', 'subscription', 'icloud', 'google one'],
        'Entertainment': ['bookmyshow', 'pvr', 'inox', 'movie', 'cinema', 'game', 'steam'],
        'Electricity charges': ['electricity', 'tneb', 'bescom', 'tangedco', 'eb bill'],
        'Mobile Recharge': ['recharge', 'jio', 'airtel', 'vodafone', 'bsnl'],
        'Rent': ['rent', 'landlord', 'pg '],
        'Health': ['pharmacy', 'apollo', 'medplus', 'hospital', 'clinic', 'medicine', 'doctor', 'health'],
        'Education': ['course', 'udemy', 'coursera', 'tuition', 'college', 'exam', 'book'],
        'Travel': ['flight', 'indigo', 'makemytrip', 'goibibo', 'trip', 'travel'],
        'Investments': ['sip', 'mutual fund', 'zerodha', 'groww', 'invest', 'stock'],
        'Utilities': ['water bill', 'gas', 'broadband', 'wifi', 'internet', 'utility']
    };
    function guessCategory(text) {
        const t = String(text || '').toLowerCase();
        for (const cat in CAT_KEYWORDS) if (CAT_KEYWORDS[cat].some(k => t.includes(k))) return cat;
        return null;
    }
    window.guessCategory = guessCategory;

    // Pre-select a guessed category for every staged SMS / CSV row.
    if (typeof window.renderCSVStaging === 'function') {
        const origStage = window.renderCSVStaging;
        window.renderCSVStaging = function () {
            origStage.apply(this, arguments);
            try {
                stagedCSVTransactions.forEach(tx => {
                    const sel = $('csv_cat_' + tx.id); if (!sel) return;
                    if (!tx._cat) tx._cat = guessCategory(tx.note) || 'Other';
                    sel.value = tx._cat;
                    sel.onchange = () => { tx._cat = sel.value; };
                });
            } catch (e) {}
        };
    }

    // ==========================================================================
    // G. UPGRADE DECK (new dashboard panels)
    // ==========================================================================
    function activeMonth() {
        return (typeof selectedMonth !== 'undefined' && selectedMonth !== 'all') ? selectedMonth : mKey(Date.now());
    }
    function monthExpenses(m) {
        return transactions.filter(t => t.type === 'expense' && t.account !== 'Emergency' && mKey(t.timestamp) === m);
    }

    function injectDeck() {
        const dash = $('viewDashboard'); if (!dash || $('upgradeDeck')) return;
        const needRecurring = !$('recurringWidgetList');
        dash.insertAdjacentHTML('beforeend', `
        <div id="upgradeDeck" class="mt-6 space-y-4 md:space-y-6">
            <div class="flex justify-between items-end px-2">
                <h2 class="text-lg font-bold uppercase tracking-wider text-[#00e5ff] flex items-center">Tactical Extensions <span class="info-icon" data-info="Additional local analytics. Follows the month selected at the top (or the current month when ALL TIME is selected)."><i data-lucide="help-circle" class="w-4 h-4"></i></span></h2>
                <span id="upgMonthLabel" class="text-[10px] text-gray-500 font-bold tracking-widest uppercase"></span>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6">
                    <h3 class="text-xs font-bold text-[#fbbf24] uppercase tracking-widest mb-4 flex items-center"><i data-lucide="calendar-days" class="w-4 h-4 mr-2"></i> Spend Heatmap</h3>
                    <div class="grid grid-cols-7 gap-1.5 text-center text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
                    <div id="upgHeatmap" class="grid grid-cols-7 gap-1.5"></div>
                </div>
                <div class="glass-panel p-5 md:p-6 flex flex-col">
                    <h3 class="text-xs font-bold text-[#00e5ff] uppercase tracking-widest mb-4 flex items-center"><i data-lucide="radar" class="w-4 h-4 mr-2"></i> Local Insights <span class="info-icon" data-info="Computed on-device from your ledger. Works offline, no AI call."><i data-lucide="help-circle" class="w-4 h-4"></i></span></h3>
                    <div id="upgInsights" class="space-y-2 text-xs text-gray-300 flex-grow"></div>
                </div>
                <div class="glass-panel p-5 md:p-6">
                    <h3 class="text-xs font-bold text-[#a855f7] uppercase tracking-widest mb-4 flex items-center"><i data-lucide="gauge" class="w-4 h-4 mr-2"></i> Category Caps <span class="info-icon" data-info="Set a monthly spending cap per category. Enter 0 to remove a cap."><i data-lucide="help-circle" class="w-4 h-4"></i></span></h3>
                    <div class="flex gap-2 mb-4">
                        <select id="upgCapCat" class="flex-1 min-w-0 glass-input rounded px-2 py-2 text-xs text-white font-bold"></select>
                        <input id="upgCapAmt" type="number" min="0" placeholder="₹ cap" class="w-24 glass-input rounded px-2 py-2 text-xs text-white font-bold">
                        <button onclick="setCategoryCap()" class="bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7] hover:text-black px-3 rounded text-[10px] font-bold uppercase tracking-widest border border-[#a855f7]/40">Set</button>
                    </div>
                    <div id="upgCaps" class="space-y-3"></div>
                </div>
                <div class="glass-panel p-5 md:p-6 flex flex-col">
                    ${needRecurring ? `
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center"><i data-lucide="repeat" class="w-4 h-4 mr-2"></i> Recurring Bindings</h3>
                        <span id="recurringWidgetTotal" class="text-sm font-black text-rose-500">₹0</span>
                    </div>
                    <div id="recurringWidgetList" class="space-y-2 max-h-[180px] overflow-y-auto ledger-scrollbar pr-1 mb-4"></div>` : ''}
                    <div class="mt-auto pt-4 border-t border-white/10">
                        <h3 class="text-xs font-bold text-[#10b981] uppercase tracking-widest mb-3 flex items-center"><i data-lucide="hard-drive-upload" class="w-4 h-4 mr-2"></i> Data Tools</h3>
                        <div class="flex flex-wrap gap-2">
                            <button onclick="document.getElementById('upgRestoreInput').click()" class="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-black px-3 py-2 rounded text-[10px] font-bold border border-[#10b981]/30 uppercase tracking-widest">Restore Backup JSON</button>
                            <button onclick="exportLedgerCSV()" class="bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black px-3 py-2 rounded text-[10px] font-bold border border-[#00e5ff]/30 uppercase tracking-widest">Export Ledger CSV</button>
                            <input type="file" id="upgRestoreInput" accept=".json,application/json" class="hidden" onchange="restoreBackupJSON(event)">
                        </div>
                        <p class="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-3">Shortcuts: Alt+1–6 switch tabs • / search ledger • Esc close modal</p>
                    </div>
                </div>
            </div>
        </div>`);
        const sel = $('upgCapCat');
        if (sel && typeof EXPENSE_CATEGORIES !== 'undefined') sel.innerHTML = EXPENSE_CATEGORIES.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
        icons();
    }

    function renderHeatmap(m) {
        const el = $('upgHeatmap'); if (!el) return;
        const [y, mo] = m.split('-').map(Number);
        const days = new Date(y, mo, 0).getDate();
        const offset = (new Date(y, mo - 1, 1).getDay() + 6) % 7;
        const totals = new Array(days + 1).fill(0);
        monthExpenses(m).forEach(t => { totals[new Date(t.timestamp).getDate()] += t.amount; });
        // Scale against the 2nd-largest day so one rent payment doesn't flatten everything else
        const sorted = totals.slice(1).filter(v => v > 0).sort((a, b) => b - a);
        const scale = sorted.length > 1 ? sorted[1] : (sorted[0] || 1);
        let html = '<span></span>'.repeat(offset);
        for (let d = 1; d <= days; d++) {
            const v = totals[d]; const a = v > 0 ? Math.min(1, 0.15 + 0.85 * (v / scale)) : 0;
            html += `<div title="${d}: ${inr(v)}" class="aspect-square rounded flex items-center justify-center text-[9px] font-bold border border-white/5" style="background:${v > 0 ? `rgba(251,191,36,${a.toFixed(2)})` : 'rgba(255,255,255,0.03)'};color:${a > 0.55 ? '#000' : '#9ca3af'}">${d}</div>`;
        }
        el.innerHTML = html;
    }

    function renderInsights(m) {
        const el = $('upgInsights'); if (!el) return;
        const [y, mo] = m.split('-').map(Number);
        const exp = monthExpenses(m);
        const spent = exp.reduce((a, t) => a + t.amount, 0);
        const daysInMonth = new Date(y, mo, 0).getDate();
        const isCurrent = m === mKey(Date.now());
        const elapsed = isCurrent ? new Date().getDate() : daysInMonth;
        const budget = (typeof monthlyBudgets !== 'undefined' && (monthlyBudgets[m] || monthlyBudgets['default'])) || 25000;
        const row = (label, val, color) => `<div class="flex justify-between gap-3 bg-black/50 border border-white/5 rounded px-3 py-2"><span class="text-gray-400 uppercase tracking-widest text-[10px] font-bold">${label}</span><span class="font-black text-right" style="color:${color || '#e2e8f0'}">${val}</span></div>`;
        const lines = [];
        if (!exp.length) { el.innerHTML = `<p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center py-6">No expenses in this period.</p>`; return; }

        if (isCurrent) {
            const proj = (spent / elapsed) * daysInMonth;
            lines.push(row('Projected month-end spend', `${inr(proj)} vs ${inr(budget)} budget`, proj > budget ? '#ef4444' : '#10b981'));
            const left = budget - spent, daysLeft = daysInMonth - elapsed + 1;
            lines.push(row('Safe to spend / day', left > 0 ? inr(left / daysLeft) : 'Budget exhausted', left > 0 ? '#00e5ff' : '#ef4444'));
        } else {
            lines.push(row('Total spent', `${inr(spent)} vs ${inr(budget)} budget`, spent > budget ? '#ef4444' : '#10b981'));
        }

        const big = exp.reduce((a, t) => t.amount > a.amount ? t : a, exp[0]);
        lines.push(row('Largest expense', `${inr(big.amount)} • ${esc(big.note || big.category)}`));

        const spendDays = new Set(exp.map(t => new Date(t.timestamp).getDate())).size;
        lines.push(row('No-spend days', `${Math.max(0, elapsed - spendDays)} of ${elapsed}`, '#fbbf24'));

        const pd = new Date(y, mo - 2, 1); const prevKey = mKey(pd.getTime());
        const prev = monthExpenses(prevKey);
        if (prev.length) {
            const sum = list => list.reduce((o, t) => { o[t.category] = (o[t.category] || 0) + t.amount; return o; }, {});
            const c = sum(exp), p = sum(prev);
            let best = null;
            Object.keys(c).forEach(k => { const d = c[k] - (p[k] || 0); if (!best || d > best.d) best = { k, d }; });
            if (best && best.d > 0) lines.push(row('Biggest rise vs last month', `${esc(best.k)} +${inr(best.d)}`, '#f97316'));
            const prevTotal = prev.reduce((a, t) => a + t.amount, 0);
            const diff = spent - prevTotal;
            lines.push(row(isCurrent ? 'So far vs last month total' : 'Vs previous month', `${diff >= 0 ? '+' : '−'}${inr(Math.abs(diff))}`, diff > 0 ? '#ef4444' : '#10b981'));
        }
        el.innerHTML = lines.join('');
    }

    function renderCaps(m) {
        const el = $('upgCaps'); if (!el) return;
        const caps = getJ('walletCategoryCaps', {});
        const keys = Object.keys(caps);
        if (!keys.length) { el.innerHTML = `<p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold text-center py-4">No caps defined.</p>`; return; }
        const spent = monthExpenses(m).reduce((o, t) => { o[t.category] = (o[t.category] || 0) + t.amount; return o; }, {});
        el.innerHTML = keys.map(k => {
            const s = spent[k] || 0, pct = Math.min(100, (s / caps[k]) * 100), over = s > caps[k];
            const col = over ? '#ef4444' : (pct > 80 ? '#fbbf24' : '#a855f7');
            return `<div>
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5"><span style="color:${col}">${esc(k)}${over ? ' • OVER' : ''}</span><span class="text-gray-300">${inr(s)} / ${inr(caps[k])}</span></div>
                <div class="w-full bg-black/60 rounded h-1.5 border border-white/10 overflow-hidden"><div class="h-full transition-all" style="width:${pct}%;background:${col}"></div></div>
            </div>`;
        }).join('');
    }

    window.setCategoryCap = function () {
        const cat = $('upgCapCat').value; const amt = parseFloat($('upgCapAmt').value);
        if (!cat || isNaN(amt) || amt < 0) return;
        const caps = getJ('walletCategoryCaps', {});
        if (amt === 0) delete caps[cat]; else caps[cat] = amt;
        setJ('walletCategoryCaps', caps); $('upgCapAmt').value = ''; renderDeck();
    };

    window.restoreBackupJSON = function (e) {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                const data = JSON.parse(evt.target.result);
                if (!Array.isArray(data)) throw new Error('not an array');
                const have = new Set(transactions.map(t => String(t.id)));
                let added = 0;
                data.map(normalizeTransaction).forEach(t => {
                    if (!have.has(String(t.id)) && Number.isFinite(t.amount)) { transactions.push(t); have.add(String(t.id)); added++; }
                });
                saveTransactionsLocally(); updateUI();
                alert(`Restore complete. ${added} new transaction(s) merged, ${data.length - added} already present.`);
            } catch (err) { alert('Could not read that file. Expected a Wally_Backup.json export.'); }
        };
        reader.readAsText(file); e.target.value = '';
    };

    window.exportLedgerCSV = function () {
        const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = [['Date', 'Type', 'Amount', 'Account', 'Category', 'Note', 'Recurring']];
        [...transactions].sort((a, b) => a.timestamp - b.timestamp).forEach(t => {
            const d = new Date(t.timestamp);
            const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            rows.push([ds, t.type, t.amount, t.account, t.category, t.note, t.isRecurring ? 'yes' : 'no']);
        });
        const blob = new Blob(['\ufeff' + rows.map(r => r.map(q).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'Wally_Ledger.csv'; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };

    function renderDeck() {
        injectDeck();
        const m = activeMonth();
        if ($('upgMonthLabel')) {
            const [y, mo] = m.split('-');
            $('upgMonthLabel').innerText = new Date(y, mo - 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase();
        }
        (window.wallyHeatmap || renderHeatmap)(m); renderInsights(m); renderCaps(m);
    }

    window.WallyX = { monthExpenses, activeMonth, mKey, renderDeck, guessCategory, quickAdd: (t, a, r) => quickAdd(t, a, r) };

    // Re-render the deck whenever the main UI refreshes.
    if (typeof window.updateUI === 'function') {
        const origUpdate = window.updateUI;
        window.updateUI = function () {
            const hadRecurring = !!$('recurringWidgetList');
            if (!hadRecurring) { try { injectDeck(); } catch (e) {} }   // so app.js can fill the recurring widget
            const r = origUpdate.apply(this, arguments);
            try { renderDeck(); } catch (e) { console.warn('Upgrade deck render failed', e); }
            return r;
        };
    }

    // ==========================================================================
    // H. C.A.S.P.E.R. CHAT — LOCAL COMMANDS (falls through to the original bot)
    // ==========================================================================
    function quickAdd(type, amount, rest) {
        let category = 'Other';
        if (type === 'expense') category = guessCategory(rest) || (EXPENSE_CATEGORIES.find(c => rest.toLowerCase().includes(c.toLowerCase().split(' ')[0])) || 'Other');
        else category = INCOME_CATEGORIES.find(c => rest.toLowerCase().includes(c.toLowerCase())) || 'Other';
        const tx = { id: String(Date.now()), type, amount, account: 'UPI', category, note: rest, timestamp: Date.now(), isRecurring: false };
        transactions.push(tx); saveTransactionsLocally(); updateUI();
        try { fetch(`${API_BASE}/add-transaction`, { method: 'POST', headers: apiHeaders, body: JSON.stringify(tx) }).catch(() => {}); } catch (e) {}
        return `Logged ${type === 'expense' ? 'expense' : 'income'} of <b>${inr(amount)}</b> under <b>${esc(category)}</b>. You can modify it from the ledger.`;
    }

    function localCommand(msg) {
        const m = msg.toLowerCase();
        let x = msg.match(/^(?:spent|paid|add)\s+(?:₹|rs\.?\s*)?([\d,]+(?:\.\d+)?)\s*(?:on|for|at)?\s*(.*)$/i);
        if (x) { const a = parseFloat(x[1].replace(/,/g, '')); if (a > 0) return quickAdd('expense', a, x[2].trim()); }
        x = msg.match(/^(?:earned|received|got)\s+(?:₹|rs\.?\s*)?([\d,]+(?:\.\d+)?)\s*(?:from|as|for)?\s*(.*)$/i);
        if (x) { const a = parseFloat(x[1].replace(/,/g, '')); if (a > 0) return quickAdd('income', a, x[2].trim()); }
        if (m === 'balance' || m.includes('my balance')) {
            let bal = 0, ef = 0;
            transactions.forEach(t => { const s = t.type === 'income' ? t.amount : -t.amount; if (t.account === 'Emergency') ef += s; else bal += s; });
            return `Liquid assets: <b>${inr(bal)}</b><br>Emergency fund: <b>${inr(ef)}</b>`;
        }
        if (m === 'summary' || m === 'top' || m.includes('this month')) {
            const exp = monthExpenses(mKey(Date.now()));
            if (!exp.length) return 'No expenses logged this month yet.';
            const cats = exp.reduce((o, t) => { o[t.category] = (o[t.category] || 0) + t.amount; return o; }, {});
            const top = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, v]) => `${esc(c)}: ${inr(v)}`).join('<br>');
            return `Spent this month: <b>${inr(exp.reduce((a, t) => a + t.amount, 0))}</b> across ${exp.length} entries.<br><br><b>Top categories</b><br>${top}`;
        }
        if (m === 'commands') {
            return `<b>Local commands</b><br>• spent 250 on swiggy<br>• earned 5000 freelance<br>• balance<br>• summary<br>• explain`;
        }
        return null;
    }

    if (typeof window.sendCasperMessage === 'function') {
        const origSend = window.sendCasperMessage;
        window.sendCasperMessage = function () {
            const input = $('casperInput'), body = $('casperChatBody');
            const msg = input ? input.value.trim() : '';
            let reply = null;
            try { reply = msg ? localCommand(msg) : null; } catch (e) { reply = null; }
            if (reply === null || !body) return origSend.apply(this, arguments);
            body.insertAdjacentHTML('beforeend', `<div class="bg-black/60 border border-[#00e5ff]/40 p-3 rounded-xl rounded-tr-none w-10/12 ml-auto text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]">${esc(msg)}</div>`);
            body.insertAdjacentHTML('beforeend', `<div class="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-3 rounded-xl rounded-tl-none w-10/12 text-[#00e5ff] shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]">${reply}</div>`);
            input.value = ''; body.scrollTop = body.scrollHeight;
        };
    }

    // ==========================================================================
    // I. KEYBOARD SHORTCUTS
    // ==========================================================================
    document.addEventListener('keydown', e => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
        if (e.altKey && e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            switchMainView(['dashboard', 'investments', 'wishlist', 'media', 'workspace', 'growth'][Number(e.key) - 1]);
        } else if (e.key === '/' && !typing) {
            e.preventDefault(); switchMainView('dashboard');
            const s = $('searchInput'); if (s) { s.scrollIntoView({ block: 'center' }); s.focus(); }
        } else if (e.key === 'Escape') {
            ['bulkSmsModal', 'csvReviewModal', 'allTimeModal', 'expandedChartModal', 'editModal', 'editWishlistModal', 'aiReportModal', 'editKeepModal']
                .forEach(id => { const el = $(id); if (el) el.classList.add('hidden'); });
            const dyn = $('dynamicAllocModal'); if (dyn) dyn.remove();
        }
    });

    // ==========================================================================
    // J. BOOT
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        try {
            monthlyWishlistSavings = parseFloat(localStorage.getItem('walletWishlistSavings')) || 0;
            if ($('wishlistSavingsInput') && monthlyWishlistSavings > 0) $('wishlistSavingsInput').value = monthlyWishlistSavings;
        } catch (e) {}
        const ms = $('mediaStatus');
        if (ms) ms.addEventListener('change', () => { const rc = $('ratingContainer'); if (rc) rc.style.display = ms.value === 'Completed' ? 'block' : 'none'; });
        try { renderWishlist(); } catch (e) {}
        try { renderMedia(); } catch (e) {}
        try { renderKeepNotes(); } catch (e) {}
        try { loadMood(); } catch (e) {}
        try { calculateSIP(); calculateDebt(); calculateFIRE(); } catch (e) {}
        try { updateUI(); } catch (e) {}
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 2 / PART A
// Offline core, J.A.R.V.I.S. theme layer, C.A.S.P.E.R. offline brain,
// heatmap floaters, investments command, planner tab.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';

    const $ = id => document.getElementById(id);
    const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const inr = n => '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
    const getJ = (k, f) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } };
    const setJ = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Storage is full. Export a backup and clear old canvas drafts.', true); } };
    const icons = () => { try { if (typeof renderIcons === 'function') renderIcons(); } catch (e) {} };
    const todayStr = () => new Date().toLocaleDateString('en-CA');
    const mKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
    const idArg = v => (typeof v === 'number' && Number.isFinite(v)) ? String(v) : "'" + esc(String(v)).replace(/\\/g, '') + "'";
    const X = () => window.WallyX || {};

    function toast(msg, bad) {
        let t = $('cxToast');
        if (!t) { t = document.createElement('div'); t.id = 'cxToast'; document.body.appendChild(t); }
        t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
        clearTimeout(toast._t); toast._t = setTimeout(() => { t.className = ''; }, 2800);
    }

    function balances() {
        let liquid = 0, ef = 0;
        transactions.forEach(t => { const v = t.type === 'income' ? t.amount : -t.amount; if (t.account === 'Emergency') ef += v; else liquid += v; });
        return { liquid, ef };
    }
    function monthExp(m) { return transactions.filter(t => t.type === 'expense' && t.account !== 'Emergency' && mKey(t.timestamp) === m); }
    function budgetFor(m) { return (typeof monthlyBudgets !== 'undefined' && (monthlyBudgets[m] || monthlyBudgets['default'])) || 25000; }
    function monthStats() {
        const m = mKey(Date.now()), now = new Date();
        const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate();
        const exp = monthExp(m), spent = exp.reduce((a, t) => a + t.amount, 0), budget = budgetFor(m);
        const income = transactions.filter(t => t.type === 'income' && t.account !== 'Emergency' && mKey(t.timestamp) === m).reduce((a, t) => a + t.amount, 0);
        return { m, exp, spent, budget, income, dim, day, left: budget - spent, safe: Math.max(0, (budget - spent) / (dim - day + 1)), proj: spent / day * dim };
    }

    // Animated HUD ring (original SVG, no external images needed, works offline)
    function hud(size, color, icon) {
        return `<div class="cx-hud" style="width:${size}px;height:${size}px;color:${color}"><svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/>
            <circle class="cx-spin" cx="50" cy="50" r="41" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="46 20 9 20" stroke-linecap="round"/>
            <circle class="cx-spin rev" cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 7" opacity=".8"/>
            <circle class="cx-pulse" cx="50" cy="50" r="23" fill="currentColor" opacity=".1"/></svg><i data-lucide="${icon}"></i></div>`;
    }
    function banner(title, sub, icon, color) {
        return `<div class="cx-banner glass-panel" style="--c:${color}">${hud(64, color, icon)}<div class="min-w-0"><h3>${title}</h3><p>${sub}</p></div><svg class="cx-wave" viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20 L30 20 L38 6 L48 34 L58 12 L66 20 L110 20 L118 2 L130 38 L140 20 L190 20 L198 10 L206 28 L214 20 L240 20" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div>`;
    }

    const bus = {};
    const on = (n, fn) => { (bus[n] = bus[n] || []).push(fn); };
    const emit = (n, d) => { (bus[n] || []).forEach(fn => { try { fn(d); } catch (e) { console.warn('link ' + n, e); } }); };
    window.CX = { on, emit, $, esc, inr, getJ, setJ, icons, todayStr, mKey, idArg, toast, balances, monthStats, monthExp, hud, banner };

    // ==========================================================================
    // 1. THEME LAYER — J.A.R.V.I.S. HUD, slightly rounded type, readable sizes
    // ==========================================================================
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Exo+2:wght@500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap';
    document.head.appendChild(font);

    const css = document.createElement('style');
    css.id = 'cxTheme';
    css.textContent = `
    body, button, input, select, textarea { font-family: 'Nunito', 'Fredoka', system-ui, sans-serif !important; }
    h1, h2, h3, h4, .bubbly-text, .nav-btn, .cx-display, #globalTooltip { font-family: 'Exo 2', 'Nunito', 'Fredoka', sans-serif !important; }
    body { font-size: 15px; -webkit-font-smoothing: antialiased; }
    .text-\\[8px\\] { font-size: 10px !important; } .text-\\[9px\\] { font-size: 10.5px !important; } .text-\\[10px\\] { font-size: 11.5px !important; }
    .text-xs { font-size: 13px !important; line-height: 1.45 !important; }
    .tracking-widest { letter-spacing: .09em !important; }
    .bubbly-text { letter-spacing: .01em; }
    .glass-panel { border-radius: 16px; }
    .nav-btn { border-radius: 12px !important; }
    input, select, textarea, button { border-radius: 10px; }

    #cxToast { position: fixed; left: 50%; bottom: 28px; transform: translate(-50%, 30px); opacity: 0; pointer-events: none; z-index: 2147483000;
        background: rgba(3,10,20,.96); color: #00e5ff; border: 1px solid #00e5ff; border-radius: 12px; padding: 10px 18px; font-weight: 800; font-size: 13px;
        box-shadow: 0 0 22px rgba(0,229,255,.35); transition: all .25s ease; max-width: 90vw; text-align: center; }
    #cxToast.show { opacity: 1; transform: translate(-50%, 0); } #cxToast.bad { color: #f87171; border-color: #ef4444; box-shadow: 0 0 22px rgba(239,68,68,.35); }

    .cx-hud { position: relative; flex: none; display: grid; place-items: center; }
    .cx-hud svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 0 6px currentColor); }
    .cx-hud i, .cx-hud > svg.lucide { position: relative; width: 38%; height: 38%; }
    .cx-hud > svg.lucide { position: relative; inset: auto; filter: none; }
    .cx-spin { transform-origin: 50px 50px; animation: cxSpin 9s linear infinite; } .cx-spin.rev { animation-duration: 6s; animation-direction: reverse; }
    .cx-pulse { transform-origin: 50px 50px; animation: cxPulse 2.4s ease-in-out infinite; }
    @keyframes cxSpin { to { transform: rotate(360deg); } }
    @keyframes cxPulse { 0%,100% { transform: scale(.85); opacity: .08; } 50% { transform: scale(1.12); opacity: .22; } }
    .cx-banner { display: flex; align-items: center; gap: 16px; padding: 16px 20px; overflow: hidden; border-color: color-mix(in srgb, var(--c) 45%, transparent) !important; }
    .cx-banner h3 { font-size: 18px; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: .08em; }
    .cx-banner p { font-size: 12.5px; color: #94a3b8; font-weight: 700; margin-top: 2px; }
    .cx-wave { margin-left: auto; width: 220px; height: 40px; color: var(--c); opacity: .7; flex: none; stroke-dasharray: 520; animation: cxWave 3.2s linear infinite; }
    @keyframes cxWave { from { stroke-dashoffset: 520; } to { stroke-dashoffset: 0; } }
    @media (max-width: 640px) { .cx-wave { display: none; } }
    @media (prefers-reduced-motion: reduce) { .cx-spin, .cx-pulse, .cx-wave, .bg-mesh { animation: none !important; } }

    .cx-h { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .cx-tile { background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 12px 14px; min-width: 0; }
    .cx-tile span { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: #94a3b8; }
    .cx-tile b { display: block; font: 800 20px 'Exo 2', sans-serif; color: #fff; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cx-tile small { font-size: 11px; color: #64748b; font-weight: 700; }
    .cx-btn { font-size: 11.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(0,229,255,.35);
        color: #00e5ff; background: rgba(0,229,255,.08); transition: all .2s; white-space: nowrap; cursor: pointer; }
    .cx-btn:hover { background: #00e5ff; color: #000; box-shadow: 0 0 14px rgba(0,229,255,.5); }
    .cx-btn.on { background: #00e5ff; color: #000; }
    .cx-btn.red { color: #f87171; border-color: rgba(239,68,68,.4); background: rgba(239,68,68,.08); } .cx-btn.red:hover { background: #ef4444; color: #000; box-shadow: none; }
    .cx-btn.green { color: #34d399; border-color: rgba(16,185,129,.4); background: rgba(16,185,129,.08); } .cx-btn.green:hover { background: #10b981; color: #000; box-shadow: none; }
    .cx-btn.violet { color: #c084fc; border-color: rgba(168,85,247,.4); background: rgba(168,85,247,.08); } .cx-btn.violet:hover { background: #a855f7; color: #000; box-shadow: none; }
    .cx-btn.sm { padding: 5px 9px; font-size: 10.5px; }
    .cx-in { background: rgba(0,0,0,.6); border: 1px solid rgba(0,229,255,.25); color: #e2e8f0; border-radius: 10px; padding: 9px 11px; font-size: 13px; font-weight: 700; min-width: 0; outline: none; }
    .cx-in:focus { border-color: #fff; box-shadow: 0 0 12px rgba(0,229,255,.35); }
    .cx-lbl { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; color: #94a3b8; margin-bottom: 5px; }
    .cx-empty { text-align: center; padding: 26px 10px; color: #64748b; font-size: 11.5px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; border: 1px dashed rgba(0,229,255,.25); border-radius: 12px; }
    .cx-row { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.06); border-radius: 12px; padding: 10px 12px; }
    .cx-bar { height: 7px; background: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.1); border-radius: 6px; overflow: hidden; }
    .cx-bar > i { display: block; height: 100%; border-radius: 6px; transition: width .4s ease; }

    /* heatmap floaters */
    #upgHeatmap { position: relative; }
    .cx-heat { position: relative; aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; border: 1px solid rgba(255,255,255,.06); cursor: pointer; transition: transform .15s; }
    .cx-heat:hover, .cx-heat.sel { transform: scale(1.12); z-index: 3; outline: 1px solid #fff; }
    .cx-heat.today { box-shadow: 0 0 0 2px #00e5ff; }
    .cx-chip { position: absolute; top: -9px; right: -6px; z-index: 2; font-size: 9px; font-weight: 900; padding: 1px 5px; border-radius: 8px; background: #030712; color: #fbbf24; border: 1px solid #fbbf24;
        box-shadow: 0 0 8px rgba(251,191,36,.6); animation: cxFloat 2.6s ease-in-out infinite; pointer-events: none; white-space: nowrap; }
    .cx-chip.peak { color: #f87171; border-color: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,.7); }
    @keyframes cxFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    #cxHeatFloat { position: fixed; z-index: 2147483600; pointer-events: none; opacity: 0; transition: opacity .15s; width: 220px; background: rgba(3,7,18,.97);
        border: 1px solid #fbbf24; border-radius: 12px; padding: 11px 13px; box-shadow: 0 0 22px rgba(251,191,36,.3); font-size: 12px; color: #e2e8f0; }
    #cxHeatFloat b { font-family: 'Exo 2', sans-serif; }
    .cx-legend { display: flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .08em; margin-top: 12px; flex-wrap: wrap; }
    .cx-legend i { width: 18px; height: 12px; border-radius: 3px; display: inline-block; border: 1px solid rgba(255,255,255,.08); }

    /* chat chips */
    #cxChatChips { display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px 0; scrollbar-width: none; }
    #cxChatChips button { flex: none; font-size: 11px; font-weight: 800; color: #00e5ff; border: 1px solid rgba(0,229,255,.35); background: rgba(0,229,255,.06); border-radius: 14px; padding: 4px 10px; }
    #cxChatChips button:hover { background: #00e5ff; color: #000; }
    `;
    document.head.appendChild(css);
    try { window.name = 'casper'; } catch (e) {}

    // ==========================================================================
    // 2. HEATMAP WITH INTENSITY FLOATERS
    // ==========================================================================
    const LEVELS = [
        { name: 'No spend', col: 'rgba(255,255,255,0.03)' },
        { name: 'Low', col: 'rgba(251,191,36,0.22)' },
        { name: 'Moderate', col: 'rgba(251,191,36,0.48)' },
        { name: 'High', col: 'rgba(249,115,22,0.75)' },
        { name: 'Peak', col: 'rgba(239,68,68,0.9)' }
    ];
    const short = n => n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L' : n >= 1000 ? '₹' + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : '₹' + Math.round(n);

    window.wallyHeatmap = function (m) {
        const el = $('upgHeatmap'); if (!el) return;
        const [y, mo] = m.split('-').map(Number);
        const days = new Date(y, mo, 0).getDate(), offset = (new Date(y, mo - 1, 1).getDay() + 6) % 7;
        const byDay = Array.from({ length: days + 1 }, () => ({ total: 0, n: 0, cats: {}, big: null }));
        monthExp(m).forEach(t => {
            const d = byDay[new Date(t.timestamp).getDate()]; d.total += t.amount; d.n++;
            d.cats[t.category] = (d.cats[t.category] || 0) + t.amount;
            if (!d.big || t.amount > d.big.amount) d.big = t;
        });
        const vals = byDay.slice(1).map(d => d.total).filter(v => v > 0).sort((a, b) => a - b);
        const q = p => vals.length ? vals[Math.min(vals.length - 1, Math.floor(p * vals.length))] : 0;
        const q1 = q(0.4), q2 = q(0.7), q3 = q(0.9);
        const levelOf = v => v <= 0 ? 0 : v <= q1 ? 1 : v <= q2 ? 2 : v <= q3 ? 3 : 4;
        const top = byDay.map((d, i) => ({ i, v: d.total })).filter(d => d.v > 0).sort((a, b) => b.v - a.v).slice(0, 3).map(d => d.i);
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        const isNow = m === mKey(Date.now()), todayN = new Date().getDate();

        let html = '<span></span>'.repeat(offset);
        for (let d = 1; d <= days; d++) {
            const lv = levelOf(byDay[d].total);
            html += `<div class="cx-heat ${isNow && d === todayN ? 'today' : ''}" data-d="${d}" style="background:${LEVELS[lv].col};color:${lv >= 3 ? '#000' : '#cbd5e1'}">${d}${top.includes(d) ? `<span class="cx-chip ${top[0] === d ? 'peak' : ''}">${short(byDay[d].total)}</span>` : ''}</div>`;
        }
        el.innerHTML = html;

        let lg = $('cxHeatLegend');
        if (!lg) { el.insertAdjacentHTML('afterend', '<div id="cxHeatLegend" class="cx-legend"></div>'); lg = $('cxHeatLegend'); }
        lg.innerHTML = `<span>Intensity</span>${LEVELS.map(l => `<i style="background:${l.col}" title="${l.name}"></i>`).join('')}<span>Peak</span><span style="margin-left:auto;color:#fbbf24">Floating tags mark the 3 heaviest days</span>`;

        let fl = $('cxHeatFloat');
        if (!fl) { fl = document.createElement('div'); fl.id = 'cxHeatFloat'; document.body.appendChild(fl); }
        const show = cell => {
            const d = Number(cell.dataset.d), info = byDay[d], lv = levelOf(info.total);
            const topCat = Object.entries(info.cats).sort((a, b) => b[1] - a[1])[0];
            const date = new Date(y, mo - 1, d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
            const vsAvg = avg > 0 && info.total > 0 ? Math.round((info.total / avg - 1) * 100) : null;
            fl.innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;font-size:10.5px;color:#94a3b8"><span>${date}</span><span style="color:${lv >= 3 ? '#f87171' : '#fbbf24'}">${LEVELS[lv].name}</span></div>
                <b style="display:block;font-size:22px;color:#fff;margin:2px 0 6px">${inr(info.total)}</b>
                <div style="display:flex;gap:3px;margin-bottom:8px">${[1, 2, 3, 4].map(i => `<i style="flex:1;height:5px;border-radius:3px;background:${i <= lv ? LEVELS[i].col.replace(/[\d.]+\)$/, '1)') : 'rgba(255,255,255,.08)'}"></i>`).join('')}</div>
                ${info.n ? `<div>${info.n} transaction${info.n > 1 ? 's' : ''}${topCat ? ` • mostly <b style="color:#00e5ff">${esc(topCat[0])}</b>` : ''}</div>
                <div style="color:#94a3b8;margin-top:3px">Largest: ${inr(info.big.amount)} ${esc((info.big.note || info.big.category || '').slice(0, 26))}</div>
                ${vsAvg !== null ? `<div style="margin-top:3px;color:${vsAvg > 0 ? '#f87171' : '#34d399'}">${vsAvg > 0 ? '+' : ''}${vsAvg}% vs an average spend day</div>` : ''}` : '<div style="color:#34d399">Zero-spend day.</div>'}`;
            const r = cell.getBoundingClientRect();
            let left = r.left + r.width / 2 - 110; left = Math.max(8, Math.min(window.innerWidth - 228, left));
            fl.style.left = left + 'px';
            fl.style.top = (r.top > 190 ? r.top - fl.offsetHeight - 10 : r.bottom + 10) + 'px';
            fl.style.opacity = '1'; fl.dataset.t = Date.now();
        };
        el.onmouseover = e => { const c = e.target.closest('.cx-heat'); if (c) show(c); };
        el.onmouseleave = () => { fl.style.opacity = '0'; };
        el.onclick = e => { const c = e.target.closest('.cx-heat'); if (c) { el.querySelectorAll('.sel').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); show(c); } };
    };
    window.addEventListener('scroll', () => { const f = $('cxHeatFloat'); if (f && Date.now() - Number(f.dataset.t || 0) > 400) f.style.opacity = '0'; }, { passive: true });

    // ==========================================================================
    // 3. C.A.S.P.E.R. OFFLINE BRAIN
    // ==========================================================================
    const TIPS = [
        'Pay yourself first: move your savings out the day income lands, then spend what is left.',
        'A subscription audit every quarter usually frees up more than a month of coffee money.',
        'Three to six months of expenses in the emergency fund comes before any risky investment.',
        'If a want survives a 30-day wait on the wishlist, it is probably worth buying.',
        'Raise your SIP by even 10% a year; the step-up matters more than the starting amount.',
        'Track the big three first: housing, food and transport usually decide the whole budget.'
    ];
    function period(m) {
        const now = new Date();
        if (/\btoday\b/.test(m)) return { label: 'today', f: t => new Date(t.timestamp).toDateString() === now.toDateString() };
        if (/yesterday/.test(m)) { const d = new Date(now); d.setDate(d.getDate() - 1); return { label: 'yesterday', f: t => new Date(t.timestamp).toDateString() === d.toDateString() }; }
        if (/week/.test(m)) { const s = new Date(now); s.setDate(now.getDate() - 6); s.setHours(0, 0, 0, 0); return { label: 'in the last 7 days', f: t => t.timestamp >= s.getTime() }; }
        if (/last month/.test(m)) { const k = mKey(new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()); return { label: 'last month', f: t => mKey(t.timestamp) === k }; }
        if (/year/.test(m)) return { label: 'this year', f: t => new Date(t.timestamp).getFullYear() === now.getFullYear() };
        if (/all time|overall|ever|so far in total/.test(m)) return { label: 'overall', f: () => true };
        return { label: 'this month', f: t => mKey(t.timestamp) === mKey(Date.now()) };
    }
    const num = s => { const x = String(s).match(/(\d[\d,]*(?:\.\d+)?)\s*(k|l|lakh|lakhs)?/i); if (!x) return null; let n = parseFloat(x[1].replace(/,/g, '')); if (/^k$/i.test(x[2] || '')) n *= 1000; if (/^l/i.test(x[2] || '')) n *= 100000; return n; };

    function brain(raw) {
        const m = raw.toLowerCase().trim();
        const st = monthStats(), bal = balances();
        const go = { dashboard: /dashboard|home/, investments: /invest/, wishlist: /wishlist|cart/, media: /vault|media|library|watchlist/, workspace: /workspace|notes|whiteboard|sketch/, growth: /growth/, planner: /planner|tasks|todo/ };

        if (/^(hi|hello|hey|yo|good (morning|evening|afternoon))\b/.test(m)) {
            const h = new Date().getHours();
            return `Good ${h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'}. Liquid assets stand at <b>${inr(bal.liquid)}</b> and you can spend about <b>${inr(st.safe)}</b> a day for the rest of the month. What do you need?`;
        }
        let x = m.match(/^(?:go to|open|show|switch to)\s+(.+)/);
        if (x) for (const v in go) if (go[v].test(x[1])) { setTimeout(() => switchMainView(v), 300); return `Opening <b>${v === 'media' ? 'Library' : v}</b>.`; }

        x = raw.match(/^(?:add )?(?:task|todo|remind me to)[:\s]+(.+)/i);
        if (x && window.CXPlanner) { window.CXPlanner.add(x[1].trim()); return `Task added to the Planner: <b>${esc(x[1].trim())}</b>.`; }

        x = raw.match(/^(?:add (?:to )?wishlist|wish)[:\s]+(.+?)\s+(?:for\s+)?(?:₹|rs\.?\s*)?(\d[\d,.]*\s*(?:k|l|lakh)?)$/i);
        if (x) {
            const price = num(x[2]) || 0;
            wishlistItems.push({ id: String(Date.now()), title: x[1].trim(), price, link: '', imageUrl: '', category: 'MANUAL', wishCategory: 'Lifestyle', timestamp: Date.now() });
            saveWishlistLocally(); renderWishlist();
            return `Added <b>${esc(x[1].trim())}</b> at ${inr(price)} to your wishlist.`;
        }

        if (/afford/.test(m)) {
            let price = num(m), name = '';
            const hit = wishlistItems.find(w => !w.purchased && w.title && m.includes(w.title.toLowerCase().split(' ').slice(0, 2).join(' ')));
            if (hit) { price = hit.price; name = hit.title; }
            if (!price) return 'Tell me the amount, for example <b>can I afford 15000</b>, or name an item from your wishlist.';
            const after = bal.liquid - price, plan = monthlyWishlistSavings || 0;
            let out = `${name ? `<b>${esc(name)}</b> costs ${inr(price)}. ` : ''}`;
            if (after < 0) out += `Not from current cash: you are short by <b>${inr(-after)}</b>.`;
            else if (price > st.left && st.left > 0) out += `You have the cash (${inr(after)} would remain), but it would push this month over budget by <b>${inr(price - st.left)}</b>.`;
            else out += `Yes. You would still hold <b>${inr(after)}</b> in liquid assets${st.left > 0 ? ` and ${inr(st.left - price)} of this month's budget` : ''}.`;
            if (plan > 0) out += `<br>At your ${inr(plan)}/month wishlist plan this takes about <b>${Math.ceil(price / plan * 30)} days</b> to save for.`;
            return out;
        }

        if (/budget|safe to spend|how much (can|left)/.test(m)) {
            const pct = Math.round(st.spent / st.budget * 100);
            return `Budget for this month: <b>${inr(st.budget)}</b>.<br>Spent: <b>${inr(st.spent)}</b> (${pct}%).<br>${st.left >= 0 ? `Remaining: <b>${inr(st.left)}</b>, which is about <b>${inr(st.safe)}</b> a day.` : `You are over by <b>${inr(-st.left)}</b>.`}`;
        }
        if (/forecast|predict|projection|end of month|eom/.test(m)) {
            if (!st.exp.length) return 'No expenses logged this month yet, so there is nothing to project.';
            const d = st.proj - st.budget;
            return `At the current pace you will spend about <b>${inr(st.proj)}</b> by month end, ${d > 0 ? `<b>${inr(d)} over</b>` : `<b>${inr(-d)} under</b>`} your ${inr(st.budget)} budget.${st.day < 5 ? '<br>It is early in the month, so one large payment can skew this.' : ''}`;
        }
        if (/saving(s)? rate|how much (did i|am i) sav/.test(m)) {
            if (!st.income) return 'No income is logged this month, so I cannot work out a savings rate.';
            const r = Math.round((st.income - st.spent) / st.income * 100);
            return `Income this month: ${inr(st.income)}. Spent: ${inr(st.spent)}.<br>Savings rate: <b>${r}%</b>. ${r >= 20 ? 'That clears the usual 20% target.' : 'The usual target is 20% or more.'}`;
        }
        if (/biggest|largest|highest|most expensive/.test(m)) {
            const p = period(m), list = transactions.filter(t => t.type === 'expense' && p.f(t)).sort((a, b) => b.amount - a.amount).slice(0, 3);
            if (!list.length) return `No expenses found ${p.label}.`;
            return `Largest expenses ${p.label}:<br>` + list.map(t => `• ${inr(t.amount)}: ${esc(t.note || t.category)} (${new Date(t.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`).join('<br>');
        }
        if (/spen[dt]|spending|expenses?|paid/.test(m)) {
            const p = period(m);
            let term = (m.match(/\b(?:on|for|at|in)\s+([a-z0-9 &]+?)(?:\s+(?:this|last|today|yesterday|in|so|overall|all).*)?$/) || [])[1];
            if (term && /^(this|last|today|total|the)\b/.test(term)) term = null;
            const pool = transactions.filter(t => t.type === 'expense' && t.account !== 'Emergency' && p.f(t));
            if (term) {
                term = term.trim();
                const list = pool.filter(t => (t.category || '').toLowerCase().includes(term) || (t.note || '').toLowerCase().includes(term));
                if (!list.length) return `I found no expenses matching <b>${esc(term)}</b> ${p.label}.`;
                return `You spent <b>${inr(list.reduce((a, t) => a + t.amount, 0))}</b> on <b>${esc(term)}</b> ${p.label}, across ${list.length} transaction${list.length > 1 ? 's' : ''}.`;
            }
            if (!pool.length) return `No expenses logged ${p.label}.`;
            const cats = pool.reduce((o, t) => { o[t.category] = (o[t.category] || 0) + t.amount; return o; }, {});
            return `Total spent ${p.label}: <b>${inr(pool.reduce((a, t) => a + t.amount, 0))}</b>.<br>` + Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([c, v]) => `• ${esc(c)}: ${inr(v)}`).join('<br>');
        }
        if (/income|earn/.test(m) && !/^earned|^received|^got/.test(m)) {
            const p = period(m), list = transactions.filter(t => t.type === 'income' && t.account !== 'Emergency' && p.f(t));
            return `Income ${p.label}: <b>${inr(list.reduce((a, t) => a + t.amount, 0))}</b> from ${list.length} entr${list.length === 1 ? 'y' : 'ies'}.`;
        }
        if (/net ?worth|portfolio|investment/.test(m) && window.CXInvest) {
            const t = window.CXInvest.totals();
            return `Portfolio: <b>${inr(t.current)}</b> (invested ${inr(t.invested)}, ${t.pl >= 0 ? 'gain' : 'loss'} of ${inr(Math.abs(t.pl))}).<br>Net worth including cash and emergency fund: <b>${inr(t.current + bal.liquid + bal.ef)}</b>.`;
        }
        if (/wishlist|cart|buy next/.test(m)) {
            const open = wishlistItems.filter(w => !w.purchased);
            if (!open.length) return 'Your wishlist is empty. Paste a product link on the Wishlist tab or use the capture bookmark.';
            const plan = monthlyWishlistSavings || 0;
            return `You have <b>${open.length}</b> item${open.length > 1 ? 's' : ''} worth <b>${inr(open.reduce((a, w) => a + (w.price || 0), 0))}</b>.<br>` +
                open.slice().sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, 4).map(w => `• ${esc(w.title)}: ${inr(w.price)}${plan > 0 ? ` (~${Math.ceil((w.price || 0) / plan * 30)} days)` : ''}`).join('<br>') + (plan > 0 ? '' : '<br>Set a monthly savings plan on the Wishlist tab to see how long each takes.');
        }
        if (/watch|read|vault|library|movie|book|bored/.test(m)) {
            const wantBook = /read|book/.test(m), wantMov = /watch|movie|series|anime/.test(m);
            let pool = mediaItems.filter(i => (i.mediaStatus || 'Planned') !== 'Completed');
            if (wantBook && !wantMov) pool = pool.filter(i => i.wishCategory === 'Book');
            if (wantMov && !wantBook) pool = pool.filter(i => i.wishCategory !== 'Book');
            const on = pool.filter(i => i.mediaStatus === 'In Progress');
            if (!pool.length) return 'Nothing is queued in the Library for that. Add something with a link or the capture bookmark.';
            const pick = on[0] || pool[Math.floor(Math.random() * pool.length)];
            return `${on[0] ? 'You are in the middle of' : 'From your queue I would pick'} <b>${esc(pick.title)}</b> (${esc(pick.wishCategory || 'Media')}${pick.mediaGenre ? ', ' + esc(pick.mediaGenre) : ''}).`;
        }
        if (/mood|tired|exhaust|drained|motivat|lazy|energy|focus|stressed|pumped|feel(ing)? (great|good|bad|low|down|awful|amazing)/.test(m) && window.CXGrowth) {
            const felt = /exhaust|drained|awful|burn(ed|t) out/.test(m) ? 1 : /tired|lazy|stressed|low|down|bad|unmotivated|no motivation/.test(m) ? 2 : /pumped|amazing|great|charged/.test(m) ? 5 : /feel(ing)? good/.test(m) ? 4 : 0;
            let pre = '';
            if (felt) { window.CXGrowth.setMood(felt); pre = `Logged your mood as <b>${['Drained', 'Low', 'Neutral', 'Good', 'Charged'][felt - 1]}</b> and re-planned the day.<br>`; }
            return pre + window.CXGrowth.directiveText();
        }
        if (/habit/.test(m)) {
            try {
                const done = (habitHistory[todayStr()] || []).length, total = customHabits.length;
                const left = customHabits.filter(h => !(habitHistory[todayStr()] || []).includes(h.id)).map(h => esc(h.text));
                return `Habits today: <b>${done} of ${total}</b> done.${left.length ? '<br>Still open: ' + left.join(', ') + '.' : ' All clear.'}`;
            } catch (e) { return 'Open the Growth tab to see your habit matrix.'; }
        }
        if (/task|todo|due|agenda|plan (for )?today/.test(m) && window.CXPlanner) return window.CXPlanner.brief();
        if (/tip|advice|suggest/.test(m)) return TIPS[Math.floor(Math.random() * TIPS.length)];
        if (/who are you|what are you|your name/.test(m)) return 'I am C.A.S.P.E.R., the Calculated Asset Security and Personal Expense Recorder. I am running in offline mode, answering from the data stored in this browser.';
        if (/thank/.test(m)) return 'Always. Anything else?';
        if (/^(commands|menu|what can you do)$/.test(m)) return null; // handled below
        return undefined;
    }

    const HELP = `I am in <b>offline mode</b> and answer from your local data. Try:<br>
        • <b>spent 250 on swiggy</b> / <b>earned 5000 freelance</b><br>
        • <b>how much did I spend on food last month</b><br>
        • <b>budget</b>, <b>forecast</b>, <b>savings rate</b>, <b>biggest expense this week</b><br>
        • <b>can I afford 15000</b>, <b>wishlist</b>, <b>net worth</b><br>
        • <b>add wishlist Keyboard 4500</b>, <b>task: pay rent</b><br>
        • <b>what should I watch</b>, <b>habits</b>, <b>I feel tired</b>, <b>tip</b><br>
        • <b>open planner</b> (or any tab)`;

    const prevSend = window.sendCasperMessage;
    window.sendCasperMessage = function () {
        const input = $('casperInput'), body = $('casperChatBody');
        const msg = input ? input.value.trim() : '';
        if (!msg || !body) return;
        const ml = msg.toLowerCase();
        const isLog = /^(spent|paid|add \d|add ₹|earned|received|got)\b/.test(ml);
        let reply;
        if (!isLog) { try { reply = brain(msg); } catch (e) { console.warn('CASPER brain error', e); reply = undefined; } }
        if (reply === undefined && !isLog && !/^(help|commands|menu|\?|balance|summary|top|explain)$/.test(ml) && !/my balance|this month|how to/.test(ml) && window.CXAI && window.CXAI.ready()) return window.CXAI.ask(msg);   // open questions go to the AI when the server has one
        if (reply === null || /^(help|commands|menu|\?)$/.test(ml) || (reply === undefined && !isLog && !/^(balance|summary|top|explain)$/.test(ml) && !/my balance|this month|how to/.test(ml))) reply = reply || HELP;
        if (reply === undefined || reply === null) return prevSend.apply(this, arguments);
        body.insertAdjacentHTML('beforeend', `<div class="bg-black/60 border border-[#00e5ff]/40 p-3 rounded-xl rounded-tr-none w-10/12 ml-auto text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]">${esc(msg)}</div>`);
        input.value = ''; body.scrollTop = body.scrollHeight;
        const lid = 'cxl_' + Date.now();
        body.insertAdjacentHTML('beforeend', `<div id="${lid}" class="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-3 rounded-xl rounded-tl-none w-10/12 text-[#00e5ff]">Analysing…</div>`);
        body.scrollTop = body.scrollHeight;
        setTimeout(() => {
            const l = $(lid); if (l) { l.innerHTML = reply; l.classList.add('shadow-[inset_0_0_10px_rgba(0,229,255,0.1)]'); }
            body.scrollTop = body.scrollHeight;
        }, 350);
    };

    function chatChips() {
        const input = $('casperInput'); if (!input || $('cxChatChips')) return;
        const host = input.closest('div');
        const chips = ['Balance', 'Summary', 'Budget', 'Forecast', 'Wishlist', 'What should I watch', 'Habits', 'Tip', 'Help'];
        host.insertAdjacentHTML('beforebegin', `<div id="cxChatChips">${chips.map(c => `<button type="button">${c}</button>`).join('')}</div>`);
        $('cxChatChips').onclick = e => { const b = e.target.closest('button'); if (!b) return; input.value = b.textContent; window.sendCasperMessage(); };
        input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.defaultPrevented && !input.dataset.cxEnter) { /* original handler, if any, sends */ } });
    }

    // ==========================================================================
    // 4. INVESTMENTS — PORTFOLIO COMMAND
    // ==========================================================================
    const TYPES = ['Equity', 'Mutual Fund', 'Gold', 'Fixed Deposit', 'PPF / EPF', 'Crypto', 'Real Estate', 'Cash / Other'];
    const TYPE_COL = { 'Equity': '#00e5ff', 'Mutual Fund': '#10b981', 'Gold': '#fbbf24', 'Fixed Deposit': '#3b82f6', 'PPF / EPF': '#a855f7', 'Crypto': '#f97316', 'Real Estate': '#ec4899', 'Cash / Other': '#94a3b8' };
    const pf = () => getJ('walletPortfolio', []);
    const goals = () => getJ('walletInvestGoals', []);
    function totals() {
        const p = pf(), invested = p.reduce((a, h) => a + (h.invested || 0), 0), current = p.reduce((a, h) => a + (h.current || 0), 0);
        return { invested, current, pl: current - invested, pct: invested ? (current - invested) / invested * 100 : 0 };
    }
    const sipNeeded = (target, years, rate, have) => {
        const r = rate / 100 / 12, n = Math.round(years * 12);
        const gap = target - (have || 0) * Math.pow(1 + r, n);
        if (gap <= 0) return 0;
        return r === 0 ? gap / n : gap * r / ((Math.pow(1 + r, n) - 1) * (1 + r));
    };

    const CALCS = {
        lumpsum: { name: 'Lumpsum', fields: [['Amount (₹)', 100000], ['Return % p.a.', 12], ['Years', 10]], run: ([p, r, y]) => { const fv = p * Math.pow(1 + r / 100, y); return [inr(fv), `Gain ${inr(fv - p)} on ${inr(p)} invested`]; } },
        stepup: { name: 'Step-up SIP', fields: [['Monthly SIP (₹)', 5000], ['Yearly step-up %', 10], ['Return % p.a.', 12], ['Years', 15]], run: ([s, up, r, y]) => { let fv = 0, inv = 0, sip = s; const mr = r / 100 / 12; for (let yr = 0; yr < y; yr++) { for (let i = 0; i < 12; i++) { fv = (fv + sip) * (1 + mr); inv += sip; } sip *= 1 + up / 100; } return [inr(fv), `Invested ${inr(inv)} • Gain ${inr(fv - inv)}`]; } },
        emi: { name: 'Loan EMI', fields: [['Loan amount (₹)', 500000], ['Interest % p.a.', 9.5], ['Tenure (months)', 60]], run: ([p, r, n]) => { const mr = r / 100 / 12; const emi = mr === 0 ? p / n : p * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1); return [inr(emi) + ' / mo', `Total interest ${inr(emi * n - p)} • Total paid ${inr(emi * n)}`]; } },
        inflation: { name: 'Future cost', fields: [['Cost today (₹)', 100000], ['Inflation % p.a.', 6], ['Years', 10]], run: ([c, i, y]) => { const f = c * Math.pow(1 + i / 100, y); return [inr(f), `${inr(c)} today buys what ${inr(f)} will in ${y} years`]; } },
        cagr: { name: 'CAGR', fields: [['Start value (₹)', 100000], ['End value (₹)', 180000], ['Years', 4]], run: ([a, b, y]) => { const c = (a > 0 && y > 0) ? (Math.pow(b / a, 1 / y) - 1) * 100 : 0; return [c.toFixed(2) + '% p.a.', `Absolute return ${a > 0 ? ((b / a - 1) * 100).toFixed(1) : 0}%`]; } }
    };
    let calcTab = 'lumpsum', allocChart = null;

    function injectInvest() {
        const view = $('viewInvestments'); if (!view || $('cxInvest')) return;
        view.firstElementChild.insertAdjacentHTML('afterend', `
        <div id="cxInvest" class="space-y-4 md:space-y-6">
            ${banner('Portfolio Command', 'Your total investing picture: holdings, allocation, net worth and goals. Stored on this device.', 'landmark', '#fbbf24')}
            <div id="cxPfTiles" class="grid grid-cols-2 lg:grid-cols-5 gap-3"></div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6">
                    <h4 class="cx-h text-[#fbbf24]"><i data-lucide="pie-chart" class="w-4 h-4"></i> Allocation</h4>
                    <div style="height:210px;position:relative"><canvas id="cxAllocChart"></canvas></div>
                    <div id="cxAllocLegend" class="mt-3 space-y-1.5"></div>
                </div>
                <div class="glass-panel p-5 md:p-6 lg:col-span-2">
                    <h4 class="cx-h text-[#10b981]"><i data-lucide="briefcase" class="w-4 h-4"></i> Holdings</h4>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 items-end">
                        <div class="col-span-2 md:col-span-1"><label class="cx-lbl">Name</label><input id="cxPfName" class="cx-in w-full" placeholder="Nifty 50 Index"></div>
                        <div><label class="cx-lbl">Type</label><select id="cxPfType" class="cx-in w-full">${TYPES.map(t => `<option>${t}</option>`).join('')}</select></div>
                        <div><label class="cx-lbl">Invested ₹</label><input id="cxPfInv" type="number" min="0" class="cx-in w-full"></div>
                        <div><label class="cx-lbl">Value now ₹</label><input id="cxPfCur" type="number" min="0" class="cx-in w-full" placeholder="same"></div>
                        <button class="cx-btn green col-span-2 md:col-span-1" onclick="CXInvest.add()">+ Add holding</button>
                    </div>
                    <div id="cxPfList" class="space-y-2 max-h-[300px] overflow-y-auto ledger-scrollbar pr-1"></div>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6">
                    <h4 class="cx-h text-[#00e5ff]"><i data-lucide="flag" class="w-4 h-4"></i> Goal Planner</h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 items-end">
                        <div class="col-span-2"><label class="cx-lbl">Goal</label><input id="cxGlName" class="cx-in w-full" placeholder="Bike, house down payment…"></div>
                        <div><label class="cx-lbl">Target ₹</label><input id="cxGlTarget" type="number" min="0" class="cx-in w-full"></div>
                        <div><label class="cx-lbl">Years</label><input id="cxGlYears" type="number" min="0.5" step="0.5" value="3" class="cx-in w-full"></div>
                        <div><label class="cx-lbl">Return %</label><input id="cxGlRate" type="number" step="0.5" value="10" class="cx-in w-full"></div>
                        <div><label class="cx-lbl">Saved so far ₹</label><input id="cxGlHave" type="number" min="0" value="0" class="cx-in w-full"></div>
                        <button class="cx-btn col-span-2" onclick="CXInvest.addGoal()">+ Add goal</button>
                    </div>
                    <div id="cxGlList" class="space-y-3"></div>
                </div>
                <div class="glass-panel p-5 md:p-6">
                    <h4 class="cx-h text-[#a855f7]"><i data-lucide="calculator" class="w-4 h-4"></i> Calculator Lab</h4>
                    <div id="cxCalcTabs" class="flex gap-2 flex-wrap mb-4"></div>
                    <div id="cxCalcFields" class="grid grid-cols-2 gap-2 mb-4"></div>
                    <div class="cx-tile"><span>Result</span><b id="cxCalcOut" style="font-size:26px;color:#c084fc">—</b><small id="cxCalcSub"></small></div>
                </div>
            </div>
        </div>`);
        renderCalc();
    }

    function renderCalc() {
        const tabs = $('cxCalcTabs'); if (!tabs) return;
        tabs.innerHTML = Object.keys(CALCS).map(k => `<button class="cx-btn violet sm ${k === calcTab ? 'on' : ''}" style="${k === calcTab ? 'background:#a855f7;color:#000' : ''}" onclick="CXInvest.calc('${k}')">${CALCS[k].name}</button>`).join('');
        $('cxCalcFields').innerHTML = CALCS[calcTab].fields.map((f, i) => `<div><label class="cx-lbl">${f[0]}</label><input type="number" step="any" class="cx-in w-full cx-calc-in" data-i="${i}" value="${f[1]}"></div>`).join('');
        const run = () => {
            const vals = [...document.querySelectorAll('.cx-calc-in')].map(e => parseFloat(e.value) || 0);
            const [a, b] = CALCS[calcTab].run(vals);
            $('cxCalcOut').textContent = a; $('cxCalcSub').textContent = b;
        };
        $('cxCalcFields').oninput = run; run();
    }

    function renderInvest() {
        injectInvest(); if (!$('cxInvest')) return;
        const p = pf(), t = totals(), bal = balances();
        const thisM = mKey(Date.now());
        const contrib = transactions.filter(x => x.type === 'expense' && x.category === 'Investments' && mKey(x.timestamp) === thisM).reduce((a, x) => a + x.amount, 0);
        $('cxPfTiles').innerHTML = `
            <div class="cx-tile"><span>Invested</span><b>${inr(t.invested)}</b><small>${p.length} holding${p.length === 1 ? '' : 's'}</small></div>
            <div class="cx-tile"><span>Current value</span><b style="color:#fbbf24">${inr(t.current)}</b><small>as last updated by you</small></div>
            <div class="cx-tile"><span>Profit / loss</span><b style="color:${t.pl >= 0 ? '#34d399' : '#f87171'}">${t.pl >= 0 ? '+' : '−'}${inr(Math.abs(t.pl))}</b><small>${t.pct >= 0 ? '+' : ''}${t.pct.toFixed(1)}%</small></div>
            <div class="cx-tile"><span>Net worth</span><b style="color:#00e5ff">${inr(t.current + bal.liquid + bal.ef)}</b><small>portfolio + cash + emergency</small></div>
            <div class="cx-tile col-span-2 lg:col-span-1"><span>Invested this month</span><b>${inr(contrib)}</b><small>ledger entries tagged Investments</small></div>`;

        $('cxPfList').innerHTML = p.length ? p.map(h => {
            const pl = (h.current || 0) - (h.invested || 0), pct = h.invested ? pl / h.invested * 100 : 0;
            return `<div class="cx-row"><i style="width:8px;height:34px;border-radius:4px;background:${TYPE_COL[h.type] || '#94a3b8'};flex:none"></i>
                <div class="flex-1 min-w-0"><p class="text-sm font-bold text-white truncate">${esc(h.name)}</p><p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">${esc(h.type)} • invested ${inr(h.invested)}</p></div>
                <div class="text-right shrink-0"><p class="text-sm font-black text-white">${inr(h.current)}</p><p class="text-[10px] font-bold" style="color:${pl >= 0 ? '#34d399' : '#f87171'}">${pl >= 0 ? '+' : '−'}${inr(Math.abs(pl))} (${pct.toFixed(1)}%)</p></div>
                <button class="cx-btn sm" title="Update current value" onclick="CXInvest.update(${idArg(h.id)})">Update</button>
                <button class="cx-btn red sm" onclick="CXInvest.remove(${idArg(h.id)})">✕</button></div>`;
        }).join('') : '<div class="cx-empty">No holdings yet. Add your first one above.</div>';

        const byType = {}; p.forEach(h => { byType[h.type] = (byType[h.type] || 0) + (h.current || 0); });
        const keys = Object.keys(byType).filter(k => byType[k] > 0);
        $('cxAllocLegend').innerHTML = keys.length ? keys.sort((a, b) => byType[b] - byType[a]).map(k => `<div class="flex justify-between text-xs font-bold"><span style="color:${TYPE_COL[k]}">● ${esc(k)}</span><span class="text-gray-300">${(byType[k] / t.current * 100).toFixed(1)}% • ${inr(byType[k])}</span></div>`).join('') : '<div class="cx-empty">Allocation appears once you add holdings.</div>';
        const cv = $('cxAllocChart');
        if (cv && typeof Chart !== 'undefined') {
            try {
                if (allocChart) allocChart.destroy();
                allocChart = new Chart(cv, { type: 'doughnut', data: { labels: keys.length ? keys : ['Empty'], datasets: [{ data: keys.length ? keys.map(k => byType[k]) : [1], backgroundColor: keys.length ? keys.map(k => TYPE_COL[k]) : ['rgba(255,255,255,0.06)'], borderColor: '#040910', borderWidth: 2 }] },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { enabled: keys.length > 0, callbacks: { label: c => ` ${c.label}: ${inr(c.raw)}` } } } } });
            } catch (e) {}
        }

        const g = goals();
        $('cxGlList').innerHTML = g.length ? g.map(x => {
            const need = sipNeeded(x.target, x.years, x.rate, x.have), pct = Math.min(100, (x.have || 0) / x.target * 100);
            return `<div><div class="flex justify-between items-center gap-2 mb-1.5"><span class="text-sm font-bold text-white truncate">${esc(x.name)}</span>
                <span class="flex gap-1.5 shrink-0"><button class="cx-btn sm" onclick="CXInvest.fund(${idArg(x.id)})">+ Saved</button><button class="cx-btn red sm" onclick="CXInvest.delGoal(${idArg(x.id)})">✕</button></span></div>
                <div class="cx-bar"><i style="width:${pct}%;background:#00e5ff"></i></div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1.5">${inr(x.have || 0)} of ${inr(x.target)} • ${x.years} yr at ${x.rate}% • ${need > 0 ? `needs <span style="color:#00e5ff">${inr(need)}/month</span>` : '<span style="color:#34d399">on track without further SIP</span>'}</p></div>`;
        }).join('') : '<div class="cx-empty">No goals yet. Add one to see the monthly SIP it needs.</div>';
        icons();
    }

    window.CXInvest = {
        totals,
        add() {
            const name = $('cxPfName').value.trim(), inv = parseFloat($('cxPfInv').value) || 0;
            if (!name || inv <= 0) return toast('Enter a name and the amount invested.', true);
            const cur = $('cxPfCur').value === '' ? inv : (parseFloat($('cxPfCur').value) || 0);
            const p = pf(); p.push({ id: Date.now(), name, type: $('cxPfType').value, invested: inv, current: cur, ts: Date.now() }); setJ('walletPortfolio', p);
            $('cxPfName').value = ''; $('cxPfInv').value = ''; $('cxPfCur').value = ''; renderInvest(); toast('Holding added.');
        },
        update(id) {
            const p = pf(), h = p.find(x => x.id === id); if (!h) return;
            const v = prompt(`Current value of ${h.name} (₹):`, h.current); if (v === null) return;
            const more = prompt('Add to the invested amount (₹)? Leave 0 if you only want to update the value.', '0'); if (more === null) return;
            h.current = parseFloat(v) || 0; h.invested += parseFloat(more) || 0; setJ('walletPortfolio', p); renderInvest();
        },
        remove(id) { if (!confirm('Remove this holding?')) return; setJ('walletPortfolio', pf().filter(x => x.id !== id)); renderInvest(); },
        addGoal() {
            const name = $('cxGlName').value.trim(), target = parseFloat($('cxGlTarget').value) || 0;
            if (!name || target <= 0) return toast('Enter a goal name and a target amount.', true);
            const g = goals(); g.push({ id: Date.now(), name, target, years: parseFloat($('cxGlYears').value) || 1, rate: parseFloat($('cxGlRate').value) || 0, have: parseFloat($('cxGlHave').value) || 0 });
            setJ('walletInvestGoals', g); $('cxGlName').value = ''; $('cxGlTarget').value = ''; renderInvest();
        },
        fund(id) { const g = goals(), x = g.find(i => i.id === id); if (!x) return; const v = prompt(`Total saved so far for ${x.name} (₹):`, x.have || 0); if (v === null) return; x.have = parseFloat(v) || 0; setJ('walletInvestGoals', g); renderInvest(); },
        delGoal(id) { if (!confirm('Delete this goal?')) return; setJ('walletInvestGoals', goals().filter(x => x.id !== id)); renderInvest(); },
        calc(k) { calcTab = k; renderCalc(); },
        render: renderInvest
    };

    // ==========================================================================
    // 5. PLANNER TAB (new)
    // ==========================================================================
    const tasks = () => getJ('walletTasks', []);
    function upcomingBills() {
        const seen = {}, out = [], now = new Date(); now.setHours(0, 0, 0, 0);
        transactions.filter(t => t.isRecurring && t.type === 'expense').sort((a, b) => b.timestamp - a.timestamp).forEach(t => {
            const key = (t.note || t.category) + '|' + t.amount; if (seen[key]) return; seen[key] = 1;
            const dom = new Date(t.timestamp).getDate();
            let due = new Date(now.getFullYear(), now.getMonth(), Math.min(dom, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()));
            const paidThisMonth = mKey(t.timestamp) === mKey(Date.now());
            if (due < now || paidThisMonth) due = new Date(now.getFullYear(), now.getMonth() + 1, Math.min(dom, new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate()));
            out.push({ name: t.note || t.category, amount: t.amount, due, days: Math.round((due - now) / 86400000) });
        });
        return out.sort((a, b) => a.due - b.due);
    }

    function injectPlanner() {
        if ($('viewPlanner')) return;
        const main = $('mainContainer'), growBtn = $('navGrowth'); if (!main || !growBtn) return;
        growBtn.insertAdjacentHTML('afterend', `<button onclick="switchMainView('planner')" id="navPlanner" class="nav-btn flex-1 px-4 py-2.5 rounded-lg font-bold text-sm text-gray-500 hover:text-white uppercase tracking-wider border border-transparent whitespace-nowrap"><i data-lucide="calendar-check" class="inline w-4 h-4 mr-1.5"></i> Planner</button>`);
        main.insertAdjacentHTML('beforeend', `
        <div id="viewPlanner" class="view-card space-y-4 md:space-y-6">
            ${banner('Mission Planner', 'Daily brief, tasks, upcoming recurring bills and a month view in one place.', 'calendar-check', '#00e5ff')}
            <div id="cxBrief" class="grid grid-cols-2 lg:grid-cols-4 gap-3"></div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6 lg:col-span-2">
                    <h4 class="cx-h text-[#00e5ff]"><i data-lucide="list-checks" class="w-4 h-4"></i> Tasks</h4>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <input id="cxTaskText" class="cx-in flex-1" style="min-width:160px" placeholder="What needs doing?" onkeydown="if(event.key==='Enter')CXPlanner.addFromForm()">
                        <input id="cxTaskDue" type="date" class="cx-in">
                        <select id="cxTaskPri" class="cx-in"><option value="2">Normal</option><option value="1">High</option><option value="3">Low</option></select>
                        <button class="cx-btn" onclick="CXPlanner.addFromForm()">+ Add</button>
                    </div>
                    <div id="cxTaskList" class="space-y-4"></div>
                </div>
                <div class="space-y-4 md:space-y-6">
                    <div class="glass-panel p-5 md:p-6">
                        <h4 class="cx-h text-[#fbbf24]"><i data-lucide="calendar" class="w-4 h-4"></i> <span id="cxCalTitle">Month</span></h4>
                        <div class="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-500 uppercase mb-1"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
                        <div id="cxCal" class="grid grid-cols-7 gap-1"></div>
                        <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-3"><span style="color:#00e5ff">●</span> task due &nbsp; <span style="color:#fbbf24">●</span> bill due</p>
                    </div>
                    <div class="glass-panel p-5 md:p-6">
                        <h4 class="cx-h text-[#f87171]"><i data-lucide="receipt" class="w-4 h-4"></i> Upcoming bills</h4>
                        <div id="cxBills" class="space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>`);
    }

    function renderPlanner() {
        injectPlanner(); if (!$('viewPlanner')) return;
        const all = tasks(), td = todayStr(), st = monthStats(), bal = balances(), bills = upcomingBills();
        const open = all.filter(t => !t.done);
        const dueToday = open.filter(t => t.due === td), overdue = open.filter(t => t.due && t.due < td);
        const mode = window.CXGrowth ? window.CXGrowth.mode() : null;
        const nextBill = bills[0];
        $('cxBrief').innerHTML = `
            <div class="cx-tile"><span>${new Date().toLocaleDateString('en-GB', { weekday: 'long' })}</span><b>${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</b><small>${dueToday.length} due today${overdue.length ? ` • ${overdue.length} overdue` : ''}</small></div>
            <div class="cx-tile"><span>Safe to spend today</span><b style="color:#00e5ff">${inr(st.safe)}</b><small>liquid ${inr(bal.liquid)}</small></div>
            <div class="cx-tile"><span>Next bill</span><b style="color:#fbbf24">${nextBill ? inr(nextBill.amount) : '—'}</b><small>${nextBill ? `${esc(nextBill.name.slice(0, 18))} in ${nextBill.days} day${nextBill.days === 1 ? '' : 's'}` : 'no recurring entries'}</small></div>
            <div class="cx-tile"><span>Today's mode</span><b style="color:${mode ? mode.color : '#94a3b8'}">${mode ? mode.name : 'Not set'}</b><small>${mode ? mode.block + ' min focus blocks' : 'log your mood on Growth'}</small></div>`;

        const row = t => `<div class="cx-row" style="${t.done ? 'opacity:.5' : ''}">
            <input type="checkbox" class="form-check" ${t.done ? 'checked' : ''} onchange="CXPlanner.toggle(${idArg(t.id)})">
            <div class="flex-1 min-w-0"><p class="text-sm font-bold text-white break-words" style="${t.done ? 'text-decoration:line-through' : ''}">${esc(t.text)}</p>
            ${t.due ? `<p class="text-[10px] font-bold uppercase tracking-widest" style="color:${!t.done && t.due < td ? '#f87171' : '#94a3b8'}">${new Date(t.due + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>` : ''}</div>
            <span class="text-[10px] font-black uppercase tracking-widest" style="color:${t.pri === 1 ? '#f87171' : t.pri === 3 ? '#64748b' : '#fbbf24'}">${t.pri === 1 ? 'High' : t.pri === 3 ? 'Low' : 'Normal'}</span>
            <button class="cx-btn red sm" onclick="CXPlanner.remove(${idArg(t.id)})">✕</button></div>`;
        const sortFn = (a, b) => (a.pri - b.pri) || String(a.due || '9').localeCompare(String(b.due || '9'));
        const groups = [
            ['Overdue', overdue, '#f87171'], ['Today', dueToday, '#00e5ff'],
            ['Upcoming', open.filter(t => t.due && t.due > td), '#fbbf24'], ['Someday', open.filter(t => !t.due), '#94a3b8'],
            ['Done', all.filter(t => t.done).slice(-8).reverse(), '#34d399']
        ].filter(g => g[1].length);
        $('cxTaskList').innerHTML = groups.length ? groups.map(g => `<div><p class="text-[10px] font-black uppercase tracking-widest mb-2" style="color:${g[2]}">${g[0]} • ${g[1].length}</p><div class="space-y-2">${g[1].slice().sort(sortFn).map(row).join('')}</div></div>`).join('') +
            (all.some(t => t.done) ? '<button class="cx-btn red sm" onclick="CXPlanner.clearDone()">Clear completed</button>' : '') : '<div class="cx-empty">No tasks. Add one above, or tell C.A.S.P.E.R. "task: pay rent".</div>';

        $('cxBills').innerHTML = bills.length ? bills.slice(0, 6).map(b => `<div class="cx-row"><div class="flex-1 min-w-0"><p class="text-sm font-bold text-white truncate">${esc(b.name)}</p><p class="text-[10px] font-bold uppercase tracking-widest" style="color:${b.days <= 3 ? '#f87171' : '#94a3b8'}">${b.due.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • in ${b.days} day${b.days === 1 ? '' : 's'}</p></div><b class="text-sm text-white">${inr(b.amount)}</b></div>`).join('')
            : '<div class="cx-empty">Mark a ledger entry as recurring and it shows up here.</div>';

        const now = new Date(), y = now.getFullYear(), mo = now.getMonth(), days = new Date(y, mo + 1, 0).getDate(), off = (new Date(y, mo, 1).getDay() + 6) % 7;
        $('cxCalTitle').textContent = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        let h = '<span></span>'.repeat(off);
        for (let d = 1; d <= days; d++) {
            const ds = `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const hasT = open.some(t => t.due === ds), hasB = bills.some(b => b.due.getMonth() === mo && b.due.getDate() === d);
            h += `<div title="${ds}" onclick="document.getElementById('cxTaskDue').value='${ds}';document.getElementById('cxTaskText').focus()" style="cursor:pointer;aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;border:1px solid ${d === now.getDate() ? '#00e5ff' : 'rgba(255,255,255,.06)'};background:${d === now.getDate() ? 'rgba(0,229,255,.12)' : 'rgba(0,0,0,.4)'};color:${d < now.getDate() ? '#64748b' : '#e2e8f0'}">${d}<span style="font-size:8px;line-height:6px;height:6px">${hasT ? '<span style="color:#00e5ff">●</span>' : ''}${hasB ? '<span style="color:#fbbf24">●</span>' : ''}</span></div>`;
        }
        $('cxCal').innerHTML = h;
        icons();
    }

    window.CXPlanner = {
        add(text, due, pri) { const t = tasks(); t.push({ id: Date.now(), text, due: due || '', pri: Number(pri) || 2, done: false }); setJ('walletTasks', t); if ($('viewPlanner')) renderPlanner(); },
        addFromForm() { const tx = $('cxTaskText').value.trim(); if (!tx) return toast('Type a task first.', true); this.add(tx, $('cxTaskDue').value, $('cxTaskPri').value); $('cxTaskText').value = ''; },
        toggle(id) { const t = tasks(), x = t.find(i => i.id === id); if (!x) return; x.done = !x.done; x.doneAt = x.done ? Date.now() : null; setJ('walletTasks', t); renderPlanner(); emit('task', x); },
        remove(id) { setJ('walletTasks', tasks().filter(i => i.id !== id)); renderPlanner(); },
        clearDone() { setJ('walletTasks', tasks().filter(i => !i.done)); renderPlanner(); },
        brief() {
            const td = todayStr(), open = tasks().filter(t => !t.done), due = open.filter(t => t.due === td), over = open.filter(t => t.due && t.due < td), b = upcomingBills()[0];
            return `Open tasks: <b>${open.length}</b>${due.length ? `<br>Due today: ${due.map(t => esc(t.text)).join(', ')}` : ''}${over.length ? `<br><span style="color:#f87171">Overdue: ${over.map(t => esc(t.text)).join(', ')}</span>` : ''}${b ? `<br>Next bill: ${esc(b.name)} ${inr(b.amount)} in ${b.days} day${b.days === 1 ? '' : 's'}.` : ''}${!open.length ? '<br>Nothing pending. Add one with <b>task: …</b>' : ''}`;
        },
        render: renderPlanner
    };

    // ---- view switching with the extra tab --------------------------------------
    const LEGACY = ['dashboard', 'investments', 'wishlist', 'media', 'workspace', 'growth'];
    const cap = n => n.charAt(0).toUpperCase() + n.slice(1);
    const OFF = 'nav-btn flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-gray-500 hover:text-white uppercase tracking-widest border border-transparent';
    const OFF_G = 'nav-btn flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-[#00e5ff] hover:text-white uppercase tracking-widest bg-[#00e5ff]/10 border border-[#00e5ff]/30 shadow-[0_0_10px_rgba(0,229,255,0.2)]';
    const ON = 'nav-btn active flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg uppercase tracking-widest border border-white/20 bg-white/10';
    const prevSwitch = window.switchMainView;
    window.switchMainView = function (v) {
        if (v === 'planner') {
            injectPlanner();
            LEGACY.forEach(n => { const b = $('nav' + cap(n)), el = $('view' + cap(n)); if (b) b.className = n === 'growth' ? OFF_G : OFF; if (el) { el.classList.remove('active'); el.classList.add('next'); } });
            $('navPlanner').className = ON; $('viewPlanner').classList.add('active'); $('viewPlanner').classList.remove('next');
            renderPlanner(); window.scrollTo({ top: 0 }); return;
        }
        if (LEGACY.includes(v) && $('viewPlanner')) { $('viewPlanner').classList.remove('active'); $('navPlanner').className = OFF; }
        const r = prevSwitch.apply(this, arguments);
        try {
            if (v === 'investments') renderInvest();
            if (v === 'growth' && window.CXGrowth) window.CXGrowth.render();
            if (v === 'wishlist') renderWishlist();
            if (v === 'media') renderMedia();
        } catch (e) { console.warn(e); }
        return r;
    };
    document.addEventListener('keydown', e => { if (e.altKey && e.key === '7') { e.preventDefault(); window.switchMainView('planner'); } });

    document.addEventListener('DOMContentLoaded', () => {
        try { injectPlanner(); } catch (e) { console.warn(e); }
        try { renderInvest(); } catch (e) { console.warn(e); }
        try { chatChips(); } catch (e) { console.warn(e); }
        try { if (X().renderDeck) X().renderDeck(); } catch (e) {}
        icons();
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 2 / PART B
// Wishlist cart, capture bookmarks, offline link decoder, practical Library,
// Workspace pages + fixed sketch box, mood-adaptive Growth.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, todayStr, mKey, idArg, toast, balances, monthStats, hud, banner } = window.CX;
    const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

    // ==========================================================================
    // 1. OFFLINE LINK DECODER (used when the scraper backend is unreachable)
    // ==========================================================================
    const STORES = { amazon: 'Amazon', flipkart: 'Flipkart', myntra: 'Myntra', ajio: 'Ajio', meesho: 'Meesho', croma: 'Croma', nykaa: 'Nykaa', imdb: 'IMDb', goodreads: 'Goodreads', myanimelist: 'MyAnimeList', netflix: 'Netflix', primevideo: 'Prime Video', hotstar: 'Hotstar', letterboxd: 'Letterboxd', themoviedb: 'TMDB', anilist: 'AniList', crunchyroll: 'Crunchyroll' };
    const WISH_KEYS = { Gadgets: ['laptop', 'macbook', 'phone', 'iphone', 'tablet', 'ipad', 'watch', 'camera', 'drone', 'keyboard', 'mouse', 'monitor'], Electronics: ['earbuds', 'airpods', 'headphone', 'speaker', 'charger', 'tv', 'television', 'cable', 'power-bank', 'powerbank', 'trimmer'], Apparel: ['shirt', 'tshirt', 't-shirt', 'jeans', 'shoe', 'sneaker', 'jacket', 'hoodie', 'kurta', 'trouser', 'sandal'], Books: ['book', 'novel', 'paperback', 'hardcover', 'edition'], Gaming: ['gaming', 'playstation', 'ps5', 'xbox', 'nintendo', 'controller', 'console'], Furniture: ['chair', 'table', 'desk', 'sofa', 'bed', 'mattress', 'shelf'], Travel: ['luggage', 'backpack', 'trolley', 'suitcase', 'tent'] };

    function decodeLink(url) {
        let u; try { u = new URL(url); } catch (e) { return null; }
        const host = u.hostname.replace(/^www\./, ''), key = Object.keys(STORES).find(k => host.includes(k));
        const store = key ? STORES[key] : host.split('.')[0].replace(/^./, c => c.toUpperCase());
        const segs = u.pathname.split('/').filter(Boolean).map(s => { try { return decodeURIComponent(s); } catch (e) { return s; } });
        const bad = /^(dp|gp|p|product|products|item|itm|title|book|show|buy|d|ip|s|ref=.*|[A-Z0-9]{10}|tt\d+|\d+)$/;
        let slug = segs.filter(s => !bad.test(s) && /[a-zA-Z]{3,}/.test(s)).sort((a, b) => b.length - a.length)[0] || '';
        slug = slug.replace(/^\d+[-.]/, '').replace(/\.(html?|php)$/i, '').replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim();
        const title = slug.split(' ').map(w => w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' ').slice(0, 120);
        const low = (slug + ' ' + host).toLowerCase();
        let category = null; for (const c in WISH_KEYS) if (WISH_KEYS[c].some(k => new RegExp('(^|[^a-z])' + k).test(low))) { category = c; break; }
        let type = null;
        if (/imdb|letterboxd|themoviedb|netflix|primevideo|hotstar/.test(host)) type = /\/tv\/|series|season/.test(u.pathname) ? 'Series' : 'Movie';
        if (/goodreads|audible|kindle/.test(host) || /book/.test(low)) type = 'Book';
        if (/myanimelist|anilist|crunchyroll/.test(host)) type = 'Anime';
        return { store, title, category, type, host };
    }

    function wireDecoder(linkId, nameId, after) {
        const link = $(linkId); if (!link) return;
        link.addEventListener('input', debounce(() => {
            const url = link.value.trim(); if (!/^https?:\/\//.test(url)) return;
            const d = decodeLink(url); if (!d) return;
            setTimeout(() => {          // give the online scraper (if reachable) a moment to answer first
                const name = $(nameId);
                if (name && !name.value.trim() && d.title) { name.value = d.title; toast(`Offline decode: name read from the ${d.store} link. Price and image need the capture bookmark.`); }
                if (after) after(d);
            }, 1800);
        }, 500));
    }

    // ==========================================================================
    // 2. CAPTURE BOOKMARKS — send a product / title page straight into the app
    // ==========================================================================
    function bookmarklet(kind) {
        const app = location.href.split('#')[0];
        const code = `(function(){var K='${kind}',A=${JSON.stringify(app)},d=document,q=function(s){var e=d.querySelector(s);return e?(e.content||e.innerText||e.value||'').trim():''},ld={};
try{[].forEach.call(d.querySelectorAll('script[type="application/ld+json"]'),function(s){var j=JSON.parse(s.textContent);(Array.isArray(j)?j:[j].concat(j['@graph']||[])).forEach(function(o){if(o&&/Product|Movie|Book|TVSeries|CreativeWork/.test([].concat(o['@type']||'').join()))ld=o})})}catch(e){}
var of=ld.offers?(Array.isArray(ld.offers)?ld.offers[0]:ld.offers):{};
var pr=of.price||of.lowPrice||q('meta[property="product:price:amount"]')||q('meta[itemprop=price]')||q('.a-price .a-offscreen')||q('#priceblock_ourprice')||q('.Nx9bqj')||q('._30jeq3')||q('[class*=price]')||'';
pr=parseFloat(String(pr).replace(/[^0-9.]/g,''))||0;
var im=ld.image;if(Array.isArray(im))im=im[0];if(im&&im.url)im=im.url;im=im||q('meta[property="og:image"]')||((d.querySelector('#landingImage')||{}).src)||'';
var pn=function(x){x=Array.isArray(x)?x[0]:x;return x?(x.name||x):''};
var o={v:1,k:K,t:String(ld.name||q('meta[property="og:title"]')||d.title).slice(0,160),p:pr,i:String(im||''),u:location.href,d:String(ld.description||q('meta[property="og:description"]')||q('meta[name=description]')||'').slice(0,280),ty:[].concat(ld['@type']||'').join(),g:[].concat(ld.genre||'').join(', '),a:String(pn(ld.author)||pn(ld.director)||'')};
var s='CASPER::'+JSON.stringify(o);try{navigator.clipboard.writeText(s)}catch(e){}
if(/^https?:/.test(A)){window.open(A+'#casper='+encodeURIComponent(s.slice(8)),'casper')}else{prompt('Copied. If not, copy this, then press "Paste captured data" in C.A.S.P.E.R.',s)}})();`;
        return 'javascript:' + encodeURIComponent(code.replace(/\n/g, ''));
    }

    function capturePanel(kind) {
        const isM = kind === 'm', col = isM ? '#a855f7' : '#00e5ff';
        return `<div class="glass-panel p-5 md:p-6" id="cxCapture_${kind}" style="border-color:${col}55">
            <h4 class="cx-h" style="color:${col}"><i data-lucide="bookmark-plus" class="w-4 h-4"></i> Capture bookmark <span class="info-icon" data-info="Runs on the page you are viewing, reads its name, price, image and details, and hands them to this app. Nothing is sent to any server."><i data-lucide="help-circle" class="w-4 h-4"></i></span></h4>
            <div class="flex flex-wrap items-center gap-3">
                <a class="cx-btn ${isM ? 'violet' : ''}" style="cursor:grab" href="${bookmarklet(kind)}" onclick="event.preventDefault();CX.toast('Drag this button to your bookmarks bar. Do not click it here.')">⇪ Send to ${isM ? 'Library' : 'Wishlist'}</a>
                <button class="cx-btn sm" onclick="CXCapture.copy('${kind}')">Copy bookmark code</button>
                <button class="cx-btn green sm" onclick="CXCapture.paste()">Paste captured data</button>
            </div>
            <ol class="text-xs text-gray-400 font-semibold mt-3 space-y-1 list-decimal pl-5">
                <li>Drag the button above onto your browser's bookmarks bar (one time).</li>
                <li>Open any ${isM ? 'movie, series or book page (IMDb, Goodreads, MyAnimeList…)' : 'product page (Amazon, Flipkart, Myntra…)'} and click that bookmark.</li>
                <li>The item lands here with its ${isM ? 'title, poster, type and synopsis' : 'name, price, image and category'}. If this app is opened as a local file, press <b class="text-white">Paste captured data</b> instead.</li>
            </ol>
        </div>`;
    }

    function ingest(o) {
        if (!o || !o.t) return false;
        const host = (() => { try { return new URL(o.u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } })();
        const d = decodeLink(o.u || '') || {};
        const ty = String(o.ty || '');
        const looksMedia = /Movie|TVSeries|Book/.test(ty) || /imdb|goodreads|myanimelist|anilist|letterboxd|themoviedb/.test(host);
        const kind = o.k === 'm' || (o.k !== 'w' && looksMedia) ? 'm' : 'w';
        const title = String(o.t).replace(/\s*[-|–:]\s*(Amazon\.in|Amazon\.com|Flipkart\.com|IMDb|Goodreads|MyAnimeList\.net).*$/i, '').replace(/^Buy\s+/i, '').replace(/\s+Online at.*$/i, '').trim().slice(0, 140);
        if (kind === 'm') {
            const type = /TVSeries/.test(ty) ? 'Series' : /Book/.test(ty) ? 'Book' : /Movie/.test(ty) ? 'Movie' : (d.type || 'Movie');
            const genres = ['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
            const genre = genres.find(g => String(o.g || '').toLowerCase().includes(g.toLowerCase())) || (String(o.g || '').split(',')[0].trim() || 'Drama');
            if (mediaItems.some(i => i.link && i.link === o.u)) { toast('That title is already in the Library.', true); return true; }
            mediaItems.push({ id: String(Date.now()), title, price: Number(o.p) || 0, link: o.u || '', imageUrl: o.i || '', category: 'MEDIA NODE', wishCategory: type, mediaGenre: genre, mediaStatus: 'Planned', mediaRating: 'Unrated', mediaDetails: [o.a ? (type === 'Book' ? 'By ' : 'Dir. ') + o.a : '', o.d || ''].filter(Boolean).join(' — '), isMedia: true, timestamp: Date.now() });
            saveMediaLocally(); renderMedia(); switchMainView('media'); toast(`Captured to Library: ${title}`);
        } else {
            if (wishlistItems.some(i => i.link && i.link === o.u && !i.purchased)) { toast('That product is already on the wishlist.', true); return true; }
            wishlistItems.push({ id: String(Date.now()), title, price: Number(o.p) || 0, link: o.u || '', imageUrl: o.i || '', category: (d.store || 'CAPTURED').toUpperCase(), wishCategory: d.category || (decodeLink('https://x.com/' + title.replace(/\s+/g, '-')) || {}).category || 'Lifestyle', timestamp: Date.now(), priority: 2 });
            saveWishlistLocally(); renderWishlist(); switchMainView('wishlist');
            toast(Number(o.p) > 0 ? `Captured to Wishlist: ${title}` : `Captured ${title}. Price was not readable, set it with Modify.`);
        }
        return true;
    }
    function readHash() {
        const m = location.hash.match(/#casper=(.+)$/); if (!m) return;
        try { ingest(JSON.parse(decodeURIComponent(m[1]))); } catch (e) { toast('Captured data could not be read.', true); }
        try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; }
    }
    window.CXCapture = {
        ingest,
        copy(kind) { const c = bookmarklet(kind); (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(() => toast('Bookmark code copied. Create a new bookmark and paste it as the URL.')).catch(() => prompt('Copy this and save it as a bookmark URL:', c)); },
        async paste() {
            let txt = '';
            try { txt = await navigator.clipboard.readText(); } catch (e) {}
            if (!/^CASPER::/.test(txt)) txt = prompt('Paste the captured data (starts with CASPER::)', '') || '';
            const m = txt.match(/CASPER::(\{.*\})/s);
            if (!m) return toast('No captured data found on the clipboard.', true);
            try { ingest(JSON.parse(m[1])); } catch (e) { toast('Captured data could not be read.', true); }
        }
    };
    window.addEventListener('hashchange', readHash);

    // ==========================================================================
    // 3. WISHLIST — a cart with a savings queue
    // ==========================================================================
    let wishSort = getJ('walletWishSort', 'queue');
    const PRI = { 1: ['High', '#f87171'], 2: ['Normal', '#fbbf24'], 3: ['Low', '#64748b'] };
    const span = days => days <= 0 ? 'ready now' : days < 45 ? `${days} day${days === 1 ? '' : 's'}` : days < 730 ? `${(days / 30).toFixed(1)} months` : `${(days / 365).toFixed(1)} years`;

    window.renderWishlist = function () {
        const grid = $('wishlistGrid'); if (!grid) return;
        if (!$('cxWishBar')) grid.insertAdjacentHTML('beforebegin', '<div id="cxWishBar" class="mb-4 md:col-span-2"></div>');
        const plan = Number(monthlyWishlistSavings) || 0, perDay = plan / 30, fund = Number(getJ('walletWishFund', 0)) || 0, bal = balances();
        const open = wishlistItems.filter(w => !w.purchased), bought = wishlistItems.filter(w => w.purchased);
        const total = open.reduce((a, w) => a + (Number(w.price) || 0), 0);

        // savings queue: priority first, then cheapest; the fund already saved covers the front of the queue
        const queue = open.slice().sort((a, b) => ((a.priority || 2) - (b.priority || 2)) || ((a.price || 0) - (b.price || 0)));
        let cum = 0; const eta = {};
        queue.forEach((w, i) => { cum += Number(w.price) || 0; const need = Math.max(0, cum - fund); eta[w.id] = { pos: i + 1, days: perDay > 0 ? Math.ceil(need / perDay) : (need === 0 ? 0 : null), covered: Math.max(0, Math.min(1, (fund - (cum - (Number(w.price) || 0))) / ((Number(w.price) || 0) || 1))) }; });
        const sorters = { queue: (a, b) => eta[a.id].pos - eta[b.id].pos, price: (a, b) => (a.price || 0) - (b.price || 0), priceDesc: (a, b) => (b.price || 0) - (a.price || 0), newest: (a, b) => (b.timestamp || 0) - (a.timestamp || 0) };
        const list = open.slice().sort(sorters[wishSort] || sorters.queue);
        const allDays = perDay > 0 ? Math.ceil(Math.max(0, total - fund) / perDay) : null;

        $('cxWishBar').innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div class="cx-tile"><span>Cart total</span><b>${inr(total)}</b><small>${open.length} item${open.length === 1 ? '' : 's'}</small></div>
                <div class="cx-tile"><span>Whole cart cleared in</span><b style="color:#fbbf24">${allDays === null ? '—' : span(allDays)}</b><small>${plan > 0 ? `at ${inr(plan)} / month` : 'set a savings plan above'}</small></div>
                <div class="cx-tile"><span>Already saved for cart</span><b style="color:#34d399">${inr(fund)}</b><small><a href="#" style="color:#00e5ff" onclick="event.preventDefault();CXWish.fund()">update amount</a></small></div>
                <div class="cx-tile"><span>Liquid assets</span><b style="color:#00e5ff">${inr(bal.liquid)}</b><small>${open.filter(w => (w.price || 0) <= bal.liquid).length} item(s) affordable from cash</small></div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="cx-lbl" style="margin:0">Sort</span>
                ${[['queue', 'Buy order'], ['price', 'Cheapest'], ['priceDesc', 'Priciest'], ['newest', 'Newest']].map(s => `<button class="cx-btn sm ${wishSort === s[0] ? 'on' : ''}" onclick="CXWish.sort('${s[0]}')">${s[1]}</button>`).join('')}
            </div>`;

        if (!list.length) {
            grid.innerHTML = `<div class="md:col-span-2 flex flex-col items-center justify-center py-14 border border-dashed border-[#00e5ff]/30 rounded-2xl">${hud(84, '#00e5ff', 'shopping-cart')}<p class="text-[#00e5ff] text-[10px] font-bold uppercase tracking-widest mt-4">Cart empty. Paste a link, or use the capture bookmark below.</p></div>`;
        } else {
            grid.innerHTML = list.map(w => {
                const e = eta[w.id], price = Number(w.price) || 0, alone = perDay > 0 ? Math.ceil(price / perDay) : null, pri = PRI[w.priority || 2];
                const when = e.days === null ? null : new Date(Date.now() + e.days * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                const pct = perDay > 0 || fund > 0 ? Math.round(e.covered * 100) : 0;
                return `<div class="glass-panel rounded-2xl overflow-hidden flex flex-col">
                    ${w.imageUrl ? `<div class="h-40 bg-black/60 flex items-center justify-center overflow-hidden"><img src="${esc(w.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" class="max-h-full max-w-full object-contain" onerror="this.parentElement.style.display='none'"></div>` : ''}
                    <div class="p-4 flex flex-col gap-2 flex-grow">
                        <div class="flex justify-between items-start gap-2">
                            <p class="text-sm font-bold text-white line-clamp-2">${esc(w.title)}</p>
                            <span class="text-[8px] font-bold text-[#00e5ff] border border-[#00e5ff]/30 rounded px-1.5 py-0.5 uppercase tracking-widest shrink-0">${esc(w.wishCategory || 'Other')}</span>
                        </div>
                        <div class="flex items-end justify-between gap-2"><p class="text-2xl font-black text-[#10b981] cx-display">${price > 0 ? inr(price) : 'Price not set'}</p>
                            <button class="text-[10px] font-black uppercase tracking-widest" style="color:${pri[1]}" title="Click to change priority" onclick="CXWish.priority(${idArg(w.id)})">● ${pri[0]} priority</button></div>
                        <div class="cx-bar"><i style="width:${pct}%;background:#10b981"></i></div>
                        <p class="text-[10px] font-bold uppercase tracking-widest text-[#fbbf24]">${price <= 0 ? 'Set a price to see the timeline' : e.days === 0 ? 'Fully saved for. Ready to buy.' : e.days === null ? 'Set a monthly savings plan to see when you can afford this' : `#${e.pos} in queue • affordable in ${span(e.days)} (${when})`}</p>
                        ${alone !== null && price > 0 && e.days !== 0 ? `<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">On its own: ${span(alone)}${price <= bal.liquid ? ' • cash on hand covers it today' : ''}</p>` : ''}
                        <div class="flex gap-2 justify-end mt-auto pt-2 flex-wrap">
                            ${w.link ? `<a href="${esc(w.link)}" target="_blank" rel="noopener" class="cx-btn sm">Open${w.category && w.category !== 'MANUAL' ? ' ' + esc(String(w.category).toLowerCase()) : ''}</a>` : ''}
                            <button onclick="CXWish.bought(${idArg(w.id)})" class="cx-btn green sm">Bought</button>
                            <button onclick="openEditWishlistModal(${idArg(w.id)}, false)" class="cx-btn sm">Modify</button>
                            <button onclick="deleteWishItem(${idArg(w.id)}, false)" class="cx-btn red sm">Purge</button>
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
        if (bought.length) grid.insertAdjacentHTML('beforeend', `<div class="md:col-span-2 glass-panel p-4"><p class="cx-lbl" style="color:#34d399">Acquired • ${bought.length} • ${inr(bought.reduce((a, w) => a + (w.price || 0), 0))}</p><div class="flex flex-wrap gap-2 mt-2">${bought.slice(-12).reverse().map(w => `<span class="text-xs font-bold text-gray-300 bg-black/50 border border-white/10 rounded-lg px-2 py-1">${esc(w.title.slice(0, 32))} <button title="Remove from history" style="color:#f87171" onclick="deleteWishItem(${idArg(w.id)}, false)">✕</button></span>`).join('')}</div></div>`);
        icons();
    };

    window.CXWish = {
        sort(s) { wishSort = s; setJ('walletWishSort', s); renderWishlist(); },
        fund() { const v = prompt('How much have you already set aside for wishlist items (₹)?', getJ('walletWishFund', 0)); if (v === null) return; setJ('walletWishFund', Math.max(0, parseFloat(v) || 0)); renderWishlist(); },
        priority(id) { const w = wishlistItems.find(i => String(i.id) === String(id)); if (!w) return; w.priority = ((w.priority || 2) % 3) + 1; saveWishlistLocally(); renderWishlist(); },
        bought(id) {
            const w = wishlistItems.find(i => String(i.id) === String(id)); if (!w) return;
            if (!confirm(`Mark "${w.title}" as bought?`)) return;
            w.purchased = true; w.purchasedAt = Date.now();
            const fund = Number(getJ('walletWishFund', 0)) || 0; setJ('walletWishFund', Math.max(0, fund - (w.price || 0)));
            if ((w.price || 0) > 0 && confirm(`Also log ${inr(w.price)} as an expense in the ledger?`)) {
                transactions.push({ id: String(Date.now()), type: 'expense', amount: Number(w.price), account: 'UPI', category: 'Shopping', note: w.title.slice(0, 60), timestamp: Date.now(), isRecurring: false });
                saveTransactionsLocally(); try { updateUI(); } catch (e) {}
            }
            saveWishlistLocally(); renderWishlist(); toast('Marked as acquired.');
        }
    };

    // ==========================================================================
    // 4. VAULT — practical tracker for books, movies, series, anime
    // ==========================================================================
    const FLOW = ['Planned', 'In Progress', 'Completed'];
    const FLOW_LBL = { 'Planned': 'Planned', 'In Progress': 'Ongoing', 'Completed': 'Completed' };
    const FLOW_COL = { 'Planned': '#00e5ff', 'In Progress': '#fbbf24', 'Completed': '#10b981' };
    const TYPE_ICON = { Movie: '🎬', Book: '📚', Series: '📺', Anime: '🎌' };
    const vf = { type: 'All', status: 'All', q: '' };
    const stOf = m => FLOW.includes(m.mediaStatus) ? m.mediaStatus : 'Planned';

    function stepper(m) {
        const cur = FLOW.indexOf(stOf(m));
        return `<div class="cx-steps">${FLOW.map((s, i) => `<button title="Set to ${FLOW_LBL[s]}" onclick="CXVault.set(${idArg(m.id)}, '${s}')" class="${i < cur ? 'past' : i === cur ? 'now' : ''}" style="--c:${FLOW_COL[s]}">${i < cur ? '✓ ' : ''}${FLOW_LBL[s]}</button>`).join('')}</div>`;
    }
    function vaultCard(m, compact) {
        const st = stOf(m), stars = Number(m.mediaRating) > 0 ? Number(m.mediaRating) : 0, prog = st === 'Completed' ? 100 : st === 'Planned' ? 0 : (Number(m.progress) || 0);
        const unit = m.wishCategory === 'Book' ? 'read' : 'watched';
        return `<div class="${compact ? 'bg-black/60 border border-white/10 rounded-xl' : 'glass-panel rounded-2xl'} overflow-hidden flex">
            ${m.imageUrl ? `<img src="${esc(m.imageUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" class="${compact ? 'w-14' : 'w-24 md:w-28'} object-cover shrink-0" onerror="this.style.display='none'">` : (compact ? '' : `<div class="w-24 md:w-28 shrink-0 flex items-center justify-center text-4xl bg-black/50">${TYPE_ICON[m.wishCategory] || '🎞️'}</div>`)}
            <div class="p-3 flex flex-col gap-1.5 min-w-0 flex-grow">
                <p class="text-sm font-bold text-white line-clamp-2">${esc(m.title)}</p>
                <p class="text-[9px] font-bold uppercase tracking-widest text-[#a855f7]">${TYPE_ICON[m.wishCategory] || ''} ${esc(m.wishCategory || 'Media')}${m.mediaGenre ? ' • ' + esc(m.mediaGenre) : ''}${stars ? ` • <span style="color:#fbbf24">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>` : ''}</p>
                ${!compact && m.mediaDetails ? `<p class="text-xs text-gray-400 line-clamp-2">${esc(m.mediaDetails)}</p>` : ''}
                ${stepper(m)}
                <div class="flex items-center gap-2"><div class="cx-bar flex-1"><i style="width:${prog}%;background:${FLOW_COL[st]}"></i></div><span class="text-[10px] font-black text-gray-300" style="min-width:34px;text-align:right">${prog}%</span></div>
                ${st === 'In Progress' ? `<input type="range" min="0" max="100" step="5" value="${prog}" class="mood-slider" title="How much you have ${unit}" onchange="CXVault.progress(${idArg(m.id)}, this.value)">` : ''}
                ${st === 'Completed' && !compact ? `<div class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">Rate ${[1, 2, 3, 4, 5].map(n => `<button onclick="CXVault.rate(${idArg(m.id)}, ${n})" style="font-size:16px;color:${n <= stars ? '#fbbf24' : '#475569'}">★</button>`).join('')}</div>` : ''}
                <div class="flex gap-1.5 mt-auto pt-1 flex-wrap">
                    ${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener" class="cx-btn violet sm">Open</a>` : ''}
                    <button onclick="openEditWishlistModal(${idArg(m.id)}, true)" class="cx-btn sm">Edit</button>
                    <button onclick="deleteWishItem(${idArg(m.id)}, true)" class="cx-btn red sm">✕</button>
                </div>
            </div>
        </div>`;
    }

    window.renderMedia = function () {
        const grid = $('mediaGrid'); if (!grid) return;
        if (!$('cxVaultBar')) {
            grid.insertAdjacentHTML('beforebegin', '<div id="cxVaultBar" class="mb-4 md:col-span-2"></div>');
            const st = document.createElement('style');
            st.textContent = `.cx-steps{display:flex;gap:3px}.cx-steps button{flex:1;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 2px;border-radius:6px;border:1px solid rgba(255,255,255,.1);color:#64748b;background:rgba(0,0,0,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .cx-steps button.past{color:var(--c);border-color:color-mix(in srgb,var(--c) 40%,transparent)}.cx-steps button.now{color:#000;background:var(--c);border-color:var(--c);box-shadow:0 0 10px color-mix(in srgb,var(--c) 60%,transparent)}.cx-steps button:hover{border-color:var(--c)}`;
            document.head.appendChild(st);
        }
        const all = mediaItems, cnt = s => all.filter(m => stOf(m) === s).length;
        const rated = all.filter(m => Number(m.mediaRating) > 0), avg = rated.length ? (rated.reduce((a, m) => a + Number(m.mediaRating), 0) / rated.length).toFixed(1) : '—';
        const yr = new Date().getFullYear(), doneYr = all.filter(m => stOf(m) === 'Completed' && new Date(m.completedAt || m.timestamp || 0).getFullYear() === yr).length;
        const ongoing = all.filter(m => stOf(m) === 'In Progress');
        const types = ['All', ...Array.from(new Set(['Movie', 'Book', 'Series', 'Anime', ...all.map(m => m.wishCategory).filter(Boolean)]))];

        const bar = $('cxVaultBar'), hadFocus = document.activeElement && document.activeElement.id === 'cxVaultSearch';
        bar.innerHTML = `
            <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                <div class="cx-tile"><span>In the library</span><b>${all.length}</b><small>${types.slice(1).map(t => `${TYPE_ICON[t] || ''}${all.filter(m => m.wishCategory === t).length}`).join(' ')}</small></div>
                <div class="cx-tile"><span>Planned</span><b style="color:#00e5ff">${cnt('Planned')}</b><small>queued up</small></div>
                <div class="cx-tile"><span>Ongoing</span><b style="color:#fbbf24">${cnt('In Progress')}</b><small>${ongoing[0] ? esc(ongoing[0].title.slice(0, 22)) : 'nothing in progress'}</small></div>
                <div class="cx-tile"><span>Completed</span><b style="color:#34d399">${cnt('Completed')}</b><small>${doneYr} this year</small></div>
                <div class="cx-tile col-span-2 lg:col-span-1"><span>Average rating</span><b style="color:#fbbf24">${avg}${avg !== '—' ? ' ★' : ''}</b><small>${rated.length} rated</small></div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <input id="cxVaultSearch" class="cx-in" style="flex:1;min-width:150px" placeholder="Search titles, genres, notes…" value="${esc(vf.q)}" oninput="CXVault.search(this.value)">
                ${types.map(t => `<button class="cx-btn violet sm" style="${vf.type === t ? 'background:#a855f7;color:#000' : ''}" onclick="CXVault.filter('type','${esc(t)}')">${TYPE_ICON[t] || ''} ${esc(t)}</button>`).join('')}
                <span style="width:1px;height:18px;background:rgba(255,255,255,.15)"></span>
                ${['All', ...FLOW].map(s => `<button class="cx-btn sm ${vf.status === s ? 'on' : ''}" onclick="CXVault.filter('status','${s}')">${s === 'All' ? 'Any status' : FLOW_LBL[s]}</button>`).join('')}
                <button class="cx-btn green sm" onclick="CXVault.pick()">🎲 Pick for me</button>
            </div>`;
        if (hadFocus) { const s = $('cxVaultSearch'); s.focus(); s.setSelectionRange(s.value.length, s.value.length); }

        const q = vf.q.toLowerCase();
        const list = all.filter(m => (vf.type === 'All' || m.wishCategory === vf.type) && (vf.status === 'All' || stOf(m) === vf.status) && (!q || [m.title, m.mediaGenre, m.mediaDetails, m.wishCategory].join(' ').toLowerCase().includes(q)))
            .sort((a, b) => (FLOW.indexOf(stOf(a)) === 1 ? -1 : 0) - (FLOW.indexOf(stOf(b)) === 1 ? -1 : 0) || (b.timestamp || 0) - (a.timestamp || 0));
        grid.innerHTML = list.length ? list.map(m => vaultCard(m, false)).join('')
            : `<div class="md:col-span-2 flex flex-col items-center justify-center py-14 border border-dashed border-[#a855f7]/30 rounded-2xl">${hud(84, '#a855f7', 'clapperboard')}<p class="text-[#a855f7] text-[10px] font-bold uppercase tracking-widest mt-4">${all.length ? 'Nothing matches these filters.' : 'Library empty. Paste a link or use the capture bookmark below.'}</p></div>`;
        const cols = { 'Planned': $('kb-planned'), 'In Progress': $('kb-progress'), 'Completed': $('kb-completed') };
        Object.keys(cols).forEach(s => { if (!cols[s]) return; const l = all.filter(m => stOf(m) === s); cols[s].innerHTML = l.length ? l.map(m => vaultCard(m, true)).join('') : '<p class="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Empty</p>'; });
        icons();
    };

    const findM = id => mediaItems.find(i => String(i.id) === String(id));
    const vSearch = debounce(() => renderMedia(), 200);
    window.CXVault = {
        set(id, s) { const m = findM(id); if (!m) return; m.mediaStatus = s; if (s === 'Completed') { m.completedAt = Date.now(); m.progress = 100; } else { m.mediaRating = 'Unrated'; if (s === 'Planned') m.progress = 0; else if (!m.startedAt) m.startedAt = Date.now(); } saveMediaLocally(); if (s !== 'Planned') window.CX.emit('media', m); renderMedia(); },
        progress(id, v) { const m = findM(id); if (!m) return; m.progress = Number(v); window.CX.emit('media', m); if (m.progress >= 100) return this.set(id, 'Completed'); saveMediaLocally(); renderMedia(); },
        rate(id, n) { const m = findM(id); if (!m) return; m.mediaRating = String(Number(m.mediaRating) === n ? 'Unrated' : n); saveMediaLocally(); renderMedia(); },
        filter(k, v) { vf[k] = v; renderMedia(); },
        search(v) { vf.q = v; vSearch(); },
        pick() { const pool = mediaItems.filter(m => stOf(m) === 'Planned' && (vf.type === 'All' || m.wishCategory === vf.type)); if (!pool.length) return toast('No planned titles to pick from.', true); const p = pool[Math.floor(Math.random() * pool.length)]; vf.q = p.title; vf.status = 'All'; renderMedia(); toast(`Tonight's pick: ${p.title}`); }
    };
    window.advanceMediaStatus = function (id) { const m = findM(id); if (!m) return; window.CXVault.set(id, FLOW[(FLOW.indexOf(stOf(m)) + 1) % 3]); };

    // ==========================================================================
    // 5. WORKSPACE — pages, memory-card search/pin, fixed sketch box
    // ==========================================================================
    const wsCss = document.createElement('style');
    wsCss.textContent = `
        .cx-wb-stage { height: clamp(380px, 58vh, 640px) !important; flex: none !important; min-height: 0; }
        .fullscreen-wb .cx-wb-stage { height: auto !important; flex: 1 1 auto !important; }
        .cx-wb-stage.cx-grid { background-image: linear-gradient(rgba(0,229,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.07) 1px, transparent 1px); background-size: 24px 24px; }
        #whiteboardCanvas { width: 100% !important; height: 100% !important; display: block; }
        #workspaceNotes { max-height: 62vh; overflow-y: auto; }
        .cx-page { flex: none; max-width: 180px; overflow: hidden; text-overflow: ellipsis; }
        .keep-card.pinned { border-color: #fbbf24 !important; box-shadow: 0 0 12px rgba(251,191,36,.25); }`;
    document.head.appendChild(wsCss);

    // --- sketch box: one-time listener setup, stable size, content kept on resize
    const origInitWb = window.initWhiteboard; let wbReady = false;
    window.initWhiteboard = function () {
        const c = $('whiteboardCanvas'); if (!c) return;
        const stage = c.parentElement; stage.classList.add('cx-wb-stage');
        if (getJ('walletWbGrid', true)) stage.classList.add('cx-grid');
        const r = { width: stage.clientWidth, height: stage.clientHeight }; if (r.width < 20 || r.height < 20) return;
        if (!wbReady) {
            wbReady = true; origInitWb.apply(this, arguments);
            if (Math.abs(c.width - r.width) > 1 || Math.abs(c.height - r.height) > 1) { c.width = r.width; c.height = r.height; try { wbHistory.length = 0; saveWbState(); } catch (e) {} }
            const local = localStorage.getItem('walletWbLocal');
            if (local) { const img = new Image(); img.onload = () => { try { c.getContext('2d').drawImage(img, 0, 0); } catch (e) {} }; img.src = local; }
            return;
        }
        const w = Math.round(r.width), h = Math.round(r.height);
        if (Math.abs(c.width - w) < 2 && Math.abs(c.height - h) < 2) return;
        const snap = c.toDataURL(), img = new Image();
        img.onload = () => { c.width = w; c.height = h; c.getContext('2d').drawImage(img, 0, 0); };
        img.src = snap;
    };
    window.addEventListener('resize', debounce(() => { if (wbReady && !document.querySelector('.fullscreen-wb')) window.initWhiteboard(); }, 250));

    function wbTools() {
        const box = $('whiteboardContainer'); if (!box || $('cxWbPng')) return;
        const grp = box.querySelector('.ml-auto'); if (!grp) return;
        grp.insertAdjacentHTML('afterbegin', `<button type="button" id="cxWbGrid" title="Toggle grid" class="cx-btn sm">Grid</button><button type="button" id="cxWbPng" title="Download as PNG" class="cx-btn sm">PNG</button>`);
        $('cxWbGrid').onclick = () => { const st = $('whiteboardCanvas').parentElement; st.classList.toggle('cx-grid'); setJ('walletWbGrid', st.classList.contains('cx-grid')); };
        $('cxWbPng').onclick = () => {
            const c = $('whiteboardCanvas'), o = document.createElement('canvas'); o.width = c.width; o.height = c.height;
            const x = o.getContext('2d'); x.fillStyle = '#050507'; x.fillRect(0, 0, o.width, o.height); x.drawImage(c, 0, 0);
            const a = document.createElement('a'); a.href = o.toDataURL('image/png'); a.download = 'CASPER_Sketch.png'; a.click();
        };
    }

    // --- pages (Notion-style documents inside the existing editor)
    const pagesGet = () => getJ('walletPages', { active: null, list: [] });
    const TEMPLATES = {
        'Daily journal': () => `<h2>${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</h2><p><b>Top 3 for today</b></p><ol><li></li><li></li><li></li></ol><p><b>Notes</b></p><p><br></p><p><b>What went well</b></p><p><br></p>`,
        'Meeting notes': () => `<h2>Meeting — ${new Date().toLocaleDateString('en-GB')}</h2><p><b>Attendees:</b> </p><p><b>Agenda</b></p><ul><li></li></ul><p><b>Decisions</b></p><ul><li></li></ul><p><b>Action items</b></p><ul><li></li></ul>`,
        'Project plan': () => `<h2>Project</h2><p><b>Goal:</b> </p><p><b>Deadline:</b> </p><p><b>Milestones</b></p><ol><li></li><li></li><li></li></ol><p><b>Risks</b></p><ul><li></li></ul><p><b>Next action</b></p><p><br></p>`,
        'Weekly review': () => `<h2>Week of ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h2><p><b>Wins</b></p><ul><li></li></ul><p><b>What slipped</b></p><ul><li></li></ul><p><b>Money check</b></p><p><br></p><p><b>Focus for next week</b></p><ol><li></li></ol>`,
        'Budget note': () => { const s = monthStats(); return `<h2>Budget — ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2><p>Budget: ${inr(s.budget)} • Spent so far: ${inr(s.spent)} • Left: ${inr(s.left)}</p><p><b>Planned big spends</b></p><ul><li></li></ul><p><b>Cuts</b></p><ul><li></li></ul>`; }
    };
    const editor = () => $('workspaceNotes');
    function persistPage() { const p = pagesGet(), ed = editor(); if (!ed || !p.active) return; const pg = p.list.find(x => x.id === p.active); if (!pg) return; pg.html = ed.innerHTML; pg.updated = Date.now(); setJ('walletPages', p); }
    function docStats() {
        const ed = editor(), el = $('cxDocStats'); if (!ed || !el) return;
        const txt = ed.innerText.trim(), words = txt ? txt.split(/\s+/).length : 0;
        const boxes = ed.querySelectorAll('input[type=checkbox]'), done = [...boxes].filter(b => b.checked).length;
        el.textContent = `${words} words • ${txt.length} characters • ${Math.max(1, Math.round(words / 200))} min read${boxes.length ? ` • checklist ${done}/${boxes.length}` : ''} • saved on this device`;
    }
    function renderPages() {
        const bar = $('cxPages'); if (!bar) return; const p = pagesGet();
        bar.innerHTML = p.list.map(pg => `<button class="cx-btn sm cx-page ${pg.id === p.active ? 'on' : ''}" title="${esc(pg.title)}" onclick="CXPages.open(${pg.id})">${esc(pg.title)}</button>`).join('') +
            `<button class="cx-btn green sm" onclick="CXPages.create()">+ Page</button><button class="cx-btn sm" onclick="CXPages.rename()">Rename</button><button class="cx-btn red sm" onclick="CXPages.remove()">Delete</button>
             <select id="cxTpl" class="cx-in" style="padding:5px 8px;font-size:11.5px" onchange="CXPages.template(this.value);this.value=''"><option value="">Insert template…</option>${Object.keys(TEMPLATES).map(t => `<option>${t}</option>`).join('')}</select>
             <button class="cx-btn sm" onclick="CXPages.exportTxt()">Export .txt</button>`;
    }
    function injectPages() {
        const ed = editor(); if (!ed || $('cxPages')) return;
        const panel = ed.closest('.glass-panel'); if (!panel) return;
        panel.insertAdjacentHTML('afterbegin', `<div id="cxPages" class="flex gap-2 items-center overflow-x-auto hide-scroll pb-3 mb-3 border-b border-[#00e5ff]/20 shrink-0"></div>`);
        ed.insertAdjacentHTML('afterend', `<p id="cxDocStats" class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2"></p>`);
        const p = pagesGet();
        if (!p.list.length) { const id = Date.now(); p.list.push({ id, title: 'Main', html: ed.innerHTML || '', updated: Date.now() }); p.active = id; setJ('walletPages', p); }
        else { const pg = p.list.find(x => x.id === p.active) || p.list[0]; p.active = pg.id; setJ('walletPages', p); if (pg.html && !ed.innerText.trim()) ed.innerHTML = pg.html; }
        const save = debounce(() => { persistPage(); docStats(); }, 500);
        ed.addEventListener('input', save); ed.addEventListener('change', save);
        renderPages(); docStats();
    }
    window.CXPages = {
        open(id) { persistPage(); const p = pagesGet(), pg = p.list.find(x => x.id === id); if (!pg) return; p.active = id; setJ('walletPages', p); editor().innerHTML = pg.html || ''; renderPages(); docStats(); },
        create() { persistPage(); const t = prompt('Page title:', 'Untitled'); if (t === null) return; const p = pagesGet(), id = Date.now(); p.list.push({ id, title: t.trim() || 'Untitled', html: '', updated: Date.now() }); p.active = id; setJ('walletPages', p); editor().innerHTML = ''; renderPages(); docStats(); editor().focus(); },
        rename() { const p = pagesGet(), pg = p.list.find(x => x.id === p.active); if (!pg) return; const t = prompt('Rename page:', pg.title); if (!t) return; pg.title = t.trim(); setJ('walletPages', p); renderPages(); },
        remove() { const p = pagesGet(); if (p.list.length <= 1) return toast('Keep at least one page.', true); const pg = p.list.find(x => x.id === p.active); if (!confirm(`Delete page "${pg.title}"?`)) return; p.list = p.list.filter(x => x.id !== p.active); p.active = p.list[0].id; setJ('walletPages', p); editor().innerHTML = p.list[0].html || ''; renderPages(); docStats(); },
        template(name) { if (!TEMPLATES[name]) return; const ed = editor(); ed.insertAdjacentHTML('beforeend', TEMPLATES[name]()); persistPage(); docStats(); toast(`${name} template inserted.`); },
        exportTxt() { const p = pagesGet(), pg = p.list.find(x => x.id === p.active); const blob = new Blob([editor().innerText], { type: 'text/plain;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = ((pg && pg.title) || 'page').replace(/[^\w-]+/g, '_') + '.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
    };

    // --- save works offline: local copy first, cloud attempt second
    window.saveWorkspace = async function () {
        const ed = editor(); if (!ed) return;
        ed.querySelectorAll('input[type="checkbox"]').forEach(cb => { if (cb.checked) cb.setAttribute('checked', 'checked'); else cb.removeAttribute('checked'); });
        persistPage();
        const c = $('whiteboardCanvas'); let wb = '';
        if (c) { wb = c.toDataURL(); try { localStorage.setItem('walletWbLocal', wb); } catch (e) { toast('Sketch too large to store locally. Use PNG to download it.', true); } }
        const btn = document.querySelector('button[onclick="saveWorkspace()"]'), orig = btn ? btn.innerHTML : '';
        if (btn) btn.innerHTML = 'Saving…';
        let cloud = false;
        try { const r = await fetch(`${API_BASE}/save-workspace`, { method: 'POST', headers: apiHeaders, body: JSON.stringify({ notes: ed.innerHTML, whiteboard: wb }) }); cloud = r.ok; } catch (e) {}
        if (btn) { btn.innerHTML = cloud ? 'Synced' : 'Saved offline'; setTimeout(() => { btn.innerHTML = orig; icons(); }, 2000); }
        toast(cloud ? 'Workspace synced.' : 'Workspace saved on this device (server offline).');
    };

    // --- memory cards: search, pin, tick-boxes
    let keepQ = '';
    window.renderKeepNotes = function () {
        const grid = $('keepGrid'); if (!grid) return;
        if (!$('cxKeepSearch')) grid.insertAdjacentHTML('beforebegin', `<input id="cxKeepSearch" class="cx-in w-full mb-4" placeholder="Search memory cards…" oninput="CXKeep.search(this.value)">`);
        const notes = getJ('keepNotes', []), q = keepQ.toLowerCase();
        const list = notes.filter(n => !q || ((n.title || '') + ' ' + (n.body || '')).toLowerCase().includes(q)).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        const body = n => esc(n.body || '').split('\n').map((ln, i) => { const m = ln.match(/^\s*\[( |x|X)?\]\s*(.*)$/); return m ? `<label style="display:flex;gap:6px;align-items:flex-start;cursor:pointer" onclick="event.stopPropagation()"><input type="checkbox" ${m[1] && m[1].trim() ? 'checked' : ''} onchange="CXKeep.tick(${Number(n.id)}, ${i})" style="margin-top:3px;accent-color:#00e5ff"><span style="${m[1] && m[1].trim() ? 'text-decoration:line-through;opacity:.5' : ''}">${m[2]}</span></label>` : ln; }).join('\n');
        grid.innerHTML = list.length ? list.map(n => `
            <div class="keep-card p-4 cursor-pointer ${esc(n.color || 'bg-black/60')} ${n.pinned ? 'pinned' : ''}" onclick="openEditKeepModal(${Number(n.id)})">
                <div class="flex justify-between items-start gap-2">
                    <p class="text-sm font-bold text-[#00e5ff] break-words">${n.pinned ? '📌 ' : ''}${esc(n.title)}</p>
                    <span class="flex gap-2 shrink-0"><button title="${n.pinned ? 'Unpin' : 'Pin to top'}" onclick="event.stopPropagation(); CXKeep.pin(${Number(n.id)})" style="color:${n.pinned ? '#fbbf24' : '#64748b'}"><i data-lucide="pin" class="w-3 h-3"></i></button>
                    <button onclick="event.stopPropagation(); deleteKeepNote(${Number(n.id)})" class="text-[#ef4444] hover:text-white"><i data-lucide="x" class="w-3 h-3"></i></button></span>
                </div>
                <div class="text-xs text-gray-300 mt-1 whitespace-pre-wrap break-words">${body(n)}</div>
            </div>`).join('') : `<p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">${notes.length ? 'No cards match.' : 'No memory cards yet. Tip: start a line with [ ] to make a tick-box.'}</p>`;
        icons();
    };
    window.CXKeep = {
        search: debounce(v => { keepQ = v; renderKeepNotes(); const s = $('cxKeepSearch'); if (s) s.focus(); }, 200),
        pin(id) { const n = getJ('keepNotes', []), x = n.find(i => i.id === id); if (!x) return; x.pinned = !x.pinned; setJ('keepNotes', n); renderKeepNotes(); },
        tick(id, line) { const n = getJ('keepNotes', []), x = n.find(i => i.id === id); if (!x) return; const ls = (x.body || '').split('\n'); ls[line] = /^\s*\[(x|X)\]/.test(ls[line]) ? ls[line].replace(/\[(x|X)\]/, '[ ]') : ls[line].replace(/\[\s?\]/, '[x]'); x.body = ls.join('\n'); setJ('keepNotes', n); renderKeepNotes(); }
    };

    // ==========================================================================
    // 6. GROWTH — mood-adaptive personal development
    // ==========================================================================
    const MOODS = [['😵', 'Drained'], ['😕', 'Low'], ['😐', 'Neutral'], ['🙂', 'Good'], ['⚡', 'Charged']];
    const moodLog = () => getJ('walletMoodHistory', {});
    function todayMood() {
        const m = moodLog()[todayStr()] || {};
        return { energy: Number(m.energy) || Number(($('energySlider') || {}).value) || 5, focus: Number(m.focus) || Number(($('focusSlider') || {}).value) || 5, mood: Number(m.mood) || 3, set: !!moodLog()[todayStr()] };
    }
    function mode() {
        const t = todayMood(), score = t.energy * 0.3 + t.focus * 0.3 + t.mood * 2 * 0.4;
        if (score < 4) return { key: 'recovery', name: 'Recovery', color: '#f87171', block: 15, score, t, line: 'Protect the streak, not the output. Do the smallest version of the day.' };
        if (score < 6) return { key: 'steady', name: 'Steady', color: '#fbbf24', block: 25, score, t, line: 'A normal day. Two honest focus blocks and your habits is a win.' };
        if (score < 8) return { key: 'build', name: 'Build', color: '#34d399', block: 45, score, t, line: 'Good conditions. Spend one long block on the thing you have been avoiding.' };
        return { key: 'overdrive', name: 'Overdrive', color: '#00e5ff', block: 50, score, t, line: 'Peak state. Take on the hardest target first and ride it.' };
    }
    function directive() {
        const md = mode(), t = md.t, out = [];
        let habits = [], doneIds = [];
        try { habits = customHabits; doneIds = habitHistory[todayStr()] || []; } catch (e) {}
        const openH = habits.filter(h => !doneIds.includes(h.id));
        let target = null; try { target = growthItems[0]; } catch (e) {}
        if (md.key === 'recovery') {
            out.push(openH[0] ? `Anchor habit only: <b>${esc(openH[0].text)}</b>. The rest are optional today.` : 'Habits are already done. Stop there.');
            out.push('One 15-minute block on something easy: tidy notes, plan tomorrow, or read.');
            out.push('Water, a short walk, and an earlier night will do more than pushing through.');
        } else if (md.key === 'steady') {
            out.push(openH.length ? `Clear ${Math.min(openH.length, 3)} habit${openH.length > 1 ? 's' : ''}: ${openH.slice(0, 3).map(h => esc(h.text)).join(', ')}.` : 'Habits complete. Use the spare energy on a focus block.');
            out.push('Two 25-minute focus blocks with a 5-minute break between them.');
            if (target) out.push(`Give 15 minutes to: <b>${esc(target.desc.slice(0, 70))}</b>.`);
        } else if (md.key === 'build') {
            out.push('One 45-minute deep block before anything else, phone out of reach.');
            if (target) out.push(`Run the full countermeasure for: <b>${esc(target.desc.slice(0, 70))}</b>.`);
            out.push(openH.length ? `Then finish all ${openH.length} open habit${openH.length > 1 ? 's' : ''}.` : 'Habits are done. Log a skill session.');
        } else {
            out.push('Three 50-minute blocks with 10-minute breaks. Start with the hardest task.');
            if (target) out.push(`Push past the comfortable part of: <b>${esc(target.desc.slice(0, 70))}</b>.`);
            out.push('Bank the surplus: prepare tomorrow so a low day costs you nothing.');
        }
        if (t.energy >= 7 && t.focus <= 4) out.push('High energy, scattered focus: move first (a workout or walk), then single-task with one tab open.');
        if (t.energy <= 4 && t.focus >= 7) out.push('Low energy, sharp focus: pick quiet deep work such as reading, writing or planning. Skip anything physical and heavy.');
        return { md, out };
    }

    let moodChart = null, timer = { left: 0, total: 0, id: null, running: false };
    const focusLog = () => getJ('walletFocusLog', {});
    const journal = () => getJ('walletJournal', []);
    const skills = () => getJ('walletSkills', []);
    const PROMPTS = {
        recovery: 'What is draining you today, and what is one thing you can drop without consequences?',
        steady: 'What is the one thing that, if done today, makes the day count?',
        build: 'What have you been avoiding that you now have the energy to face?',
        overdrive: 'What would make today a day you remember a month from now?'
    };

    function injectGrowth() {
        const view = $('viewGrowth'); if (!view || $('cxGrowth')) return;
        view.firstElementChild.insertAdjacentHTML('afterend', `
        <div id="cxGrowth" class="space-y-4 md:space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6">
                    <h4 class="cx-h text-[#10b981]"><i data-lucide="smile" class="w-4 h-4"></i> Mood check-in</h4>
                    <div id="cxMoodRow" class="grid grid-cols-5 gap-2"></div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-3">Combined with the Energy and Focus sliders below. LEVEL//UP Fitness reads this too.</p>
                    <div style="height:150px;position:relative;margin-top:12px"><canvas id="cxMoodChart"></canvas></div>
                </div>
                <div class="glass-panel p-5 md:p-6 lg:col-span-2" id="cxDirective"></div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div class="glass-panel p-5 md:p-6 flex flex-col items-center text-center">
                    <h4 class="cx-h text-[#00e5ff] self-start"><i data-lucide="timer" class="w-4 h-4"></i> Focus timer</h4>
                    <div id="cxTimerRing" style="position:relative;width:170px;height:170px"><svg viewBox="0 0 120 120" style="width:100%;height:100%;transform:rotate(-90deg)"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/><circle id="cxTimerArc" cx="60" cy="60" r="52" fill="none" stroke="#00e5ff" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="0" style="transition:stroke-dashoffset .5s linear;filter:drop-shadow(0 0 6px #00e5ff)"/></svg>
                        <b id="cxTimerText" class="cx-display" style="position:absolute;inset:0;display:grid;place-items:center;font-size:34px;color:#fff">25:00</b></div>
                    <div class="flex gap-2 mt-4 flex-wrap justify-center">${[15, 25, 45, 50].map(n => `<button class="cx-btn sm" onclick="CXGrowth.setTimer(${n})">${n}m</button>`).join('')}</div>
                    <div class="flex gap-2 mt-2"><button class="cx-btn green" id="cxTimerGo" onclick="CXGrowth.toggleTimer()">Start</button><button class="cx-btn red" onclick="CXGrowth.resetTimer()">Reset</button></div>
                    <p id="cxFocusStats" class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-3"></p>
                </div>
                <div class="glass-panel p-5 md:p-6 flex flex-col">
                    <h4 class="cx-h text-[#a855f7]"><i data-lucide="book-open" class="w-4 h-4"></i> Journal</h4>
                    <p id="cxPrompt" class="text-xs font-bold text-gray-300 mb-2"></p>
                    <textarea id="cxJournalText" class="cx-in w-full" style="min-height:90px;resize:vertical" placeholder="A few honest lines…"></textarea>
                    <button class="cx-btn violet mt-2" onclick="CXGrowth.saveJournal()">Save entry</button>
                    <div id="cxJournalList" class="space-y-2 mt-3 max-h-[210px] overflow-y-auto ledger-scrollbar pr-1"></div>
                </div>
                <div class="glass-panel p-5 md:p-6 flex flex-col">
                    <h4 class="cx-h text-[#fbbf24]"><i data-lucide="swords" class="w-4 h-4"></i> Skill tree</h4>
                    <div class="flex gap-2 mb-3"><input id="cxSkillName" class="cx-in flex-1" placeholder="Guitar, Python, Spoken English…" onkeydown="if(event.key==='Enter')CXGrowth.addSkill()"><button class="cx-btn" onclick="CXGrowth.addSkill()">+ Add</button></div>
                    <div id="cxSkillList" class="space-y-3"></div>
                </div>
            </div>
            <div id="cxWeek" class="grid grid-cols-2 lg:grid-cols-4 gap-3"></div>
        </div>`);
    }

    function fmt(s) { return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
    function paintTimer() {
        const t = $('cxTimerText'), a = $('cxTimerArc'); if (!t) return;
        t.textContent = fmt(Math.max(0, timer.left)); a.style.strokeDashoffset = timer.total ? 326.7 * (1 - timer.left / timer.total) : 0;
        const go = $('cxTimerGo'); if (go) go.textContent = timer.running ? 'Pause' : (timer.left < timer.total && timer.left > 0 ? 'Resume' : 'Start');
    }
    function beep() { try { const C = window.AudioContext || window.webkitAudioContext, c = new C(), o = c.createOscillator(), g = c.createGain(); o.frequency.value = 880; g.gain.value = .15; o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .4); o.onended = () => c.close(); } catch (e) {} }

    function renderGrowth() {
        injectGrowth(); if (!$('cxGrowth')) return;
        const t = todayMood(), { md, out } = directive();
        $('cxMoodRow').innerHTML = MOODS.map((m, i) => `<button onclick="CXGrowth.setMood(${i + 1})" title="${m[1]}" style="padding:10px 0;border-radius:12px;border:1px solid ${t.set && t.mood === i + 1 ? '#10b981' : 'rgba(255,255,255,.1)'};background:${t.set && t.mood === i + 1 ? 'rgba(16,185,129,.2)' : 'rgba(0,0,0,.4)'};box-shadow:${t.set && t.mood === i + 1 ? '0 0 12px rgba(16,185,129,.4)' : 'none'}"><span style="font-size:24px;display:block">${m[0]}</span><span style="font-size:9.5px;font-weight:800;color:#94a3b8;text-transform:uppercase">${m[1]}</span></button>`).join('');

        $('cxDirective').style.borderColor = md.color + '88';
        $('cxDirective').innerHTML = `<div class="flex items-center gap-4 mb-3">${hud(70, md.color, md.key === 'recovery' ? 'moon' : md.key === 'steady' ? 'activity' : md.key === 'build' ? 'trending-up' : 'zap')}
            <div class="min-w-0"><p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Adaptive directive • readiness ${md.score.toFixed(1)} / 10</p>
            <h3 class="cx-display" style="font-size:26px;font-weight:800;color:${md.color};text-transform:uppercase;letter-spacing:.06em">${md.name} mode</h3>
            <p class="text-xs font-bold text-gray-300">${md.line}</p></div></div>
            ${t.set ? '' : '<p class="text-[10px] font-bold uppercase tracking-widest mb-2" style="color:#fbbf24">No check-in yet today. Tap a mood or move a slider to personalise this.</p>'}
            <ul class="space-y-2">${out.map(o => `<li class="cx-row text-sm text-gray-200"><span style="color:${md.color}">▸</span><span>${o}</span></li>`).join('')}</ul>
            <div class="flex flex-wrap gap-2 mt-3"><button class="cx-btn sm" onclick="CXGrowth.setTimer(${md.block});CXGrowth.toggleTimer()">Start a ${md.block}-minute block</button><button class="cx-btn sm" onclick="document.getElementById('cxJournalText').focus()">Write the journal prompt</button></div>`;

        if (!timer.total) { timer.total = timer.left = md.block * 60; }
        paintTimer();
        const fl = focusLog(), wk = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - i); return d.toLocaleDateString('en-CA'); });
        const weekMin = wk.reduce((a, d) => a + (fl[d] || 0), 0);
        $('cxFocusStats').textContent = `Today ${fl[todayStr()] || 0} min • last 7 days ${weekMin} min`;

        $('cxPrompt').textContent = PROMPTS[md.key];
        const j = journal();
        $('cxJournalList').innerHTML = j.length ? j.slice(0, 8).map(e => `<div class="cx-row" style="align-items:flex-start"><div class="flex-1 min-w-0"><p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">${new Date(e.ts).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} ${e.mood ? MOODS[e.mood - 1][0] : ''}</p><p class="text-xs text-gray-200 whitespace-pre-wrap break-words">${esc(e.text)}</p></div><button class="cx-btn red sm" onclick="CXGrowth.delJournal(${e.ts})">✕</button></div>`).join('') : '<div class="cx-empty">No entries yet.</div>';

        const sk = skills();
        $('cxSkillList').innerHTML = sk.length ? sk.map(s => {
            const hrs = s.minutes / 60, lvl = Math.floor(Math.sqrt(hrs / 2)) + 1, cur = 2 * Math.pow(lvl - 1, 2), nxt = 2 * Math.pow(lvl, 2), pct = Math.min(100, (hrs - cur) / (nxt - cur) * 100);
            return `<div><div class="flex justify-between items-center gap-2 mb-1"><span class="text-sm font-bold text-white truncate">${esc(s.name)}</span><span class="text-[10px] font-black uppercase tracking-widest" style="color:#fbbf24">LVL ${lvl} • ${hrs.toFixed(1)} h</span></div>
                <div class="cx-bar"><i style="width:${pct}%;background:#fbbf24"></i></div>
                <div class="flex gap-1.5 mt-1.5 items-center"><button class="cx-btn sm" onclick="CXGrowth.logSkill(${s.id},15)">+15m</button><button class="cx-btn sm" onclick="CXGrowth.logSkill(${s.id},30)">+30m</button><button class="cx-btn sm" onclick="CXGrowth.logSkill(${s.id},60)">+1h</button><span class="text-[10px] font-bold text-gray-500 ml-auto">${(nxt - hrs).toFixed(1)} h to LVL ${lvl + 1}</span><button class="cx-btn red sm" onclick="CXGrowth.delSkill(${s.id})">✕</button></div></div>`;
        }).join('') : '<div class="cx-empty">Add a skill and log practice time to level it up.</div>';

        const ml = moodLog();
        let hDone = 0, hTot = 0; try { wk.forEach(d => { hTot += customHabits.length; hDone += (habitHistory[d] || []).filter(id => customHabits.some(h => h.id === id)).length; }); } catch (e) {}
        const moods = wk.map(d => ml[d]).filter(Boolean), avgE = moods.length ? (moods.reduce((a, m) => a + (m.energy || 0), 0) / moods.length).toFixed(1) : '—';
        const jDays = new Set(j.filter(e => Date.now() - e.ts < 7 * 86400000).map(e => new Date(e.ts).toDateString())).size;
        $('cxWeek').innerHTML = `
            <div class="cx-tile"><span>Habits, last 7 days</span><b style="color:#a855f7">${hTot ? Math.round(hDone / hTot * 100) : 0}%</b><small>${hDone} of ${hTot} check-offs</small></div>
            <div class="cx-tile"><span>Focus time, 7 days</span><b style="color:#00e5ff">${(weekMin / 60).toFixed(1)} h</b><small>${weekMin} minutes</small></div>
            <div class="cx-tile"><span>Average energy</span><b style="color:#34d399">${avgE}</b><small>${moods.length} check-in${moods.length === 1 ? '' : 's'} this week</small></div>
            <div class="cx-tile"><span>Journal days</span><b style="color:#c084fc">${jDays} / 7</b><small>${j.length} entries in total</small></div>`;

        const cv = $('cxMoodChart');
        if (cv && typeof Chart !== 'undefined') {
            try {
                const days = [...Array(14)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d; });
                const pick = k => days.map(d => { const m = ml[d.toLocaleDateString('en-CA')]; return m && m[k] != null ? (k === 'mood' ? m[k] * 2 : m[k]) : null; });
                if (moodChart) moodChart.destroy();
                moodChart = new Chart(cv, { type: 'line', data: { labels: days.map(d => d.getDate()), datasets: [
                    { label: 'Energy', data: pick('energy'), borderColor: '#10b981', backgroundColor: '#10b981', tension: .35, spanGaps: true, pointRadius: 2, borderWidth: 2 },
                    { label: 'Focus', data: pick('focus'), borderColor: '#00e5ff', backgroundColor: '#00e5ff', tension: .35, spanGaps: true, pointRadius: 2, borderWidth: 2 },
                    { label: 'Mood', data: pick('mood'), borderColor: '#fbbf24', backgroundColor: '#fbbf24', tension: .35, spanGaps: true, pointRadius: 2, borderWidth: 2, borderDash: [4, 3] }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 10 } } } }, scales: { y: { min: 0, max: 10, ticks: { color: '#64748b', stepSize: 5 }, grid: { color: 'rgba(255,255,255,.05)' } }, x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } } } } });
            } catch (e) {}
        }
        window.CX.emit('growth');
        icons();
    }

    function writeMood(patch) {
        const h = moodLog(), cur = h[todayStr()] || {};
        h[todayStr()] = Object.assign({ energy: Number(($('energySlider') || {}).value) || 5, focus: Number(($('focusSlider') || {}).value) || 5, mood: 3 }, cur, patch);
        setJ('walletMoodHistory', h);
    }
    const rerenderGrowth = debounce(() => { timer.running || (timer.total = timer.left = mode().block * 60); renderGrowth(); }, 250);
    window.saveMood = function () { writeMood({ energy: Number($('energySlider').value), focus: Number($('focusSlider').value) }); rerenderGrowth(); };

    window.CXGrowth = {
        mode, render: renderGrowth,
        directiveText() { const { md, out } = directive(); return `<b style="color:${md.color}">${md.name} mode</b> (readiness ${md.score.toFixed(1)}/10). ${md.line}<br>` + out.map(o => '• ' + o).join('<br>'); },
        setMood(n) { writeMood({ mood: n }); if (!timer.running) timer.total = timer.left = mode().block * 60; renderGrowth(); toast(`Mood logged: ${MOODS[n - 1][1]}. Directive updated.`); },
        setTimer(min) { clearInterval(timer.id); timer = { total: min * 60, left: min * 60, id: null, running: false }; paintTimer(); },
        toggleTimer() {
            if (timer.running) { clearInterval(timer.id); timer.running = false; return paintTimer(); }
            if (timer.left <= 0) timer.left = timer.total;
            timer.running = true; timer.end = Date.now() + timer.left * 1000;
            timer.id = setInterval(() => {
                timer.left = Math.max(0, Math.round((timer.end - Date.now()) / 1000)); paintTimer();
                if (timer.left === 0) {
                    clearInterval(timer.id); timer.running = false;
                    const fl = focusLog(); fl[todayStr()] = (fl[todayStr()] || 0) + Math.round(timer.total / 60); setJ('walletFocusLog', fl); window.CX.emit('focus', Math.round(timer.total / 60));
                    beep(); toast(`Focus block complete: ${Math.round(timer.total / 60)} minutes logged.`); timer.left = timer.total; renderGrowth();
                }
            }, 500); paintTimer();
        },
        resetTimer() { clearInterval(timer.id); timer.running = false; timer.left = timer.total; paintTimer(); },
        saveJournal() { const el = $('cxJournalText'), tx = el.value.trim(); if (!tx) return toast('Write something first.', true); const j = journal(); j.unshift({ ts: Date.now(), text: tx, mood: todayMood().set ? todayMood().mood : null }); setJ('walletJournal', j.slice(0, 200)); el.value = ''; window.CX.emit('journal'); renderGrowth(); toast('Journal entry saved.'); },
        delJournal(ts) { if (!confirm('Delete this entry?')) return; setJ('walletJournal', journal().filter(e => e.ts !== ts)); renderGrowth(); },
        addSkill() { const el = $('cxSkillName'), n = el.value.trim(); if (!n) return; const s = skills(); s.push({ id: Date.now(), name: n, minutes: 0 }); setJ('walletSkills', s); el.value = ''; renderGrowth(); },
        logSkill(id, min) { const s = skills(), x = s.find(i => i.id === id); if (!x) return; const before = Math.floor(Math.sqrt(x.minutes / 120)) + 1; x.minutes += min; const after = Math.floor(Math.sqrt(x.minutes / 120)) + 1; setJ('walletSkills', s); window.CX.emit('skill', { id, min }); renderGrowth(); toast(after > before ? `${x.name} reached level ${after}.` : `+${min} minutes on ${x.name}.`); },
        delSkill(id) { if (!confirm('Remove this skill?')) return; setJ('walletSkills', skills().filter(i => i.id !== id)); renderGrowth(); }
    };

    // ==========================================================================
    // BOOT
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion boot step failed', e); } };
        safe(() => { const v = $('viewWishlist'); if (v && !$('cxCapture_w')) v.insertAdjacentHTML('beforeend', capturePanel('w')); });
        safe(() => { const v = $('viewMedia'); if (v && !$('cxCapture_m')) v.insertAdjacentHTML('beforeend', capturePanel('m')); });
        safe(() => wireDecoder('wishLink', 'wishName', d => { const c = $('wishCategory'); if (c && d.category && [...c.options].some(o => o.value === d.category)) c.value = d.category; }));
        safe(() => wireDecoder('mediaLink', 'mediaName', d => { const c = $('mediaType'); if (c && d.type) c.value = d.type; }));
        safe(() => renderWishlist()); safe(() => renderMedia()); safe(() => renderKeepNotes());
        safe(wbTools); safe(() => setTimeout(injectPages, 700));
        safe(renderGrowth);
        safe(() => { const m = moodLog()[todayStr()]; if (m) { if ($('energySlider')) { $('energySlider').value = m.energy; $('energyValue').innerText = m.energy + '/10'; } if ($('focusSlider')) { $('focusSlider').value = m.focus; $('focusValue').innerText = m.focus + '/10'; } } });
        safe(readHash);
        setTimeout(() => { safe(() => renderWishlist()); safe(() => renderMedia()); safe(() => window.CXPlanner && $('viewPlanner') && window.CXPlanner.render()); }, 1500);
        icons();
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 3
// Rebuilt sketch engine, Library rename, linked Growth system with status
// window and telemetry, hunter strip, info buttons, theme polish.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, todayStr, mKey, toast, balances, monthStats, on, emit } = window.CX;
    const info = t => `<span class="info-icon" data-info="${esc(t)}"><i data-lucide="help-circle" class="w-4 h-4"></i></span>`;
    const lastDays = n => [...Array(n)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); return d; });
    const dk = d => d.toLocaleDateString('en-CA');

    // ==========================================================================
    // 0. THEME POLISH + SYSTEM (hunter) STYLING
    // ==========================================================================
    const css = document.createElement('style');
    css.textContent = `
    .glass-panel { background: linear-gradient(160deg, rgba(6,14,26,.92), rgba(3,7,14,.9)); }
    .glass-panel > h4, .cx-h { position: relative; }
    h2.bubbly-text { background: linear-gradient(90deg, #fff 30%, #7dd3fc); -webkit-background-clip: text; background-clip: text; color: transparent !important; }
    h2.bubbly-text i, h2.bubbly-text svg, h2.bubbly-text .info-icon { color: #00e5ff; -webkit-text-fill-color: initial; }
    .nav-btn { transition: all .25s ease; } .nav-btn:hover { transform: translateY(-1px); }
    .cx-btn:active, .nav-btn:active { transform: scale(.97); }
    .view-card.active { animation: cxIn .35s ease; } @keyframes cxIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    .cx-h .info-icon { margin-left: 2px; color: #64748b; } .cx-h .info-icon:hover { color: #00e5ff; }

    /* system window (hunter interface) */
    .cx-sys { position: relative; border: 1px solid rgba(96,165,250,.55); border-radius: 14px; padding: 18px 20px;
        background: linear-gradient(180deg, rgba(30,58,138,.28), rgba(3,7,18,.92) 55%), repeating-linear-gradient(0deg, rgba(96,165,250,.05) 0 1px, transparent 1px 4px);
        box-shadow: 0 0 26px rgba(59,130,246,.28), inset 0 0 30px rgba(59,130,246,.08); overflow: hidden; }
    .cx-sys::before { content: attr(data-sys); position: absolute; top: 0; left: 18px; font: 800 10px 'Exo 2', sans-serif; letter-spacing: .22em; color: #030712; background: #60a5fa; padding: 2px 10px; border-radius: 0 0 8px 8px; }
    .cx-sys::after { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: linear-gradient(90deg, transparent, #93c5fd, transparent); animation: cxScan 3.5s linear infinite; }
    @keyframes cxScan { from { transform: translateY(0); opacity: .9; } to { transform: translateY(260px); opacity: 0; } }
    .cx-rank { flex: none; filter: drop-shadow(0 0 10px var(--rc)); }
    .cx-xp { height: 9px; border-radius: 6px; background: rgba(0,0,0,.6); border: 1px solid rgba(96,165,250,.35); overflow: hidden; }
    .cx-xp > i { display: block; height: 100%; background: linear-gradient(90deg, #3b82f6, #a855f7, #00e5ff); background-size: 200% 100%; animation: cxFlow 3s linear infinite; transition: width .6s ease; }
    @keyframes cxFlow { to { background-position: 200% 0; } }
    .cx-stat { background: rgba(0,0,0,.45); border: 1px solid rgba(96,165,250,.25); border-radius: 10px; padding: 8px 10px; text-align: center; }
    .cx-stat span { display: block; font-size: 10px; font-weight: 800; letter-spacing: .1em; color: #93c5fd; text-transform: uppercase; }
    .cx-stat b { font: 800 20px 'Exo 2', sans-serif; color: #fff; }
    .cx-link { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; background: rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; padding: 9px 12px; transition: all .2s; cursor: pointer; }
    .cx-link:hover { border-color: #00e5ff; background: rgba(0,229,255,.07); transform: translateX(2px); }
    .cx-link b { font-size: 13px; color: #fff; display: block; } .cx-link small { font-size: 11.5px; color: #94a3b8; font-weight: 700; }
    .cx-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
    .cx-quest { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px dashed rgba(96,165,250,.2); font-size: 13px; font-weight: 700; color: #e2e8f0; }
    .cx-quest:last-child { border: 0; } .cx-quest em { margin-left: auto; font-style: normal; font-family: 'Exo 2', sans-serif; color: #93c5fd; font-weight: 800; }
    .cx-quest.ok { color: #64748b; text-decoration: line-through; } .cx-quest.ok em { color: #34d399; text-decoration: none; }
    .cx-hm { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; }
    .cx-hm i { aspect-ratio: 1; border-radius: 6px; border: 1px solid rgba(255,255,255,.06); display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 10px; font-weight: 800; color: #94a3b8; }
    .cx-auto { font-size: 9.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: #00e5ff; border: 1px solid rgba(0,229,255,.35); border-radius: 6px; padding: 1px 5px; margin-left: 8px; white-space: nowrap; }
    .cx-chartbox { position: relative; height: 210px; }
    #cxParticles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
    #cxParticles i { position: absolute; bottom: -10px; width: 3px; height: 3px; border-radius: 50%; background: #60a5fa; box-shadow: 0 0 8px #60a5fa; opacity: 0; animation: cxRise linear infinite; }
    @keyframes cxRise { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: .7; } 100% { transform: translateY(-105vh); opacity: 0; } }
    #cxLevelUp { position: fixed; inset: 0; z-index: 2147483500; display: grid; place-items: center; background: rgba(2,6,23,.8); backdrop-filter: blur(6px); animation: cxIn .3s ease; }
    #cxLevelUp .cx-sys { min-width: min(420px, 88vw); text-align: center; padding: 34px 26px 26px; animation: cxPop .5s cubic-bezier(.2,1.4,.4,1); }
    @keyframes cxPop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { #cxParticles, .cx-sys::after { display: none; } .cx-xp > i { animation: none; } }

    /* fullscreen sketch: a transformed ancestor would trap position:fixed, so neutralise it while fullscreen */
    body.cx-fs { overflow: hidden; } body.cx-fs .view-card.active, body.cx-fs .view-container { transform: none !important; animation: none !important; overflow: visible !important; }
    body.cx-fs header, body.cx-fs #cxParticles { visibility: hidden; }
    .fullscreen-wb { overflow-y: auto; }
    /* sketch box */
    #whiteboardContainer > div:first-child { row-gap: 10px; }
    #whiteboardContainer > div:first-child > .ml-auto { margin-top: 0 !important; width: auto !important; flex-wrap: wrap; }
    .cx-wb-stage { position: relative !important; overflow: hidden !important; width: 100%; border-radius: 12px; isolation: isolate; }
    .cx-wb-stage > canvas { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; touch-action: none; cursor: crosshair; }
    .fullscreen-wb .cx-wb-stage > canvas { height: 100% !important; }
    #cxWbBar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin: 0 0 10px; }
    #cxWbBar .sw { width: 22px; height: 22px; border-radius: 50%; border: 2px solid rgba(255,255,255,.25); cursor: pointer; } #cxWbBar .sw.on { border-color: #fff; box-shadow: 0 0 10px currentColor; }
    #cxWbStatus { margin-left: auto; font-size: 11.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #94a3b8; display: flex; align-items: center; gap: 8px; }
    #cxWbDot { display: inline-block; border-radius: 50%; border: 1px solid rgba(255,255,255,.4); }
    `;
    document.head.appendChild(css);

    // ==========================================================================
    // 1. SKETCH BOX — rebuilt drawing engine
    //    Root cause of strokes landing outside the box: the canvas could be laid
    //    out against the whole panel instead of the drawing stage, so it covered
    //    the toolbar. The stage is now forced to be the canvas's frame and the
    //    drawing listeners are attached exactly once.
    // ==========================================================================
    const SW = ['#ffffff', '#00e5ff', '#fbbf24', '#f87171', '#34d399', '#c084fc', '#f97316'];
    let wb = null, ctx = null, pts = [];

    function wbStatus() {
        const s = $('cxWbStatus'); if (!s) return;
        const tool = isTextMode ? 'text' : currentTool, w = Number(penWidth) || 2;
        s.innerHTML = `<span id="cxWbDot" style="width:${Math.max(4, Math.min(26, w))}px;height:${Math.max(4, Math.min(26, w))}px;background:${tool === 'eraser' ? 'transparent' : penColor}"></span>${tool} • ${w}px`;
        document.querySelectorAll('#cxWbBar .sw').forEach(b => b.classList.toggle('on', b.dataset.c.toLowerCase() === String(penColor).toLowerCase()));
        const p = $('wbColorPicker'); if (p && /^#[0-9a-f]{6}$/i.test(penColor) && p.value.toLowerCase() !== penColor.toLowerCase()) p.value = penColor;
        const sl = $('wbWidthSlider'); if (sl && Number(sl.value) !== w) sl.value = w;
    }
    function fitWb() {
        if (!wb) return; const st = wb.parentElement, w = st.clientWidth, h = st.clientHeight;
        if (w < 20 || h < 20 || (wb.width === w && wb.height === h)) return;
        const tmp = document.createElement('canvas'); tmp.width = wb.width; tmp.height = wb.height;
        if (wb.width && wb.height) tmp.getContext('2d').drawImage(wb, 0, 0);
        wb.width = w; wb.height = h; if (tmp.width && tmp.height) ctx.drawImage(tmp, 0, 0);
    }
    function style() {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Number(penWidth) || 2; ctx.globalAlpha = 1;
        if (currentTool === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = '#000'; }
        else { ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = penColor; if (currentTool === 'highlighter') ctx.globalAlpha = 0.35; }
    }
    function at(e) { const r = wb.getBoundingClientRect(); return { x: (e.clientX - r.left) * (wb.width / r.width), y: (e.clientY - r.top) * (wb.height / r.height) }; }
    function shape(p) {
        ctx.putImageData(savedImageData, 0, 0); style(); ctx.beginPath();
        if (currentTool === 'line') { ctx.moveTo(startX, startY); ctx.lineTo(p.x, p.y); }
        else if (currentTool === 'rect') ctx.rect(startX, startY, p.x - startX, p.y - startY);
        else if (currentTool === 'circle') ctx.arc(startX, startY, Math.hypot(p.x - startX, p.y - startY), 0, 2 * Math.PI);
        else if (currentTool === 'arrow') {
            const a = Math.atan2(p.y - startY, p.x - startX), hl = 10 + (Number(penWidth) || 2) * 2;
            ctx.moveTo(startX, startY); ctx.lineTo(p.x, p.y);
            ctx.lineTo(p.x - hl * Math.cos(a - Math.PI / 6), p.y - hl * Math.sin(a - Math.PI / 6)); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - hl * Math.cos(a + Math.PI / 6), p.y - hl * Math.sin(a + Math.PI / 6));
        }
        ctx.stroke(); ctx.globalAlpha = 1;
    }
    function path() {                       // whole stroke redrawn from the snapshot: no blobs on highlighter joints, smooth pen
        ctx.putImageData(savedImageData, 0, 0); style(); ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        if (pts.length < 3) { const l = pts[pts.length - 1]; ctx.lineTo(l.x + 0.01, l.y + 0.01); }
        else { for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i].x + pts[i + 1].x) / 2, my = (pts[i].y + pts[i + 1].y) / 2; ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l.x, l.y); }
        ctx.stroke(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }

    function mountWb() {
        const old = $('whiteboardCanvas'); if (!old) return false;
        if (old.dataset.cx) { wb = old; return true; }
        const stage = old.parentElement; stage.classList.add('cx-wb-stage');
        if (getJ('walletWbGrid', true)) stage.classList.add('cx-grid');
        if (stage.clientWidth < 20) return false;
        const c = old.cloneNode(false); c.dataset.cx = '1'; c.width = stage.clientWidth; c.height = stage.clientHeight;   // clone = no stale listeners
        if (old.width && old.height) { try { c.getContext('2d').drawImage(old, 0, 0); } catch (e) {} }
        old.replaceWith(c); wb = c; ctx = c.getContext('2d', { willReadFrequently: true });
        const local = localStorage.getItem('walletWbLocal');
        if (local) { const img = new Image(); img.onload = () => { try { ctx.drawImage(img, 0, 0); } catch (e) {} }; img.src = local; }
        try { wbHistory.length = 0; saveWbState(); } catch (e) {}

        c.addEventListener('pointerdown', e => {
            if (e.button) return; e.preventDefault(); fitWb(); const p = at(e);
            if (isTextMode) {
                const t = prompt('Text to place on the sketch:'); if (!t) return;
                saveWbState(); const size = Math.max(16, (Number(penWidth) || 2) * 4);
                ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.font = `700 ${size}px 'Exo 2', 'Nunito', sans-serif`; ctx.fillStyle = penColor; ctx.textBaseline = 'middle'; ctx.fillText(t, p.x, p.y); return;
            }
            try { c.setPointerCapture(e.pointerId); } catch (err) {}
            isDrawing = true; saveWbState(); startX = p.x; startY = p.y; savedImageData = ctx.getImageData(0, 0, c.width, c.height); pts = [p];
            if (['pen', 'highlighter', 'eraser'].includes(currentTool)) path();
        });
        c.addEventListener('pointermove', e => {
            if (!isDrawing) return; e.preventDefault(); const p = at(e);
            if (['pen', 'highlighter', 'eraser'].includes(currentTool)) { (e.getCoalescedEvents ? e.getCoalescedEvents() : [e]).forEach(ev => pts.push(at(ev))); if (!pts.length) pts.push(p); path(); }
            else shape(p);
        });
        const end = () => { if (!isDrawing) return; isDrawing = false; pts = []; ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.beginPath(); };
        c.addEventListener('pointerup', end); c.addEventListener('pointercancel', end); c.addEventListener('lostpointercapture', end);
        if (window.ResizeObserver) new ResizeObserver(() => { if (!isDrawing) fitWb(); }).observe(stage);

        // toolbar extras: colour swatches + live status; picker and slider update while dragging
        if (!$('cxWbBar')) {
            stage.insertAdjacentHTML('beforebegin', `<div id="cxWbBar">${SW.map(s => `<button type="button" class="sw" data-c="${s}" title="${s}" style="background:${s};color:${s}"></button>`).join('')}<span id="cxWbStatus"></span></div>`);
            $('cxWbBar').onclick = e => { const b = e.target.closest('.sw'); if (b) setPenColor(b.dataset.c); };
        }
        const pk = $('wbColorPicker'), sl = $('wbWidthSlider');
        if (pk) { pk.addEventListener('input', () => setPenColor(pk.value)); penColor = pk.value; }      // picker and pen now agree from the start
        if (sl) sl.addEventListener('input', () => { setPenWidth(Number(sl.value)); });
        wbStatus(); return true;
    }
    window.initWhiteboard = function () { if (mountWb()) fitWb(); };
    ['setTool', 'setTextMode', 'setPenColor', 'setPenWidth'].forEach(n => { const o = window[n]; if (typeof o !== 'function') return; window[n] = function () { const r = o.apply(this, arguments); if (n === 'setPenWidth') penWidth = Number(arguments[0]) || 2; try { wbStatus(); } catch (e) {} return r; }; });
    window.clearWhiteboard = function () { if (!wb || !confirm('Clear the whole sketch?')) return; saveWbState(); ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, wb.width, wb.height); };
    window.undoWhiteboard = function () {
        if (!wb || !wbHistory.length) return; const last = wbHistory.pop(); const img = new Image();
        img.onload = () => { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.clearRect(0, 0, wb.width, wb.height); ctx.drawImage(img, 0, 0); if (!wbHistory.length) saveWbState(); };
        img.src = last;
    };
    const fsOrig = window.toggleWhiteboardFullscreen;
    window.toggleWhiteboardFullscreen = function () { const box = $('whiteboardContainer'); if (!box) return; const on = box.classList.toggle('fullscreen-wb'); document.body.classList.toggle('cx-fs', on); setTimeout(fitWb, 60); setTimeout(fitWb, 350); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('cx-fs')) window.toggleWhiteboardFullscreen(); });

    // ==========================================================================
    // 2. VAULT → LIBRARY (name that says what the tab is for)
    // ==========================================================================
    function renameVault() {
        const swap = (root, to) => { if (!root) return; [...root.childNodes].forEach(n => { if (n.nodeType === 3 && /Vault/.test(n.textContent)) n.textContent = n.textContent.replace('Vault', to); }); };
        swap($('navMedia'), 'Library');
        const h = document.querySelector('#viewMedia h2'); swap(h, 'Library');
        const ic = h && h.querySelector('.info-icon'); if (ic) ic.setAttribute('data-info', 'Your watch and read list: movies, series, anime and books. Track each title from Planned to Ongoing to Completed, rate what you finish, and capture new titles from any site with the bookmark below. Books you progress here tick your reading habit on the Growth tab.');
        if (h && !$('cxLibSub')) h.insertAdjacentHTML('afterend', '<p id="cxLibSub" class="text-gray-400 text-[10px] mt-1 font-bold tracking-widest uppercase">Watch list and reading list</p>');
    }

    // ==========================================================================
    // 3. LINKED GROWTH SYSTEM
    // ==========================================================================
    const J = { focus: () => getJ('walletFocusLog', {}), skillLog: () => getJ('walletSkillLog', {}), skills: () => getJ('walletSkills', []), journal: () => getJ('walletJournal', []), mood: () => getJ('walletMoodHistory', {}), read: () => getJ('walletReadLog', {}), tasks: () => getJ('walletTasks', []) };
    function fitness() {
        const s = getJ('levelup_home_v7', null); if (!s) return { exists: false, level: 0, sessions: 0, streak: 0, trained: [], trainedToday: false };
        const ext = s.ext || {}, trained = ext.trained || [];
        return { exists: true, level: s.level || 1, xp: s.xp || 0, sessions: s.sessions || 0, streak: s.streak || 0, trained, trainedToday: trained.includes(todayStr()), stats: s.stats || {}, log: ext.log || [] };
    }
    const habits = () => { try { return customHabits || []; } catch (e) { return []; } };
    const hist = () => { try { return habitHistory || {}; } catch (e) { return {}; } };

    // which live signal each habit is linked to
    const RULES = [
        { key: 'fitness', re: /fitness|workout|level\/\/up|exercise|gym|train/i, label: 'fitness session', test: () => fitness().trainedToday },
        { key: 'skill', re: /skill|practice/i, label: 'skill time', test: h => (J.skillLog()[todayStr()] || 0) >= (parseInt((h.text.match(/\d+/) || [15])[0], 10) || 15) },
        { key: 'read', re: /read|book|page/i, label: 'Library reading', test: () => !!J.read()[todayStr()] },
        { key: 'journal', re: /journal|diary|reflect|write/i, label: 'journal entry', test: () => J.journal().some(e => dk(new Date(e.ts)) === todayStr()) },
        { key: 'focus', re: /focus|deep work|study|pomodoro/i, label: 'focus timer', test: h => (J.focus()[todayStr()] || 0) >= (parseInt((h.text.match(/\d+/) || [25])[0], 10) || 25) },
        { key: 'any', re: /zero|consisten/i, label: 'any activity', test: () => fitness().trainedToday || (J.focus()[todayStr()] || 0) > 0 || (J.skillLog()[todayStr()] || 0) > 0 || J.journal().some(e => dk(new Date(e.ts)) === todayStr()) || !!J.read()[todayStr()] }
    ];
    const ruleOf = h => RULES.find(r => r.re.test(h.text));

    function syncHabits(quiet) {
        const hs = habits(); if (!hs.length) return;
        const t = todayStr(), hh = hist(); const done = hh[t] || []; let changed = [];
        hs.forEach(h => { if (done.includes(h.id)) return; const r = ruleOf(h); if (r && r.test(h)) { done.push(h.id); changed.push(h.text + ' (' + r.label + ')'); } });
        if (!changed.length) return;
        hh[t] = done; try { habitHistory = hh; } catch (e) {}
        localStorage.setItem('walletHabitHistory', JSON.stringify(hh));
        try { renderHabits(); renderHabitHistory(); } catch (e) {}
        if (!quiet) toast('Habit auto-completed: ' + changed.join(', '));
    }
    function decorateHabits() {
        const box = $('dynamicHabitList'); if (!box) return;
        habits().forEach(h => { const r = ruleOf(h), lab = box.querySelector(`label[for="${CSS.escape(h.id)}"]`); if (r && lab && !lab.querySelector('.cx-auto')) lab.insertAdjacentHTML('beforeend', `<span class="cx-auto" title="Ticks itself when the linked activity happens">⛓ ${r.label}</span>`); });
    }
    if (typeof window.renderHabits === 'function') { const o = window.renderHabits; window.renderHabits = function () { const r = o.apply(this, arguments); try { decorateHabits(); } catch (e) {} return r; }; }
    if (typeof window.saveHabits === 'function') { const o = window.saveHabits; window.saveHabits = function () { const r = o.apply(this, arguments); try { renderLinked(); renderStrip(); } catch (e) {} return r; }; }

    // ---- derived progression: every module feeds one level ------------------------
    function progress() {
        const hh = hist(), fl = J.focus(), sl = J.skillLog(), jr = J.journal(), fit = fitness(), tk = J.tasks();
        const checks = Object.values(hh).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);
        const focusMin = Object.values(fl).reduce((a, v) => a + v, 0), skillMin = J.skills().reduce((a, s) => a + (s.minutes || 0), 0);
        let libDone = 0; try { libDone = mediaItems.filter(m => m.mediaStatus === 'Completed').length; } catch (e) {}
        const src = { Habits: checks * 10, Focus: Math.round(focusMin), Skills: Math.round(skillMin * 0.5), Journal: jr.length * 15, Tasks: tk.filter(t => t.done).length * 8, Fitness: fit.sessions * 20, Library: libDone * 25 };
        const xp = Object.values(src).reduce((a, b) => a + b, 0), level = Math.floor(Math.sqrt(xp / 50)) + 1, cur = 50 * Math.pow(level - 1, 2), nxt = 50 * Math.pow(level, 2);
        const rank = level >= 40 ? 'S' : level >= 28 ? 'A' : level >= 18 ? 'B' : level >= 10 ? 'C' : level >= 5 ? 'D' : 'E';
        const d14 = lastDays(14).map(dk), hs = habits(), ml = J.mood();
        const pct = (v, max) => Math.max(0, Math.min(100, Math.round(v / max * 100)));
        const hDone = d14.reduce((a, d) => a + (hh[d] || []).filter(id => hs.some(h => h.id === id)).length, 0);
        const moods = d14.map(d => ml[d]).filter(Boolean);
        const attr = {
            Discipline: hs.length ? pct(hDone, hs.length * 14) : 0,
            Focus: pct(d14.reduce((a, d) => a + (fl[d] || 0), 0), 14 * 50),
            Skill: pct(d14.reduce((a, d) => a + (sl[d] || 0), 0), 14 * 30),
            Wisdom: pct(new Set(jr.filter(e => d14.includes(dk(new Date(e.ts)))).map(e => dk(new Date(e.ts)))).size + d14.filter(d => J.read()[d]).length, 14),
            Vitality: pct(d14.filter(d => fit.trained.includes(d)).length, 8),
            Mood: moods.length ? pct(moods.reduce((a, m) => a + ((m.mood || 3) * 2 + (m.energy || 5) + (m.focus || 5)) / 3, 0) / moods.length, 10) : 0
        };
        return { xp, level, cur, nxt, rank, src, attr, fit };
    }
    const RANK_COL = { E: '#94a3b8', D: '#34d399', C: '#3b82f6', B: '#a855f7', A: '#f97316', S: '#ef4444' };
    function emblem(rank, size) {
        const c = RANK_COL[rank];
        return `<svg class="cx-rank" style="--rc:${c}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-label="${rank}-Rank emblem"><polygon points="50,4 90,24 90,66 50,96 10,66 10,24" fill="rgba(3,7,18,.9)" stroke="${c}" stroke-width="3"/><polygon points="50,13 81,29 81,62 50,85 19,62 19,29" fill="none" stroke="${c}" stroke-width="1" opacity=".5" stroke-dasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="24s" repeatCount="indefinite"/></polygon><text x="50" y="64" text-anchor="middle" font-family="'Exo 2', sans-serif" font-weight="900" font-size="42" fill="${c}">${rank}</text></svg>`;
    }

    function quests() {
        const hs = habits(), done = hist()[todayStr()] || [], md = window.CXGrowth ? window.CXGrowth.mode() : { block: 25, name: 'Steady' };
        const fm = J.focus()[todayStr()] || 0, due = J.tasks().filter(t => t.due === todayStr()), fit = fitness();
        const q = [
            { t: `Clear daily habits`, v: `${hs.filter(h => done.includes(h.id)).length} / ${hs.length}`, ok: hs.length > 0 && hs.every(h => done.includes(h.id)) },
            { t: `Focus block (${md.block} min, ${md.name} mode)`, v: `${Math.min(fm, md.block)} / ${md.block}`, ok: fm >= md.block },
            { t: 'Train (LEVEL//UP session)', v: fit.trainedToday ? '1 / 1' : '0 / 1', ok: fit.trainedToday },
            { t: 'Log mood check-in', v: J.mood()[todayStr()] ? '1 / 1' : '0 / 1', ok: !!J.mood()[todayStr()] }
        ];
        if (due.length) q.push({ t: 'Tasks due today', v: `${due.filter(t => t.done).length} / ${due.length}`, ok: due.every(t => t.done) });
        return q;
    }

    const charts = {};
    function chart(id, cfg) { const c = $(id); if (!c || typeof Chart === 'undefined') return; try { if (charts[id]) charts[id].destroy(); charts[id] = new Chart(c, cfg); } catch (e) { console.warn('chart ' + id, e); } }
    const axis = (extra) => Object.assign({ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 10 } } } }, scales: { x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,.05)' } } } }, extra || {});

    function injectLinked() {
        const g = $('cxGrowth'); if (!g || $('cxStatus')) return;
        g.insertAdjacentHTML('afterbegin', `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6" id="cxStatus">
            <div class="cx-sys lg:col-span-2" data-sys="STATUS WINDOW" id="cxStatusBody"></div>
            <div class="cx-sys" data-sys="DAILY QUEST"><h4 class="cx-h text-[#93c5fd]" style="margin-top:8px">Preparation to grow stronger ${info('Your daily quest is assembled from the rest of the app: habits from the Habit Matrix, the focus block length from today’s mood mode, your fitness session from LEVEL//UP, and any Planner tasks due today. Each line completes itself when the linked activity happens.')}</h4><div id="cxQuests"></div><p id="cxQuestFoot" class="text-[10px] font-bold uppercase tracking-widest mt-3" style="color:#93c5fd"></p></div>
        </div>
        <div class="glass-panel p-5 md:p-6"><h4 class="cx-h text-[#00e5ff]"><i data-lucide="link" class="w-4 h-4"></i> Live connections ${info('Everything on this tab is wired to the other tabs. These cards show the live state of each link; click one to jump there.')}</h4><div id="cxLinks" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"></div></div>`);
        g.insertAdjacentHTML('beforeend', `
        <div id="cxTelemetry" class="space-y-4 md:space-y-6">
            <div class="flex items-end justify-between px-2"><h2 class="text-lg font-bold uppercase tracking-wider text-[#00e5ff] flex items-center">Growth telemetry ${info('Charts built from your real logs on this device. Empty days stay empty; nothing is estimated.')}</h2><span class="text-[10px] text-gray-500 font-bold tracking-widest uppercase">last 14 days</span></div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                <div class="glass-panel p-5"><h4 class="cx-h text-[#a855f7]"><i data-lucide="check-check" class="w-4 h-4"></i> Habit completion ${info('Share of your habits ticked each day. Auto-linked habits count the same as manual ticks.')}</h4><div class="cx-chartbox"><canvas id="cxcHabit"></canvas></div></div>
                <div class="glass-panel p-5"><h4 class="cx-h text-[#00e5ff]"><i data-lucide="timer" class="w-4 h-4"></i> Focus and skill minutes ${info('Focus timer minutes and skill practice minutes per day. Choosing a skill in the timer logs the block to both.')}</h4><div class="cx-chartbox"><canvas id="cxcFocus"></canvas></div></div>
                <div class="glass-panel p-5"><h4 class="cx-h text-[#fbbf24]"><i data-lucide="wallet" class="w-4 h-4"></i> Mood vs daily spending ${info('Your mood score (line, 1 to 5) against what you spent that day (bars, from the ledger). Useful for spotting comfort spending on low days.')}</h4><div class="cx-chartbox"><canvas id="cxcSpend"></canvas></div></div>
                <div class="glass-panel p-5"><h4 class="cx-h text-[#34d399]"><i data-lucide="radar" class="w-4 h-4"></i> Attribute radar ${info('Six attributes scored 0 to 100 from the last 14 days: Discipline (habits), Focus (timer minutes), Skill (practice minutes), Wisdom (journal and reading days), Vitality (fitness sessions) and Mood (check-ins).')}</h4><div class="cx-chartbox"><canvas id="cxcRadar"></canvas></div></div>
                <div class="glass-panel p-5"><h4 class="cx-h text-[#f97316]"><i data-lucide="pie-chart" class="w-4 h-4"></i> Where your EXP comes from ${info('Lifetime EXP by source. Habits 10 each, focus 1 per minute, skills 0.5 per minute, journal 15 per entry, tasks 8 each, fitness sessions 20 each, finished Library titles 25 each.')}</h4><div class="cx-chartbox"><canvas id="cxcXp"></canvas></div></div>
                <div class="glass-panel p-5"><h4 class="cx-h text-[#c084fc]"><i data-lucide="swords" class="w-4 h-4"></i> Skill time split ${info('Total practice time per skill in hours.')}</h4><div class="cx-chartbox"><canvas id="cxcSkill"></canvas></div></div>
                <div class="glass-panel p-5 md:col-span-2 xl:col-span-3"><h4 class="cx-h text-[#10b981]"><i data-lucide="grid-3x3" class="w-4 h-4"></i> Consistency map, last 5 weeks ${info('Each square is one day. Brighter means more of that day’s habits were done. A ring marks days you also trained.')}</h4><div id="cxHm" class="cx-hm" style="max-width:520px"></div></div>
            </div>
        </div>`);
        // info buttons on the panels added earlier
        const tips = [['#cxMoodRow', 'Tap how you feel. Mood, energy and focus combine into a readiness score that sets today’s mode, the focus block length, the journal prompt and how hard LEVEL//UP Fitness trains you.'],
            ['#cxTimerRing', 'A countdown for one focus block. Pick what you are working on: a skill gets the minutes added to its level, and finishing a block counts toward the daily quest and any focus habit.'],
            ['#cxJournalText', 'A short daily entry. The prompt changes with your mood mode. An entry ticks any journal habit and adds to Wisdom.'],
            ['#cxSkillList', 'Skills level up with practice time (level 2 at 2 hours, level 3 at 8 hours, level 4 at 18 hours). Time logged here ticks your skill-practice habit once you pass its minutes.']];
        tips.forEach(([sel, t]) => { const p = document.querySelector(sel); const h = p && p.closest('.glass-panel') && p.closest('.glass-panel').querySelector('.cx-h'); if (h && !h.querySelector('.info-icon')) h.insertAdjacentHTML('beforeend', info(t)); });
        const ring = $('cxTimerRing');
        if (ring && !$('cxFocusFor')) ring.insertAdjacentHTML('beforebegin', `<label class="cx-lbl self-start" style="width:100%;text-align:left">Working on<select id="cxFocusFor" class="cx-in w-full" style="margin-top:4px"></select></label>`);
    }

    function renderLinked() {
        injectLinked(); if (!$('cxStatus')) return;
        syncHabits(false);
        const p = progress(), col = RANK_COL[p.rank], q = quests(), st = monthStats(), md = window.CXGrowth.mode();
        const pctLv = Math.round((p.xp - p.cur) / (p.nxt - p.cur) * 100);
        $('cxStatusBody').innerHTML = `<div class="flex items-center gap-4 flex-wrap" style="margin-top:8px">${emblem(p.rank, 92)}
            <div class="flex-1" style="min-width:200px"><p class="text-[10px] font-black uppercase tracking-widest" style="color:#93c5fd">Player • ${p.rank}-Rank ${info('One level for the whole app. EXP comes from habits, focus time, skill practice, journal entries, completed tasks, fitness sessions and finished Library titles. Ranks: D at level 5, C at 10, B at 18, A at 28, S at 40.')}</p>
            <h3 class="cx-display" style="font-size:30px;font-weight:900;color:#fff;line-height:1.1">LEVEL ${p.level} <span style="font-size:14px;color:${col}">${['Unawakened', 'Awakened', 'Elite', 'Vanguard', 'Sovereign', 'Monarch'][['E', 'D', 'C', 'B', 'A', 'S'].indexOf(p.rank)]}</span></h3>
            <div class="cx-xp" style="margin-top:8px"><i style="width:${pctLv}%"></i></div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">${p.xp.toLocaleString('en-IN')} EXP • ${(p.nxt - p.xp).toLocaleString('en-IN')} to level ${p.level + 1}</p></div></div>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">${Object.entries(p.attr).map(([k, v]) => `<div class="cx-stat"><span>${k.slice(0, 3)}</span><b style="color:${v >= 70 ? '#34d399' : v >= 35 ? '#fff' : '#f87171'}">${v}</b></div>`).join('')}</div>`;

        const doneQ = q.filter(x => x.ok).length;
        $('cxQuests').innerHTML = q.map(x => `<div class="cx-quest ${x.ok ? 'ok' : ''}"><span>${x.ok ? '✓' : '▸'} ${x.t}</span><em>${x.v}</em></div>`).join('');
        $('cxQuestFoot').textContent = doneQ === q.length ? 'Quest complete. Rewards are already in your EXP.' : `${doneQ} of ${q.length} complete • unfinished lines carry no penalty here, but streaks do break`;

        let lib = null, wish = null; try { lib = mediaItems.find(m => m.mediaStatus === 'In Progress'); wish = wishlistItems.filter(w => !w.purchased).length; } catch (e) {}
        const due = J.tasks().filter(t => !t.done && t.due && t.due <= todayStr());
        const link = (colr, title, sub, act) => `<button class="cx-link" onclick="${act}"><i class="cx-dot" style="background:${colr};box-shadow:0 0 8px ${colr}"></i><span class="min-w-0"><b>${title}</b><small>${sub}</small></span></button>`;
        $('cxLinks').innerHTML =
            link(p.fit.trainedToday ? '#34d399' : '#f87171', 'LEVEL//UP Fitness', p.fit.exists ? `Level ${p.fit.level} • ${p.fit.sessions} sessions • ${p.fit.trainedToday ? 'trained today' : 'not trained today'} • plans scale to ${md.name} mode` : 'Not opened yet. Your mood here sets its training load.', "window.open('fitness/index.html','_blank')") +
            link(due.length ? '#fbbf24' : '#34d399', 'Planner', due.length ? `${due.length} task${due.length > 1 ? 's' : ''} due or overdue: ${esc(due[0].text.slice(0, 30))}` : 'Nothing due. Completed tasks earn EXP.', "switchMainView('planner')") +
            link(lib ? '#a855f7' : '#64748b', 'Library', lib ? `Ongoing: ${esc(lib.title.slice(0, 28))} (${lib.progress || 0}%). Progress on a book ticks your reading habit.` : 'Nothing in progress. Start a title to feed your reading habit.', "switchMainView('media')") +
            link(st.left >= 0 ? '#00e5ff' : '#f87171', 'Finance', `Safe to spend today ${inr(st.safe)} • ${wish || 0} wishlist item${wish === 1 ? '' : 's'} waiting`, "switchMainView('dashboard')") +
            link('#fbbf24', 'Workspace', `${(getJ('walletPages', { list: [] }).list || []).length} page(s) • ${getJ('keepNotes', []).length} memory card(s)`, "switchMainView('workspace')") +
            link(md.color, `Mood: ${md.name} mode`, `Readiness ${md.score.toFixed(1)}/10 drives focus length, journal prompt and fitness load`, "document.getElementById('cxMoodRow').scrollIntoView({behavior:'smooth',block:'center'})");

        const sel = $('cxFocusFor');
        if (sel) { const cur = sel.value; let tg = []; try { tg = growthItems || []; } catch (e) {} sel.innerHTML = `<option value="">General focus</option>` + J.skills().map(s => `<option value="s:${s.id}">Skill: ${esc(s.name)}</option>`).join('') + tg.map(t => `<option value="t:${esc(t.id)}">Target: ${esc(t.desc.slice(0, 40))}</option>`).join(''); sel.value = cur; if (sel.value !== cur) sel.value = ''; }

        // ---- charts ----
        const d14 = lastDays(14), lab = d14.map(d => d.getDate()), keys = d14.map(dk), hh = hist(), hs = habits(), fl = J.focus(), sl = J.skillLog(), ml = J.mood();
        chart('cxcHabit', { type: 'bar', data: { labels: lab, datasets: [{ label: '% of habits done', data: keys.map(k => hs.length ? Math.round((hh[k] || []).filter(id => hs.some(h => h.id === id)).length / hs.length * 100) : 0), backgroundColor: '#a855f7', borderRadius: 4 }] }, options: axis({ scales: { x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { min: 0, max: 100, ticks: { color: '#64748b', stepSize: 50, callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,.05)' } } } }) });
        chart('cxcFocus', { type: 'bar', data: { labels: lab, datasets: [{ label: 'Focus min', data: keys.map(k => fl[k] || 0), backgroundColor: '#00e5ff', borderRadius: 4 }, { label: 'Skill min', data: keys.map(k => sl[k] || 0), backgroundColor: '#fbbf24', borderRadius: 4 }] }, options: axis() });
        const spend = keys.map(k => { let s = 0; transactions.forEach(t => { if (t.type === 'expense' && t.account !== 'Emergency' && dk(new Date(t.timestamp)) === k) s += t.amount; }); return Math.round(s); });
        chart('cxcSpend', { data: { labels: lab, datasets: [{ type: 'bar', label: 'Spent ₹', data: spend, backgroundColor: 'rgba(251,191,36,.55)', borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Mood', data: keys.map(k => ml[k] && ml[k].mood ? ml[k].mood : null), borderColor: '#34d399', backgroundColor: '#34d399', tension: .35, spanGaps: true, pointRadius: 3, yAxisID: 'm' }] },
            options: axis({ scales: { x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#64748b', maxTicksLimit: 4 }, grid: { color: 'rgba(255,255,255,.05)' } }, m: { position: 'right', min: 1, max: 5, ticks: { color: '#34d399', stepSize: 2 }, grid: { display: false } } } }) });
        chart('cxcRadar', { type: 'radar', data: { labels: Object.keys(p.attr), datasets: [{ data: Object.values(p.attr), backgroundColor: 'rgba(52,211,153,.18)', borderColor: '#34d399', borderWidth: 2, pointBackgroundColor: '#34d399' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100, ticks: { display: false, stepSize: 25 }, grid: { color: 'rgba(255,255,255,.1)' }, angleLines: { color: 'rgba(255,255,255,.1)' }, pointLabels: { color: '#cbd5e1', font: { size: 10 } } } } } });
        const srcK = Object.keys(p.src).filter(k => p.src[k] > 0);
        chart('cxcXp', { type: 'doughnut', data: { labels: srcK.length ? srcK : ['No EXP yet'], datasets: [{ data: srcK.length ? srcK.map(k => p.src[k]) : [1], backgroundColor: srcK.length ? ['#a855f7', '#00e5ff', '#fbbf24', '#c084fc', '#34d399', '#f87171', '#f97316'].slice(0, srcK.length) : ['rgba(255,255,255,.06)'], borderColor: '#040910', borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 10 } } } } } });
        const sk = J.skills();
        chart('cxcSkill', { type: 'bar', data: { labels: sk.length ? sk.map(s => s.name.slice(0, 14)) : ['No skills yet'], datasets: [{ label: 'Hours', data: sk.length ? sk.map(s => +(s.minutes / 60).toFixed(1)) : [0], backgroundColor: '#c084fc', borderRadius: 4 }] }, options: axis({ indexAxis: 'y', plugins: { legend: { display: false } } }) });
        const hm = $('cxHm');
        if (hm) hm.innerHTML = lastDays(35).map(d => { const k = dk(d), r = hs.length ? (hh[k] || []).filter(id => hs.some(h => h.id === id)).length / hs.length : 0, tr = p.fit.trained.includes(k); return `<i title="${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}: ${Math.round(r * 100)}% habits${tr ? ', trained' : ''}" style="background:rgba(16,185,129,${(0.05 + r * 0.85).toFixed(2)});color:${r > .55 ? '#000' : '#94a3b8'};${tr ? 'box-shadow:0 0 0 2px #00e5ff' : ''}">${d.getDate()}</i>`; }).join('');

        const last = Number(localStorage.getItem('walletGrowthLevel') || 0);
        if (last && p.level > last) levelUp(p);
        localStorage.setItem('walletGrowthLevel', p.level);
        decorateHabits(); icons();
    }

    function levelUp(p) {
        if ($('cxLevelUp')) return;
        document.body.insertAdjacentHTML('beforeend', `<div id="cxLevelUp" onclick="this.remove()"><div class="cx-sys" data-sys="SYSTEM">${emblem(p.rank, 110)}<p class="text-[11px] font-black uppercase tracking-widest mt-3" style="color:#93c5fd">You have levelled up</p><h3 class="cx-display" style="font-size:44px;font-weight:900;color:#fff;text-shadow:0 0 24px #60a5fa">LEVEL ${p.level}</h3><p class="text-xs font-bold text-gray-300">${p.rank}-Rank • ${p.xp.toLocaleString('en-IN')} EXP</p><button class="cx-btn mt-4">Continue</button></div></div>`);
        setTimeout(() => { const e = $('cxLevelUp'); if (e) e.remove(); }, 6000);
    }

    // ---- hunter strip on the dashboard --------------------------------------------
    function renderStrip() {
        const gone = $('cxStrip'); if (gone) gone.remove(); return;          // hunter strip retired from the dashboard; the status window lives on the Growth tab
        const dash = $('viewDashboard'); if (!dash) return;
        if (!$('cxStrip')) dash.insertAdjacentHTML('afterbegin', `<div id="cxStrip" class="cx-sys" data-sys="HUNTER STATUS"></div>`);
        const p = progress(), q = quests(), done = q.filter(x => x.ok).length, md = window.CXGrowth ? window.CXGrowth.mode() : null, el = $('cxStrip');
        const bg = el.dataset.bg ? `background-image:linear-gradient(90deg, rgba(3,7,18,.94) 35%, rgba(3,7,18,.55)), url('${el.dataset.bg}');background-size:cover;background-position:center right;` : '';
        if (bg) el.style.cssText = bg;
        el.innerHTML = `<div class="flex items-center gap-4 flex-wrap" style="margin-top:6px">${emblem(p.rank, 64)}
            <div style="min-width:170px;flex:1"><p class="text-[10px] font-black uppercase tracking-widest" style="color:#93c5fd">${p.rank}-Rank • Level ${p.level} ${info('Your overall level across finance habits, growth, planner, library and fitness. Open the Growth tab for the full status window and telemetry.')}</p><div class="cx-xp" style="margin-top:6px"><i style="width:${Math.round((p.xp - p.cur) / (p.nxt - p.cur) * 100)}%"></i></div><p class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">${(p.nxt - p.xp).toLocaleString('en-IN')} EXP to next level</p></div>
            <div class="cx-stat" style="min-width:104px"><span>Daily quest</span><b style="color:${done === q.length ? '#34d399' : '#fff'}">${done}/${q.length}</b></div>
            <div class="cx-stat" style="min-width:104px"><span>Fitness</span><b>${p.fit.exists ? 'LV ' + p.fit.level : '—'}</b></div>
            <div class="cx-stat" style="min-width:104px"><span>Mode</span><b style="color:${md ? md.color : '#94a3b8'};font-size:16px">${md ? md.name : '—'}</b></div>
            <div class="flex gap-2 flex-wrap"><button class="cx-btn sm" onclick="switchMainView('growth')">Status window</button><button class="cx-btn violet sm" onclick="window.open('fitness/index.html','_blank')">Enter dungeon</button></div></div>`;
        icons();
    }

    // ---- link events ---------------------------------------------------------------
    on('focus', min => {
        const v = ($('cxFocusFor') || {}).value || '';
        if (v.startsWith('s:')) { const id = Number(v.slice(2)), s = J.skills(), x = s.find(i => i.id === id); if (x) { x.minutes += min; setJ('walletSkills', s); const l = J.skillLog(); l[todayStr()] = (l[todayStr()] || 0) + min; setJ('walletSkillLog', l); toast(`${min} minutes also logged to ${x.name}.`); } }
        syncHabits(false);
    });
    on('skill', d => { const l = J.skillLog(); l[todayStr()] = (l[todayStr()] || 0) + (d.min || 0); setJ('walletSkillLog', l); syncHabits(false); });
    on('journal', () => syncHabits(false));
    on('media', m => { if (m && m.wishCategory === 'Book') { const r = J.read(); r[todayStr()] = 1; setJ('walletReadLog', r); syncHabits(false); } try { if ($('cxStatus')) renderLinked(); } catch (e) {} });
    on('task', () => { try { renderStrip(); } catch (e) {} });
    on('growth', () => { try { renderLinked(); renderStrip(); } catch (e) { console.warn('linked growth render', e); } });
    window.addEventListener('storage', e => { if (e.key === 'levelup_home_v7' || e.key === 'walletHabitHistory') { try { habitHistory = getJ('walletHabitHistory', {}); renderHabits(); renderHabitHistory(); } catch (er) {} try { window.CXGrowth.render(); } catch (er) {} } });
    window.addEventListener('focus', () => { try { habitHistory = getJ('walletHabitHistory', habitHistory); syncHabits(false); renderStrip(); if ($('viewGrowth').classList.contains('active')) window.CXGrowth.render(); } catch (e) {} });

    // ---- info buttons on the other expansion panels ---------------------------------
    function moreInfo() {
        const set = (sel, t) => { const n = document.querySelector(sel); const h = n && (n.closest('.glass-panel') || n.parentElement).querySelector('.cx-h'); if (h && !h.querySelector('.info-icon')) { h.insertAdjacentHTML('beforeend', info(t)); } };
        set('#cxAllocChart', 'How your portfolio is split by asset type, using the current values you entered.');
        set('#cxPfList', 'Add each investment with what you put in and what it is worth now. Press Update when the value changes; nothing is fetched from the market while offline.');
        set('#cxGlList', 'A goal shows the monthly SIP needed to reach the target in the given years at the expected return, after counting what you have already saved.');
        set('#cxCalcOut', 'Quick what-if calculators. Change any number and the result updates.');
        set('#cxTaskList', 'Tasks with a due date appear on the calendar and in the daily quest. Completing tasks earns EXP. You can also type "task: …" to C.A.S.P.E.R.');
        set('#cxCal', 'Click a day to pre-fill the due date for a new task.');
        set('#cxBills', 'Built from ledger entries marked as recurring, projected to their next date.');
        set('#upgHeatmap', 'Daily spending intensity. Hover or tap a day for the breakdown. Floating tags mark the three heaviest days.');
    }

    function particles() { if ($('cxParticles')) return; const p = document.createElement('div'); p.id = 'cxParticles'; p.innerHTML = [...Array(16)].map((_, i) => `<i style="left:${(i * 6.3 + 3) % 100}%;animation-duration:${9 + (i * 7) % 11}s;animation-delay:${(i * 1.3) % 9}s;${i % 3 === 0 ? 'background:#a855f7;box-shadow:0 0 8px #a855f7' : ''}"></i>`).join(''); document.body.prepend(p); }
    function probeArt() { const im = new Image(); im.onload = () => { const s = $('cxStrip'); if (s) { s.dataset.bg = 'assets/hunter.jpg'; renderStrip(); } }; im.src = 'assets/hunter.jpg'; }   // optional: drop your own picture here

    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion 3 boot step failed', e); } };
        safe(renameVault); safe(particles);
        safe(() => { const cw = $('cxCapture_m'); if (cw) cw.innerHTML = cw.innerHTML.replace(/Send to Vault/g, 'Send to Library'); });
        setTimeout(() => { safe(() => window.initWhiteboard()); }, 400);
        setTimeout(() => { safe(() => window.CXGrowth.render()); safe(renderStrip); safe(moreInfo); safe(probeArt); safe(decorateHabits); icons(); }, 900);
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 4
// C.A.S.P.E.R. front-page briefing, smart SMS reader (single / bulk / automatic),
// offline bill scanner, animated background, motion, own-picture slots,
// text-case clean-up, phone layout and installable-app support.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, todayStr, toast } = window.CX;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPhone = () => window.innerWidth < 640;

    // ==========================================================================
    // 0. STYLE: case consistency, motion, phone layout
    // ==========================================================================
    const css = document.createElement('style');
    css.textContent = `
    /* one voice for labels: every tile caption, value and helper line is upper-case like the rest of the HUD */
    .cx-tile b, .cx-tile small, .cx-tile small a, .cx-link small, .cx-banner p, #cxDocStats, .cx-quest, .cx-empty { text-transform: uppercase; letter-spacing: .06em; }
    .cx-tile small { font-size: 10.5px; } .cx-banner p { font-size: 11.5px; }
    .cx-in::placeholder { text-transform: none; letter-spacing: normal; }

    #cxBg { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; }
    #cxWall { position: fixed; inset: 0; z-index: -2; background-size: cover; background-position: center; opacity: .22; pointer-events: none; }

    /* motion */
    .cx-rv { opacity: 0; transform: translateY(18px); transition: opacity .55s ease, transform .55s cubic-bezier(.2,.8,.2,1); }
    .cx-rv.cx-on { opacity: 1; transform: none; }
    .glass-panel { transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease; }
    @media (hover: hover) { .cx-tile { transition: transform .2s ease, border-color .2s ease; } .cx-tile:hover { transform: translateY(-2px); border-color: rgba(0,229,255,.4); } }
    .cx-btn, .nav-btn { position: relative; overflow: hidden; }
    .cx-rip { position: absolute; border-radius: 50%; background: rgba(255,255,255,.35); transform: scale(0); animation: cxRip .55s ease-out; pointer-events: none; }
    @keyframes cxRip { to { transform: scale(2.6); opacity: 0; } }
    .nav-btn.active { animation: cxNav .35s ease; } @keyframes cxNav { from { transform: scale(.94); } to { transform: scale(1); } }
    .ledger-item { animation: cxRow .35s ease both; } @keyframes cxRow { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }

    /* front-page briefing */
    #cxIntro { position: relative; overflow: hidden; padding: 22px 24px; border-color: rgba(0,229,255,.45) !important; }
    #cxIntro .art { position: absolute; inset: 0; background-size: cover; background-position: center right; opacity: .28; -webkit-mask-image: linear-gradient(90deg, transparent 20%, #000 80%); mask-image: linear-gradient(90deg, transparent 20%, #000 80%); pointer-events: none; }
    #cxIntro .wrap { position: relative; display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
    #cxCore { width: 150px; height: 150px; flex: none; color: #00e5ff; filter: drop-shadow(0 0 14px rgba(0,229,255,.6)); }
    #cxCore .r1 { transform-origin: 100px 100px; animation: cxSpin 16s linear infinite; } #cxCore .r2 { transform-origin: 100px 100px; animation: cxSpin 10s linear infinite reverse; } #cxCore .r3 { transform-origin: 100px 100px; animation: cxSpin 26s linear infinite; }
    #cxCore .beat { transform-origin: 100px 100px; animation: cxBeat 2.2s ease-in-out infinite; } @keyframes cxBeat { 0%,100% { transform: scale(.9); opacity: .55; } 50% { transform: scale(1.08); opacity: 1; } }
    .cx-acro { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; margin: 12px 0; }
    .cx-acro div { background: rgba(0,0,0,.5); border: 1px solid rgba(0,229,255,.25); border-radius: 12px; padding: 8px 6px; text-align: center; animation: cxLetter .6s ease both; }
    .cx-acro div:nth-child(2) { animation-delay: .08s; } .cx-acro div:nth-child(3) { animation-delay: .16s; } .cx-acro div:nth-child(4) { animation-delay: .24s; } .cx-acro div:nth-child(5) { animation-delay: .32s; } .cx-acro div:nth-child(6) { animation-delay: .4s; }
    @keyframes cxLetter { from { opacity: 0; transform: translateY(10px) scale(.9); } to { opacity: 1; transform: none; } }
    .cx-acro b { display: block; font: 900 26px 'Exo 2', sans-serif; color: #00e5ff; text-shadow: 0 0 12px rgba(0,229,255,.7); line-height: 1; }
    .cx-acro span { display: block; font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #cbd5e1; margin-top: 4px; overflow-wrap: anywhere; }
    .cx-caps { display: flex; flex-wrap: wrap; gap: 6px; }

    /* dialogs */
    .cx-modal { position: fixed; inset: 0; z-index: 2147483000; background: rgba(2,6,14,.9); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 14px; animation: cxIn .25s ease; }
    .cx-modal > div { width: min(560px, 100%); max-height: 92vh; overflow-y: auto; background: linear-gradient(160deg, rgba(6,14,26,.98), rgba(3,7,14,.98)); border: 1px solid #00e5ff; border-radius: 18px; padding: 20px; box-shadow: 0 0 40px rgba(0,229,255,.25); }
    .cx-modal h3 { font: 800 16px 'Exo 2', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #00e5ff; display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .cx-modal p, .cx-modal li { font-size: 13px; color: #cbd5e1; line-height: 1.55; } .cx-modal ol { padding-left: 20px; list-style: decimal; } .cx-modal li { margin-bottom: 6px; }
    .cx-modal code { display: block; background: #000; border: 1px solid rgba(0,229,255,.3); border-radius: 8px; padding: 8px 10px; font-size: 12px; color: #7dd3fc; word-break: break-all; margin: 6px 0; }
    .cx-prog { height: 8px; border-radius: 6px; background: rgba(0,0,0,.6); border: 1px solid rgba(0,229,255,.3); overflow: hidden; } .cx-prog i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #0284c7, #00e5ff); transition: width .3s; }
    #cxEntryRow { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 8px; }
    #cxEntryRow button { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 6px; }
    #cxFeed .cx-row { padding: 7px 10px; font-size: 12px; }

    /* phones */
    @media (max-width: 640px) {
        body { padding: 8px !important; font-size: 14px; }
        .glass-panel { border-radius: 14px; } .cx-banner { padding: 12px 14px; gap: 10px; } .cx-banner h3 { font-size: 15px; } .cx-banner .cx-hud { width: 46px !important; height: 46px !important; }
        .nav-btn { flex: none !important; padding: 9px 12px !important; font-size: 12px !important; }
        h2.bubbly-text { font-size: 22px !important; letter-spacing: .04em !important; }
        .cx-tile { padding: 10px; } .cx-tile b { font-size: 16px; white-space: normal; }
        #cxIntro { padding: 16px; } #cxCore { width: 92px; height: 92px; margin: 0 auto; } .cx-acro { grid-template-columns: repeat(3, minmax(0, 1fr)); } .cx-acro b { font-size: 22px; }
        .cx-wb-stage { height: clamp(300px, 52vh, 460px) !important; }
        #cxWbBar .sw { width: 26px; height: 26px; }
        .cx-sys { padding: 16px 14px; } .cx-chartbox { height: 190px; }
        #cxPages .cx-in { max-width: 150px; }
        .cx-row { flex-wrap: wrap; } .cx-steps button { font-size: 9px; }
        .cx-btn { padding: 9px 11px; } .cx-btn.sm { padding: 7px 9px; }
        #casperChatWindow { left: 8px !important; right: 8px !important; width: auto !important; max-width: none !important; }
        input, select, textarea { font-size: 16px !important; }            /* stops iOS from zooming the page on focus */
    }
    @media (prefers-reduced-motion: reduce) { .cx-rv { opacity: 1; transform: none; transition: none; } .cx-acro div, .ledger-item, .nav-btn.active { animation: none; } #cxCore * { animation: none !important; } }
    `;
    document.head.appendChild(css);

    function modal(id, title, body) {
        const old = $(id); if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', `<div class="cx-modal" id="${id}"><div><h3><span>${title}</span><button class="cx-btn red sm" onclick="document.getElementById('${id}').remove()">Close</button></h3>${body}</div></div>`);
        $(id).addEventListener('click', e => { if (e.target.id === id) $(id).remove(); });
        icons(); return $(id);
    }

    // ==========================================================================
    // 1. ANIMATED BACKGROUND (drawn live, no downloads)
    // ==========================================================================
    function background() {
        if ($('cxBg')) return;
        const c = document.createElement('canvas'); c.id = 'cxBg'; document.body.prepend(c);
        const x = c.getContext('2d'); let W, H, nodes = [], raf = null, t = 0;
        const size = () => { const d = Math.min(window.devicePixelRatio || 1, 1.5); W = window.innerWidth; H = window.innerHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0); const n = Math.min(isPhone() ? 26 : 64, Math.round(W * H / 26000)); nodes = [...Array(n)].map(() => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 })); };
        const arc = (cx, cy, r, a0, len, w, al) => { x.beginPath(); x.arc(cx, cy, r, a0, a0 + len); x.strokeStyle = `rgba(0,229,255,${al})`; x.lineWidth = w; x.stroke(); };
        const frame = () => {
            t += 0.004; x.clearRect(0, 0, W, H);
            // two slow HUD dials in opposite corners
            const R = Math.min(W, H) * .42;
            arc(W + R * .15, -R * .1, R, t, 1.4, 2, .10); arc(W + R * .15, -R * .1, R * .82, -t * 1.6, 2.2, 1, .08); arc(W + R * .15, -R * .1, R * .64, t * .7 + 2, .9, 6, .05);
            arc(-R * .2, H + R * .15, R, -t + 1, 1.8, 2, .09); arc(-R * .2, H + R * .15, R * .78, t * 1.3, 1.2, 1, .08);
            for (const n of nodes) { n.x += n.vx; n.y += n.vy; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1; }
            for (let i = 0; i < nodes.length; i++) {
                const a = nodes[i]; x.beginPath(); x.arc(a.x, a.y, a.r, 0, 6.283); x.fillStyle = 'rgba(0,229,255,.55)'; x.fill();
                for (let j = i + 1; j < nodes.length; j++) { const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy; if (d2 < 17000) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.strokeStyle = `rgba(0,229,255,${(.16 * (1 - d2 / 17000)).toFixed(3)})`; x.lineWidth = 1; x.stroke(); } }
            }
            if (!reduce) raf = requestAnimationFrame(frame);
        };
        size(); frame();
        let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) frame(); }, 200); });
        document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = null; } else if (!raf && !reduce) raf = requestAnimationFrame(frame); });
    }

    // ==========================================================================
    // 2. FRONT-PAGE BRIEFING: what C.A.S.P.E.R. is
    // ==========================================================================
    const CORE = `<svg id="cxCore" viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true">
        <g class="r1"><circle cx="100" cy="100" r="92" stroke-width="1.5" stroke-dasharray="70 22 8 22" opacity=".8"/><circle cx="100" cy="8" r="4" fill="currentColor" stroke="none"/></g>
        <g class="r2"><circle cx="100" cy="100" r="76" stroke-width="5" stroke-dasharray="90 60 30 60" stroke-linecap="round" opacity=".55"/></g>
        <g class="r3"><polygon points="100,38 154,69 154,131 100,162 46,131 46,69" stroke-width="1.5" opacity=".7"/><circle cx="154" cy="69" r="3" fill="currentColor" stroke="none"/><circle cx="46" cy="131" r="3" fill="currentColor" stroke="none"/></g>
        <g class="beat"><circle cx="100" cy="100" r="34" fill="rgba(0,229,255,.12)" stroke-width="2"/><path d="M76 100 h12 l5 -14 8 28 6 -20 4 6 h13" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
    const ACRO = [['C', 'Calculated'], ['A', 'Asset'], ['S', 'Security and'], ['P', 'Personal'], ['E', 'Expense'], ['R', 'Recorder']];

    function intro() {
        const dash = $('viewDashboard'); if (!dash) return;
        const s = $('cxStrip'); if (s) s.remove();
        const hidden = getJ('walletIntroHidden', false), art = getJ('walletArt', {});
        let el = $('cxIntro'); if (!el) { dash.insertAdjacentHTML('afterbegin', '<div id="cxIntro" class="glass-panel"></div>'); el = $('cxIntro'); }
        if (hidden) { el.style.padding = '10px 16px'; el.innerHTML = `<div class="flex items-center justify-between gap-3 flex-wrap"><span class="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]">C.A.S.P.E.R. • Calculated Asset Security and Personal Expense Recorder</span><button class="cx-btn sm" onclick="CXFront.toggle()">About C.A.S.P.E.R.</button></div>`; return; }
        el.style.padding = '';
        el.innerHTML = `${art.banner ? `<div class="art" style="background-image:url('${art.banner}')"></div>` : ''}<div class="wrap">${CORE}
            <div style="flex:1;min-width:240px">
                <p class="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]">Your financial command intelligence</p>
                <h2 class="cx-display" style="font-size:clamp(26px,4.5vw,40px);font-weight:900;color:#fff;letter-spacing:.14em;text-shadow:0 0 18px rgba(0,229,255,.5);line-height:1.1">C.A.S.P.E.R.</h2>
                <div class="cx-acro">${ACRO.map(a => `<div><b>${a[0]}</b><span>${a[1]}</span></div>`).join('')}</div>
                <p class="text-xs text-gray-300 font-semibold" style="max-width:720px;line-height:1.6">C.A.S.P.E.R. is the engine behind Wally MK 3. It records every rupee that comes in or goes out, guards your budget and emergency fund, and turns the numbers into plain answers. It reads bank messages and bills for you, forecasts the month, tracks what you are saving for, and links your money to your habits, plans and training so the whole system moves together.</p>
                <div class="cx-caps mt-3">
                    <button class="cx-btn sm" onclick="CXSms.single()">Read a bank SMS</button>
                    <button class="cx-btn sm" onclick="CXBill.pick(true)">Scan a bill</button>
                    <button class="cx-btn sm" onclick="toggleCasper()">Ask C.A.S.P.E.R.</button>
                    <button class="cx-btn violet sm" onclick="CXFront.art()">Pictures</button>
                    <button class="cx-btn sm" style="opacity:.7" onclick="CXFront.toggle()">Hide briefing</button>
                </div>
            </div></div>`;
    }
    function applyWall() { const a = getJ('walletArt', {}); let w = $('cxWall'); if (a.wall) { if (!w) { w = document.createElement('div'); w.id = 'cxWall'; document.body.prepend(w); } w.style.backgroundImage = `url('${a.wall}')`; } else if (w) w.remove(); }
    function readPicture(file, max) {
        return new Promise((res, rej) => {
            if (!file || !/^image\//.test(file.type)) return rej(new Error('Not an image'));
            const fr = new FileReader();
            fr.onerror = () => rej(new Error('read failed'));
            fr.onload = () => {
                if (file.type === 'image/gif' && file.size < 1500000) return res(fr.result);            // keep small GIFs animated
                const im = new Image(); im.onerror = () => rej(new Error('decode failed'));
                im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); res(cv.toDataURL('image/jpeg', .82)); };
                im.src = fr.result;
            };
            fr.readAsDataURL(file);
        });
    }
    window.CXFront = {
        toggle() { setJ('walletIntroHidden', !getJ('walletIntroHidden', false)); intro(); icons(); },
        art() {
            const a = getJ('walletArt', {});
            modal('cxArtModal', 'Your pictures', `<p>Add your own artwork or GIFs. They are stored only in this browser. Large images are shrunk automatically; GIFs under 1.5 MB stay animated.</p>
                ${[['banner', 'Front-page banner', 'Shown behind the C.A.S.P.E.R. briefing.'], ['wall', 'Page wallpaper', 'A dim picture behind the whole app.']].map(k => `<div class="cx-row" style="margin-top:10px"><div class="flex-1 min-w-0"><b class="text-sm text-white">${k[1]}</b><p style="font-size:12px;color:#94a3b8">${k[2]} ${a[k[0]] ? '<span style="color:#34d399">Set.</span>' : ''}</p></div>
                <button class="cx-btn sm" onclick="document.getElementById('cxArt_${k[0]}').click()">Choose</button>${a[k[0]] ? `<button class="cx-btn red sm" onclick="CXFront.clear('${k[0]}')">Remove</button>` : ''}<input type="file" id="cxArt_${k[0]}" accept="image/*" style="display:none" onchange="CXFront.set('${k[0]}', this.files[0])"></div>`).join('')}`);
        },
        async set(key, file) { try { const d = await readPicture(file, key === 'wall' ? 1600 : 1200); const a = getJ('walletArt', {}); a[key] = d; localStorage.setItem('walletArt', JSON.stringify(a)); intro(); applyWall(); icons(); this.art(); toast('Picture saved.'); } catch (e) { toast(/quota/i.test(String(e)) ? 'That picture is too large to store. Try a smaller one.' : 'Could not use that picture.', true); } },
        clear(key) { const a = getJ('walletArt', {}); delete a[key]; setJ('walletArt', a); intro(); applyWall(); icons(); this.art(); }
    };

    // ==========================================================================
    // 3. SMART SMS READER — single message, bulk paste, and automatic capture
    // ==========================================================================
    const IN_RE = /\b(credited|received|deposited|refund(?:ed)?|cashback|reversed|added to|salary)\b/i;
    const OUT_RE = /\b(debited|spent|paid|sent|withdrawn|purchase(?:d)?|deducted|charged|payment of|txn of|transaction of|transferred|used for|used at)\b/i;
    const AMT_RE = /(?:rs\.?|inr|₹)\s*(\d[\d,]*(?:\.\d{1,2})?)|(\d[\d,]*(?:\.\d{1,2})?)\s*(?:rs\.?|inr|rupees)\b/gi;
    const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); };
    const title = s => s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());

    function parseSMS(raw) {
        const t = String(raw || '').replace(/\s+/g, ' ').trim(), l = t.toLowerCase();
        if (t.length < 12) return { skip: 'too short' };
        if (/\botp\b|one[- ]time password|verification code|do not share/.test(l) && !/(debited|credited)/.test(l)) return { skip: 'OTP or security message' };
        if (/will be (debited|credited|deducted)|is due|due on|due by|due date|has requested|requested money|pre-?approved|offer|congratulations|win |apply now|statement is ready|bill generated/.test(l)) return { skip: 'reminder or promotion, not a completed transaction' };
        const mi = l.search(IN_RE), mo = l.search(OUT_RE);
        if (mi < 0 && mo < 0) return { skip: 'no debit or credit wording found' };
        const type = (mo >= 0 && (mi < 0 || mo < mi)) ? 'expense' : 'income';
        // amount: skip figures that are balances or limits
        let amount = 0, m; AMT_RE.lastIndex = 0;
        while ((m = AMT_RE.exec(t))) { const before = l.slice(Math.max(0, m.index - 28), m.index); if (/(avl|avail|available|bal|balance|limit|outstanding|total due|min due|minimum)[^a-z]{0,6}(is|:|of|-)?\s*$/.test(before) || /(bal|balance|limit)\W*$/.test(before)) continue; const v = parseFloat((m[1] || m[2]).replace(/,/g, '')); if (v > 0) { amount = v; break; } }
        if (!amount) return { skip: 'no transaction amount found' };
        // date
        let ts = Date.now(), d = t.match(/\b(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})\b/), d2 = t.match(/\b(\d{1,2})[- ]?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[- ,]*(\d{2,4})?\b/i);
        const mk = (y, mth, day) => { y = Number(y); if (y < 100) y += 2000; const dt = new Date(y, mth, Number(day), 12); return (!isNaN(dt) && dt.getTime() <= Date.now() + 86400000 && dt.getFullYear() > 2015) ? dt.getTime() : null; };
        if (d2) ts = mk(d2[3] || new Date().getFullYear(), MON[d2[2].toLowerCase()], d2[1]) || ts;
        else if (d && Number(d[2]) <= 12) ts = mk(d[3], Number(d[2]) - 1, d[1]) || ts;
        if (new Date(ts).toDateString() === new Date().toDateString()) ts = Date.now();
        // counterparty
        const stop = '(?=\\s+(?:on|ref|upi|via|using|thru|through|from|avl|avail|bal|not you|if not|dated|at \\d|for upi)\\b|\\s*[.,;(]|\\s+-|$)';
        const pats = type === 'expense'
            ? [new RegExp('\\b(?:to|towards)\\s+(?:vpa\\s+|a\\/c\\s+)?([A-Za-z][A-Za-z0-9@._&\\- ]{1,40}?)' + stop, 'i'), new RegExp('\\bat\\s+([A-Za-z][A-Za-z0-9@._&\\- ]{1,40}?)' + stop, 'i'), new RegExp('\\bfor\\s+([A-Za-z][A-Za-z0-9@._&\\- ]{2,40}?)' + stop, 'i'), /info[:\s-]+([A-Za-z0-9@._&\/\- ]{3,40})/i]
            : [new RegExp('\\bfrom\\s+(?:vpa\\s+)?([A-Za-z][A-Za-z0-9@._&\\- ]{1,40}?)' + stop, 'i'), new RegExp('\\bby\\s+(?!neft|imps|rtgs|upi|cash|cheque|transfer)([A-Za-z][A-Za-z0-9@._&\\- ]{1,40}?)' + stop, 'i'), /info[:\s-]+([A-Za-z0-9@._&\/\- ]{3,40})/i];
        let who = '';
        for (const p of pats) { const k = t.match(p); if (k && !/^(a\/c|ac|acct|account|your|card|bank|upi|inr|rs)\b/i.test(k[1].trim()) && !/^[x*\d ]+$/i.test(k[1].trim())) { who = k[1].trim(); break; } }
        if (who.includes('@')) who = who.split('@')[0].replace(/[._-]+/g, ' ');
        who = who.replace(/\b(pvt|ltd|limited|private|india|payments?)\b/gi, '').replace(/\s+/g, ' ').trim();
        if (/\batm\b|cash withdraw/.test(l)) who = 'ATM cash withdrawal';
        who = who.replace(/\s+salary$/i, '');
        const account = /credit card|\bcc\b/.test(l) ? 'Credit Card' : /debit card|\batm\b|\bpos\b/.test(l) ? 'Debit Card' : 'UPI';
        const ref = (t.match(/\b(?:ref(?:erence)?(?:\s*no)?|utr|rrn|txn(?:\s*id)?|upi\s*ref(?:\s*no)?)[\s:.#-]*([A-Za-z0-9]{6,})/i) || [])[1] || '';
        let category = 'Other';
        if (type === 'expense') { const g = window.guessCategory ? window.guessCategory(who + ' ' + t) : null; if (g && EXPENSE_CATEGORIES.includes(g)) category = g; }
        else category = /salary|payroll/.test(l) ? 'Salary' : /refund|reversed/.test(l) ? 'Refund' : /cashback/.test(l) ? 'Cashback' : 'Other';
        if (!INCOME_CATEGORIES.includes(category) && type === 'income') category = 'Other';
        return { type, amount, ts, note: who ? title(who).slice(0, 60) : t.slice(0, 60), account, category, ref, raw: t, key: ref ? 'r:' + ref : 'h:' + hash(l.replace(/\d{1,2}:\d{2}(:\d{2})?/g, '')) };
    }
    function splitSMS(text) {
        const blocks = String(text || '').split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean), out = [];
        blocks.forEach(b => { const lines = b.split('\n').map(x => x.trim()).filter(Boolean); const each = lines.filter(x => (IN_RE.test(x) || OUT_RE.test(x)) && /(?:rs\.?|inr|₹)\s*[\d,]/i.test(x)).length; if (lines.length > 1 && each >= 2) out.push(...lines); else out.push(lines.join(' ')); });
        return out;
    }
    const seen = () => getJ('walletSmsSeen', []);
    function isDup(p) { return seen().includes(p.key) || transactions.some(tx => tx.type === p.type && Math.abs(tx.amount - p.amount) < 0.01 && Math.abs(tx.timestamp - p.ts) < 180000 && (tx.note || '') === p.note); }
    function addEntry(p, source) {
        const tx = { id: String(Date.now() + Math.floor(Math.random() * 10000)), type: p.type, amount: p.amount, account: p.account || 'UPI', category: p.category || 'Other', note: p.note || '', timestamp: p.ts || Date.now(), isRecurring: false, source };
        transactions.push(tx); saveTransactionsLocally();
        if (p.key) { const s = seen(); s.push(p.key); setJ('walletSmsSeen', s.slice(-400)); }
        const log = getJ('walletCaptureLog', []); log.unshift({ at: Date.now(), id: tx.id, type: tx.type, amount: tx.amount, note: tx.note, source }); setJ('walletCaptureLog', log.slice(0, 40));
        try { fetch(`${API_BASE}/add-transaction`, { method: 'POST', headers: apiHeaders, body: JSON.stringify(tx) }).catch(() => {}); } catch (e) {}
        return tx;
    }
    function ingest(text, source) {
        const r = { added: [], dup: 0, skipped: [] };
        splitSMS(text).forEach(msg => { const p = parseSMS(msg); if (p.skip) return r.skipped.push(p.skip); if (isDup(p)) return r.dup++; r.added.push(addEntry(p, source)); });
        if (r.added.length) { try { updateUI(); } catch (e) {} feed(); }
        return r;
    }
    function feed() {
        const el = $('cxFeed'); if (!el) return; const log = getJ('walletCaptureLog', []).filter(l => transactions.some(t => t.id === l.id)).slice(0, 4);
        el.innerHTML = log.length ? `<p class="cx-lbl" style="margin:8px 0 6px">Recently captured</p>` + log.map(l => `<div class="cx-row" style="margin-bottom:5px"><span style="color:${l.type === 'income' ? '#34d399' : '#f87171'};font-weight:900">${l.type === 'income' ? '+' : '−'}${inr(l.amount)}</span><span class="flex-1 min-w-0 truncate text-gray-300">${esc(l.note)} <span class="text-gray-500">• ${esc(l.source)}</span></span><button class="cx-btn red sm" onclick="CXSms.undo('${esc(l.id)}')">Undo</button></div>`).join('') : '';
    }
    const ingestUrl = () => location.origin + location.pathname + '#sms=';

    window.CXSms = {
        parse: parseSMS, ingest,
        single(pref) {
            modal('cxSmsModal', 'Read a bank SMS', `<p>Paste one message. C.A.S.P.E.R. works out whether it is money in or out, the amount, who it was with, the date and a category, and ignores the balance figure.</p>
                <textarea id="cxSmsText" class="cx-in w-full" style="min-height:110px;margin-top:10px" placeholder="e.g. Rs.250.00 debited from A/c XX1234 to SWIGGY on 03-10-26. UPI Ref 427512345678. Avl Bal Rs.12,450.00" oninput="CXSms.preview()">${esc(pref || '')}</textarea>
                <div class="flex gap-2 mt-2 flex-wrap"><button class="cx-btn sm" onclick="CXSms.paste()">Paste from clipboard</button></div>
                <div id="cxSmsPrev" style="margin-top:12px"></div>`);
            this.preview(); const t = $('cxSmsText'); if (t && !pref) t.focus();
        },
        async paste() { try { const tx = await navigator.clipboard.readText(); $('cxSmsText').value = tx; this.preview(); } catch (e) { toast('Clipboard access was blocked. Paste manually.', true); } },
        preview() {
            const box = $('cxSmsPrev'); if (!box) return; const txt = $('cxSmsText').value.trim(); if (!txt) { box.innerHTML = ''; return; }
            const p = parseSMS(txt);
            if (p.skip) { box.innerHTML = `<div class="cx-empty" style="color:#fbbf24;border-color:#fbbf2455">Not added: ${esc(p.skip)}</div>`; return; }
            const cats = p.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
            box.innerHTML = `<div class="grid grid-cols-2 gap-2">
                <div><label class="cx-lbl">Direction</label><select id="cxSmsType" class="cx-in w-full" onchange="CXSms.retype()"><option value="expense" ${p.type === 'expense' ? 'selected' : ''}>Expense (money out)</option><option value="income" ${p.type === 'income' ? 'selected' : ''}>Income (money in)</option></select></div>
                <div><label class="cx-lbl">Amount ₹</label><input id="cxSmsAmt" type="number" step="0.01" class="cx-in w-full" value="${p.amount}"></div>
                <div class="col-span-2"><label class="cx-lbl">With / note</label><input id="cxSmsNote" class="cx-in w-full" value="${esc(p.note)}"></div>
                <div><label class="cx-lbl">Category</label><select id="cxSmsCat" class="cx-in w-full">${cats.map(c => `<option ${c === p.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
                <div><label class="cx-lbl">Paid with</label><select id="cxSmsAcc" class="cx-in w-full">${['UPI', 'Debit Card', 'Credit Card', 'Cash'].map(a => `<option ${a === p.account ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
                <div class="col-span-2"><label class="cx-lbl">Date</label><input id="cxSmsDate" type="date" class="cx-in w-full" value="${new Date(p.ts).toLocaleDateString('en-CA')}"></div></div>
                ${isDup(p) ? '<p style="color:#fbbf24;margin-top:8px">This looks like a message that was already recorded.</p>' : ''}
                <button class="cx-btn green" style="width:100%;margin-top:12px" onclick="CXSms.commit()">Add to ledger</button>`;
        },
        retype() { const ty = $('cxSmsType').value; $('cxSmsCat').innerHTML = (ty === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => `<option>${esc(c)}</option>`).join(''); },
        commit() {
            const p = parseSMS($('cxSmsText').value); const amt = parseFloat($('cxSmsAmt').value); if (!(amt > 0)) return toast('Enter a valid amount.', true);
            const d = new Date($('cxSmsDate').value + 'T12:00'); const same = d.toDateString() === new Date().toDateString();
            addEntry({ type: $('cxSmsType').value, amount: amt, note: $('cxSmsNote').value.trim(), category: $('cxSmsCat').value, account: $('cxSmsAcc').value, ts: same ? Date.now() : d.getTime(), key: p.key }, 'SMS');
            try { updateUI(); } catch (e) {} feed(); $('cxSmsModal').remove(); toast(`Recorded ${inr(amt)} from the message.`);
        },
        undo(id) { transactions = transactions.filter(t => t.id !== id); saveTransactionsLocally(); try { updateUI(); } catch (e) {} feed(); toast('Entry removed.'); try { fetch(`${API_BASE}/delete-transaction/${id}`, { method: 'DELETE' }).catch(() => {}); } catch (e) {} },
        setup() {
            const auto = getJ('walletSmsAuto', true);
            modal('cxAutoModal', 'Automatic SMS capture', `
                <p>A web page is not allowed to read your phone's messages by itself, so the phone has to hand each bank SMS to this app. Once that hand-off is set up, entries are added to the ledger on their own, for both money in and money out.</p>
                <p style="margin-top:8px"><b class="text-white">Capture link for this device</b></p><code id="cxIngestUrl">${esc(ingestUrl())}</code>
                <div class="flex gap-2 flex-wrap"><button class="cx-btn sm" onclick="navigator.clipboard.writeText(document.getElementById('cxIngestUrl').textContent).then(()=>CX.toast('Link copied.'))">Copy link</button>
                <button class="cx-btn sm" onclick="CXSms.test()">Send a test message</button></div>
                <p style="margin-top:12px"><b class="text-white">Android, fully automatic</b></p>
                <ol><li>Open this app in Chrome on the phone (it must be hosted on a web address, not a file on your PC) and install it from the browser menu.</li>
                <li>Install an automation app such as MacroDroid or Tasker and create a rule: trigger <b>SMS received</b>, with a content filter like "debited" or "credited".</li>
                <li>Action: <b>open website</b>, with the capture link above followed by the message text variable, URL-encoded.</li>
                <li>From then on each bank SMS opens the link for a moment and the entry appears in the ledger.</li></ol>
                <p style="margin-top:8px"><b class="text-white">Any phone, one tap</b></p>
                <ol><li>Install this app to the home screen.</li><li>Long-press the SMS, choose Share, and pick Wally MK 3. The entry is added directly.</li></ol>
                <p style="margin-top:8px"><b class="text-white">With your server online</b></p><p>Entries captured on the phone are also posted to the server, so they appear on your other devices at the next sync. Until then they stay in the phone's browser.</p>
                <label class="cx-row" style="margin-top:12px;cursor:pointer"><input type="checkbox" class="form-check" ${auto ? 'checked' : ''} onchange="CXSms.auto(this.checked)"><span class="flex-1"><b class="text-sm text-white">Add captured messages without asking</b><br><span style="font-size:12px;color:#94a3b8">Off: each captured message opens the review card first.</span></span></label>`);
        },
        auto(v) { setJ('walletSmsAuto', !!v); },
        test() { const amt = 100 + Math.floor(Math.random() * 400); location.hash = '#sms=' + encodeURIComponent(`Rs.${amt}.00 debited from A/c XX1234 to TEST MERCHANT on ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}. UPI Ref ${Date.now()}. Avl Bal Rs.9,999.00`); const m = $('cxAutoModal'); if (m) m.remove(); }
    };

    function captured(text, source) {
        if (!text) return;
        if (!getJ('walletSmsAuto', true)) { window.CXSms.single(text); return; }
        const r = ingest(text, source);
        if (r.added.length) toast(`Captured ${r.added.length} transaction${r.added.length > 1 ? 's' : ''}: ${r.added.map(t => (t.type === 'income' ? '+' : '−') + inr(t.amount)).join(', ')}`);
        else if (r.dup) toast('That message was already recorded.');
        else toast('Message received, but it is not a completed transaction: ' + (r.skipped[0] || 'unrecognised'), true);
    }
    function readIncoming() {
        const h = location.hash.match(/#sms=(.*)$/), q = new URLSearchParams(location.search);
        let text = '', src = 'auto SMS';
        if (h) { try { text = decodeURIComponent(h[1].replace(/\+/g, ' ')); } catch (e) { text = h[1]; } }
        else if (q.get('sms')) text = q.get('sms');
        else if (q.get('text') || q.get('url')) {                                         // arrived through the phone's Share menu
            const shared = [q.get('title'), q.get('text'), q.get('url')].filter(Boolean).join(' '), link = (shared.match(/https?:\/\/\S+/) || [])[0];
            const p = parseSMS(shared);
            if (!p.skip) { text = shared; src = 'shared SMS'; }
            else if (link) { setTimeout(() => { switchMainView(/imdb|goodreads|myanimelist|letterboxd/.test(link) ? 'media' : 'wishlist'); const f = $(/imdb|goodreads|myanimelist|letterboxd/.test(link) ? 'mediaLink' : 'wishLink'); if (f) { f.value = link; f.dispatchEvent(new Event('input')); } toast('Shared link placed in the form.'); }, 600); }
        }
        if (h || location.search) { try { history.replaceState(null, '', location.pathname); } catch (e) {} }
        if (text) captured(text, src);
    }
    window.addEventListener('hashchange', readIncoming);

    // the existing "Bulk SMS" button now uses the smart reader, then the normal review screen
    const baseStage = window.parseCSVToStaging;
    window.parseCSVToStaging = function (textData, isSms) {
        if (!isSms) return baseStage.apply(this, arguments);
        stagedCSVTransactions = []; const skipped = [];
        splitSMS(textData).forEach((msg, i) => { const p = parseSMS(msg); if (p.skip) return skipped.push(p.skip); stagedCSVTransactions.push({ id: 'stage_' + i + '_' + Date.now(), date: new Date(p.ts).toLocaleDateString('en-CA'), amount: p.amount, type: p.type, note: p.note, account: p.account, category: p.category, _cat: p.category, isDuplicate: isDup(p) }); });
        if (!stagedCSVTransactions.length) { alert('No completed transactions were found in that text.' + (skipped.length ? '\n\nSkipped: ' + [...new Set(skipped)].join('; ') : '')); return; }
        renderCSVStaging(); $('csvReviewModal').classList.remove('hidden');
        stagedCSVTransactions.forEach(tx => { const sel = $('csv_cat_' + tx.id), acc = tx; if (sel) { if (![...sel.options].some(o => o.value === tx.category)) sel.insertAdjacentHTML('beforeend', `<option value="${esc(tx.category)}">${esc(tx.category)}</option>`); sel.value = tx.category; } });
        if (skipped.length) toast(`${stagedCSVTransactions.length} transaction(s) found, ${skipped.length} message(s) skipped (OTPs, reminders or offers).`);
    };

    // ==========================================================================
    // 4. BILL SCANNER — photo or upload, read on the device
    // ==========================================================================
    const OCR = { lib: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js', worker: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js', core: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5', lang: 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/eng/4.0.0_best_int' };
    const loadLib = () => window.Tesseract ? Promise.resolve() : new Promise((res, rej) => { const s = document.createElement('script'); s.src = OCR.lib; s.onload = res; s.onerror = () => rej(new Error('offline')); document.head.appendChild(s); });
    function parseBill(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean), nums = l => (l.match(/\d[\d,]*\.\d{2}|\d[\d,]{2,}/g) || []).map(n => parseFloat(n.replace(/,/g, ''))).filter(n => n > 0 && n < 10000000);
        let total = 0;
        for (const re of [/grand\s*total|net\s*(amount|payable|total)|amount\s*(payable|paid|due)|total\s*(amount|payable|due)|bill\s*amount/i, /\btotal\b/i, /\bamount\b|\bcash\b|\bcard\b/i]) { const c = lines.filter(l => re.test(l) && !/sub\s*-?total|total\s*(qty|items|savings|discount)/i.test(l)).flatMap(nums); if (c.length) { total = Math.max(...c); break; } }
        if (!total) { const all = lines.filter(l => !/phone|ph:|gst|fssai|invoice|bill no|tin|pin|\d{2}[\/-]\d{2}[\/-]\d{2,4}/i.test(l)).flatMap(l => (l.match(/\d[\d,]*\.\d{2}/g) || []).map(n => parseFloat(n.replace(/,/g, '')))); if (all.length) total = Math.max(...all); }
        const shop = (lines.find(l => /[A-Za-z]{3,}/.test(l) && !/tax invoice|invoice|receipt|bill|gstin|welcome/i.test(l)) || '').replace(/[^A-Za-z0-9 &'.-]/g, '').trim().slice(0, 40);
        const d = text.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/); let ts = Date.now();
        if (d && Number(d[2]) <= 12) { let y = Number(d[3]); if (y < 100) y += 2000; const dt = new Date(y, Number(d[2]) - 1, Number(d[1]), 12); if (!isNaN(dt) && dt.getTime() <= Date.now() && y > 2015) ts = dt.getTime(); }
        const g = window.guessCategory ? window.guessCategory(shop + ' ' + text.slice(0, 400)) : null;
        return { total, shop: shop ? title(shop) : '', ts, category: g && EXPENSE_CATEGORIES.includes(g) ? g : 'Other' };
    }
    function billForm(o, img, note) {
        const box = $('cxBillBody'); if (!box) return;
        box.innerHTML = `${img ? `<img src="${img}" alt="Bill" style="max-height:170px;border-radius:10px;border:1px solid rgba(0,229,255,.3);margin:0 auto 12px;display:block">` : ''}${note ? `<p style="color:#fbbf24;margin-bottom:10px">${note}</p>` : ''}
            <div class="grid grid-cols-2 gap-2"><div><label class="cx-lbl">Bill total ₹</label><input id="cxBillAmt" type="number" step="0.01" class="cx-in w-full" value="${o.total || ''}"></div>
            <div><label class="cx-lbl">Date</label><input id="cxBillDate" type="date" class="cx-in w-full" value="${new Date(o.ts || Date.now()).toLocaleDateString('en-CA')}"></div>
            <div class="col-span-2"><label class="cx-lbl">Shop / note</label><input id="cxBillNote" class="cx-in w-full" value="${esc(o.shop || '')}"></div>
            <div><label class="cx-lbl">Category</label><select id="cxBillCat" class="cx-in w-full">${EXPENSE_CATEGORIES.map(c => `<option ${c === o.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
            <div><label class="cx-lbl">Paid with</label><select id="cxBillAcc" class="cx-in w-full">${['UPI', 'Debit Card', 'Credit Card', 'Cash'].map(a => `<option>${a}</option>`).join('')}</select></div></div>
            <p style="font-size:12px;color:#94a3b8;margin-top:8px">Check the total against the bill before saving. Faded or crumpled receipts are often misread.</p>
            <button class="cx-btn green" style="width:100%;margin-top:12px" onclick="CXBill.commit()">Add to ledger</button>`;
    }
    window.CXBill = {
        parse: parseBill,
        pick(camera) {
            let i = $('cxBillInput'); if (!i) { i = document.createElement('input'); i.type = 'file'; i.id = 'cxBillInput'; i.accept = 'image/*'; i.style.display = 'none'; i.onchange = () => { if (i.files[0]) this.read(i.files[0]); i.value = ''; }; document.body.appendChild(i); }
            if (camera) i.setAttribute('capture', 'environment'); else i.removeAttribute('capture'); i.click();
        },
        async read(file) {
            modal('cxBillModal', 'Bill scanner', `<div id="cxBillBody"><p id="cxBillMsg">Preparing the reader…</p><div class="cx-prog" style="margin-top:10px"><i id="cxBillBar"></i></div></div>`);
            let img = ''; try { img = await readPicture(file, 1600); } catch (e) { return billForm({}, '', 'That file is not a readable image. Enter the bill by hand.'); }
            try {
                await loadLib();
                const w = await window.Tesseract.createWorker('eng', 1, { workerPath: OCR.worker, corePath: OCR.core, langPath: OCR.lang, logger: m => { const b = $('cxBillBar'), t = $('cxBillMsg'); if (b && m.progress != null) b.style.width = Math.round(m.progress * 100) + '%'; if (t) t.textContent = m.status === 'recognizing text' ? 'Reading the bill…' : 'Loading the reading engine (first time needs internet)…'; } });
                const { data } = await w.recognize(img); await w.terminate();
                const o = parseBill(data.text || '');
                billForm(o, img, o.total ? '' : 'The total could not be read clearly. Type it in below.');
            } catch (e) { billForm({}, img, 'The reading engine could not load (it needs an internet connection the first time). Type the total below.'); }
        },
        commit() {
            const amt = parseFloat($('cxBillAmt').value); if (!(amt > 0)) return toast('Enter the bill total.', true);
            const d = new Date($('cxBillDate').value + 'T12:00'), same = d.toDateString() === new Date().toDateString();
            addEntry({ type: 'expense', amount: amt, note: $('cxBillNote').value.trim() || 'Bill', category: $('cxBillCat').value, account: $('cxBillAcc').value, ts: same ? Date.now() : d.getTime() }, 'bill scan');
            try { updateUI(); } catch (e) {} feed(); $('cxBillModal').remove(); toast(`Bill of ${inr(amt)} added to the ledger.`);
        }
    };

    function entryButtons() {
        const bulk = document.querySelector('button[onclick="openBulkSMSModal()"]'); if (!bulk || $('cxEntryRow')) return;
        bulk.parentElement.insertAdjacentHTML('beforebegin', `<div id="cxEntryRow">
            <button type="button" class="cx-btn sm" onclick="CXSms.single()"><i data-lucide="message-circle" class="w-4 h-4"></i> Single SMS</button>
            <button type="button" class="cx-btn sm" onclick="CXSms.setup()"><i data-lucide="smartphone" class="w-4 h-4"></i> Auto capture</button>
            <button type="button" class="cx-btn green sm" onclick="CXBill.pick(true)"><i data-lucide="camera" class="w-4 h-4"></i> Scan bill</button>
            <button type="button" class="cx-btn green sm" onclick="CXBill.pick(false)"><i data-lucide="image-up" class="w-4 h-4"></i> Upload bill</button>
        </div><div id="cxFeed"></div>`);
        feed();
    }

    // ==========================================================================
    // 5. MOTION HELPERS + INSTALLABLE APP
    // ==========================================================================
    function reveal() {
        if (reduce || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('cx-on'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
        const scan = () => document.querySelectorAll('.view-card.active .glass-panel:not(.cx-rv):not(.chart-stack-card):not(.stats-stack-card), .view-card.active .cx-sys:not(.cx-rv)').forEach(p => { if (p.closest('.fullscreen-wb') || p.id === 'whiteboardContainer' || p.getBoundingClientRect().top < window.innerHeight * .9) return; p.classList.add('cx-rv'); io.observe(p); });
        scan(); const sw = window.switchMainView; window.switchMainView = function () { const r = sw.apply(this, arguments); setTimeout(scan, 80); return r; };
        setInterval(() => document.querySelectorAll('.cx-rv:not(.cx-on)').forEach(p => { if (p.getBoundingClientRect().top < window.innerHeight) p.classList.add('cx-on'); }), 1500);   // safety net: nothing stays hidden
    }
    document.addEventListener('pointerdown', e => {
        if (reduce) return; const b = e.target.closest('.cx-btn, .nav-btn'); if (!b) return;
        const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span');
        s.className = 'cx-rip'; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`; b.appendChild(s); setTimeout(() => s.remove(), 600);
    });
    function installable() {
        if (!/^https?:$/.test(location.protocol)) return;
        if (!document.querySelector('link[rel="manifest"]')) { const l = document.createElement('link'); l.rel = 'manifest'; l.href = 'manifest.json'; document.head.appendChild(l); }
        if (!document.querySelector('meta[name="theme-color"]')) { const m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#050507'; document.head.appendChild(m); }
        if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    }

    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion 4 boot step failed', e); } };
        safe(background); safe(applyWall); safe(intro); safe(entryButtons); safe(installable);
        safe(() => { const p = $('cxParticles'); if (p) p.remove(); });
        setTimeout(() => { safe(intro); safe(readIncoming); safe(reveal); icons(); }, 1100);
    });
    window.CX.on('growth', () => { const s = $('cxStrip'); if (s) s.remove(); });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 5
// Offline Analyse / Forecast / Full Report with complete PDF export, restored
// card-rotation on both telemetry decks, six more Macro Scanner charts,
// "sir" address, online price lookup for pasted links.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, mKey, toast, balances } = window.CX;
    const sum = (a, f) => a.reduce((s, x) => s + (f ? f(x) : x), 0);
    const monthName = k => { const [y, m] = k.split('-'); return new Date(y, m - 1).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }); };
    const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

    // ==========================================================================
    // 0. STYLE: the telemetry decks get their rotation back
    // ==========================================================================
    const css = document.createElement('style');
    css.textContent = `
    .chart-stack-container, .stats-stack-container { perspective: 1400px; transform-style: preserve-3d; }
    .chart-stack-card, .stats-stack-card { transition: transform .7s cubic-bezier(.23,1,.32,1), opacity .7s cubic-bezier(.23,1,.32,1), box-shadow .7s ease !important; animation: none !important; backface-visibility: hidden; transform: translateZ(-320px) rotateY(0deg) scale(.7); }
    .chart-stack-card.active, .stats-stack-card.active { transform: translateX(0) translateZ(0) rotateY(0deg) scale(1) !important; opacity: 1 !important; }
    .chart-stack-card.prev-card { transform: translateX(-36%) translateZ(-170px) rotateY(38deg) scale(.86) !important; opacity: .28 !important; }
    .chart-stack-card.next-card { transform: translateX(36%) translateZ(-170px) rotateY(-38deg) scale(.86) !important; opacity: .28 !important; }
    .stats-stack-card.prev-card { transform: translateX(-62%) translateZ(-150px) rotateY(42deg) scale(.86) !important; opacity: .3 !important; }
    .stats-stack-card.next-card { transform: translateX(62%) translateZ(-150px) rotateY(-42deg) scale(.86) !important; opacity: .3 !important; }
    .chart-stack-card.prev-card, .chart-stack-card.next-card, .stats-stack-card.prev-card, .stats-stack-card.next-card { pointer-events: auto; cursor: pointer; }
    .chart-stack-card.prev-card *, .chart-stack-card.next-card *, .stats-stack-card.prev-card *, .stats-stack-card.next-card * { pointer-events: none; }
    @media (max-width: 768px) { .chart-stack-card.prev-card { transform: translateX(-16%) translateZ(-170px) rotateY(30deg) scale(.86) !important; } .chart-stack-card.next-card { transform: translateX(16%) translateZ(-170px) rotateY(-30deg) scale(.86) !important; } }
    @media (prefers-reduced-motion: reduce) { .chart-stack-card, .stats-stack-card { transition: opacity .2s !important; } }
    .cx-rep h4 { font: 800 13px 'Exo 2', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #00e5ff; margin: 16px 0 8px; border-bottom: 1px solid rgba(0,229,255,.25); padding-bottom: 5px; }
    .cx-rep h4:first-child { margin-top: 0; } .cx-rep p { color: #cbd5e1; font-size: 13.5px; line-height: 1.6; margin-bottom: 6px; } .cx-rep b { color: #fff; }
    .cx-rep ul { margin: 0 0 6px 18px; list-style: disc; color: #cbd5e1; font-size: 13.5px; line-height: 1.6; }
    .cx-rep table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 8px; } .cx-rep th { text-align: left; color: #94a3b8; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; padding: 5px 6px; border-bottom: 1px solid rgba(255,255,255,.12); }
    .cx-rep td { padding: 5px 6px; border-bottom: 1px solid rgba(255,255,255,.05); color: #e2e8f0; } .cx-rep td.n, .cx-rep th.n { text-align: right; font-variant-numeric: tabular-nums; }
    .cx-good { color: #34d399 !important; } .cx-bad { color: #f87171 !important; } .cx-warn { color: #fbbf24 !important; }
    .cx-relay { font-size: 11px; color: #64748b; font-weight: 700; margin: 4px 2px 0; display: flex; gap: 6px; align-items: center; }
    `;
    document.head.appendChild(css);

    // ==========================================================================
    // 1. DATA MODEL shared by Analyse, Forecast and the Full Report
    // ==========================================================================
    function model() {
        const tx = transactions.filter(t => t.account !== 'Emergency' && Number.isFinite(t.amount)), now = new Date(), cur = mKey(Date.now());
        const months = {};
        tx.forEach(t => { const k = mKey(t.timestamp), m = months[k] || (months[k] = { k, inc: 0, exp: 0, cats: {}, n: 0 }); m.n++; if (t.type === 'income') m.inc += t.amount; else { m.exp += t.amount; m.cats[t.category] = (m.cats[t.category] || 0) + t.amount; } });
        const keys = Object.keys(months).sort(), list = keys.map(k => months[k]);
        const exp = tx.filter(t => t.type === 'expense'), inc = tx.filter(t => t.type === 'income');
        const totInc = sum(inc, t => t.amount), totExp = sum(exp, t => t.amount);
        const cats = {}; exp.forEach(t => cats[t.category] = (cats[t.category] || 0) + t.amount);
        const merch = {}; exp.forEach(t => { const n = (t.note || '').trim() || t.category; const key = n.toLowerCase().slice(0, 28); (merch[key] = merch[key] || { name: n.slice(0, 28), v: 0, n: 0 }).v += t.amount; merch[key].n++; });
        const acc = {}; exp.forEach(t => acc[t.account] = (acc[t.account] || 0) + t.amount);
        const full = list.filter(m => m.k !== cur), base = full.length ? full : list;
        const avgExp = base.length ? sum(base, m => m.exp) / base.length : 0, avgInc = base.length ? sum(base, m => m.inc) / base.length : 0;
        const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate();
        const cm = months[cur] || { k: cur, inc: 0, exp: 0, cats: {}, n: 0 };
        const pk = mKey(new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()), pm = months[pk] || null;
        const budget = (monthlyBudgets[cur] || monthlyBudgets['default']) || 25000;
        // recurring commitments not yet seen this month
        const seen = {}, due = [];
        tx.filter(t => t.isRecurring && t.type === 'expense').sort((a, b) => b.timestamp - a.timestamp).forEach(t => { const id = (t.note || t.category) + '|' + t.amount; if (seen[id]) return; seen[id] = 1; const paid = tx.some(x => x.isRecurring && mKey(x.timestamp) === cur && (x.note || x.category) === (t.note || t.category)); due.push({ name: t.note || t.category, amount: t.amount, paid }); });
        const recur = sum(due, d => d.amount), recurLeft = sum(due.filter(d => !d.paid), d => d.amount);
        // forecast: blend of the month-to-date pace and the last 7 days, plus unpaid recurring bills
        const curExp = exp.filter(t => mKey(t.timestamp) === cur), varSpent = sum(curExp.filter(t => !t.isRecurring), t => t.amount);
        const wk = Date.now() - 7 * 86400000, last7 = sum(curExp.filter(t => t.timestamp >= wk && !t.isRecurring), t => t.amount) / Math.min(7, day);
        // early in the month a single purchase would dominate, so lean on your own history until ~10 days of data exist
        const prior = list.filter(m => m.k !== cur), histVar = prior.length ? sum(prior, m => Math.max(0, m.exp - sum(tx.filter(t => t.isRecurring && t.type === 'expense' && mKey(t.timestamp) === m.k), t => t.amount))) / prior.length / 30 : null;
        const histCat = {}; if (prior.length) prior.forEach(m => Object.keys(m.cats).forEach(c => histCat[c] = (histCat[c] || 0) + m.cats[c] / prior.length));
        const wNow = histVar === null ? 1 : Math.min(1, day / 10);
        const pace = day ? varSpent / day : 0, recent = day >= 7 ? pace * .6 + last7 * .4 : pace, daily = recent * wNow + (histVar || 0) * (1 - wNow);
        const left = dim - day, proj = cm.exp + daily * left + recurLeft;
        const b = balances();
        return { wNow, histCat, histVar, tx, exp, inc, months, keys, list, totInc, totExp, cats, merch, acc, avgExp, avgInc, cm, pm, pk, cur, dim, day, left, budget, due, recur, recurLeft, daily, proj, bal: b, curExp, first: tx.length ? Math.min(...tx.map(t => t.timestamp)) : Date.now() };
    }
    const top = (obj, n) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);
    const DISCRETIONARY = /food|dining|shopping|entertainment|subscription|travel|other/i;

    function advice(M) {
        const out = [], tc = top(M.cm.cats, 6);
        const d = tc.find(c => DISCRETIONARY.test(c[0]));
        if (d && d[1] > 0) out.push(`Trim <b>${esc(d[0])}</b> by 15% and you keep about <b>${inr(d[1] * .15)}</b> this month, sir.`);
        const subs = M.due.filter(x => /netflix|spotify|prime|hotstar|subscription|youtube/i.test(x.name));
        if (subs.length) out.push(`You carry ${subs.length} subscription${subs.length > 1 ? 's' : ''} worth <b>${inr(sum(subs, s => s.amount))}</b> a month. Cancel any you have not opened in the last 30 days.`);
        if (M.proj > M.budget) out.push(`To finish inside the ${inr(M.budget)} budget, hold daily spending to <b>${inr(Math.max(0, (M.budget - M.cm.exp - M.recurLeft) / Math.max(1, M.left)))}</b> for the remaining ${M.left} day${M.left === 1 ? '' : 's'}.`);
        const run = M.avgExp ? (M.bal.liquid + M.bal.ef) / M.avgExp : 0;
        if (M.avgExp && run < 3) out.push(`Cash plus emergency fund covers <b>${run.toFixed(1)} months</b> of spending. Build it to at least three before taking on new commitments.`);
        const sr = M.cm.inc ? (M.cm.inc - M.cm.exp) / M.cm.inc * 100 : null;
        if (sr !== null && sr < 20) out.push(`This month's savings rate is <b>${Math.round(sr)}%</b>. Moving a fixed amount out on the day income arrives is the most reliable way to reach 20%.`);
        if (!out.length) out.push('Spending is inside budget and the reserves are healthy, sir. Direct the surplus to your wishlist fund or an investment goal.');
        return out;
    }

    function analysisHTML() {
        const M = model(); if (!M.tx.length) return '<p>No transactions are recorded yet, sir. Add one and I will analyse it.</p>';
        const tc = top(M.cm.cats, 4), big = M.curExp.slice().sort((a, b) => b.amount - a.amount)[0], sr = M.cm.inc ? Math.round((M.cm.inc - M.cm.exp) / M.cm.inc * 100) : null;
        let moves = '';
        if (M.pm) { const ch = Object.keys(M.cm.cats).map(c => [c, M.cm.cats[c] - (M.pm.cats[c] || 0) * (M.day / M.dim)]).sort((a, b) => b[1] - a[1]); if (ch[0] && ch[0][1] > 0) moves = `<p>Running hottest against last month's pace: <b>${esc(ch[0][0])}</b>, ahead by ${inr(ch[0][1])}.</p>`; }
        return `<div class="cx-rep"><h4>Analysis for ${monthName(M.cur)}</h4>
            <p>Sir, you have spent <b>${inr(M.cm.exp)}</b> across ${M.curExp.length} entr${M.curExp.length === 1 ? 'y' : 'ies'} with income of <b>${inr(M.cm.inc)}</b>${sr !== null ? `, a savings rate of <b class="${sr >= 20 ? 'cx-good' : 'cx-warn'}">${sr}%</b>` : ''}. That is <b class="${M.cm.exp > M.budget ? 'cx-bad' : 'cx-good'}">${pct(M.cm.exp, M.budget)}%</b> of the ${inr(M.budget)} budget with ${M.left} day${M.left === 1 ? '' : 's'} left.</p>
            ${tc.length ? `<p>Where it went: ${tc.map(c => `<b>${esc(c[0])}</b> ${inr(c[1])} (${pct(c[1], M.cm.exp)}%)`).join(', ')}.</p>` : ''}
            ${big ? `<p>Largest single expense: <b>${inr(big.amount)}</b> on ${esc(big.note || big.category)}.</p>` : ''}${moves}
            <p>Liquid assets stand at <b>${inr(M.bal.liquid)}</b> and the emergency fund at <b>${inr(M.bal.ef)}</b>${M.avgExp ? `, which is ${((M.bal.liquid + M.bal.ef) / M.avgExp).toFixed(1)} months of average spending` : ''}.</p>
            <h4>Recommended actions</h4><ul>${advice(M).map(a => `<li>${a}</li>`).join('')}</ul></div>`;
    }

    function forecastHTML() {
        const M = model(); if (!M.curExp.length && !M.recur) return '<p>There is no spending this month to project from yet, sir.</p>';
        const over = M.proj - M.budget, cats = top(M.cm.cats, 5).map(([c, v]) => { const rec = sum(M.curExp.filter(t => t.category === c && t.isRecurring), t => t.amount); const own = (v - rec) / Math.max(1, M.day), hist = M.histCat[c] != null ? Math.max(0, M.histCat[c] - rec) / 30 : own; return [c, v, v + (own * M.wNow + hist * (1 - M.wNow)) * M.left]; });
        const low = M.cm.exp + M.daily * .75 * M.left + M.recurLeft, high = M.cm.exp + M.daily * 1.25 * M.left + M.recurLeft;
        return `<div class="cx-rep"><h4>Forecast to ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h4>
            <p>Sir, at the current pace of <b>${inr(M.daily)}</b> a day, month-end spending lands near <b class="${over > 0 ? 'cx-bad' : 'cx-good'}">${inr(M.proj)}</b> (likely range ${inr(low)} to ${inr(high)}). That is <b class="${over > 0 ? 'cx-bad' : 'cx-good'}">${inr(Math.abs(over))} ${over > 0 ? 'over' : 'under'}</b> the ${inr(M.budget)} budget${M.pm ? ` and ${M.proj >= M.pm.exp ? 'above' : 'below'} last month's ${inr(M.pm.exp)}` : ''}.</p>
            ${M.recurLeft ? `<p>Included: <b>${inr(M.recurLeft)}</b> of recurring bills still to be paid (${M.due.filter(d => !d.paid).map(d => esc(d.name)).slice(0, 4).join(', ')}).</p>` : ''}
            ${M.wNow < 1 ? `<p class="cx-warn">Only ${M.day} day${M.day === 1 ? '' : 's'} of this month exist, so the estimate leans ${Math.round((1 - M.wNow) * 100)}% on your previous months' daily average (${inr(M.histVar)}) and will firm up by the 10th.</p>` : ''}
            ${cats.length ? `<table><tr><th>Category</th><th class="n">So far</th><th class="n">Projected</th></tr>${cats.map(c => `<tr><td>${esc(c[0])}</td><td class="n">${inr(c[1])}</td><td class="n">${inr(c[2])}</td></tr>`).join('')}</table>` : ''}
            <p>Projected closing balance: <b>${inr(M.bal.liquid - (M.proj - M.cm.exp))}</b> if no further income arrives.</p>
            <h4>To stay on course</h4><ul>${advice(M).map(a => `<li>${a}</li>`).join('')}</ul></div>`;
    }

    function reportHTML() {
        const M = model(); if (!M.tx.length) return '<p>No transactions are recorded yet, sir.</p>';
        const best = M.list.slice().sort((a, b) => (b.inc - b.exp) - (a.inc - a.exp))[0], worst = M.list.slice().sort((a, b) => (a.inc - a.exp) - (b.inc - b.exp))[0];
        const sr = M.totInc ? Math.round((M.totInc - M.totExp) / M.totInc * 100) : 0, bigs = M.exp.slice().sort((a, b) => b.amount - a.amount).slice(0, 5);
        const row = (a, b, c) => `<tr><td>${a}</td><td class="n">${b}</td>${c !== undefined ? `<td class="n">${c}</td>` : ''}</tr>`;
        let pf = null, lv = null; try { pf = window.CXInvest.totals(); } catch (e) {}
        return `<div class="cx-rep">
            <h4>Executive summary</h4>
            <p>Sir, this report covers <b>${new Date(M.first).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</b> to today: ${M.tx.length} transactions across ${M.keys.length} month${M.keys.length === 1 ? '' : 's'}.</p>
            <p>Total income <b>${inr(M.totInc)}</b>, total spending <b>${inr(M.totExp)}</b>, net <b class="${M.totInc - M.totExp >= 0 ? 'cx-good' : 'cx-bad'}">${inr(M.totInc - M.totExp)}</b>. Overall savings rate <b class="${sr >= 20 ? 'cx-good' : 'cx-warn'}">${sr}%</b>.</p>
            <p>Average month: income ${inr(M.avgInc)}, spending ${inr(M.avgExp)}. Liquid assets <b>${inr(M.bal.liquid)}</b>, emergency fund <b>${inr(M.bal.ef)}</b>${pf && pf.current ? `, investments <b>${inr(pf.current)}</b>` : ''}${M.avgExp ? `. Runway: <b>${((M.bal.liquid + M.bal.ef) / M.avgExp).toFixed(1)} months</b>` : ''}.</p>
            ${best && worst && M.list.length > 1 ? `<p>Strongest month: <b>${monthName(best.k)}</b> (net ${inr(best.inc - best.exp)}). Weakest: <b>${monthName(worst.k)}</b> (net ${inr(worst.inc - worst.exp)}).</p>` : ''}
            <h4>Month by month</h4><table><tr><th>Month</th><th class="n">Income</th><th class="n">Spending</th><th class="n">Net</th><th class="n">Saved</th></tr>${M.list.slice(-12).map(m => `<tr><td>${monthName(m.k)}</td><td class="n">${inr(m.inc)}</td><td class="n">${inr(m.exp)}</td><td class="n ${m.inc - m.exp >= 0 ? 'cx-good' : 'cx-bad'}">${inr(m.inc - m.exp)}</td><td class="n">${m.inc ? pct(m.inc - m.exp, m.inc) + '%' : '—'}</td></tr>`).join('')}</table>
            <h4>Spending by category, all time</h4><table><tr><th>Category</th><th class="n">Amount</th><th class="n">Share</th></tr>${top(M.cats, 10).map(c => row(esc(c[0]), inr(c[1]), pct(c[1], M.totExp) + '%')).join('')}</table>
            <h4>Top payees</h4><table><tr><th>Payee</th><th class="n">Amount</th><th class="n">Times</th></tr>${Object.values(M.merch).sort((a, b) => b.v - a.v).slice(0, 8).map(x => row(esc(x.name), inr(x.v), x.n)).join('')}</table>
            <h4>Largest expenses</h4><table><tr><th>What</th><th class="n">Amount</th><th class="n">Date</th></tr>${bigs.map(t => row(esc((t.note || t.category).slice(0, 34)), inr(t.amount), new Date(t.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }))).join('')}</table>
            <h4>How you pay</h4><table><tr><th>Account</th><th class="n">Spent</th><th class="n">Share</th></tr>${top(M.acc, 6).map(c => row(esc(c[0]), inr(c[1]), pct(c[1], M.totExp) + '%')).join('')}</table>
            ${M.due.length ? `<h4>Recurring commitments</h4><table><tr><th>Bill</th><th class="n">Monthly</th><th class="n">This month</th></tr>${M.due.slice(0, 10).map(d => row(esc(d.name.slice(0, 34)), inr(d.amount), d.paid ? 'Paid' : 'Due')).join('')}</table><p>Fixed commitments total <b>${inr(M.recur)}</b> a month${M.avgInc ? `, ${pct(M.recur, M.avgInc)}% of average income` : ''}.</p>` : ''}
            <h4>This month, ${monthName(M.cur)}</h4><p>Spent <b>${inr(M.cm.exp)}</b> of the ${inr(M.budget)} budget (${pct(M.cm.exp, M.budget)}%) with ${M.left} day${M.left === 1 ? '' : 's'} left. Projected month-end spending: <b class="${M.proj > M.budget ? 'cx-bad' : 'cx-good'}">${inr(M.proj)}</b>.</p>
            <h4>Recommendations</h4><ul>${advice(M).map(a => `<li>${a}</li>`).join('')}</ul>
            <p style="color:#64748b;font-size:12px">Generated on this device by C.A.S.P.E.R. from your ledger on ${new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.</p></div>`;
    }
    window.CXReport = { model, analysisHTML, forecastHTML, reportHTML };

    const offlineText = el => !el || /offline|process failed|is co|processing|computing/i.test(el.innerText) || !el.innerText.trim();
    const baseIns = window.getCASPERInsights, baseFc = window.getCASPERForecast, baseRep = window.openAIReport;
    const race = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
    window.getCASPERInsights = async function () {
        const t = $('aiTerminal'), b = $('aiButton'); try { await race(baseIns.apply(this, arguments), 4000); } catch (e) {}
        if (offlineText(t) && t) { try { clearTimeout(aiTypingTimer); } catch (e) {} t.classList.remove('hidden'); t.innerHTML = analysisHTML(); } if (b) b.disabled = false;
    };
    window.getCASPERForecast = async function () {
        const t = $('aiTerminal'), b = $('aiForecastBtn'); try { await race(baseFc.apply(this, arguments), 4000); } catch (e) {}
        if (offlineText(t) && t) { t.classList.remove('hidden'); t.innerHTML = forecastHTML(); } if (b) b.disabled = false;
    };
    window.openAIReport = async function () {
        try { await race(baseRep.apply(this, arguments), 4000); } catch (e) { console.warn(e); }
        const c = $('aiReportContent'); if (c && offlineText(c)) c.innerHTML = reportHTML();
        icons();
    };

    // ---- complete PDF: paginated text, tables, then every chart ---------------------
    window.exportReportPDF = function () {
        if (!window.jspdf) return toast('The PDF library has not loaded. It needs an internet connection once, sir.', true);
        const c = $('aiReportContent'); if (c && offlineText(c)) c.innerHTML = reportHTML();
        const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), W = 210, H = 297, mg = 14; let y = 0;
        const clean = s => String(s).replace(/₹/g, 'Rs ').replace(/[−–—]/g, '-').replace(/[^\x20-\x7E]/g, '');           // the built-in PDF font has no rupee sign
        const head = () => { doc.setFillColor(5, 9, 16); doc.rect(0, 0, W, 22, 'F'); doc.setTextColor(0, 229, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text('C.A.S.P.E.R. FINANCIAL REPORT', mg, 10); doc.setFontSize(8); doc.setTextColor(170, 190, 205); doc.text('Calculated Asset Security and Personal Expense Recorder  |  ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), mg, 16); y = 30; };
        const need = h => { if (y + h > H - 14) { doc.addPage(); head(); } };
        head();
        [...(c ? c.querySelector('.cx-rep') || c : document.createElement('div')).children].forEach(n => {
            if (n.tagName === 'H4') { need(14); y += 3; doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(2, 132, 199); doc.text(clean(n.innerText).toUpperCase(), mg, y); doc.setDrawColor(2, 132, 199); doc.line(mg, y + 1.5, W - mg, y + 1.5); y += 7; }
            else if (n.tagName === 'TABLE') {
                [...n.rows].forEach((r, ri) => { need(6); const cells = [...r.cells], cw = (W - 2 * mg - 70) / Math.max(1, cells.length - 1); doc.setFont('helvetica', ri === 0 ? 'bold' : 'normal'); doc.setFontSize(ri === 0 ? 8 : 9); doc.setTextColor(ri === 0 ? 110 : 30, ri === 0 ? 120 : 30, ri === 0 ? 130 : 30);
                    cells.forEach((cell, ci) => { const tx = clean(cell.innerText); if (ci === 0) doc.text(tx.slice(0, 40), mg, y); else doc.text(tx, mg + 70 + cw * ci, y, { align: 'right' }); });
                    doc.setDrawColor(225, 230, 235); doc.line(mg, y + 1.6, W - mg, y + 1.6); y += 5.6; }); y += 3;
            } else {
                const items = n.tagName === 'UL' ? [...n.children].map(li => '-  ' + clean(li.innerText)) : [clean(n.innerText)];
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(30, 30, 30);
                items.forEach(t => { const lines = doc.splitTextToSize(t, W - 2 * mg); lines.forEach(l => { need(5.2); doc.text(l, mg, y); y += 5.2; }); y += 1.2; });
            }
        });
        // charts: the eight report charts plus every Macro Scanner chart
        const names = { reportPieMonth: 'Category split (selected period)', reportBarMonth: 'Top categories (selected period)', reportPieAll: 'Category split (all time)', reportBarAll: 'Income vs expense by month', reportRadarMonth: 'Spending shape (selected period)', reportRadarAll: 'Spending shape (all time)', reportTrendMonth: 'Trend (selected period)', reportTrendAll: 'Trend (all time)' };
        const cv = [...document.querySelectorAll('#aiReportModal canvas, #chartDeckContainer canvas')].filter(k => k.width > 20 && k.height > 20 && typeof Chart !== 'undefined' && Chart.getChart(k));
        if (cv.length) { doc.addPage(); head(); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(2, 132, 199); doc.text('CHARTS', mg, y); y += 6; }
        const cw = (W - 2 * mg - 6) / 2, ch = 62; let col = 0;
        cv.forEach(k => {
            if (col === 0) need(ch + 12);
            const t = document.createElement('canvas'), sc = Math.min(2, 900 / k.width); t.width = k.width * sc; t.height = k.height * sc; const g = t.getContext('2d'); g.fillStyle = '#050910'; g.fillRect(0, 0, t.width, t.height); g.drawImage(k, 0, 0, t.width, t.height);
            const x = mg + col * (cw + 6), title = names[k.id] || (k.closest('.chart-stack-card') && k.closest('.chart-stack-card').querySelector('h3') ? k.closest('.chart-stack-card').querySelector('h3').innerText : k.id);
            doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(60, 70, 80); doc.text(clean(title).toUpperCase().slice(0, 48), x, y);
            const r = k.width / k.height, w = Math.min(cw, ch * r), h = w / r; doc.setFillColor(5, 9, 16); doc.rect(x, y + 2, cw, ch, 'F');
            try { doc.addImage(t.toDataURL('image/jpeg', .9), 'JPEG', x + (cw - w) / 2, y + 2 + (ch - h) / 2, w, h); } catch (e) {}
            col++; if (col === 2) { col = 0; y += ch + 10; }
        });
        const pages = doc.getNumberOfPages(); for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(140, 150, 160); doc.text(`Page ${i} of ${pages}`, W - mg, H - 7, { align: 'right' }); doc.text('Wally MK 3', mg, H - 7); }
        doc.save('CASPER_Report_' + new Date().toLocaleDateString('en-CA') + '.pdf'); toast(`Report exported, sir: ${pages} pages, ${cv.length} charts.`);
    };

    // ==========================================================================
    // 2. SIX MORE MACRO SCANNER CHARTS
    // ==========================================================================
    const NEW = [['cxmRace', 'Month Race', '#00e5ff', 'Cumulative spending day by day: this month against last month, with the budget line.'],
        ['cxmSave', 'Savings Rate', '#34d399', 'Share of income kept each month. The dashed line is the 20% target.'],
        ['cxmPayee', 'Top Payees', '#f97316', 'Who received the most of your money in the selected period.'],
        ['cxmStack', 'Category Trend', '#a855f7', 'Your five biggest categories stacked month by month.'],
        ['cxmSize', 'Ticket Size', '#fbbf24', 'How many payments fall into each size band, and how much money each band accounts for.'],
        ['cxmCurve', 'Balance Curve', '#38bdf8', 'Running balance after every transaction since your first entry.']];
    const mc = {};
    function injectMacro() {
        const deck = $('chartDeckContainer'); if (!deck || $('cxmRace')) return;
        deck.insertAdjacentHTML('beforeend', NEW.map(n => `<div class="chart-stack-card glass-panel p-5 md:p-6 flex flex-col justify-between border-t-2" style="border-top-color:${n[2]}"><div class="flex justify-between items-center mb-4"><h3 class="text-xs font-bold uppercase tracking-widest flex items-center" style="color:${n[2]}">${n[1]} <span class="info-icon" data-info="${esc(n[3])}"><i data-lucide="help-circle" class="w-4 h-4"></i></span></h3></div><div class="h-[250px] relative flex justify-center w-full overflow-hidden"><canvas id="${n[0]}"></canvas></div></div>`).join(''));
    }
    const ax = extra => Object.assign({ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8', boxWidth: 8, boxHeight: 8, usePointStyle: true, font: { size: 10 } } } }, scales: { x: { ticks: { color: '#64748b', font: { size: 9 }, maxRotation: 0, autoSkip: true }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,.05)' } } } }, extra || {});
    function draw(id, cfg) { const c = $(id); if (!c || typeof Chart === 'undefined') return; try { if (mc[id]) mc[id].destroy(); mc[id] = new Chart(c, cfg); } catch (e) { console.warn('chart ' + id, e); } }
    function renderMacro() {
        injectMacro(); if (!$('cxmRace')) return;
        const M = model(), sel = (typeof selectedMonth !== 'undefined' && selectedMonth !== 'all') ? selectedMonth : null;
        const cum = k => { const [y, m] = k.split('-').map(Number), n = new Date(y, m, 0).getDate(), a = new Array(n).fill(0); M.exp.filter(t => mKey(t.timestamp) === k).forEach(t => a[new Date(t.timestamp).getDate() - 1] += t.amount); let s = 0; return a.map(v => (s += v)); };
        const cur = sel || M.cur, [cy, cmo] = cur.split('-').map(Number), prev = mKey(new Date(cy, cmo - 2, 1).getTime()), isNow = cur === M.cur;
        const a = cum(cur).map((v, i) => isNow && i >= M.day ? null : Math.round(v)), b = cum(prev).map(Math.round), n = Math.max(a.length, b.length), bud = (monthlyBudgets[cur] || monthlyBudgets['default']) || 25000;
        draw('cxmRace', { type: 'line', data: { labels: [...Array(n)].map((_, i) => i + 1), datasets: [{ label: monthName(cur), data: a, borderColor: '#00e5ff', backgroundColor: 'rgba(0,229,255,.12)', fill: true, tension: .25, pointRadius: 0, borderWidth: 2.5 }, { label: monthName(prev), data: b, borderColor: '#64748b', borderDash: [5, 4], tension: .25, pointRadius: 0, borderWidth: 1.5 }, { label: 'Budget', data: [...Array(n)].map(() => bud), borderColor: '#f87171', borderDash: [2, 4], pointRadius: 0, borderWidth: 1.5 }] }, options: ax() });
        const L = M.list.slice(-12);
        draw('cxmSave', { data: { labels: L.map(m => monthName(m.k)), datasets: [{ type: 'bar', label: 'Savings rate %', data: L.map(m => m.inc ? Math.max(-100, Math.round((m.inc - m.exp) / m.inc * 100)) : null), backgroundColor: L.map(m => m.inc - m.exp >= 0 ? '#34d399' : '#f87171'), borderRadius: 4 }, { type: 'line', label: 'Target 20%', data: L.map(() => 20), borderColor: '#fbbf24', borderDash: [5, 4], pointRadius: 0, borderWidth: 1.5 }] }, options: ax({ scales: { x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { ticks: { color: '#64748b', maxTicksLimit: 5, callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,.05)' } } } }) });
        const pool = M.exp.filter(t => !sel || mKey(t.timestamp) === sel), pm = {}; pool.forEach(t => { const nm = ((t.note || '').trim() || t.category).slice(0, 18); pm[nm] = (pm[nm] || 0) + t.amount; });
        const tp = top(pm, 8);
        draw('cxmPayee', { type: 'bar', data: { labels: tp.length ? tp.map(x => x[0]) : ['No data'], datasets: [{ data: tp.length ? tp.map(x => Math.round(x[1])) : [0], backgroundColor: '#f97316', borderRadius: 4 }] }, options: ax({ indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,.05)' } }, y: { ticks: { color: '#cbd5e1', font: { size: 10 } }, grid: { display: false } } } }) });
        const L6 = M.list.slice(-6), c5 = top(M.cats, 5).map(c => c[0]), pal = ['#a855f7', '#00e5ff', '#fbbf24', '#34d399', '#f87171'];
        draw('cxmStack', { type: 'bar', data: { labels: L6.map(m => monthName(m.k)), datasets: c5.map((c, i) => ({ label: c, data: L6.map(m => Math.round(m.cats[c] || 0)), backgroundColor: pal[i], borderRadius: 2 })).concat([{ label: 'Everything else', data: L6.map(m => Math.round(m.exp - sum(c5, c => m.cats[c] || 0))), backgroundColor: '#475569', borderRadius: 2 }]) }, options: ax({ scales: { x: { stacked: true, ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,.05)' } } } }) });
        const bands = [['< ₹100', 0, 100], ['₹100–500', 100, 500], ['₹500–1k', 500, 1000], ['₹1k–5k', 1000, 5000], ['₹5k+', 5000, Infinity]];
        draw('cxmSize', { data: { labels: bands.map(x => x[0]), datasets: [{ type: 'bar', label: 'Payments', data: bands.map(x => pool.filter(t => t.amount >= x[1] && t.amount < x[2]).length), backgroundColor: '#fbbf24', borderRadius: 4, yAxisID: 'y' }, { type: 'line', label: 'Money ₹', data: bands.map(x => Math.round(sum(pool.filter(t => t.amount >= x[1] && t.amount < x[2]), t => t.amount))), borderColor: '#f87171', backgroundColor: '#f87171', tension: .3, yAxisID: 'm' }] }, options: ax({ scales: { x: { ticks: { color: '#64748b', font: { size: 9 } }, grid: { display: false } }, y: { beginAtZero: true, ticks: { color: '#fbbf24', maxTicksLimit: 5, precision: 0 }, grid: { color: 'rgba(255,255,255,.05)' } }, m: { position: 'right', beginAtZero: true, ticks: { color: '#f87171', maxTicksLimit: 5 }, grid: { display: false } } } }) });
        const srt = M.tx.slice().sort((x, y) => x.timestamp - y.timestamp); let run = 0; const byDay = {}; srt.forEach(t => { run += t.type === 'income' ? t.amount : -t.amount; byDay[new Date(t.timestamp).toLocaleDateString('en-CA')] = Math.round(run); });
        const dks = Object.keys(byDay), step = Math.max(1, Math.ceil(dks.length / 120)), pts = dks.filter((_, i) => i % step === 0 || i === dks.length - 1);
        draw('cxmCurve', { type: 'line', data: { labels: pts.map(d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })), datasets: [{ label: 'Balance', data: pts.map(d => byDay[d]), borderColor: '#38bdf8', backgroundColor: 'rgba(56,189,248,.14)', fill: true, tension: .25, pointRadius: 0, borderWidth: 2 }] }, options: ax({ plugins: { legend: { display: false } }, scales: { x: { ticks: { color: '#64748b', font: { size: 9 }, maxTicksLimit: 7, maxRotation: 0 }, grid: { display: false } }, y: { ticks: { color: '#64748b', maxTicksLimit: 5 }, grid: { color: 'rgba(255,255,255,.05)' } } } }) });
    }
    const uiPrev = window.updateUI;
    window.updateUI = function () { const r = uiPrev.apply(this, arguments); try { renderMacro(); } catch (e) { console.warn('macro charts', e); } return r; };
    const pad = n => String(n).padStart(2, '0');
    ['updateChartStack', 'updateStatsStack'].forEach(fn => { const o = window[fn]; if (typeof o !== 'function') return; window[fn] = function () { const r = o.apply(this, arguments); try { const chart = fn === 'updateChartStack', cards = document.querySelectorAll(chart ? '.chart-stack-card' : '.stats-stack-card'), i = [...cards].findIndex(c => c.classList.contains('active')), el = $(chart ? 'deckIndicator' : 'statsIndicator'); if (el && i >= 0) el.innerText = `${pad(i + 1)} / ${pad(cards.length)}`; } catch (e) {} return r; }; });
    // side cards are clickable, and both decks answer to swipes
    function deckInput() {
        [['chartDeckContainer', 'chart-stack-card', () => nextChartStack(), () => prevChartStack()], ['statsDeckContainer', 'stats-stack-card', () => nextStatsStack(), () => prevStatsStack()]].forEach(([id, cls, nx, pv]) => {
            const d = $(id); if (!d || d.dataset.cx) return; d.dataset.cx = '1';
            d.addEventListener('click', e => { const c = e.target.closest('.' + cls); if (!c) return; if (c.classList.contains('next-card')) nx(); else if (c.classList.contains('prev-card')) pv(); });
        });
        document.querySelectorAll('.chart-stack-card, .stats-stack-card').forEach(c => c.classList.remove('cx-rv', 'cx-on'));
    }

    // ==========================================================================
    // 3. C.A.S.P.E.R. SAYS "SIR"
    // ==========================================================================
    function sir(node) {
        if (!node || node.dataset.sir || /^(loader_|cxl_)/.test(node.id || '') && /Processing|Analysing/.test(node.textContent)) return;
        const t = node.textContent || ''; if (!t.trim() || /\bsir\b/i.test(t)) { node.dataset.sir = '1'; return; }
        node.dataset.sir = '1';
        const first = node.firstChild;
        if (first && first.nodeType === 3 && /^[A-Z][a-z]/.test(first.textContent) && !/^(I |I'|C\.A|Good|Sir)/.test(first.textContent)) first.textContent = 'Sir, ' + first.textContent.charAt(0).toLowerCase() + first.textContent.slice(1);
        else if (first && first.nodeType === 3 && /^Good (morning|afternoon|evening)\./.test(first.textContent)) first.textContent = first.textContent.replace(/^(Good \w+)\./, '$1, sir.');
        else node.insertAdjacentText('afterbegin', 'Sir, ');
    }
    function sirWatch() {
        const body = $('casperChatBody'); if (!body || body.dataset.sir) return; body.dataset.sir = '1';
        const scan = () => body.querySelectorAll('div.rounded-tl-none').forEach(n => { if (!/Processing\.\.\.|Analysing…/.test(n.textContent)) sir(n); });
        new MutationObserver(scan).observe(body, { childList: true, subtree: true, characterData: true }); scan();
        const inp = $('casperInput'); if (inp && /command|ask|query|type/i.test(inp.placeholder || '')) inp.placeholder = 'How may I assist, sir?';
    }
    const toastPrev = window.CX.toast;

    // ==========================================================================
    // 4. PRICE LOOKUP FOR PASTED LINKS (through a public web relay)
    // ==========================================================================
    const RELAYS = [u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u), u => 'https://corsproxy.io/?url=' + encodeURIComponent(u), u => 'https://r.jina.ai/' + u];
    const num = s => { const v = parseFloat(String(s || '').replace(/[^\d.]/g, '')); return v > 0 && v < 1e8 ? v : 0; };
    function extract(body, url) {
        const o = { title: '', price: 0, image: '', desc: '', type: '', genre: '', by: '' };
        if (!/<html|<head|<meta|<body/i.test(body)) {                                  // plain-text relay
            o.title = ((body.match(/^Title:\s*(.+)$/m) || [])[1] || (body.match(/^#\s+(.+)$/m) || [])[1] || '').trim();
            o.price = num((body.match(/(?:₹|Rs\.?|INR)\s?([\d,]+(?:\.\d{1,2})?)/) || [])[1]);
            o.image = (body.match(/!\[[^\]]*\]\((https?:[^)\s]+\.(?:jpg|jpeg|png|webp)[^)\s]*)\)/i) || [])[1] || '';
            return o;
        }
        const d = new DOMParser().parseFromString(body, 'text/html'), q = s => { const e = d.querySelector(s); return e ? (e.getAttribute('content') || e.textContent || '').trim() : ''; };
        let ld = null;
        d.querySelectorAll('script[type="application/ld+json"]').forEach(s => { try { const j = JSON.parse(s.textContent); (Array.isArray(j) ? j : [j].concat(j['@graph'] || [])).forEach(x => { if (x && /Product|Movie|Book|TVSeries/.test([].concat(x['@type'] || '').join()) && (!ld || x.offers)) ld = x; }); } catch (e) {} });
        if (ld) { const of = Array.isArray(ld.offers) ? ld.offers[0] : (ld.offers || {}); o.price = num(of.price || of.lowPrice || (of.priceSpecification || {}).price); let im = ld.image; if (Array.isArray(im)) im = im[0]; if (im && im.url) im = im.url; o.image = im || ''; o.title = ld.name || ''; o.desc = ld.description || ''; o.type = [].concat(ld['@type'] || '').join(); o.genre = [].concat(ld.genre || '').join(', '); const pn = x => { x = Array.isArray(x) ? x[0] : x; return x ? (x.name || x) : ''; }; o.by = String(pn(ld.author) || pn(ld.director) || ''); }
        o.title = o.title || q('meta[property="og:title"]') || q('#productTitle') || q('title');
        o.image = o.image || q('meta[property="og:image"]') || (d.querySelector('#landingImage') || { getAttribute: () => '' }).getAttribute('data-old-hires') || (d.querySelector('#landingImage') || { getAttribute: () => '' }).getAttribute('src') || '';
        o.desc = o.desc || q('meta[property="og:description"]') || q('meta[name="description"]');
        if (!o.price) o.price = num(q('meta[property="product:price:amount"]') || q('meta[property="og:price:amount"]') || q('meta[itemprop="price"]') || q('[itemprop="price"]'));
        if (!o.price) for (const s of ['.a-price .a-offscreen', '#priceblock_ourprice', '#priceblock_dealprice', '.a-price-whole', '.Nx9bqj', '._30jeq3', '.pdp-price', '[class*="selling-price"]', '[class*="final-price"]', '[class*="product-price"]', '[data-testid*="price"]']) { const v = num(q(s)); if (v) { o.price = v; break; } }
        if (!o.price) o.price = num((body.match(/"(?:selling_?price|final_?price|sale_?price|price)"\s*:\s*"?(\d[\d,.]*)"?/i) || [])[1]);
        if (!o.price) o.price = num((body.match(/(?:₹|&#8377;|Rs\.?)\s?([\d,]{3,}(?:\.\d{1,2})?)/) || [])[1]);
        o.title = o.title.replace(/\s*[-|–:]\s*(Amazon\.in|Amazon\.com|Flipkart\.com|IMDb|Goodreads|Myntra|MyAnimeList\.net).*$/i, '').replace(/^Buy\s+/i, '').replace(/\s+Online at.*$/i, '').replace(/\s+/g, ' ').trim().slice(0, 140);
        try { if (o.image && !/^https?:/.test(o.image)) o.image = new URL(o.image, url).href; } catch (e) {}
        return o;
    }
    async function lookup(url) {
        for (const mk of RELAYS) {
            try { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 9000); const r = await fetch(mk(url), { signal: ctl.signal }); clearTimeout(t); if (!r.ok) continue; const body = await r.text(); if (body.length < 300 || /captcha|robot check|access denied/i.test(body.slice(0, 3000))) continue; const o = extract(body, url); if (o.title || o.price) return o; } catch (e) {}
        }
        return null;
    }
    window.CXLookup = { extract, lookup };
    const deb = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
    function wire(linkId, kind) {
        const link = $(linkId); if (!link || link.dataset.cxl) return; link.dataset.cxl = '1';
        link.parentElement.insertAdjacentHTML('afterend', `<label class="cx-relay"><input type="checkbox" ${getJ('walletRelay', true) ? 'checked' : ''} onchange="localStorage.setItem('walletRelay', this.checked)"> Look up price and details online (sends the link to a public relay)</label>`);
        let last = '';
        link.addEventListener('input', deb(async () => {
            const url = link.value.trim(); if (!/^https?:\/\//.test(url) || url === last || !getJ('walletRelay', true)) return; last = url;
            const ic = $(kind === 'w' ? 'linkStatusIcon' : 'mediaLinkStatusIcon'); toast('Reading the page for price and details, sir…');
            const o = await lookup(url); if (link.value.trim() !== url) return;
            if (!o) return toast('The page could not be read from here, sir. Use the capture bookmark on that page for the price.', true);
            const set = (id, v, force) => { const e = $(id); if (e && v && (force || !String(e.value).trim())) e.value = v; };
            if (kind === 'w') { const nm = $('wishName'); if (o.title && nm && (!nm.value.trim() || nm.dataset.auto !== '0')) nm.value = o.title; set('wishPrice', o.price, true); set('wishImage', o.image, true); }
            else { const nm = $('mediaName'); if (o.title && nm) nm.value = o.title; set('mediaImage', o.image, true); set('mediaPrice', o.price); set('mediaDetails', [o.by, o.desc].filter(Boolean).join(' — ').slice(0, 240)); const ty = /TVSeries/.test(o.type) ? 'Series' : /Book/.test(o.type) ? 'Book' : /Movie/.test(o.type) ? 'Movie' : ''; if (ty && $('mediaType')) $('mediaType').value = ty; const g = $('mediaGenre'); if (g && o.genre) { const hit = [...g.options].find(op => o.genre.toLowerCase().includes(op.value.toLowerCase())); if (hit) g.value = hit.value; } }
            toast(o.price ? `Found it, sir: ${o.title.slice(0, 40)} at ${inr(o.price)}.` : `Details found, sir, but no price on that page. ${kind === 'w' ? 'Enter it by hand or use the capture bookmark.' : ''}`);
        }, 700));
    }

    // briefing is collapsed unless you have chosen to open it (runs before the page builds it)
    try { if (localStorage.getItem('walletIntroChosen') === null) setJ('walletIntroHidden', true); } catch (e) {}

    // ==========================================================================
    // BOOT
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion 5 boot step failed', e); } };
        // briefing is collapsed unless you have chosen to open it
        safe(() => { const t = window.CXFront.toggle; window.CXFront.toggle = function () { localStorage.setItem('walletIntroChosen', '1'); return t.apply(this, arguments); }; });
        safe(injectMacro); safe(() => wire('wishLink', 'w')); safe(() => wire('mediaLink', 'm')); safe(sirWatch);
        setTimeout(() => { safe(renderMacro); safe(deckInput); safe(() => updateChartStack()); safe(() => updateStatsStack()); safe(sirWatch); icons(); }, 1300);
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 6
// Type-or-pick date fields, pie chart and lifetime-trajectory repairs, deck
// buttons + drag/swipe, command bar with logo/clock/ticker, new typeface,
// logo set, footer, alignment pass for Wishlist and Library, new motion.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, todayStr, mKey, toast, balances, monthStats } = window.CX;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================================================
    // 0. TYPEFACE + ALIGNMENT + MOTION
    // ==========================================================================
    const font = document.createElement('link'); font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(font);
    const css = document.createElement('style');
    css.textContent = `
    body, button, input, select, textarea { font-family: 'Sora', 'Nunito', 'Fredoka', system-ui, sans-serif !important; }
    h1, h2, h3, h4, .bubbly-text, .nav-btn, .cx-display, .cx-h, .cx-btn, .cx-lbl, .cx-tile span, .cx-tile b, #globalTooltip, .cx-acro b, .cx-acro span, .text-\\[8px\\], .text-\\[9px\\], .text-\\[10px\\], .tracking-widest, .tracking-wider { font-family: 'Oxanium', 'Exo 2', 'Sora', sans-serif !important; }
    .tracking-widest { letter-spacing: .1em !important; }
    .cx-tile b { font-weight: 700; letter-spacing: .02em; }

    /* ---- alignment: tiles, bars and cards share one rhythm ---- */
    .cx-tile { display: flex; flex-direction: column; justify-content: space-between; min-height: 88px; }
    .cx-tile small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .cx-tile b { line-height: 1.15; margin: 4px 0; }
    #cxWishBar, #cxVaultBar { display: block; }
    .cx-bar-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 10px 12px; background: rgba(0,0,0,.4); border: 1px solid rgba(255,255,255,.07); border-radius: 12px; margin-top: 8px; }
    .cx-bar-row > .cx-lbl { margin: 0 4px 0 0; min-width: 52px; }
    .cx-bar-row .cx-btn.sm { min-width: 0; }
    #cxVaultSearch { flex: 1 1 220px; }
    #wishlistGrid, #mediaGrid { align-items: stretch; }
    #wishlistGrid > .glass-panel, #mediaGrid > .glass-panel { height: 100%; }
    #wishlistGrid > .glass-panel > div:last-child { display: flex; flex-direction: column; gap: 8px; flex: 1; }
    #wishlistGrid .h-40 { height: 170px; }
    #mediaGrid > .glass-panel > img, #mediaGrid > .glass-panel > div:first-child:not(.p-3) { width: 112px; min-height: 168px; }
    #wishlistGrid .cx-btn.sm, #mediaGrid .cx-btn.sm { text-align: center; }
    #viewWishlist form > *, #viewMedia form > * { min-width: 0; }
    #viewWishlist input, #viewWishlist select, #viewMedia input, #viewMedia select, #viewMedia textarea { box-sizing: border-box; width: 100%; }
    .cx-relay { margin: 8px 2px 12px !important; line-height: 1.35; } .cx-relay input { width: auto !important; flex: none; }
    #viewMedia form .grid, #viewWishlist form .grid { align-items: end; }
    [id^="cxCapture_"] ol { margin-top: 12px; }

    /* ---- date field ---- */
    .cx-date { position: relative; display: flex; width: 100%; }
    .cx-date > input.cx-date-txt { flex: 1; min-width: 0; padding-right: 40px !important; text-transform: none !important; letter-spacing: .04em !important; }
    .cx-date > input.cx-date-txt.bad { border-color: #ef4444 !important; box-shadow: 0 0 10px rgba(239,68,68,.4) !important; }
    .cx-date > button { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; color: #00e5ff; background: rgba(0,229,255,.08); border: 1px solid rgba(0,229,255,.3); }
    .cx-date > button:hover { background: #00e5ff; color: #000; }
    #cxCalPop { position: fixed; z-index: 2147483200; width: 276px; background: rgba(3,9,18,.98); border: 1px solid #00e5ff; border-radius: 14px; padding: 12px; box-shadow: 0 0 30px rgba(0,229,255,.3); animation: cxPopIn .16s ease; }
    @keyframes cxPopIn { from { opacity: 0; transform: translateY(-6px) scale(.97); } to { opacity: 1; transform: none; } }
    #cxCalPop .hd { display: flex; align-items: center; gap: 4px; margin-bottom: 8px; } #cxCalPop .hd b { flex: 1; text-align: center; font: 700 14px 'Oxanium', sans-serif; color: #fff; letter-spacing: .06em; text-transform: uppercase; }
    #cxCalPop .hd button, #cxCalPop .ft button { color: #00e5ff; border: 1px solid rgba(0,229,255,.3); background: rgba(0,229,255,.06); border-radius: 8px; padding: 4px 9px; font: 700 12px 'Oxanium', sans-serif; } #cxCalPop .hd button:hover, #cxCalPop .ft button:hover { background: #00e5ff; color: #000; }
    #cxCalPop .gr { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; } #cxCalPop .gr span { text-align: center; font: 700 10px 'Oxanium', sans-serif; color: #64748b; padding: 3px 0; }
    #cxCalPop .gr button { aspect-ratio: 1; border-radius: 8px; font: 600 12.5px 'Sora', sans-serif; color: #e2e8f0; border: 1px solid transparent; } #cxCalPop .gr button:hover { border-color: #00e5ff; background: rgba(0,229,255,.12); }
    #cxCalPop .gr button.td { border-color: rgba(0,229,255,.5); } #cxCalPop .gr button.on { background: #00e5ff; color: #000; font-weight: 800; box-shadow: 0 0 10px rgba(0,229,255,.6); } #cxCalPop .gr button.dim { color: #475569; }
    #cxCalPop .ft { display: flex; gap: 6px; margin-top: 10px; } #cxCalPop .ft button { flex: 1; }

    /* ---- telemetry decks: side cards recede so their text does not hover beside the active chart ---- */
    .chart-stack-card.prev-card, .chart-stack-card.next-card, .stats-stack-card.prev-card, .stats-stack-card.next-card { opacity: .13 !important; filter: saturate(.4); }
    .chart-stack-card, .stats-stack-card { overflow: hidden; }
    .chart-stack-container, .stats-stack-container { touch-action: pan-y pinch-zoom; cursor: grab; user-select: none; } .chart-stack-container.drag, .stats-stack-container.drag { cursor: grabbing; }
    .cx-deck-nav { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin: 2px auto 14px; max-width: 980px; padding: 0 8px; }
    .cx-deck-nav button { font: 700 10.5px 'Oxanium', sans-serif; letter-spacing: .09em; text-transform: uppercase; padding: 6px 11px; border-radius: 20px; color: #7dd3fc; border: 1px solid rgba(0,229,255,.25); background: rgba(0,0,0,.45); transition: all .2s; white-space: nowrap; }
    .cx-deck-nav button:hover { border-color: #00e5ff; color: #fff; transform: translateY(-1px); }
    .cx-deck-nav button.on { background: #00e5ff; color: #000; border-color: #00e5ff; box-shadow: 0 0 14px rgba(0,229,255,.55); }
    @media (max-width: 640px) { .cx-deck-nav { flex-wrap: nowrap; overflow-x: auto; justify-content: flex-start; scrollbar-width: none; padding-bottom: 4px; } .cx-deck-nav button { flex: none; } }
    #cxPieBox { position: absolute; inset: 6px; display: flex; align-items: center; justify-content: center; } #chartCenterText { width: auto !important; max-width: 62% !important; font-size: clamp(13px, 1.5vw, 19px) !important; line-height: 1.1; white-space: nowrap; }

    /* ---- command bar, logo, ticker, footer ---- */
    .cx-logo { flex: none; color: #00e5ff; filter: drop-shadow(0 0 8px rgba(0,229,255,.7)); }
    .cx-logo .ring { transform-origin: 32px 32px; animation: cxSpin 9s linear infinite; } .cx-logo .ring.rev { animation-duration: 6s; animation-direction: reverse; } .cx-logo .core { transform-origin: 32px 32px; animation: cxPulse 2.4s ease-in-out infinite; }
    @keyframes cxDraw { to { stroke-dashoffset: 0; } }
    #cxCmd { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 18px; overflow: hidden; }
    #cxCmd .hi { min-width: 0; flex: 1 1 240px; } #cxCmd .hi p { font: 700 11px 'Oxanium', sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #00e5ff; } #cxCmd .hi h3 { font: 700 clamp(17px, 2.2vw, 23px) 'Oxanium', sans-serif; color: #fff; letter-spacing: .03em; }
    #cxClock { text-align: right; flex: none; } #cxClock b { display: block; font: 700 clamp(22px, 3vw, 32px) 'Oxanium', sans-serif; color: #fff; text-shadow: 0 0 14px rgba(0,229,255,.6); font-variant-numeric: tabular-nums; letter-spacing: .06em; line-height: 1; } #cxClock b i { font-style: normal; animation: cxBlink 1s steps(2) infinite; }
    #cxClock small { font: 600 10.5px 'Oxanium', sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #94a3b8; }
    @keyframes cxBlink { 50% { opacity: .25; } }
    #cxTicker { flex: 1 1 100%; overflow: hidden; border-top: 1px solid rgba(0,229,255,.18); padding-top: 10px; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
    #cxTicker > div { display: inline-flex; gap: 34px; white-space: nowrap; animation: cxMarq 38s linear infinite; padding-left: 100%; } #cxTicker:hover > div { animation-play-state: paused; }
    #cxTicker span { font: 600 11.5px 'Oxanium', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #94a3b8; } #cxTicker span b { color: #fff; font-weight: 700; margin-left: 6px; }
    @keyframes cxMarq { to { transform: translateX(-100%); } }
    #cxDock { display: flex; gap: 6px; flex-wrap: wrap; flex: 1 1 100%; }
    #cxFoot { margin-top: 26px; padding: 18px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    #cxFoot .mods { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; } #cxFoot .mods button { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.45); transition: all .2s; } #cxFoot .mods button:hover { transform: translateY(-3px) rotate(-4deg); border-color: currentColor; box-shadow: 0 0 14px currentColor; }
    #cxFoot .mods svg { width: 18px; height: 18px; }
    #cxFoot p { font: 600 11px 'Oxanium', sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #64748b; } #cxFoot p b { color: #cbd5e1; }
    #cxSplash { position: fixed; inset: 0; z-index: 2147483640; background: #030508; display: grid; place-items: center; transition: opacity .45s ease; } #cxSplash.out { opacity: 0; pointer-events: none; }
    #cxSplash div { text-align: center; } #cxSplash h1 { font: 800 26px 'Oxanium', sans-serif !important; letter-spacing: .3em; color: #fff; margin-top: 16px; text-shadow: 0 0 18px #00e5ff; } #cxSplash p { font: 600 11px 'Oxanium', sans-serif; letter-spacing: .24em; color: #00e5ff; text-transform: uppercase; margin-top: 8px; }
    #cxSplash .ld { width: 200px; height: 3px; margin: 18px auto 0; background: rgba(0,229,255,.15); border-radius: 3px; overflow: hidden; } #cxSplash .ld i { display: block; height: 100%; width: 40%; background: #00e5ff; box-shadow: 0 0 12px #00e5ff; animation: cxLoad 1.1s ease-in-out infinite; }
    @keyframes cxLoad { from { transform: translateX(-110%); } to { transform: translateX(280%); } }

    /* ---- extra motion ---- */
    .cx-btn::after { content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.28), transparent); transform: skewX(-20deg); opacity: 0; pointer-events: none; }
    @media (hover: hover) { .cx-btn:hover::after { animation: cxSheen .6s ease; } }
    @keyframes cxSheen { from { left: -60%; opacity: 1; } to { left: 130%; opacity: 1; } }
    .nav-btn.active { position: relative; } .nav-btn.active::after { content: ''; position: absolute; left: 14%; right: 14%; bottom: 3px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, #00e5ff, transparent); animation: cxUnder 2.2s ease-in-out infinite; }
    @keyframes cxUnder { 0%,100% { opacity: .4; transform: scaleX(.6); } 50% { opacity: 1; transform: scaleX(1); } }
    .cx-tick { animation: cxTick .5s ease; } @keyframes cxTick { from { transform: translateY(6px); opacity: .3; } to { transform: none; opacity: 1; } }
    #wishlistGrid > .glass-panel, #mediaGrid > .glass-panel { animation: cxCard .45s ease both; } @keyframes cxCard { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: none; } }
    .info-icon svg { transition: transform .3s; } .info-icon:hover svg { transform: rotate(18deg) scale(1.15); }
    @media (prefers-reduced-motion: reduce) { #cxTicker > div, .cx-logo .ring, .nav-btn.active::after, #cxClock b i, #wishlistGrid > .glass-panel, #mediaGrid > .glass-panel { animation: none !important; } .cx-logo .w { stroke-dashoffset: 0; animation: none; } #cxTicker > div { padding-left: 0; flex-wrap: wrap; white-space: normal; gap: 8px 24px; } }
    @media (max-width: 640px) { #cxClock { text-align: left; } #cxFoot .mods { margin-left: 0; } .cx-bar-row > .cx-lbl { min-width: 100%; } }
    `;
    document.head.appendChild(css);
    try { if (typeof Chart !== 'undefined') Chart.defaults.font.family = "'Sora', 'Nunito', sans-serif"; } catch (e) {}

    const LOGO = size => `<svg class="cx-logo" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-label="C.A.S.P.E.R. core"><circle cx="32" cy="32" r="29" stroke-width="1" opacity=".35"/><g class="ring"><circle cx="32" cy="32" r="25" stroke-width="2.6" stroke-dasharray="30 13 6 13" stroke-linecap="round"/></g><g class="ring rev"><circle cx="32" cy="32" r="18" stroke-width="1.3" stroke-dasharray="3 6" opacity=".85"/></g><circle class="core" cx="32" cy="32" r="9" fill="currentColor" stroke="none" opacity=".2"/><path d="M22 32 h5 l3 -7 4 14 3 -9 2 2 h5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // ==========================================================================
    // 1. DATE FIELDS: type it or pick it
    // ==========================================================================
    const MON = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const iso = d => d.toLocaleDateString('en-CA');
    const show = v => { if (!v) return ''; const [y, m, d] = v.split('-'); return `${d}-${m}-${y}`; };
    function parseDate(txt) {
        const t = String(txt || '').trim().toLowerCase(), now = new Date(); if (!t) return null;
        const mk = (y, m, d) => { y = Number(y); if (y < 100) y += 2000; const dt = new Date(y, m, Number(d), 12); return (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === Number(d) && y > 1990 && y < 2100) ? iso(dt) : null; };
        if (t === 'today' || t === 'now') return iso(now);
        if (t === 'yesterday') { now.setDate(now.getDate() - 1); return iso(now); }
        if (t === 'tomorrow') { now.setDate(now.getDate() + 1); return iso(now); }
        let m = t.match(/^([+-])\s?(\d{1,3})$/); if (m) { now.setDate(now.getDate() + (m[1] === '+' ? 1 : -1) * Number(m[2])); return iso(now); }
        m = t.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/); if (m) return mk(m[1], m[2] - 1, m[3]);
        m = t.match(/^(\d{1,2})[-\/. ](\d{1,2})(?:[-\/. ](\d{2,4}))?$/); if (m) return mk(m[3] || now.getFullYear(), m[2] - 1, m[1]);
        m = t.match(/^(\d{2})(\d{2})(\d{4}|\d{2})$/); if (m) return mk(m[3], m[2] - 1, m[1]);
        m = t.match(/^(\d{1,2})(?:st|nd|rd|th)?[-\/. ]*([a-z]{3})[a-z]*[-\/., ]*(\d{2,4})?$/); if (m && MON.includes(m[2])) return mk(m[3] || now.getFullYear(), MON.indexOf(m[2]), m[1]);
        m = t.match(/^([a-z]{3})[a-z]*[-\/. ]*(\d{1,2})(?:st|nd|rd|th)?[-\/., ]*(\d{4})?$/); if (m && MON.includes(m[1])) return mk(m[3] || now.getFullYear(), MON.indexOf(m[1]), m[2]);
        m = t.match(/^(\d{1,2})$/); if (m) return mk(now.getFullYear(), now.getMonth(), m[1]);
        return null;
    }
    let pop = null;
    function closeCal() { if (pop) { pop.remove(); pop = null; } }
    function openCal(src, txt) {
        closeCal(); const base = src.value ? new Date(src.value + 'T12:00') : new Date(); let y = base.getFullYear(), mo = base.getMonth();
        pop = document.createElement('div'); pop.id = 'cxCalPop'; document.body.appendChild(pop);
        const paint = () => {
            const first = (new Date(y, mo, 1).getDay() + 6) % 7, days = new Date(y, mo + 1, 0).getDate(), prevDays = new Date(y, mo, 0).getDate(); let cells = '';
            for (let i = first; i > 0; i--) cells += `<button type="button" class="dim" data-d="${iso(new Date(y, mo - 1, prevDays - i + 1))}">${prevDays - i + 1}</button>`;
            for (let d = 1; d <= days; d++) { const k = iso(new Date(y, mo, d)); cells += `<button type="button" class="${k === todayStr() ? 'td' : ''} ${k === src.value ? 'on' : ''}" data-d="${k}">${d}</button>`; }
            const rest = (7 - (first + days) % 7) % 7; for (let d = 1; d <= rest; d++) cells += `<button type="button" class="dim" data-d="${iso(new Date(y, mo + 1, d))}">${d}</button>`;
            pop.innerHTML = `<div class="hd"><button type="button" data-n="-12" title="Previous year">«</button><button type="button" data-n="-1" title="Previous month">‹</button><b>${new Date(y, mo).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</b><button type="button" data-n="1" title="Next month">›</button><button type="button" data-n="12" title="Next year">»</button></div>
                <div class="gr">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(x => `<span>${x}</span>`).join('')}${cells}</div><div class="ft"><button type="button" data-d="${todayStr()}">Today</button><button type="button" data-d="${iso(new Date(Date.now() - 86400000))}">Yesterday</button><button type="button" data-x="1">Close</button></div>`;
        };
        paint();
        const r = txt.getBoundingClientRect(); let left = Math.min(window.innerWidth - 284, Math.max(8, r.left)), top = r.bottom + 6; if (top + 330 > window.innerHeight) top = Math.max(8, r.top - 336);
        pop.style.left = left + 'px'; pop.style.top = top + 'px';
        pop.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; e.stopPropagation(); if (b.dataset.x) return closeCal(); if (b.dataset.n) { mo += Number(b.dataset.n); y += Math.floor(mo / 12); mo = ((mo % 12) + 12) % 12; return paint(); } if (b.dataset.d) { setDate(src, txt, b.dataset.d); closeCal(); } });
    }
    function setDate(src, txt, v) { src.value = v; txt.value = show(v); txt.classList.remove('bad'); src.dispatchEvent(new Event('input', { bubbles: true })); src.dispatchEvent(new Event('change', { bubbles: true })); }
    function enhance(src) {
        if (src.dataset.cxd || src.type !== 'date') return; src.dataset.cxd = '1';
        const wrap = document.createElement('span'); wrap.className = 'cx-date'; src.parentNode.insertBefore(wrap, src);
        const txt = document.createElement('input'); txt.type = 'text'; txt.className = src.className + ' cx-date-txt'; txt.placeholder = 'DD-MM-YYYY'; txt.autocomplete = 'off'; txt.inputMode = 'text'; txt.title = 'Type a date (03-10-2026, 3 oct, today, yesterday, -2) or use the calendar'; txt.value = show(src.value);
        const btn = document.createElement('button'); btn.type = 'button'; btn.title = 'Open calendar'; btn.setAttribute('aria-label', 'Open calendar'); btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
        wrap.appendChild(txt); wrap.appendChild(btn); wrap.appendChild(src); src.style.display = 'none'; src._cxTxt = txt;
        const commit = () => { const raw = txt.value.trim(); if (!raw) { if (src.required) { txt.value = show(src.value); return; } src.value = ''; src.dispatchEvent(new Event('change', { bubbles: true })); return; } const v = parseDate(raw); if (v) setDate(src, txt, v); else { txt.classList.add('bad'); toast('That date was not understood. Try 03-10-2026, 3 oct or today.', true); } };
        txt.addEventListener('blur', () => { if (txt.classList.contains('bad')) { txt.classList.remove('bad'); txt.value = show(src.value); } else if (txt.value.trim() !== show(src.value)) commit(); });
        txt.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commit(); closeCal(); } else if (e.key === 'ArrowDown' && !pop) { e.preventDefault(); openCal(src, txt); } else if (e.key === 'Escape') closeCal(); });
        txt.addEventListener('input', () => txt.classList.remove('bad'));
        btn.addEventListener('click', e => { e.stopPropagation(); if (pop) closeCal(); else openCal(src, txt); });
    }
    function enhanceAll() { document.querySelectorAll('input[type="date"]:not([data-cxd])').forEach(enhance); }
    document.addEventListener('click', e => { if (pop && !e.target.closest('#cxCalPop')) closeCal(); });
    window.addEventListener('scroll', () => closeCal(), { passive: true });
    setInterval(() => document.querySelectorAll('input[data-cxd]').forEach(s => { const t = s._cxTxt; if (t && document.activeElement !== t && !t.classList.contains('bad') && t.value !== show(s.value)) t.value = show(s.value); }), 600);
    const syncDates = () => document.querySelectorAll('input[data-cxd]').forEach(s => { const t = s._cxTxt; if (t && document.activeElement !== t && t.value !== show(s.value)) { t.classList.remove('bad'); t.value = show(s.value); } });
    ['openEditModal', 'switchMainView'].forEach(fn => { const o = window[fn]; if (typeof o === 'function') window[fn] = function () { const r = o.apply(this, arguments); try { enhanceAll(); syncDates(); } catch (e) {} return r; }; });
    window.CXDate = { parse: parseDate, enhanceAll };

    // ==========================================================================
    // 2. REPAIRS: pie chart, lifetime trajectory, every pop-up closes
    // ==========================================================================
    function fixPie() {
        const c = $('walletChart'); if (!c) return;
        if (!$('cxPieBox')) { const box = document.createElement('div'); box.id = 'cxPieBox'; c.parentNode.insertBefore(box, c); box.appendChild(c); }
        try { if (donutChart) { donutChart.options.maintainAspectRatio = false; donutChart.options.cutout = '72%'; donutChart.options.layout = { padding: 6 }; donutChart.resize(); donutChart.update('none'); } } catch (e) {}
    }
    const piePrev = window.updatePieChart;
    if (typeof piePrev === 'function') window.updatePieChart = function () {
        const r = piePrev.apply(this, arguments);
        try {
            const ct = $('chartCenterText'); if (ct) { const v = parseFloat(ct.innerText.replace(/[^\d.]/g, '')) || 0; ct.innerText = v >= 1e7 ? '₹' + (v / 1e7).toFixed(2) + ' Cr' : v >= 1e5 ? '₹' + (v / 1e5).toFixed(2) + ' L' : inr(v); ct.classList.remove('truncate'); }
            const ti = $('topInsights'); if (ti) ti.querySelectorAll('span.text-gray-400').forEach(s => { s.textContent = s.textContent.replace(/₹(\d+(?:\.\d+)?)/, (_, n) => inr(n)); });
        } catch (e) {}
        return r;
    };

    // lifetime trajectory: weekly points once the history is long, and it can always be closed
    window.openAllTimeChart = function () {
        const m = $('allTimeModal'); if (!m) return; m.classList.remove('hidden');
        try {
            const tx = transactions.filter(t => t.account !== 'Emergency' && Number.isFinite(t.timestamp) && t.timestamp > 946684800000).sort((a, b) => a.timestamp - b.timestamp);
            const span = tx.length ? (Date.now() - tx[0].timestamp) / 86400000 : 0, step = span > 730 ? 'month' : span > 150 ? 'week' : 'day', buckets = new Map();
            const keyOf = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); if (step === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); if (step === 'month') d.setDate(1); return d.getTime(); };
            if (tx.length) { const end = keyOf(Date.now()); for (let d = new Date(keyOf(tx[0].timestamp)); d.getTime() <= end; step === 'month' ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + (step === 'week' ? 7 : 1))) buckets.set(d.getTime(), { i: 0, e: 0 }); }
            tx.forEach(t => { const b = buckets.get(keyOf(t.timestamp)); if (b) { if (t.type === 'income') b.i += t.amount; else b.e += t.amount; } });
            const ks = [...buckets.keys()]; let run = 0; const net = ks.map(k => { const b = buckets.get(k); run += b.i - b.e; return Math.round(run); });
            const lab = ks.map(k => new Date(k).toLocaleDateString('en-GB', step === 'month' ? { month: 'short', year: '2-digit' } : { day: 'numeric', month: 'short', year: '2-digit' }));
            if (allTimeChartObj) allTimeChartObj.destroy();
            allTimeChartObj = new Chart($('allTimeChartCanvas'), { data: { labels: lab, datasets: [
                { type: 'line', label: 'Income', data: ks.map(k => Math.round(buckets.get(k).i)), borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.1)', fill: true, tension: .3, pointRadius: 0, borderWidth: 2 },
                { type: 'line', label: 'Expense', data: ks.map(k => Math.round(buckets.get(k).e)), borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,.1)', fill: true, tension: .3, pointRadius: 0, borderWidth: 2 },
                { type: 'line', label: 'Running balance', data: net, borderColor: '#00e5ff', borderDash: [6, 4], tension: .25, pointRadius: 0, borderWidth: 2, yAxisID: 'b' }] },
                options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, scales: { x: { grid: { display: false }, ticks: { color: '#00e5ff', maxTicksLimit: 10, maxRotation: 0 } }, y: { grid: { color: 'rgba(0,229,255,.1)' }, ticks: { color: '#00e5ff' } }, b: { position: 'right', grid: { display: false }, ticks: { color: '#7dd3fc' } } }, plugins: { legend: { display: true, position: 'top', labels: { color: '#fff', usePointStyle: true, boxWidth: 8, boxHeight: 8 } }, title: { display: true, text: `Per ${step} • ${tx.length} transactions`, color: '#94a3b8', font: { size: 11 } } } } });
        } catch (e) { console.warn('lifetime chart', e); }
    };
    // every full-screen pop-up: click the dark backdrop or press Esc to leave; close buttons sit above everything inside
    const MODALS = ['allTimeModal', 'expandedChartModal', 'aiReportModal', 'bulkSmsModal', 'csvReviewModal', 'editModal', 'editWishlistModal', 'editKeepModal'];
    const CLOSERS = { allTimeModal: 'closeAllTimeChart', expandedChartModal: 'closeChartModal', aiReportModal: 'closeAIReport', bulkSmsModal: 'closeBulkSMSModal', csvReviewModal: 'closeCSVModal', editModal: 'closeEditModal', editWishlistModal: 'closeEditWishlistModal', editKeepModal: 'closeEditKeepModal' };
    const shut = id => { const m = $(id); if (!m || m.classList.contains('hidden')) return false; try { window[CLOSERS[id]](); } catch (e) {} m.classList.add('hidden'); return true; };
    function modalSafety() {
        MODALS.forEach(id => { const m = $(id); if (!m || m.dataset.cxm) return; m.dataset.cxm = '1'; m.style.zIndex = '2147482000';
            m.addEventListener('mousedown', e => { if (e.target === m) shut(id); });
            m.querySelectorAll('button[onclick^="close"]').forEach(b => { b.style.position = 'relative'; b.style.zIndex = '60'; b.style.pointerEvents = 'auto'; });
            if (!m.querySelector('.cx-esc')) { const h = document.createElement('button'); h.type = 'button'; h.className = 'cx-btn sm cx-esc'; h.textContent = 'Close ✕'; h.style.cssText = 'position:fixed;top:12px;right:12px;z-index:70;background:rgba(3,9,18,.95)'; h.onclick = () => shut(id); m.appendChild(h); } });
    }
    document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; closeCal(); for (const id of MODALS) if (shut(id)) break; }, true);

    // ==========================================================================
    // 3. TELEMETRY DECKS: jump buttons, drag, swipe, arrow keys
    // ==========================================================================
    const DECKS = [{ id: 'statsDeckContainer', cls: 'stats-stack-card', get: () => statsChartIdx, set: i => { statsChartIdx = i; updateStatsStack(); }, title: c => (c.querySelector('p') || c).textContent.trim() },
        { id: 'chartDeckContainer', cls: 'chart-stack-card', get: () => currentChartIdx, set: i => { currentChartIdx = i; updateChartStack(); }, title: c => (c.querySelector('h3') || c).childNodes[0].textContent.trim() || (c.querySelector('h3') || c).textContent.trim() }];
    function deckNav() {
        DECKS.forEach(D => {
            const box = $(D.id); if (!box) return; const cards = [...box.querySelectorAll('.' + D.cls)], row = box.parentElement;
            let nav = $(D.id + 'Nav'); if (!nav) { row.insertAdjacentHTML('afterend', `<div class="cx-deck-nav" id="${D.id}Nav" role="tablist"></div>`); nav = $(D.id + 'Nav'); nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) D.set(Number(b.dataset.i)); }); }
            if (nav.children.length !== cards.length) nav.innerHTML = cards.map((c, i) => `<button type="button" data-i="${i}" role="tab">${esc(D.title(c).slice(0, 22))}</button>`).join('');
            const cur = D.get(); [...nav.children].forEach((b, i) => b.classList.toggle('on', i === cur));
            const on = nav.children[cur]; if (on && nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: on.offsetLeft - nav.clientWidth / 2 + on.offsetWidth / 2, behavior: 'smooth' });
            if (!box.dataset.drag) {
                box.dataset.drag = '1'; let x0 = null, y0 = 0, moved = false;
                const go = dir => { const n = cards.length; D.set((D.get() + dir + n) % n); };
                box.addEventListener('pointerdown', e => { if (e.target.closest('button, select, a, input')) return; x0 = e.clientX; y0 = e.clientY; moved = false; box.classList.add('drag'); });
                window.addEventListener('pointerup', e => { if (x0 === null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; box.classList.remove('drag'); if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { moved = true; go(dx < 0 ? 1 : -1); } });
                window.addEventListener('pointercancel', () => { x0 = null; box.classList.remove('drag'); });
                box.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
                box.tabIndex = 0; box.style.outline = 'none';
                box.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
            }
        });
    }
    // charts measure their box while the card is still mid-rotation and come out undersized; size them again from the
    // untransformed box once the card has landed
    function refit() { const card = document.querySelector('.chart-stack-card.active'); if (!card || typeof Chart === 'undefined') return; card.querySelectorAll('canvas').forEach(cv => { const ch = Chart.getChart(cv), box = cv.parentElement; if (ch && box.clientWidth > 20 && box.clientHeight > 20) { try { ch.options.maintainAspectRatio = false; ch.resize(box.clientWidth, box.clientHeight); } catch (e) {} } }); }
    let refitT;
    ['updateChartStack', 'updateStatsStack'].forEach(fn => { const o = window[fn]; if (typeof o !== 'function') return; window[fn] = function () { const r = o.apply(this, arguments); try { deckNav(); if (fn === 'updateChartStack') { clearTimeout(refitT); refit(); refitT = setTimeout(refit, 780); } } catch (e) {} return r; }; });
    window.addEventListener('resize', () => { clearTimeout(refitT); refitT = setTimeout(refit, 300); });

    // ==========================================================================
    // 4. COMMAND BAR (front page), FOOTER, FAVICON, SPLASH
    // ==========================================================================
    const greet = () => { const h = new Date().getHours(); return h < 5 ? 'Working late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 22 ? 'Good evening' : 'Good night'; };
    const LINES = ['All systems nominal.', 'Ledger synchronised on this device.', 'Standing by for instructions.', 'Budget guard active.', 'Reserves under watch.'];
    function ticker() {
        const st = monthStats(), b = balances(); let due = 0, mode = null, wish = 0, lib = 0;
        try { due = getJ('walletTasks', []).filter(t => !t.done && t.due && t.due <= todayStr()).length; } catch (e) {}
        try { mode = window.CXGrowth.mode(); } catch (e) {} try { wish = wishlistItems.filter(w => !w.purchased).length; lib = mediaItems.filter(m => m.mediaStatus === 'In Progress').length; } catch (e) {}
        const done = (() => { try { return (habitHistory[todayStr()] || []).length + ' / ' + customHabits.length; } catch (e) { return '—'; } })();
        const it = [['Liquid assets', inr(b.liquid)], ['Safe to spend today', inr(st.safe)], ['Spent this month', `${inr(st.spent)} (${Math.round(st.spent / st.budget * 100)}% of budget)`], ['Projected month-end', (() => { try { return inr(window.CXReport.model().proj); } catch (e) { return inr(st.proj); } })()], ['Emergency fund', inr(b.ef)], ['Tasks due', String(due)], ['Habits today', done], ['Mode', mode ? mode.name : 'not set'], ['Wishlist items', String(wish)], ['Library in progress', String(lib)]];
        return it.map(i => `<span>${i[0]}<b>${esc(i[1])}</b></span>`).join('');
    }
    function command() {
        const dash = $('viewDashboard'); if (!dash) return;
        if (!$('cxCmd')) dash.insertAdjacentHTML('afterbegin', `<div id="cxCmd" class="glass-panel"><div class="hi"><p id="cxCmdLine"></p><h3 id="cxCmdHi"></h3></div><div id="cxClock"><b id="cxClockT">--:--</b><small id="cxClockD"></small></div></div>`);
        $('cxCmdHi').textContent = `${greet()}, sir`; $('cxCmdLine').textContent = 'C.A.S.P.E.R.';
    }
    function clock() { const t = $('cxClockT'); if (!t) return; const n = new Date(); t.innerHTML = `${String(n.getHours()).padStart(2, '0')}<i>:</i>${String(n.getMinutes()).padStart(2, '0')}`; $('cxClockD').textContent = n.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }); if (n.getSeconds() < 1 || !$('cxCmdHi').textContent.startsWith(greet())) $('cxCmdHi').textContent = `${greet()}, sir`; }
    const MODS = [['dashboard', '#00e5ff', 'activity', 'Dashboard'], ['investments', '#fbbf24', 'pie-chart', 'Investments'], ['wishlist', '#38bdf8', 'target', 'Wishlist'], ['media', '#a855f7', 'library', 'Library'], ['workspace', '#34d399', 'pen-tool', 'Workspace'], ['growth', '#f97316', 'zap', 'Growth'], ['planner', '#f472b6', 'calendar-check', 'Planner']];
    function footer() {
        const main = $('mainContainer'); if (!main || $('cxFoot')) return;
        let used = 0; try { for (const k in localStorage) if (Object.prototype.hasOwnProperty.call(localStorage, k)) used += (localStorage[k].length + k.length) * 2; } catch (e) {}
        main.insertAdjacentHTML('afterend', `<footer id="cxFoot" class="glass-panel">${LOGO(40)}<div><p><b>Wally MK 3</b> • C.A.S.P.E.R. protocol</p><p>Running on this device • ${(used / 1048576).toFixed(2)} MB of local storage in use</p></div><div class="mods">${MODS.map(m => `<button title="${m[3]}" aria-label="${m[3]}" style="color:${m[1]}" onclick="switchMainView('${m[0]}');window.scrollTo({top:0,behavior:'smooth'})"><i data-lucide="${m[2]}"></i></button>`).join('')}</div></footer>`);
    }
    function brand() {
        if (!document.querySelector('link[rel="icon"]')) { const l = document.createElement('link'); l.rel = 'icon'; l.href = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050507"/><circle cx="32" cy="32" r="23" fill="none" stroke="#00e5ff" stroke-width="4" stroke-dasharray="34 12 8 12" stroke-linecap="round"/><circle cx="32" cy="32" r="9" fill="#00e5ff"/></svg>`); document.head.appendChild(l); }
        const h1 = document.querySelector('header h1'); if (h1 && !document.querySelector('header .cx-logo')) { const holder = h1.closest('.flex.items-center') || h1.parentElement.parentElement; holder.insertAdjacentHTML('afterbegin', `<span style="margin-right:12px;display:inline-flex">${LOGO(44)}</span>`); }
    }
    function splash() {
        if (reduce || sessionStorage.getItem('cxSplash')) return; sessionStorage.setItem('cxSplash', '1');
        const s = document.createElement('div'); s.id = 'cxSplash'; s.innerHTML = `<div>${LOGO(96)}<h1>WALLY MK 3</h1><p>C.A.S.P.E.R. coming online</p><div class="ld"><i></i></div></div>`; document.body.appendChild(s);
        const out = () => { s.classList.add('out'); setTimeout(() => s.remove(), 500); }; s.onclick = out; setTimeout(out, 1500);
    }

    // ==========================================================================
    // 5. WISHLIST + LIBRARY BARS: tidy rows
    // ==========================================================================
    function tidyBars() {
        const v = $('cxVaultBar'); if (v) { const row = v.querySelector(':scope > .flex'); if (row && !row.dataset.tidy) { row.dataset.tidy = '1'; const kids = [...row.children], s = kids.find(k => k.id === 'cxVaultSearch'), pick = kids.find(k => /Pick for me/.test(k.textContent)), div = kids.find(k => k.tagName === 'SPAN'); const types = [], stats = []; let after = false; kids.forEach(k => { if (k === s || k === pick) return; if (k === div) { after = true; return; } (after ? stats : types).push(k); });
            const r1 = document.createElement('div'), r2 = document.createElement('div'), r3 = document.createElement('div'); [r1, r2, r3].forEach(r => r.className = 'cx-bar-row');
            if (s) r1.appendChild(s); if (pick) r1.appendChild(pick); r2.innerHTML = '<span class="cx-lbl">Type</span>'; types.forEach(k => r2.appendChild(k)); r3.innerHTML = '<span class="cx-lbl">Status</span>'; stats.forEach(k => r3.appendChild(k)); if (div) div.remove();
            row.className = ''; row.style.cssText = ''; row.appendChild(r1); row.appendChild(r2); row.appendChild(r3); } }
        const w = $('cxWishBar'); if (w) { const row = w.querySelector(':scope > .flex'); if (row && !row.classList.contains('cx-bar-row')) { row.className = 'cx-bar-row'; } }
    }
    ['renderMedia', 'renderWishlist'].forEach(fn => { const o = window[fn]; if (typeof o !== 'function') return; window[fn] = function () { const had = document.activeElement && document.activeElement.id === 'cxVaultSearch'; const r = o.apply(this, arguments); try { tidyBars(); if (had) { const s = $('cxVaultSearch'); if (s) { s.focus(); s.setSelectionRange(s.value.length, s.value.length); } } } catch (e) {} return r; }; });

    const uiPrev = window.updateUI;
    window.updateUI = function () { const r = uiPrev.apply(this, arguments); try { if ($('cxTickerIn')) $('cxTickerIn').innerHTML = ticker(); } catch (e) {} return r; };

    try { splash(); } catch (e) {}
    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion 6 boot step failed', e); } };
        safe(brand); safe(enhanceAll); safe(modalSafety);
        safe(() => new MutationObserver(() => { clearTimeout(enhanceAll._t); enhanceAll._t = setTimeout(() => { enhanceAll(); }, 120); }).observe(document.body, { childList: true, subtree: true }));
        setTimeout(() => { safe(command); safe(clock); safe(footer); safe(fixPie); safe(() => updatePieChart()); safe(deckNav); safe(tidyBars); safe(modalSafety); safe(() => { renderWishlist(); renderMedia(); }); icons(); }, 1500);
        setInterval(() => { try { clock(); } catch (e) {} }, 1000);
    });
})();


// ==============================================================================
// WALLY MK 3 — EXPANSION PACK 7
// Data vault (full backup, automatic snapshots, safe merge with a server),
// cloud link, reminders, heatmap for any month, colour per tab, ring emblems,
// command palette, quick-add, phone tab bar.
// Additive: nothing above this block is modified.
// ==============================================================================
(function () {
    'use strict';
    const { $, esc, inr, getJ, setJ, icons, todayStr, mKey, toast, balances, monthStats, hud } = window.CX;
    const TXK = 'walletTransactionsBackupV2';
    const pad = n => String(n).padStart(2, '0');

    // ==========================================================================
    // 0. CHANGE TRACKING (records when each saved item last changed, for syncing)
    // ==========================================================================
    const SKIP = new Set([TXK, 'walletWishlistBackup', 'walletMediaBackup', 'walletWbLocal', 'walletArt', 'walletCloudKey', 'walletCaptureLog', 'walletIntroHidden', 'walletIntroChosen', 'walletNotifLast', 'walletDeleted', 'walletCloudLinked', 'walletRelay', 'walletGrowthLevel', 'walletNotifLog', 'walletSnapDay', 'walletFillTried', 'walletHeatCfg', 'walletItemMT']);
    const tracked = k => /^(wallet|levelup_home)/.test(k) || k === 'keepNotes';
    const synced = k => tracked(k) && !SKIP.has(k);
    const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
    if (!Storage.prototype._cx) {
        Storage.prototype._cx = true;
        const stamp = k => { try { const m = JSON.parse(localStorage.getItem('cxMT') || '{}'); m[k] = Date.now(); rawSet.call(localStorage, 'cxMT', JSON.stringify(m)); } catch (e) {} try { window.__cxPoke && window.__cxPoke(); } catch (e) {} };
        Storage.prototype.setItem = function (k, v) { if (this === localStorage && synced(k) && this.getItem(k) !== String(v)) stamp(k); return rawSet.apply(this, arguments); };
        Storage.prototype.removeItem = function (k) { if (this === localStorage && synced(k)) stamp(k); return rawRemove.apply(this, arguments); };
    }
    const MT = () => { try { return JSON.parse(localStorage.getItem('cxMT') || '{}'); } catch (e) { return {}; } };

    // ==========================================================================
    // 1. DATA VAULT — nothing gets lost
    // ==========================================================================
    const appKeys = () => Object.keys(localStorage).filter(k => tracked(k) || k === 'workspaceHistory' || k === 'cxMT' || k === 'levelup_art');
    const dump = () => { const d = {}; appKeys().forEach(k => d[k] = localStorage.getItem(k)); return d; };
    const idb = () => new Promise((res, rej) => { const r = indexedDB.open('wallyVault', 1); r.onupgradeneeded = () => r.result.createObjectStore('snaps', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
    const idbDo = async (mode, fn) => { const db = await idb(); return new Promise((res, rej) => { const tx = db.transaction('snaps', mode), st = tx.objectStore('snaps'), rq = fn(st); tx.oncomplete = () => res(rq && rq.result); tx.onerror = () => rej(tx.error); }); };
    async function snapshot(label) {
        try { saveTransactionsLocally(); } catch (e) {}
        const data = dump(), n = (() => { try { return JSON.parse(data[TXK] || '[]').length; } catch (e) { return 0; } })();
        await idbDo('readwrite', s => s.put({ id: Date.now(), label: label || 'Automatic', n, data }));
        const all = (await idbDo('readonly', s => s.getAll())) || []; all.sort((a, b) => b.id - a.id);
        for (const old of all.slice(20)) await idbDo('readwrite', s => s.delete(old.id));
        setJ('walletSnapDay', todayStr());
    }
    const snaps = async () => ((await idbDo('readonly', s => s.getAll())) || []).sort((a, b) => b.id - a.id);
    async function restore(id) {
        const all = await snaps(), s = all.find(x => x.id === id); if (!s) return;
        if (!confirm(`Restore the copy from ${new Date(s.id).toLocaleString('en-GB')}? Your current data is saved as a new copy first, so this can be undone.`)) return;
        await snapshot('Before restore'); Object.keys(s.data).forEach(k => rawSet.call(localStorage, k, s.data[k])); location.reload();
    }
    const mergeById = (a, b) => { const m = new Map(); (a || []).forEach(x => m.set(String(x.id), x)); (b || []).forEach(x => m.set(String(x.id), x)); return [...m.values()]; };
    function exportAll() {
        try { saveTransactionsLocally(); } catch (e) {}
        const blob = new Blob([JSON.stringify({ app: 'wally-mk2', version: 1, at: new Date().toISOString(), data: dump() })], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = `Wally_Full_Backup_${todayStr()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast('Full backup downloaded, sir.');
    }
    function importAll(file) {
        const fr = new FileReader();
        fr.onload = async () => {
            try {
                const j = JSON.parse(fr.result); if (!/^wally-mk[23]$/.test(j.app) || !j.data) throw new Error('not a backup');
                await snapshot('Before import');
                Object.keys(j.data).forEach(k => {
                    if ([TXK, 'walletWishlistBackup', 'walletMediaBackup', 'keepNotes', 'walletTasks', 'walletJournal', 'walletSkills'].includes(k)) { let cur = [], inc = []; try { cur = JSON.parse(localStorage.getItem(k) || '[]'); inc = JSON.parse(j.data[k] || '[]'); } catch (e) {} if (Array.isArray(cur) && Array.isArray(inc) && inc.every(x => x && (x.id != null || x.ts != null))) { const idOf = x => x.id != null ? x.id : x.ts; const m = new Map(); cur.forEach(x => m.set(String(idOf(x)), x)); inc.forEach(x => m.set(String(idOf(x)), x)); localStorage.setItem(k, JSON.stringify([...m.values()])); return; } }
                    localStorage.setItem(k, j.data[k]);
                });
                alert('Backup imported. Lists were merged with what was already here, so nothing was removed. The page will reload.'); location.reload();
            } catch (e) { toast('That file is not a Wally full backup.', true); }
        };
        fr.readAsText(file);
    }
    // a copy is taken automatically before anything destructive
    ['nukeLedger', 'forceCleanSystemState'].forEach(fn => { const o = window[fn]; if (typeof o !== 'function' || fn === 'forceCleanSystemState') return; window[fn] = function () { snapshot('Before ledger purge').catch(() => {}); return o.apply(this, arguments); }; });

    // ---- deletes are remembered so a sync never brings an item back, and never removes one you kept
    const tomb = () => getJ('walletDeleted', { tx: [], wish: [] });
    function watchDelete(fn, kind, list) { const o = window[fn]; if (typeof o !== 'function') return; window[fn] = function () { const before = new Set(list().map(x => String(x.id))); const r = o.apply(this, arguments); try { const now = new Set(list().map(x => String(x.id))), t = tomb(); before.forEach(id => { if (!now.has(id) && !t[kind].includes(id)) t[kind].push(id); }); t.tx = t.tx.slice(-500); t.wish = t.wish.slice(-500); setJ('walletDeleted', t); } catch (e) {} return r; }; }
    watchDelete('deleteTx', 'tx', () => transactions); watchDelete('deleteWishItem', 'wish', () => wishlistItems.concat(mediaItems));

    // ==========================================================================
    // 2. CLOUD LINK — safe two-way merge with your server
    // ==========================================================================
    const cloudKey = () => localStorage.getItem('walletCloudKey') || '';
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {                                        // adds your key to every call the app makes to its own server
        try { const url = typeof input === 'string' ? input : input.url; if (url && url.indexOf(API_BASE) === 0 && cloudKey()) { init = Object.assign({}, init || {}); const h = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined) || {}); h.set('x-wally-key', cloudKey()); init.headers = h; } } catch (e) {}
        return nativeFetch(input, init);
    };
    const api = async (p, opt) => { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 9000); try { const r = await fetch(API_BASE + p, Object.assign({ signal: ctl.signal, cache: 'no-store', headers: { 'Content-Type': 'application/json' } }, opt || {})); return r; } finally { clearTimeout(t); } };
    const cloud = { state: 'unknown', last: 0, note: '' };
    async function health() { try { const r = await nativeFetch(API_BASE + '/health', { cache: 'no-store' }); if (!r.ok) throw 0; const j = await r.json(); if (!j.ok) throw 0; cloud.locked = j.locked; cloud.store = j.store; return true; } catch (e) { cloud.state = 'offline'; return false; } }

    // live link: sync the moment something changes here, and the moment the server says something changed elsewhere
    const live = { rev: '', startRev: '', sent: 0, ok: null, es: null, open: false, t: null };
    // two windows on the same device (the installed app and a browser tab) share one store: pick up what the other one saved straight away
    let softT = null;
    window.addEventListener('storage', e => { if (e.storageArea !== localStorage || !e.key || e.newValue === e.oldValue) return; try {
        if (e.key === TXK) { transactions = (JSON.parse(e.newValue || '[]') || []).map(normalizeTransaction); updateUI(); }
        else if (e.key === 'walletWishlistBackup') { wishlistItems = JSON.parse(e.newValue || '[]') || []; renderWishlist(); }
        else if (e.key === 'walletMediaBackup') { mediaItems = JSON.parse(e.newValue || '[]') || []; renderMedia(); }
        else if (synced(e.key)) { clearTimeout(softT); softT = setTimeout(() => { const ae = document.activeElement, typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName), last = +sessionStorage.getItem('cxReloadAt') || 0; if (!typing && !document.querySelector('.cx-modal, .fullscreen-wb') && Date.now() - last > 20000) { sessionStorage.setItem('cxReloadAt', String(Date.now())); sessionStorage.setItem('cxResume', JSON.stringify({ v: document.body.dataset.view || 'dashboard', y: window.scrollY })); location.reload(); } }, 1500); }
    } catch (x) { console.warn('storage sync', x); } });
    const poke = ms => { if (cloud.state === 'locked' || cloud.state === 'offline' && !navigator.onLine) return; clearTimeout(live.t); live.t = setTimeout(() => { if (syncNow.busy) syncNow.again = true; else syncNow(false); }, ms || 900); };
    window.__cxPoke = () => { if (!localStorage.getItem('walletCloudLinked')) return; if (syncNow.busy) syncNow.again = true; else poke(350); };
    async function checkRev(force) {
        if (document.hidden && !force) return; if (!localStorage.getItem('walletCloudLinked') && cloud.state !== 'online') return;
        try { const r = await api('/rev'); if (r.status === 404) { live.ok = false; return; } if (!r.ok) return; const j = await r.json(), now = j.boot + ':' + j.rev; live.ok = true; if (now !== live.rev || cloud.state !== 'online') poke(150); } catch (e) { if (cloud.state === 'online') { cloud.state = 'offline'; paintStatus(); } }
    }
    function listen() {
        if (live.es || !('EventSource' in window) || !localStorage.getItem('walletCloudLinked') || document.hidden) return;
        try {
            const es = new EventSource(API_BASE + '/events' + (cloudKey() ? '?key=' + encodeURIComponent(cloudKey()) : '')); live.es = es;
            es.onopen = () => { live.open = true; }; es.onmessage = e => { if (e.data && e.data !== live.rev) { if (syncNow.busy) syncNow.again = true; else poke(60); } };
            es.onerror = () => { live.open = false; if (es.readyState === 2) { live.es = null; } };
        } catch (e) { live.es = null; }
    }
    const unlisten = () => { if (live.es) { try { live.es.close(); } catch (e) {} live.es = null; live.open = false; } };
    function localChanged() { try { if (!localStorage.getItem('walletCloudLinked')) return; if (syncNow.busy) { live.recheck = true; return; } if (stampItems()[1]) poke(200); } catch (e) {} }
    ['saveTransactionsLocally', 'saveWishlistLocally', 'saveMediaLocally'].forEach(n => { const o = window[n]; if (typeof o === 'function') window[n] = function () { const r = o.apply(this, arguments); localChanged(); return r; }; });

    // per-item change stamps: an edit made on one device replaces the older copy on the others
    const hsh = o => { const t = JSON.stringify(o); let h = 5381; for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0; return h; };
    const loadIM = () => { try { const m = JSON.parse(localStorage.getItem('cxItemMT') || 'null'); return m && m.h ? m : null; } catch (e) { return null; } };
    const saveIM = m => rawSet.call(localStorage, 'cxItemMT', JSON.stringify(m));
    const lists = () => [[transactions, 'tx', 't:'], [wishlistItems.concat(mediaItems), 'w', 'w:']];
    function stampItems() {                                                         // returns [map, somethingChangedHere]
        let m = loadIM(); const first = !m; if (first) m = { tx: {}, w: {}, h: {} }; const now = Date.now(), seen = {}; let ch = false;
        lists().forEach(([list, grp, pre]) => list.forEach(x => { const id = String(x.id), k = pre + id, h = hsh(x); seen[k] = 1; if (m.h[k] === undefined) { m.h[k] = h; if (!first) { m[grp][id] = now; ch = true; } } else if (m.h[k] !== h) { m.h[k] = h; m[grp][id] = now; ch = true; } }));
        Object.keys(m.h).forEach(k => { if (!seen[k]) { delete m.h[k]; delete m[k[0] === 't' ? 'tx' : 'w'][k.slice(2)]; ch = true; } });
        saveIM(m); return [m, ch];
    }
    const rebase = m => { m.h = {}; lists().forEach(([list, grp, pre]) => list.forEach(x => { m.h[pre + String(x.id)] = hsh(x); })); saveIM(m); };
    function mergeStamped(local, server, sMt, lMt, strip) {
        const L = new Map(local.map(x => [String(x.id), x])), S = new Map(server.map(x => [String(x.id), x])), out = [], push = []; let got = 0;
        new Set([...S.keys(), ...L.keys()]).forEach(id => { const l = L.get(id), sv = S.get(id), lt = lMt[id] || 0, st = sMt[id] || 0;
            if (l && (!sv || lt >= st)) { out.push(l); if (!sv || lt > st) { const m = lt || Date.now(); lMt[id] = m; push.push(Object.assign({}, l, { _m: m })); } }
            else { const c = strip ? strip(sv) : sv; out.push(c); lMt[id] = st; if (!l || JSON.stringify(l) !== JSON.stringify(c)) got++; } });
        return { out, push, got };
    }
    const noM = x => { const c = Object.assign({}, x); delete c._m; return c; };

    async function syncNow(manual) {
        if (syncNow.busy) return; syncNow.busy = true;
        try {
            live.sent = 0; live.startRev = ''; try { const r0 = await api('/rev'); if (r0.ok) { const j0 = await r0.json(); live.startRev = j0.boot + ':' + j0.rev; } } catch (e) {}
            if (!(await health())) { if (manual) toast('No server is reachable, sir. Your data is safe on this device.', true); return; }
            const [tr, wr] = await Promise.all([api('/get-transactions'), api('/get-wishlist')]);
            if (tr.status === 401) { cloud.state = 'locked'; if (manual) toast('The server needs your key. Enter it under System → Cloud.', true); return; }
            if (!tr.ok || !wr.ok) throw new Error('bad response');
            const rawTx = await tr.json() || [], sMtT = {}, sMtW = {}; rawTx.forEach(x => { sMtT[String(x.id)] = +x._m || 0; });
            const t = tomb(), sTx = rawTx.map(normalizeTransaction), sW = await wr.json() || []; sW.forEach(x => { sMtW[String(x.id)] = +x._m || 0; });
            const im = stampItems()[0];
            // forget tombstones for anything that is back in the local lists (restored on purpose)
            const localIds = new Set(transactions.map(x => String(x.id))), localW = new Set(wishlistItems.concat(mediaItems).map(x => String(x.id)));
            const back = { tx: t.tx.filter(id => localIds.has(id)), wish: t.wish.filter(id => localW.has(id)) };              // restored here with Undo
            t.tx = t.tx.filter(id => !localIds.has(id)); t.wish = t.wish.filter(id => !localW.has(id));
            if (back.tx.length || back.wish.length) await api('/undelete', { method: 'POST', body: JSON.stringify(back) });
            // deletions made on your other devices
            const dr = await api('/deleted'), gone = dr.ok ? await dr.json() : { tx: [], wish: [] }, goneTx = new Set(gone.tx || []), goneW = new Set(gone.wish || []);
            if (transactions.some(x => goneTx.has(String(x.id))) || wishlistItems.concat(mediaItems).some(x => goneW.has(String(x.id)))) {
                await snapshot('Before applying deletions from another device').catch(() => {});
                transactions = transactions.filter(x => !goneTx.has(String(x.id))); wishlistItems = wishlistItems.filter(x => !goneW.has(String(x.id))); mediaItems = mediaItems.filter(x => !goneW.has(String(x.id)));
            }
            // ledger: union of both sides, minus what you deleted; where both hold the same entry the newer edit wins
            const mT = mergeStamped(transactions, sTx.filter(x => !t.tx.includes(String(x.id))), sMtT, im.tx), pushTx = mT.push;
            const merged = mT.out.map(normalizeTransaction).filter(x => Number.isFinite(x.amount) && x.timestamp);
            const before = transactions.length, gotItems = mT.got; transactions = merged;
            // wishlist + library: same rule
            const lw = wishlistItems.concat(mediaItems.map(m => Object.assign({}, m, { isMedia: true })));
            const mW = mergeStamped(lw, sW.filter(x => !t.wish.includes(String(x.id))), sMtW, im.w, noM), all = mW.out, pushW = mW.push;
            wishlistItems = all.filter(w => !w.isMedia); mediaItems = all.filter(w => w.isMedia);
            rebase(im); saveTransactionsLocally(); saveWishlistLocally(); saveMediaLocally();
            const delTx = t.tx.filter(id => !goneTx.has(id)), delW = t.wish.filter(id => !goneW.has(id));           // only deletions the server has not heard about yet
            live.sent = pushTx.length + pushW.length + delTx.length + delW.length;
            for (const x of pushTx.slice(0, 400)) await api('/add-transaction', { method: 'POST', body: JSON.stringify(x) });
            for (const x of pushW.slice(0, 200)) await api('/add-wishlist', { method: 'POST', body: JSON.stringify(x) });
            for (const id of delTx) await api('/delete-transaction/' + encodeURIComponent(id), { method: 'DELETE' });
            for (const id of delW) await api('/delete-wishlist/' + encodeURIComponent(id), { method: 'DELETE' });
            setJ('walletDeleted', t);
            // bank messages your phone posted to the server
            const ir = await api('/sms-inbox'); let cap = 0;
            if (ir.ok) { const box = await ir.json(); if (box.length) { box.forEach(m => { const r = window.CXSms.ingest(m.text, 'phone SMS'); cap += r.added.length; }); await api('/sms-ack', { method: 'POST', body: JSON.stringify({ ids: box.map(m => m.id) }) }); } }
            // everything else: newest change wins per item; the very first link on a device never overwrites the server
            const sr = await api('/state'), first = !localStorage.getItem('walletCloudLinked'); let pulled = 0, pushed = 0;
            if (sr.ok) {
                const sv = await sr.json(), mt = MT(), push = {};
                new Set(Object.keys(sv).concat(Object.keys(localStorage).filter(synced))).forEach(k => {
                    if (!synced(k)) return; const lv = localStorage.getItem(k), lt = mt[k] || (lv !== null ? 1 : 0), s = sv[k];
                    if (s && typeof s.v === 'string' && (s.t > lt || (first && lv !== s.v)) ) { if (lv !== s.v) { rawSet.call(localStorage, k, s.v); pulled++; } mt[k] = s.t; }
                    else if (lv !== null && (!s || lt > s.t) && lv.length < 900000) { push[k] = { v: lv, t: lt > 1 ? lt : Date.now() }; mt[k] = push[k].t; pushed++; }
                });
                rawSet.call(localStorage, 'cxMT', JSON.stringify(mt));
                live.sent += pushed;
                if (pushed) await api('/state', { method: 'PUT', body: JSON.stringify(push) });
                rawSet.call(localStorage, 'walletCloudLinked', '1');
            }
            cloud.state = 'online'; cloud.last = Date.now(); cloud.note = `${merged.length} ledger entries • sent ${pushTx.length + pushW.length + pushed} • received ${gotItems + mW.got + pulled + cap}`;
            try { updateUI(); renderWishlist(); renderMedia(); } catch (e) {}
            if (cap) toast(`${cap} bank message${cap > 1 ? 's' : ''} from your phone added to the ledger, sir.`);
            if (pulled) {                                                           // settings-type data changed elsewhere: reload quietly when it will not interrupt you
                const ae = document.activeElement, typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName), busyUi = document.querySelector('.cx-modal, .fullscreen-wb') || (window.CXGrowth && CXGrowth.timerOn && CXGrowth.timerOn());
                const lastR = +sessionStorage.getItem('cxReloadAt') || 0, ok = Date.now() - lastR > 45000;
                if (ok && (document.hidden || performance.now() < 25000 || (!typing && !busyUi))) { sessionStorage.setItem('cxReloadAt', String(Date.now())); sessionStorage.setItem('cxResume', JSON.stringify({ v: document.body.dataset.view || 'dashboard', y: window.scrollY })); toast('Newer data arrived from your other device. Refreshing…'); setTimeout(() => location.reload(), 900); }
                else toast('Newer data arrived from your other device, sir. It shows after a reload.');
            }
            else if (manual) toast('Synced with your server, sir. ' + cloud.note);
        } catch (e) { cloud.state = 'error'; if (manual) toast('Sync did not finish. Nothing was changed on this device.', true); console.warn('sync', e); }
        finally { syncNow.busy = false; paintStatus(); try { const r = await api('/rev'); if (r.ok) { const j = await r.json(), now = j.boot + ':' + j.rev; if (live.startRev && live.sent === 0 && now !== live.startRev) syncNow.again = true; live.rev = now; live.ok = true; } else if (r.status === 404) live.ok = false; } catch (e) {} try { if (live.recheck) { live.recheck = false; if (stampItems()[1]) syncNow.again = true; } } catch (e) {} if (syncNow.again && (live.chain = (live.chain || 0) + 1) <= 4) { syncNow.again = false; setTimeout(() => syncNow(false), 250); } else { syncNow.again = false; live.chain = 0; } }
    }
    window.syncDataFromServer = async function () { try { updateUI(); renderWishlist(); renderMedia(); } catch (e) {} await syncNow(false); try { updateUI(); } catch (e) {} };

    // ==========================================================================
    // 3. REMINDERS
    // ==========================================================================
    const NDEF = { on: true, morning: '08:00', noon: '13:00', evening: '20:30', kinds: { brief: true, tasks: true, habits: true, mood: true, fitness: true, bills: true } };
    const ncfg = () => { const c = getJ('walletNotif', {}); return Object.assign({}, NDEF, c, { kinds: Object.assign({}, NDEF.kinds, c.kinds || {}) }); };
    const nlog = () => { const l = getJ('walletNotifLog', { d: '', items: [] }); return l.d === todayStr() ? l : { d: todayStr(), items: [] }; };
    function due() {
        const c = ncfg(), now = new Date(), hm = pad(now.getHours()) + ':' + pad(now.getMinutes()), out = [], td = todayStr();
        const tasks = getJ('walletTasks', []).filter(t => !t.done), today = tasks.filter(t => t.due === td), over = tasks.filter(t => t.due && t.due < td);
        let habits = [], done = []; try { habits = customHabits; done = habitHistory[td] || []; } catch (e) {} const openH = habits.filter(h => !done.includes(h.id));
        const fit = getJ('levelup_home_v7', null), trained = !!(fit && fit.ext && (fit.ext.trained || []).includes(td)), qLeft = fit && fit.lastDate ? (fit.quests || []).filter(q => !q.done).length : null;
        const mood = getJ('walletMoodHistory', {})[td], st = monthStats();
        let bills = []; try { const seen = {}; transactions.filter(t => t.isRecurring && t.type === 'expense').sort((a, b) => b.timestamp - a.timestamp).forEach(t => { const k = (t.note || t.category) + t.amount; if (seen[k]) return; seen[k] = 1; const dom = new Date(t.timestamp).getDate(), tm = new Date(Date.now() + 86400000); if (dom === tm.getDate() && mKey(t.timestamp) !== mKey(Date.now())) bills.push(t); }); } catch (e) {}
        if (hm >= c.morning) {
            if (c.kinds.brief) out.push({ id: 'brief', tab: 'planner', t: 'Morning brief, sir', b: `${today.length} task${today.length === 1 ? '' : 's'} due today${over.length ? `, ${over.length} overdue` : ''}. Safe to spend: ${inr(st.safe)}. ${habits.length} habits on the board.` });
            if (c.kinds.bills && bills.length) out.push({ id: 'bills', tab: 'planner', t: 'Bill due tomorrow', b: bills.map(b => `${b.note || b.category} ${inr(b.amount)}`).join(', ') });
            if (c.kinds.tasks && today.length) out.push({ id: 'tasks-am', tab: 'planner', t: `Planner: ${today.length} due today`, b: today.map(t => t.text).slice(0, 4).join(' • ') });
        }
        if (hm >= c.noon && c.kinds.mood && !mood) out.push({ id: 'mood', tab: 'growth', t: 'Mood check-in', b: 'Log how you feel so today’s plan and training load fit you.' });
        if (hm >= c.evening) {
            if (c.kinds.habits && openH.length) out.push({ id: 'habits', tab: 'growth', t: `Growth: ${openH.length} habit${openH.length > 1 ? 's' : ''} still open`, b: openH.map(h => h.text).slice(0, 4).join(' • ') });
            if (c.kinds.tasks && (today.length || over.length)) out.push({ id: 'tasks-pm', tab: 'planner', t: 'Planner: unfinished tasks', b: today.concat(over).map(t => t.text).slice(0, 4).join(' • ') });
            if (c.kinds.fitness && !trained) out.push({ id: 'fit', tab: 'fitness', t: 'LEVEL//UP: daily quest waiting', b: qLeft ? `${qLeft} objective${qLeft > 1 ? 's' : ''} left before midnight. Unfinished quests break the streak.` : 'No session logged today. A short one keeps the streak alive.' });
        }
        return out;
    }
    async function push(n) {
        const open = () => { if (n.tab === 'fitness') window.open('fitness/index.html', '_blank'); else switchMainView(n.tab); };
        try {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
            if (reg && reg.showNotification) await reg.showNotification(n.t, { body: n.b, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'wally-' + n.id, data: { tab: n.tab } });
            else { const x = new Notification(n.t, { body: n.b, icon: 'icon-192.png', tag: 'wally-' + n.id }); x.onclick = () => { window.focus(); open(); x.close(); }; }
        } catch (e) {}
    }
    function checkReminders() {
        const c = ncfg(); if (!c.on) return; const log = nlog(); let fresh = 0;
        due().forEach(n => { if (log.items.some(i => i.id === n.id)) return; log.items.unshift(Object.assign({ at: Date.now() }, n)); fresh++; push(n); });
        if (fresh) { setJ('walletNotifLog', log); if (navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive) try { navigator.vibrate(60); } catch (e) {} toast(log.items[0].t + ' — ' + log.items[0].b.slice(0, 90)); }
        paintStatus();
    }

    // ==========================================================================
    // 4. SYSTEM PANEL (data, cloud, reminders, shortcuts) + header buttons
    // ==========================================================================
    function modal(id, title, body) { const old = $(id); if (old) old.remove(); document.body.insertAdjacentHTML('beforeend', `<div class="cx-modal" id="${id}"><div style="width:min(640px,100%)"><h3><span>${title}</span><button class="cx-btn red sm" onclick="document.getElementById('${id}').remove()">Close</button></h3>${body}</div></div>`); $(id).addEventListener('mousedown', e => { if (e.target.id === id) $(id).remove(); }); icons(); return $(id); }
    let sysTab = 'data';
    async function system(tab) {
        if ((tab || sysTab) === 'remind') { try { localStorage.setItem('cxNotifSeen', String(Date.now())); } catch (e) {} setTimeout(paintStatus, 50); }
        sysTab = tab || sysTab; const c = ncfg(); let body = '';
        const tabs = [['data', 'Data vault'], ['cloud', 'Cloud'], ['remind', 'Reminders'], ['keys', 'Shortcuts']].map(t => `<button class="cx-btn sm ${sysTab === t[0] ? 'on' : ''}" onclick="CXSys.open('${t[0]}')">${t[1]}</button>`).join('');
        if (sysTab === 'data') {
            const list = await snaps().catch(() => []); let persisted = null; try { persisted = await navigator.storage.persisted(); } catch (e) {}
            body = `<p>Everything lives in this browser. A full copy is saved automatically once a day and before any purge, import or restore, and the last 20 copies are kept. Clearing the browser's site data removes both, so download a backup file now and then.</p>
                <div class="flex gap-2 flex-wrap" style="margin:12px 0"><button class="cx-btn green" onclick="CXSys.exportAll()">Download full backup</button><button class="cx-btn" onclick="document.getElementById('cxImp').click()">Import a backup</button><button class="cx-btn" onclick="CXSys.snap()">Save a copy now</button><input type="file" id="cxImp" accept=".json,application/json" style="display:none" onchange="CXSys.importAll(this.files[0])"></div>
                <p style="font-size:12px;color:${persisted ? '#34d399' : '#fbbf24'}">${persisted === null ? '' : persisted ? 'This browser has agreed to keep the data even when storage runs low.' : 'The browser may clear this data if the device runs low on space. <a href="#" style="color:#00e5ff" onclick="event.preventDefault();CXSys.persist()">Ask it to keep the data</a>'}</p>
                <p class="cx-lbl" style="margin-top:14px">Saved copies</p><div style="max-height:230px;overflow-y:auto">${list.length ? list.map(s => `<div class="cx-row" style="margin-bottom:6px"><span class="flex-1 min-w-0"><b class="text-sm text-white">${new Date(s.id).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</b><br><span style="font-size:12px;color:#94a3b8">${esc(s.label)} • ${s.n} ledger entries</span></span><button class="cx-btn sm" onclick="CXSys.restore(${s.id})">Restore</button></div>`).join('') : '<div class="cx-empty">No copies yet.</div>'}</div>`;
        } else if (sysTab === 'cloud') {
            const col = { online: '#34d399', offline: '#94a3b8', locked: '#fbbf24', error: '#f87171', unknown: '#94a3b8' }[cloud.state];
            body = `<p>When your server is running, this device merges with it: ledger, wishlist and library are combined item by item, and everything else (habits, planner, growth, fitness, notes) follows whichever device changed it last. Nothing is deleted by a sync.</p>
                <div class="cx-row" style="margin:12px 0"><i class="cx-dot" style="background:${col};box-shadow:0 0 8px ${col}"></i><span class="flex-1"><b class="text-sm text-white" style="text-transform:uppercase">${cloud.state === 'online' ? 'Connected' : cloud.state === 'locked' ? 'Key needed' : cloud.state === 'error' ? 'Last sync failed' : 'No server reachable'}</b><br><span style="font-size:12px;color:#94a3b8">${esc(API_BASE)}${cloud.last ? ' • last sync ' + new Date(cloud.last).toLocaleTimeString('en-GB') + ' • ' + esc(cloud.note) : ''}</span></span><button class="cx-btn sm" onclick="CXSys.sync()">Sync now</button></div>
                <label class="cx-lbl">Server key (the WALLY_KEY you set on the server)</label><div class="flex gap-2"><input id="cxKey" type="password" class="cx-in flex-1" value="${esc(cloudKey())}" placeholder="leave empty if the server has no key"><button class="cx-btn" onclick="CXSys.key()">Save key</button></div>
                <p style="font-size:12px;color:#94a3b8;margin-top:10px">Steps for creating and publishing the server are in DEPLOY-GUIDE.md inside the project folder.</p>`;
        } else if (sysTab === 'remind') {
            const perm = 'Notification' in window ? Notification.permission : 'unsupported', log = nlog();
            body = `<p>Reminders are worked out from your Planner tasks, Growth habits and mood, fitness quest and recurring bills. They appear here and, once allowed, as system notifications. They fire while this app is open in a tab or installed on your phone; a fully closed browser cannot be woken by a page.</p>
                <div class="cx-row" style="margin:12px 0"><span class="flex-1"><b class="text-sm text-white">System notifications</b><br><span style="font-size:12px;color:${perm === 'granted' ? '#34d399' : '#fbbf24'}">${perm === 'granted' ? 'Allowed on this device' : perm === 'denied' ? 'Blocked in this browser. Allow notifications for this site in the browser settings.' : perm === 'unsupported' ? 'Not supported by this browser' : 'Not yet allowed'}</span></span>${perm === 'default' ? '<button class="cx-btn green sm" onclick="CXSys.allow()">Allow</button>' : ''}<button class="cx-btn sm" onclick="CXSys.testNotif()">Send a test</button></div>
                <label class="cx-row" style="cursor:pointer;margin-bottom:8px"><input type="checkbox" class="form-check" ${c.on ? 'checked' : ''} onchange="CXSys.nset('on', this.checked)"><b class="text-sm text-white flex-1">Reminders on</b></label>
                <div class="grid grid-cols-3 gap-2">${[['morning', 'Morning brief'], ['noon', 'Mood nudge'], ['evening', 'Evening check']].map(t => `<div><label class="cx-lbl">${t[1]}</label><input type="time" class="cx-in w-full" value="${c[t[0]]}" onchange="CXSys.nset('${t[0]}', this.value)"></div>`).join('')}</div>
                <div class="grid grid-cols-2 gap-2" style="margin-top:10px">${[['brief', 'Morning brief'], ['tasks', 'Planner tasks'], ['habits', 'Growth habits'], ['mood', 'Mood check-in'], ['fitness', 'Fitness quest'], ['bills', 'Bills due tomorrow']].map(k => `<label class="cx-row" style="cursor:pointer;padding:7px 10px"><input type="checkbox" class="form-check" ${c.kinds[k[0]] ? 'checked' : ''} onchange="CXSys.nkind('${k[0]}', this.checked)"><span class="text-xs text-gray-200 flex-1">${k[1]}</span></label>`).join('')}</div>
                <p class="cx-lbl" style="margin-top:14px">Today</p>${log.items.length ? log.items.map(i => `<div class="cx-row" style="margin-bottom:6px;cursor:pointer" onclick="document.getElementById('cxSysModal').remove();${i.tab === 'fitness' ? "window.open('fitness/index.html','_blank')" : `switchMainView('${i.tab}')`}"><span class="flex-1 min-w-0"><b class="text-sm text-white">${esc(i.t)}</b><br><span style="font-size:12px;color:#94a3b8">${esc(i.b)}</span></span><span style="font-size:11px;color:#64748b">${new Date(i.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span></div>`).join('') : '<div class="cx-empty">Nothing yet today.</div>'}`;
        } else {
            body = `<div class="grid grid-cols-1 md:grid-cols-2 gap-2">${[['Ctrl / ⌘ + K', 'Command palette: jump anywhere, run any action, search the ledger'], ['N', 'Quick add an entry'], ['Alt + 1 … 7', 'Switch tabs'], ['/', 'Search the ledger'], ['← →', 'Turn the telemetry cards (click a deck first)'], ['Esc', 'Close any pop-up'], ['?', 'Open this list']].map(k => `<div class="cx-row"><b class="text-xs" style="color:#00e5ff;min-width:92px">${k[0]}</b><span class="text-xs text-gray-300">${k[1]}</span></div>`).join('')}</div><p style="font-size:12px;color:#94a3b8;margin-top:10px">On a phone: the bar along the bottom switches tabs, the + button adds an entry, and the card decks can be swiped.</p>`;
        }
        modal('cxSysModal', 'System', `<div class="flex gap-2 flex-wrap" style="margin-bottom:14px">${tabs}</div>${body}`);
    }
    window.CXSys = {
        paint: () => paintStatus(),
        open: system, exportAll, importAll, restore, sync: () => syncNow(true).then(() => $('cxSysModal') && system('cloud')),
        snap: () => snapshot('Manual').then(() => { toast('Copy saved.'); system('data'); }),
        persist: async () => { try { const ok = await navigator.storage.persist(); toast(ok ? 'The browser will keep this data.' : 'The browser declined for now. Installing the app usually grants it.', !ok); } catch (e) {} system('data'); },
        key: () => { rawSet.call(localStorage, 'walletCloudKey', $('cxKey').value.trim()); toast('Key saved. Syncing…'); syncNow(true).then(() => system('cloud')); },
        allow: async () => { try { await Notification.requestPermission(); } catch (e) {} system('remind'); checkReminders(); },
        testNotif: () => { const n = { id: 'test' + Date.now(), tab: 'dashboard', t: 'C.A.S.P.E.R. test', b: 'Reminders are working, sir.' }; push(n); toast('Test sent. If nothing appeared outside the page, notifications are not allowed yet.'); },
        nset: (k, v) => { const c = ncfg(); c[k] = v; setJ('walletNotif', c); checkReminders(); },
        nkind: (k, v) => { const c = ncfg(); c.kinds[k] = v; setJ('walletNotif', c); },
        snapshot, dueNow: due
    };
    function paintStatus() {
        const b = $('cxBell'); if (b) { const seen = +localStorage.getItem('cxNotifSeen') || 0, n = nlog().items.filter(i => (i.at || 0) > seen).length; b.querySelector('em').textContent = n || ''; b.querySelector('em').style.display = n ? '' : 'none'; }
        const c = $('cxCloudDot'); if (c) { const col = { online: '#34d399', offline: '#64748b', locked: '#fbbf24', error: '#f87171', unknown: '#64748b' }[cloud.state]; c.style.background = col; c.style.boxShadow = cloud.state === 'online' ? '0 0 8px #34d399' : 'none'; c.parentElement.title = cloud.state === 'online' ? 'Connected to your server' : cloud.state === 'locked' ? 'Server needs your key' : 'Working from this device only'; }
    }
    function headerButtons() {
        const sel = document.querySelector('header .universal-month-filter'); if (!sel || $('cxBell')) return;
        sel.parentElement.insertAdjacentHTML('beforebegin', `<div class="cx-hbtns"><button id="cxPalBtn" title="Command palette (Ctrl+K)" onclick="CXPal.open()"><i data-lucide="search"></i></button><button id="cxBell" title="Reminders" onclick="CXSys.open('remind')"><i data-lucide="bell"></i><em></em></button><button title="Data and cloud" onclick="CXSys.open('data')"><i data-lucide="shield-check"></i><i id="cxCloudDot" class="cx-dot" style="position:absolute;right:4px;bottom:4px;width:7px;height:7px"></i></button></div>`);
    }

    // ==========================================================================
    // 5. HEATMAP FOR ANY MONTH
    // ==========================================================================
    let heatSel = null; const baseHeat = window.wallyHeatmap;
    const allMonths = () => { const ks = new Set(transactions.map(t => mKey(t.timestamp))); ks.add(mKey(Date.now())); return [...ks].filter(k => /^\d{4}-\d{2}$/.test(k)).sort(); };
    window.wallyHeatmap = function (m) {
        const cur = heatSel || m; baseHeat(cur);
        const map = $('upgHeatmap'); if (!map) return; const h = map.closest('.glass-panel').querySelector('h3');
        if (!$('cxHeatNav')) h.insertAdjacentHTML('afterend', `<div id="cxHeatNav" class="flex items-center gap-2 flex-wrap" style="margin:-4px 0 12px"><button class="cx-btn sm" onclick="CXHeat.step(-1)" aria-label="Previous month">‹</button><select id="cxHeatSel" class="cx-in" style="padding:6px 10px;font-size:12px;flex:1;min-width:120px" onchange="CXHeat.set(this.value)"></select><button class="cx-btn sm" onclick="CXHeat.step(1)" aria-label="Next month">›</button><button class="cx-btn sm" id="cxHeatFollow" onclick="CXHeat.set(null)">Follow filter</button><span id="cxHeatSum" class="text-[10px] font-bold uppercase tracking-widest text-gray-400" style="flex-basis:100%"></span></div>`);
        const ms = allMonths(), s = $('cxHeatSel'); s.innerHTML = ms.slice().reverse().map(k => { const [y, mo] = k.split('-'); return `<option value="${k}" ${k === cur ? 'selected' : ''}>${new Date(y, mo - 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</option>`; }).join('');
        $('cxHeatFollow').classList.toggle('on', !heatSel);
        const ex = transactions.filter(t => t.type === 'expense' && t.account !== 'Emergency' && mKey(t.timestamp) === cur), tot = ex.reduce((a, t) => a + t.amount, 0), days = new Set(ex.map(t => new Date(t.timestamp).getDate())).size;
        $('cxHeatSum').textContent = `${inr(tot)} over ${days} spending day${days === 1 ? '' : 's'} • ${ex.length} payment${ex.length === 1 ? '' : 's'}`;
    };
    window.CXHeat = { set(k) { heatSel = k || null; try { window.WallyX.renderDeck(); } catch (e) {} }, step(d) { const ms = allMonths(), cur = heatSel || $('cxHeatSel').value, i = ms.indexOf(cur), n = ms[Math.max(0, Math.min(ms.length - 1, i + d))]; if (n) this.set(n); } };

    // ==========================================================================
    // 6. COLOUR PER TAB + RING EMBLEMS
    // ==========================================================================
    const TAB = { dashboard: ['#00e5ff', 0, 'activity'], investments: ['#fbbf24', -144, 'pie-chart'], wishlist: ['#38bdf8', 11, 'target'], media: ['#a855f7', 84, 'library'], workspace: ['#34d399', -29, 'pen-tool'], growth: ['#f97316', -162, 'zap'], planner: ['#f472b6', 141, 'calendar-check'] };
    const css = document.createElement('style');
    css.textContent = `
    body { --tab: #00e5ff; }
    body::before { background: radial-gradient(ellipse at 50% -10%, color-mix(in srgb, var(--tab) 13%, transparent), transparent 62%) !important; transition: background .6s; }
    #cxBg { transition: filter .8s ease; }
    .nav-btn svg { color: var(--own, currentColor); transition: color .3s; }
    .nav-btn:not(.active):hover { color: var(--own) !important; }
    .nav-btn.active { color: var(--tab) !important; border-color: var(--tab) !important; background: color-mix(in srgb, var(--tab) 13%, transparent) !important; text-shadow: 0 0 9px var(--tab) !important; box-shadow: inset 0 0 14px color-mix(in srgb, var(--tab) 22%, transparent), 0 0 14px color-mix(in srgb, var(--tab) 25%, transparent) !important; }
    .nav-btn.active::after { background: linear-gradient(90deg, transparent, var(--tab), transparent) !important; }
    header.glass-panel { border-color: color-mix(in srgb, var(--tab) 45%, transparent) !important; box-shadow: 0 0 18px color-mix(in srgb, var(--tab) 18%, transparent), inset 0 0 20px color-mix(in srgb, var(--tab) 5%, transparent) !important; transition: border-color .5s, box-shadow .5s; }
    .view-card.active > .glass-panel:first-child, .view-card.active > div > .glass-panel:first-child { border-top-color: var(--tab) !important; }
    .view-card.active .glass-panel::before, .view-card.active .glass-panel::after, header.glass-panel::before, header.glass-panel::after { border-color: var(--tab) !important; }
    .view-card.active h2.bubbly-text { background: linear-gradient(90deg, #fff 25%, var(--tab)) !important; -webkit-background-clip: text !important; background-clip: text !important; }
    ::-webkit-scrollbar-thumb { background: var(--tab) !important; }
    .cx-tabhud { display: inline-flex; margin-right: 12px; vertical-align: middle; } .cx-tabhud .cx-hud { color: var(--tab); }
    h2 .cx-tabhud + svg, h2 .cx-tabhud + i { display: none !important; }
    h2 .cx-tabhud .cx-hud, h2 .cx-tabhud svg, h2 .cx-tabhud i { color: var(--tab) !important; -webkit-text-fill-color: initial; }
    header .cx-logo, #cxFoot .cx-logo { color: var(--tab); transition: color .5s; }
    .cx-hbtns { display: flex; gap: 6px; flex: none; } .cx-hbtns button { position: relative; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: var(--tab); border: 1px solid color-mix(in srgb, var(--tab) 35%, transparent); background: rgba(0,0,0,.5); transition: all .2s; }
    .cx-hbtns button:hover { background: var(--tab); color: #000; } .cx-hbtns svg { width: 17px; height: 17px; } .cx-hbtns em { position: absolute; top: -5px; right: -5px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; background: #ef4444; color: #fff; font: 700 10px 'Oxanium', sans-serif; display: grid; place-items: center; font-style: normal; }
    #cxPal { position: fixed; inset: 0; z-index: 2147483100; background: rgba(2,6,14,.82); backdrop-filter: blur(6px); display: flex; justify-content: center; align-items: flex-start; padding: 12vh 14px 0; }
    #cxPal > div { width: min(600px, 100%); background: rgba(4,10,20,.98); border: 1px solid var(--tab); border-radius: 16px; overflow: hidden; box-shadow: 0 0 40px color-mix(in srgb, var(--tab) 30%, transparent); animation: cxPopIn .16s ease; }
    #cxPal input { width: 100%; background: transparent; border: 0; border-bottom: 1px solid rgba(255,255,255,.1); padding: 16px 18px; color: #fff; font-size: 16px !important; outline: none; }
    #cxPalList { max-height: 52vh; overflow-y: auto; padding: 6px; } #cxPalList button { display: flex; width: 100%; align-items: center; gap: 10px; text-align: left; padding: 10px 12px; border-radius: 10px; color: #cbd5e1; font-size: 13.5px; } #cxPalList button.on, #cxPalList button:hover { background: color-mix(in srgb, var(--tab) 16%, transparent); color: #fff; }
    #cxPalList small { margin-left: auto; color: #64748b; font: 600 10.5px 'Oxanium', sans-serif; letter-spacing: .1em; text-transform: uppercase; }
    #cxFab { position: fixed; left: 18px; bottom: 22px; z-index: 90; width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; background: var(--tab); color: #000; font: 700 30px 'Oxanium', sans-serif; line-height: 1; box-shadow: 0 0 22px color-mix(in srgb, var(--tab) 60%, transparent); transition: transform .2s; } #cxFab:hover { transform: scale(1.08) rotate(90deg); }
    #cxTabBar { display: none; }
    @media (max-width: 640px) {
        #cxTabBar { display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 95; background: rgba(3,7,14,.97); border-top: 1px solid color-mix(in srgb, var(--tab) 40%, transparent); padding: 5px 4px calc(5px + env(safe-area-inset-bottom)); backdrop-filter: blur(12px); }
        #cxTabBar button { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 0; border-radius: 10px; color: #64748b; font: 600 8.5px 'Oxanium', sans-serif; letter-spacing: .06em; text-transform: uppercase; } #cxTabBar svg { width: 19px; height: 19px; }
        #cxTabBar button.on { color: var(--c); background: color-mix(in srgb, var(--c) 14%, transparent); }
        body { padding-bottom: 78px !important; } #cxFab { bottom: 76px; left: 12px; width: 48px; height: 48px; font-size: 26px; }
        .cx-chatfab { bottom: 76px !important; }
        .cx-hbtns { width: 100%; justify-content: flex-end; }
    }
    @media (prefers-reduced-motion: reduce) { #cxBg { transition: none; } }
    `;
    document.head.appendChild(css);
    function paintTab(v) {
        const t = TAB[v] || TAB.dashboard; document.body.dataset.view = v; document.body.style.setProperty('--tab', t[0]);
        const bg = $('cxBg'); if (bg) bg.style.filter = `hue-rotate(${t[1]}deg)`;
        const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = '#050507';
        document.querySelectorAll('#cxTabBar button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    }
    function emblems() {
        Object.keys(TAB).forEach(v => { const b = $('nav' + v.charAt(0).toUpperCase() + v.slice(1)); if (b) b.style.setProperty('--own', TAB[v][0]); });
        [['viewInvestments', 'investments'], ['viewWishlist', 'wishlist'], ['viewMedia', 'media'], ['viewWorkspace', 'workspace'], ['viewGrowth', 'growth']].forEach(([id, v]) => {
            const h = document.querySelector(`#${id} h2`); if (!h || h.querySelector('.cx-tabhud')) return;
            h.insertAdjacentHTML('afterbegin', `<span class="cx-tabhud">${hud(52, TAB[v][0], TAB[v][2])}</span>`);
        });
        document.querySelectorAll('#viewDashboard h2.text-lg').forEach(h => { if (!h.querySelector('.cx-tabhud')) h.insertAdjacentHTML('afterbegin', `<span class="cx-tabhud" style="margin-right:8px">${hud(30, '#00e5ff', 'scan-line')}</span>`); });
        const av = document.querySelector('header .relative.group'); if (av && !av.querySelector('.cx-avring')) av.insertAdjacentHTML('beforeend', `<svg class="cx-avring" viewBox="0 0 100 100" style="position:absolute;inset:-7px;width:calc(100% + 14px);height:calc(100% + 14px);pointer-events:none;color:var(--tab)"><circle class="cx-spin" cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 18 6 18" stroke-linecap="round"/></svg>`);
    }
    const swPrev = window.switchMainView;
    window.switchMainView = function (v) { const r = swPrev.apply(this, arguments); try { if (TAB[v]) paintTab(v); } catch (e) {} return r; };

    // ==========================================================================
    // 7. COMMAND PALETTE, QUICK ADD, PHONE TAB BAR
    // ==========================================================================
    const ACTIONS = () => [
        ...Object.keys(TAB).map(v => ({ n: 'Go to ' + (v === 'media' ? 'Library' : v.charAt(0).toUpperCase() + v.slice(1)), k: 'tab', run: () => switchMainView(v) })),
        { n: 'Quick add an entry', k: 'ledger', run: () => quickAdd() }, { n: 'Read a bank SMS', k: 'ledger', run: () => CXSms.single() }, { n: 'Paste bulk SMS', k: 'ledger', run: () => openBulkSMSModal() },
        { n: 'Scan a bill with the camera', k: 'ledger', run: () => CXBill.pick(true) }, { n: 'Upload a bill photo', k: 'ledger', run: () => CXBill.pick(false) },
        { n: 'Analyse this month', k: 'casper', run: () => { switchMainView('dashboard'); getCASPERInsights(); $('aiTerminal').scrollIntoView({ block: 'center' }); } }, { n: 'Forecast month-end', k: 'casper', run: () => { switchMainView('dashboard'); getCASPERForecast(); $('aiTerminal').scrollIntoView({ block: 'center' }); } },
        { n: 'Open the full report', k: 'casper', run: () => openAIReport() }, { n: 'Ask C.A.S.P.E.R.', k: 'casper', run: () => { const w = $('casperChatWindow'); if (w.classList.contains('hidden')) toggleCasper(); $('casperInput').focus(); } },
        { n: 'Lifetime trajectory chart', k: 'chart', run: () => openAllTimeChart() }, { n: 'Add a task', k: 'planner', run: () => { switchMainView('planner'); setTimeout(() => $('cxTaskText').focus(), 200); } },
        { n: 'Start a focus block', k: 'growth', run: () => { switchMainView('growth'); setTimeout(() => { CXGrowth.toggleTimer(); $('cxTimerRing').scrollIntoView({ block: 'center' }); }, 300); } }, { n: 'Log mood', k: 'growth', run: () => { switchMainView('growth'); setTimeout(() => $('cxMoodRow').scrollIntoView({ block: 'center' }), 300); } },
        { n: 'Open LEVEL//UP Fitness', k: 'fitness', run: () => window.open('fitness/index.html', '_blank') },
        { n: 'Download full backup', k: 'data', run: exportAll }, { n: 'Data vault and saved copies', k: 'data', run: () => system('data') }, { n: 'Cloud link and sync', k: 'data', run: () => system('cloud') }, { n: 'Reminder settings', k: 'system', run: () => system('remind') }, { n: 'Keyboard shortcuts', k: 'system', run: () => system('keys') },
        { n: 'Automatic SMS capture setup', k: 'system', run: () => CXSms.setup() }, { n: 'Your pictures', k: 'system', run: () => CXFront.art() }
    ];
    let palSel = 0, palItems = [];
    function palPaint(q) {
        q = (q || '').toLowerCase().trim(); const words = q.split(/\s+/).filter(Boolean);
        palItems = ACTIONS().filter(a => words.every(w => (a.n + ' ' + a.k).toLowerCase().includes(w)));
        if (q.length >= 2) transactions.filter(t => ((t.note || '') + ' ' + t.category).toLowerCase().includes(q)).sort((a, b) => b.timestamp - a.timestamp).slice(0, 6).forEach(t => palItems.push({ n: `${t.type === 'income' ? '+' : '−'}${inr(t.amount)}  ${t.note || t.category}`, k: new Date(t.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), run: () => { switchMainView('dashboard'); openEditModal(t.id); } }));
        palSel = Math.min(palSel, Math.max(0, palItems.length - 1));
        $('cxPalList').innerHTML = palItems.length ? palItems.map((a, i) => `<button data-i="${i}" class="${i === palSel ? 'on' : ''}">${esc(a.n)}<small>${esc(a.k)}</small></button>`).join('') : '<div class="cx-empty" style="margin:8px">Nothing matches.</div>';
    }
    window.CXPal = {
        open() { if ($('cxPal')) return; document.body.insertAdjacentHTML('beforeend', `<div id="cxPal"><div><input id="cxPalIn" placeholder="Type a command or search the ledger, sir…" autocomplete="off"><div id="cxPalList"></div></div></div>`); palSel = 0; palPaint('');
            const p = $('cxPal'), i = $('cxPalIn'); i.focus(); const run = a => { this.close(); try { a.run(); } catch (e) { console.warn(e); } };
            i.addEventListener('input', () => { palSel = 0; palPaint(i.value); });
            i.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); palPaint(i.value); } else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); palPaint(i.value); } else if (e.key === 'Enter' && palItems[palSel]) run(palItems[palSel]); else if (e.key === 'Escape') this.close(); const pl = $('cxPalList'), on = pl && pl.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest' }); });
            p.addEventListener('mousedown', e => { if (e.target === p) this.close(); const b = e.target.closest('#cxPalList button'); if (b) { e.preventDefault(); run(palItems[Number(b.dataset.i)]); } }); },
        close() { const p = $('cxPal'); if (p) p.remove(); }
    };
    function quickAdd() {
        modal('cxQuick', 'Quick add', `<div class="grid grid-cols-2 gap-2"><div class="col-span-2 flex gap-2"><button id="cxQe" class="cx-btn red on" style="flex:1" onclick="CXQuick.type('expense')">Expense</button><button id="cxQi" class="cx-btn green" style="flex:1" onclick="CXQuick.type('income')">Income</button></div>
            <div class="col-span-2"><label class="cx-lbl">Amount ₹</label><input id="cxQAmt" type="number" inputmode="decimal" step="0.01" class="cx-in w-full" style="font-size:22px !important;font-weight:800" placeholder="0"></div>
            <div><label class="cx-lbl">Category</label><select id="cxQCat" class="cx-in w-full"></select></div><div><label class="cx-lbl">Paid with</label><select id="cxQAcc" class="cx-in w-full">${['UPI', 'Debit Card', 'Credit Card', 'Cash'].map(a => `<option>${a}</option>`).join('')}</select></div>
            <div class="col-span-2"><label class="cx-lbl">Note</label><input id="cxQNote" class="cx-in w-full" placeholder="What was it for?" oninput="CXQuick.guess()"></div>
            <div class="col-span-2"><label class="cx-lbl">Date</label><input id="cxQDate" type="date" class="cx-in w-full" value="${todayStr()}"></div></div><button class="cx-btn green" style="width:100%;margin-top:12px" onclick="CXQuick.save()">Add to ledger</button>`);
        window.CXQuick.type('expense'); setTimeout(() => { const a = $('cxQAmt'); if (a) a.focus(); }, 60);
        $('cxQuick').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') { e.preventDefault(); window.CXQuick.save(); } });
    }
    let qType = 'expense', qTouched = false;
    window.CXQuick = {
        open: quickAdd,
        type(t) { qType = t; qTouched = false; $('cxQe').style.opacity = t === 'expense' ? 1 : .45; $('cxQi').style.opacity = t === 'income' ? 1 : .45; const s = $('cxQCat'); s.innerHTML = (t === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(c => `<option>${esc(c)}</option>`).join(''); s.onchange = () => { qTouched = true; }; },
        guess() { if (qType !== 'expense' || qTouched) return; const g = window.guessCategory && window.guessCategory($('cxQNote').value); if (g && EXPENSE_CATEGORIES.includes(g)) $('cxQCat').value = g; },
        save() { const amt = parseFloat($('cxQAmt').value); if (!(amt > 0)) return toast('Enter an amount, sir.', true); const d = new Date($('cxQDate').value + 'T12:00'), same = d.toDateString() === new Date().toDateString();
            const tx = { id: String(Date.now()), type: qType, amount: amt, account: $('cxQAcc').value, category: $('cxQCat').value, note: $('cxQNote').value.trim(), timestamp: same || isNaN(d) ? Date.now() : d.getTime(), isRecurring: false };
            transactions.push(tx); saveTransactionsLocally(); try { updateUI(); } catch (e) {} try { fetch(`${API_BASE}/add-transaction`, { method: 'POST', headers: apiHeaders, body: JSON.stringify(tx) }).catch(() => {}); } catch (e) {}
            $('cxQuick').remove(); if (navigator.vibrate) try { navigator.vibrate(30); } catch (e) {} toast(`${qType === 'income' ? 'Income' : 'Expense'} of ${inr(amt)} recorded, sir.`); }
    };
    function chrome() {
        if (!$('cxFab')) document.body.insertAdjacentHTML('beforeend', `<button id="cxFab" title="Quick add (N)" aria-label="Quick add an entry" onclick="CXQuick.open()">+</button>`);
        const cb = document.querySelector('button[onclick="toggleCasper()"].w-14'), fx = cb && cb.closest('.fixed'); if (fx) fx.classList.add('cx-chatfab');
        if (!$('cxTabBar')) { document.body.insertAdjacentHTML('beforeend', `<nav id="cxTabBar">${Object.keys(TAB).map(v => `<button data-v="${v}" style="--c:${TAB[v][0]}" onclick="switchMainView('${v}');window.scrollTo({top:0})"><i data-lucide="${TAB[v][2]}"></i>${v === 'media' ? 'Library' : v === 'investments' ? 'Invest' : v === 'dashboard' ? 'Home' : v}</button>`).join('')}</nav>`); }
    }
    document.addEventListener('keydown', e => {
        const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('cxPal') ? window.CXPal.close() : window.CXPal.open(); }
        else if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); quickAdd(); }
        else if (!typing && e.key === '?') { e.preventDefault(); system('keys'); }
        else if (e.key === 'Escape') { window.CXPal.close(); document.querySelectorAll('.cx-modal').forEach(m => m.remove()); }
    });

    // ==========================================================================
    // BOOT
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        const safe = fn => { try { fn(); } catch (e) { console.warn('Expansion 7 boot step failed', e); } };
        safe(headerButtons); safe(chrome); safe(() => paintTab('dashboard'));
        try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}
        setTimeout(() => { safe(emblems); safe(paintStatus); safe(() => window.WallyX.renderDeck()); icons(); if (getJ('walletSnapDay', '') !== todayStr()) snapshot('Daily').catch(() => {}); }, 1700);
        setTimeout(() => safe(checkReminders), 4000); setInterval(() => safe(checkReminders), 60000);
        let tick = 0; setInterval(() => { tick++; if (document.hidden) return; if (tick % 3 === 0) listen(); if (live.ok === false) { if (tick % 30 === 0 && cloud.state === 'online') syncNow(false); return; } if (!live.open || tick % 3 === 0) checkRev(); }, 4000);   // the counter check costs the server nothing, so it runs often as a safety net behind the live line
        ['focus', 'online', 'pageshow'].forEach(e => window.addEventListener(e, () => { listen(); checkRev(true); }));
        safe(() => { const r = JSON.parse(sessionStorage.getItem('cxResume') || 'null'); if (r) { sessionStorage.removeItem('cxResume'); setTimeout(() => { try { if (r.v && r.v !== 'dashboard') switchMainView(r.v); window.scrollTo(0, r.y || 0); } catch (e) {} }, 1900); } });
        document.addEventListener('visibilitychange', () => { if (document.hidden) { if (cloud.state === 'online') syncNow(false); setTimeout(() => { if (document.hidden) unlisten(); }, 60000); } else { safe(checkReminders); listen(); checkRev(true); } });
    });
})();


/* ============================================================================
   WALLY MK 3 — ROUND 9 CORRECTIONS (appended; nothing above is changed)
   1 header ring removed  2 tile text un-hidden  3 planner colour  4 graph sign on every tab
   5 investment glossary  6 interactive greeting  7 flexible reminders
   8 stronger capture bookmark + separate guide  9 HUD introduction banner
   ============================================================================ */
(function () {
    'use strict';
    if (!window.CX) return;
    const { $, esc, inr, getJ, setJ, icons, todayStr, mKey, toast, monthStats, balances, hud } = window.CX;
    const safe = fn => { try { return fn(); } catch (e) { console.warn('v8', e); } };
    const pad = n => String(n).padStart(2, '0');
    const PLAN = '#c6f432';
    const COL = { dashboard: '#00e5ff', investments: '#fbbf24', wishlist: '#38bdf8', media: '#a855f7', workspace: '#34d399', growth: '#f97316', planner: PLAN };
    const NAME = { dashboard: 'Dashboard', investments: 'Investments', wishlist: 'Wishlist', media: 'Library', workspace: 'Workspace', growth: 'Growth', planner: 'Planner' };

    const css = document.createElement('style');
    css.textContent = `
    /* 1. the ring around the profile picture is retired; every emblem gets a hard size so it can never grow */
    .cx-avring { display: none !important; }
    .cx-hud { flex: 0 0 auto; max-width: 96px; max-height: 96px; overflow: hidden; }
    .cx-hud > svg { width: 100% !important; height: 100% !important; max-width: 96px; max-height: 96px; }
    .cx-tabhud { display: inline-flex; vertical-align: middle; max-width: 64px; max-height: 64px; overflow: hidden; }
    /* 2. tile captions wrap instead of being cut */
    .cx-tile { min-width: 0; height: 100%; gap: 2px; }
    .cx-tile small { white-space: normal !important; overflow: visible !important; text-overflow: clip !important; line-height: 1.35; overflow-wrap: anywhere; }
    .cx-tile span { white-space: normal; line-height: 1.3; overflow-wrap: anywhere; }
    .cx-tile b { overflow-wrap: anywhere; }
    /* 3. planner colour */
    #viewPlanner .cx-banner { --c: ${PLAN} !important; } #viewPlanner .cx-banner .cx-hud { color: ${PLAN} !important; }
    #viewPlanner .cx-banner h3 { color: ${PLAN}; }
    /* 4. graph sign */
    .cx8-graph { display: inline-grid; place-items: center; width: 34px; height: 34px; flex: 0 0 34px; margin-left: 10px; border-radius: 10px; vertical-align: middle; color: var(--g); border: 1px solid color-mix(in srgb, var(--g) 55%, transparent); background: color-mix(in srgb, var(--g) 12%, transparent); cursor: pointer; transition: transform .18s, background .18s, box-shadow .18s; }
    .cx8-graph:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--g) 26%, transparent); box-shadow: 0 0 16px color-mix(in srgb, var(--g) 50%, transparent); }
    .cx8-graph svg { width: 18px; height: 18px; } .cx8-graph svg rect { transform-origin: bottom; transform-box: fill-box; animation: cx8Bar 2.4s ease-in-out infinite; } .cx8-graph svg rect:nth-child(2) { animation-delay: .3s; } .cx8-graph svg rect:nth-child(3) { animation-delay: .6s; }
    @keyframes cx8Bar { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(.55); } }
    .nav-btn .cx8-navg { width: 11px; height: 11px; margin-left: 5px; color: var(--own, currentColor); opacity: .9; flex: 0 0 auto; display: inline-block; vertical-align: middle; }
    .cx8-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin-bottom: 12px; }
    .cx8-kpis div { border: 1px solid rgba(255,255,255,.09); border-radius: 12px; padding: 9px 11px; background: rgba(255,255,255,.03); } .cx8-kpis span { display: block; font: 700 10px 'Oxanium', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #94a3b8; } .cx8-kpis b { font: 700 17px 'Oxanium', sans-serif; color: #fff; }
    /* 5. glossary */
    .cx8-gl { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 9px; }
    .cx8-gl div { border: 1px solid rgba(251,191,36,.22); border-radius: 12px; padding: 10px 12px; background: rgba(251,191,36,.04); }
    .cx8-gl b { display: block; font: 700 13px 'Oxanium', sans-serif; color: #fbbf24; letter-spacing: .04em; margin-bottom: 3px; } .cx8-gl p { font-size: 12.5px; line-height: 1.5; color: #cbd5e1; } .cx8-gl i { display: block; font-style: normal; font-size: 11.5px; color: #7dd3fc; margin-top: 4px; }
    #cx8GlossPanel summary { cursor: pointer; list-style: none; } #cx8GlossPanel summary::-webkit-details-marker { display: none; }
    /* 6. greeting */
    #cxCmdHi { cursor: pointer; display: inline-block; } #cxCmdHi .w { display: inline-block; transition: transform .25s, color .25s, text-shadow .25s; }
    #cxCmdHi:hover .w { color: var(--tab, #00e5ff); text-shadow: 0 0 14px var(--tab, #00e5ff); } #cxCmdHi.bump .w { animation: cx8Hop .5s ease; }
    @keyframes cx8Hop { 0% { transform: translateY(0); } 40% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
    #cx8Brief { display: flex; align-items: center; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
    #cx8BriefT { font-size: 13px; color: #cbd5e1; cursor: pointer; border-bottom: 1px dashed rgba(0,229,255,.4); min-height: 20px; } #cx8BriefT:hover { color: #fff; }
    #cx8BriefT::after { content: '▍'; color: #00e5ff; animation: cx8Blink 1s steps(2) infinite; margin-left: 2px; } @keyframes cx8Blink { 50% { opacity: 0; } }
    #cx8Brief button { width: 24px; height: 24px; border-radius: 7px; border: 1px solid rgba(0,229,255,.35); color: #00e5ff; font-size: 13px; line-height: 1; } #cx8Brief button:hover { background: #00e5ff; color: #000; }
    #cx8Dots { display: flex; gap: 4px; } #cx8Dots i { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,.2); } #cx8Dots i.on { background: #00e5ff; box-shadow: 0 0 6px #00e5ff; }
    /* 8. capture guide lives in its own card */
    [id^="cxCapture_"] > ol { display: none; }
    .cx8-steps { counter-reset: s; display: grid; gap: 8px; } .cx8-steps li { counter-increment: s; list-style: none; position: relative; padding: 9px 12px 9px 44px; border: 1px solid rgba(255,255,255,.09); border-radius: 12px; font-size: 13px; line-height: 1.5; color: #cbd5e1; }
    .cx8-steps li::before { content: counter(s); position: absolute; left: 10px; top: 9px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: var(--tab, #00e5ff); color: #000; font: 700 12px 'Oxanium', sans-serif; }
    /* 9. HUD introduction banner */
    #cx8Hud { position: relative; margin: 0 0 12px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(0,229,255,.45); background: #05070c; line-height: 0; }
    #cx8Hud svg { width: 100%; height: auto; max-height: 240px; display: block; }
    #cx8Hud .rA { transform-origin: 500px 150px; animation: cxSpin 14s linear infinite; } #cx8Hud .rB { transform-origin: 500px 150px; animation: cxSpin 9s linear infinite reverse; }
    #cx8Hud .core { animation: cx8Core 2.6s ease-in-out infinite; transform-origin: 500px 150px; } @keyframes cx8Core { 0%,100% { opacity: .75; transform: scale(1); } 50% { opacity: 1; transform: scale(1.07); } }
    #cx8Hud .ln { opacity: 0; animation: cx8In .5s ease forwards; } #cx8Hud .ln:nth-of-type(2) { animation-delay: .5s; } #cx8Hud .ln:nth-of-type(3) { animation-delay: 1s; } #cx8Hud .ln:nth-of-type(4) { animation-delay: 1.5s; } @keyframes cx8In { to { opacity: 1; } }
    #cx8Hud .blk { animation: cx8Blink 1.4s steps(2) infinite; } #cx8Hud .scan { animation: cx8Scan 5s linear infinite; } @keyframes cx8Scan { from { transform: translateX(-200px); } to { transform: translateX(1200px); } }
    #cx8Live { display: none; line-height: 1.3; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(246,196,69,.25); border-top: 1px solid rgba(246,196,69,.4); } #cx8Live div { background: #0c0506; padding: 8px 10px; } #cx8Live span { display: block; font: 700 9px 'Oxanium', sans-serif; letter-spacing: .1em; color: #c9a54a; } #cx8Live b { font: 700 13px 'Oxanium', sans-serif; color: #fff; }
    @media (max-width: 640px) { #cx8Live { display: grid; } #cx8Hud .rt { display: none; } #cx8Brief { flex-wrap: nowrap; align-items: flex-start; } #cx8BriefT { flex: 1; min-width: 0; } #cx8Dots { display: none; } }
    @media (prefers-reduced-motion: reduce) { #cx8Hud *, .cx8-graph svg rect, #cx8BriefT::after { animation: none !important; } #cx8Hud .ln { opacity: 1; } }
    `;
    document.head.appendChild(css);

    function modal(id, title, body, w) {
        const old = $(id); if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', `<div class="cx-modal" id="${id}"><div style="width:min(${w || 720}px,100%)"><h3><span>${title}</span><button class="cx-btn red sm" onclick="document.getElementById('${id}').remove()">Close</button></h3>${body}</div></div>`);
        $(id).addEventListener('mousedown', e => { if (e.target.id === id) $(id).remove(); }); icons(); return $(id);
    }

    // ==========================================================================
    // 3. PLANNER COLOUR
    // ==========================================================================
    function paintPlanner() {
        const b = $('navPlanner'); if (b) b.style.setProperty('--own', PLAN);
        const t = document.querySelector('#cxTabBar button[data-v="planner"]'); if (t) t.style.setProperty('--c', PLAN);
        if (document.body.dataset.view === 'planner') document.body.style.setProperty('--tab', PLAN);
    }
    const swPrev = window.switchMainView;
    window.switchMainView = function (v) { const r = swPrev.apply(this, arguments); safe(paintPlanner); setTimeout(() => safe(decorate), 60); return r; };

    // ==========================================================================
    // 4. GRAPH SIGN ON EVERY TAB
    // ==========================================================================
    const GSVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="6" width="4" height="15" rx="1"/><rect x="17" y="2" width="4" height="19" rx="1"/></svg>`;
    const gbtn = v => `<button type="button" class="cx8-graph" style="--g:${COL[v]}" title="${NAME[v]} graphs" aria-label="${NAME[v]} graphs" onclick="event.stopPropagation();CX8.graph('${v}')">${GSVG}</button>`;
    function decorate() {
        [['viewInvestments', 'investments'], ['viewWishlist', 'wishlist'], ['viewMedia', 'media'], ['viewWorkspace', 'workspace'], ['viewGrowth', 'growth']].forEach(([id, v]) => {
            const h = document.querySelector(`#${id} h2`); if (h && !h.querySelector('.cx8-graph')) h.insertAdjacentHTML('beforeend', gbtn(v));
        });
        const c = $('cxClock'); if (c && !document.querySelector('#cxCmd .cx8-graph')) c.insertAdjacentHTML('beforebegin', gbtn('dashboard'));
        const pb = document.querySelector('#viewPlanner .cx-banner'); if (pb && !pb.querySelector('.cx8-graph')) { const d = pb.querySelector('.min-w-0'); if (d) d.insertAdjacentHTML('afterend', gbtn('planner') + `<button class="cx-btn sm" style="margin-left:8px;border-color:${PLAN};color:${PLAN}" onclick="CXSys.open('remind')">Reminders</button>`); }
        Object.keys(COL).forEach(v => { const b = $('nav' + v.charAt(0).toUpperCase() + v.slice(1)); if (b && !b.querySelector('.cx8-navg')) b.insertAdjacentHTML('beforeend', GSVG.replace('<svg ', '<svg class="cx8-navg" ')); });
        const ih = document.querySelector('#viewInvestments h2'); if (ih && !ih.querySelector('.cx8-glb')) ih.insertAdjacentHTML('beforeend', `<button class="cx-btn sm cx8-glb" style="margin-left:10px;border-color:#fbbf24;color:#fbbf24;vertical-align:middle" onclick="CX8.glossary()">Glossary</button>`);
        glossPanel(); capGuide(); paintPlanner();
    }
    const dayStr = off => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString('en-CA'); };
    const dayLbl = off => { const d = new Date(); d.setDate(d.getDate() + off); return d.toLocaleDateString('en-GB', { weekday: 'short' }); };
    function graphData(v) {
        const c = COL[v];
        if (v === 'dashboard') {
            const ks = [], lb = []; for (let i = 5; i >= 0; i--) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); ks.push(mKey(d.getTime())); lb.push(d.toLocaleDateString('en-GB', { month: 'short' })); }
            const inc = ks.map(() => 0), exp = ks.map(() => 0); transactions.forEach(t => { const i = ks.indexOf(mKey(t.timestamp)); if (i < 0) return; if (t.type === 'income') inc[i] += +t.amount || 0; else if (t.type === 'expense') exp[i] += +t.amount || 0; });
            const st = monthStats();
            return { sub: 'Money in and money out, last six months', kpi: [['Spent this month', inr(st.spent)], ['Budget left', inr(st.left)], ['Safe per day', inr(st.safe)], ['Liquid', inr(balances().liquid)]], type: 'bar', labels: lb, sets: [{ label: 'Income', data: inc, backgroundColor: '#34d399' }, { label: 'Expense', data: exp, backgroundColor: c }] };
        }
        if (v === 'investments') {
            const p = getJ('walletPortfolio', []), by = {}; p.forEach(h => { by[h.type] = (by[h.type] || 0) + (+h.current || +h.invested || 0); });
            const inv = p.reduce((s, h) => s + (+h.invested || 0), 0), cur = p.reduce((s, h) => s + (+h.current || +h.invested || 0), 0);
            return { sub: 'What you hold, by asset type', kpi: [['Invested', inr(inv)], ['Value now', inr(cur)], ['Gain / loss', inr(cur - inv)], ['Holdings', p.length]], type: 'doughnut', labels: Object.keys(by), sets: [{ data: Object.values(by), backgroundColor: ['#fbbf24', '#00e5ff', '#34d399', '#a855f7', '#f97316', '#38bdf8', '#f472b6', '#94a3b8'], borderWidth: 0 }], empty: 'Add a holding in this tab to see the split.' };
        }
        if (v === 'wishlist') {
            const open = wishlistItems.filter(w => !w.purchased).sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 10), liq = balances().liquid;
            return { sub: 'Open items by price. Green ones fit in liquid cash today', kpi: [['Open items', wishlistItems.filter(w => !w.purchased).length], ['Cart total', inr(wishlistItems.filter(w => !w.purchased).reduce((s, w) => s + (+w.price || 0), 0))], ['Bought', wishlistItems.filter(w => w.purchased).length]], type: 'bar', horiz: true, labels: open.map(w => String(w.title || 'Item').slice(0, 26)), sets: [{ label: 'Price', data: open.map(w => +w.price || 0), backgroundColor: open.map(w => (+w.price || 0) <= liq ? '#34d399' : c) }], empty: 'The wishlist is empty.' };
        }
        if (v === 'media') {
            const ty = ['Movie', 'Series', 'Book'], stt = ['Planned', 'In Progress', 'Completed'], cc = ['#00e5ff', '#fbbf24', '#34d399'];
            const other = mediaItems.filter(m => !ty.includes(m.wishCategory)); const tys = other.length ? ty.concat('Other') : ty;
            return { sub: 'Titles by type and status', kpi: [['Titles', mediaItems.length], ['Completed', mediaItems.filter(m => m.mediaStatus === 'Completed').length], ['Ongoing', mediaItems.filter(m => m.mediaStatus === 'In Progress').length]], type: 'bar', stacked: true, labels: tys, sets: stt.map((s, i) => ({ label: s, data: tys.map(t => mediaItems.filter(m => (t === 'Other' ? !ty.includes(m.wishCategory) : m.wishCategory === t) && (m.mediaStatus || 'Planned') === s).length), backgroundColor: cc[i] })), empty: mediaItems.length ? '' : 'The library is empty.' };
        }
        if (v === 'workspace') {
            const n = [getJ('keepNotes', []).length, getJ('walletPages', []).length, getJ('workspaceHistory', []).length, getJ('walletWbLocal', []).length];
            return { sub: 'What the workspace holds', kpi: [['Notes', n[0]], ['Pages', n[1]], ['Sketches', n[2] + n[3]]], type: 'bar', labels: ['Notes', 'Pages', 'Saved sketches', 'Local sketches'], sets: [{ label: 'Count', data: n, backgroundColor: c }], empty: n.some(x => x) ? '' : 'Nothing saved in the workspace yet.' };
        }
        if (v === 'growth') {
            const offs = [-6, -5, -4, -3, -2, -1, 0], fl = getJ('walletFocusLog', {}), mh = getJ('walletMoodHistory', {});
            const hb = offs.map(o => (habitHistory[dayStr(o)] || []).length), fm = offs.map(o => +((fl && !Array.isArray(fl) ? fl : {})[dayStr(o)]) || 0);
            return { sub: 'Habits ticked and focus minutes, last seven days', kpi: [['Habits set', customHabits.length], ['Ticked this week', hb.reduce((a, b) => a + b, 0)], ['Focus minutes', fm.reduce((a, b) => a + b, 0)], ['Mood logs', offs.filter(o => mh[dayStr(o)]).length]], type: 'bar', labels: offs.map(dayLbl), sets: [{ label: 'Habits ticked', data: hb, backgroundColor: c }, { type: 'line', label: 'Focus min', data: fm, borderColor: '#00e5ff', backgroundColor: '#00e5ff', tension: .35, yAxisID: 'y1' }], y1: true };
        }
        const tk = getJ('walletTasks', []), offs = [-3, -2, -1, 0, 1, 2, 3], td = todayStr();
        return { sub: 'Tasks by due date, three days either side of today', kpi: [['Open', tk.filter(t => !t.done).length], ['Done', tk.filter(t => t.done).length], ['Overdue', tk.filter(t => !t.done && t.due && t.due < td).length], ['Due today', tk.filter(t => !t.done && t.due === td).length]], type: 'bar', stacked: true, labels: offs.map(o => o === 0 ? 'Today' : dayLbl(o)), sets: [{ label: 'Done', data: offs.map(o => tk.filter(t => t.done && t.due === dayStr(o)).length), backgroundColor: '#34d399' }, { label: 'Open', data: offs.map(o => tk.filter(t => !t.done && t.due === dayStr(o)).length), backgroundColor: c }], empty: tk.length ? '' : 'No tasks yet.' };
    }
    let gChart = null;
    function graph(v) {
        if (!COL[v]) v = document.body.dataset.view || 'dashboard';
        const g = graphData(v), has = g.sets.some(s => (s.data || []).some(x => x > 0));
        modal('cx8Graph', `<span style="color:${COL[v]}">${NAME[v]} graphs</span>`, `<p style="font-size:12.5px;color:#94a3b8;margin-bottom:10px">${g.sub}, sir.</p><div class="cx8-kpis">${g.kpi.map(k => `<div><span>${k[0]}</span><b>${esc(String(k[1]))}</b></div>`).join('')}</div>${has || !g.empty ? '<div style="position:relative;height:300px"><canvas id="cx8GraphCv"></canvas></div>' : `<div class="cx-empty">${g.empty}</div>`}<div class="flex flex-wrap gap-2" style="margin-top:12px">${Object.keys(COL).map(k => `<button class="cx-btn sm" style="border-color:${COL[k]};color:${k === v ? '#000' : COL[k]};${k === v ? 'background:' + COL[k] : ''}" onclick="CX8.graph('${k}')">${NAME[k]}</button>`).join('')}</div>`);
        const cv = $('cx8GraphCv'); if (!cv || !window.Chart) return;
        if (gChart) { try { gChart.destroy(); } catch (e) {} }
        const ax = { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,.06)' }, stacked: !!g.stacked, beginAtZero: true };
        const scales = g.type === 'doughnut' ? {} : { x: ax, y: Object.assign({}, ax) }; if (g.y1) scales.y1 = { position: 'right', beginAtZero: true, ticks: { color: '#00e5ff', font: { size: 11 } }, grid: { display: false } };
        gChart = new Chart(cv, { type: g.type, data: { labels: g.labels, datasets: g.sets.map(s => Object.assign({ borderRadius: 6 }, s)) }, options: { indexAxis: g.horiz ? 'y' : 'x', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: g.sets.length > 1 || g.type === 'doughnut', labels: { color: '#cbd5e1', boxWidth: 12 } } }, scales } });
    }

    // ==========================================================================
    // 5. INVESTMENT GLOSSARY
    // ==========================================================================
    const GLOSS = [
        ['SIP (Systematic Investment Plan)', 'A fixed amount invested every month, usually into a mutual fund, regardless of market level.', 'In the app: "SIP Growth Engine". Example: ₹5,000 a month.'],
        ['Monthly Injection', 'This app’s name for the monthly SIP amount you put in.', ''],
        ['Return % (p.a.)', 'The yearly growth rate you expect from the investment. "p.a." means per annum, per year. It is an assumption, not a promise.', 'Equity funds are often modelled at 10–12%, fixed deposits at 6–7%.'],
        ['Horizon', 'How many years you will keep investing or stay invested.', ''],
        ['Future Wealth / Future Value', 'What the investment is projected to be worth at the end of the horizon, with returns compounded.', ''],
        ['Invested', 'The money you actually put in from your own pocket, before any growth.', 'Future Wealth minus Invested is your gain.'],
        ['Compounding', 'Earning returns on earlier returns. It is why the last years of a long SIP add more than the first.', ''],
        ['Lumpsum', 'One single investment made at once, instead of monthly instalments.', 'Calculator Lab → Lumpsum.'],
        ['Step-up SIP', 'A SIP that you raise by a fixed percentage every year, normally in line with salary hikes.', '₹5,000 with a 10% step-up becomes ₹5,500 in year two.'],
        ['CAGR (Compound Annual Growth Rate)', 'The steady yearly rate that would turn the start value into the end value over the period. It smooths out the ups and downs.', '₹1,00,000 → ₹1,80,000 in 4 years is about 15.8% CAGR.'],
        ['Absolute return', 'Total percentage gain from start to end, ignoring how long it took.', '₹1,00,000 → ₹1,80,000 is 80% absolute.'],
        ['Principal', 'The original loan amount still owed, before interest.', 'In "Debt Clearing Protocol": Total Debt Principal.'],
        ['Interest %', 'The yearly rate the lender charges on what you still owe.', ''],
        ['Monthly Pay', 'What you pay towards the debt each month. It must be more than the monthly interest or the debt never ends.', ''],
        ['Time to Debt-Free', 'Number of months until the loan reaches zero at that monthly payment.', ''],
        ['Total Interest', 'All the interest you will pay over the life of the loan, on top of the principal.', ''],
        ['EMI (Equated Monthly Instalment)', 'The fixed monthly payment on a loan. Early EMIs are mostly interest; later ones are mostly principal.', 'Calculator Lab → Loan EMI.'],
        ['Tenure', 'The length of a loan, in months.', ''],
        ['F.I.R.E. (Financial Independence, Retire Early)', 'Building a corpus large enough that its returns cover your expenses, so work becomes optional.', ''],
        ['Monthly Expenses', 'What you spend in a month today. The F.I.R.E. engine multiplies it up to a yearly figure.', ''],
        ['Safe Withdrawal Rate (SWR)', 'The share of the corpus you can take out each year without running out. 4% is the classic rule; 3–3.5% is more cautious for India.', 'At 4% you need 25 times your yearly expenses.'],
        ['Inflation Buffer', 'Extra percentage added to the target so rising prices do not erode it.', ''],
        ['Target Corpus Required', 'The total sum you need invested to be financially independent: yearly expenses ÷ SWR, plus the buffer.', ''],
        ['Yearly Withdrawal', 'How much you could draw from the corpus each year at the chosen SWR.', ''],
        ['Corpus', 'The whole pile of invested money built for a goal.', ''],
        ['Inflation / Future cost', 'Prices rise each year, so the same thing costs more later. Future cost shows today’s price grown by inflation.', 'At 6%, ₹1,00,000 today costs about ₹1,79,000 in 10 years.'],
        ['Ticker / Symbol', 'The short code an asset trades under on an exchange.', 'RELIANCE, NIFTYBEES, AAPL.'],
        ['Deep Scan / Market Feed', 'The market lookup panel. It needs the online backend; offline it stays on standby.', ''],
        ['NIFTY 50', 'Index of the 50 largest companies on India’s National Stock Exchange. A fund tracking it is an "index fund".', ''],
        ['S&P 500', 'Index of 500 large US-listed companies.', ''],
        ['Gold (XAU)', 'XAU is the market code for one troy ounce of gold.', ''],
        ['Portfolio / Holdings', 'Everything you own as an investment. Each line is one holding.', ''],
        ['Value now', 'What a holding would fetch if sold today (its market value).', ''],
        ['Gain / Loss (P/L)', 'Value now minus invested. Shown in rupees and as a percentage. It is "unrealised" until you sell.', ''],
        ['Allocation', 'How your money is split across asset types. A balanced split lowers the damage from any one type falling.', 'The doughnut chart in this tab.'],
        ['Asset types', 'Equity: company shares. Mutual Fund: a pooled, professionally managed basket. Gold. Fixed Deposit: bank deposit at a fixed rate. PPF / EPF: government-backed retirement savings with tax benefits. Crypto. Real Estate. Cash / Other.', ''],
        ['Net worth', 'Everything you own (cash, savings, investments) minus everything you owe.', ''],
        ['Liquid assets', 'Money you can use right away: cash, bank and UPI balances. Investments and the emergency fund are kept apart.', ''],
        ['Emergency fund', 'Money set aside for surprises, commonly 3–6 months of expenses, kept safe and easy to reach.', ''],
        ['Goal Planner: Target, Years, Saved so far', 'Enter what a goal costs, when you need it, the expected return and what you already have. The app works out the monthly SIP needed.', ''],
        ['Required monthly SIP', 'The monthly amount that reaches the goal on time at the assumed return.', ''],
        ['Diversification', 'Not keeping everything in one asset. It is what the Allocation chart helps you judge.', ''],
        ['50 / 25 / 20 / 5 allocation matrix', 'A way of splitting income: 50% needs, 25% wants, 20% savings and investments, 5% buffer. Shown on the title banner.', '']
    ];
    const glossHTML = q => { const f = (q || '').toLowerCase(), l = GLOSS.filter(g => !f || g.join(' ').toLowerCase().includes(f)); return l.length ? l.map(g => `<div><b>${g[0]}</b><p>${g[1]}</p>${g[2] ? `<i>${g[2]}</i>` : ''}</div>`).join('') : '<div class="cx-empty" style="grid-column:1/-1">No term matches that.</div>'; };
    function glossary() { modal('cx8Gloss', '<span style="color:#fbbf24">Investment glossary</span>', `<input class="cx-in w-full" placeholder="Search a term: SIP, CAGR, corpus…" oninput="document.getElementById('cx8GlossList').innerHTML=CX8.glossHTML(this.value)" style="margin-bottom:12px"><div class="cx8-gl" id="cx8GlossList" style="max-height:62vh;overflow-y:auto">${glossHTML('')}</div>`, 900); }
    function glossPanel() {
        const v = $('viewInvestments'); if (!v || $('cx8GlossPanel')) return;
        v.insertAdjacentHTML('beforeend', `<details id="cx8GlossPanel" class="glass-panel p-5 md:p-6" style="border-color:rgba(251,191,36,.35)"><summary class="cx-h" style="color:#fbbf24;margin-bottom:0"><i data-lucide="book-open" class="w-4 h-4"></i> Every term in this tab, explained <span style="margin-left:auto;font-size:11px;color:#94a3b8">tap to open</span></summary><div class="cx8-gl" style="margin-top:14px">${glossHTML('')}</div></details>`); icons();
    }

    // ==========================================================================
    // 6. INTERACTIVE GREETING
    // ==========================================================================
    let bi = 0, bTimer = null, typeTimer = null, bHold = 0;
    function briefs() {
        const out = [], td = todayStr(), now = new Date();
        safe(() => { const st = monthStats(); out.push({ t: `Safe to spend today: ${inr(st.safe)}. ${inr(Math.max(0, st.left))} of the budget is left this month.`, go: () => { const e = $('aiTerminal'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }); });
        safe(() => { const sp = transactions.filter(t => t.type === 'expense' && new Date(t.timestamp).toDateString() === now.toDateString()); out.push({ t: sp.length ? `${sp.length} expense${sp.length > 1 ? 's' : ''} logged today, ${inr(sp.reduce((s, t) => s + (+t.amount || 0), 0))} in total.` : 'Nothing spent today so far. Tap to add an entry.', go: () => sp.length ? ($('transactionList') || $('cxCmd')).scrollIntoView({ behavior: 'smooth', block: 'start' }) : (window.CXQuick && CXQuick.open ? CXQuick.open() : null) }); });
        safe(() => { const tk = getJ('walletTasks', []).filter(t => !t.done), d = tk.filter(t => t.due === td).length, o = tk.filter(t => t.due && t.due < td).length; out.push({ t: d || o ? `${d} task${d === 1 ? '' : 's'} due today${o ? `, ${o} overdue` : ''}. Tap to open the Planner.` : 'The Planner is clear for today.', go: () => switchMainView('planner') }); });
        safe(() => { const open = customHabits.filter(h => !(habitHistory[td] || []).includes(h.id)).length; if (customHabits.length) out.push({ t: open ? `${open} habit${open > 1 ? 's' : ''} still open today.` : 'Every habit is ticked for today. Well done, sir.', go: () => switchMainView('growth') }); });
        safe(() => { const liq = balances().liquid, w = wishlistItems.filter(x => !x.purchased && +x.price > 0).sort((a, b) => a.price - b.price)[0]; if (w) out.push({ t: +w.price <= liq ? `"${String(w.title).slice(0, 34)}" is within liquid cash at ${inr(w.price)}.` : `Closest wishlist item: "${String(w.title).slice(0, 30)}", ${inr(w.price - liq)} short.`, go: () => switchMainView('wishlist') }); });
        safe(() => { const f = getJ('levelup_home_v7', null); if (f) { const left = (f.quests || []).filter(q => !q.done).length; out.push({ t: left ? `LEVEL//UP: ${left} quest objective${left > 1 ? 's' : ''} left today.` : 'LEVEL//UP: daily quest complete.', go: () => window.open('fitness/index.html', '_blank') }); } });
        if (!out.length) out.push({ t: 'All systems online. Tap to ask me anything.', go: () => window.toggleCasper && toggleCasper() });
        return out;
    }
    function typeBrief() {
        const el = $('cx8BriefT'); if (!el) return; const b = briefs(); bi = ((bi % b.length) + b.length) % b.length; const txt = b[bi].t; let i = 0;
        clearInterval(typeTimer); el.textContent = ''; el.title = 'Tap to open';
        const d = $('cx8Dots'); if (d) d.innerHTML = b.map((_, k) => `<i class="${k === bi ? 'on' : ''}"></i>`).join('');
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = txt; return; }
        typeTimer = setInterval(() => { i += 2; el.textContent = txt.slice(0, i); if (i >= txt.length) clearInterval(typeTimer); }, 22);
    }
    const LINES = ['At your service, sir.', 'Systems nominal, sir.', 'Standing by, sir.', 'All ledgers secured, sir.', 'Ready when you are, sir.', 'Shall I run the numbers, sir?'];
    function greeting() {
        const hi = $('cxCmdHi'); if (!hi) return;
        if (!hi.dataset.x8) {
            hi.dataset.x8 = '1'; hi.title = 'Tap me'; const ob = document.getElementById('cx8Brief'); if (ob) ob.remove();
            hi.addEventListener('click', () => { hi.classList.remove('bump'); void hi.offsetWidth; hi.classList.add('bump'); const l = $('cxCmdLine'); if (l) { l.textContent = 'C.A.S.P.E.R. • ' + LINES[Math.floor(Math.random() * LINES.length)]; clearTimeout(l._t); l._t = setTimeout(() => { l.textContent = 'C.A.S.P.E.R.'; }, 3200); } bi++; bHold = Date.now(); typeBrief(); });
            hi.addEventListener('dblclick', () => { window.toggleCasper && toggleCasper(); });
        }
        if (!hi.querySelector('.w')) { const t = hi.textContent; hi.innerHTML = t.split(' ').map((w, i) => `<span class="w" style="transition-delay:${i * 40}ms">${esc(w)}</span>`).join(' '); }
        if (false) {   // status line under the greeting retired on request; live figures now sit in the banner
            hi.parentElement.insertAdjacentHTML('beforeend', `<div id="cx8Brief"><button type="button" aria-label="Previous" onclick="CX8.brief(-1)">‹</button><span id="cx8BriefT"></span><button type="button" aria-label="Next" onclick="CX8.brief(1)">›</button><span id="cx8Dots"></span></div>`);
            $('cx8BriefT').addEventListener('click', () => { const b = briefs(); safe(() => b[bi % b.length].go()); });
            typeBrief(); clearInterval(bTimer); bTimer = setInterval(() => { if (document.hidden || Date.now() - bHold < 12000) return; bi++; typeBrief(); }, 8000);
        }
    }

    // ==========================================================================
    // 7. FLEXIBLE REMINDERS — your own, any time, any days, with snooze
    // ==========================================================================
    const RK = 'walletReminders', DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const rems = () => getJ(RK, []);
    const repTxt = r => r.rep === 'daily' ? 'Every day' : r.rep === 'weekdays' ? 'Mon to Fri' : r.rep === 'weekends' ? 'Sat and Sun' : r.rep === 'once' ? 'Once on ' + (r.date || '') : r.rep === 'monthly' ? 'Monthly on day ' + (r.dom || 1) : (r.days || []).map(d => DAYS[d]).join(', ') || 'No days picked';
    function appliesToday(r) {
        const n = new Date(), wd = n.getDay();
        if (r.rep === 'daily') return true; if (r.rep === 'weekdays') return wd > 0 && wd < 6; if (r.rep === 'weekends') return wd === 0 || wd === 6;
        if (r.rep === 'once') return r.date === todayStr(); if (r.rep === 'monthly') return n.getDate() === Math.min(+r.dom || 1, new Date(n.getFullYear(), n.getMonth() + 1, 0).getDate());
        return (r.days || []).includes(wd);
    }
    async function notify(t, b, tab, tag) {
        try {
            if (!('Notification' in window) || Notification.permission !== 'granted') return;
            const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
            if (reg && reg.showNotification) await reg.showNotification(t, { body: b, icon: 'icon-192.png', badge: 'icon-192.png', tag, data: { tab } });
            else { const x = new Notification(t, { body: b, icon: 'icon-192.png', tag }); x.onclick = () => { window.focus(); if (tab && tab !== 'fitness') switchMainView(tab); x.close(); }; }
        } catch (e) {}
    }
    function tickRems() {
        const cfg = getJ('walletNotif', {}); if (cfg.on === false) return;
        const list = rems(), now = new Date(), hm = pad(now.getHours()) + ':' + pad(now.getMinutes()), td = todayStr(); let ch = false;
        list.forEach(r => {
            if (!r.on) return;
            const snoozed = r.snooze && Date.now() >= r.snooze, normal = !r.snooze && appliesToday(r) && hm >= r.time && r.last !== td;
            if (!snoozed && !normal) return;
            r.last = td; r.snooze = 0; if (r.rep === 'once' && !snoozed) r.on = false; if (r.rep === 'once' && snoozed) r.on = false; ch = true;
            const log = (() => { const l = getJ('walletNotifLog', { d: '', items: [] }); return l.d === td ? l : { d: td, items: [] }; })();
            log.items = log.items.filter(i => i.id !== 'c' + r.id); log.items.unshift({ id: 'c' + r.id, tab: r.tab || 'planner', t: r.title, b: r.note || repTxt(r), at: Date.now() }); setJ('walletNotifLog', log);
            notify(r.title, r.note || 'Reminder from C.A.S.P.E.R., sir.', r.tab || 'planner', 'wally-c' + r.id); toast('Reminder: ' + r.title);
        });
        if (ch) { setJ(RK, list); if ($('cx8Rem')) drawRems(); try { window.CXSys && CXSys.paint && CXSys.paint(); } catch (e) {} }
    }
    let remDays = [];
    function remForm() {
        return `<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div class="col-span-2"><label class="cx-lbl">Remind me to</label><input id="cx8RT" class="cx-in w-full" placeholder="Drink water, pay rent, call home…"></div>
            <div><label class="cx-lbl">Time</label><input id="cx8RH" type="time" class="cx-in w-full" value="${pad((new Date().getHours() + 1) % 24)}:00"></div>
            <div><label class="cx-lbl">Repeat</label><select id="cx8RR" class="cx-in w-full" onchange="CX8.remRep()"><option value="daily">Every day</option><option value="weekdays">Mon to Fri</option><option value="weekends">Sat and Sun</option><option value="days">Pick days</option><option value="monthly">Monthly</option><option value="once">Once</option></select></div>
            <div class="col-span-2 md:col-span-4" id="cx8RX"></div>
            <div class="col-span-2"><label class="cx-lbl">Note (optional)</label><input id="cx8RN" class="cx-in w-full" placeholder="Shown in the notification"></div>
            <div><label class="cx-lbl">Opens</label><select id="cx8RTab" class="cx-in w-full">${Object.keys(NAME).map(k => `<option value="${k}" ${k === 'planner' ? 'selected' : ''}>${NAME[k]}</option>`).join('')}<option value="fitness">Fitness</option></select></div>
            <div style="align-self:end"><button class="cx-btn green w-full" onclick="CX8.remAdd()">Add reminder</button></div></div>`;
    }
    function drawRems() {
        const box = $('cx8RemList'); if (!box) return; const l = rems();
        box.innerHTML = l.length ? l.map(r => `<div class="cx-row" style="margin-bottom:6px;flex-wrap:wrap;gap:8px"><input type="checkbox" class="form-check" ${r.on ? 'checked' : ''} onchange="CX8.remSet('${r.id}','on',this.checked)" title="On / off"><span class="flex-1" style="min-width:150px"><b class="text-sm text-white">${esc(r.title)}</b><br><span style="font-size:12px;color:#94a3b8">${repTxt(r)}${r.snooze ? ' • snoozed until ' + new Date(r.snooze).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''}${r.note ? ' • ' + esc(r.note) : ''}</span></span><input type="time" class="cx-in" style="width:112px" value="${r.time}" onchange="CX8.remSet('${r.id}','time',this.value)"><select class="cx-in" style="width:104px" onchange="CX8.remSnooze('${r.id}',this.value);this.value=''"><option value="">Snooze…</option><option value="10">10 min</option><option value="30">30 min</option><option value="60">1 hour</option><option value="180">3 hours</option><option value="0">Clear snooze</option></select><button class="cx-btn red sm" onclick="CX8.remDel('${r.id}')">Delete</button></div>`).join('') : '<div class="cx-empty">No reminders of your own yet. Add one above, or use a quick preset.</div>';
    }
    function injectRems() {
        const m = $('cxSysModal'); if (!m || $('cx8Rem')) return; const on = m.querySelector('.cx-btn.on'); if (!on || on.textContent.trim() !== 'Reminders') return;
        const host = m.firstElementChild; const lbl = [...host.querySelectorAll('p.cx-lbl')].find(p => p.textContent.trim() === 'Today');
        const html = `<div id="cx8Rem" style="margin:16px 0;padding:14px;border:1px solid ${PLAN}55;border-radius:14px;background:rgba(198,244,50,.04)"><p class="cx-lbl" style="color:${PLAN}">Your own reminders</p><p style="font-size:12.5px;color:#94a3b8;margin-bottom:10px">Any text, any time, any days. Change the time or switch one off straight from the list. Snooze pushes a single reminder back without changing its schedule.</p>${remForm()}<div class="flex flex-wrap gap-2" style="margin:10px 0">${[['Drink water', '11:00', 'daily'], ['Log today’s expenses', '21:30', 'daily'], ['Workout', '18:30', 'weekdays'], ['Review the week', '19:00', 'weekends'], ['Pay rent', '09:00', 'monthly']].map(p => `<button class="cx-btn sm" onclick="CX8.remPreset('${p[0].replace(/'/g, '’')}','${p[1]}','${p[2]}')">+ ${p[0]}</button>`).join('')}</div><div id="cx8RemList"></div></div>`;
        if (lbl) lbl.insertAdjacentHTML('beforebegin', html); else host.insertAdjacentHTML('beforeend', html);
        remDays = []; drawRems();
    }
    function remRep() {
        const v = $('cx8RR').value, x = $('cx8RX');
        x.innerHTML = v === 'days' ? `<label class="cx-lbl">Days</label><div class="flex flex-wrap gap-2">${DAYS.map((d, i) => `<button type="button" class="cx-btn sm ${remDays.includes(i) ? 'on' : ''}" onclick="CX8.remDay(${i})">${d}</button>`).join('')}</div>` : v === 'once' ? `<label class="cx-lbl">Date</label><input id="cx8RD" type="date" class="cx-in" value="${todayStr()}">` : v === 'monthly' ? `<label class="cx-lbl">Day of the month</label><input id="cx8RM" type="number" min="1" max="31" class="cx-in" style="width:110px" value="${new Date().getDate()}">` : '';
    }
    const saveRem = r => { const l = rems(); l.push(Object.assign({ id: String(Date.now()) + Math.floor(Math.random() * 99), on: true, last: '', snooze: 0, note: '', tab: 'planner' }, r)); setJ(RK, l); drawRems(); toast('Reminder set: ' + r.title); };

    // ==========================================================================
    // 8. CAPTURE BOOKMARK — reads name, cost and picture more thoroughly
    // ==========================================================================
    function bookmarklet(kind) {
        const app = location.href.split('#')[0];
        const code = `(function(){var K='${kind}',A=${JSON.stringify(app)},d=document,
q=function(s){try{var e=d.querySelector(s);return e?String(e.getAttribute('content')||e.getAttribute('data-price')||e.innerText||e.value||'').trim():''}catch(x){return ''}},
at=function(s,a){try{var e=d.querySelector(s);return e?(e.getAttribute(a)||''):''}catch(x){return ''}},
num=function(v){v=String(v||'').replace(/,/g,'');var m=v.match(/\\d+(\\.\\d+)?/);return m?parseFloat(m[0]):0},ld={};
try{[].forEach.call(d.querySelectorAll('script[type="application/ld+json"]'),function(s){try{var j=JSON.parse(s.textContent);(Array.isArray(j)?j:[j].concat(j['@graph']||[])).forEach(function(o){if(o&&/Product|Movie|Book|TVSeries|CreativeWork/.test([].concat(o['@type']||'').join())&&(!ld.name||o.offers))ld=o})}catch(x){}})}catch(e){}
var of=ld.offers?(Array.isArray(ld.offers)?ld.offers[0]:ld.offers):{};
var pr=num(of.price||of.lowPrice||(of.priceSpecification||{}).price);
var ps=['meta[property="product:price:amount"]','meta[property="og:price:amount"]','meta[itemprop="price"]','[itemprop="price"]','#corePriceDisplay_desktop_feature_div .a-price .a-offscreen','#corePrice_feature_div .a-offscreen','.priceToPay .a-offscreen','.a-price .a-offscreen','#priceblock_ourprice','#priceblock_dealprice','.Nx9bqj.CxhGGd','.Nx9bqj','._30jeq3','.pdp-price strong','.pdp-price','.prod-sp','.pdp__offerPrice','#pdp-product-price','.product-price .amount','.price__current','.price-item--sale','.price-item--regular','.woocommerce-Price-amount','[data-testid*="price"]','[class*="selling-price"]','[class*="sellingPrice"]','[class*="final-price"]','[class*="finalPrice"]','[class*="offer-price"]','[class*="Price"]','[class*="price"]'];
for(var i=0;i<ps.length&&!pr;i++){pr=num(q(ps[i]))}
if(!pr){var m=(d.body.innerText||'').match(/(?:\\u20B9|Rs\\.?|INR|\\$|\\u20AC|\\u00A3)\\s?([\\d,]+(?:\\.\\d+)?)/);if(m)pr=num(m[1])}
var im=ld.image;if(Array.isArray(im))im=im[0];if(im&&im.url)im=im.url;
im=im||q('meta[property="og:image"]')||q('meta[property="og:image:secure_url"]')||q('meta[name="twitter:image"]')||at('link[rel="image_src"]','href')||at('#landingImage','data-old-hires')||at('#landingImage','src')||at('#imgBlkFront','src')||at('img.DByuf4','src')||at('img._396cs4','src')||at('.image-grid-image','style').replace(/.*url\\(["']?([^"')]+).*/,'$1')||at('[itemprop="image"]','src')||at('[itemprop="image"]','content')||'';
if(!im){var b=null,ba=0;[].forEach.call(d.images,function(g){var a=(g.naturalWidth||0)*(g.naturalHeight||0);if(a>ba&&g.naturalWidth>199&&/^https?:/.test(g.currentSrc||g.src)){ba=a;b=g}});if(b)im=b.currentSrc||b.src}
try{if(im&&!/^(https?:|data:)/.test(im))im=new URL(im,location.href).href}catch(e){}
var pn=function(x){x=Array.isArray(x)?x[0]:x;return x?(x.name||x):''};
var rt=ld.aggregateRating?(ld.aggregateRating.ratingValue||''):'',br=pn(ld.brand),ds=String(ld.description||q('meta[property="og:description"]')||q('meta[name="description"]')||'');
var o={v:1,k:K,t:String(ld.name||q('meta[property="og:title"]')||q('#productTitle')||q('h1')||d.title).replace(/\\s+/g,' ').slice(0,160),p:pr,i:String(im||''),u:location.href,d:((br?'Brand: '+br+'. ':'')+(rt?'Rated '+rt+'. ':'')+ds).replace(/\\s+/g,' ').slice(0,280),ty:[].concat(ld['@type']||'').join(),g:[].concat(ld.genre||'').join(', '),a:String(pn(ld.author)||pn(ld.director)||'')};
var s='CASPER::'+JSON.stringify(o);try{navigator.clipboard.writeText(s)}catch(e){}
if(/^https?:/.test(A)){window.open(A+'#casper='+encodeURIComponent(s.slice(8)),'casper')}else{prompt('Copied. If not, copy this, then press "Paste captured data" in C.A.S.P.E.R.',s)}})();`;
        return 'javascript:' + encodeURIComponent(code.replace(/\n/g, ''));
    }
    function copyMark(kind) { const c = bookmarklet(kind); (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(() => toast('Bookmark code copied. Make a new bookmark and paste it as the address.')).catch(() => prompt('Copy this and save it as a bookmark address:', c)); }
    function guideHTML(kind) {
        const isM = kind === 'm', where = isM ? 'Library' : 'Wishlist', sites = isM ? 'IMDb, Goodreads, MyAnimeList, Letterboxd' : 'Amazon, Flipkart, Myntra, Ajio, Croma';
        return `<p style="font-size:13px;color:#cbd5e1;line-height:1.6;margin-bottom:12px">The capture bookmark is a small button that lives in your browser. Press it while a ${isM ? 'title' : 'product'} page is open and it reads the <b class="text-white">name, ${isM ? 'poster, type and synopsis' : 'cost, picture, brand and rating'}</b> from that page and files it in the ${where}. It runs on your device only.</p>
            <p class="cx-lbl">On a laptop or desktop</p><ol class="cx8-steps" style="margin-bottom:14px"><li>Show the bookmarks bar: <b class="text-white">Ctrl + Shift + B</b> (Mac: ⌘ + Shift + B).</li><li>Drag this button onto the bar: <a class="cx-btn ${isM ? 'violet' : ''} sm" style="cursor:grab;display:inline-flex" href="${bookmarklet(kind)}" onclick="event.preventDefault();CX.toast('Drag it to the bookmarks bar, do not click it here.')">⇪ Send to ${where}</a></li><li>Open a page on ${sites} or any other shop, wait for it to finish loading, and click the bookmark.</li><li>This app opens with the item already saved. If the app runs as a local file, come back here and press <b class="text-white">Paste captured data</b>.</li></ol>
            <p class="cx-lbl">On a phone</p><ol class="cx8-steps" style="margin-bottom:14px"><li>Press <button class="cx-btn sm" onclick="CX8.copyMark('${kind}')">Copy bookmark code</button></li><li>Bookmark any page, then edit that bookmark: name it <b class="text-white">Send to ${where}</b> and replace its address with the copied code.</li><li>On the product page, tap the address bar, type <b class="text-white">Send to</b> and pick the bookmark from the suggestions. Opening it from the bookmarks menu does not run it on the page.</li></ol>
            <p class="cx-lbl">If the cost or picture is missing</p><ol class="cx8-steps"><li>Let the page load fully and pick the size or variant first; many shops only show the price after that.</li><li>Use the product page itself, not a search or listing page.</li><li>Still blank? Press <b class="text-white">Modify</b> on the item and type the price, or paste a picture address. You saved an older copy of the bookmark? Delete it and drag the new button; this version reads more shops.</li></ol>`;
    }
    function guide(kind) { modal('cx8Guide', 'Capture bookmark: setup guide', guideHTML(kind), 760); }
    function capGuide() {
        ['w', 'm'].forEach(k => {
            const p = $('cxCapture_' + k); if (!p) return;
            const a = p.querySelector('a.cx-btn[href^="javascript:"]'); if (a && !a.dataset.x8) { a.dataset.x8 = '1'; a.href = bookmarklet(k); }
            const cp = [...p.querySelectorAll('button')].find(b => /Copy bookmark code/.test(b.textContent)); if (cp && !cp.dataset.x8) { cp.dataset.x8 = '1'; cp.setAttribute('onclick', `CX8.copyMark('${k}')`); }
            if (!$('cx8Guide_' + k)) {
                const isM = k === 'm', col = isM ? '#a855f7' : '#38bdf8';
                p.insertAdjacentHTML('afterend', `<details id="cx8Guide_${k}" class="glass-panel p-5 md:p-6" style="border-color:${col}55"><summary class="cx-h" style="color:${col};margin-bottom:0;cursor:pointer;list-style:none"><i data-lucide="life-buoy" class="w-4 h-4"></i> How to set up the capture bookmark <span style="margin-left:auto;font-size:11px;color:#94a3b8">tap to open</span></summary><div style="margin-top:14px">${guideHTML(k)}</div></details>`); icons();
            }
        });
    }
    // items saved without a cost or picture are completed from the page when the network allows it
    let filling = false;
    async function backfill() {
        if (filling || !navigator.onLine || !window.CXLookup || !/^https?:/.test(location.protocol)) return; filling = true;
        try {
            const tried = getJ('walletFillTried', {}); let n = 0;
            for (const [list, save, draw] of [[wishlistItems, window.saveWishlistLocally, window.renderWishlist], [mediaItems, window.saveMediaLocally, window.renderMedia]]) {
                for (const it of list) {
                    if (n >= 3) break; if (!it.link || !/^https?:/.test(it.link) || it.purchased || tried[it.id]) continue;
                    const needP = list === wishlistItems && !(+it.price > 0), needI = !it.imageUrl; if (!needP && !needI) continue;
                    n++; let o = null; try { o = await CXLookup.lookup(it.link); } catch (e) { continue; }
                    tried[it.id] = 1; if (!o) continue; let ch = false;
                    if (needP && +o.price > 0) { it.price = +o.price; ch = true; } if (needI && o.image) { it.imageUrl = o.image; ch = true; }
                    if (ch) { safe(() => save()); safe(() => draw()); toast(`Completed "${String(it.title).slice(0, 30)}" from its page.`); }
                }
            }
            setJ('walletFillTried', tried);
        } finally { filling = false; }
    }

    // ==========================================================================
    // 9. HUD INTRODUCTION BANNER — Mark 3 colours (hot-rod red, gold, arc blue) with live figures
    // ==========================================================================
    const R = '#0ea5e9', G = '#38bdf8', C = '#00e5ff';
    const HUDSVG = `<svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wally MK 3 live status">
        <defs><radialGradient id="cx8Glow" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#0b2a3a"/><stop offset=".55" stop-color="#07111c"/><stop offset="1" stop-color="#04060a"/></radialGradient>
        <radialGradient id="cx8Arc" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#b9f1ff"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></radialGradient>
        <linearGradient id="cx8Gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0284c7"/></linearGradient>
        <linearGradient id="cx8Red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff3b3b"/><stop offset="1" stop-color="#8e0f16"/></linearGradient>
        <pattern id="cx8Grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${G}" stroke-opacity=".07" stroke-width="1"/></pattern>
        <linearGradient id="cx8Sweep" x1="0" x2="1"><stop offset="0" stop-color="${C}" stop-opacity="0"/><stop offset=".5" stop-color="${C}" stop-opacity=".14"/><stop offset="1" stop-color="${C}" stop-opacity="0"/></linearGradient></defs>
        <rect width="1000" height="300" fill="url(#cx8Glow)"/><rect width="1000" height="300" fill="url(#cx8Grid)"/><rect class="scan" x="0" y="0" width="200" height="300" fill="url(#cx8Sweep)"/>
        <g fill="none" stroke="${R}" stroke-width="3" stroke-linecap="square"><path d="M20 60V20H120"/><path d="M880 20H980V60"/><path d="M20 240V280H120"/><path d="M880 280H980V240"/></g>
        <g fill="none" stroke="${G}" stroke-width="1.5" opacity=".85"><path d="M150 20H330L345 34H655L670 20H850"/><path d="M150 280H330L345 266H655L670 280H850"/></g>
        <g fill="url(#cx8Gold)"><rect x="20" y="130" width="5" height="40"/><rect x="975" y="130" width="5" height="40"/></g>
        <g fill="none">
            <circle cx="500" cy="150" r="106" stroke="${R}" stroke-width="5" stroke-opacity=".55"/>
            <circle class="rA" cx="500" cy="150" r="95" stroke="url(#cx8Gold)" stroke-width="4" stroke-dasharray="70 24 12 24" stroke-linecap="round"/>
            <circle class="rB" cx="500" cy="150" r="80" stroke="${R}" stroke-width="2.5" stroke-dasharray="4 10"/>
            <circle cx="500" cy="150" r="62" stroke="${C}" stroke-width="6" stroke-opacity=".55"/>
            <g class="rA">${Array.from({ length: 10 }, (_, i) => `<rect x="494" y="92" width="12" height="20" rx="2" fill="${C}" fill-opacity=".85" transform="rotate(${i * 36} 500 150)"/>`).join('')}</g>
            <circle cx="500" cy="150" r="34" stroke="${G}" stroke-width="2"/></g>
        <circle class="core" cx="500" cy="150" r="30" fill="url(#cx8Arc)"/><path d="M500 132 L515.6 159 H484.4 Z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity=".9"/>
    </svg>`;
    function liveData() {
        const now = new Date(), td = todayStr(), st = monthStats(), bal = balances(), o = {};
        const todayTx = transactions.filter(t => new Date(t.timestamp).toDateString() === now.toDateString());
        const spentToday = todayTx.filter(t => t.type === 'expense').reduce((s, t) => s + (+t.amount || 0), 0);
        const pct = st.budget > 0 ? Math.round(st.spent / st.budget * 100) : 0;
        const tk = getJ('walletTasks', []).filter(t => !t.done), due = tk.filter(t => t.due === td).length, over = tk.filter(t => t.due && t.due < td).length;
        let hOpen = 0, hAll = 0; try { hAll = customHabits.length; hOpen = customHabits.filter(h => !(habitHistory[td] || []).includes(h.id)).length; } catch (e) {}
        const last = transactions.slice().sort((a, b) => b.timestamp - a.timestamp)[0];
        const days = []; for (let i = 11; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = d.toDateString(); days.push(transactions.filter(t => t.type === 'expense' && new Date(t.timestamp).toDateString() === k).reduce((s, t) => s + (+t.amount || 0), 0)); }
        o.l1 = 'SYSTEM: ' + (navigator.onLine ? 'ONLINE' : 'OFFLINE, LOCAL DATA') + ' • ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
        o.l2 = last ? 'LAST ENTRY: ' + String(last.note || last.category || '').slice(0, 16).toUpperCase() + ' ' + (last.type === 'income' ? '+' : '−') + inr(last.amount) : 'NO ENTRIES YET';
        o.rows = [['LIQUID ASSETS', inr(bal.liquid)], ['SAFE TO SPEND TODAY', inr(st.safe)], ['SPENT TODAY', inr(spentToday) + ' • ' + pct + '% OF BUDGET'], ['TASKS DUE', due + (over ? ' +' + over + ' LATE' : '') + ' • HABITS ' + (hAll - hOpen) + '/' + hAll]];
        o.warnBudget = pct >= 90; o.warnTasks = over > 0; o.days = days; o.dayLeft = st.dim - st.day; return o;
    }
    function hudLive() {
        const h = $('cx8Hud'); if (!h) return; const o = liveData(), set = (id, t) => { const e = $(id); if (e && e.textContent !== t) e.textContent = t; };
        set('cx8L1', o.l1); set('cx8L2', o.l2); o.rows.forEach((r, i) => set('cx8D' + (i + 1), r[0] + ': ' + r[1]));
        const b3 = $('cx8B3'), b4 = $('cx8B4'); if (b3) b3.setAttribute('fill', o.warnBudget ? R : '#34d399'); if (b4) b4.setAttribute('fill', o.warnTasks ? R : '#34d399');
        const mx = Math.max(1, ...o.days), bars = $('cx8Bars'); if (bars) bars.innerHTML = o.days.map((v, i) => { const hh = Math.max(3, Math.round(v / mx * 44)); return `<rect x="${722 + i * 18}" y="${262 - hh}" width="11" height="${hh}" rx="1.5" fill="${i === 11 ? G : v / mx > .75 ? R : C}" fill-opacity="${v ? .9 : .3}"><title>${inr(v)}</title></rect>`; }).join('');
        const lv = $('cx8Live'); if (lv) lv.innerHTML = o.rows.map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
    }
    function hudIntro() {
        const el = $('cxIntro'); if (!el) return;
        if (!el.querySelector('#cx8Hud')) { el.insertAdjacentHTML('afterbegin', `<div id="cx8Hud">${HUDSVG}</div>`); if (innerWidth < 641) { const s = el.querySelector('#cx8Hud svg'); if (s) s.setAttribute('viewBox', '250 0 500 300'); } }
        if (!el._x8) { el._x8 = new MutationObserver(() => { if (!el.querySelector('#cx8Hud')) hudIntro(); }); el._x8.observe(el, { childList: true }); }
        safe(hudLive);
    }

    // ==========================================================================
    // API + BOOT
    // ==========================================================================
    window.CX8 = {
        graph, glossary, glossHTML, guide, copyMark, bookmarklet,
        brief(d) { bi += d; bHold = Date.now(); typeBrief(); },
        remRep, remDay(i) { remDays = remDays.includes(i) ? remDays.filter(x => x !== i) : remDays.concat(i).sort(); remRep(); },
        remAdd() {
            const title = $('cx8RT').value.trim(), time = $('cx8RH').value, rep = $('cx8RR').value; if (!title) return toast('Tell me what to remind you of, sir.', true); if (!time) return toast('Pick a time.', true);
            if (rep === 'days' && !remDays.length) return toast('Pick at least one day.', true);
            saveRem({ title, time, rep, days: remDays.slice(), date: rep === 'once' ? ($('cx8RD').value || todayStr()) : '', dom: rep === 'monthly' ? Math.max(1, Math.min(31, +$('cx8RM').value || 1)) : 0, note: $('cx8RN').value.trim(), tab: $('cx8RTab').value });
            $('cx8RT').value = ''; $('cx8RN').value = '';
            if ('Notification' in window && Notification.permission === 'default') safe(() => Notification.requestPermission());
        },
        remPreset(title, time, rep) { saveRem({ title, time, rep, days: [], date: '', dom: rep === 'monthly' ? 1 : 0 }); },
        remSet(id, k, v) { const l = rems(), r = l.find(x => x.id === id); if (!r) return; r[k] = v; if (k === 'time') r.last = ''; setJ(RK, l); drawRems(); },
        remSnooze(id, min) { if (min === '') return; const l = rems(), r = l.find(x => x.id === id); if (!r) return; r.snooze = +min ? Date.now() + min * 60000 : 0; if (+min) r.on = true; setJ(RK, l); drawRems(); toast(+min ? `Snoozed for ${min} minutes.` : 'Snooze cleared.'); },
        remDel(id) { setJ(RK, rems().filter(x => x.id !== id)); drawRems(); },
        reminders: rems, tick: tickRems
    };
    function boot() {
        safe(decorate); safe(greeting); safe(hudIntro); safe(tickRems);
        document.querySelectorAll('.cx-avring').forEach(e => { e.style.display = 'none'; });
    }
    const start = () => {
        setTimeout(boot, 1300); setTimeout(boot, 2600);
        setInterval(() => { safe(decorate); safe(greeting); safe(hudIntro); }, 2000);
        setInterval(() => { safe(tickRems); safe(hudLive); }, 30000); ['storage', 'online', 'offline', 'focus'].forEach(e => window.addEventListener(e, () => safe(hudLive)));
        new MutationObserver(() => safe(injectRems)).observe(document.body, { childList: true });
        document.addEventListener('visibilitychange', () => { if (!document.hidden) safe(tickRems); });
        // nothing may stay invisible: finish every entrance animation in the open tab
        setInterval(() => document.querySelectorAll('.view-card.active .cx-rv:not(.cx-on)').forEach(p => p.classList.add('cx-on')), 2500);
        setTimeout(() => safe(backfill), 9000);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();


/* ============================================================================
   WALLY MK 3 — ROUND 10 (appended; nothing above is changed)
   1 readable spend map: amounts in cells, measures, category filter, year strip,
     continuous flow line, week totals, day detail
   2 capture bookmark uses the backend routes (/api/bookmark…) when the cloud is linked
   ============================================================================ */
(function () {
    'use strict';
    if (!window.CX) return;
    const { $, esc, inr, getJ, setJ, icons, mKey, toast } = window.CX;
    const safe = fn => { try { return fn(); } catch (e) { console.warn('v9', e); } };
    const dk = d => new Date(d).toLocaleDateString('en-CA');
    const short = n => { const a = Math.abs(n), s = n < 0 ? '−' : ''; return s + (a >= 100000 ? (a / 100000).toFixed(1) + 'L' : a >= 1000 ? (a / 1000).toFixed(a >= 10000 ? 0 : 1) + 'k' : String(Math.round(a))); };
    const cfg = () => Object.assign({ view: 'month', metric: 'spend', cat: '', cum: false }, getJ('walletHeatCfg', {}));
    const METRIC = { spend: ['Spend', '251,146,36', '#fbbf24'], income: ['Income', '52,211,153', '#34d399'], net: ['Net', '52,211,153', '#38bdf8'], count: ['Payments', '0,229,255', '#00e5ff'] };

    const css = document.createElement('style');
    css.textContent = `
    #cx9Bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 0 0 10px; } #cx9Bar .cx-in { padding: 6px 9px; font-size: 12px; }
    #cx9Bar .seg { display: inline-flex; border: 1px solid rgba(251,191,36,.4); border-radius: 10px; overflow: hidden; } #cx9Bar .seg button { padding: 6px 11px; font: 700 11px 'Oxanium', sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #cbd5e1; } #cx9Bar .seg button.on { background: #fbbf24; color: #000; }
    #upgHeatmap .cx9-cell { aspect-ratio: auto; min-height: 52px; flex-direction: column; align-items: stretch; justify-content: space-between; padding: 4px 5px; font-family: 'Oxanium', sans-serif; }
    #upgHeatmap .cx9-cell .n { font-size: 10px; font-weight: 700; opacity: .8; text-align: left; line-height: 1; } #upgHeatmap .cx9-cell .v { font-size: 12.5px; font-weight: 800; text-align: right; line-height: 1.1; white-space: nowrap; }
    #upgHeatmap .cx9-cell.we { border-color: rgba(255,255,255,.2); } #upgHeatmap .cx9-cell.fut { opacity: .35; } #upgHeatmap .cx9-cell .cx-chip { display: none; }
    #cx9Stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); gap: 6px; margin-top: 12px; } #cx9Stats div { border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 7px 9px; background: rgba(255,255,255,.025); min-width: 0; }
    #cx9Stats span { display: block; font: 700 9px 'Oxanium', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #94a3b8; } #cx9Stats b { font: 700 14px 'Oxanium', sans-serif; color: #fff; overflow-wrap: anywhere; }
    #cx9Weeks { display: flex; gap: 6px; margin-top: 10px; align-items: flex-end; height: 62px; } #cx9Weeks div { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 3px; height: 100%; min-width: 0; }
    #cx9Weeks i { display: block; width: 100%; border-radius: 5px 5px 2px 2px; min-height: 3px; } #cx9Weeks small { font: 700 9.5px 'Oxanium', sans-serif; color: #cbd5e1; white-space: nowrap; } #cx9Weeks em { font: 700 8.5px 'Oxanium', sans-serif; color: #64748b; font-style: normal; letter-spacing: .08em; }
    #cx9Year { overflow-x: auto; padding-bottom: 6px; } #cx9Year .g { display: grid; grid-template-rows: 14px repeat(7, 15px); grid-auto-flow: column; grid-auto-columns: 15px; gap: 3px; width: max-content; }
    #cx9Year .g i { border-radius: 3px; cursor: pointer; } #cx9Year .g i:hover { outline: 1px solid #fff; } #cx9Year .g em { font: 700 9px 'Oxanium', sans-serif; color: #94a3b8; font-style: normal; white-space: nowrap; overflow: visible; }
    #cx9FlowBox { position: relative; height: 180px; margin-top: 12px; } #cx9FlowHead { display: flex; align-items: center; gap: 8px; margin-top: 14px; font: 700 10.5px 'Oxanium', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #fbbf24; }
    #cx9Legend { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin-top: 10px; font: 600 10.5px 'Oxanium', sans-serif; color: #94a3b8; } #cx9Legend i { display: inline-block; width: 14px; height: 14px; border-radius: 4px; vertical-align: -3px; margin-right: 4px; border: 1px solid rgba(255,255,255,.1); }
    #cxHeatLegend { display: none !important; }
    @media (max-width: 640px) { #upgHeatmap .cx9-cell { min-height: 44px; padding: 3px; } #upgHeatmap .cx9-cell .v { font-size: 10px; } #upgHeatmap .cx9-cell .n { font-size: 9px; } }
    `;
    document.head.appendChild(css);

    // ---- data ----------------------------------------------------------------
    function dayMap(c) {
        const map = {}; const cat = c.cat;
        transactions.forEach(t => {
            if (t.account === 'Emergency' || (t.type !== 'expense' && t.type !== 'income')) return; if (cat && t.category !== cat) return;
            const k = dk(t.timestamp), d = map[k] || (map[k] = { spend: 0, income: 0, count: 0, tx: [] });
            if (t.type === 'expense') { d.spend += +t.amount || 0; d.count++; } else d.income += +t.amount || 0; d.tx.push(t);
        });
        return map;
    }
    const val = (d, m) => !d ? 0 : m === 'net' ? d.income - d.spend : d[m];
    function scale(vals) { const a = vals.map(Math.abs).filter(v => v > 0).sort((x, y) => x - y); if (!a.length) return [0, 0, 0, 0]; const q = p => a[Math.min(a.length - 1, Math.floor(p * a.length))]; return [q(.4), q(.7), q(.9), a[a.length - 1]]; }
    const level = (v, sc) => { v = Math.abs(v); return v <= 0 ? 0 : v <= sc[0] ? 1 : v <= sc[1] ? 2 : v <= sc[2] ? 3 : 4; };
    const ALPHA = [0, .2, .42, .7, .95];
    function colour(v, lv, m) { if (!lv) return 'rgba(255,255,255,.03)'; if (m === 'spend') return ['', 'rgba(251,191,36,.22)', 'rgba(251,191,36,.5)', 'rgba(249,115,22,.78)', 'rgba(239,68,68,.92)'][lv]; const rgb = m === 'net' && v < 0 ? '239,68,68' : METRIC[m][1]; return `rgba(${rgb},${ALPHA[lv]})`; }
    const fmt = (v, m) => m === 'count' ? String(v) : inr(v);

    // ---- render --------------------------------------------------------------
    let flow = null;
    function enhance() {
        const el = $('upgHeatmap'), sel = $('cxHeatSel'); if (!el || !sel) return;
        const c = cfg(), cur = sel.value, [y, mo] = cur.split('-').map(Number), map = dayMap(c), m = c.metric, panel = el.closest('.glass-panel'), head = el.previousElementSibling;
        if (!$('cx9Bar')) {
            $('cxHeatNav').insertAdjacentHTML('afterend', `<div id="cx9Bar"><span class="seg" id="cx9View"><button data-v="month">Month</button><button data-v="year">12 months</button></span><select id="cx9Metric" class="cx-in" aria-label="Measure">${Object.keys(METRIC).map(k => `<option value="${k}">${METRIC[k][0]}</option>`).join('')}</select><select id="cx9Cat" class="cx-in" aria-label="Category" style="max-width:150px"></select><button class="cx-btn sm" id="cx9Today" title="Jump to this month">Today</button></div>`);
            el.insertAdjacentHTML('afterend', `<div id="cx9Year" style="display:none"></div><div id="cx9Legend"></div><div id="cx9Weeks"></div><div id="cx9Stats"></div><div id="cx9FlowHead"><span id="cx9FlowT" class="flex-1"></span><button class="cx-btn sm" id="cx9Cum">Running total</button></div><div id="cx9FlowBox"><canvas id="cx9Flow"></canvas></div>`);
            $('cx9View').addEventListener('click', e => { const b = e.target.closest('button'); if (b) set('view', b.dataset.v); });
            $('cx9Metric').addEventListener('change', e => set('metric', e.target.value)); $('cx9Cat').addEventListener('change', e => set('cat', e.target.value));
            $('cx9Cum').addEventListener('click', () => set('cum', !cfg().cum)); $('cx9Today').addEventListener('click', () => window.CXHeat && CXHeat.set(mKey(Date.now())));
            const pick = e => { const t = e.target.closest('[data-k]'); if (t) { const f = $('cxHeatFloat'); if (f) f.style.opacity = '0'; dayDetail(t.dataset.k); } };
            el.addEventListener('click', pick); $('cx9Year').addEventListener('click', pick);
        }
        const cats = [...new Set(transactions.filter(t => t.type === 'expense' || t.type === 'income').map(t => t.category).filter(Boolean))].sort();
        $('cx9Cat').innerHTML = `<option value="">All categories</option>` + cats.map(k => `<option ${k === c.cat ? 'selected' : ''}>${esc(k)}</option>`).join('');
        $('cx9Metric').value = m; document.querySelectorAll('#cx9View button').forEach(b => b.classList.toggle('on', b.dataset.v === c.view)); $('cx9Cum').classList.toggle('on', !!c.cum);
        const today = dk(Date.now()), dim = new Date(y, mo, 0).getDate();
        let keys = [];                                                            // the continuous run of days being shown
        if (c.view === 'year') { const end = new Date(Math.min(new Date(y, mo, 0).getTime(), Date.now())); for (let i = 364; i >= 0; i--) { const d = new Date(end); d.setDate(end.getDate() - i); keys.push(dk(d)); } }
        else for (let d = 1; d <= dim; d++) keys.push(dk(new Date(y, mo - 1, d)));
        const live = keys.filter(k => k <= today), vals = live.map(k => val(map[k], m)), sc = scale(vals);

        if (c.view === 'month') {
            el.style.display = ''; if (head) head.style.display = ''; $('cx9Year').style.display = 'none'; $('cx9Weeks').style.display = '';
            const off = (new Date(y, mo - 1, 1).getDay() + 6) % 7; let html = '<span></span>'.repeat(off);
            keys.forEach((k, i) => { const v = val(map[k], m), lv = level(v, sc), wd = new Date(k + 'T12:00').getDay(), fut = k > today;
                html += `<div class="cx-heat cx9-cell ${k === today ? 'today' : ''} ${wd === 0 || wd === 6 ? 'we' : ''} ${fut ? 'fut' : ''}" data-d="${i + 1}" data-k="${k}" style="background:${colour(v, lv, m)};color:${lv >= 3 ? '#000' : '#e2e8f0'}"><span class="n">${i + 1}</span><span class="v">${v ? (m === 'count' ? v : short(v)) : ''}</span></div>`; });
            el.innerHTML = html;
            const wk = []; keys.forEach((k, i) => { const w = Math.floor((i + off) / 7); wk[w] = (wk[w] || 0) + val(map[k], m); }); const wmx = Math.max(1, ...wk.map(Math.abs));
            $('cx9Weeks').innerHTML = wk.map((v, i) => `<div title="Week ${i + 1}: ${fmt(v, m)}"><small>${m === 'count' ? v : short(v)}</small><i style="height:${Math.round(Math.abs(v) / wmx * 30) + 3}px;background:${m === 'net' && v < 0 ? '#ef4444' : METRIC[m][2]}"></i><em>WEEK ${i + 1}</em></div>`).join('');
        } else {
            el.style.display = 'none'; if (head) head.style.display = 'none'; $('cx9Weeks').style.display = 'none'; const yb = $('cx9Year'); yb.style.display = '';
            const first = new Date(keys[0] + 'T12:00'), lead = (first.getDay() + 6) % 7; let cells = '', col = 0, lastM = -1;
            const total = lead + keys.length, cols = Math.ceil(total / 7);
            for (let cI = 0; cI < cols; cI++) { let lbl = ''; for (let r = 0; r < 7; r++) { const idx = cI * 7 + r - lead; if (idx >= 0 && idx < keys.length) { const d = new Date(keys[idx] + 'T12:00'); if (d.getMonth() !== lastM && d.getDate() <= 7) { lbl = d.toLocaleDateString('en-GB', { month: 'short' }); lastM = d.getMonth(); } } }
                cells += `<em>${lbl}</em>`; for (let r = 0; r < 7; r++) { const idx = cI * 7 + r - lead; if (idx < 0 || idx >= keys.length) { cells += '<span></span>'; continue; } const k = keys[idx], v = val(map[k], m), lv = level(v, sc); cells += `<i data-k="${k}" style="background:${colour(v, lv, m)}" title="${new Date(k + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}: ${fmt(v, m)}"></i>`; } }
            yb.innerHTML = `<div class="g">${cells}</div>`; yb.scrollLeft = yb.scrollWidth;
        }
        $('cx9Legend').innerHTML = `<span>${METRIC[m][0]} per day${c.cat ? ' • ' + esc(c.cat) : ''}:</span>` + [0, 1, 2, 3, 4].map(l => `<span><i style="background:${colour(1, l, m)}"></i>${l === 0 ? 'none' : l === 1 ? 'up to ' + fmt(sc[0], m) : l === 4 ? 'above ' + fmt(sc[2], m) : 'to ' + fmt(sc[l - 1], m)}</span>`).join('') + (m === 'net' ? '<span><i style="background:rgba(239,68,68,.7)"></i>spent more than earned</span>' : '') + '<span style="margin-left:auto;color:#fbbf24">Tap a day for its entries</span>';

        // stats
        const tot = vals.reduce((a, b) => a + b, 0), act = vals.filter(v => v !== 0).length, zero = live.filter(k => !(map[k] && map[k].spend > 0)).length;
        let streak = 0, best = 0; live.forEach(k => { if (!(map[k] && map[k].spend > 0)) { streak++; best = Math.max(best, streak); } else streak = 0; });
        const wdTot = [0, 0, 0, 0, 0, 0, 0]; live.forEach((k, i) => { wdTot[new Date(k + 'T12:00').getDay()] += Math.abs(vals[i]); }); const bw = wdTot.indexOf(Math.max(...wdTot));
        let pk = -1; vals.forEach((v, i) => { if (pk < 0 || Math.abs(v) > Math.abs(vals[pk])) pk = i; });
        const we = live.reduce((s, k, i) => { const w = new Date(k + 'T12:00').getDay(); return s + (w === 0 || w === 6 ? Math.abs(vals[i]) : 0); }, 0), absTot = vals.reduce((a, b) => a + Math.abs(b), 0);
        $('cx9Stats').innerHTML = [['Total', fmt(tot, m)], ['Daily average', fmt(live.length ? Math.round(tot / live.length) : 0, m)], ['Active days', act + ' of ' + live.length], ['No-spend days', zero], ['Best no-spend run', best + (best === 1 ? ' day' : ' days')], ['Heaviest weekday', absTot ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][bw] : '—'], ['Biggest day', pk >= 0 && vals[pk] ? new Date(live[pk] + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' • ' + (m === 'count' ? vals[pk] : short(vals[pk])) : '—'], ['Weekend share', absTot ? Math.round(we / absTot * 100) + '%' : '—']].map(s => `<div><span>${s[0]}</span><b>${s[1]}</b></div>`).join('');

        // continuous flow line: every day has a point, so the line never breaks
        const cv = $('cx9Flow'); if (!cv || !window.Chart) return;
        const series = keys.map(k => k > today ? null : val(map[k], m)); let run = 0;
        let data = c.cum ? series.map(v => v === null ? null : (run += v)) : series;
        const avg = series.map((v, i) => { if (v === null) return null; let s = 0, n = 0; for (let j = Math.max(0, i - 6); j <= i; j++) if (series[j] !== null) { s += series[j]; n++; } return n ? s / n : 0; });
        const yr = c.view === 'year' && !c.cum; if (yr) data = avg;   // a year of single days is too jagged to read: show the smoothed line
        const labels = keys.map(k => new Date(k + 'T12:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })), col = METRIC[m][2];
        $('cx9FlowT').textContent = (c.cum ? 'Running total' : 'Daily flow') + ' • ' + METRIC[m][0].toLowerCase() + (c.view === 'year' ? ' • last 12 months' : '');
        const sets = [{ label: c.cum ? 'Running total' : yr ? METRIC[m][0] + ', 7-day average' : METRIC[m][0], data, borderColor: col, backgroundColor: col + '2b', fill: true, tension: .38, cubicInterpolationMode: 'monotone', pointRadius: c.view === 'year' ? 0 : 2, pointHoverRadius: 5, borderWidth: 2, spanGaps: true }];
        if (!c.cum && !yr) sets.push({ label: '7-day average', data: avg, borderColor: '#f8fafc', borderDash: [5, 4], borderWidth: 1.5, pointRadius: 0, tension: .4, cubicInterpolationMode: 'monotone', spanGaps: true });
        if (flow) { try { flow.destroy(); } catch (e) {} }
        flow = new Chart(cv, { type: 'line', data: { labels, datasets: sets }, options: { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 10.5 } } }, tooltip: { callbacks: { label: x => x.dataset.label + ': ' + fmt(Math.round(x.parsed.y), m) } } }, scales: { x: { ticks: { color: '#94a3b8', maxTicksLimit: c.view === 'year' ? 12 : 8, font: { size: 10 } }, grid: { display: false } }, y: { ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => m === 'count' ? v : short(v) }, grid: { color: 'rgba(255,255,255,.06)' } } }, onClick: (e, a) => { if (a[0]) dayDetail(keys[a[0].index]); } } });
    }
    function set(k, v) { const c = cfg(); c[k] = v; setJ('walletHeatCfg', c); safe(enhance); }
    function dayDetail(k) {
        const d = dayMap({ cat: '' })[k] || { spend: 0, income: 0, tx: [] }, tx = d.tx.slice().sort((a, b) => b.amount - a.amount);
        const by = {}; tx.filter(t => t.type === 'expense').forEach(t => { by[t.category] = (by[t.category] || 0) + t.amount; });
        const old = $('cx9Day'); if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', `<div class="cx-modal" id="cx9Day"><div style="width:min(560px,100%)"><h3><span style="color:#fbbf24">${new Date(k + 'T12:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span><button class="cx-btn red sm" onclick="document.getElementById('cx9Day').remove()">Close</button></h3>
            <div class="cx8-kpis"><div><span>Spent</span><b style="color:#f87171">${inr(d.spend)}</b></div><div><span>Earned</span><b style="color:#34d399">${inr(d.income)}</b></div><div><span>Net</span><b>${inr(d.income - d.spend)}</b></div><div><span>Entries</span><b>${tx.length}</b></div></div>
            ${Object.keys(by).length ? `<p class="cx-lbl">By category</p><div style="margin-bottom:12px">${Object.entries(by).sort((a, b) => b[1] - a[1]).map(([c, v]) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12.5px;color:#cbd5e1"><span style="width:118px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(c)}</span><i style="flex:1;height:7px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden"><i style="display:block;height:100%;width:${Math.round(v / d.spend * 100)}%;background:#fbbf24"></i></i><b style="color:#fff">${inr(v)}</b></div>`).join('')}</div>` : ''}
            <p class="cx-lbl">Entries</p><div style="max-height:40vh;overflow-y:auto">${tx.length ? tx.map(t => `<div class="cx-row" style="margin-bottom:6px"><span class="flex-1 min-w-0"><b class="text-sm text-white">${esc(t.note || t.category || '')}</b><br><span style="font-size:11.5px;color:#94a3b8">${esc(t.category || '')} • ${esc(t.account || '')}</span></span><b style="color:${t.type === 'income' ? '#34d399' : '#f87171'}">${t.type === 'income' ? '+' : '−'}${inr(t.amount)}</b></div>`).join('') : '<div class="cx-empty">Nothing recorded on this day.</div>'}</div>
            <div style="margin-top:12px"><button class="cx-btn green sm" onclick="document.getElementById('cx9Day').remove();CXQuick.open()">Add an entry</button></div></div></div>`);
        $('cx9Day').addEventListener('mousedown', e => { if (e.target.id === 'cx9Day') $('cx9Day').remove(); });
    }
    const prevHeat = window.wallyHeatmap;
    window.wallyHeatmap = function (m) { const r = prevHeat.apply(this, arguments); safe(enhance); return r; };
    window.CXHeat9 = { set, dayDetail, refresh: () => safe(enhance) };

    // ==========================================================================
    // 2. CAPTURE BOOKMARK THROUGH THE BACKEND
    //    linked cloud  -> /api/bookmark-auto | /api/bookmark-media-auto (saves, tab closes)
    //    nothing read  -> /api/bookmark | /api/bookmark-media (small form to finish by hand)
    //    no backend    -> the earlier on-device hand-over (#casper=) keeps working
    // ==========================================================================
    const apiRoot = () => { try { return new URL(API_BASE, location.href).href.replace(/\/$/, ''); } catch (e) { return ''; } };
    const linked = () => !!localStorage.getItem('walletCloudLinked') && /^https?:/.test(location.protocol);
    if (window.CX8 && CX8.bookmarklet) {
        const local = CX8.bookmarklet;
        CX8.bookmarklet = function (kind) {
            const code = local(kind); if (!linked()) return code;
            const S = apiRoot(), key = localStorage.getItem('walletCloudKey') || '', media = kind === 'm';
            // reuse the page reader, then hand its result to the server instead of the app tab
            const tail = `var P=function(x){return encodeURIComponent(x||'')},S=${JSON.stringify(S)},Q='url='+P(o.u)+'&title='+P(o.t)+'&image='+P(o.i)+'&price='+P(o.p)+'&details='+P(o.d)+'&type='+P(o.ty)+'&genre='+P(o.g)+'&by='+P(o.a)+'&key='+P(${JSON.stringify(key)});` +
                `var ok=o.t&&(${media ? 'true' : 'o.p>0'});window.open(S+'/${media ? 'bookmark-media' : 'bookmark'}'+(ok?'-auto':'')+'?'+Q,'casper_save','width=440,height=620');})();`;
            const src = decodeURIComponent(code.slice(11)), cut = src.indexOf("var s='CASPER::'");
            return cut < 0 ? code : 'javascript:' + encodeURIComponent(src.slice(0, cut) + tail);
        };
        // refresh the drag buttons so they carry the right version
        const relink = () => ['w', 'm'].forEach(k => { document.querySelectorAll(`#cxCapture_${k} a.cx-btn[href^="javascript:"], #cx8Guide_${k} a.cx-btn[href^="javascript:"]`).forEach(a => { const mode = linked() ? 'srv' : 'loc'; if (a.dataset.x9 !== mode) { a.dataset.x9 = mode; a.href = CX8.bookmarklet(k); } }); const p = $('cxCapture_' + k); if (p && !p.querySelector('.cx9-mode')) p.insertAdjacentHTML('beforeend', `<p class="cx9-mode" style="font-size:12px;margin-top:10px;color:#94a3b8"></p>`); const n = p && p.querySelector('.cx9-mode'); if (n) n.innerHTML = linked() ? '<b style="color:#34d399">Backend mode.</b> The bookmark saves straight to your server and the pop-up closes itself; the item appears here at the next sync. If the page gives no price, a small form opens to finish it.' : '<b style="color:#fbbf24">On-device mode.</b> No backend is linked, so the bookmark hands the item to this open app. Link the cloud (shield button) and re-drag the button to save without opening the app.'; });
        setInterval(() => safe(relink), 2500);
    }
})();


/* ============================================================================
   WALLY MK 3 — ROUND 11 (appended; nothing above is changed)
   1 phone layout: roomier, lighter to draw, smooth scrolling
   2 arc reactor banner in 3D with live, tappable read-outs around it
   3 live-sync indicator
   ============================================================================ */
(function () {
    'use strict';
    if (!window.CX) return;
    const { $, esc, inr, getJ, todayStr, monthStats, balances } = window.CX;
    const safe = fn => { try { return fn(); } catch (e) { console.warn('v10', e); } };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 700;

    const css = document.createElement('style');
    css.textContent = `
    /* anything scrolled out of view stops animating; this is the biggest smoothness win on every device */
    .cx-off, .cx-off * { animation-play-state: paused !important; }
    html { scroll-behavior: auto; -webkit-tap-highlight-color: transparent; }
    /* scrolling: nothing may swallow a two-finger or touch scroll.
       - the page itself chains scrolling normally (an earlier "no bounce" rule could stop it in current Chrome/Brave)
       - charts let a vertical swipe through; only the sketch board keeps the finger for drawing */
    html, body { overscroll-behavior: auto !important; touch-action: auto; }
    canvas { touch-action: pan-y !important; }
    #whiteboard, #whiteboardCanvas, .cx-wb-stage > canvas, .fullscreen-wb canvas, canvas.cx-draw { touch-action: none !important; }
    #cxBg { pointer-events: none !important; }
    @media (max-width: 760px), (pointer: coarse) {
        /* blur behind every panel is the most expensive effect on a phone: keep it for pop-ups only */
        .glass-panel, .glass-input, .cx-tile, .cx-row, .nav-btn, header, #cxTabBar, .cx-banner, .cx-btn, .view-card * { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
        .glass-panel { background: rgba(5,11,20,.94) !important; box-shadow: 0 0 0 1px rgba(0,229,255,.08) !important; }
        .glass-panel:hover { transform: none !important; }
        #cxBg { opacity: .45; } .bg-mesh, .scanline, body::before, body::after { animation: none !important; }
        .view-card { transition: opacity .2s ease !important; transform: none !important; }
    }
    @media (max-width: 640px) {
        /* roomier: one clear column, consistent gaps, nothing hiding under the floating buttons */
        body { padding-left: 10px !important; padding-right: 10px !important; padding-bottom: 96px !important; }
        .view-card.active > * + *, #upgradeDeck > * + * { margin-top: 14px !important; }
        .glass-panel { padding: 16px !important; border-radius: 16px !important; }
        header.glass-panel, header .glass-panel { padding: 12px !important; }
        header h1, header .text-xl, header .text-2xl { font-size: 17px !important; line-height: 1.2 !important; }
        .cx-hbtns { width: auto !important; margin-left: auto; gap: 6px; } .cx-hbtns button { width: 36px; height: 36px; }
        header .universal-month-filter { padding-top: 9px !important; padding-bottom: 9px !important; font-size: 12px !important; }
        /* the tab row at the top becomes a slim swipeable strip; the bar at the bottom does the switching */
        header nav, header .nav-wrap, .nav-btn { scroll-snap-align: start; }
        .nav-btn { padding: 8px 12px !important; font-size: 10.5px !important; white-space: nowrap; flex: 0 0 auto !important; }
        .nav-btn svg { width: 14px !important; height: 14px !important; }
        #cxCmd { padding: 12px 14px; gap: 10px; flex-wrap: nowrap; align-items: center; } #cxCmd .hi { flex: 1 1 auto; } #cxCmd .hi h3 { font-size: 17px; }
        #cxClock { text-align: right; flex: 0 0 auto; } #cxClockT { font-size: 22px !important; } #cxClockD { font-size: 9px !important; white-space: nowrap; }
        #cxCmd .cx8-graph { order: 3; margin-left: 0; width: 32px; height: 32px; flex-basis: 32px; }
        #cxIntro { padding: 10px !important; }
        h2 { font-size: 16px !important; letter-spacing: .06em !important; } .text-4xl, .text-5xl { font-size: 30px !important; }
        .grid.grid-cols-2 > .cx-tile, .cx-tile { min-height: 74px; padding: 10px 12px; }
        .ledger-item { padding: 10px 12px !important; }
        input, select, textarea { font-size: 16px !important; }                              /* stops the phone zooming in on focus */
        button, .cx-btn, .nav-btn, select { touch-action: manipulation; }
        /* floating buttons: smaller, and they step aside while you scroll */
        #cxFab, .cx-chatfab, #casperToggleBtn { transition: transform .25s ease, opacity .25s ease !important; }
        #cxFab { width: 44px !important; height: 44px !important; font-size: 24px !important; left: 10px !important; bottom: 74px !important; }
        body.cx-scrolling #cxFab { transform: translateX(-70px); opacity: 0; } body.cx-scrolling .cx-chatfab, body.cx-scrolling #casperToggleBtn { transform: translateX(80px); opacity: 0; }
        #cxTabBar button { font-size: 8px; } #cxTabBar { box-shadow: 0 -6px 18px rgba(0,0,0,.5); }
        /* messages slide in at the top instead of covering the buttons at the bottom */
        #cxToast, .cx-toast { top: calc(10px + env(safe-area-inset-top)) !important; bottom: auto !important; left: 10px !important; right: 10px !important; transform: none !important; max-width: none !important; width: auto !important; font-size: 12.5px !important; padding: 10px 12px !important; }
        .cx-modal { padding: 8px !important; align-items: flex-end !important; } .cx-modal > div { max-height: 88vh; overflow-y: auto; border-radius: 18px 18px 10px 10px !important; padding: 16px !important; }
    }
    #cxCmdHi { display: block !important; width: fit-content; }
    /* ---- 3D reactor ---- */
    #cx8Hud { perspective: 900px; overflow: visible; background: transparent; border: 0; line-height: 1.2; }
    #cx10Stage { position: relative; transform-style: preserve-3d; transition: transform .25s ease-out; border-radius: 14px; border: 1px solid rgba(0,229,255,.45); background: radial-gradient(ellipse at 50% 50%, #0b2a3a 0%, #07111c 55%, #04060a 100%); min-height: 250px; will-change: transform; }
    #cx10Stage > svg { position: absolute; inset: 0; width: 100%; height: 100%; max-height: none !important; border-radius: 14px; transform: translateZ(0); }
    #cx10Stage > svg .core, #cx10Stage > svg circle, #cx10Stage > svg g.rA, #cx10Stage > svg path[d^="M500"] { visibility: hidden; }      /* the flat reactor gives way to the 3D one */
    #cx10Core { position: absolute; left: 50%; top: 50%; width: 190px; height: 190px; margin: -95px 0 0 -95px; transform-style: preserve-3d; transform: translateZ(60px); cursor: pointer; }
    #cx10Core i { position: absolute; inset: 0; border-radius: 50%; display: block; }
    #cx10Core .r1 { border: 4px solid rgba(14,165,233,.6); box-shadow: 0 0 22px rgba(0,229,255,.35), inset 0 0 18px rgba(0,229,255,.2); transform: translateZ(-34px); }
    #cx10Core .r2 { inset: 10px; border: 3px dashed #38bdf8; animation: cx10Spin 16s linear infinite; transform: translateZ(-12px); }
    #cx10Core .r3 { inset: 24px; border: 2px dotted #0ea5e9; animation: cx10Spin 9s linear infinite reverse; transform: translateZ(8px); }
    #cx10Core .r4 { inset: 38px; border: 7px solid rgba(0,229,255,.55); transform: translateZ(24px); background: conic-gradient(from 0deg, rgba(0,229,255,.9) 0 6%, transparent 6% 10%, rgba(0,229,255,.9) 10% 16%, transparent 16% 20%, rgba(0,229,255,.9) 20% 26%, transparent 26% 30%, rgba(0,229,255,.9) 30% 36%, transparent 36% 40%, rgba(0,229,255,.9) 40% 46%, transparent 46% 50%, rgba(0,229,255,.9) 50% 56%, transparent 56% 60%, rgba(0,229,255,.9) 60% 66%, transparent 66% 70%, rgba(0,229,255,.9) 70% 76%, transparent 76% 80%, rgba(0,229,255,.9) 80% 86%, transparent 86% 90%, rgba(0,229,255,.9) 90% 96%, transparent 96%); -webkit-mask: radial-gradient(circle, transparent 46%, #000 47%); mask: radial-gradient(circle, transparent 46%, #000 47%); animation: cx10Spin 22s linear infinite; }
    #cx10Core .r5 { inset: 66px; background: radial-gradient(circle, #fff 0%, #9af6ff 38%, rgba(0,229,255,.25) 70%, transparent 74%); box-shadow: 0 0 34px 8px rgba(0,229,255,.55); transform: translateZ(46px); animation: cx10Beat 2.6s ease-in-out infinite; }
    #cx10Core .tri { inset: 78px; border-radius: 0; transform: translateZ(58px); background: none; } #cx10Core .tri::before { content: ''; position: absolute; left: 50%; top: 46%; width: 0; height: 0; margin: -11px 0 0 -12px; border-left: 12px solid transparent; border-right: 12px solid transparent; border-bottom: 21px solid rgba(255,255,255,.92); filter: drop-shadow(0 0 5px #00e5ff); }
    #cx10Core.gyro .r2 { animation: cx10Gy1 2.2s ease-in-out 1; } #cx10Core.gyro .r3 { animation: cx10Gy2 2.2s ease-in-out 1; } #cx10Core.gyro .r1 { animation: cx10Gy3 2.2s ease-in-out 1; }
    @keyframes cx10Spin { to { rotate: 360deg; } } @keyframes cx10Beat { 0%,100% { scale: 1; opacity: .85; } 50% { scale: 1.1; opacity: 1; } }
    @keyframes cx10Gy1 { 50% { transform: translateZ(-12px) rotateX(180deg); } 100% { transform: translateZ(-12px) rotateX(360deg); } } @keyframes cx10Gy2 { 50% { transform: translateZ(8px) rotateY(180deg); } 100% { transform: translateZ(8px) rotateY(360deg); } } @keyframes cx10Gy3 { 50% { transform: translateZ(-34px) rotateX(70deg) rotateY(40deg); } 100% { transform: translateZ(-34px); } }
    .cx10-node { position: absolute; transform: translateZ(38px); min-width: 132px; max-width: 190px; padding: 8px 11px; border-radius: 12px; text-align: left; background: rgba(4,14,26,.82); border: 1px solid color-mix(in srgb, var(--c) 55%, transparent); box-shadow: 0 6px 18px rgba(0,0,0,.45), 0 0 14px color-mix(in srgb, var(--c) 22%, transparent); cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, background .2s; font-family: 'Oxanium', sans-serif; }
    .cx10-node:hover, .cx10-node:focus-visible, .cx10-node.on { transform: translateZ(74px) scale(1.05); background: rgba(6,22,38,.96); box-shadow: 0 10px 26px rgba(0,0,0,.55), 0 0 22px color-mix(in srgb, var(--c) 50%, transparent); outline: none; }
    .cx10-node span { display: block; font-size: 9.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--c); } .cx10-node b { display: block; font-size: 17px; font-weight: 800; color: #fff; line-height: 1.15; } .cx10-node small { display: block; font-size: 10.5px; color: #94a3b8; line-height: 1.3; }
    .cx10-node::after { content: ''; position: absolute; top: 50%; width: 34px; height: 1px; background: linear-gradient(90deg, var(--c), transparent); opacity: .7; }
    .cx10-node.L { left: 4%; } .cx10-node.L::after { left: 100%; } .cx10-node.R { right: 4%; text-align: right; } .cx10-node.R::after { right: 100%; transform: scaleX(-1); }
    .cx10-node.n0 { top: 9%; } .cx10-node.n1 { top: 39%; } .cx10-node.n2 { top: 69%; } .cx10-node.L.n1 { left: 9%; } .cx10-node.R.n1 { right: 9%; }
    #cx10Tip { position: absolute; left: 50%; bottom: 8px; transform: translate(-50%, 0) translateZ(50px); font: 600 10.5px 'Oxanium', sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #7dd3fc; white-space: nowrap; pointer-events: none; text-shadow: 0 0 8px #000; }
    #cx10Live { display: inline-flex; align-items: center; gap: 6px; font: 700 10px 'Oxanium', sans-serif; letter-spacing: .12em; text-transform: uppercase; color: #94a3b8; margin-left: 10px; } #cx10Live i { width: 7px; height: 7px; border-radius: 50%; background: #64748b; } #cx10Live.on { color: #34d399; } #cx10Live.on i { background: #34d399; box-shadow: 0 0 8px #34d399; animation: cx8Blink 1.6s steps(2) infinite; }
    @media (max-width: 760px) {
        #cx10Stage { min-height: 0; padding: 150px 8px 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; transform: none !important; }
        #cx10Core { top: 75px; width: 130px; height: 130px; margin: -65px 0 0 -65px; } #cx10Core .r4 { inset: 26px; border-width: 5px; } #cx10Core .r5 { inset: 44px; } #cx10Core .tri { inset: 53px; } #cx10Core .r3 { inset: 16px; } #cx10Core .r2 { inset: 7px; }
        .cx10-node { position: static; transform: none !important; min-width: 0; max-width: none; text-align: left !important; padding: 7px 9px; } .cx10-node::after { display: none; } .cx10-node b { font-size: 15px; } .cx10-node:active { background: rgba(6,22,38,.96); }
        #cx10Tip { display: none; } #cx10Stage > svg { height: 150px; bottom: auto; }
    }
    @media (prefers-reduced-motion: reduce) { #cx10Core i { animation: none !important; } #cx10Stage { transition: none; } }
    `;
    document.head.appendChild(css);

    // ---- 1. smoothness helpers -------------------------------------------------
    function sleepOffscreen() {
        if (!('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('cx-off', !e.isIntersecting)), { rootMargin: '120px' });
        const scan = () => document.querySelectorAll('.glass-panel:not([data-io]), .cx-banner:not([data-io]), .cx-hud:not([data-io]), #cxFoot:not([data-io])').forEach(p => { p.dataset.io = '1'; io.observe(p); });
        scan(); setInterval(scan, 3000);
    }
    function scrollCalm() {
        let t = null, last = 0;
        addEventListener('scroll', () => { if (Math.abs(scrollY - last) < 6) return; last = scrollY; if (!document.body.classList.contains('cx-scrolling')) document.body.classList.add('cx-scrolling'); clearTimeout(t); t = setTimeout(() => document.body.classList.remove('cx-scrolling'), 420); }, { passive: true });
    }
    function navStrip() {                                    // keep the chosen tab in view in the swipeable strip on a phone
        if (innerWidth > 640) return; const a = document.querySelector('.nav-btn.active'); if (!a || !a.parentElement) return;
        const p = a.parentElement; if (p.scrollWidth <= p.clientWidth + 4) { p.style.overflowX = 'auto'; p.style.flexWrap = 'nowrap'; p.style.scrollSnapType = 'x proximity'; p.style.scrollbarWidth = 'none'; }
        try { p.scrollTo({ left: a.offsetLeft - 12, behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {}
    }
    const sw0 = window.switchMainView;
    window.switchMainView = function () { const r = sw0.apply(this, arguments); setTimeout(() => safe(navStrip), 80); return r; };

    // ---- 2. 3D reactor with live read-outs --------------------------------------
    function facts() {
        const td = todayStr(), now = new Date(), st = monthStats(), bal = balances();
        const spent = transactions.filter(t => t.type === 'expense' && new Date(t.timestamp).toDateString() === now.toDateString()).reduce((s, t) => s + (+t.amount || 0), 0);
        const pct = st.budget > 0 ? Math.round(st.spent / st.budget * 100) : 0;
        const tk = getJ('walletTasks', []).filter(t => !t.done), due = tk.filter(t => t.due === td).length, late = tk.filter(t => t.due && t.due < td).length;
        let hAll = 0, hDone = 0; try { hAll = customHabits.length; hDone = customHabits.filter(h => (habitHistory[td] || []).includes(h.id)).length; } catch (e) {}
        const pf = getJ('walletPortfolio', []), inv = pf.reduce((s, h) => s + (+h.current || +h.invested || 0), 0);
        const wl = wishlistItems.filter(w => !w.purchased), can = wl.filter(w => +w.price > 0 && +w.price <= bal.liquid).length;
        return [
            { s: 'L n0', c: '#00e5ff', k: 'Liquid assets', v: inr(bal.liquid), d: 'Emergency fund ' + inr(bal.ef || 0), tip: 'Cash, bank and UPI you can use now. Tap for the ledger.', go: () => { const e = $('ledgerList') || $('aiTerminal'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
            { s: 'L n1', c: '#fbbf24', k: 'Safe to spend today', v: inr(st.safe), d: (st.dim - st.day + 1) + ' days left this month', tip: 'Budget left, divided by the days left. Tap for the month forecast.', go: () => { try { getCASPERForecast(); } catch (e) {} const e = $('aiTerminal'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' }); } },
            { s: 'L n2', c: pct >= 90 ? '#f87171' : '#34d399', k: 'Spent today', v: inr(spent), d: pct + '% of the month’s budget used', tip: 'Today’s expenses and how much of the budget is gone. Tap for the spend map.', go: () => { const e = $('upgHeatmap'); if (e) e.closest('.glass-panel').scrollIntoView({ behavior: 'smooth', block: 'start' }); } },
            { s: 'R n0', c: late ? '#f87171' : '#c6f432', k: 'Planner', v: due + ' due today', d: late ? late + ' overdue' : tk.length + ' open in total', tip: 'Open tasks from the Planner. Tap to open it.', go: () => switchMainView('planner') },
            { s: 'R n1', c: '#f97316', k: 'Habits', v: hDone + ' / ' + hAll, d: hAll && hDone === hAll ? 'all done today' : 'ticked today', tip: 'Growth habits ticked today. Tap to open Growth.', go: () => switchMainView('growth') },
            { s: 'R n2', c: '#38bdf8', k: pf.length ? 'Invested' : 'Wishlist', v: pf.length ? inr(inv) : wl.length + ' item' + (wl.length === 1 ? '' : 's'), d: pf.length ? pf.length + ' holding' + (pf.length === 1 ? '' : 's') : can + ' affordable now', tip: pf.length ? 'Current value of your holdings. Tap for Investments.' : 'Open wishlist items. Tap to open the Wishlist.', go: () => switchMainView(pf.length ? 'investments' : 'wishlist') }
        ];
    }
    let F = [];
    function paintNodes() {
        const st = $('cx10Stage'); if (!st) return; F = facts();
        F.forEach((f, i) => {
            let n = st.querySelector('.cx10-node[data-i="' + i + '"]');
            if (!n) { n = document.createElement('button'); n.type = 'button'; n.dataset.i = i; n.innerHTML = '<span></span><b></b><small></small>'; st.appendChild(n); }
            const cls = 'cx10-node ' + f.s + (n.classList.contains('on') ? ' on' : ''); if (n.className !== cls) n.className = cls; n.style.setProperty('--c', f.c);
            const set = (q, t) => { const e = n.querySelector(q); if (e.textContent !== t) e.textContent = t; }; set('span', f.k); set('b', f.v); set('small', f.d); n.setAttribute('aria-label', f.k + ': ' + f.v + '. ' + f.tip);
        });
    }
    function build3D() {
        const hud = $('cx8Hud'); if (!hud || $('cx10Stage')) return; const svg = hud.querySelector('svg'); if (!svg) return;
        const st = document.createElement('div'); st.id = 'cx10Stage'; hud.insertBefore(st, svg); st.appendChild(svg); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('viewBox', '0 0 1000 300');
        st.insertAdjacentHTML('beforeend', `<div id="cx10Core" role="button" tabindex="0" aria-label="Arc reactor. Tap to spin it and refresh the figures."><i class="r1"></i><i class="r2"></i><i class="r3"></i><i class="r4"></i><i class="r5"></i><i class="tri"></i></div><div id="cx10Tip">Move to tilt • tap a read-out to open it</div>`);
        paintNodes();
        const tipEl = $('cx10Tip'), core = $('cx10Core'), base = tipEl.textContent;
        st.addEventListener('pointerover', e => { const n = e.target.closest('.cx10-node'); if (n && F[n.dataset.i]) tipEl.textContent = F[n.dataset.i].tip; });
        st.addEventListener('pointerout', e => { if (e.target.closest('.cx10-node')) tipEl.textContent = base; });
        st.addEventListener('focusin', e => { const n = e.target.closest('.cx10-node'); if (n && F[n.dataset.i]) tipEl.textContent = F[n.dataset.i].tip; });
        st.addEventListener('click', e => { const n = e.target.closest('.cx10-node'); if (n && F[n.dataset.i]) safe(() => F[n.dataset.i].go()); });
        const spin = () => { core.classList.remove('gyro'); void core.offsetWidth; core.classList.add('gyro'); paintNodes(); try { window.syncDataFromServer && localStorage.getItem('walletCloudLinked') && window.__cxPoke && window.__cxPoke(); } catch (e) {} };
        core.addEventListener('click', spin); core.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); spin(); } });
        if (!reduce && innerWidth > 760) {                              // tilt with the pointer on a laptop
            let raf = 0; hud.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const r = hud.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { st.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`; }); });
            hud.addEventListener('pointerleave', () => { st.style.transform = ''; });
        }
        if (!reduce && innerWidth <= 760 && window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {   // tilt the reactor with the phone
            let raf = 0; addEventListener('deviceorientation', e => { if (e.gamma == null || core.closest('.cx-off')) return; cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { const x = Math.max(-25, Math.min(25, e.gamma)), y = Math.max(-25, Math.min(25, (e.beta || 45) - 45)); core.style.transform = `translateZ(60px) rotateY(${(x * .9).toFixed(1)}deg) rotateX(${(-y * .9).toFixed(1)}deg)`; }); }, { passive: true });
        }
    }
    function liveBadge() {
        const hi = $('cxCmdLine'); if (!hi) return; let b = $('cx10Live'); if (!b) { hi.insertAdjacentHTML('afterend', '<span id="cx10Live" title="Live link to your server"><i></i><em style="font-style:normal"></em></span>'); b = $('cx10Live'); hi.style.display = 'inline-block'; }
        const dot = $('cxCloudDot'), on = !!dot && /52, 211, 153/.test(dot.style.background || ''), linked = !!localStorage.getItem('walletCloudLinked');
        b.classList.toggle('on', on); b.style.display = linked || on ? '' : 'none'; b.querySelector('em').textContent = on ? 'Live sync' : 'Offline, saved on this device';
    }
    const start = () => {
        safe(sleepOffscreen); safe(scrollCalm);
        setInterval(() => { safe(build3D); safe(liveBadge); }, 1500); setInterval(() => safe(paintNodes), 8000);
        ['storage', 'focus'].forEach(e => addEventListener(e, () => safe(paintNodes)));
        const ui = window.updateUI; if (typeof ui === 'function') window.updateUI = function () { const r = ui.apply(this, arguments); safe(paintNodes); return r; };
        setTimeout(() => safe(navStrip), 2500);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
    window.CX10 = { paintNodes, facts };
})();


/* ============================================================================
   WALLY MK 3 — ROUND 12 (appended; nothing above is changed)
   1 live weather in the header + activities that suit the conditions
   2 C.A.S.P.E.R. answers open questions through the server's AI key
   3 server uptime / keep-awake read-out in the Cloud panel
   ============================================================================ */
(function () {
    'use strict';
    if (!window.CX) return;
    const { $, esc, inr, getJ, icons, todayStr, toast, monthStats, balances } = window.CX;
    const safe = fn => { try { return fn(); } catch (e) { console.warn('v11', e); } };
    const LS = { get: (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

    const css = document.createElement('style');
    css.textContent = `
    #cx11Wx { display: flex; align-items: center; gap: 10px; margin: 0 auto; padding: 6px 14px; border-radius: 14px; border: 1px solid rgba(0,229,255,.28); background: rgba(0,229,255,.05); cursor: pointer; min-width: 0; max-width: 430px; transition: border-color .2s, background .2s; text-align: left; }
    #cx11Wx:hover { border-color: #00e5ff; background: rgba(0,229,255,.1); }
    #cx11Wx .ic { font-size: 26px; line-height: 1; flex: 0 0 auto; } #cx11Wx .t { font: 800 22px 'Oxanium', sans-serif; color: #fff; line-height: 1; flex: 0 0 auto; } #cx11Wx .t sup { font-size: 11px; color: #7dd3fc; }
    #cx11Wx .d { min-width: 0; } #cx11Wx .d b { display: block; font: 700 11.5px 'Oxanium', sans-serif; letter-spacing: .08em; text-transform: uppercase; color: #00e5ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } #cx11Wx .d span { display: block; font-size: 11px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #cx11Wx .tip { font: 600 11px 'Oxanium', sans-serif; color: #fbbf24; border-left: 1px solid rgba(255,255,255,.12); padding-left: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
    @media (max-width: 900px) { #cx11Wx .tip { display: none; } } @media (max-width: 640px) { #cx11Wx { order: 5; width: 100%; max-width: none; margin: 8px 0 0; } #cx11Wx .tip { display: block; flex: 1; text-align: right; border: 0; } }
    .cx11-now { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; } .cx11-now .big { font: 800 52px 'Oxanium', sans-serif; color: #fff; line-height: 1; } .cx11-now .ic { font-size: 54px; line-height: 1; }
    .cx11-hours { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 12px; } .cx11-hours div { flex: 0 0 58px; text-align: center; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 7px 2px; font: 600 11px 'Oxanium', sans-serif; color: #cbd5e1; } .cx11-hours b { display: block; font-size: 14px; color: #fff; } .cx11-hours i { display: block; font-style: normal; font-size: 18px; } .cx11-hours em { font-style: normal; color: #38bdf8; font-size: 10px; }
    .cx11-days { display: grid; grid-template-columns: repeat(auto-fit, minmax(92px, 1fr)); gap: 6px; margin-bottom: 14px; } .cx11-days div { border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 8px; text-align: center; font: 600 11px 'Oxanium', sans-serif; color: #94a3b8; } .cx11-days b { color: #fff; font-size: 13px; display: block; } .cx11-days i { font-style: normal; font-size: 20px; display: block; }
    .cx11-act { display: grid; gap: 7px; } .cx11-act > div { display: flex; gap: 10px; align-items: center; border: 1px solid rgba(255,255,255,.09); border-left: 3px solid var(--c, #00e5ff); border-radius: 12px; padding: 9px 11px; } .cx11-act i { font-style: normal; font-size: 22px; flex: 0 0 auto; } .cx11-act b { display: block; color: #fff; font-size: 13.5px; } .cx11-act span { font-size: 12px; color: #94a3b8; line-height: 1.4; } .cx11-act .flex-1 { min-width: 0; }
    .cx11-ai { white-space: normal; line-height: 1.55; } .cx11-ai code { background: rgba(0,0,0,.5); padding: 1px 5px; border-radius: 5px; font-size: 11px; color: #fbbf24; } .cx11-ai pre { background: rgba(0,0,0,.6); border: 1px solid rgba(0,229,255,.2); border-radius: 8px; padding: 8px; overflow-x: auto; margin: 6px 0; font-size: 11px; color: #e2e8f0; white-space: pre; } .cx11-ai ul { padding-left: 16px; list-style: disc; margin: 4px 0; } .cx11-ai b { color: #fff; }
    #cx11AiTag { font: 700 9px 'Oxanium', sans-serif; letter-spacing: .12em; text-transform: uppercase; display: block; margin-top: 2px; }
    #casperChatBody { -webkit-overflow-scrolling: touch; }
    @media (max-width: 640px) { #casperChatWindow { width: min(350px, calc(100vw - 24px)) !important; height: min(450px, calc(100vh - 190px)) !important; } }
    `;
    document.head.appendChild(css);
    function modal(id, title, body, w) {
        const old = $(id); if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', `<div class="cx-modal" id="${id}"><div style="width:min(${w || 640}px,100%)"><h3><span>${title}</span><button class="cx-btn red sm" onclick="document.getElementById('${id}').remove()">Close</button></h3>${body}</div></div>`);
        $(id).addEventListener('mousedown', e => { if (e.target.id === id) $(id).remove(); }); icons(); return $(id);
    }

    // ==========================================================================
    // 1. WEATHER (Open-Meteo: free, no key, model data refreshed hourly)
    // ==========================================================================
    const WMO = c => c === 0 ? ['Clear sky', '☀️', '🌙'] : c === 1 ? ['Mostly clear', '🌤️', '🌙'] : c === 2 ? ['Partly cloudy', '⛅', '☁️'] : c === 3 ? ['Overcast', '☁️', '☁️'] : c === 45 || c === 48 ? ['Fog', '🌫️', '🌫️'] : c >= 51 && c <= 57 ? ['Drizzle', '🌦️', '🌧️'] : c >= 61 && c <= 67 ? [c >= 65 ? 'Heavy rain' : 'Rain', '🌧️', '🌧️'] : c >= 71 && c <= 77 ? ['Snow', '🌨️', '🌨️'] : c >= 80 && c <= 82 ? [c === 82 ? 'Violent showers' : 'Rain showers', '🌦️', '🌧️'] : c === 85 || c === 86 ? ['Snow showers', '🌨️', '🌨️'] : c >= 95 ? ['Thunderstorm', '⛈️', '⛈️'] : ['Unknown', '🌡️', '🌡️'];
    const wxIcon = (c, day) => WMO(c)[day ? 1 : 2];
    let wx = LS.get('cxWx', null), wxBusy = false, wxErr = '';
    const loc = () => LS.get('cxWxLoc', null);
    async function getJSON(url, ms) { const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms || 12000); try { const r = await (window.__nativeFetch || fetch)(url, { signal: ctl.signal, cache: 'no-store' }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json(); } finally { clearTimeout(t); } }
    async function loadWx(force) {
        const l = loc(); if (!l || wxBusy) return; if (!force && wx && wx.lat === l.lat && Date.now() - wx.at < 10 * 60000) return paintWx();
        wxBusy = true; wxErr = '';
        try {
            const q = `latitude=${l.lat}&longitude=${l.lon}&timezone=auto`;
            const f = await getJSON(`https://api.open-meteo.com/v1/forecast?${q}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&forecast_days=5`);
            let aq = null; try { aq = await getJSON(`https://air-quality-api.open-meteo.com/v1/air-quality?${q}&current=us_aqi,pm2_5`, 8000); } catch (e) {}
            const c = f.current, h = f.hourly, now = c.time.slice(0, 13); let i0 = h.time.findIndex(t => t.slice(0, 13) === now); if (i0 < 0) i0 = 0;
            wx = { at: Date.now(), lat: l.lat, name: l.name, obs: c.time, temp: c.temperature_2m, feels: c.apparent_temperature, hum: c.relative_humidity_2m, rain: c.precipitation, code: c.weather_code, day: !!c.is_day, cloud: c.cloud_cover, wind: c.wind_speed_10m, gust: c.wind_gusts_10m, uv: h.uv_index[i0],
                hours: h.time.slice(i0, i0 + 12).map((t, k) => ({ t: t.slice(11, 16), temp: h.temperature_2m[i0 + k], pop: h.precipitation_probability[i0 + k], code: h.weather_code[i0 + k], day: !!h.is_day[i0 + k] })),
                days: f.daily.time.map((t, k) => ({ d: t, code: f.daily.weather_code[k], hi: f.daily.temperature_2m_max[k], lo: f.daily.temperature_2m_min[k], pop: f.daily.precipitation_probability_max[k], rise: f.daily.sunrise[k].slice(11, 16), set: f.daily.sunset[k].slice(11, 16), uv: f.daily.uv_index_max[k] })),
                aqi: aq && aq.current ? aq.current.us_aqi : null, pm: aq && aq.current ? aq.current.pm2_5 : null };
            wx.pop3 = Math.max(0, ...wx.hours.slice(0, 3).map(x => x.pop || 0)); LS.set('cxWx', wx);
        } catch (e) { wxErr = navigator.onLine ? 'Weather service did not answer.' : 'No connection.'; }
        finally { wxBusy = false; paintWx(); if ($('cx11WxM')) openWx(); }
    }
    const aqiTxt = a => a == null ? '' : a <= 50 ? 'Good' : a <= 100 ? 'Moderate' : a <= 150 ? 'Unhealthy for sensitive groups' : a <= 200 ? 'Unhealthy' : a <= 300 ? 'Very unhealthy' : 'Hazardous';
    const uvTxt = u => u == null ? '' : u < 3 ? 'Low' : u < 6 ? 'Moderate' : u < 8 ? 'High' : u < 11 ? 'Very high' : 'Extreme';
    function activities() {
        if (!wx) return []; const A = [], hr = new Date().getHours(), wet = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wx.code) || wx.rain > 0.1, storm = wx.code >= 95, fog = wx.code === 45 || wx.code === 48, hot = wx.feels >= 35, warm = wx.feels >= 30, cold = wx.feels <= 14, nice = !wet && !storm && wx.feels >= 16 && wx.feels < 31, soon = wx.pop3 >= 50 && !wet, badAir = wx.aqi != null && wx.aqi > 150, dusk = hr >= 17 && hr < 20, dawn = hr >= 5 && hr < 9, night = hr >= 21 || hr < 5, windy = wx.wind >= 30;
        const fit = () => window.open('fitness/index.html', '_blank'), add = (t, i, n, w, go, lbl, c) => A.push({ i, n, w, go, lbl, c });
        let reading = null; try { reading = mediaItems.find(m => m.mediaStatus === 'In Progress'); } catch (e) {}
        const tasks = getJ('walletTasks', []).filter(t => !t.done && (!t.due || t.due <= todayStr()));
        if (storm) add(0, '⛈️', 'Stay in until the storm passes', 'Thunderstorm in your area. Unplug what you can and keep the phone charged.', null, '', '#f87171');
        if (wet || storm) { add(0, '🏋️', 'Indoor workout', 'It is raining, so do today’s LEVEL//UP quest indoors: bodyweight circuit or mobility.', fit, 'Open Fitness', '#f97316'); add(0, '📚', reading ? 'Continue “' + String(reading.title).slice(0, 34) + '”' : 'Read or watch something from the Library', 'Good weather for staying in.', () => switchMainView('media'), 'Library', '#a855f7'); add(0, '☕', 'Deep-work block', 'Rain keeps distractions down. Start a focus timer.', () => switchMainView('growth'), 'Growth', '#34d399'); }
        if (soon) add(0, '☔', 'Carry an umbrella', wx.pop3 + '% chance of rain in the next three hours. Finish outdoor errands early.', null, '', '#38bdf8');
        if (!wet && !storm) {
            if (hot && hr >= 11 && hr < 16) add(0, '🥵', 'Avoid the midday sun', 'Feels like ' + Math.round(wx.feels) + '°. Train indoors now and move outdoor plans to after 5 pm.', fit, 'Open Fitness', '#f87171');
            if (nice && (dawn || dusk) && !badAir) add(0, '🏃', dawn ? 'Morning run or brisk walk' : 'Evening run or walk', 'Comfortable ' + Math.round(wx.feels) + '° and dry. The best window of the day to be outside.', fit, 'Open Fitness', '#34d399');
            else if (nice && !night && !badAir) add(0, '🚶', 'Walk or cycle for short trips', 'Dry and ' + Math.round(wx.feels) + '°. Good for errands on foot and it saves fuel money.', null, '', '#34d399');
            if (nice && !night && tasks.length) add(0, '🧾', 'Clear outdoor errands', tasks.length + ' open task' + (tasks.length > 1 ? 's' : '') + ' in the Planner. The weather will not get in the way.', () => switchMainView('planner'), 'Planner', '#c6f432');
            if (wx.day && wx.cloud < 40 && !hot && hr >= 8 && hr < 15) add(0, '🧺', 'Good drying weather', 'Clear and dry: laundry, airing bedding, washing the vehicle.', null, '', '#fbbf24');
            if (warm && !night) add(0, '💧', 'Drink more water', 'Warm at ' + Math.round(wx.feels) + '°. Keep a bottle with you.', () => window.CX8 && CX8.remPreset && (CX8.remPreset('Drink water', String(Math.min(22, hr + 1)).padStart(2, '0') + ':00', 'daily'), toast('Water reminder set.')), 'Remind me', '#38bdf8');
            if (night && wx.cloud < 30) add(0, '🌌', 'Clear night sky', 'Low cloud. A short walk or some stargazing before bed.', null, '', '#818cf8');
        }
        if (wx.uv >= 6 && wx.day) add(0, '🧴', 'Sun protection', 'UV index ' + Math.round(wx.uv) + ' (' + uvTxt(wx.uv).toLowerCase() + '). Sunscreen, cap and sunglasses if you go out.', null, '', '#fbbf24');
        if (badAir) add(0, '😷', 'Limit outdoor exertion', 'Air quality index ' + Math.round(wx.aqi) + ' (' + aqiTxt(wx.aqi).toLowerCase() + '). Train indoors and wear a mask outside.', fit, 'Open Fitness', '#f87171');
        if (cold) add(0, '🧥', 'Layer up', 'Feels like ' + Math.round(wx.feels) + '°. Warm up longer before training.', null, '', '#7dd3fc');
        if (fog) add(0, '🌫️', 'Low visibility', 'Fog: ride or drive slowly with lights on, or wait it out.', null, '', '#94a3b8');
        if (windy) add(0, '💨', 'Strong wind', Math.round(wx.wind) + ' km/h wind. Skip cycling and secure anything loose outside.', null, '', '#94a3b8');
        if (night && !A.length) add(0, '🛌', 'Wind down', 'Plan tomorrow in the Planner and log your mood.', () => switchMainView('planner'), 'Planner', '#c6f432');
        if (!A.length) add(0, '🙂', 'Nothing special needed', 'Ordinary conditions. Carry on with the day’s plan.', () => switchMainView('planner'), 'Planner', '#00e5ff');
        return A.slice(0, 7);
    }
    function paintWx() {
        const hdr = document.querySelector('header'); if (!hdr) return; let el = $('cx11Wx');
        if (!el) { const btns = hdr.querySelector('.cx-hbtns'); if (!btns) return; btns.insertAdjacentHTML('beforebegin', `<button type="button" id="cx11Wx" onclick="CX11.weather()" aria-label="Weather"></button>`); el = $('cx11Wx'); }
        const l = loc(); let h;
        if (!l) h = `<span class="ic">📍</span><span class="d"><b>Add live weather</b><span>Tap to set your location</span></span>`;
        else if (!wx || wx.lat !== l.lat) h = `<span class="ic">🌡️</span><span class="d"><b>${esc(l.name)}</b><span>${wxErr || 'Fetching weather…'}</span></span>`;
        else { const a = activities()[0]; h = `<span class="ic">${wxIcon(wx.code, wx.day)}</span><span class="t">${Math.round(wx.temp)}<sup>°C</sup></span><span class="d"><b>${WMO(wx.code)[0]}</b><span>${esc(wx.name)} • feels ${Math.round(wx.feels)}°${wx.pop3 >= 30 ? ' • rain ' + wx.pop3 + '%' : ''}</span></span>${a ? `<span class="tip">${a.i} ${esc(a.n)}</span>` : ''}`; }
        if (el.innerHTML !== h) el.innerHTML = h;
    }
    let acts = [];
    function openWx() {
        const l = loc(); acts = activities();
        const locUI = `<p class="cx-lbl" style="margin-top:14px">Location</p><div class="flex flex-wrap gap-2"><button class="cx-btn green sm" onclick="CX11.locate()">Use my location</button><input id="cx11City" class="cx-in" style="flex:1;min-width:150px" placeholder="or type a city, e.g. Sivakasi" onkeydown="if(event.key==='Enter')CX11.city()"><button class="cx-btn sm" onclick="CX11.city()">Search</button></div><div id="cx11Hits" style="margin-top:8px"></div>`;
        if (!l) return modal('cx11WxM', 'Live weather', `<p style="font-size:13px;color:#cbd5e1;line-height:1.6">Set a location once. Your coordinates are sent only to the weather service (Open-Meteo) to fetch the forecast, and are stored on this device.</p>${locUI}`);
        if (!wx || wx.lat !== l.lat) return modal('cx11WxM', esc(l.name), `<div class="cx-empty">${wxErr || 'Fetching weather…'}</div><button class="cx-btn sm" style="margin-top:10px" onclick="CX11.refresh()">Try again</button>${locUI}`);
        const d0 = wx.days[0] || {}, age = Math.max(0, Math.round((Date.now() - wx.at) / 60000));
        modal('cx11WxM', esc(wx.name), `<div class="cx11-now"><span class="ic">${wxIcon(wx.code, wx.day)}</span><span class="big">${Math.round(wx.temp)}°</span><span><b class="text-white" style="font-size:16px">${WMO(wx.code)[0]}</b><br><span style="font-size:12.5px;color:#94a3b8">Feels like ${Math.round(wx.feels)}° • High ${Math.round(d0.hi)}° / Low ${Math.round(d0.lo)}°</span></span></div>
            <div class="cx8-kpis"><div><span>Humidity</span><b>${Math.round(wx.hum)}%</b></div><div><span>Wind</span><b>${Math.round(wx.wind)} km/h</b></div><div><span>Rain, next 3 h</span><b>${wx.pop3}%</b></div><div><span>UV index</span><b>${wx.uv == null ? '—' : Math.round(wx.uv) + ' ' + uvTxt(wx.uv)}</b></div>${wx.aqi != null ? `<div><span>Air quality</span><b>${Math.round(wx.aqi)} ${aqiTxt(wx.aqi)}</b></div>` : ''}<div><span>Sunrise / sunset</span><b>${d0.rise || '—'} / ${d0.set || '—'}</b></div></div>
            <p class="cx-lbl">Suggested for these conditions</p><div class="cx11-act">${acts.map((a, i) => `<div style="--c:${a.c}"><i>${a.i}</i><span class="flex-1"><b>${esc(a.n)}</b><span>${esc(a.w)}</span></span>${a.go ? `<button class="cx-btn sm" onclick="CX11.act(${i})">${a.lbl}</button>` : ''}</div>`).join('')}</div>
            <p class="cx-lbl" style="margin-top:14px">Next 12 hours</p><div class="cx11-hours">${wx.hours.map(h => `<div>${h.t}<i>${wxIcon(h.code, h.day)}</i><b>${Math.round(h.temp)}°</b><em>${h.pop == null ? '' : h.pop + '%'}</em></div>`).join('')}</div>
            <p class="cx-lbl">5 days</p><div class="cx11-days">${wx.days.map((d, i) => `<div>${i === 0 ? 'Today' : new Date(d.d + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}<i>${wxIcon(d.code, true)}</i><b>${Math.round(d.hi)}° / ${Math.round(d.lo)}°</b>rain ${d.pop == null ? '—' : d.pop + '%'}</div>`).join('')}</div>
            <p style="font-size:11.5px;color:#64748b">Source: Open-Meteo forecast model for your coordinates, reading for ${wx.obs.slice(11, 16)}, fetched ${age ? age + ' min ago' : 'just now'}. It refreshes every 10 minutes. A model reading can differ by a degree or two from a thermometer on your street. <a href="#" style="color:#00e5ff" onclick="event.preventDefault();CX11.refresh()">Refresh now</a></p>${locUI}`, 680);
    }
    async function setLoc(lat, lon, name) { LS.set('cxWxLoc', { lat: +(+lat).toFixed(3), lon: +(+lon).toFixed(3), name }); wx = null; paintWx(); if ($('cx11WxM')) openWx(); await loadWx(true); }
    window.CX11 = {
        weather: openWx, refresh: () => { toast('Refreshing weather…'); loadWx(true); }, act: i => { const a = acts[i]; if (a && a.go) { const m = $('cx11WxM'); if (m) m.remove(); safe(a.go); } },
        locate() {
            if (!navigator.geolocation) return toast('This browser cannot share a location. Type a city instead.', true); toast('Asking the browser for your location…');
            navigator.geolocation.getCurrentPosition(async p => { const la = p.coords.latitude, lo = p.coords.longitude; let name = 'My location'; try { const g = await getJSON(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${la}&longitude=${lo}&localityLanguage=en`, 7000); name = g.city || g.locality || g.principalSubdivision || name; } catch (e) {} setLoc(la, lo, name); },
                e => toast(e.code === 1 ? 'Location permission was declined. Type a city instead.' : 'Could not get a location fix. Type a city instead.', true), { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
        },
        async city() {
            const q = ($('cx11City') || {}).value || ''; if (q.trim().length < 2) return; const box = $('cx11Hits'); box.innerHTML = '<div class="cx-empty">Searching…</div>';
            try { const g = await getJSON('https://geocoding-api.open-meteo.com/v1/search?count=6&language=en&name=' + encodeURIComponent(q.trim())); const r = g.results || []; CX11._hits = r;
                box.innerHTML = r.length ? r.map((x, i) => `<button class="cx-btn sm" style="margin:0 6px 6px 0" onclick="CX11.pick(${i})">${esc(x.name)}${x.admin1 ? ', ' + esc(x.admin1) : ''}${x.country_code ? ' (' + esc(x.country_code) + ')' : ''}</button>`).join('') : '<div class="cx-empty">No place by that name. Try the nearest town.</div>'; }
            catch (e) { box.innerHTML = '<div class="cx-empty">The place search did not answer. Check the connection.</div>'; }
        },
        pick(i) { const x = (CX11._hits || [])[i]; if (x) setLoc(x.latitude, x.longitude, x.name); },
        passForm() {
            modal('cx11Pass', 'Change the sign-in password', `<p style="font-size:13px;color:#cbd5e1;line-height:1.6;margin-bottom:10px">This is the password asked for on the sign-in page. Changing it signs out every other device; this one stays signed in. Bookmarks and SMS forwarding are not affected, they use the machine key.</p>
                <label class="cx-lbl">Current password</label><input id="cx11P0" type="password" class="cx-in w-full" autocomplete="current-password">
                <label class="cx-lbl" style="margin-top:10px">New password (8 characters or more)</label><input id="cx11P1" type="password" class="cx-in w-full" autocomplete="new-password">
                <label class="cx-lbl" style="margin-top:10px">New password again</label><input id="cx11P2" type="password" class="cx-in w-full" autocomplete="new-password" onkeydown="if(event.key==='Enter')CX11.passSave()">
                <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-size:12.5px;color:#94a3b8;cursor:pointer"><input type="checkbox" class="form-check" onchange="['cx11P0','cx11P1','cx11P2'].forEach(i=>document.getElementById(i).type=this.checked?'text':'password')"> Show what I type</label>
                <div id="cx11PMsg" style="min-height:20px;margin-top:10px;font-size:13px;color:#f87171"></div><button class="cx-btn green" onclick="CX11.passSave()">Save new password</button>
                <p style="font-size:11.5px;color:#64748b;margin-top:12px">Forgot it later? In Render add SITE_PASSWORD_RESET = 1, and the SITE_PASSWORD from the settings works again.</p>`, 460);
            setTimeout(() => { const e = $('cx11P0'); if (e) e.focus(); }, 80);
        },
        async passSave() {
            const a = $('cx11P0').value, b = $('cx11P1').value, c = $('cx11P2').value, msg = $('cx11PMsg'); msg.style.color = '#f87171';
            if (!a) return msg.textContent = 'Type the current password.'; if (b.length < 8) return msg.textContent = 'The new password needs at least 8 characters.'; if (b !== c) return msg.textContent = 'The two new passwords do not match.'; if (a === b) return msg.textContent = 'That is the same as the current one.';
            msg.style.color = '#94a3b8'; msg.textContent = 'Saving…';
            try { const r = await fetch(API_BASE + '/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: a, next: b }) }), j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || (r.status === 404 ? 'The server runs an older file. Upload the new server.js.' : 'HTTP ' + r.status)); const m = $('cx11Pass'); if (m) m.remove(); toast('Password changed, sir. Other devices will be asked to sign in again.'); }
            catch (e) { msg.style.color = '#f87171'; msg.textContent = String(e.message || e); }
        },
        async signOut() { try { await fetch(API_BASE + '/logout', { method: 'POST' }); } catch (e) {} try { localStorage.removeItem('walletCloudKey'); } catch (e) {} location.reload(); },
        get wx() { return wx; }, activities
    };

    // ==========================================================================
    // 2. C.A.S.P.E.R. AI (through /api/chat on your server)
    // ==========================================================================
    const ai = { provider: false, checked: 0, hist: [] };
    async function probe() { try { const r = await (window.__nativeFetch || fetch)(API_BASE + '/health', { cache: 'no-store' }); if (!r.ok) throw 0; const j = await r.json(); ai.provider = j.ai || false; ai.health = j; } catch (e) { ai.provider = false; ai.health = null; } ai.checked = Date.now(); paintAi(); }
    function paintAi() {
        const w = $('casperChatWindow'); if (!w) return; const h3 = w.querySelector('h3'); if (!h3) return; let tag = $('cx11AiTag');
        if (!tag) { h3.insertAdjacentHTML('beforeend', '<span id="cx11AiTag"></span>'); tag = $('cx11AiTag'); }
        const on = !!ai.provider; tag.textContent = on ? 'AI online • ask me anything' : ai.health ? 'Built-in brain • no AI key on the server' : 'Built-in brain • server not reachable';
        tag.style.color = on ? '#34d399' : '#fbbf24';
        const dot = w.querySelector('.relative > span.absolute'); if (dot) { dot.style.background = on ? '#34d399' : '#fbbf24'; dot.style.boxShadow = '0 0 6px ' + (on ? '#34d399' : '#fbbf24'); }
        const inp = $('casperInput'); if (inp) inp.placeholder = on ? 'Ask anything, sir…' : 'Ask about your money, or type help';
    }
    function snapshot() {
        const o = { today: new Date().toString().slice(0, 21) };
        safe(() => { const st = monthStats(), b = balances(); o.money = { liquid: Math.round(b.liquid), emergencyFund: Math.round(b.ef || 0), monthIncome: Math.round(st.income), monthSpent: Math.round(st.spent), monthBudget: Math.round(st.budget), budgetLeft: Math.round(st.left), safeToSpendPerDay: Math.round(st.safe), projectedMonthSpend: Math.round(st.proj) }; });
        safe(() => { const k = new Date().toISOString().slice(0, 7), by = {}; transactions.forEach(t => { if (t.type === 'expense' && new Date(t.timestamp).toLocaleDateString('en-CA').slice(0, 7) === k) by[t.category] = (by[t.category] || 0) + t.amount; }); o.spendByCategoryThisMonth = Object.fromEntries(Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => [e[0], Math.round(e[1])])); });
        safe(() => { o.lastEntries = transactions.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 12).map(t => ({ date: new Date(t.timestamp).toLocaleDateString('en-CA'), type: t.type, amount: t.amount, category: t.category, note: String(t.note || '').slice(0, 40) })); });
        safe(() => { o.wishlist = wishlistItems.filter(w => !w.purchased).slice(0, 8).map(w => ({ item: String(w.title).slice(0, 50), price: w.price })); });
        safe(() => { const td = todayStr(); o.tasksOpen = getJ('walletTasks', []).filter(t => !t.done).slice(0, 10).map(t => ({ task: t.text, due: t.due || '' })); o.habits = customHabits.map(h => ({ habit: h.text, doneToday: (habitHistory[td] || []).includes(h.id) })); });
        safe(() => { o.portfolio = getJ('walletPortfolio', []).slice(0, 10).map(h => ({ name: h.name, type: h.type, invested: h.invested, valueNow: h.current })); });
        safe(() => { if (wx) o.weather = { place: wx.name, tempC: wx.temp, feelsLikeC: wx.feels, condition: WMO(wx.code)[0], rainChanceNext3hPct: wx.pop3 }; });
        return o;
    }
    const md = t => { let h = esc(t); h = h.replace(/```[a-z]*\n?([\s\S]*?)```/g, (m, c) => '<pre>' + c.trim() + '</pre>'); h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g, '<b>$1</b>').replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>'); h = h.replace(/(?:^|\n)((?:[-*•] .+(?:\n|$))+)/g, (m, l) => '<ul>' + l.trim().split('\n').map(x => '<li>' + x.replace(/^[-*•] /, '') + '</li>').join('') + '</ul>'); return h.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>').replace(/<\/(ul|pre)><br>/g, '</$1>'); };
    window.CXAI = {
        ready: () => !!ai.provider,
        async ask(msg) {
            const input = $('casperInput'), body = $('casperChatBody'); if (!body) return;
            body.insertAdjacentHTML('beforeend', `<div class="bg-black/60 border border-[#00e5ff]/40 p-3 rounded-xl rounded-tr-none w-10/12 ml-auto text-white shadow-[0_0_10px_rgba(0,229,255,0.2)]">${esc(msg)}</div>`);
            if (input) input.value = ''; const id = 'cxa_' + Date.now();
            body.insertAdjacentHTML('beforeend', `<div id="${id}" class="bg-[#00e5ff]/10 border border-[#00e5ff]/30 p-3 rounded-xl rounded-tl-none w-11/12 text-[#00e5ff] cx11-ai">Thinking…</div>`); body.scrollTop = body.scrollHeight;
            ai.hist.push({ role: 'user', content: msg }); ai.hist = ai.hist.slice(-12); let out = '', ok = false;
            try {
                const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 60000);
                const r = await fetch(API_BASE + '/chat', { method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: ai.hist, context: snapshot() }) }); clearTimeout(t);
                const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); out = j.reply; ok = true;
            } catch (e) { out = 'I could not reach the AI service, sir (' + String(e.message || e).slice(0, 140) + '). My built-in commands still work: type help.'; ai.hist.pop(); }
            if (ok) ai.hist.push({ role: 'assistant', content: out });
            const el = $(id); if (el) el.innerHTML = ok ? md(out) : esc(out); body.scrollTop = body.scrollHeight;
        }
    };

    // ==========================================================================
    // 3. SERVER UPTIME IN THE CLOUD PANEL
    // ==========================================================================
    const dur = s => s < 90 ? s + ' s' : s < 5400 ? Math.round(s / 60) + ' min' : s < 172800 ? (s / 3600).toFixed(1) + ' h' : Math.round(s / 86400) + ' days';
    async function cloudInfo() {
        const m = $('cxSysModal'); if (!m || $('cx11Up')) return; const on = m.querySelector('.cx-btn.on'); if (!on || on.textContent.trim() !== 'Cloud') return;
        const host = m.firstElementChild; host.insertAdjacentHTML('beforeend', '<div id="cx11Up" class="cx-row" style="margin-top:10px;font-size:12.5px;color:#cbd5e1;display:block;line-height:1.7">Checking the server…</div>');
        await probe(); const el = $('cx11Up'); if (!el) return; const h = ai.health;
        el.innerHTML = !h ? 'The server did not answer just now.' : `<b class="text-white">Server awake for ${dur(h.up || 0)}</b> without a restart.<br>Keep-awake: ${h.awake ? `<b style="color:#34d399">on</b>, ${h.awake.pings} self-visit${h.awake.pings === 1 ? '' : 's'} so far${h.awake.last ? ', last ' + dur(Math.round((Date.now() - h.awake.last) / 1000)) + ' ago' + (h.awake.ok === false ? ' <b style="color:#f87171">(failed)</b>' : '') : ' (first one is due 10 minutes after start)'}` : h.up === undefined ? 'this server runs an older file, upload the new server.js' : '<b style="color:#fbbf24">off</b> (no public address known to the server)'}.<br>Storage: ${esc(h.store || '')} • AI chat: ${h.ai ? '<b style="color:#34d399">' + esc(h.ai) + '</b>' : 'no key set'}.<br>Password gate: ${h.gate ? '<b style="color:#34d399">on</b> <button class="cx-btn sm" style="margin-left:8px" onclick="CX11.passForm()">Change password</button><button class="cx-btn red sm" style="margin-left:8px" onclick="CX11.signOut()">Sign out of this device</button>' : h.gate === false ? '<b style="color:#fbbf24">off</b>' : 'needs the new server.js'}.<br><span style="color:#94a3b8">If “awake for” keeps growing past a few hours with no one using the app, the server is not being put to sleep.</span>`;
    }

    const start = () => {
        setTimeout(() => { safe(paintWx); loadWx(false); probe(); }, 2200);
        setInterval(() => { safe(paintWx); safe(paintAi); if (!document.hidden) loadWx(false); if (Date.now() - ai.checked > 120000 && !document.hidden) probe(); }, 30000);
        addEventListener('focus', () => { loadWx(false); if (Date.now() - ai.checked > 30000) probe(); });
        new MutationObserver(() => safe(cloudInfo)).observe(document.body, { childList: true });
        const tg = window.toggleCasper; if (typeof tg === 'function') window.toggleCasper = function () { const r = tg.apply(this, arguments); safe(paintAi); if (Date.now() - ai.checked > 20000) probe(); return r; };
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
