import React from 'react';
import classNames from 'classnames';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { unmountDecorator, inject } from 'utils';

import './DropdownMenu.scss';
import moreIcon from 'assets/images/more.svg';

const windowClick$ = fromEvent(window, 'click');

class DropdownMenu extends React.Component {
  constructor() {
    super();
    this.state = { open: false };

    this.historyService = inject('HistoryService');

    unmountDecorator(this);
  }

  componentDidMount() {
    windowClick$.pipe(takeUntil(this.unmount$)).subscribe(this.windowClick);
  }

  render() {
    const { props, state } = this;
    return <div className={classNames('dropdown-menu', { open: state.open })}
      ref={el => this.el = el}>
      <div className="menu-trigger" onClick={this.triggerClick}>
        <img src={moreIcon} alt="more"/>
      </div>
      <div className="menu-list-wrap">
        <ul className="menu-list">
          {props.items.map((item, index) => {
            return <li key={index} onClick={e => this.itemClick(e, item)}>{item.text}</li>
          })}
        </ul>
      </div>
    </div>;
  }

  triggerClick = () => {
    this.setState({ open: true });
  }

  itemClick(event, item) {
    if (item.click) {
      item.click(event, item);
    }

    if (item.link) {
      this.historyService.push(item.link);
    }

    this.setState({ open: false });
  }

  windowClick = event => {
    if (
      this.state.open && this.el !== event.target.closest('.dropdown-menu')
    ) {
      this.setState({ open: false });
    }
  }
}

export default DropdownMenu;