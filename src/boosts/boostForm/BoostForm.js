import React from 'react';
import moment from 'moment';

import { inject } from 'src/core/utils';
import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import TextArea from 'src/components/textArea/TextArea';
import DatePicker from 'src/components/datePicker/DatePicker';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';

import './BoostForm.scss';

class BoostForm extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');

    this.state = {
      data: this.boostToFormData(props)
    };
  }

  isView() {
    return this.props.mode === 'view';
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.boost !== prevProps.boost ||
      this.props.clients !== prevProps.clients
    ) {
      this.setState({
        data: this.boostToFormData(this.props)
      });
    }
  }

  render() {
    return <form className="boost-form" onSubmit={this.submit}>
      {this.renderDetails()}
      {this.renderConditions()}
      {this.renderPushAndCardDetails()}
      {this.renderAudienceSelection()}
      {!this.isView() && <div className="text-right">
        <button className="button">Submit</button>
      </div>}
    </form>;
  }

  renderDetails() {
    const { state, props } = this;
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
      <div className="grid-row">
        {/* Client ID */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Client ID</div>
            <Select name="clientId" value={state.data.clientId}
              onChange={this.inputChange} disabled={this.isView()}>
              {props.clients.map(client => 
                <option key={client.clientId} value={client.clientId}>{client.clientName}</option>)}
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
            <DatePicker selected={state.data.endTime} disabled={this.isView()}
              showTimeSelect={true}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              onChange={value => this.inputChange({ target: { name: 'endTime', value } })} />
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
            <TextArea name="pushBody" rows="3" placeholder="Enter body" disabled={this.isView()}
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
            <TextArea name="cardBody" rows="3" placeholder="Enter body" disabled={this.isView()}
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
      <AudienceSelection headerText="Who is Eligible?"
        clientId={this.state.data.clientId}
        ref={ref => this.audienceRef = ref}/> : null;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  submit = event => {
    event.preventDefault();

    if (!this.validate()) {
      return;
    }

    this.props.onSubmit(this.getBoostReqBody(), this.getAudienceReqBody());
  }

  boostToFormData(props) {
    const { boost, clients } = props;

    if (!boost) {
      return {
        label: '',
        type: 'SIMPLE',
        category: 'TIME_LIMITED',
        clientId: clients[0] ? clients[0].clientId : '',
        endTime: moment().endOf('day').toDate(),
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
      label: boost.label,
      type: boost.boostType,
      category: boost.boostCategory,
      clientId: boost.forClientId,
      endTime: new Date(boost.endTime),
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

  getBoostReqBody() {
    const data = this.state.data;
    const body = {};

    // label
    body.label = data.label;

    // type & category
    body.boostTypeCategory = `${data.type}::${data.category}`;

    // client id
    body.forClientId = data.clientId;
    
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
    body.endTimeMillis = data.endTime ? data.endTime.getTime() : +moment().endOf('day');

    const messagesToCreate = [];
    // push notification
    if (data.pushBody) {
      messagesToCreate.push({
        boostStatus: 'CREATED',
        presentationType: 'ONCE_OFF',
        actionToTake: 'ADD_CASH',
        isMessageSequence: false,
        template: {
          title: data.pushTitle, body: data.pushBody,
          display: { type: 'PUSH' }
        }
      });
    }

    // card
    if (data.cardBody) {
      messagesToCreate.push({
        boostStatus: 'OFFERED',
        presentationType: 'ONCE_OFF',
        actionToTake: 'ADD_CASH',
        isMessageSequence: false,
        template: {
          display: { type: 'CARD' }, 
          title: data.cardTitle, 
          body: data.cardBody,
          actionToTake: 'ADD_CASH',
          actionContext: {
            addCashPreFilled: redemptionThreshold
          }
        }
      });
    }

    body.messagesToCreate = messagesToCreate;

    return body;
  }

  getAudienceReqBody() {
    return this.audienceRef ? this.audienceRef.getReqBody() : null;
  }

  validate() {
    const data = this.state.data;
    const pushFilled = data.pushTitle.trim() && data.pushBody.trim();
    const cardFilled = data.cardTitle.trim() && data.cardBody.trim();

    if (!pushFilled && !cardFilled) {
      this.modalService.openInfo('Boost create', 'Please fill in <b>Push notification</b> or <b>Card details</b>');
      return false;
    }

    
    if (this.audienceRef && !this.audienceRef.isValid()) {
      this.audienceRef.showInvalidMessage();
      return false;
    }

    return true;
  }
}

export default BoostForm;