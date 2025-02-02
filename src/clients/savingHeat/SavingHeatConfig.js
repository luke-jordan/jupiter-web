import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Input from 'src/components/input/Input';

import Modal from 'src/components/modal/Modal';
import EventsListModal from 'src/components/eventsModal/EventsModal';

const AVAILABLE_COLORS = [
  ['PURPLE', '#5353A1']
];

class SavingHeatConfig extends React.Component {

  constructor(props) {
    super();

        this.clientsService = inject('ClientsService');
        this.modalService = inject('ModalService');

        const routeParams = props.match.params;

        this.state = {
            clientId: routeParams.clientId,
            floatId: routeParams.floatId,

            eventPointItems: [],
            editPoints: false,
            showEventsModal: false,

            levelConfigurations: [],
            editLevels: false,
            showColorModal: false,
        }

        unmountDecorator(this);
    }

    componentDidMount() {
        this.fetchCurrentConfig();
    }

    fetchCurrentConfig() {
        this.clientsService.getHeatConfig(this.state.clientId, this.state.floatId)
            .pipe(takeUntil(this.unmount))
            .subscribe(this.transformHeatConfig, err => console.log(err));
    }

    transformHeatConfig = serverResult => {
        console.log('Received heat config from server: ', serverResult);
        this.setState({ 
            eventPointItems: serverResult.eventPointItems,
            levelConfigurations: serverResult.levelThresholds
        });
    }

    editClick = (editStateKey) => this.setState({ [editStateKey]: true });

    cancelClick = (editStateKey) => {
        this.setState({ [editStateKey]: false });
    }

    // new entities need to have their id removed (as it is set locally just for convenience), and client and float ids added
    removeIdAndAddClientFloat = (entity, idKey) => {
        if (!entity[idKey].startsWith('NEW')) {
            return entity;
        }
        delete entity[idKey];
        entity.clientId = this.state.clientId;
        entity.floatId = this.state.floatId;
        return entity;
    }

    renderEditButton = (editStateKey, onSaveClick) => 
        <div className="header-actions">
        {this.state[editStateKey] ?
        <>
            <button className="button button-outline button-small" onClick={onSaveClick}>
                Save
            </button>
            <button className="link text-underline" onClick={() => this.cancelClick(editStateKey)}>Cancel</button>
        </> :
        <button className="button button-outline button-small" onClick={() => this.editClick(editStateKey)}>Edit</button>
        }
    </div>

    // //////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////////// EVENT POINTS SECTION /////////////////////////////
    // ////////////////////////////////////////////////////////////////////////////////////

    changeEventPointProperty = event => {
        const { name, value } = event.target;
        const [eventPointMatchId, propertyKey] = name.split('::');

        const { eventPointItems: oldPointItems } = this.state;
        const eventPointIndex = oldPointItems.findIndex((item) => item.eventPointMatchId === eventPointMatchId);
        
        const alteredPointItem = { ...oldPointItems[eventPointIndex], [propertyKey]: value };
        const eventPointItems = [...oldPointItems];
        eventPointItems[eventPointIndex] = alteredPointItem;
        
        this.setState({ eventPointItems });
    }

    addEventPointItem = () => {
      const { eventPointItems: oldPointItems } = this.state;
      const numberNewItems = oldPointItems.filter((item) => item.eventPointMatchId.startsWith('NEW')).length;
      const newPointItems = [...oldPointItems, { eventPointMatchId: `NEW_${numberNewItems}`, eventType: '', numberPoints: 0 }];
      this.setState({ eventPointItems: newPointItems });
    }

    submitEventPointEdits = () => {
        const eventPointItems = this.state.eventPointItems.map((eventPointItem) => this.removeIdAndAddClientFloat(eventPointItem, 'eventPointMatchId'));
        console.log('Submitting event point items: ', eventPointItems);

        this.clientsService.updateEventHeatPoints({ eventPointItems }).pipe(takeUntil(this.unmount))
            .subscribe((result) => {
                console.log('Update result: ', result);
                this.modalService.openInfo('Done!', 'Points per event updated');
                this.fetchCurrentConfig(); // so updates show
                this.setState({ editPoints: false });
            }, err => {
                console.log('Error submitting changed items! : ', err);
                this.modalService.openCommonError();
            })
    }

