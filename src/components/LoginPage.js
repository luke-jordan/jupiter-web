import React from 'react';

import { authenticationService } from '../services/authentication.service';

export class LoginPage extends React.Component {
    constructor (props) {
        super(props);

        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }

        this.state = {
            phoneOrEmail: 'someone@jupitersave.com',
            password: 'holy_CHRYSALIS_hatching9531'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        this.setState({ [target.name]: target.value });
    }

    handleSubmit(event) {
        authenticationService.login(this.state.phoneOrEmail, this.state.password).then((response) => {
            console.log('Response: ', response);
            const { from } = this.props.location.state || { from: { pathname: "/" } };
            this.props.history.push(from);
        }).catch((err) => {
            console.log('Error: ', err);
        });
        event.preventDefault();
    }
    
    render() {
        return (
        <form onSubmit={this.handleSubmit}>
            <div>
                <label>
                    Email or phone:
                    <input type="text" name="phoneOrEmail" value={this.state.phoneOrEmail} onChange={this.handleChange}/>
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                </label>
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form>
        )
    }
}