import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';
import BoostsList from '../boostsList/BoostsList';
import BoostEdit from '../boostEdit/BoostEdit';

import './BoostsPage.scss';

const BoostsPage = () => {
  return <div className="boosts-page">
    <Switch>
      <Route path="/boosts" exact component={BoostsList}/>
      <Route path="/boosts/:mode(new|view|edit|duplicate)/:id?" exact component={BoostEdit}/>
      <Route render={() => <Redirect to="/boosts"/>}/>
    </Switch>
  </div>;
}

export default errorBoundary(BoostsPage);