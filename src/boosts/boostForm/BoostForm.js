import React from 'react';
import moment from 'moment';

import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import TextArea from 'src/components/textArea/TextArea';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';

import './BoostForm.scss';

class BoostForm extends React.Component {
  submitButtonText = {
    new: 'Submit',
    view: 'Edit',
    edit: 'Update',
    duplicate: 'Submit'
  };

  constructor(props) {
    super();

    this.state = {
      data: this.getBoostFormData(props.boost),
      audienceCondition: { op: 'and', children: [] }
    };
  }

  isView() {
    return this.props.mode === 'view';
  }

  componentDidUpdate(prevProps) {
    if (this.props.boost !== prevProps.boost) {
      this.setState({
        data: this.getBoostFormData(this.props.boost)
      });
    }
  }

  render() {
    return <form className="boost-form" onSubmit={this.submit}>
      {this.renderDetails()}
      {this.renderConditions()}
      {this.renderPushAndCardDetails()}
      {this.renderAudienceSelection()}
      <div className="text-right">
        <button className="button">{this.submitButtonText[this.props.mode]}</button>
      </div>
    </form>;
  }

  renderDetails() {
    const state = this.state;
    return <>
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">Details</div>
      </div>
      <div className="grid-row">
        {/* Label */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Label</div>
            <Input name="label" placeholder="Enter label" disabled={this.isView()}
              value={state.data.label} onChange={this.inputChange}/>
          </div>
        </div>
        {/* Type */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Type</div>
            <Select name="type" value={state.data.type}
              onChange={this.inputChange} disabled={this.isView()}>
              <option value="SIMPLE">Simple (e.g., time limited)</option>
              <option value="GAME">Game</option>
            </Select>
          </div>
        </div>
        {/* Category */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Category</div>
            <Select name="category" value={state.data.category}
              onChange={this.inputChange} disabled={this.isView()}>
              <option value="TIME_LIMITED">Time limited</option>
            </Select>
          </div>
        </div>
      </div>
    </>;
  }

  renderConditions() {
    const state = this.state;
    return <>
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Conditions</div>
      </div>
      <div className="grid-row">
        {/* Expiry time */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">When does it expire?</div>
            <Select name="expiryTime" value={state.data.expiryTime}
              onChange={this.inputChange} disabled={this.isView()}>
              <option value="END_OF_DAY">End of today</option>
              <option value="END_OF_TOMORROW">End tomorrow</option>
              <option value="END_OF_WEEK">End week</option>
            </Select>
          </div>
        </div>
        {/* Total budget */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">What is the total budget?</div>
            <Input name="totalBudget" type="number" value={state.data.totalBudget}
              onChange={this.inputChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Bonus pool */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">What bonus pool is it from?</div>
            <Select name="source" value={state.data.source}
              onChange={this.inputChange} disabled={this.isView()}>
              {this.renderBonusPoolOptions()}
            </Select>
          </div>
        </div>
      </div>
      <div className="grid-row">
        {/* Required save */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much must a user save to get it?</div>
            <Input name="requiredSave" type="number" value={state.data.requiredSave}
              onChange={this.inputChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Per user amount */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much is it worth (per user)?</div>
            <Input name="perUserAmount" type="number" value={state.data.perUserAmount}
              onChange={this.inputChange} disabled={this.isView()}/>
          </div>
        </div>
      </div>
    </>;
  }

  renderPushAndCardDetails() {
    const state = this.state;
    return <>
      <div className="form-section">
        <div className="section-num">3</div>
        <div className="section-text">Push notification &amp; Card details</div>
      </div>
      <div className="grid-row">
        {/* Notification title & body */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Notification title</div>
            <Input name="pushTitle" placeholder="Enter title" disabled={this.isView()}
              value={state.data.pushTitle} onChange={this.inputChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Notification body</div>
            <TextArea name="pushBody" rows="3" disabled={this.isView()}
              value={state.data.pushBody} onChange={this.inputChange}/>
          </div>
        </div>
        {/* Card title & body */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Card title</div>
            <Input name="cardTitle" placeholder="Enter title" disabled={this.isView()}
              value={state.data.cardTitle} onChange={this.inputChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Card body</div>
            <TextArea name="cardBody" rows="3" disabled={this.isView()}
              value={state.data.cardBody} onChange={this.inputChange}/>
          </div>
        </div>
      </div>
    </>;
  }

  renderBonusPoolOptions() {
    const client = this.props.clients[0];
    if (!client) {
      return null;
    }

    return client.floats.map(float => {
      return <optgroup label={`${float.floatName}`} key={float.floatId}>
        {float.bonusPoolIds.map(id => <option key={id} value={id}>{id}</option>)}
      </optgroup>;
    });
  }

  renderAudienceSelection() {
    return /(new|duplicate)/.test(this.props.mode) ?
      <AudienceSelection client={this.props.clients[0]} ref={ref => this.audienceRef = ref}/> : null;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  submit = event => {
    event.preventDefault();
    this.props.onSubmit(this.getBoostReqData(), this.getAudienceReqData());
  }

  getBoostFormData(boost) {
    if (!boost) {
      return {
        label: '',
        type: 'SIMPLE',
        category: 'TIME_LIMITED',
        expiryTime: 'END_OF_DAY',
        totalBudget: 1000,
        source: 'primary_bonus_pool',
        requiredSave: 100,
        perUserAmount: 10,
        pushTitle: '',
        pushBody: '',
        cardTitle: '',
        cardBody: '',
        currency: 'ZAR'
      };
    }

    const requiredSaveMatch = boost.statusConditions.REDEEMED[0].match(/^save_event_greater_than #\{(\d+):/);
    const requiredSave = (requiredSaveMatch && requiredSaveMatch[1]) ? requiredSaveMatch[1] : 100;

    return {
      label: '',
      type: boost.boostType,
      category: boost.boostCategory,
      expiryTime: '',
      totalBudget: boost.boostBudget,
      source: boost.fromBonusPoolId,
      requiredSave,
      perUserAmount: boost.boostAmount,
      pushTitle: '',
      pushBody: '',
      cardTitle: '',
      cardBody: '',
      currency: 'ZAR'
    };
  }

  getBoostReqData() {
    const data = this.state.data;
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

  getAudienceReqData() {
    return this.audienceRef ? this.audienceRef.getRequestData() : null;
  }
}

export default BoostForm;