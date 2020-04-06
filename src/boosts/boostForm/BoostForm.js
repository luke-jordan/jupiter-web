import React from 'react';
import moment from 'moment';

import { inject } from 'src/core/utils';
import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import TextArea from 'src/components/textArea/TextArea';
import DatePicker from 'src/components/datePicker/DatePicker';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';

import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import EventsListModal from 'src/components/eventsModal/EventsModal';

import './BoostForm.scss';

const DEFAULT_CATEGORIES = {
  'SIMPLE': 'TIME_LIMITED',
  'GAME': 'TAP_SCREEN'
};


class BoostForm extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');

    this.state = {
      data: this.boostToFormData(props),
      availableFloats: []
    };

    // note : not extracting a common param component because in message form we have full rich text editor, here not
    // (this may change in future if we restructure this form)
    this.bodyParameters = [
      'user_first_name',
      'user_full_name',
      'current_balance',
      'opened_date',
      'total_interest',
      'last_capitalization',
      'total_earnings',
      'last_saved_amount'
    ];
  }

  isView() {
    return this.props.mode === 'view';
  }

  componentDidUpdate(prevProps) {
    console.log('Passed client list: ', this.props.clients);
    if (
      this.props.boost !== prevProps.boost ||
      this.props.clients !== prevProps.clients
    ) {
      this.setState({
        data: this.boostToFormData(this.props),
        availableFloats: this.getFloatsForSelectedClient(this.props.clients[0].clientId)
      });
    }
  }

  render() {
    return <>
    <form className="boost-form" onSubmit={this.submit}>
      {this.renderDetails()}
      {this.renderConditions()}
      {this.renderPushAndCardDetails()}
      {this.renderAudienceSelection()}
      {!this.isView() && <div className="text-right">
        <button className="button">Submit</button>
      </div>}
    </form>
    <div className="modal-container">
      {this.state.showEventsModal && 
        <EventsListModal showEventsModal={this.state.showEventsModal} onClose={() => this.setState({ showEventsModal: false })}/>}
    </div>
    </>;
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
              onChange={this.onChangeBoostType} disabled={this.isView()}>
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
              {this.state.data.type === 'SIMPLE' && <option value="TIME_LIMITED">Time limited</option>}
              {this.state.data.type === 'GAME' && <option value="TAP_SCREEN">Tap the screen</option>}
              {this.state.data.type === 'GAME' && <option value="CHASE_ARROW">Chase the arrow</option>}
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
              onChange={this.onChangeClient} disabled={this.isView()}>
              {props.clients.map(client => 
                <option key={client.clientId} value={client.clientId}>{client.clientName}</option>)}
            </Select>
          </div>
        </div>
        {/* Float ID */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What float is it for?</div>
            <Select name="floatId" value={state.data.floatId}
            onChange={this.inputChange} disabled={this.isView()}>
              {state.availableFloats.map(float => 
                <option key={float.floatId} value={float.floatId}>{float.floatName}</option>)}
            </Select>
          </div>
        </div>
        {/* Bonus pool */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What bonus pool is it from?</div>
            <Select name="source" value={state.data.source}
              onChange={this.inputChange} disabled={this.isView()}>
              {this.renderBonusPoolOptions()}
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
        <div className="grid-col-4">
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
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What is the total budget?</div>
            <Input name="totalBudget" type="number" value={state.data.totalBudget}
              onChange={this.inputChange} disabled={this.isView()}/>
          </div>
        </div>
      </div>
      <div className="grid-row">
        {/* Initial status */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What is its initial state?</div>
            <Select name="initialStatus" value={state.data.initialStatus}
                onChange={this.inputChange} disabled={this.isView() || this.state.data.type !== 'GAME'}>
              <option value="OFFERED">Only offered</option>
              <option value="UNLOCKED">Already unlocked</option>
            </Select>
          </div>
        </div>
        {/* Required save */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much must a user save to get it?</div>
            <Input name="requiredSave" type="number" value={state.data.requiredSave} onChange={this.inputChange} 
              disabled={this.isView() || (this.state.data.type === 'GAME' && this.state.data.initialStatus === 'UNLOCKED')}/>
          </div>
        </div>
        {/* Per user amount */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much is it worth (per user)?</div>
            <Input name="perUserAmount" type="number" value={state.data.perUserAmount} onChange={this.inputChange} 
              disabled={this.isView() || (this.state.data.type === 'GAME' && this.state.data.initialStatus === 'UNLOCKED')}/>
          </div>
        </div>
      </div>
      {/* Game params */}
      {this.state.data.type === 'GAME' && this.renderGameOptions()}
      {/* Start time/conditions */}
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">When will it be offered?</div>
            <Select name="offeredCondition" value={state.data.offeredCondition} onChange={this.inputChange} disabled={this.isView()}>
              <option value="IMMEDIATE">Now</option>
              <option value="EVENT">On an event</option>
            </Select>
          </div>
        </div>
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What event creates the boost?</div>
            <Input name="offerEvent" value={state.data.offerEvent} onChange={this.inputChange}
              disabled={state.data.offeredCondition !== 'EVENT'}></Input>
            <button className="link text-underline" onClick={this.showEventsModal}>Available Events</button>
          </div>
        </div>
      </div>
    </>;
  }

  showEventsModal = event => {
    event.preventDefault();
    this.setState({ showEventsModal: true });
  }

  renderGameOptions() {
    const { state } = this;
    return (
      <>
        <div className="grid-row">
          <div className="grid-col-6">
            <div className="form-group">
              <div className="form-label">What is the game time limit? (seconds)</div>
              <Input name="timeLimitSeconds" type="number" value={state.data.timeLimitSeconds}
                onChange={this.inputChange} disabled={this.isView()}/>
            </div>
          </div>
          <div className="grid-col-6">
            <div className="form-group">
              <div className="form-label">How does someone win?</div>
                <Select name="thresholdType" value={state.data.thresholdType} onChange={this.inputChange} disabled={this.isView()}>
                  <option value="THRESHOLD">More than X taps</option>
                  <option value="TOURNAMENT">Top X scores</option>
                </Select>
              </div>
            </div>
        </div>
        <div className="grid-row">
          <div className="grid-col-6">
            <div className="form-group">
              <div className="form-label">
                {state.data.thresholdType === 'TOURNAMENT' ? 'How many users will win?' : 'How many successful taps win the game?'}
              </div>
              <Input name="winningThreshold" type="number" value={state.data.winningThreshold}
                onChange={this.inputChange} disabled={this.isView()}/>
            </div>
          </div>
          <div className="grid-col-6">
            <div className="form-group">
              <div className="form-label">How much should the arrow speed up?</div>
              <Select name="arrowSpeed" value={state.data.arrowSpeedMultiplier}
                onChange={this.inputChange} disabled={this.isView() || this.state.data.category !== 'CHASE_ARROW'}>
                <option value="3">3x</option>
                <option value="5">5x</option>
                <option value="7">7x</option>
                <option value="10">10x</option>
              </Select>
            </div>
          </div>
        </div>
      </>
    )
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
            <div className="form-label">
              Card body
              {!this.isView() && <DropdownMenu className="insert-parameter"
                items={this.bodyParameters.map(param => ({ text: param, click: () => this.insertParameter(param) }))}
                trigger={<span className="link text-underline">Insert parameter</span>}/>}
            </div>
            <TextArea name="cardBody" rows="3" placeholder="Enter body" disabled={this.isView()}
              value={state.data.cardBody} onChange={this.inputChange}/>
          </div>
        </div>
      </div>
    </>;
  }

  onChangeClient = event => {
    const { value } = event;
    this.inputChange(event);
    this.setState({ availableFloats: this.setFloatsForSelectedClient(value) });
  }

  getFloatsForSelectedClient(clientId) {
    if (!this.props.clients || this.props.clients.length === 0) {
      return [];
    }

    const selectedClient = this.props.clients.find((client) => client.clientId === clientId);
    if (!selectedClient) {  
      return [];
    }

    return selectedClient.floats;
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

  onChangeBoostType = event => {
    const { value } = event.target;
    const defaultCategory = DEFAULT_CATEGORIES[value];
    this.setState({
      data: {
        ...this.state.data,
        type: value,
        category: defaultCategory
      }
    });
  }

  renderAudienceSelection() {
    return /(new|duplicate)/.test(this.props.mode) ?
      <AudienceSelection headerText="Who is Eligible?"
        clientId={this.state.data.clientId}
        ref={ref => this.audienceRef = ref}
        allowEvent={true}
      /> : null;
  }

  insertParameter = param => {
    const textarea = document.querySelector('.boost-form [name="cardBody"]');
    const value = textarea.value;
    const index = textarea.selectionStart;
    const cardBody = `${value.slice(0, index)}#{${param}}${value.slice(index)}`;

    this.setState({
      data: {  ...this.state.data, cardBody }
    }, () => {
      textarea.selectionStart = textarea.selectionEnd = index + param.length + 3;
      textarea.focus();
    });
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
        floatId: clients[0] ? clients[0].floats[0].floatId : '',
        endTime: moment().endOf('day').toDate(),
        totalBudget: 1000,
        source: 'primary_bonus_pool',
        requiredSave: 100,
        perUserAmount: 10,
        pushTitle: '',
        pushBody: '',
        cardTitle: '',
        cardBody: '',
        currency: 'ZAR',
        timeLimitSeconds: '10',
        winningThreshold: '10',
        arrowSpeedMultiplier: '5',
        initialStatus: 'OFFERED'
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
    body.boostSource = { bonusPoolId: data.source, clientId: data.clientId, floatId: 'zar_mmkt_float' };

    // required save
    const addCashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
    const addCashCondition = `save_event_greater_than #{${addCashThreshold}}`;

    // total budget
    body.boostBudget = `${data.totalBudget}::WHOLE_CURRENCY::${data.currency}`;

    // expiry time
    body.endTimeMillis = data.endTime ? data.endTime.getTime() : +moment().endOf('day');

    const isEventTriggered = data.offeredCondition === 'EVENT';
    const statusConditions = {};

    if (isEventTriggered) {
      body.initialStatus = 'UNCREATED';
      statusConditions[data.initialStatus] = [`event_occurs #{${data.offerEvent}}`];
    } else {
      body.initialStatus = data.initialStatus;
    }

    // game paramaters
    if (data.type === 'GAME') {
      const gameParams = {
        gameType: data.category,
        entryCondition: addCashCondition,
        timeLimitSeconds: parseInt(data.timeLimitSeconds, 10),
        arrowSpeedMultiplier: parseInt(data.arrowSpeedMultiplier, 10)
      };

      // todo : could make this more elegant tbh
      if (data.thresholdType === 'TOURNAMENT') {
        gameParams.numberWinners = parseInt(data.winningThreshold, 10);
      } else {
        gameParams.winningThreshold = parseInt(data.winningThreshold, 10);
      }

      body.gameParams = gameParams;
    } else {
      statusConditions.REDEEMED = [addCashCondition];
    }

    // general message params
    const messagesToCreate = [];
    const actionToTake = data.initialStatus === 'UNLOCKED' ? 'VIEW_BOOSTS' : 'ADD_CASH';
    
    const presentationType = isEventTriggered ? 'EVENT_DRIVEN' : 'ONCE_OFF';
    const triggerParameters = isEventTriggered ? { triggerEvent: [data.offerEvent] } : {}; 
    
    // push notification
    if (data.pushBody) {
      messagesToCreate.push({
        boostStatus: 'CREATED',
        presentationType,
        actionToTake,
        isMessageSequence: false,
        template: {
          title: data.pushTitle, body: data.pushBody,
          display: { type: 'PUSH' }
        },
        triggerParameters
      });
    }

    // card
    if (data.cardBody) {
      messagesToCreate.push({
        boostStatus: 'OFFERED',
        presentationType,
        actionToTake: 'ADD_CASH',
        isMessageSequence: false,
        template: {
          display: { type: 'CARD' }, 
          title: data.cardTitle, 
          body: data.cardBody,
          actionToTake,
          actionContext: {
            addCashPreFilled: addCashThreshold
          }
        },
        triggerParameters
      });
    }

    body.messagesToCreate = messagesToCreate;

    body.statusConditions = statusConditions;

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

    if (data.thresholdType === 'TOURNAMENT' && !data.endTime) {
      this.modalService.openInfo('Boost create', 'For tournament games please set an expiry time');
    }

    return true;
  }
}

export default BoostForm;