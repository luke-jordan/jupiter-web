import React from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { inject } from 'utils';
import Spinner from 'components/spinner/Spinner';
import ClientInfo from './ClientInfo';

import './ClientsList.scss';

class ClientsList extends React.Component {
  constructor() {
    super();
    this.clientsService = inject('ClientsService');

    this.state = {
      loading: true,
      clients: {}
    };

    this.unmount$ = new Subject();
  }

  componentDidMount() {
    this.clientsService.getClients().pipe(
      takeUntil(this.unmount$)
    ).subscribe(clients => {
      this.setState({ clients: clients, loading: false });
    });
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  render() {
    return <div className="clients-list">
      <header className="header">Clients &amp; Floats</header>
      {this.state.loading ? 
        <div className="text-center"><Spinner/></div> : this.renderClients()}
    </div>;
  }

  renderClients() {
    const clients = this.state.clients;
    const clientsIds = Object.keys(clients);
    return clientsIds.map(id => <ClientInfo client={clients[id]} key={id}/>);
  }
}

export default ClientsList;