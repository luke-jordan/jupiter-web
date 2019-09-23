import React from 'react';
import moment from 'moment';

import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/response-handler';

// sorts from most recent to earliest
const msgInstructSorter = (instructA, instructB) => {
    const startTimeA = moment(instructA.startTime);
    const startTimeB = moment(instructB.startTime);
    return startTimeA.isAfter(startTimeB) ? -1 : 1;
};

export class MessageTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            messages: []
        };
    }

    async componentDidMount() {
        console.log('Mounted');
        this.refreshMessages();
    }

    async refreshMessages() {
        try {
            const requestOptions = { method: 'GET', headers: authHeader() };
            const messageList = await fetch('https://staging.jupiterapp.net/message/instruct/list', requestOptions).then(handleResponse);
            const sortedList = messageList.sort(msgInstructSorter);
            console.log('Sorted list: ', sortedList);
            this.setState({ messages: sortedList });
        } catch (err) {
            console.log('Error with call: ', err);
        }
    }

    async deactivateMessages(instructionId) {
        try {
            const requestBody = {
                instructionId,
                updateValues: {
                    active: false
                }
            };

            const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(requestBody) };
            const resultOfUpdate = await fetch('https://staging.jupiterapp.net/message/instruct/update', requestOptions).then(handleResponse);

            console.log('Result of updating: ', resultOfUpdate);
            await this.refreshMessages();
            console.log('All done');
            
        } catch (err) {
            console.log('Error calling deactivate: ', err);
        }
    }

    render() {
        const messages = this.state.messages;
        const messageList = messages.map((message) => {
            // const toPrint = JSON.stringify(message);
            const startTime = moment(message.startTime).format('MMM Do, h:mm');
            
            const endTimeMoment = moment(message.endTime);
            const endTime = endTimeMoment.isAfter(moment().add(10, 'years')) ? 'None' : endTimeMoment.format('MMMM Do, h:mm');
            const type = message.presentationType === 'ONCE_OFF' ? 'Once off' :
                message.presentationType === 'RECURRING' ? 'Recurring' : 'Event';

            return (
                <tr key={message.instructionId}>
                    <td>{ type }{message.presentationType === 'EVENT_DRIVEN' && <p>{message.flags}</p>}</td>
                    <td>{ message.templates.template.DEFAULT.title }</td>
                    <td>{ message.templates.template.DEFAULT.display.type }</td>
                    <td>{ startTime }</td>
                    <td>{ endTime }</td>
                    <td>{ message.totalMessageCount }</td>
                    <td>{ message.unfetchedMessageCount }</td>
                    <td>{ message.messagePriority } </td>
                    <td><button className="btn" onClick={() => this.deactivateMessages(message.instructionId)}>Deactivate</button></td>
                </tr>
            );
        });

        return (
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Title</th>
                            <th>Display</th>
                            <th>Start</th>
                            <th>End</th>
                            <th># Msgs</th>
                            <th>Queued</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        { messageList }
                    </tbody>
                </table>
            </div>
        )
    }
}