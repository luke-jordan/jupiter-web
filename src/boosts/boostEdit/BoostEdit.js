import React from 'react';
import { of, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { capitalize, inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import BoostForm from '../boostForm/BoostForm';

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
    const title = capitalize(`${this.state.mode} boost`);
    
    return <div className="boost-edit">
      <PageBreadcrumb title={title} link={{ to: '/boosts', text: 'Boosts' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        <BoostForm mode={state.mode}
          boost={state.boost}
          clients={state.clients}
          audienceProperties={state.audienceProperties}
          onSubmit={this.formSubmit}/>
      </div>
    </div>;
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    forkJoin(
      this.state.mode !== 'new' ? this.boostsService.getBoost(this.props.match.params.id) : of({}),
      this.clientsService.getClients()
    ).pipe(
      takeUntil(this.unmount)
    ).subscribe(([boost, clients]) => {
      this.setState({ boost, clients, loading: false });
    });
  }

  formSubmit = (boostData, audienceData) => {
    const mode = this.state.mode;

    if (mode === 'view') {
      this.setState({ mode: 'edit' });
      return;
    }

    let obs;

    if (mode === 'edit') {
      // TODO: boost update (api needed)
      const boostId = this.props.match.params.id;
      console.log(boostId);
      this.modalService.openInfo('Info', 'Boost update API is not implemented yet');
      return;
    } else {
      // new or duplicate
      obs = this.boostsService.createBoost(boostData, audienceData);
    }

    this.setState({ loading: true });

    obs.pipe(takeUntil(this.unmount)).subscribe(() => {
      this.setState({ loading: false });
      this.historyService.push('/boosts');
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }
}

export default BoostEdit;