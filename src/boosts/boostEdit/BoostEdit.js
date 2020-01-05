import React from 'react';
import { of, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { capitalize, inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import BoostForm from '../boostForm/BoostForm';
import BoostUserCount from '../boostUserCount/BoostUserCount';

import './BoostEdit.scss';

class BoostEdit extends React.Component {
  constructor(props) {
    super();

    this.boostsService = inject('BoostsService');
    this.historyService = inject('HistoryService');
    this.clientsService = inject('ClientsService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: true,
      mode: props.match.params.mode,
      boost: null,
      clients: [],
      audienceProperties: []
    };

    unmountDecorator(this);
  }

  render() {
    const state = this.state;
    const title = capitalize(`${state.mode} boost`);
    
    return <div className="boost-edit">
      <PageBreadcrumb title={title} link={{ to: '/boosts', text: 'Boosts' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        {this.renderUserCount()}
        <BoostForm mode={state.mode}
          boost={state.boost}
          clients={state.clients}
          audienceProperties={state.audienceProperties}
          onSubmit={this.formSubmit}/>
      </div>
    </div>;
  }

  renderUserCount() {
    const state = this.state;
    return state.boost && state.mode === 'view' && <BoostUserCount boost={state.boost}/>;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const boostId = this.props.match.params.id;
    forkJoin(
      boostId ? this.boostsService.getBoost(boostId) : of(null),
      this.clientsService.getClients()
    ).pipe(
      takeUntil(this.unmount)
    ).subscribe(([boost, clients]) => {
      this.setState({ boost, clients, loading: false });
    });
  }

  formSubmit = (boostBody, audienceBody) => {
    this.setState({ loading: true });

    this.boostsService.createBoost(boostBody, audienceBody).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({ loading: false });
      this.historyService.push('/boosts');
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }
}

export default BoostEdit;