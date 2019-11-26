import React from 'react';

import Input from 'src/components/input/Input';

import trashIcon from 'src/assets/images/trash.svg';

class BankRates extends React.Component {
  render() {
    return <div className="bank-rates">
      {this.renderList()}
      {this.props.edit && <div className="add-rate">
        <span className="link text-underline" onClick={this.addClick}>Add rate</span>
      </div>}
  </div>;
  }

  renderList() {
    const props = this.props;

    if (!props.bank.rates.length) {
      return null;
    }

    return <div className="bank-rates-list">
      {props.bank.rates.map((rate, rateIndex) => {
        return <div className="bank-rate" key={rateIndex}>
          <div className="grid-row">
            <div className="grid-col-6">
              <span className="rate-label">Above</span>
              <span className="rate-currency">R</span>
              {props.edit ? <Input value={rate.above} name="above" type="number"
                onChange={e => this.rateChange(e, rateIndex)}/> :
                <div className="rate-value">{rate.above}</div>}
            </div>
            <div className="grid-col-6">
              <span className="rate-label">earns</span>
              {props.edit ? <Input value={rate.earns} name="earns" type="number"
                onChange={e => this.rateChange(e, rateIndex)}/> :
                <div className="rate-value">{rate.earns}</div>}
              <span className="rate-currency">%</span>
            </div>
          </div>
          {props.edit && <div className="rate-remove">
            <img src={trashIcon} alt="remove" onClick={() => this.removeClick(rateIndex)}/>
          </div>}
        </div>;
      })}
    </div>;
  }

  rateChange(event, rateIndex) {
    const { name, value } = event.target;
    const props = this.props;
    const rates = props.bank.rates.slice();
    rates[rateIndex] = { ...rates[rateIndex], [name]: value };
    props.onChange({ ...props.bank, rates });
  };

  removeClick(rateIndex) {
    const props = this.props;
    props.onChange({
      ...props.bank,
      rates: props.bank.rates.filter((rate, index) => index !== rateIndex)
    });
  };

  addClick = () => {
    const props = this.props;
    this.props.onChange({
      ...props.bank,
      rates: [...props.bank.rates, { above: '', earns: '' }]
    });
  };
}

export default BankRates;