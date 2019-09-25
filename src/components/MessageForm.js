import React from 'react';

import { authHeader } from '../helpers/auth-header';

export class MessageCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Referral test 1',
            body: 'Hello #{user_first_name}! Your friend joined. We gave you a boost. Hooray! Why not save more?',
            type: 'CARD',
            action: 'ADD_CASH',
            audience: 'whole_universe',
            sampleSize: 0,
            msgPriority: 0,
            recurrence: 'EVENT_DRIVEN',
            recurrenceParameters: {
                minIntervalDays: 0,
                maxInQueue: 0
            },
            eventTypeCategory: 'REFERRAL::REDEEMED::REFERRER'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        if (target.name.startsWith('recurrenceParameters')) {
            const currentParams = this.state.recurrenceParameters;
            const paramKey = target.name.substring('recurrenceParameters.'.length);
            currentParams[paramKey] = target.value;
            this.setState({ recurrenceParameters: currentParams });
            console.log('R params: ', this.state.recurrenceParameters);
        } else {
            this.setState({ [target.name]: target.value });
        }
    }

    handleSubmit(event) {
        console.log('SUBMITTING >>>>');
        const bodyOfRequest = { };
        
        // then we add some standard params
        bodyOfRequest.audienceType = 'GROUP';

        bodyOfRequest.presentationType = this.state.recurrence;
        if (this.state.recurrence === 'RECURRING') {
            bodyOfRequest.recurrenceParameters = this.state.recurrenceParameters;
        } else if (this.state.recurrence === 'EVENT_DRIVEN') {
            bodyOfRequest.eventTypeCategory = this.state.eventTypeCategory;
        }
        
        bodyOfRequest.templates = { template: {
            'DEFAULT': {
                title: this.state.title,
                body: this.state.body,
                display: {
                    type: this.state.type,
                },
                actionToTake: this.state.action
            }
        }};

        bodyOfRequest.messagePriority = parseInt(this.state.msgPriority, 10);

        let selectionMethod;
        if (this.state.audience === 'random_sample') {
            selectionMethod = `${this.state.audience} #{${this.state.sampleSize / 100}}`;
        } else {
            selectionMethod = this.state.audience;
        }

        bodyOfRequest.selectionInstruction = `${selectionMethod} from #{{"client_id":"za_client_co"}}`;

        console.log('Sending request: ', bodyOfRequest);

        const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(bodyOfRequest) };

        fetch('https://staging-admin.jupiterapp.net/message/instruct/create', requestOptions).then((resp) => {
            console.log('SUCCESS! : ', resp);
        }).catch((err) => {
            console.log('ERROR! : ', err);
        });

        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Message title:
                    <input type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                </label>
                <label>
                    Message body:
                    <textarea name="body" value={this.state.body} onChange={this.handleChange}></textarea>
                </label>
                <label>
                    Message type:
                    <select name="type" value={this.state.type} onChange={this.handleChange}>
                        <option value="CARD">Card</option>
                        <option value="MODAL">Modal</option>
                        <option value="PUSH">Push notification</option>
                    </select>
                </label>
                <label>
                    Quick action:
                    <select name="action" value={this.state.action} onChange={this.handleChange}>
                        <option value="VIEW_HISTORY">View history</option>
                        <option value="ADD_CASH">Add cash</option>
                        <option value="VISIT_WEB">Visit website</option>
                    </select>
                </label>
                <label>
                    Message audience:
                    <select name="audience" value={this.state.audience} onChange={this.handleChange}>
                        <option value="whole_universe">All users @ client</option>
                        <option value="random_sample">Sample of client users</option>
                    </select>
                </label>
                { this.state.audience === 'random_sample' &&
                    <label>
                        Proportion of client:
                        <input name="sampleSize" type="number" min="0" max="100" value={this.state.sampleSize} onChange={this.handleChange} />
                    </label>
                }
                <label>
                    How high a priority is it? (0 = lowest, no upper bound)
                    <input name="msgPriority" type="text" value={this.state.msgPriority} onChange={this.handleChange} />
                </label>
                <label>
                    When will it be shown?
                    <select name="recurrence" value={this.state.recurrence} onChange={this.handleChange}>
                        <option value="ONCE_OFF">Only now</option>
                        <option value="RECURRING">Repeatedly</option>
                        <option value="EVENT_DRIVEN">When some event occurs</option>
                    </select>
                </label>
                {this.state.recurrence === 'RECURRING' && 
                    <div>
                        <label>
                            Minimun days between messages:
                            <input type="number" name="recurrenceParameters.minIntervalDays" value={this.state.recurrenceParameters.minIntervalDays} 
                                onChange={this.handleChange} />
                        </label>
                        <label>
                            Skip if more than X messages:
                            <input type="number" name="recurrenceParameters.maxInQueue" value={this.state.recurrenceParameters.maxInQueue} 
                                onChange={this.handleChange} />
                        </label>
                    </div>
                }
                {this.state.recurrence === 'EVENT_DRIVEN' &&
                    <label>
                        Event type and category:
                        <input name="eventTypeCategory" type="text" value={this.state.eventTypeCategory} onChange={this.handleChange} />
                    </label>
                }
                <div>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        )
    }
}