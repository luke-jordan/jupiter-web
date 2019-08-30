import React from 'react';

import { authHeader } from '../helpers/auth-header';

export class MessageCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Testing 123',
            body: 'Make this thing work please',
            type: 'CARD',
            action: 'ADD_CASH',
            audience: 'whole_universe',
            sampleSize: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        const bodyOfRequest = { ...this.state };
        
        // then we add some standard params
        bodyOfRequest.presentationType = 'ONCE_OFF';
        bodyOfRequest.audienceType = 'GROUP';

        const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(bodyOfRequest) };
        fetch('https://staging.jupiterapp.net/message/instruct', requestOptions).then((resp) => {
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
                        <option>Card</option>
                        <option>Modal</option>
                        <option>Push notification</option>
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
                <label>
                    Proportion of client:
                    <input name="sampleSize" type="number" min="0" max="100" value={this.state.sampleSize} onChange={this.handleChange} />
                </label>
                <div>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        )
    }
}