import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import PageLayout from 'components/pageLayout/PageLayout';

class Root extends React.Component {
  render() {
    return <Router>
      <PageLayout>
        <Route path="/" exact render={() => 'Home'}/>
        <Route path="/users" render={() => 'Users'}/>
        <Route path="/boosts" render={() => 'Boosts'}/>
        <Route path="/messages" render={() => 'Messages'}/>
        <Route path="/clients-and-floats" render={() => 'Clients & floats'}/>
      </PageLayout>
    </Router>;
  }
}

export default Root;