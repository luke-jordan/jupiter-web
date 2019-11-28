import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import TagList from 'src/components/tagList/TagList';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import Spinner from 'src/components/spinner/Spinner';
import FloatReferralCodeEdit from './FloatReferralCodeEdit';

import './FloatReferralCodesTable.scss';

class FloatReferralCodesTable extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      edit: null
    };

    unmountDecorator(this);
  }

  render() {
    const state = this.state;
    return <div className="float-referral-codes-table">
      {this.renderHeader()}
      {this.renderTable()}
      {state.edit && <FloatReferralCodeEdit {...state.edit} onCancel={this.closeEdit} onSubmit={this.submit}/>}
      {state.loading && <Spinner overlay/>}
    </div>;
  }

  renderHeader() {
    return <div className="section-header">
      <div className="header-text">Active Referral Codes</div>
      <div className="header-actions">
        <div className="button button-small button-outline"
          onClick={() => this.openEdit('new')}>Add new code</div>
      </div>
    </div>
  }

  renderTable() {
    const referralCodes = this.props.float.referralCodes || [{
      referralCode: 'code',
      codeType: 'type',
      amount: 0,
      bonusSource: 'source',
      tags: ['tag1', 'tag2']
    }];

    const rows = referralCodes.map((item, index) => {
      return <tr key={index}>
        <td>{item.referralCode}</td>
        <td>{item.codeType}</td>
        <td>{item.amount}</td>
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
          <th style={{width: 150}}>Type</th>
          <th style={{width: 100}}>Amount</th>
          <th style={{width: 130}}>Bonus source</th>
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

  submit = (mode, data) => {
    const float = this.props.float;

    const body = {
      clientId: float.clientId,
      floatId: float.floatId,
      referralCode: data.referralCode,
      codeType: data.codeType,
      amount: data.amount,
      bonusSource: data.bonusSource,
      tags: data.tags.split(',').map(t => t.replace(/\s/g, '')).filter(t => t)
    };

    const obs = mode === 'edit' ? this.clientsService.updateRefCode(body) :
      this.clientsService.createRefCode(body);

    this.setState({ loading: true, edit: null });

    obs.pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.props.onSaved();
      this.setState({ loading: false });
    }, () => {
      this.modalService.openCommonError();
      this.setState({ loading: false });
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
    ).subscribe(() => {
      this.props.onSaved();
      this.setState({ loading: false });
    }, () => {
      this.modalService.openCommonError();
      this.setState({ loading: false });
    });
  }
}

export default FloatReferralCodesTable;