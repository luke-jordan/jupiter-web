import React from 'react';

import { unmountDecorator } from 'src/core/utils';

import './UsersList.scss';
import { NavLink } from 'react-router-dom';

class UsersList extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false
        };

        unmountDecorator(this);
    }

    render() {
        return (
            <div className="user-table">
                {this.renderTable()}
            </div>
        );
    }

    renderTable() {
        const rows = this.props.accountList.map((account) => {
            return (
                <tr key={account.accountId}>
                    <td>{account.formattedCreationTime}</td>
                    <td>{account.humanRef}</td>
                    <td>{account.saveCount}</td>
                    <td>
                        <NavLink className="link" to={`/users/?searchValue=${account.humanRef}&searchType=bankReference`}>
                            View user
                        </NavLink>
                    </td>
                </tr>
            )
        });

        return <table className="table">
            <thead>
                <tr>
                    <th>Date opened</th>
                    <th>Reference</th>
                    <th>Number saves</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    }
}

export default UsersList;