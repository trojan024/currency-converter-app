// 1. የዛሬውን የምንዛሬ ዋጋ ከ API የሚያመጣ ፈንክሽን
let exchangeRates = { USD: 120 }; // Default value

// 1. የዛሬውን ዋጋ ከ API ሲያመጣ ስህተት ካለ ለመያዝ (Error Handling)
async function fetchRates() {
    const resultDiv = document.getElementById('result');
    
    try {
        // ኢንተርኔት መኖሩን ቼክ ለማድረግ
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ETB');
        
        if (!response.ok) {
            throw new Error("API Error");
        }

        const data = await response.json();
        exchangeRates.USD = (1 / data.rates.USD).toFixed(2);
        console.log("ዳታው መጥቷል!");

    } catch (error) {
        // ስህተት ሲፈጠር እዚህ ጋር ነው የሚመጣው
        console.log("ኢንተርኔት የለም ወይም APIው አልሰራም");
        
        if (resultDiv) {
            resultDiv.innerHTML = `<p style="color: red; font-weight: bold; border: 1px solid red; padding: 10px;">
                ማሳሰቢያ፡ የኢንተርኔት ግንኙነት የለም። የቆየውን ዋጋ እየተጠቀምን ነው።
            </p>`;
        }
    }
}

// ፈንክሽኑን መጥራት እንዳትረሳ!
fetchRates();

// ፈንክሽኑን መጥራት እንዳትረሳ!
fetchRates();

fetchRates(); // ገጹ ሲከፈት ዋጋውን እንዲያመጣ

let conversionHistory = JSON.parse(localStorage.getItem('myHistory')) || [];
renderHistory();

// --- መለወጫ Logic ---
document.getElementById('convertBtn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('amount').value);
    const direction = document.getElementById('direction').value;
    const resultDiv = document.getElementById('result');

    if (isNaN(amount) || amount <= 0) return;

    const rate = exchangeRates.USD;
    let finalValue, recordText;

    if (direction === "ETBtoUSD") {
        finalValue = (amount / rate).toFixed(2);
        recordText = `${amount} ETB ➔ $${finalValue} USD (@${rate})`;
    } else {
        finalValue = (amount * rate).toFixed(2);
        recordText = `$${amount} USD ➔ ${finalValue} ETB (@${rate})`;
    }

    resultDiv.innerHTML = `<h3>${recordText}</h3>`;
    conversionHistory.push(recordText);
    localStorage.setItem('myHistory', JSON.stringify(conversionHistory));
    renderHistory();
});

// --- 3. የታሪክ ማጥፊያ (Delete Function) ---
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm("ሁሉንም ታሪክ ማጥፋት ትፈልጋለህ?")) {
        conversionHistory = []; // Array-ውን ባዶ ማድረግ
        localStorage.removeItem('myHistory'); // ከ LocalStorage ማጥፋት
        renderHistory(); // ስክሪኑን ማጽዳት
    }
});

function renderHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ""; 
    conversionHistory.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = item;
        historyList.appendChild(li);
    });
}
const toggleSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');

// መጀመሪያ ሲከፈት የተቀመጠ ምርጫ ካለ መፈተሽ
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// Switch ሲደረግ የሚሰራ ፈንክሽን
toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
});