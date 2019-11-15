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
        <div className="section-num">{this.props.headerNum}</div>
        <div className="section-text">{this.props.headerText}</div>
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

  previewClick = () => {
    if (this.isValid()) {
      this.loadPreview();
    } else {
      this.showInvalidMessage();
    }
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

  reset() {
    this.setState({ 
      root: { op: 'and', children: [] },
      preview: null
    });
  }

  isValid() {
    const root = this.state.root;

    if (!root.children.length) {
      return true;
    }

    let valid = true;
    const checkItem = item => {
      if (!valid) {
        return;
      } else if (item.children) {
        if (item.children.length) {
          item.children.forEach(checkItem);
        } else {
          valid = false;
        }
      } else if (!item.value) {
        valid = false;
      }
    };
    checkItem(root);

    return valid;
  }

  showInvalidMessage() {
    this.modalService.openInfo(
      'Audience selection',
      'Some of the conditions are incorrect. Make sure there is no empty groups and values.'
    );
  }
}

AudienceSelection.defaultProps = {
  headerNum: 4,
  headerText: 'Select audience'
};

export default AudienceSelection;