import React from 'react';
import { fromEvent, of } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged,
  switchMap, map, mapTo, catchError } from 'rxjs/operators';

import { inject, unmountDecorator, mapToOptions } from 'src/core/utils';
import { referralCodeTypeMap } from 'src/core/constants';
import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import TextArea from 'src/components/textArea/TextArea';

export default class FloatReferralCodeEdit extends React.Component {
  headerText = {
    new: 'Add referral code',
    edit: 'Edit referral code',
    duplicate: 'Duplicate referral code'
  };

  constructor(props) {
    super();

    this.codeTypes = mapToOptions(referralCodeTypeMap);

    this.clientsService = inject('ClientsService');

    this.state = {
      data: this.getFormData(props),
      codeAvailable: props.mode !== 'duplicate'
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.checkIfCodeAvailable();
  }

  render() {
    const { mode, float } = this.props;
    const { data, codeAvailable } = this.state;

    return <Modal className="float-referral-code-modal" open
      header={this.headerText[mode]}
      onClose={this.props.onCancel}>
      <form onSubmit={this.submit}>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Name</div>
              <Input name="referralCode" placeholder="Enter name"
                maxlength="50" disabled={mode === 'edit'}
                error={codeAvailable ? '' : 'This name already used'}
                value={data.referralCode} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Type</div>
              <Select name="codeType" value={data.codeType} 
                disabled={mode === 'edit'} onChange={this.inputChange}>
                {this.codeTypes.map(type => <option key={type.value} value={type.value}>{type.text}</option>)}
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Amount</div>
              <Input type="number" name="bonusAmount" placeholder="Enter bonus amount"
                value={data.bonusAmount} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Source</div>
              <Select name="bonusSource" value={data.bonusSource} onChange={this.inputChange}>
                {Object.keys(float.floatBonusPools).map(key => <option key={key} value={key}>{key}</option>)}
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Add tags separated by commas (optional)</div>
              <TextArea name="tags" placeholder="Enter tags" rows="3" charsCounter={false}
                value={data.tags} onChange={this.inputChange} />
            </div>
          </div>
        </div>
        <div className="grid-row code-actions">
          <div className="grid-col">
            <span className="link text-underline" onClick={this.props.onCancel}>Cancel</span>
          </div>
          <div className="grid-col text-right">
            <button className="button" disabled={!this.valid()}>
              {mode === 'edit' ? 'Edit': 'Add'} code
            </button>
          </div>
        </div>
      </form>
    </Modal>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  valid() {
    const state = this.state;
    return (
      state.data.referralCode.trim() &&
      state.data.bonusAmount &&
      state.codeAvailable
    );
  }

  submit = event => {
    event.preventDefault();
    this.props.onSubmit(this.props.mode, this.state.data);
  }

  getFormData(props) {
    const { float, data } = props;

    if (data) {
      return {
        referralCode: data.referralCode,
        codeType: data.codeType,
        bonusAmount: data.bonusAmount.amountValue,
        bonusSource: data.bonusSource,
        tags: (data.tags || []).join(',')
      };
    }

    return {
      referralCode: '',
      codeType: this.codeTypes[0].value,
      bonusAmount: '',
      bonusSource: Object.keys(float.floatBonusPools)[0],
      tags: ''
    };
  }

  checkIfCodeAvailable() {
    const el = document.querySelector('.float-referral-code-modal input[name="referralCode"]');

    fromEvent(el, 'keyup').pipe(
      map(e => e.target.value.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(referralCode => {
        if (!referralCode) {
          return of(true);
        }

        const float = this.props.float;
        return this.clientsService.checkRefCodeAvailable({
          referralCode, clientId: float.clientId, floatId: float.floatId
        }).pipe(
          mapTo(true),
          catchError(() => of(false))
        );
      }),
      takeUntil(this.unmount)
    ).subscribe(codeAvailable => {
      this.setState({ codeAvailable });
    });
  }
}
