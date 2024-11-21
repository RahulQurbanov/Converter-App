let exchangeRates = {};
let fromInput = document.querySelector('.main-left .change-area input');
let toInput = document.querySelector('.main-right .change-area input');
let fromCurrency = "RUB";
let toCurrency = "USD";
let activeInput = "from";

// İnternet bağlantısı kontrol uyarısı
let internetAlert = document.querySelector(".innerAlert");

// Döviz oranlarını API'den al
async function getExchangeRates() {
    if (!navigator.onLine) {
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
    } catch (error) {
        alert('Məlumatları gətirərkən xəta baş verdi!');
    }
}
getExchangeRates();

// Hesaplama fonksiyonu
function calculateConversion() {
    if (!navigator.onLine) {
        internetAlert.style.display = 'block';
        return;
    }

    internetAlert.style.display = 'none';
    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;

    // Input validation ve `,` düzeltme
    fromInput.value = fromInput.value.replace(',', '.');
    toInput.value = toInput.value.replace(',', '.');

    let regex = /^[0-9.]*$/;
    if (!regex.test(fromInput.value)) {
        fromInput.value = fromInput.value.replace(/[^0-9.]/g, '');
        alert('Zəhmət olmasa yalnız rəqəm daxil edin.');
    }
    if (!regex.test(toInput.value)) {
        toInput.value = toInput.value.replace(/[^0-9.]/g, '');
        alert('Zəhmət olmasa yalnız rəqəm daxil edin.');
    }

    if (fromInput.value.length < 23 && toInput.value.length < 23) {
        if (activeInput === 'from') {
            let amount = parseFloat(fromInput.value) || 0;
            toInput.value = (amount * (toRate / fromRate)).toFixed(5);
        } else if (activeInput === 'to') {
            let amount = parseFloat(toInput.value) || 0;
            fromInput.value = (amount * (fromRate / toRate)).toFixed(5);
        }
    }
    displayConversionRates();
}

// Döviz oranlarını göster
function displayConversionRates() {
    let ratesDisplayFrom = document.querySelector('.main-left .change-area p');
    let ratesDisplayTo = document.querySelector('.main-right .change-area p');

    let fromRate = exchangeRates[fromCurrency] || 1;
    let toRate = exchangeRates[toCurrency] || 1;

    ratesDisplayFrom.textContent = `1 ${fromCurrency} = ${(toRate / fromRate).toFixed(5)} ${toCurrency}`;
    ratesDisplayTo.textContent = `1 ${toCurrency} = ${(fromRate / toRate).toFixed(5)} ${fromCurrency}`;
}

// Aktif buton stilini güncelle
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

// Sol veya sağ giriş değiştiğinde aktif alanı takip et
fromInput.addEventListener('input', () => {
    activeInput = 'from';
    calculateConversion();
});

toInput.addEventListener('input', () => {
    activeInput = 'to';
    calculateConversion();
});

// Para birimi seçimini değiştirme
document.querySelectorAll('.change-button p').forEach(button => {
    button.addEventListener('click', (e) => {
        let parent = e.target.closest('.change-button').parentNode;
        let isFrom = parent.classList.contains('main-left');

        if (isFrom) {
            fromCurrency = e.target.textContent;
        } else {
            toCurrency = e.target.textContent;
        }

        updateActiveCurrencyStyle();
        calculateConversion();
    });
});

// İnternet bağlantısı durumunu takip et
window.addEventListener('online', () => {
    internetAlert.style.display = 'none';
    getExchangeRates();
    calculateConversion();
});

window.addEventListener('offline', () => {
    internetAlert.style.display = 'block';
});

// Burger menyu açıb-bağlama
let burgerMenu = document.querySelector('.burger-menu');
let aboutMenu = document.querySelector('.about');

burgerMenu.addEventListener('click', () => {
    aboutMenu.classList.toggle('active');
});
