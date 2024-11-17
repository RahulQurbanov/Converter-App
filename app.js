let exchangeRates = {};
let fromInput = document.querySelector('.main-left .change-area input');
let toInput = document.querySelector('.main-right .change-area input');
let fromCurrency = "RUB";
let toCurrency = "USD";

// API'den döviz kurlarını alma
async function getExchangeRates() {
    let data = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_VEOkI8dY7qpQ3Fr34UIfRgaEHOsPYuvZyzUcAfMT&symbols=USD,EUR,GBP,RUB').then(res => res.json());
    exchangeRates = data.data;

    // Varsayılan oranları göster
    displayConversionRates();
    updateActiveCurrencyStyle(); // Default arka plan stillerini güncelle
}
getExchangeRates();

// Döviz kurlarını hesaplama
function calculateConversion(inputType) {
    let fromRate = exchangeRates[fromCurrency]?.value || 1;
    let toRate = exchangeRates[toCurrency]?.value || 1;

    if (inputType === 'from') {
        let amount = parseFloat(fromInput.value.replace(',', '.')) || 0; // Virgülü noktaya çevir
        toInput.value = (amount * (toRate / fromRate)).toFixed(5);
    } else if (inputType === 'to') {
        let amount = parseFloat(toInput.value.replace(',', '.')) || 0; // Virgülü noktaya çevir
        fromInput.value = (amount * (fromRate / toRate)).toFixed(5);
    }

    // Diğer oranları da güncelle
    displayConversionRates();
}

// Döviz oranlarını göstermek
function displayConversionRates() {
    let ratesDisplayFrom = document.querySelector('.main-left .change-area p');
    let ratesDisplayTo = document.querySelector('.main-right .change-area p');

    let fromRate = exchangeRates[fromCurrency]?.value || 1;
    let toRate = exchangeRates[toCurrency]?.value || 1;

    ratesDisplayFrom.textContent = `1 ${fromCurrency} = ${(toRate / fromRate).toFixed(5)} ${toCurrency}`;
    ratesDisplayTo.textContent = `1 ${toCurrency} = ${(fromRate / toRate).toFixed(5)} ${fromCurrency}`;
}

// Aktif olan para birimi stilini güncelle
function updateActiveCurrencyStyle() {
    // Sol taraf (From)
    document.querySelectorAll('.main-left .change-button p').forEach(button => {
        if (button.textContent === fromCurrency) {
            button.style.backgroundColor = "#833AE0"; // Aktif olan para birimi
            button.style.color = "white";
        } else {
            button.style.backgroundColor = "white"; // Diğer para birimleri
            button.style.color = "black";
        }
    });

    // Sağ taraf (To)
    document.querySelectorAll('.main-right .change-button p').forEach(button => {
        if (button.textContent === toCurrency) {
            button.style.backgroundColor = "#833AE0"; // Aktif olan para birimi
            button.style.color = "white";
        } else {
            button.style.backgroundColor = "white"; // Diğer para birimleri
            button.style.color = "black";
        }
    });
}

// Event dinleyicileri
fromInput.addEventListener('input', () => calculateConversion('from'));
toInput.addEventListener('input', () => calculateConversion('to'));

// Para birimi seçimini değiştirme
document.querySelectorAll('.change-button p').forEach(button => {
    button.addEventListener('click', (e) => {
        let parent = e.target.closest('.change-button');
        let isFrom = parent.classList.contains('main-left');

        if (isFrom) {
            fromCurrency = e.target.textContent; // Sol taraf için para birimini güncelle
        } else {
            toCurrency = e.target.textContent; // Sağ taraf için para birimini güncelle
        }

        // Aktif buton stilini güncelle
        updateActiveCurrencyStyle();

        // Yeni kur oranlarıyla hesaplama
        calculateConversion('from');
    });
});
