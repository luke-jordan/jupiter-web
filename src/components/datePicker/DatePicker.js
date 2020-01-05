import React from 'react';
import ReactDatePicker from "react-datepicker";
import classNames from 'classnames';

import './DatePicker.scss';

class DatePicker extends React.Component {
  render() {
    const props = this.props;
    const rootClass = classNames('base-input date-picker', { disabled: props.disabled });

    return <div className={rootClass}>
      <ReactDatePicker {...props} className="input-control" ref={picker => this.pickerRef = picker}>
        {(props.selected && props.showClear) && <div className="date-clear">
          <span className="link" onClick={this.clearDateClick}>Clear</span>
        </div>}
      </ReactDatePicker>
    </div>;
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

DatePicker.defaultProps = {
  showClear: true,
  dateFormat: 'dd/MM/yyyy',
  placeholderText: 'Select date'
};

export default DatePicker;