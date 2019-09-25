import React from 'react';
import { Link } from 'react-router-dom';

import moment from 'moment';

import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/response-handler';

// sorts from most recent to earliest
const boostSorter = (boostA, boostB) => {
    const startTimeA = moment(boostA.creationTime);
    const startTimeB = moment(boostB.creationTime);
    return startTimeA.isAfter(startTimeB) ? -1 : 1;
};

export class BoostTable extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            boosts: []
        };
    }

    async componentDidMount() {
        console.log('Mounted');
        this.refreshBoosts();
    }

    async refreshBoosts() {
        try {
            const requestOptions = { method: 'GET', headers: authHeader() };
            const messageList = await fetch('https://staging-admin.jupiterapp.net/boost/list', requestOptions).then(handleResponse);
            const sortedList = messageList.sort(boostSorter);
            console.log('Sorted list: ', sortedList);
            this.setState({ boosts: sortedList });
        } catch (err) {
            console.log('Error with call: ', err);
        }
    }

    // async deactivateMessages(instructionId) {
    //     try {
    //         const requestBody = {
    //             instructionId,
    //             updateValues: {
    //                 active: false
    //             }
    //         };

    //         const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(requestBody) };
    //         const resultOfUpdate = await fetch('https://staging-admin.jupiterapp.net/message/instruct/update', requestOptions).then(handleResponse);

    //         console.log('Result of updating: ', resultOfUpdate);
    //         await this.refreshMessages();
    //         console.log('All done');
            
    //     } catch (err) {
    //         console.log('Error calling deactivate: ', err);
    //     }
    // }

    render() {
        const boosts = this.state.boosts;
        const boostList = boosts.map((boost) => {
            // const toPrint = JSON.stringify(message);
            const startTime = moment(boost.startTime).format('MMM Do, h:mm');
            
            const endTimeMoment = moment(boost.endTime);
            const endTime = endTimeMoment.isAfter(moment().add(10, 'years')) ? 'None' : endTimeMoment.format('MMMM Do, h:mm');
            const type = `${boost.boostType}::${boost.boostCategory}`;

            return (
                <tr key={boost.boostId}>
                    <td>{ type }</td>
                    <td>Label: { boost.label }</td>
                    <td>{ startTime }</td>
                    <td>{ endTime }</td>
                    <td>{ boost.totalUsersCount }</td>
                    {/* <td><button className="btn" onClick={() => this.deactivateMessages(boost.instructionId)}>Deactivate</button></td> */}
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
                            <th>Start</th>
                            <th>End</th>
                            <th># Msgs</th>
                            <th>Queued</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        { boostList }
                    </tbody>
                </table>
                <Link to="/boosts/create" className="btn">Create boost</Link>
            </div>
        )
    }
}