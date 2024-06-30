

const BASE_URL = "https://api.allorigins.win/get?url=https://v6.exchangerate-api.com/v6";
var apikey = config.API_KEY;
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let val in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = val;
        if (select.name === "from" && val === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && val === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();  // Update exchange rate on currency change
    });
}

const updateExchangeRate = async () => {
    try {
        let amount = document.querySelector(".amount input");
        let amtVal = parseFloat(amount.value) || 1;
        const URL = `${BASE_URL}/${apikey}/latest/${fromCurr.value}`;

        console.log(`Fetching data from URL: ${URL}`);

        let res = await fetch(URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch data (${res.status})`);
        }

        let data = await res.json();
        let responseData = JSON.parse(data.contents);  // Parse the response content
        console.log(`Response Data:`, responseData);

        if (responseData.result !== "success") {
            throw new Error("API response not successful");
        }

        let rate = responseData.conversion_rates[toCurr.value];
        if (!rate) {
            throw new Error("Conversion rate not found");
        }

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        msg.innerText = "Failed to fetch exchange rate. Please try again later.";
    }
};

const updateFlag = (select) => {
    let val = select.value;
    let countryCode = countryList[val];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = select.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
