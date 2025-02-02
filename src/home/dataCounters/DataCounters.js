import React from 'react';
import { NavLink } from 'react-router-dom';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Spinner from 'src/components/spinner/Spinner';
import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';

import './DataCounters.scss';
import giftImage from 'src/assets/images/gift.svg';
import addImage from 'src/assets/images/add.svg';
import arrowRightPurple from 'src/assets/images/arrow-right-purple.svg';
import letterImage from 'src/assets/images/letter.svg';

class DataCounters extends React.Component {
  constructor() {
    super();
    this.boostsService = inject('BoostsService');
    this.messagesService = inject('MessagesService');

    this.state = {
      boostsLoading: true,
      boostsCount: 0,

      messagesLoading: true,
      messagesCount: 0
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.boostsService.getActiveBoostsCount().pipe(
      takeUntil(this.unmount)
    ).subscribe(boostsCount => {
      this.setState({ boostsCount, boostsLoading: false });
    });

    this.messagesService.getActiveMessagesCount().pipe(
      takeUntil(this.unmount)
    ).subscribe(messagesCount => {
      this.setState({ messagesCount, messagesLoading: false });
    });
  }

  render()  {
    const state = this.state;
    return <div className="data-counters">
      {/* Boosts */}
      <div className="card card-with-icon">
        <div className="card-header">
          <div className="header-text">Boosts</div>
          <img src={giftImage} alt="Boosts"/>
        </div>
        <div className="card-body">
          {state.boostsLoading ? <Spinner/> :
            <>
              <div className="data-counter">
                <span className="counter-value">{state.boostsCount}</span>
                <span className="counter-name">Active Boost{state.boostsCount !== 1 && 's'}</span>
              </div>
              <div className="data-buttons">
                <NavLink className="button" to="/boosts/new">
                  New boost <img className="button-icon" src={addImage} alt="add"/>
                </NavLink>
                <NavLink className="button button-outline" to="/boosts">
                  View boosts <img className="button-icon" src={arrowRightPurple} alt="arrow"/>
                </NavLink>
              </div>
            </>}
        </div>
      </div>

      {/* Messages */}
      <div className="card card-with-icon">
        <div className="card-header">
          <div className="header-text">Messages</div>
          <img src={letterImage} alt="Messages"/>
        </div>
        <div className="card-body">
          {state.messagesLoading ? <Spinner/> :
            <>
              <div className="data-counter">
                <span className="counter-value">{state.messagesCount}</span>
                <span className="counter-name">Active Message{state.messagesCount !== 1 && 's'}</span>
              </div>
              <div className="data-buttons">
                <NavLink className="button" to="/messages/new">
                  New message <img className="button-icon" src={addImage} alt="add"/>
                </NavLink>
                <NavLink className="button button-outline" to="/messages">
                  View messages <img className="button-icon" src={arrowRightPurple} alt="arrow"/>
                </NavLink>
              </div>
            </>}
        </div>
      </div>
    </div>
  }
}

export default errorBoundary(DataCounters);