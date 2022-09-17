import React from "react";
import "../App.css";

export const blockInvalidChar = (e) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

function currencyRow({
  onchangeAmount,
  amount,
  currencyOptions,
  selectedCurrency,
  onchangeCurrency,
  label,
  disabled = false,
}) {
  return (
    <label>
      <div>
        {label && label + ": "}
        <select value={selectedCurrency} onChange={onchangeCurrency}>
          {currencyOptions?.map((Option,index) => (
            <option key={index} value={Option?.currency_code}>
              {Option?.currency_code}
            </option>
          ))}
        </select>
      </div>

      <input
        onKeyDown={blockInvalidChar}
        type="number"
        value={amount}
        min={0}
        onChange={onchangeAmount}
        disabled={disabled}
        name={label}
        step="any"
      />

    </label>
  );
}
export default currencyRow;
