import React from 'react';

import Input from 'src/components/input/Input';

const BankRates = props => {
  const rateChange = (event, rateIndex) => {
    const { name, value } = event.target;
    const rates = props.bank.rates.slice();
    rates[rateIndex] = { ...rates[rateIndex], [name]: value };
    props.onChange({ ...props.bank, rates });
  };

  const removeClick = rateIndex => {
    props.onChange({
      ...props.bank,
      rates: props.bank.rates.filter((rate, index) => index !== rateIndex)
    });
  };

  const addClick = () => {
    props.onChange({
      ...props.bank,
      rates: [...props.bank.rates, { above: '', earns: '' }]
    });
  };

  return <div className="bank-rates-list">
    {props.bank.rates.map((rate, rateIndex) => {
      return <div className="bank-rate" key={rateIndex}>
        <div className="grid-row">
          <div className="grid-col-5">
            <span className="rate-label">Above</span>
            <span className="rate-currency">R</span>
            {props.edit ? <Input value={rate.above} name="above"
              onChange={e => rateChange(e, rateIndex)}/> :
              <div className="rate-value">{rate.above}</div>}
          </div>
          <div className="grid-col-5">
            <span className="rate-label">earns</span>
            {props.edit ? <Input value={rate.earns} name="earns"
              onChange={e => rateChange(e, rateIndex)}/> :
              <div className="rate-value">{rate.earns}</div>}
            <span className="rate-currency">%</span>
          </div>
          <div className="grid-col-2">
            {props.edit &&
              <span className="link text-underline" onClick={() => removeClick(rateIndex)}>Remove rate</span>}
          </div>
        </div>
      </div>;
    })}
    {props.edit && 
      <span className="add-rate">
        <span className="link text-underline" onClick={addClick}>Add rate</span>
      </span>}
  </div>;
}

export default BankRates;