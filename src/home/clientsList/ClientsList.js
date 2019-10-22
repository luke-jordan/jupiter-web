import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'utils';
import Spinner from 'components/spinner/Spinner';
import ClientInfo from './ClientInfo';

import './ClientsList.scss';

class ClientsList extends React.Component {
  constructor() {
    super();
    this.clientsService = inject('ClientsService');

    this.state = {
      loading: true,
      clients: []
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.clientsService.getClients().pipe(
      takeUntil(this.unmount)
    ).subscribe(clients => {
      this.setState({ clients: clients, loading: false });
    });
  }

  render() {
    const state = this.state;
    return <div className="clients-list">
      <header className="header">Clients &amp; Floats</header>
      {state.loading ? 
        <div className="text-center"><Spinner/></div> :
        state.clients.map(client => <ClientInfo client={client} key={client.clientId}/>)}
    </div>;
  }
}

export default ClientsList;