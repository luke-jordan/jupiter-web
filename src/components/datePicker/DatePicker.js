import React from 'react';
import ReactDatePicker from "react-datepicker";

import './DatePicker.scss';
import calendarIcon from 'src/assets/images/calendar.svg';

class DatePicker extends React.Component {
  render() {
    return <div className="base-input date-picker">
      <ReactDatePicker {...this.props} className="input-control" ref={picker => this.pickerRef = picker}>
        {this.props.selected && <div className="date-clear">
          <span className="link" onClick={this.clearDateClick}>Clear</span>
        </div>}
      </ReactDatePicker>
      <img className="calendar-icon" src={calendarIcon} alt="calendar"
        onClick={this.calendarIconClick}/>
    </div>;
  }

  calendarIconClick = () => {
    if (this.pickerRef) {
      this.pickerRef.setOpen(true);
    }
  }

  clearDateClick = () => {
    if (this.props.onChange) {
      this.props.onChange(null);
    }

    if (this.pickerRef) {
      this.pickerRef.setOpen(false);
    }
  }
}

export default DatePicker;