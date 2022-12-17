// The response from the API will be a list of all exchange rates for the currency we give it
// So if I get exchange rates for eur I will know what 1 eur translate to in every single currency

const selectFromEl = document.getElementById('from-select')
const selectToEl = document.getElementById('to-select')
const exchanedValueEl = document.getElementById('exchanged-value-div')
const amountInput = document.getElementById('amount-input')

let rates
let amount = 1

// Function to initially get the currencies and the rates for eur
const getData = async () => {
    const response = await fetch(`${BASE_URL}EUR`)

    const data = await response.json()

    return data

    try {

    } catch (error) {
        console.log('error', error)
    }
}

// Function to get the rates with a dynamic currency
// When somebody changes the "from" currency I need to be able to get the updated rates
const fetchRates = async (currency) => {
    try {
        const response = await fetch(`${BASE_URL}${currency}`)

        const data = await response.json()

        return data.rates

    } catch (error) {
        console.log('error', error)
    }
}

const populateApp = async () => {
    const data = await getData()

    // Transform the key of the rates object(which will be the currencies) into an array
    const currencies = Object.keys(data.rates)

    rates = data.rates

    // Inject the currencies into the empty selects for from and to currency dropdowns
    currencies.forEach(currency => {
        selectFromEl.innerHTML += createCurrencyOption(currency, 'EUR')
        selectToEl.innerHTML += createCurrencyOption(currency, 'DKK')
    })

    // initially the app shows currencies from eur to dkk
    exchanedValueEl.innerHTML = data.rates.DKK
}

// Create a option element
// Takes in the currency to show as value
// And what the selected currency should be at the begining 

const createCurrencyOption = (currency, selected) =>
    `<option value='${currency}' ${currency == selected && 'selected'}>${currency}</option>`


// To handle the "currency to" being changed
// We can use the existing rates global variable
// Because it contains rates for all currencies using the "from currency"
// Including the one we just changed to

const handleSelectToElChange = (currency) => {
    // rates[currency] finds the rate for the selected currency
    // so if currency === eur its the same as saying rates.eur
    // which would give me the exchange rate of "from currency" to eur
    // then I just multiply it with the amount
    const newAmount =
        (rates[currency] * amount)

    exchanedValueEl.innerHTML = newAmount 
}

const handleAmountInputChange = (newAmount) => {
    amount = newAmount

    const currency = selectToEl.value // I didn't store selected currencies globally so I just get it from the element

    // Same calculation as before
    const newExchangedValue =
        (rates[currency] * amount)

    exchanedValueEl.innerHTML = newExchangedValue
}

// Here I need to fetch the rates again
// Because the currency to transfer from has changed
// So I need to get the rates for that currency
// Meaning it has to be an aync function
const handleSelectFromElChange = async (currency) => {
    rates = await fetchRates(currency)

    const toCurrency = currency = selectToEl.value

    const newExchangedValue =
        (rates[toCurrency] * amount)

    exchanedValueEl.innerHTML = newExchangedValue
}

selectToEl.addEventListener('change', (event) =>
    handleSelectToElChange(event.target.value))

amountInput.addEventListener('change', (event) =>
    handleAmountInputChange(event.target.value))

selectFromEl.addEventListener('change', (event) =>
    handleSelectFromElChange(event.target.value))

populateApp()