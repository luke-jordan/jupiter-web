import React from 'react';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';

import { capitalize, inject, unmountDecorator } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'components/spinner/Spinner';
import BoostForm from '../boostForm/BoostForm';

import './BoostEdit.scss';

class BoostEdit extends React.Component {
  constructor(props) {
    super();
    this.boostsService = inject('BoostsService');
    this.historyService = inject('HistoryService');

    this.state = {
      loading: false,
      mode: props.match.params.mode,
      formData: {
        label: '',
        type: 'SIMPLE',
        category: 'TIME_LIMITED',
        expiryTime: 'END_OF_DAY',
        audience: 'whole_universe',
        sampleSize: 0,
        requiredSave: 10,
        perUserAmount: 100,
        totalBudget: 1000,
        source: 'primary_bonus_pool',
        pushTitle: '',
        pushBody: '',
        cardTitle: '',
        cardBody: '',
        currency: 'ZAR'
      }
    };

    unmountDecorator(this);
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

    const mode = this.state.mode;

    if (mode === 'view') {
      this.setState({ mode: 'edit' });
      return;
    }

    const body = this.formDataToRequestBody();
    let obs;

    if (mode === 'edit') {
      const id = this.props.match.params.id;
      obs = this.boostsService.updateBoost(id, body);
    } else {
      // new or duplicate
      obs = this.boostsService.createBoost(body);
    }

    this.setState({ loading: true });

    obs.pipe(
      takeUntil(this.unmount$)
    ).subscribe(() => {
      this.setState({ loading: false });
      this.historyService.push('/boosts');
    }, err => {
      console.error(err);
    });
  }

  formDataToRequestBody() {
    const state = this.state;
    const data = state.formData;
    const body = {};

    // type & category
    body.boostTypeCategory = `${data.type}::${data.category}`;
    
    // amount per user, 
    body.boostAmountOffered = `${data.perUserAmount}::WHOLE_CURRENCY::${data.currency}`;

    // source
    body.boostSource = { bonusPoolId: data.source, clientId: 'za_client_co', floatId: 'zar_mmkt_float' };

    // required save
    const redemptionThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
    const redemptionCondition = `save_event_greater_than #{${redemptionThreshold}}`;
    body.statusConditions = { REDEEMED: [redemptionCondition] };

    // audience
    let selectionMethod = data.audience;
    if (data.audience === 'random_sample') {
      selectionMethod = `${data.audience} #{${data.sampleSize / 100}}`;
    }
    body.boostAudience = 'GENERAL';
    body.boostAudienceSelection = `${selectionMethod} from #{{"client_id":"za_client_co"}}`;

    // total budget
    body.boostBudget = `${data.totalBudget}::WHOLE_CURRENCY::${data.currency}`;

    // expiry time
    if (data.expiryTime === 'END_OF_DAY') {
      body.endTimeMillis = +moment().endOf('day');
    } else if (data.expiryTime === 'END_OF_TOMORROW') {
      body.endTimeMillis = +moment().add(1, 'day').endOf('day');
    } else if (data.expiryTime === 'END_OF_WEEK') {
      body.endTimeMillis = +moment().endOf('week');
    } else {
      console.error('Unkown end time selection');
    }

    // push notification
    const pushNotification = {
      boostStatus: 'CREATED',
      presentationType: 'ONCE_OFF',
      actionToTake: 'ADD_CASH',
      isMessageSequence: false,
      template: {
        title: data.pushTitle, body: data.pushBody,
        display: { type: 'PUSH' }
      }
    };

    // card
    const card = {
      boostStatus: 'OFFERED',
      presentationType: 'ONCE_OFF',
      actionToTake: 'ADD_CASH',
      isMessageSequence: false,
      template: {
        title: data.cardTitle, body: data.cardBody,
        display: { type: 'CARD' }, actionToTake: 'ADD_CASH'
      }
    };

    body.messagesToCreate = [pushNotification, card];

    return body;
  }
}

export default BoostEdit;