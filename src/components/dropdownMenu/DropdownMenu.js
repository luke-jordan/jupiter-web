import React from 'react';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { unmountDecorator, inject } from 'src/core/utils';

import './DropdownMenu.scss';
import moreIcon from 'src/assets/images/more.svg';

const windowClick$ = fromEvent(window, 'click');

class DropdownMenu extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');
    this.dopdownRef = React.createRef();

    unmountDecorator(this);
  }

  componentDidMount() {
    windowClick$.pipe(takeUntil(this.unmount)).subscribe(this.windowClick);
  }

  render() {
    const props = this.props;
    return <div className="dropdown-menu" ref={this.dopdownRef}>
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
    this.toggleOpen();
  }

  itemClick(event, item) {
    if (item.click) {
      item.click(event, item);
    }

    if (item.link) {
      this.historyService.push(item.link);
    }

    this.toggleOpen(false);
  }

  windowClick = event => {
    const el = this.dopdownRef.current;
    if (el && el !== event.target.closest('.dropdown-menu')) {
      this.toggleOpen(false);
    }
  }

  toggleOpen(open) {
    const el = this.dopdownRef.current;
    if (el) {
      el.classList.toggle('open', open);
    }
  }
}

export default DropdownMenu;