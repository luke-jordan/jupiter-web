import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator, revertAmount } from 'src/core/utils';
import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Spinner from 'src/components/spinner/Spinner';
import Select from 'src/components/select/Select';

import './UserTransactions.scss';

class UserTransactions extends React.Component {
  constructor() {
    super();

    this.usersService = inject('UsersService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      reasonData: null,
      showInitiateTxModal: false,
    };

    unmountDecorator(this);
  }

  render() {
    // doing this as a button requires finding the class and that is 10 minutes that the warning is not worth at present
    return <div className="user-transactions">
      <header className="transactions-header">Pending EFT Transactions (
        <button className="link text-underline" onClick={() => this.openInitiateTransactionModal(false)}>create save</button> /
        <button className="link text-underline" onClick={() => this.openInitiateTransactionModal(true)}>create withdrawal</button>
      )
      </header>
      {this.renderTable()}
      {this.renderTransactionStatusChangeModal()}
      {this.renderTransactionAmountModal()}
      {this.renderTransactionInitiateModal()}
    </div>;
  }

  renderTable() {
    const rows = this.props.user.pendingTransactions.map(transaction => {
      return <tr key={transaction.transactionId}>
        <td>{transaction.formattedCreationDate}</td>
        <td>{transaction.transactionTypeText}</td>
        <td>{transaction.amountMoney}</td>
        <td>{transaction.humanReference}</td>
        {this.renderTransactionActions(transaction)}
      </tr>;
    });

    return <table className="table">
      <thead>
        <tr>
          <th style={{width: 120}}>Date</th>
          <th style={{width: 120}}>Type</th>
          <th style={{width: 120}}>EFT amount</th>
          <th style={{width: 150}}>Bank ref</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows : <tr><td colSpan="5" className="no-data">No transactions</td></tr>}
      </tbody>
    </table>;
  }

  renderTransactionActions(transaction) {
    const type = transaction.transactionType;
    return <td className="transaction-actions">
      <button className="button button-outline button-small"
        onClick={() => this.openTransactionAmountModal(transaction)}>Change amount</button>
      {type === 'USER_SAVING_EVENT' && <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Mark transaction as received', 'SETTLED')}>Mark as received</button>}
      {type === 'WITHDRAWAL' && <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Complete transaction withdrawal', 'SETTLED')}>Complete withdrawal</button>}
      <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Cancel transaction', 'CANCELLED')}>Cancel</button>
    </td>
  }

  renderTransactionAmountModal() {
    const txAmountData = this.state.txAmountData;
    return txAmountData &&
    <Modal open className="transaction-change-reason" header="Change amount" onClose={this.closeTransactionAmountModal}>
    <form onSubmit={this.submitAmountChange}>
      <div className="reason-msg">Enter the changed amount</div>
      <div className="grid-row">
        <div className="grid-col-6">
          <span class="reason-msg">Current value:</span>
          <Input name="oldValue" placeholder={this.state.txAmountData.currentAmountDisplay} disabled/>
        </div>
        <div className="grid-col-6">
          <span class="reason-msg">New value:</span> 
          <Input name="newValue" type="number" value={txAmountData.newAmountValue} onChange={this.amountValueInputChange}/>
        </div>
      </div>
      <div className="reason-msg" style={{ marginTop: 10 }}>Please enter reason below</div>
      <div className="grid-row">
        <div className="grid-col-9">
          <Input name="reason" placeholder="Enter reason"
            value={txAmountData.reasonText} onChange={this.amountReasonInputChange}/>
        </div>
        <div className="grid-col-3">
          <button className="button" disabled={!txAmountData.reasonText.trim()}>Submit</button>
        </div>
      </div>
    </form>
    {this.state.loading && <Spinner overlay/>}
  </Modal>;
  }

  openTransactionAmountModal(transaction) {
    this.setState({
      txAmountData: {
        transactionId: transaction.transactionId,
        currentAmountDisplay: transaction.amountMoney,
        newAmountValue: transaction.amountValue,
        newAmountRaw: revertAmount(transaction.amountValue, transaction.unit),
        transactionUnit: transaction.unit,
        transactionCurrency: transaction.currency,
        transactionAmount: transaction.amount, 
        reasonText: ''
      }
    });
  }

  closeTransactionAmountModal = () => {
    this.setState({ txAmountData: null, loading: false });
  }

  amountValueInputChange = e => {
    this.setState({
      txAmountData: { ...this.state.txAmountData, newAmountValue: e.target.value }
    })
  }

  amountReasonInputChange = e => {
    this.setState({ 
      txAmountData: { ...this.state.txAmountData, reasonText: e.target.value }
    });
  }

  openInitiateTransactionModal = (isWithdrawal) => {
    this.setState({
      showInitiateTxModal: true,
      txInitiateData: {
        amount: 0,
        currency: 'ZAR',
        unit: 'WHOLE_CURRENCY',
        accountId: this.props.user.userBalance.accountId[0],
        reasonText: '',
        isWithdrawal
      }
    });
  }

  closeInitiateTransactionModal = (clearTxDetails) => {
    if (clearTxDetails) {
      this.setState({ showInitiateTxModal: false, txInitiateData: null });
    } else {
      // we do not wipe the data in case user wants to continue
      this.setState({ showInitiateTxModal: false });
    }
  }

  // todo : at some point this could use a clean up / generalization with the above, but for now they are simple enough
  changeInitiateTxField = e => {
    this.setState({
      txInitiateData: { ...this.state.txInitiateData, [e.target.name]: e.target.value }
    });
  }

  renderTransactionInitiateModal() {
    const { txInitiateData } = this.state;
    const isWithdrawal = txInitiateData && txInitiateData.isWithdrawal;

    return this.state.showInitiateTxModal &&
    <Modal open className="transaction-change-reason" header={`Initiate ${isWithdrawal ? 'withdrawal' : 'save'}`} 
      onClose={this.closeInitiateTransactionModal}>
      <form onSubmit={this.submitNewTransaction}>
        <div className="reason-msg">Please enter the amount below and a note to log</div>
        <div className="grid-row">
          <div className="grid-col-4">
            <span className="reason-msg">Amount:</span>
            <Input name="amount" type="number" placeholder={txInitiateData.amount} onChange={this.changeInitiateTxField} />
          </div>
          <div className="grid-col-6">
          <span className="reason-msg">Reason:</span>
            <Input name="reasonText" placeholder="Enter reason" value={txInitiateData.reasonText} onChange={this.changeInitiateTxField}/>
          </div>
          <div className="grid-col-2" style={{ paddingTop: 20 }}>
            <button className="button" disabled={!txInitiateData.reasonText.trim() || txInitiateData.amount === 0}>Submit</button>
          </div>
        </div>
        {isWithdrawal && <>
          <div className="grid-row">
            Bank detials (optional-for verification if not before)
          </div>
          <div className="grid-row">
            <div className="grid-col-6">
              <span className="reason-msg">Bank: </span>
              <Select name="bankAccBank" value={txInitiateData.bankAccBank} onChange={this.changeInitiateTxField}>
                <option value="">Select</option>
                <option value="FNB">FNB</option>
                <option value="CAPITEC">Capitec</option>
                <option value="STANDARD">Standard</option>
                <option value="ABSA">Absa</option>
                <option value="NEDBANK">Nedbank</option>
                <option value="TYME">Tyme</option>
              </Select>
            </div>
            <div className="grid-col-6">
              <span className="reason-msg">Type: </span>
              <Select name="bankAccType" value={txInitiateData.bankAccType} onChange={this.changeInitiateTxField}>
                <option value="">Select</option>
                <option value="CURRENT">Current</option>
                <option value="SAVINGS">Savings</option>
              </Select>
            </div>
          </div>
          <div className="grid-row">
            <div className="grid-col-4">
              <span className="reason-msg">Acc Number: </span>
              <Input name="bankAccNumber" value={txInitiateData.bankAccNumber} onChange={this.changeInitiateTxField}/>
            </div>
          </div>
        </>}
      </form>
    </Modal> 
  }

  renderTransactionStatusChangeModal() {
    const reasonData = this.state.reasonData;
    return reasonData && 
    <Modal open className="transaction-change-reason" header={reasonData.modalHeader} onClose={this.closeTransactionStatus}>
      <form onSubmit={this.submitStatusChange}>
        <div className="reason-msg">Please enter reason below</div>
        <div className="grid-row">
          <div className="grid-col-9">
            <Input name="reason" placeholder="Enter reason"
              value={reasonData.reasonText} onChange={this.statusReasonInputChange}/>
          </div>
          <div className="grid-col-3">
            <button className="button" disabled={!reasonData.reasonText.trim()}>Submit</button>
          </div>
        </div>
      </form>
      {this.state.loading && <Spinner overlay/>}
    </Modal>;
  }

  openTransactionStatus(transaction, modalHeader, newTxStatus) {
    this.setState({
      reasonData: {
        transactionId: transaction.transactionId, 
        modalHeader, 
        newTxStatus, 
        reasonText: ''
      }
    });
  }

  closeTransactionStatus = () => {
    this.setState({ reasonData: null, loading: false });
  }

  statusReasonInputChange = e => {
    this.setState({ 
      reasonData: { ...this.state.reasonData, reasonText: e.target.value }
    });
  }

  submitUserChange = (submissionData) => {
    this.setState({ loading: true });

    this.usersService.updateUser({
      systemWideUserId: this.props.user.systemWideUserId,
      fieldToUpdate: 'TRANSACTION',
      reasonToLog: submissionData.reasonText,
      ...submissionData,
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.closeTransactionStatus();
      this.closeTransactionAmountModal();
      this.closeInitiateTransactionModal(true);
      this.props.onChanged();
    }, () => {
      this.closeTransactionStatus();
      this.closeTransactionAmountModal();
      this.closeInitiateTransactionModal(false);
      this.modalService.openCommonError();
    });
  }

  submitStatusChange = e => {
    e.preventDefault();
    const reasonData = this.state.reasonData;
    this.submitUserChange(reasonData);
  }

  submitAmountChange = e => {
    e.preventDefault();

    const { txAmountData } = this.state;
    const newAmount = {
      amount: revertAmount(txAmountData.newAmountValue, txAmountData.transactionUnit),
      unit: txAmountData.transactionUnit,
      currency: txAmountData.transactionCurrency,
    }

    this.submitUserChange({ ...txAmountData, newAmount });
  }

  submitNewTransaction = e => {
    e.preventDefault();

    const { txInitiateData } = this.state;
    console.log('Submitting: ', txInitiateData);

    const submissionBody = {
      operation: 'INITIATE',
      transactionParameters: {
        accountId: txInitiateData.accountId,
        amount: revertAmount(txInitiateData.amount, 'HUNDREDTH_CENT'),
        unit: 'HUNDREDTH_CENT',
        currency: txInitiateData.currency,
        transactionType: 'USER_SAVING_EVENT',
      },
      reasonText: txInitiateData.reasonText
    };

    if (txInitiateData.isWithdrawal) {
      submissionBody.initiateWithdrawal = true;
    }

    if (txInitiateData.bankAccNumber && txInitiateData.bankAccNumber.trim().length > 0) {
      const bankAccountDetails = {
        bankName: txInitiateData.bankAccBank,
        accountType: txInitiateData.bankAccType,
        accountNumber: txInitiateData.bankAccNumber,
      };

      submissionBody.transactionParameters.bankAccountDetails = bankAccountDetails;
    }

    this.submitUserChange(submissionBody);
  }
  
}

export default UserTransactions;
