import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';
import MessagesList from '../messagesList/MessagesList';
import MessageEdit from '../messageEdit/MessageEdit';

import './MessagesPage.scss';

const MessagesPage = () => {
  return <div className="messages-page">
    <Switch>
      <Route path="/messages" exact component={MessagesList}/>
      <Route path="/messages/:mode(new|view|edit|duplicate)/:id?" exact component={MessageEdit}/>
      <Route render={() => <Redirect to="/messages"/>}/>
    </Switch>
  </div>;
};

export default errorBoundary(MessagesPage);