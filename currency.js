// 1. የዛሬውን የምንዛሬ ዋጋ ከ API የሚያመጣ ፈንክሽን
let exchangeRates = { USD: 120 }; // Default value

async function fetchRates() {
    try {
        // ምሳሌ፡ ነፃ API በመጠቀም (ማሳሰቢያ፡ እውነተኛ API Key ሊያስፈልግ ይችላል)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ETB');
        const data = await response.json();
        exchangeRates.USD = (1 / data.rates.USD).toFixed(2);
        console.log("የዛሬው የዶላር ዋጋ በብር፦", exchangeRates.USD);
    } catch (error) {
        console.log("የዛሬውን ዋጋ ማግኘት አልተቻለም፣ የቆየውን እንጠቀማለን።");
    }
}

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