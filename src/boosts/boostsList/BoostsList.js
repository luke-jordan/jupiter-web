import React from 'react';
import { NavLink } from 'react-router-dom';
import { takeUntil } from 'rxjs/operators';
import classNames from 'classnames';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import Select from 'src/components/select/Select';
import { unmountDecorator, inject } from 'src/core/utils';

import './BoostsList.scss';
import addIcon from 'src/assets/images/add.svg';

class BoostsList extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      filter: 'active',
      boosts: [],
      displayBoosts: []
    };

    this.boostsService = inject('BoostsService');
    this.modalService = inject('ModalService');

    unmountDecorator(this);
  }

  componentDidMount() {
    this.boostsService.getBoosts().pipe(
      takeUntil(this.unmount)
    ).subscribe(boosts => {
      this.setState({
        loading: false,
        boosts,
        displayBoosts: this.getFilteredBoosts(boosts, this.state.filter)
      });
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
    const state = this.state;
    return <div className="page-actions">
      <div className="action-buttons">
        <Select className="boosts-filter" value={state.filter} onChange={this.filterChange}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <NavLink to="/boosts/new" className="button">
          New boost <img className="button-icon" src={addIcon} alt="add"/>
        </NavLink>
      </div>
    </div>;
  }

  renderTable() {
    const displayBoosts = this.state.displayBoosts;
    return <table className="table">
      <thead>
        <tr>
          <th style={{ width: 100 }}>Type</th>
          <th style={{ width: 150 }}>Category</th>
          <th>Label</th>
          <th className="text-center" style={{ width: 100 }}>Start date</th>
          <th className="text-center" style={{ width: 100 }}>End date</th>
          <th className="text-center" style={{ width: 80 }}># Users</th>
          <th className="text-center" style={{ width: 100 }}>Budget</th>
          <th className="text-center" style={{ width: 100 }}>Remaining</th>
          <th style={{ width: 40 }}/>
        </tr>
      </thead>
      <tbody>
        {displayBoosts.length ? displayBoosts.map(boost => this.renderTableRow(boost)) :
          <tr><td className="no-data" colSpan="9">No boosts</td></tr>}
      </tbody>
    </table>;
  }

  renderTableRow(boost) {
    const rowClass = classNames({ expired: boost.expired });
    return <tr key={boost.boostId} className={rowClass}>
      <td>{boost.boostTypeText}</td>
      <td>{boost.boostCategoryText}</td>
      <td>{boost.label}</td>
      <td className="text-center">{boost.formattedStartDate}</td>
      <td className="text-center">{boost.formattedEndDate}</td>
      <td className="text-center">{boost.totalCount}</td>
      <td className="text-center">{boost.boostBudgetMoney}</td>
      <td className="text-center">{boost.boostRemainingMoney}</td>
      <td>
        <DropdownMenu items={[
          { text: 'View', link: `/boosts/view/${boost.boostId}` },
          { text: 'Duplicate', link: `/boosts/duplicate/${boost.boostId}` }
        ]}/>
      </td>
    </tr>;
  }

  filterChange = event => {
    const filter = event.target.value;
    this.setState({ 
      filter,
      displayBoosts: this.getFilteredBoosts(this.state.boosts, filter)
    });
  }

  getFilteredBoosts(boosts, filter) {
    if (filter === 'active') {
      return boosts.filter(b => !b.expired);
    } else if (filter === 'inactive') {
      return boosts.filter(b => b.expired);
    } else {
      return boosts;
    }
  }
}

export default BoostsList;