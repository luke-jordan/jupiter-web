import React from 'react';
import classNames from 'classnames';

import { inject } from 'src/core/utils';
import BankName from './BankName';
import BankRates from './BankRates';

import './ComparatorRates.scss';

class ComparatorRates extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');

    this.state = {
      edit: false,
      data: this.getDataAsArray(props.data)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        data: this.getDataAsArray(this.props.data)
      });
    }
  }

  render() {
    const state = this.state;
    const rootClass = classNames('comparator-rates', { edit: state.edit });
    
    return <div className={rootClass}>
      {this.renderHeader()}
      {state.data.length ? state.data.map(this.renderBank) :
        <div className="no-data">No rates</div>}
    </div>;
  }

  renderHeader() {
    const state = this.state;
    return <div className="section-header">
      <div className="header-text">Comparitor Interest Rates</div>
      <div className="header-actions">
        {state.edit ? <>
            <div className="button button-small button-outline"
              onClick={this.addBankClick}>Add bank</div>
            <div className="button button-small button-outline"
              onClick={this.cancelClick}>Cancel</div>
            <div className="button button-small button-outline"
              onClick={this.saveClick}>Save</div>
          </> :
          <div className="button button-small button-outline"
            onClick={this.editClick}>Edit rates</div>}
      </div>
    </div>
  }

  renderBank = (bank, bankIndex) => {
    return <div key={bankIndex}>
      <BankName bank={bank} edit={this.state.edit}
        onChange={newData => this.bankChange(newData, bankIndex)}
        onRemove={() => this.bankRemove(bankIndex)}/>
      <BankRates bank={bank} edit={this.state.edit}
        onChange={newData => this.bankChange(newData, bankIndex)}/>
    </div>;
  }

  addBankClick = () => {
    this.setState({
      edit: true,
      data: [{ name: '', rates: [] }, ...this.state.data]
    });
  }

  editClick = () => {
    this.setState({ edit: true });
  }

  cancelClick = () => {
    this.setState({
      edit: false,
      data: this.getDataAsArray(this.props.data)
    });
  }

  saveClick = () => {
    const error = this.validate();
    if (error) {
      this.modalService.openInfo('Comparitor Interest Rates', error);
      return;
    }

    this.setState({ edit: false });
    console.log(this.getReqBody());
  }

  bankChange(newData, bankIndex) {
    const data = this.state.data.slice();
    data[bankIndex] = newData;
    this.setState({ data });
  }

  bankRemove(bankIndex) {
    this.setState({
      data: this.state.data.filter((bank, index) => index !== bankIndex)
    });
  }

  getDataAsArray(data) {
    return Object.values(data.rates).map(bank => {
      return {
        name: bank.label,
        rates: Object.entries(bank).filter(([key]) => key !== 'label')
          .map(([above, earns]) => ({ above, earns }))
      };
    });
  }

  validate() {
    const data = this.state.data;

    for (let i = 0; i < data.length; ++i) {
      const bank = data[i];

      if (!bank.name.trim()) {
        return 'Bank name cannot be empty';
      }

      const dupBank = data.find((_bank, index) => {
        return index !== i && _bank.name.trim() === bank.name.trim()
      });
      if (dupBank) {
        return `Bank with name "${bank.name}" already exist`;
      }

      for (let j = 0; j < bank.rates.length; ++j) {
        const rate = bank.rates[j];

        if (!rate.above || !rate.earns) {
          return `Above rate and earns value cannot be empty ("${bank.name}" rates)`;
        }

        const dupRate = bank.rates.find((_rate, index) => {
          return index !== j && _rate.above === rate.above;
        });
        if (dupRate) {
          return `Rates cannot repeat within the bank ("${bank.name}" rates)`;
        }
      }
    }

    return '';
  }

  getReqBody() {
    return this.state.data.reduce((acc, cur) => {
      acc[cur.name] = Object.fromEntries(cur.rates.map(rate => [rate.above, rate.earns]))
      return acc;
    }, {});
  }
}

export default ComparatorRates;