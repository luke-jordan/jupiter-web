import React from 'react';

import './UserWithBalance.scss';
import userIcon from 'src/assets/images/user-circle-blue.svg';

const UserWithBalance = props => {
  const user = props.user;
  return <div className="user-with-balance">
    <div className="user-info">
      <img className="user-image" src={userIcon} alt="user"/>
      <div className="user-name">
        <div className="user-name-text">{user.fullName}</div>
        <div className="user-start-date">User since {user.formattedStartDate}</div>
      </div>
    </div>
    <div className="user-balance">
      <div className="balance-label">Total jupiter balance</div>
      <div className="balance-value">{user.userBalance.currentBalance.amountMoney}</div>
    </div>
  </div>;
};

export default UserWithBalance;