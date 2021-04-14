const apiKey = ""; //API key needed from https://free.currencyconverterapi.com/ 
const currencies = [];

const app = Vue.createApp({
    methods: {
        async populateCurrencyLists() {
            let count = 0;
            const firstList = document.createElement("select");
            const secondList = document.createElement("select");
            firstList.id = "first-list"
            const currencyRes = await fetch(`https://free.currconv.com/api/v7/currencies?apiKey=${apiKey}`);
            const currencyData = await currencyRes.json();
            const currArray = Object.keys(currencyData.results);
            while (currArray[count]) {
                currencies.push(currArray[count]);
                count++;
            }
            fillLists(firstList, secondList);
            console.log("done");
        },
        async convertCurrency() {
            const firstCurrency = document.getElementById("first-list").value;
            const secondCurrency = document.getElementById("second-list").value;
            let amount = document.getElementById("amount").value;
            if (amount == "") {
                amount = 0;
            }
            const result = document.getElementById("result")
            const exchangeRateRes = await fetch(`https://free.currconv.com/api/v7/convert?q=${firstCurrency}_${secondCurrency},${secondCurrency}_${firstCurrency}&compact=ultra&apiKey=${apiKey}`);
            const exchangeRateData = await exchangeRateRes.json();
            const exchangeArrayNumbers = Object.values(exchangeRateData);
            const exchangeArrayCurrencies = Object.keys(exchangeRateData);
            result.innerText = `${(parseFloat(amount) * parseFloat(exchangeArrayNumbers[0])).toFixed(3)} ${exchangeArrayCurrencies[0].split("_")[1]}`
        }
    }
});

const mountedApp = app.mount("#app");

mountedApp.populateCurrencyLists();

const listDiv1 = document.getElementById("firstlist");
const listDiv2 = document.getElementById("secondlist");

const convert = document.getElementById("convert");

convert.addEventListener("click", () => { mountedApp.convertCurrency(); });

function fillLists(firstList, secondList) {
    for (let i = 0; i < currencies.length; i++) {
        let option = document.createElement("option");
        option.value = currencies[i];
        option.innerText = currencies[i];
        firstList.appendChild(option);
    }
    secondList = firstList.cloneNode(true);
    secondList.id = "second-list"
    listDiv1.appendChild(firstList);
    listDiv2.appendChild(secondList);
}
