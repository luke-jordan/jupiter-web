import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import ConditionBuilder from 'src/components/conditionBuilder/ConditionBuilder';

import './AudienceSelection.scss';

class AudienceSelection extends React.Component {
  constructor() {
    super();

    this.audienceService = inject('AudienceService');

    this.state = {
      properties: null,
      root: {
        op: 'and',
        children: []
      }
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.audienceService.getProperties().pipe(
      takeUntil(this.unmount)
    ).subscribe(properties => {
      this.setState({ properties });
    })
  }

  render() {
    const state = this.state;
    return <div className="audience-selection">
      <div className="form-section">
        <div className="section-num">{this.props.sectionNumber}</div>
        <div className="section-text">{this.props.sectionText}</div>
      </div>
      <ConditionBuilder root={state.root} ruleFields={state.properties}
        onChange={this.conditionsChanged}/>
    </div>;
  }

  conditionsChanged = () => {
    console.log(this.state.root);
  }
}

AudienceSelection.defaultProps = {
  sectionNumber: 4,
  sectionText: 'Audience selection'
};

export default AudienceSelection;