import React from 'react';
import classNames from 'classnames';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Spinner from 'src/components/spinner/Spinner';
import BankName from './BankName';
import BankRates from './BankRates';

import './ComparatorRates.scss';

class ComparatorRates extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');
    this.clientsService = inject('ClientsService');

    this.state = {
      loading: false,
      edit: false,
      data: this.getDataAsArray(props.data)
    };

    unmountDecorator(this);
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
      {state.loading && <Spinner overlay/>}
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
      this.modalService.openInfo('Error', error);
      return;
    }

    this.setState({ loading: true });

    this.clientsService.updateComparatorRates(this.getReqBody()).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({ loading: false, edit: false });
      this.props.onSaved();
    }, () => {
      // TODO: Check if otp needed
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
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
    const { float, data } = this.props;

    const rates = this.state.data.reduce((acc, cur) => {
      const obj = { label: cur.name };
      cur.rates.forEach(rate => obj[rate.above] = rate.earns);
      acc[cur.name.replace(/\s/g, '_')] = obj;
      return acc;
    }, {});

    return {
      floatId: float.floatId,
      clientId: float.clientId,
      comparatorRates: {
        intervalUnit: data.intervalUnit,
        rateUnit: data.rateUnit,
        rates
      }
    };
  }
}

export default ComparatorRates;