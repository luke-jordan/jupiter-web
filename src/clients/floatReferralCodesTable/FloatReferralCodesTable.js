import React from 'react';
import classNames from 'classnames';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator, extractWholeAmount } from 'src/core/utils';
import TagList from 'src/components/tagList/TagList';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import Spinner from 'src/components/spinner/Spinner';
import Input from 'src/components/input/Input';

import FloatReferralCodeEdit from './FloatReferralCodeEdit';

import './FloatReferralCodesTable.scss';

class FloatReferralCodesTable extends React.Component {
  userReferralConfigItems = [{
    name: 'boostAmount',
    title: 'Amount of referral boost',
    unit: ' ZAR'
  }, {
    name: 'minimumBalance',
    title: 'Minimum balance to claim',
    unit: ' ZAR'
  }, {
    name: 'daysToMaintain',
    title: 'Days balance must be maintained',
    unit: ' days'
  }];

  constructor(props) {
    super(props);

    this.clientsService = inject('ClientsService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      edit: null,

      editUserCodeParams: false,
      userCodeData: this.getReferralCodeData(props.float)
    };

    unmountDecorator(this);
  }

  getReferralCodeData(float) {
    console.log('FLOAT: ', float);
    const { userReferralDefaults } = float;

    return {
      boostAmount: extractWholeAmount(userReferralDefaults.boostAmountOffered),
      minimumBalance: extractWholeAmount(userReferralDefaults.redeemConditionAmount),
      daysToMaintain: userReferralDefaults.daysToMaintain || 0
    }
  }

  render() {
    const { props, state } = this;
    return (
      <>
        <div className="float-referral-codes-table">
          {this.renderUserHeader()}
          {this.renderUserParameters()}
          {state.loading && <Spinner overlay/>}
        </div>
        <div className="float-referral-codes-table">
          {this.renderNonUserCodeHeader()}
          {this.renderNonUserCodeTable()}
          {state.edit && <FloatReferralCodeEdit {...state.edit} float={props.float}
            onCancel={this.closeEdit} onSubmit={this.submit}/>}
          {state.loading && <Spinner overlay/>}
        </div>
      </>
    );
  }

  renderUserHeader() {
    return <div className="section-header">
      <div className="header-text">User Referral Code Parameters</div>
      <div className="header-actions">
        {this.state.editUserCodeParams ?
          <>
            <button className="button button-outline button-small" onClick={this.submitUserParams}>
              Save
            </button>
            <button className="link text-underline" onClick={this.toggleEditUserCodeParams}>Cancel</button>
          </> :        
          <div className="button button-small button-outline" onClick={this.toggleEditUserCodeParams}>Edit</div>
        }
      </div>
    </div>
  }

