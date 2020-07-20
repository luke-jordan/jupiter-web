import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';

import SnippetsList from './SnippetsList';
import SnippetsEdit from './SnippetsEdit';

import './SnippetsPage.scss';

const SnippetsPage = () => {
    return <div className="snippets-page">
    <Switch>
      <Route path="/snippets" exact component={SnippetsList}/>
      <Route path="/snippets/:mode(new|view|edit|duplicate)/:id?" exact component={SnippetsEdit}/>
      <Route render={() => <Redirect to="/snippets"/>}/>
    </Switch>
  </div>;
};

export default errorBoundary(SnippetsPage);
