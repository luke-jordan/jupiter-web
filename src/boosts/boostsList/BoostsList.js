import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { takeUntil } from 'rxjs/operators';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'components/spinner/Spinner';
import Checkbox from 'components/checkbox/Checkbox';
import { unmountDecorator, inject } from 'utils';

import './BoostsList.scss';
import addIcon from 'assets/images/add.svg';

class BoostsList extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      boosts: [],
      checkedBoosts: [],
      checkAll: false
    };

    this.boostsService = inject('BoostsService');

    unmountDecorator(this);
  }

  componentDidMount() {
    this.boostsService.getBoosts().pipe(
      takeUntil(this.unmount)
    ).subscribe(boosts => {
      this.setState({ boosts, loading: false });
    });
  }

  render() {
    const state = this.state;
    return <div className="boosts-list">
      <PageBreadcrumb title="Boosts" link={{ to: '/', text: 'Home' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        {this.renderActions()}
        {this.renderTable()}
      </div>
    </div>;
  }

  renderActions() {
    const { checkedBoosts } = this.state;
    return <div className="page-actions">
      <div className="action-buttons">
        <div></div>
        <NavLink to="/boosts/new" className="button">
          New boost <img className="button-icon" src={addIcon} alt="add"/>
        </NavLink>
      </div>
      <div className="quick-actions">
        Quick Actions:&nbsp;
        <span className={classNames('link', { inactive: !checkedBoosts.length })}
          onClick={this.deactivateCheckedBoosts}>Deactivate</span>
      </div>
    </div>;
  }

  renderTable() {
    const state = this.state;
    return <table className="table">
      <thead>
        <tr>
          <th className="text-center" style={{ width: 40 }}>
            <Checkbox checked={state.checkAll} onChange={this.checkAllBoosts}
              disabled={!state.boosts.length}/>
          </th>
          <th style={{ width: 100 }}>Type</th>
          <th style={{ width: 150 }}>Category</th>
          <th>Name</th>
          <th className="text-center" style={{ width: 100 }}>Start date</th>
          <th className="text-center" style={{ width: 100 }}>End date</th>
          <th className="text-center" style={{ width: 80 }}># Users</th>
          <th className="text-center" style={{ width: 100 }}>Budget</th>
          <th className="text-center" style={{ width: 100 }}>Remaining</th>
          <th style={{ width: 40 }}/>
        </tr>
      </thead>
      <tbody>
        {state.boosts.length ?
          state.boosts.map(boost => this.renderTableRow(boost)) :
          <tr><td className="no-data" colSpan="10">No boosts</td></tr>}
      </tbody>
    </table>;
  }

  renderTableRow(boost) {
    const checked = this.state.checkedBoosts.includes(boost.boostId);
    return <tr key={boost.boostId}>
      <td style={{ textAlign: 'center' }}>
        <Checkbox checked={checked} onChange={event => this.checkBoost(event, boost)}/>
      </td>
      <td>{boost.boostTypeText}</td>
      <td>{boost.boostCategoryText}</td>
      <td>?</td>
      <td className="text-center">{boost.formattedStartDate}</td>
      <td className="text-center">{boost.formattedEndDate}</td>
      <td className="text-center">?</td>
      <td className="text-center">{boost.boostBudgetMoney}</td>
      <td className="text-center">{boost.boostRedeemedMoney}</td>
      <td>
        {/* <DropdownMenu items={[
          { text: 'View', link: `/boosts/view/${boost.boostId}` },
          { text: 'Edit', link: `/boosts/edit/${boost.boostId}` },
          { text: 'Duplicate', link: `/boosts/duplicate/${boost.boostId}` },
          { text: 'Deactivate', click: () => this.deactivateBoosts([boost.boostId]) }
        ]}/> */}
      </td>
    </tr>;
  }

  checkBoost(event, boost) {
    const { checkedBoosts } = this.state;
    this.setState({
      checkedBoosts: event.target.checked ?
        [...checkedBoosts, boost.boostId] :
        checkedBoosts.filter(id => id !== boost.boostId)
    });
  }

  checkAllBoosts = event => {
    const checked = event.target.checked;
    this.setState({
      checkAll: checked,
      checkedBoosts: checked ? this.state.boosts.map(m => m.boostId): []
    });
  }

  deactivateCheckedBoosts = () => {
    const ids = this.state.checkedBoosts;
    if (ids.length) {
      this.deactivateBoosts(ids);
    }
  }

  deactivateBoosts(ids) {
    console.log(`Deactivate`, ids);
  }
}

export default BoostsList;