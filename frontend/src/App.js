import React, { useCallback, useEffect, useState } from "react";
import CurrencyRow from "./currencyRow";
import debounce from "lodash.debounce";
import { ClipLoader } from "react-spinners";

const BASE_URL = "http://localhost:4000/currency-converter";

function App() {
  const [currencyOptions, setcurrencyOptions] = useState(["AUD", "INR","USD"]);
  const [fromCurrency, setfromCurrency] = useState("AUD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState();
  const [amountInFromCurrency, setAmountInFromCurrency] = useState();
  const [loading, setLoading] = useState(false);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = exchangeRate?.result || 0;
  } else {
    toAmount = amount;
    fromAmount = exchangeRate?.result || 0;
  }

  const getCurrencyList = () => {
    fetch("data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => setcurrencyOptions(json))
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getCurrencyList();
  }, []);

  const handleCurrencyRate = useCallback(
    debounce((fromCurrency, toCurrency, amountInFromCurrency, amount) => {
      setLoading(true);
      fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: amountInFromCurrency ? fromCurrency : toCurrency,
          to: amountInFromCurrency ? toCurrency : fromCurrency,
          amount: amount,
        }),
      })
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.data))
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setLoading(false));
    }, 1000),
    []
  );

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null && amount) {
      handleCurrencyRate(
        fromCurrency,
        toCurrency,
        amountInFromCurrency,
        amount
      );
    }
  }, [fromCurrency, toCurrency, amount]);

  function handleAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(e.target.name === "From" ? true : false);
    setExchangeRate();
  }
  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div className="container">
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onchangeCurrency={(e) => {
            setfromCurrency(e.target.value);
          }}
          amount={fromAmount}
          onchangeAmount={handleAmountChange}
          label="From"
        />
        {loading ? (
          <ClipLoader color={"red"} loading={loading} size={10} />
        ) : (
          <span>&#8652;</span>
        )}

        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onchangeCurrency={(e) => {
            setToCurrency(e.target.value);
          }}
          amount={toAmount}
          onchangeAmount={handleAmountChange}
          label="To"
        />
      </div>
      {amount>0 && exchangeRate?.info?.rate && (
        <p>
          1 {fromCurrency} = {exchangeRate?.info?.rate} {toCurrency}
        </p>
      )}
    </div>
  );
}
export default App;
