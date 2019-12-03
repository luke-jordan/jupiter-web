import React from 'react';
import { fromEvent, of } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged,
  switchMap, map, mapTo, catchError } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
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

    this.clientsService = inject('ClientsService');

    this.state = {
      data: this.getFormData(props.data),
      codeAvailable: props.mode !== 'duplicate'
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.checkIfCodeAvailable();
  }

  render() {
    const mode = this.props.mode;
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
                <option value="CHANNEL">Marketing channel</option>
                <option value="BETA">Early access</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Amount</div>
              <Input type="number" name="amount" placeholder="Enter bonus amount"
                value={data.amount} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Source</div>
              <Select name="bonusSource" value={data.bonusSource} onChange={this.inputChange}>
                <option value="src1">Source 1</option>
                <option value="src2">Source 2</option>
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
      state.data.amount &&
      state.codeAvailable
    );
  }

  submit = event => {
    event.preventDefault();
    this.props.onSubmit(this.props.mode, this.state.data);
  }

  getFormData(data) {
    if (data) {
      return {
        ...data, tags: data.tags.join(',')
      };
    }

    return {
      referralCode: '',
      codeType: 'CHANNEL',
      amount: '',
      bonusSource: 'src1',
      tags: ''
    };
  }

  checkIfCodeAvailable() {
    const el = document.querySelector('.float-referral-code-modal input[name="referralCode"]');

    fromEvent(el, 'keyup').pipe(
      takeUntil(this.unmount),
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
      })
    ).subscribe(codeAvailable => {
      this.setState({ codeAvailable });
    });
  }
}
