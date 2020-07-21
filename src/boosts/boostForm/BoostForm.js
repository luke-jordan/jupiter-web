import React from 'react';
import moment from 'moment';

import { inject, convertAmount } from 'src/core/utils';
import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import TextArea from 'src/components/textArea/TextArea';
import DatePicker from 'src/components/datePicker/DatePicker';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';
import TextEditor from 'src/components/textEditor/TextEditor';
import RadioButton from 'src/components/radioButton/RadioButton';

import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import EventsListModal from 'src/components/eventsModal/EventsModal';

import { assembleRequestBasics, assembleStatusConditions, assembleBoostMessages } from './boostHelper.js';

import './BoostForm.scss';

const DEFAULT_CATEGORIES = {
  'SIMPLE': 'SIMPLE_SAVE',
  'GAME': 'TAP_SCREEN',
  'SOCIAL': 'FRIENDS_ADDED',
  'WITHDRAWAL': 'CANCEL_WITHDRAWAL'
};

const saveThresholdDescription = (category) => {
  if (category === 'ROUND_UP') {
    return 'What is the minimum balance?';
  }

  if (category === 'TARGET_BALANCE') {
    return 'What is the target balance?';
  }

  return 'How much must a user save to get it?';
}

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
      'last_saved_amount',
      'next_major_digit',
    ];
  }

  isView() {
    return this.props.mode === 'view';
  }

  componentDidUpdate(prevProps) {
    // console.log('Passed client list: ', this.props.clients);
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

  renderCategoryOptions() {
    return <>
        {this.state.data.type === 'SIMPLE' && <option value="SIMPLE_SAVE">Save X amount</option>}
        {this.state.data.type === 'SIMPLE' && <option value="ROUND_UP">Next balance level</option>}
        {this.state.data.type === 'SIMPLE' && <option value="TARGET_BALANCE">Absolute balance</option>}

        {this.state.data.type === 'GAME' && <option value="TAP_SCREEN">Tap the screen</option>}
        {this.state.data.type === 'GAME' && <option value="CHASE_ARROW">Chase the arrow</option>}
        {this.state.data.type === 'GAME' && <option value="DESTROY_IMAGE">Destroy image</option>}
        
        {this.state.data.type === 'SOCIAL' && <option value="FRIENDS_ADDED">Friends added</option>}
        {this.state.data.type === 'SOCIAL' && <option value="NUMBER_FRIENDS">Total friends (initiated)</option>}

        {this.state.data.type === 'WITHDRAWAL' && <option value="ABORT_WITHDRAWAL">Abort withdrawal</option>}
        {this.state.data.type === 'WITHDRAWAL' && <option value="CANCEL_WITHDRAWAL">Cancel withdrawal</option>}
    </>
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
              <option value="SIMPLE">Simple</option>
              <option value="GAME">Game</option>
              <option value="SOCIAL">Social</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </Select>
          </div>
        </div>
        {/* Category */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Category</div>
            <Select name="category" value={state.data.category} onChange={this.inputChange} disabled={this.isView()}>
              {this.renderCategoryOptions()}
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

  doesNotRequireSaveThreshold() {
    // social saves will have a variant "friends all save" in future, but for now it's simpler
    const noSaveTypes = ['SOCIAL', 'WITHDRAWAL'];
    return noSaveTypes.includes(this.state.data.type) || (this.state.data.type === 'GAME' && this.state.data.initialStatus === 'UNLOCKED');
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
        {/* Per user amount */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much is it worth (per user)?</div>
            <Input name="perUserAmount" type="number" value={state.data.perUserAmount} onChange={this.inputChange} 
              disabled={this.isView()}/>
          </div>
        </div>
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Is the amount random?</div>
              <RadioButton value="yes" name="isRandomAmount" checked={state.data.isRandomAmount} onChange={this.radioChange}>
                Yes</RadioButton>
              <RadioButton value="no" name="isRandomAmount" checked={!state.data.isRandomAmount} onChange={this.radioChange}>
                No</RadioButton>
          </div>
        </div>
        {state.data.isRandomAmount && <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What is the minimum amount?</div>
            <Input name="randomMinimum" type="number" value={state.data.randomMinimum} onChange={this.inputChange} 
              disabled={this.isView()}/>
          </div>
        </div>}
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

        {state.data.type === 'GAME' && <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">What kind of save unlocks it?</div>
            <Select name="typeOfSaveUnlock" value={state.data.typeOfSaveUnlock}
              onChange={this.inputChange} disable={this.isView() || this.state.data.type !== 'GAME'}>
                <option value="SIMPLE">User saves X</option>
                <option value="TARGET_BALANCE">User crosses X</option>
                <option value="ROUND_UP">User rounds up</option>
            </Select>
          </div>
        </div>}

        {/* Required save or target balance*/}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">
              {saveThresholdDescription(state.data.type === 'SIMPLE' ? state.data.category : state.data.saveTypeToUnlock)}
            </div>
            <Input name="requiredSave" type="number" value={state.data.requiredSave} onChange={this.inputChange} 
              disabled={this.isView() || this.doesNotRequireSaveThreshold()}/>
          </div>
        </div>
      </div>
      
      {/* Game params */}
      {this.state.data.type === 'GAME' && this.renderGameOptions()}
      {/* Social params */}
      {this.state.data.type === 'SOCIAL' && this.renderSocialOptions()}
      {/* Withdrawal params */}
      {this.state.data.type === 'WITHDRAWAL' && this.renderWithdrawalOptions()}
      {/* Start time/conditions, not relevant if withdrawal */}
      {this.state.data.type !== 'WITHDRAWAL' && (
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-group">
              <div className="form-label">When will it be offered?</div>
              <Select name="offeredCondition" value={state.data.offeredCondition} onChange={this.inputChange} disabled={this.isView()}>
                <option value="IMMEDIATE">Now</option>
                <option value="EVENT">On an event</option>
                <option value="ML_DETERMINED">When our robot overlord decides to</option>
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
      )}
      {this.state.data.offeredCondition === 'ML_DETERMINED' && this.renderMlOptions()}
    </>;
  }

  showEventsModal = event => {
    event.preventDefault();
    this.setState({ showEventsModal: true });
  }

  renderMlOptions() {
    const { data } = this.state;
    return (
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-group">
          <div className="form-label">Offer to the same person more than once?</div>
          <Select name="mlOfferMoreThanOnce" type="number" value={data.mlOfferMoreThanOnce}
              onChange={this.inputChange} disabled={this.isView()}>
                {/* checkbox better but that's a pain with elements, and other parts of this are more important */}
                <option value="TRUE">Yes</option> 
                <option value="FALSE">No</option>
            </Select>
          </div>
        </div>
        <div className="grid-col-4">
          <div className="form-group">
          <div className="form-label">Minimum days between an offer?</div>
          <Input name="mlMinDaysBetweenOffer" type="number" value={data.mlMinDaysBetweenOffer}
              onChange={this.inputChange} disabled={this.isView() || data.mlOfferMoreThanOnce === "FALSE"}/>
          </div>
        </div>
      </div>
    );
  }

  renderSocialOptions() {
    const { state } = this;
    return (
      <>
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-group">
            <div className="form-label">How many friends must be added/reached?</div>
              <Input name="friendThreshold" type="number" value={state.data.friendThreshold}
                onChange={this.inputChange} disabled={this.isView()}/>
            </div>
          </div>
          <div className="grid-col-4">
            <div className="form-group">
            <div className="form-label">Must user have initiated?</div>
              <Select name="initiatedRequirement" type="number" value={state.data.initiatedRequirement}
                onChange={this.inputChange} disabled={this.isView()}>
                  <option value="EITHER">Any is fine</option>
                  <option value="INITIATED">User must have initiated</option>
              </Select>
            </div>
          </div>
        </div>
      </>
    )
  }

  renderWithdrawalOptions() {
    const { state } = this;
    return (
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-group">
          <div className="form-label">Where in withdrawal process is it offered?</div>
            <Select name="withdrawalEventAnchor" type="number" value={state.data.withdrawalEventAnchor}
                onChange={this.inputChange} disabled={this.isView()}>
                  <option value="WITHDRAWAL_EVENT_INITIATED">Started flow in app</option>
                  <option value="WITHDRAWAL_EVENT_CONFIRMED">Completed flow in app</option>
            </Select>
          </div>
        </div>
        <div className="grid-col-4">
          <div className="form-group">
          <div className="form-label">For how many days must the user not withdraw?</div>
            <Input name="withdrawalMinDays" type="number" value={state.data.withdrawalMinDays}
              onChange={this.inputChange} disabled={this.isView()}/>
          </div>
        </div>
      </div>
    )
  }

  renderGameOptions() {
    const { state } = this;
    const thresholdDescription = state.data.category === 'DESTROY_IMAGE' 
      ? 'What % of image must be destroyed?' 
      : 'How many successful taps win the game?';
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
                {state.data.thresholdType === 'TOURNAMENT' ? 'How many users will win?' : thresholdDescription}
              </div>
              <Input name="winningThreshold" type="number" value={state.data.winningThreshold}
                onChange={this.inputChange} disabled={this.isView()}/>
            </div>
          </div>
          {state.data.category === 'CHASE_ARROW' && (
            <div className="grid-col-6">
              <div className="form-group">
                <div className="form-label">How much should the arrow speed up?</div>
                <Select name="arrowSpeedMultiplier" value={state.data.arrowSpeedMultiplier}
                  onChange={this.inputChange} disabled={this.isView()}>
                  <option value="3">3x</option>
                  <option value="5">5x</option>
                  <option value="7">7x</option>
                  <option value="10">10x</option>
                </Select>
              </div>
            </div>
          )}
          {state.data.category === 'DESTROY_IMAGE' && (
            <>
              <div className="grid-col-4">
                <div className="form-group">
                  <div className="form-label">How many taps break a block?</div>
                  <Input name="imageBlockTapsToDestroy" type="number" value={state.data.imageBlockTapsToDestroy}
                    onChange={this.inputChange} disabled={this.isView()}/>
                </div>
              </div>
              <div className="grid-col-4">
              <div className="form-group">
                <div className="form-label">What is the image?</div>
                  <Select name="breakingGameImage" value={state.data.breakingGameImage}
                    onChange={this.inputChange} disabled={this.isView()}>
                    <option value="CREDIT_CARD">Credit card</option>
                    <option value="LOAN_SHARK">Loan shark</option>
                  </Select>
                </div>                
              </div>
            </>
          )}
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
        {/* Email title and rich text body editor */}
      <div className="grid-row">
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Email subject</div>
            <Input name="emailSubject" placeholder="Enter subject" disabled={this.isView()}
              value={state.data.emailSubject} onChange={this.inputChange}/>
          </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Email body</div>
              <TextEditor init={{ setup: this.setupBodyEditor }} value={state.data.emailBody} disabled={this.isView()}
                onEditorChange={value => this.inputChange({ target: { name: 'emailBody', value }})}/>
            </div>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Backup SMS (optional)</div>
            <Input name="emailBackupSms" placeholder="" disabled={this.isView()}
              value={state.data.emailBackupSms} onChange={this.inputChange} />
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

  radioChange = event => {
    const target = event.target;
    const value = target.value === 'yes';
    this.setState({
      data: { ...this.state.data, [target.name]: value }
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
        category: 'SIMPLE_SAVE',
        clientId: clients[0] ? clients[0].clientId : '',
        floatId: clients[0] ? clients[0].floats[0].floatId : '',
        endTime: moment().endOf('day').toDate(),
        totalBudget: 1000,
        source: 'primary_bonus_pool',
        
        initialStatus: 'OFFERED',
        typeOfSaveUnlock: 'SIMPLE',
        requiredSave: 100,
        
        perUserAmount: 10,
        isRandomAmount: false,
        randomMinimum: 0,
        
        timeLimitSeconds: '10',
        winningThreshold: '10',
        arrowSpeedMultiplier: '5',
        
        withdrawalEventAnchor: 'WITHDRAWAL_EVENT_CONFIRMED',
        withdrawalMinDays: 30,
        mlOfferMoreThanOnce: 'TRUE',
        mlMinDaysBetweenOffer: 7,

        pushTitle: '',
        pushBody: '',
        cardTitle: '',
        cardBody: '',
        emailSubject: '',
        emailBody: '',
        emailBackupSms: '',
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
      totalBudget: convertAmount(boost.boostBudget, boost.boostUnit),
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

  // large amounts of complexity so most of it sectioned off and handed over to the helper
  getBoostReqBody() {
    const data = this.state.data;
    const isEventTriggered = data.offeredCondition === 'EVENT' || data.type === 'WITHDRAWAL'; // by definition withdrawals are event driven
    const isMlDetermined = data.offeredCondition === 'ML_DETERMINED';

    let body = assembleRequestBasics(data);

    const { statusConditions, initialStatus, gameParams } = assembleStatusConditions(data, isEventTriggered, isMlDetermined);
    body = { ...body, statusConditions, initialStatus };

    if (gameParams) {
      body.gameParams = gameParams;
    }

    body.messagesToCreate = assembleBoostMessages(data, isEventTriggered);

    return body;
  }

  getAudienceReqBody() {
    return this.audienceRef ? this.audienceRef.getReqBody() : null;
  }

  validate() {
    const data = this.state.data;
    const pushFilled = data.pushTitle.trim() && data.pushBody.trim();
    const cardFilled = data.cardTitle.trim() && data.cardBody.trim();
    const emailFilled = data.emailSubject.trim() && data.emailBody.trim();

    const oneMessageDone = pushFilled || cardFilled || emailFilled;
    const isInAppWithdrawal = data.type === 'WITHDRAWAL' && data.withdrawalEventAnchor === 'WITHDRAWAL_EVENT_INITIATED';

    if (!oneMessageDone && !isInAppWithdrawal) {
      this.modalService.openInfo('Boost create', 'Please fill in <b>Push notification</b> or <b>Card details</b> or <b>Email</b>');
      return false;
    }

    if (data.emailBody && (!data.emailSubject || !data.emailSubject.trim())) {
      this.modalService.openInfo('Email subject', 'Please remember to fill in a subject if you are sending an email');
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

  setupBodyEditor = editor => {
    editor.settings.toolbar += ' | params';
    editor.ui.registry.addMenuButton('params', {
      text: 'Insert parameter',
      fetch: cb => {
        const items = this.bodyParameters.map(param => {
          return {
            type: 'menuitem', text: param,
            onAction: () => editor.selection.setContent(`#{${param}}`)
          }
        });
        cb(items);
      }
    });
    this.bodyEditor = editor;
  }
}

export default BoostForm;