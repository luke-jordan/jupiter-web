import React from 'react';

import { capitalize } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'components/spinner/Spinner';
import BoostForm from '../boostForm/BoostForm';

import './BoostEdit.scss';

class BoostEdit extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      mode: props.match.params.mode,
      formData: {
        label: '',
        type: 'SIMPLE',
        category: 'TIME_LIMITED',
        action: 'END_OF_DAY',
        audience: 'whole_universe',
        sampleSize: 0,
        requiredSave: 10,
        perUserAmount: 100,
        totalBudget: 1000,
        source: 'primary_bonus_pool',
        pushTitle: '',
        pushBody: '',
        cardTitle: '',
        cardBody: ''
      }
    };
  }

  render() {
    const state = this.state;
    const title = capitalize(`${this.state.mode} boost`);
    
    return <div className="boost-edit">
      <PageBreadcrumb title={title} link={{ to: '/boosts', text: 'Boosts' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        <BoostForm formData={state.formData} mode={state.mode}
          onChange={this.formInputChange} onSubmit={this.formSubmit}/>
      </div>
    </div>;
  }

  formInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  formSubmit = event => {
    event.preventDefault();
  }
}

export default BoostEdit;