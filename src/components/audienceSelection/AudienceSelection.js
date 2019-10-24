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
        <div className="grid-col">
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

        <div className="grid-col">
          {/* Sample size */}
          {props.formData.audience === 'random_sample' && <div className="form-group">
            <div className="form-label">Proportion of client:</div>
            <Input name="audienceSample" value={props.formData.audienceSample}
              onChange={props.onChange} disabled={props.isView}/>
          </div>}

          {/* Date from */}
          {props.formData.audience === 'sign_up_cohort' && <div className="form-group">
            <div className="form-label">From:</div>
            <Input type="date" name="audienceDateFrom" value={props.formData.audienceDateFrom}
              onChange={props.onChange} disabled={props.isView}/>
          </div>}

          {/* Activity from */}
          {props.formData.audience === 'activity_count' && <div className="form-group">
            <div className="form-label">From:</div>
            <Input type="number" name="audienceActivityFrom" value={props.formData.audienceActivityFrom}
              onChange={props.onChange} disabled={props.isView}/>
          </div>}
        </div>

        <div className="grid-col">
          {/* Date to */}
          {props.formData.audience === 'sign_up_cohort' && <div className="form-group">
            <div className="form-label">To:</div>
            <Input type="date" name="audienceDateTo" value={props.formData.audienceDateTo}
              onChange={props.onChange} disabled={props.isView}/>
          </div>}

          {/* Activity to */}
          {props.formData.audience === 'activity_count' && <div className="form-group">
            <div className="form-label">To:</div>
            <Input type="number" name="audienceActivityTo" value={props.formData.audienceActivityTo}
              onChange={props.onChange} disabled={props.isView}/>
          </div>}
        </div>
      </div>
    </div>;
  }
}

export default AudienceSelection;