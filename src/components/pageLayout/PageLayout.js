import React from 'react';
import { NavLink } from 'react-router-dom';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { inject } from 'services';
import './PageLayout.scss';

class PageLayout extends React.Component {
  constructor() {
    super();
    this.authService = inject('AuthService');
    this.state = { user: null };

    this.unmount$ = new Subject();
  }

  componentDidMount() {
    this.authService.user$.pipe(
      takeUntil(this.unmount$)
    ).subscribe(user => this.setState({ user }));
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  render() {
    return <div className="page-layout">
      <header className="page-layout-header">
        <div className="header-inner">
          <div className="header-logo">
            <NavLink to="/">
              <img src="images/logo.svg" alt="logo"></img>
            </NavLink>
          </div>
          {this.state.user && this.renderHeaderNav()}
        </div>
      </header>
      <main className="page-layout-main">
        {this.props.children}
      </main>
      <footer className="page-layout-footer">
        <div className="footer-inner">
          <div className="footer-copyright">&copy; Copyright Jupiter 2019</div>
          <div className="footer-contact-us">Contact Us</div>
        </div>
      </footer>
    </div>;
  }

  renderHeaderNav() {
    return <div className="header-nav">
      <NavLink className="header-nav-item" to="/" exact>Home</NavLink>
      <NavLink className="header-nav-item" to="/users">Users</NavLink>
      <NavLink className="header-nav-item" to="/boosts">Boosts</NavLink>
      <NavLink className="header-nav-item" to="/messages">Messages</NavLink>
      <NavLink className="header-nav-item" to="/clients-and-floats">Clients &amp; floats</NavLink>
      <div className="header-nav-item log-out" onClick={this.logoutClick}>Log out</div>
    </div>;
  }

  logoutClick = () => {
    this.authService.logout().pipe(
      takeUntil(this.unmount$)
    ).subscribe();
  }
}

export default PageLayout;
