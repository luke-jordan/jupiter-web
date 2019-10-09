import React from 'react';

import './BoostForm.scss';

class BoostForm extends React.Component {
  render() {
    const { mode, onSubmit } = this.props;
    const isView = mode === 'view';
    return <form className="boost-form" onSubmit={onSubmit} autoComplete="off">
      {this.renderDetails(isView)}
      {this.renderConditions(isView)}
    </form>;
  }

  renderDetails(isView) {
    const { formData, onChange } = this.props;
    return <>
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">Details</div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">Label</div>
          <input className="form-input" type="text" name="label" placeholder="Enter label"
            value={formData.label} onChange={onChange} disabled={isView}/>
        </div>
        <div className="form-group">
          <div className="form-label">Type</div>
          <select className="form-input" name="type" value={formData.type}
            onChange={onChange} disabled={isView}>
            <option value="SIMPLE">Simple (e.g., time limited)</option>
            <option value="GAME">Game</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Category</div>
          <select className="form-input" name="category" value={formData.category}
            onChange={onChange} disabled={isView}>
            <option value="TIME_LIMITED">Time limited</option>
          </select>
        </div>
      </div>
    </>;
  }

  renderConditions(isView) {
    const { formData, onChange } = this.props;
    return <>
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Conditions</div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">When does it expire?</div>
          <select className="form-input" name="action" value={formData.action}
            onChange={onChange} disabled={isView}>
            <option value="END_OF_DAY">End of today</option>
            <option value="END_OF_TOMORROW">End tomorrow</option>
            <option value="END_OF_WEEK">End week</option>
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Who is eligible? Boost audience:</div>
          <select className="form-input" name="audience" value={formData.audience}
            onChange={onChange} disabled={isView}>
            <option value="whole_universe">All users @ client</option>
            <option value="random_sample">Sample of client users</option>
          </select>
        </div>
        <div className="form-group" style={{ visibility: formData.audience === 'random_sample' ? 'visible' : 'hidden' }}>
          <div className="form-label">Proportion of client:</div>
          <input className="form-input" name="sampleSize" value={formData.sampleSize}
            onChange={onChange} disabled={isView}/>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">How much must a user save to get it?</div>
          <input className="form-input" name="requiredSave" type="number" value={formData.requiredSave}
            onChange={onChange} disabled={isView}/>
        </div>
        <div className="form-group">
          <div className="form-label">How much is it worth (per user)?</div>
          <input className="form-input" name="perUserAmount" type="number" value={formData.perUserAmount}
            onChange={onChange} disabled={isView}/>
        </div>
        <div className="form-group"></div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <div className="form-label">What is the total budget?</div>
          <input className="form-input" name="totalBudget" type="number" value={formData.totalBudget}
            onChange={onChange} disabled={isView}/>
        </div>
        <div className="form-group">
          <div className="form-label">What bonus pool is it from?</div>
          <select className="form-input" name="source" value={formData.source}
            onChange={onChange} disabled={isView}>
            <option value="primary_bonus_pool">primary_bonus_pool</option>
          </select>
        </div>
        <div className="form-group"></div>
      </div>
    </>;
  }
}

export default BoostForm;