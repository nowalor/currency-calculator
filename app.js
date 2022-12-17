const selectFromEl = document.getElementById('from-select')
const selectToEl = document.getElementById('to-select')
const exchanedValueEl = document.getElementById('exchanged-value-div')
const amountInput = document.getElementById('amount-input')

let rates
let amount = 1

const getData = async () => {
    const response = await fetch(`${BASE_URL}EUR`)

    const data = await response.json()

    return data

    try {

    } catch (error) {
        console.log('error', error)
    }
}

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

    const currencies = Object.keys(data.rates)

    rates = data.rates

    currencies.forEach(currency => {
        selectFromEl.innerHTML += createCurrencyOption(currency, 'EUR')
        selectToEl.innerHTML += createCurrencyOption(currency, 'DKK')
    })

    exchanedValueEl.innerHTML = data.rates.DKK
}

const createCurrencyOption = (currency, selected) =>
    `<option value='${currency}' ${currency == selected && 'selected'}>${currency}</option>`



const handleSelectToElChange = (currency) => {
    const newAmount =
        (rates[currency] * amount)

    exchanedValueEl.innerHTML = newAmount
}

const handleAmountInputChange = (newAmount) => {
    amount = newAmount

    const currency = selectToEl.value

    const newExchangedValue =
        (rates[currency] * amount)

    exchanedValueEl.innerHTML = newExchangedValue   
}

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