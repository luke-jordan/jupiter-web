import React from 'react';

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
    return <form className="boost-form" onSubmit={props.onSubmit} autoComplete="off">
      {this.renderDetails()}
      {this.renderConditions()}
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
            <input className="form-input" type="text" name="label" placeholder="Enter label"
              value={formData.label} onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Type */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Type</div>
            <select className="form-input" name="type" value={formData.type}
              onChange={onChange} disabled={this.isView()}>
              <option value="SIMPLE">Simple (e.g., time limited)</option>
              <option value="GAME">Game</option>
            </select>
          </div>
        </div>
        {/* Category */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Category</div>
            <select className="form-input" name="category" value={formData.category}
              onChange={onChange} disabled={this.isView()}>
              <option value="TIME_LIMITED">Time limited</option>
            </select>
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
        <div className="grid-col">
          {/* Expiry time */}
          <div className="form-group">
            <div className="form-label">When does it expire?</div>
            <select className="form-input" name="expiryTime" value={formData.expiryTime}
              onChange={onChange} disabled={this.isView()}>
              <option value="END_OF_DAY">End of today</option>
              <option value="END_OF_TOMORROW">End tomorrow</option>
              <option value="END_OF_WEEK">End week</option>
            </select>
          </div>
          {/* Total budget */}
          <div className="form-group">
            <div className="form-label">What is the total budget?</div>
            <input className="form-input" name="totalBudget" type="number" value={formData.totalBudget}
              onChange={onChange} disabled={this.isView()}/>
          </div>
          {/* Source */}
          <div className="form-group">
            <div className="form-label">What bonus pool is it from?</div>
            <select className="form-input" name="source" value={formData.source}
              onChange={onChange} disabled={this.isView()}>
              <option value="primary_bonus_pool">primary_bonus_pool</option>
            </select>
          </div>
        </div>
        <div className="grid-col">
          {/* Required save */}
          <div className="form-group">
            <div className="form-label">How much must a user save to get it?</div>
            <input className="form-input" name="requiredSave" type="number" value={formData.requiredSave}
              onChange={onChange} disabled={this.isView()}/>
          </div>
          {/* Per user amount */}
          <div className="form-group">
            <div className="form-label">How much is it worth (per user)?</div>
            <input className="form-input" name="perUserAmount" type="number" value={formData.perUserAmount}
              onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
        <div className="grid-col">
          {/* Audience */}
          <div className="form-group">
            <div className="form-label">Who is eligible? Boost audience:</div>
            <select className="form-input" name="audience" value={formData.audience}
              onChange={onChange} disabled={this.isView()}>
              <option value="whole_universe">All users @ client</option>
              <option value="random_sample">Sample of client users</option>
            </select>
          </div>
          {/* Sample size */}
          {formData.audience === 'random_sample' && <div className="form-group">
            <div className="form-label">Proportion of client:</div>
            <input className="form-input" name="sampleSize" value={formData.sampleSize}
              onChange={onChange} disabled={this.isView()}/>
          </div>}
        </div>
      </div>
    </>;
  }

  renderPushAndCardDetails() {
    const { formData, onChange } = this.props;
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
            <input className="form-input" type="text" name="pushTitle" placeholder="Enter title"
              value={formData.pushTitle} onChange={onChange} disabled={this.isView()}/>
          </div>
          <div className="form-group">
            <div className="form-label">Notification body</div>
            <input className="form-input" type="text" name="pushBody" placeholder="Enter body"
              value={formData.pushBody} onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
        {/* Card title & body */}
        <div className="grid-col">
          <div className="form-group">
            <div className="form-label">Card title</div>
            <input className="form-input" type="text" name="cardTitle" placeholder="Enter title"
              value={formData.cardTitle} onChange={onChange} disabled={this.isView()}/>
          </div>
          <div className="form-group">
            <div className="form-label">Card body</div>
            <input className="form-input" type="text" name="cardBody" placeholder="Enter body"
              value={formData.cardBody} onChange={onChange} disabled={this.isView()}/>
          </div>
        </div>
      </div>
    </>;
  }
}

export default BoostForm;