    renderEventPointList = () => (
    <>
        <div className="section-header">
            <div className="header-text">Heat points per event</div>
            {this.renderEditButton('editPoints', this.submitEventPointEdits)}
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Event name</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
              {this.state.eventPointItems.map((eventPointItem) => (
                <tr key={eventPointItem.eventPointMatchId}>
                  <td>
                    {this.state.editPoints && eventPointItem.eventPointMatchId.startsWith('NEW') ?
                      <Input type="text" name={`${eventPointItem.eventPointMatchId}::eventType`} value={eventPointItem.eventType} 
                        onChange={this.changeEventPointProperty} />
                    : eventPointItem.eventType}
                  </td>
                  <td>
                      {this.state.editPoints ? <>
                          <Input type="number" name={`${eventPointItem.eventPointMatchId}::numberPoints`} 
                            value={eventPointItem.numberPoints} onChange={this.changeEventPointProperty} />
                      </>: `${eventPointItem.numberPoints}`}
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
        <button className="link text-underline" onClick={this.showEventModal}>Show Events</button>
        {this.state.editPoints && <div className="grid-row" style={{ marginTop: 20 }}>
            <div className="grid-col">
                <button className="button" onClick={this.addEventPointItem}>+ Add</button>
            </div>
        </div>}
    </>
    );

    // //////////////////////////////////////////////////////////////////////////////////////
    // ////////////////////////////////// LEVELS SECTION ///////////////////////////////////
    // ////////////////////////////////////////////////////////////////////////////////////

    changeLevelConfigProperty = event => {
      const { name, value } = event.target;
      const [levelId, propertyKey] = name.split('::');

      const { levelConfigurations: oldConfigurations } = this.state;
      const levelIndex = oldConfigurations.findIndex((level) => level.levelId === levelId);
      
      const alteredLevel = { ...oldConfigurations[levelIndex], [propertyKey]: value };
      const levelConfigurations = [...oldConfigurations];
      levelConfigurations[levelIndex] = alteredLevel;
      
      this.setState({ levelConfigurations });
    };

    addHeatLevel = () => {
      const { levelConfigurations: oldLevels } = this.state;
      const numberNewLevels = oldLevels.filter((item) => item.levelId.startsWith('NEW')).length;
      const newPointItems = [...oldLevels, { levelId: `NEW_${numberNewLevels}`, minimumPoints: 0 }];
      this.setState({ levelConfigurations: newPointItems });
    }

    submitHeatLevelEdits = () => {
        const levelConfigurations = this.state.levelConfigurations.map((rawConfiguration) => {
            const levelConfiguration = this.removeIdAndAddClientFloat(rawConfiguration, 'levelId');
            // i.e., avoid sending blanks
            ['levelColor', 'levelColor'].forEach((key) => (!levelConfiguration[key] || levelConfiguration[key].trim().length === 0) && delete levelConfiguration[key]);
            return levelConfiguration;
        });
        console.log('Submitting heat levels: ', this.state.levelConfigurations);
        
        this.clientsService.updateHeatLevels({ levelConfigurations }).pipe(takeUntil(this.unmount))
            .subscribe((result) => {
                console.log('Update heat level result: ', result);
                this.modalService.openInfo('Done!', 'Heat levels updated');
                this.fetchCurrentConfig(); // so updates show
                this.setState({ editLevels: false });
            }, err => {
                console.log('Error submitting changed heat levels! : ', err);
                this.modalService.openCommonError();
            })
    }

    renderLevelValueOrInput = (levelConfig, propertyName, inputType = 'text') => <td>
      {this.state.editLevels ? 
      <Input type={inputType} name={`${levelConfig.levelId}::${propertyName}`} value={levelConfig[propertyName] || ''} 
        onChange={this.changeLevelConfigProperty} />
      : levelConfig[propertyName]}
    </td>

    renderLevelConfig = (levelConfig) => (
        <tr key={levelConfig.levelId}>
            {this.renderLevelValueOrInput(levelConfig, 'levelName')}
            {this.renderLevelValueOrInput(levelConfig, 'minimumPoints', 'number')}
            {this.renderLevelValueOrInput(levelConfig, 'levelColor')}
            {this.renderLevelValueOrInput(levelConfig, 'levelColorCode')}
        </tr>
    );

    renderLevelThresholds = () => (<>
        <div className="section-header">
            <div className="header-text">Heat levels</div>
            {this.renderEditButton('editLevels', this.submitHeatLevelEdits)}
        </div>
        <table className="table">
            <thead>
                <tr>
                    <th>Level name</th>
                    <th>Point threshold</th>
                    <th>Colour</th>
                    <th>Backup color code</th>
                </tr>
            </thead>
            <tbody>
                {this.state.levelConfigurations.map(this.renderLevelConfig)}
            </tbody>
        </table>
        <button className="link text-underline" onClick={() => this.setState({ showColorModal: true })}>Show Colors</button>
        {this.state.editLevels && <div className="grid-row" style={{ marginTop: 20 }}>
            <div className="grid-col">
                <button className="button" onClick={this.addHeatLevel}>+ Add</button>
            </div>
        </div>}
    </>);

    // SOME GENERIC STUFF, INCLUDING HELPER MODALS AND OVERALL RENDERS

    showEventModal = event => {
      event.preventDefault();
      this.setState({ showEventsModal: true });
    }

    renderEventListModal() {
      return this.state.showEventsModal && 
        <EventsListModal showEventsModal={this.state.showEventsModal} onClose={() => this.setState({ showEventsModal: false })}/>
    }

    renderColorModal() {
      return this.state.showColorModal && (
        <Modal open={this.state.showColorModal} header="Standard colors" onClose={() => this.setState({ showColorModal: false })}>
          <table className="table">
              <thead><tr><th>Color name</th><th>Color code</th></tr></thead>
              <tbody>
                  {AVAILABLE_COLORS.map((colorPair) => <tr key={colorPair[0]}><td>{colorPair[0]}</td><td>{colorPair[1]}</td></tr>)}
              </tbody>
          </table>
        </Modal>
      )
    }

    renderContent = () => (
        <div className="table">
            {this.renderEventPointList()}
            {this.renderLevelThresholds()}
            {this.renderEventListModal()}
            {this.renderColorModal()}
        </div>
    );

    render() {
        return (
            <div className="client-float-page">
                <PageBreadcrumb title="Saving Heat" link={{ to: '/clients', text: 'Clients' }}/>
                <div className="page-content">{this.renderContent()}</div>
            </div>
        );
    }
}

export default SavingHeatConfig;
