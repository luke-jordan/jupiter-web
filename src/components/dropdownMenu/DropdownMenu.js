import React from 'react';
import classNames from 'classnames';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import './DropdownMenu.scss';
import moreIcon from 'assets/images/more.svg';

const windowClick$ = fromEvent(window, 'click');

class DropdownMenu extends React.Component {
  constructor() {
    super();
    this.state = { open: false };
    this.unmount$ = new Subject();
  }

  componentDidMount() {
    windowClick$.pipe(takeUntil(this.unmount$)).subscribe(this.windowClick);
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.complete();
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
    if (this.props.onItemClick) {
      this.props.onItemClick(item);
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