  renderUserParameters() {
    const data = this.state.userCodeData;

    const rows = this.userReferralConfigItems.map(item => {
      return <tr key={item.name}>
        <td>{item.title}</td>
        <td style={{ width: 100 }}>
          {this.state.editUserCodeParams ?
            <><Input type="number" name={item.name}
                value={data[item.name]} onChange={this.userParameterChange}/> {item.unit}</> :
            `${data[item.name]}${item.unit}`}
        </td>
      </tr>;
    });

    const className = classNames('table', { edit: this.state.editUserCodeParams });

    return <table className={className}>
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 200}}>Value</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>;
  }

  renderNonUserCodeHeader() {
    return <div className="section-header">
      <div className="header-text">Active Referral Codes</div>
      <div className="header-actions">
        <div className="button button-small button-outline"
          onClick={() => this.openEdit('new')}>Add new code</div>
      </div>
    </div>
  }

  renderNonUserCodeTable() {
    const referralCodes = this.props.float.referralCodes;

    const rows = referralCodes.map((item, index) => {
      return <tr key={index}>
        <td>{item.referralCode}</td>
        <td>{item.codeTypeText}</td>
        <td>{item.bonusAmount.amountMoney}</td>
        <td>{item.bonusSource}</td>
        <td><TagList tags={item.tags}/></td>
        <td>
          <DropdownMenu items={[
            { text: 'Edit', click: () => this.openEdit('edit', item) },
            { text: 'Duplicate', click: () => this.openEdit('duplicate', item) },
            { text: 'Deactivate', click: () => this.deactivateClick(item) }
          ]}/>
        </td>
      </tr>
    });

    return <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 175}}>Type</th>
          <th style={{width: 100}}>Amount</th>
          <th style={{width: 200}}>Bonus source</th>
          <th style={{width: 400}}>Tags</th>
          <th style={{width: 40}}></th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows :
          <tr><td colSpan="6" className="no-data">There are currently no active referral codes</td></tr>}
      </tbody>
    </table>;
  }

  openEdit = (mode, data) => {
    this.setState({
      edit: { mode, data }
    });
  }

  closeEdit = () => {
    this.setState({ edit: null });
  }

  toggleEditUserCodeParams = () => {
    this.setState({ editUserCodeParams: !this.state.editUserCodeParams });
  }

  userParameterChange = event => {
    const { name, value } = event.target;
    const userCodeData = { ...this.state.userCodeData, [name]: value };
    this.setState({ userCodeData });
  }

  showError() {
    this.modalService.openCommonError();
    this.setState({ loading: false });  
  }

  submitUserParams = () => {
    if (this.state.loading) {
      return;
    }

    const { userCodeData } = this.state;
    const { float } = this.props;

    const body = {
      clientId: float.clientId,
      floatId: float.floatId,
      userReferralCodeDefaults: {
        boostAmountOffered: { amount: userCodeData.boostAmount, unit: 'WHOLE_CURRENCY', currency: float.currency },
        redeemConditionAmount: { amount: userCodeData.minimumBalance, unit: 'WHOLE_CURRENCY', currency: float.currency },
        redeemConditionType: 'TARGET_BALANCE',
        daysToMaintain: parseInt(userCodeData.daysToMaintain, 10)
      }
    };

    this.setState({ loading: true });
    
    this.clientsService.updateUserRefParams(body)
      .pipe(takeUntil(this.unmount))
      .subscribe(res => {
        const { result } = res;
        if (result === 'SUCCESS') {
          this.modalService.openInfo('Done', 'The referral code parameters have been updated');
          this.setState({ loading: false });
        } else {
          this.showError();
        }
      }, () => this.showError());
  }

  submit = (mode, data) => {
    const float = this.props.float;

    const body = {
      clientId: float.clientId,
      floatId: float.floatId,
      referralCode: data.referralCode,
      codeType: data.codeType,
      bonusAmount: {
        amount: data.bonusAmount,
        unit: 'WHOLE_CURRENCY',
        currency: float.currency
      },
      bonusSource: data.bonusSource,
      tags: data.tags.split(',').map(t => t.replace(/\s/g, '')).filter(t => t)
    };

    const obs = mode === 'edit' ? this.clientsService.updateRefCode(body) :
      this.clientsService.createRefCode(body);

    this.setState({ loading: true, edit: null });

    obs.pipe(
      takeUntil(this.unmount)
    ).subscribe(res => {
      let referralCodes;

      if (res.updatedCodes) {
        referralCodes = res.updatedCodes;
      } else if (res.updatedCode) {
        referralCodes = this.props.float.referralCodes.slice();
        const index = referralCodes.findIndex(code => code.referralCode === res.updatedCode.referralCode);
        if (index !== -1) {
          referralCodes[index] = res.updatedCode;
        }
      }

      this.props.onChanged(referralCodes);
      
      this.setState({ loading: false });
    }, () => {
      this.showError();
    });
  }

  deactivateClick(item) {
    this.setState({ loading: true });

    const float = this.props.float;
    this.clientsService.deactivateRefCode({
      floatId: float.floatId,
      clientId: float.clientId,
      referralCode: item.referralCode
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(res => {
      this.props.onChanged(res.updatedCodes);
      this.setState({ loading: false });
    }, () => {
      this.modalService.openCommonError();
      this.setState({ loading: false });
    });
  }
}

export default FloatReferralCodesTable;