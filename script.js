const fromCurrencyElem = document.getElementById('fromCurrency');
const toCurrencyElem = document.getElementById('toCurrency');
const amount = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const result = document.getElementById('result');
const rateDate = document.getElementById('rateDate');
const loader = document.getElementById('loader');
const reverseBtn = document.getElementById('reverseBtn');

// Variables to hold TomSelect instances
let fromSelect, toSelect;

// IMPORTANT: Replace this with your API key in production
const API_KEY = 'YOUR_API_KEY'; 

// Common currencies with country codes for flags
const commonCurrencies = {
  USD: { code: 'us', name: 'US Dollar' },
  EUR: { code: 'eu', name: 'Euro' },
  GBP: { code: 'gb', name: 'British Pound' },
  JPY: { code: 'jp', name: 'Japanese Yen' },
  CAD: { code: 'ca', name: 'Canadian Dollar' },
  AUD: { code: 'au', name: 'Australian Dollar' },
  CHF: { code: 'ch', name: 'Swiss Franc' },
  CNY: { code: 'cn', name: 'Chinese Yuan' },
  INR: { code: 'in', name: 'Indian Rupee' },
  BRL: { code: 'br', name: 'Brazilian Real' },
  MXN: { code: 'mx', name: 'Mexican Peso' },
  SGD: { code: 'sg', name: 'Singapore Dollar' },
  NZD: { code: 'nz', name: 'New Zealand Dollar' },
  HKD: { code: 'hk', name: 'Hong Kong Dollar' },
  SEK: { code: 'se', name: 'Swedish Krona' },
  KRW: { code: 'kr', name: 'South Korean Won' },
  ZAR: { code: 'za', name: 'South African Rand' },
  RUB: { code: 'ru', name: 'Russian Ruble' },
  TRY: { code: 'tr', name: 'Turkish Lira' }
};

// Use a fixed list of currencies instead of fetching from potentially unstable API
function loadCurrencies() {
  try {
    loader.style.display = 'block';
    
    // Use our predefined list instead of API call
    for (let currencyCode in commonCurrencies) {
      const currency = commonCurrencies[currencyCode];
      const countryCode = currency.code;
      
      const option = document.createElement('option');
      option.value = currencyCode;
      option.textContent = `${currencyCode} - ${currency.name}`;
      option.dataset.flag = countryCode;
      
      fromCurrencyElem.appendChild(option.cloneNode(true));
      toCurrencyElem.appendChild(option);
    }
    
    // Set default values before initializing TomSelect
    fromCurrencyElem.value = 'USD';
    toCurrencyElem.value = 'EUR';
    
    // Initialize TomSelect and store instances
    fromSelect = setupTomSelect('#fromCurrency');
    toSelect = setupTomSelect('#toCurrency');
    
    // Set date input to today's date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    rateDate.value = `${yyyy}-${mm}-${dd}`;
    
  } catch (error) {
    console.error('Error loading currencies:', error);
    result.innerText = 'Error initializing currency converter.';
  } finally {
    loader.style.display = 'none';
  }
}

function renderOptionWithFlag(data, escape) {
  const countryCode = data.customProperties?.country;
  const flagUrl = countryCode
    ? `https://flagcdn.com/w40/${countryCode}.png`
    : '';
  const flagImg = flagUrl
    ? `<img src="${flagUrl}" width="20" height="15" style="margin-right:8px; vertical-align:middle;" />`
    : '';
  return `<div>${flagImg}${escape(data.text)}</div>`;
}

function setupTomSelect(id) {
  const select = new TomSelect(id, {
    maxOptions: 1000,
    placeholder: "Select a currency",
    render: {
      option: renderOptionWithFlag,
      item: renderOptionWithFlag,
    },
    onInitialize: function() {
      const options = {};
      Array.from(this.input.options).forEach(option => {
        options[option.value] = {
          value: option.value,
          text: option.text,
          customProperties: {
            country: option.dataset.flag,
          },
        };
      });
      this.options = options;
    },
  });
  
  return select;
}

async function convert() {
  const base = fromSelect.getValue();
  const target = toSelect.getValue();
  const amountVal = parseFloat(amount.value);
  const dateVal = rateDate.value;
  
  if (!amountVal || amountVal <= 0) {
    result.innerText = 'Please enter a valid amount.';
    return;
  }
  
  result.innerText = '';
  loader.style.display = 'block';
  
  try {
    if (API_KEY === 'YOUR_API_KEY') {
      // Fallback to simulated conversion if no API key is provided
      useSimulatedConversion(base, target, amountVal);
      return;
    }
    
    // Using the real API with your API key
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${base}/${target}/${amountVal}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result === 'error') {
      throw new Error(data.error || 'API returned an error');
    }
    
    // Format the result to 2 decimal places
    const converted = data.conversion_result.toFixed(2);
    const rate = data.conversion_rate.toFixed(4);
    
    result.innerText = `${amountVal} ${base} = ${converted} ${target}`;
    result.innerHTML += `<div style="font-size: 0.8rem; margin-top: 8px; opacity: 0.8;">Rate: 1 ${base} = ${rate} ${target}</div>`;
    
  } catch (err) {
    console.error('Conversion error:', err);
    
    // Fallback to simulated conversion if API fails
    useSimulatedConversion(base, target, amountVal);
  } finally {
    loader.style.display = 'none';
  }
}

function useSimulatedConversion(base, target, amountVal) {
  // Simulated conversion with some realistic rates
  const simulatedRates = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 150.25, CAD: 1.36, AUD: 1.52 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 163.34, CAD: 1.48, AUD: 1.65 },
    GBP: { USD: 1.27, EUR: 1.17, JPY: 190.23, CAD: 1.73, AUD: 1.92 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0053, CAD: 0.0091, AUD: 0.0102 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110.22, AUD: 1.12 },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 98.42, CAD: 0.89 }
  };
  
  // Fallback for any pair not in our simulated rates
  let rate = 1.0;
  
  // Get rate from our simulated data
  if (simulatedRates[base] && simulatedRates[base][target]) {
    rate = simulatedRates[base][target];
  } else if (base === target) {
    rate = 1.0;
  } else {
    // Generate a somewhat realistic rate for pairs we don't have
    rate = (Math.random() * 2 + 0.5).toFixed(4);
  }
  
  const converted = (amountVal * rate).toFixed(2);
  
  result.innerText = `${amountVal} ${base} = ${converted} ${target}`;
  result.innerHTML += `<div style="font-size: 0.8rem; margin-top: 8px; opacity: 0.8;">Rate: 1 ${base} = ${rate} ${target}</div>`;
  result.innerHTML += `<div style="font-size: 0.75rem; margin-top: 8px; color: #e11d48;">
    Demo mode: Using simulated rates. Add your API key for real-time rates.
  </div>`;
}

// Reverse button functionality
reverseBtn.addEventListener('click', () => {
  if (fromSelect && toSelect) {
    const from = fromSelect.getValue();
    const to = toSelect.getValue();
    
    fromSelect.setValue(to);
    toSelect.setValue(from);
    
    // If there's an amount, convert immediately
    if (amount.value && parseFloat(amount.value) > 0) {
      convert();
    }
  }
});

// Add event listener to convert button
convertBtn.addEventListener('click', convert);

// Add enter key support to amount input
amount.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    convert();
  }
});

// Load currencies on page load
window.addEventListener('DOMContentLoaded', loadCurrencies);