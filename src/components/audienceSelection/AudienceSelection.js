import React from 'react';

import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';

import './AudienceSelection.scss';

class AudienceSelection extends React.Component {
  render() {
    const props = this.props;
    return <div className="audience-selection">
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Who is eligible</div>
      </div>
      <div className="grid-row">
        <div className="grid-col-4">
          {/* Audience */}
          <div className="form-group">
            <div className="form-label">Audience:</div>
            <Select name="audience" value={props.formData.audience}
              onChange={props.onChange} disabled={props.isView}>
              <option value="whole_universe">All users @ client</option>
              <option value="random_sample">Sample of client users</option>
              <option value="sign_up_cohort">Users who joined between dates</option>
              <option value="activity_count">Users by activity</option>
            </Select>
          </div>
        </div>

        {props.formData.audience === 'random_sample' && this.renderSampleSize()}
        {props.formData.audience === 'sign_up_cohort' && this.renderDateRange()}
        {props.formData.audience === 'activity_count' && this.renderActivityRange()}
      </div>
    </div>;
  }

  renderSampleSize() {
    const props = this.props;
    return <div className="grid-col-4">
      <div className="form-group">
        <div className="form-label">Proportion of client:</div>
        <Input name="audienceSample" value={props.formData.audienceSample}
          onChange={props.onChange} disabled={props.isView}/>
      </div>
    </div>;
  }

  renderDateRange() {
    const props = this.props;
    return <>
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">From:</div>
          <Input type="date" name="audienceDateFrom" value={props.formData.audienceDateFrom}
            onChange={props.onChange} disabled={props.isView}/>
        </div>
      </div>
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">To:</div>
          <Input type="date" name="audienceDateTo" value={props.formData.audienceDateTo}
            onChange={props.onChange} disabled={props.isView}/>
        </div>
      </div>
    </>;
  }

  renderActivityRange() {
    const props = this.props;
    return <>
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">From:</div>
          <Input type="number" name="audienceActivityFrom" value={props.formData.audienceActivityFrom}
            onChange={props.onChange} disabled={props.isView}/>
        </div>
      </div>
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">To:</div>
          <Input type="number" name="audienceActivityTo" value={props.formData.audienceActivityTo}
            onChange={props.onChange} disabled={props.isView}/>
        </div>
      </div>
    </>;
  }
}

export default AudienceSelection;