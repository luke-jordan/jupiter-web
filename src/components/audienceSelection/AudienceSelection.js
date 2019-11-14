import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import ConditionBuilder from 'src/components/conditionBuilder/ConditionBuilder';
import Spinner from 'src/components/spinner/Spinner';

import './AudienceSelection.scss';

class AudienceSelection extends React.Component {
  constructor() {
    super();

    this.audienceService = inject('AudienceService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      properties: [],
      root: { op: 'and', children: [] },
      preview: null
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadProperties();
  }

  render() {
    const state = this.state;
    return <div className="audience-selection">
      <div className="form-section">
        <div className="section-num">{this.props.sectionNum}</div>
        <div className="section-text">{this.props.sectionText}</div>
        {this.renderPreview()}
      </div>
      <ConditionBuilder root={state.root} ruleFields={state.properties}
        onChange={this.conditionChanged}/>
      {state.loading && <Spinner overlay/>}
    </div>;
  }

  renderPreview() {
    const preview = this.state.preview;
    return <div className="audience-preview">
      <button type="button" className="button button-outline button-small"
        onClick={this.previewClick}>Preview</button>
      {preview &&
        <span className="preview-result"><b>{preview.audienceCount}</b> user(s) match the criteria</span>}
    </div>;
  }

  conditionChanged = () => {
    // console.log(this.state.root);
  }

  previewClick = () => {
    this.loadPreview();
  }

  loadProperties() {
    this.audienceService.getProperties().pipe(
      takeUntil(this.unmount)
    ).subscribe(properties => {
      this.setState({ properties });
    });
  }

  loadPreview() {
    this.setState({ loading: true });
    this.audienceService.getPreview(this.getReqBody()).pipe(
      takeUntil(this.unmount)
    ).subscribe(preview => {
      this.setState({ preview, loading: false });
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }

  getReqBody() {
    return {
      clientId: this.props.client.clientId,
      isDynamic: true,
      conditions: [this.state.root]
    };
  }
}

AudienceSelection.defaultProps = {
  sectionNum: 4,
  sectionText: 'Audience selection'
};

export default AudienceSelection;