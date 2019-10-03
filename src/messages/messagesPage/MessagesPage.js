import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import MessagesList from '../messagesList/MessagesList';
import MessageCreate from '../messageCreate/MessageCreate';

import './MessagesPage.scss';

const MessagesPage = () => {
  return <div className="messages-page">
    <Switch>
      <Route path="/messages" exact component={MessagesList}/>
      <Route path="/messages/new" exact component={MessageCreate}/>
      <Route render={() => <Redirect to="/messages"/>}/>
    </Switch>
  </div>;
};

export default MessagesPage;