import React from 'react';
import ReactDatePicker from "react-datepicker";
import classNames from 'classnames';

import './DatePicker.scss';
import calendarIcon from 'src/assets/images/calendar.svg';

class DatePicker extends React.Component {
  render() {
    const props = this.props;
    const rootClass = classNames('base-input date-picker', { disabled: props.disabled });

    return <div className={rootClass}>
      <ReactDatePicker {...props} className="input-control" ref={picker => this.pickerRef = picker}>
        {props.selected && <div className="date-clear">
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