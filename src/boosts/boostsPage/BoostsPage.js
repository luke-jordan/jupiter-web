import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import BoostsList from '../boostsList/BoostsList';

import './BoostsPage.scss';

const BoostsPage = () => {
  return <div className="boosts-page">
    <Switch>
      <Route path="/boosts" exact component={BoostsList}/>
      <Route path="/boosts/:mode(new|view|edit|duplicate)/:id?" exact render={() => 'Boost edit'}/>
      <Route render={() => <Redirect to="/boosts"/>}/>
    </Switch>
  </div>;
}

export default BoostsPage;