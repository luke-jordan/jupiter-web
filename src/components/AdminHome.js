import React from 'react';

import { authenticationService } from '../services/authentication.service';
import { balanceService } from '../services/balance.service';

import { MessageCreateForm } from './MessageForm';

const UNIT_DIVISORS = {
    'HUNDREDTH_CENT': 100 * 100,
    'WHOLE_CENT': 100,
    'WHOLE_CURRENCY': 1 
};

export class AdminHomePage extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            ownBalance: {},
            displayedBalance: null
        };

        // console.log('Current user: ', this.state.currentUser);
    }

    componentDidMount() {
        balanceService.fetchOwnBalance().then((response) => {
            console.log('Balance response: ', response);
            this.setState({ ownBalance: response.currentBalance });
            this.calculateBalance();
        });
    }

    calculateBalance() {
        if (!this.state.ownBalance || Object.keys(this.state.ownBalance).length === 0) {
            this.setState({ displayedBalance: null});
        }

        const balanceDict = this.state.ownBalance;
        const dividedAmount = balanceDict.amount / UNIT_DIVISORS[balanceDict.unit];

        const numberFormat = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: balanceDict.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        });

        const formattedBalance = numberFormat.format(dividedAmount);
        console.log('Formatted balance: ', formattedBalance);
        this.setState({ displayedBalance: numberFormat.format(dividedAmount) });
    }

    render() {
        const firstName = this.state.currentUser && this.state.currentUser.profile ? this.state.currentUser.profile.personalName : 'Someone';
        return (
            <div>
                <h1>Hello {firstName}</h1>
                <h2>You are on the home screen</h2>
                <p>Your balance is { this.state.displayedBalance }</p>
                <div>
                    <MessageCreateForm />
                </div>
            </div>
        )
    }
}