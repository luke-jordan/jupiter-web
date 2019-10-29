import React from 'react';

import TagList from 'src/components/tagList/TagList';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import TextArea from 'src/components/textArea/TextArea';
import Modal from 'src/components/modal/Modal';

import './FloatRefferalCodesTable.scss';

class FloatRefferalCodesTable extends React.Component {
  constructor() {
    super();
    this.state = {
      editOpen: false,
      code: this.getDefaultValues()
    };
  }

  render() {
    return <div className="float-refferal-codes-table">
      {this.renderHeader()}
      {this.renderTable()}
      {this.renderEditModal()}
    </div>;
  }

  renderHeader() {
    return <div className="section-header">
      <div className="header-text">Active Referral Codes</div>
      <div className="header-actions">
        <div className="button button-small button-outline"
          onClick={this.addCodeClick}>Add new code</div>
      </div>
    </div>
  }

  renderTable() {
    const props = this.props;

    const rows = [{}].map((item, index) => {
      return <tr key={index}>
        <td>#test</td>
        <td>test</td>
        <td>10</td>
        <td>R12.99</td>
        <td><TagList tags="tag1,tag2,tag3"/></td>
        <td>
          <DropdownMenu items={[
            { text: 'Duplicate', click: () => props.onAction('duplicate', item) },
            { text: 'Deactivate', click: () => props.onAction('deactivate', item) }
          ]}/>
        </td>
      </tr>
    });

    return <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 150}}>Type</th>
          <th style={{width: 100}}># Used</th>
          <th style={{width: 100}}>Bonus</th>
          <th style={{width: 300}}>Tags</th>
          <th style={{width: 40}}></th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows :
          <tr><td colSpan="6" className="no-data">No codes</td></tr>}
      </tbody>
    </table>;
  }

  renderEditModal() {
    const state = this.state;
    return <Modal className="float-refferal-code-modal"
      open={state.editOpen} 
      header="Add refferal code"
      onClose={this.closeModal}>
      <form onSubmit={this.submitCode}>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Name</div>
              <Input name="name" placeholder="Enter name"
                value={state.code.name} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Type</div>
              <Select name="type" value={state.code.type} onChange={this.inputChange}>
                <option value="TYPE_1">Type 1</option>
                <option value="TYPE_2">Type 2</option>
                <option value="TYPE_3">Type 3</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Amount</div>
              <Input name="bonusAmount" placeholder="Enter bonus amount"
                value={state.code.bonusAmount} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Source</div>
              <Select name="bonusSource" value={state.code.bonusSource} onChange={this.inputChange}>
                <option value="SOURCE_1">Source 1</option>
                <option value="SOURCE_2">Source 2</option>
                <option value="SOURCE_3">Source 3</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Add tags (optional)</div>
              <TextArea name="tags" placeholder="Enter tags separated by commas" rows="3" charsCounter={false}
                value={state.code.tags} onChange={this.inputChange} />
            </div>
          </div>
        </div>
        <div className="grid-row code-actions">
          <div className="grid-col">
            <span className="link text-underline" onClick={this.closeModal}>Cancel</span>
          </div>
          <div className="grid-col text-right">
            <button className="button">Add code</button>
          </div>
        </div>
      </form>
    </Modal>;
  }

  addCodeClick = () => {
    this.setState({ editOpen: true });
  }

  closeModal = () => {
    this.setState({ editOpen: false, code: this.getDefaultValues() });
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      code: { ...this.state.code, [name]: value }
    });
  }

  submitCode = event => {
    event.preventDefault();
    this.setState({ editOpen: false, code: this.getDefaultValues() });
    this.props.onAction(this.state.code, 'submit');
  }

  getDefaultValues() {
    return {
      name: '',
      type: 'TYPE_1',
      bonusAmount: 0,
      bonusSource: 'SOURCE_1',
      tags: ''
    };
  }
}

export default FloatRefferalCodesTable;