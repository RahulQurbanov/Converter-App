let exchangeRates = {};
let fromInput = document.querySelector('.main-left .change-area input');
let toInput = document.querySelector('.main-right .change-area input');
let fromCurrency = "RUB";
let toCurrency = "USD";
let activeInput = "from";
let fromInputLength
let toInputLength

async function getExchangeRates() {
    let data = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_VEOkI8dY7qpQ3Fr34UIfRgaEHOsPYuvZyzUcAfMT&symbols=USD,EUR,GBP,RUB')
        .then(res => res.json());
    exchangeRates = data.data;

    displayConversionRates();
    updateActiveCurrencyStyle();
}
getExchangeRates();

// Hesaplama fonksiyonu
function calculateConversion() {
    let regex = /^[0-9.,]*$/; 

    if (!regex.test(fromInput.value)){
        fromInput.value = fromInput.value.replace(/[^0-9.,]/g, ""); 
        alert("Zəhmət olmasa yalnız rəqəm daxil edin.");
    }
    if (!regex.test(toInput.value)) {
        toInput.value = toInput.value.replace(/[^0-9.,]/g, ""); 
        alert("Zəhmət olmasa yalnız rəqəm daxil edin.");
    }
    
    let fromRate = exchangeRates[fromCurrency]?.value || 1;
    let toRate = exchangeRates[toCurrency]?.value || 1;

    if (fromInput.value.length < 23 || toInput.value.length<23) {
        if (activeInput === "from") {
            let amount = parseFloat(fromInput.value.replace(',', '.')) || 0;
            toInput.value = (amount * (toRate / fromRate)).toFixed(5);
        } else if (activeInput === "to") {
            let amount = parseFloat(toInput.value.replace(',', '.')) || 0;
            fromInput.value = (amount * (fromRate / toRate)).toFixed(5);
        }
    }else{
        fromInputLength = fromInput.value;
        toInputLength = toInput.value;
    }

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

// Aktif butonun stilini güncelle
function updateActiveCurrencyStyle() {
    document.querySelectorAll('.main-left .change-button p').forEach(button => {
        if (button.textContent === fromCurrency) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    document.querySelectorAll('.main-right .change-button p').forEach(button => {
        if (button.textContent === toCurrency) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Sol veya sağ giriş kutusu değiştiğinde aktif alanı takip et
fromInput.addEventListener('input', () => {
    activeInput = "from"; // Sol giriş aktif
    calculateConversion();
});

toInput.addEventListener('input', () => {
    activeInput = "to"; // Sağ giriş aktif
    calculateConversion();
});

// Para birimi seçimini değiştirme
document.querySelectorAll('.change-button p').forEach(button => {
    button.addEventListener('click', (e) => {
        let parent = e.target.closest('.change-button');
        let isFrom = parent.classList.contains('main-left'); // Sol mu sağ mı?

        if (isFrom) {
            fromCurrency = e.target.textContent; // Sol taraf için para birimini güncelle
        } else {
            toCurrency = e.target.textContent; // Sağ taraf için para birimini güncelle
        }

        updateActiveCurrencyStyle(); // Stil güncelle
        calculateConversion(); // Hesaplama yap
    });
});
