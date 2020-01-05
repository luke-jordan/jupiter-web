import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import ConditionBuilder from 'src/components/conditionBuilder/ConditionBuilder';
import Spinner from 'src/components/spinner/Spinner';
import RadioButton from 'src/components/radioButton/RadioButton';
import Input from 'src/components/input/Input';

import './AudienceSelection.scss';

class AudienceSelection extends React.Component {
  constructor() {
    super();

    this.audienceService = inject('AudienceService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      settings: {
        dynamic: true,
        proportion: false,
        proportionValue: '100'
      },
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
      {this.renderSettings()}
      {this.renderHint()}
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

  renderSettings() {
    const settings = this.state.settings;
    return <div className="selection-settings">
      <div className="setting-item">
        Is audience selection dynamic?
        <RadioButton value="yes" name="dynamic" checked={settings.dynamic} onChange={this.settingsChange}>
          Yes</RadioButton>
        <RadioButton value="no" name="dynamic" checked={!settings.dynamic} onChange={this.settingsChange}>
          No</RadioButton>
      </div>
      <div className="setting-item proportion">
        Select a proportion of these users randomly
        <RadioButton value="yes" name="proportion" checked={settings.proportion} onChange={this.settingsChange}>
          Yes</RadioButton>
        <RadioButton value="no" name="proportion" checked={!settings.proportion} onChange={this.settingsChange}>
          No</RadioButton>
        <Input type="number" name="proportionValue" value={settings.proportionValue} onChange={this.settingsChange}
          min={0} max={100} disabled={!settings.proportion}/>
        <span>%</span>
      </div>
    </div>;
  }

  renderHint() {
    return <div className="selection-hint">
      <b>Set user properties</b>
      <p>*If you do not specify any properties then this message will be sent to <b>all users</b></p>
    </div>;
  }

  previewClick = () => {
    if (this.isValid()) {
      this.loadPreview();
    } else {
      this.showInvalidMessage();
    }
  }

  settingsChange = event => {
    const target = event.target;
    const value = target.type === 'radio' ? target.value === 'yes' : target.value;
    this.setState({
      settings: { ...this.state.settings, [target.name]: value }
    });
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
    const settings = this.state.settings;

    const body = {
      clientId: this.props.clientId,
      isDynamic: settings.dynamic,
      conditions: [this.state.root]
    };

    if (settings.proportion) {
      body.sample = { random: +settings.proportionValue }
    }

    return body;
  }

  reset() {
    this.setState({
      dynamic: true,
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