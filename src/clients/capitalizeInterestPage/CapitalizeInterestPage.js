import React from 'react';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';

import { inject, unmountDecorator, formatMoney } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';

import './CapitalizeInterestPage.scss';

class CapitalizeInterestPage extends React.Component {
  constructor(props) {
    super();

    this.clientsService = inject('ClientsService');
    this.historyService = inject('HistoryService');
    this.modalService = inject('ModalService');

    this.floatUrl = this.getFloatUrl(props.location.pathname);

    this.readParams(props);

    this.state = {
      loading: true,
      preview: null
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadPreview();
  }

  render() {
    const state = this.state;
    return <div className="capitalize-interest-page">
      <PageBreadcrumb title="Capitalize Interest Preview" link={{ to: this.floatUrl, text: 'Float' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        {state.preview && <>
          {this.renderParams()}
          {this.renderPreview()}
          {this.renderTransactions()}
          <div className="capitalize-confirm">
            <button className="button" onClick={this.confirmClick}>Confirm</button>
          </div>
        </>}
      </div>
    </div>;
  }

  renderParams() {
    const params = this.params;
    const amount = formatMoney(params.paidAmount, params.currency);
    const date = moment(params.paidDate).format('DD/MM/YY hh:mmA');

    return <div className="capitalize-params">
      <span>Interest paid: <b>{amount}</b></span>
      <span>Date and time paid: <b>{date}</b></span>
    </div>;
  }

  renderPreview() {
    const preview = this.state.preview;
    return <div className="capitalize-preview">
      <table className="table">
        <tbody>
          <tr>
            <td>Number of accounts to be credited</td>
            <td>{preview.numberAccountsToBeCredited}</td>
          </tr>
          <tr>
            <td>Amount to credit client</td>
            <td>{preview.amountToCreditClientMoney}</td>
          </tr>
          <tr>
            <td>Amount to credit bonus pool</td>
            <td>{preview.amountToCreditBonusPoolMoney}</td>
          </tr>
          <tr>
            <td>Excess over past accrual</td>
            <td>{preview.excessOverPastAccrualMoney}</td>
          </tr>
        </tbody>
      </table>
    </div>;
  }

  renderTransactions() {
    const preview = this.state.preview;
    return <div className="capitalize-transactions">
      <div className="section-header">
        <div className="header-text">Sample of transactions</div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Account name</th>
            <th>Prior balance</th>
            <th>Prior accrued</th>
            <th>Amount to credit</th>
          </tr>
        </thead>
        <tbody>
          {preview.sampleOfTransactions.map(transaction =>
            <tr key={transaction.accountId}>
              <td>{transaction.accountName}</td>
              <td>{transaction.priorBalanceMoney}</td>
              <td>{transaction.priorAccruedMoney}</td>
              <td>{transaction.amountToCreditMoney}</td>
            </tr>)}
        </tbody>
      </table>
    </div>;
  }

  getFloatUrl(pathname) {
    return pathname.substring(0, pathname.lastIndexOf('/'));
  }

  readParams(props) {
    const routeParams = props.match.params;
    const searchParams = new URLSearchParams(props.location.search);

    this.params = {
      clientId: routeParams.clientId,
      floatId: routeParams.floatId,
      paidAmount: +searchParams.get('paidAmount'),
      paidDate: +searchParams.get('paidDate'),
      currency: searchParams.get('currency')
    };
  }

  getReqBody() {
    const params = this.params;
    return {
      clientId: params.clientId,
      floatId: params.floatId,
      yieldPaid: params.paidAmount * 100,
      unit: 'WHOLE_CENT',
      currency: params.currency,
      dateTimePaid: params.paidDate
    };
  }

  loadPreview() {
    this.clientsService.previewCapitalizeInterest(this.getReqBody()).pipe(
      takeUntil(this.unmount)
    ).subscribe(preview => {
      this.setState({ preview, loading: false });
    });
  }

  confirmClick = () => {
    this.setState({ loading: true });

    this.clientsService.confirmCapitalizeInterest(this.getReqBody()).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({ loading: false });
      this.modalService.openInfo('Capitalize Interest', 'Operation is successful', () => {
        this.historyService.push(this.floatUrl);
      });
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }
}

export default CapitalizeInterestPage;