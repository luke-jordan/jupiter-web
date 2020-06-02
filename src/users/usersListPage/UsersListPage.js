import React from 'react';

import Spinner from 'src/components/spinner/Spinner';

import { unmountDecorator, inject } from 'src/core/utils';
import { takeUntil } from 'rxjs/operators';
import UsersList from '../usersList/UsersList';

class UsersListPage extends React.Component {

    constructor(props) {
        super();

        this.state = {
            loading: true,
            accounts: props.accounts || [],
            displayAccounts: []
        };

        this.usersService = inject('UsersService');

        unmountDecorator(this);
    }

    componentDidMount() {
        // first branch means passed from parent
        if (Array.isArray(this.state.accounts) && this.state.accounts.length > 0) {
            this.setState({ loading: false, displayAccounts: this.sortAccounts(this.state.accounts) });
        } else {
            this.usersService.getAccountsList().pipe(
                takeUntil(this.unmount)
            ).subscribe(accounts => {
                this.setState({ loading: false, accounts, displayAccounts: this.sortAccounts(accounts) })
            })  
        }
    }


    render() {
        return <div className="user-list-page">
            <div className="page-content">
                {this.renderContent()}
            </div>
        </div>
    }

    renderContent() {
        const state = this.state;
    
        if (state.loading || state.displayAccounts) {
          return <>
            {state.loading && <Spinner overlay/>}
            {state.displayAccounts && this.renderUserTable()}
          </>;
        }
    
        return null;
    }

    renderUserTable() {
        return <>
            <div className="user-list-title" style={{ fontSize: '22px', textAlign: 'center', marginBottom: 15 }}>List of user accounts</div>
            <UsersList accountList={this.state.displayAccounts} />
        </>            
    }

    sortAccounts(accounts) {
        const clonedAccounts = [...accounts]; // as sorting happens in place and we do not want to alter the original
        return clonedAccounts.sort((accountA, accountB) => accountB.creationTime - accountA.creationTime);
    }

}

export default UsersListPage;
