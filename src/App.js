import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { authenticationService } from './services/authentication.service';

import { history } from './helpers/history';

import { AdminRoute } from './components/AdminRoute';
import { LoginPage } from './components/LoginPage';
import { AdminHomePage } from './components/AdminHome';
import { MessageTable } from './components/MessageTable';


class App extends React.Component {
  constructor(props) {
        super(props);

        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    }

    logout(event) {
        event.preventDefault();
        authenticationService.logout();
        history.push('/login');
    }

    render() {
      const { currentUser } = this.state;
      return (
          <Router history={history}>
              <div>
                  {currentUser &&
                      <nav className="navbar navbar-expand navbar-dark bg-dark">
                          <div className="navbar-nav">
                              <Link to="/" className="nav-item nav-link">Home</Link>
                              <Link to="/messages" className="nav-item nav-link">Messages</Link>
                              <a href="#" onClick={this.logout} className="nav-item nav-link">Logout</a>
                          </div>
                      </nav>
                  }
                  <div className="jumbotron">
                      <div className="container">
                          <div className="row">
                              <div className="col-md-12">
                                  <AdminRoute exact path="/" component={AdminHomePage} />
                                  <Route path="/login" component={LoginPage} />
                                  <Route path="/messages" component={MessageTable} />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </Router>
      );
    }
}

export default App;
