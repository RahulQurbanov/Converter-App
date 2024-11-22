let exchangeRates = {};
let fromInput = document.querySelector('.main-left .change-area input');
let toInput = document.querySelector('.main-right .change-area input');
let fromCurrency = "RUB";
let toCurrency = "USD";
let activeInput = "from";
let internetAlert = document.querySelector(".innerAlert");
let isOnline = navigator.onLine;

async function getExchangeRates() {
    if (!isOnline) {
        internetAlert.style.display = 'block';
        return;
    }

    try {
        let response = await fetch('https://v6.exchangerate-api.com/v6/be6fd1bf862693f3cc3cb840/latest/USD');
        let json = await response.json();
        exchangeRates = json.conversion_rates;

        internetAlert.style.display = 'none';
        displayConversionRates();
        updateActiveCurrencyStyle();
    } catch {
        alert('Məlumatları gətirərkən xəta baş verdi!');
    }
}
getExchangeRates();

function calculateConversion() {
    if (!isOnline && fromCurrency !== toCurrency) {
        internetAlert.style.display = 'block';
        return;
    }

    internetAlert.style.display = 'none';
    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;
    let fromValue = parseFloat(fromInput.value) || 0;
    let toValue = parseFloat(toInput.value) || 0;

    if (activeInput === 'from') {
        toInput.value = (fromCurrency === toCurrency) 
            ? fromValue.toFixed(5) 
            : (fromValue * (toRate / fromRate)).toFixed(5);
    } else if (activeInput === 'to') {
        fromInput.value = (fromCurrency === toCurrency) 
            ? toValue.toFixed(5) 
            : (toValue * (fromRate / toRate)).toFixed(5);
    }

    displayConversionRates();
}

function validateInput(input) {
    input.value = input.value.replace(/[^0-9.,]/g, '').replace(",", ".");
    input.value = input.value.replace(/^0+(?!\.|$)/, '');
    if (input.value.startsWith('.')) input.value = input.value;
    input.value = input.value.replace(/^(\d+\.\d{5}).*$/, '$1');
    if (input.value.length > 20) input.value = input.value.slice(0, 20);
}

function displayConversionRates() {
    let ratesDisplayFrom = document.querySelector('.main-left .change-area p');
    let ratesDisplayTo = document.querySelector('.main-right .change-area p');
    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;

    ratesDisplayFrom.textContent = `1 ${fromCurrency} = ${(toRate / fromRate).toFixed(5)} ${toCurrency}`;
    ratesDisplayTo.textContent = `1 ${toCurrency} = ${(fromRate / toRate).toFixed(5)} ${fromCurrency}`;
}

function updateActiveCurrencyStyle() {
    document.querySelectorAll('.main-left .change-button p').forEach(button => {
        button.classList.toggle('active', button.textContent === fromCurrency);
    });

    document.querySelectorAll('.main-right .change-button p').forEach(button => {
        button.classList.toggle('active', button.textContent === toCurrency);
    });
}

fromInput.addEventListener('input', () => {
    activeInput = 'from';
    validateInput(fromInput);
    calculateConversion();
});

toInput.addEventListener('input', () => {
    activeInput = 'to';
    validateInput(toInput);
    calculateConversion();
});

document.querySelectorAll('.change-button p').forEach(button => {
    button.addEventListener('click', (e) => {
        let parent = e.target.closest('.change-button').parentNode;
        let isFrom = parent.classList.contains('main-left');

        if (isFrom) fromCurrency = e.target.textContent;
        else toCurrency = e.target.textContent;

        updateActiveCurrencyStyle();
        calculateConversion();
    });
});

window.addEventListener('online', () => {
    internetAlert.style.display = 'none';
    isOnline = true;
    getExchangeRates();
    calculateConversion();
});

window.addEventListener('offline', () => {
    internetAlert.style.display = 'block';
    isOnline = false;
});

let burgerMenu = document.querySelector('.burger-menu');
let aboutMenu = document.querySelector('.about');

burgerMenu.addEventListener('click', () => {
    aboutMenu.classList.toggle('active');
});
