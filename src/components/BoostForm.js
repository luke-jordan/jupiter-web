import React from 'react';
import moment from 'moment';

import { authHeader } from '../helpers/auth-header';

export class BoostCreateForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            label: 'Simple test 1',
            type: 'SIMPLE',
            category: 'TIME_LIMITED',
            currency: 'ZAR',
            perUserAmount: 10,
            requiredSave: 100,
            audience: 'whole_universe',
            sampleSize: 0,
            source: 'primary_bonus_pool',
            messageOfferFlag: 'SIMPLE_BOOST::TIME_LIMITED::OFFERED',
            messageRedeemedFlag: 'SIMPLE_BOOST::TIME_LIMITED::OFFERED',
            expiryTime: 'END_OF_DAY',
            totalBudget: 1000
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        console.log('SUBMITTING >>>>');
        const bodyOfRequest = { };
        
        // set the type & category, where the boost is funded from, and how much it offers to each user
        bodyOfRequest.boostTypeCategory = `${this.state.type}::${this.state.category}`;
        bodyOfRequest.boostAmountOffered = `${this.state.perUserAmount}::WHOLE_CURRENCY::${this.state.currency}`;
        bodyOfRequest.boostSource = {
            bonusPoolId: this.state.source,
            clientId: 'za_client_co',
            floatId: 'zar_mmkt_float'
        };

        // set the triggers for redemption
        const redemptionThreshold = `${this.state.requiredSave}::WHOLE_CURRENCY::${this.state.currency}`;
        const redemptionCondition = `save_event_greater_than #{${redemptionThreshold}}`;
        bodyOfRequest.statusConditions = {
            'REDEEMED': [redemptionCondition]
        };

        // set who gets offered it
        bodyOfRequest.boostAudience = 'GENERAL';
        let selectionMethod;
        if (this.state.audience === 'random_sample') {
            selectionMethod = `${this.state.audience} #{${this.state.sampleSize / 100}}`;
        } else {
            selectionMethod = this.state.audience;
        }
        bodyOfRequest.boostAudienceSelection = `${selectionMethod} from #{{"client_id":"za_client_co"}}`;

        // finally set the expiry conditions
        bodyOfRequest.boostBudget = `${this.state.totalBudget}::WHOLE_CURRENCY::${this.state.currency}`;
        
        let endTimeMoment = moment().add(1, 'day');
        switch (this.state.expiryTime) {
            case 'END_OF_DAY':
                endTimeMoment = moment().endOf('day');
                break;
            default:
                console.error('Unkown end time selection');
        }
        bodyOfRequest.endTimeMillis = endTimeMoment.valueOf();

        console.log('Sending request: ', bodyOfRequest);
        bodyOfRequest.messageInstructionFlags = {
            'OFFERED': [{ accountId: 'ALL', msgInstructionFlag: this.state.messageOfferFlag }],
            'REDEEMED': [{ accountId: 'ALL', msgInstructionFlag: this.state.messageRedeemedFlag }]
        };

        const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(bodyOfRequest) };

        fetch('https://staging-admin.jupiterapp.net/boost/create', requestOptions).then((resp) => {
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
                    Boost label:
                    <input type="text" name="label" value={this.state.label} onChange={this.handleChange} />
                </label>
                <label>
                    Boost type:
                    <select name="type" value={this.state.type} onChange={this.handleChange}>
                        <option value="SIMPLE">Simple (e.g., time limited)</option>
                        <option value="GAME">Game</option>
                    </select>
                </label>
                <label>
                    Boost category:
                    <select name="category" value={this.state.type} onChange={this.handleChange}>
                        <option value="TIME_LIMITED">Time limited</option>
                    </select>
                </label>
                <label>
                    When does it expire?
                    <select name="action" value={this.state.action} onChange={this.handleChange}>
                        <option value="END_OF_DAY">End of today</option>
                        <option value="END_OF_TOMORROW">End tomorrow</option>
                        <option value="END_OF_WEEK">End week</option>
                    </select>
                </label>
                <label>
                    Who is eligible? Boost audience:
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
                    How much must a user save to get it?
                    <input name="requiredSave" type="number" value={this.state.requiredSave} onChange={this.handleChange} />
                </label>
                <label>
                    How much is it worth (per user)?
                    <input name="perUserAmount" type="number" value={this.state.perUserAmount} onChange={this.handleChange} />
                </label>
                <label>
                    What is the total budget?
                    <input name="totalBudget" type="number" value={this.state.totalBudget} onChange={this.handleChange} />
                </label>
                <label>
                    What bonus pool is it from?
                    <select name="source" value={this.state.source} onChange={this.handleChange}>
                        <option value="primary_bonus_pool">primary_bonus_pool</option>
                    </select>
                </label>

                
                <div>
                    <input type="submit" value="Submit" />
                </div>
            </form>
        )
    }
}