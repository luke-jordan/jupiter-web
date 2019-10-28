import React from 'react';

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

  isView() {
    return this.props.mode === 'view';
  }

  render() {
    const props = this.props;
    return <form className="boost-form" onSubmit={props.onSubmit}>
      {this.renderDetails()}
      {this.renderConditions()}
      {this.renderAudienceSelection()}
      {this.renderPushAndCardDetails()}
      <div className="text-right">
        <button className="button">{this.submitButtonText[props.mode]}</button>
      </div>
    </form>;
  }

  renderDetails() {
    const { formData, onChange } = this.props;
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
              value={formData.label} onChange={onChange}/>
          </div>
        </div>
        {/* Type */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Type</div>
            <Select name="type" value={formData.type}
              onChange={onChange} disabled={this.isView()}>
              <option value="SIMPLE">Simple (e.g., time limited)</option>
              <option value="GAME">Game</option>
            </Select>
          </div>
        </div>
        {/* Category */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Category</div>
            <Select name="category" value={formData.category}
              onChange={onChange} disabled={this.isView()}>
              <option value="TIME_LIMITED">Time limited</option>
            </Select>
          </div>
        </div>
      </div>
    </>;
  }

  renderConditions() {
    const { formData, onChange } = this.props;
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
            <Select name="expiryTime" value={formData.expiryTime}
              onChange={onChange} disabled={this.isView()}>
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
            <Input name="totalBudget" type="number" value={formData.totalBudget}
              onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Bonus pool */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">What bonus pool is it from?</div>
            <Select name="source" value={formData.source}
              onChange={onChange} disabled={this.isView()}>
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
            <Input name="requiredSave" type="number" value={formData.requiredSave}
              onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Per user amount */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">How much is it worth (per user)?</div>
            <Input name="perUserAmount" type="number" value={formData.perUserAmount}
              onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
      </div>
    </>;
  }

  renderAudienceSelection() {
    const { formData, onChange } = this.props;
    return <AudienceSelection formData={formData} onChange={onChange}/>;
  }

  renderPushAndCardDetails() {
    const { formData, onChange } = this.props;
    return <>
      <div className="form-section">
        <div className="section-num">4</div>
        <div className="section-text">Push notification &amp; Card details</div>
      </div>
      <div className="grid-row">
        {/* Notification title & body */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Notification title</div>
            <Input name="pushTitle" placeholder="Enter title" disabled={this.isView()}
              value={formData.pushTitle} onChange={onChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Notification body</div>
            <TextArea name="pushBody" rows="3" disabled={this.isView()}
              value={formData.pushBody} onChange={onChange}/>
          </div>
        </div>
        {/* Card title & body */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Card title</div>
            <Input name="cardTitle" placeholder="Enter title" disabled={this.isView()}
              value={formData.cardTitle} onChange={onChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Card body</div>
            <TextArea name="cardBody" rows="3" disabled={this.isView()}
              value={formData.cardBody} onChange={onChange}/>
          </div>
        </div>
      </div>
    </>;
  }

  renderBonusPoolOptions() {
    return this.props.floats.map(float => {
      return <optgroup label={`${float.floatName}`} key={float.floatId}>
        {float.bonusPoolIds.map(id => <option key={id} value={id}>{id}</option>)}
      </optgroup>;
    });
  }
}

export default BoostForm;