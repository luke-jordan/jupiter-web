import React from 'react';
import classNames from 'classnames';

import BankName from './BankName';
import BankRates from './BankRates';

import './ComparatorRates.scss';

class ComparatorRates extends React.Component {
  constructor(props) {
    super();

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
    return <div className="bank-rates" key={bankIndex}>
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
    if (!this.validate()) {
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
    return true;
  }

  getReqBody() {
    return this.state.data.reduce((acc, cur) => {
      acc[cur.name] = Object.fromEntries(cur.rates.map(rate => [rate.above, rate.earns]))
      return acc;
    }, {});
  }
}

export default ComparatorRates;