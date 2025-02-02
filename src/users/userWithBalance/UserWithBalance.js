import React from 'react';

import './UserWithBalance.scss';
import userIcon from 'src/assets/images/user-circle-blue.svg';

const UserWithBalance = props => {
  const user = props.user;
  let userContact = '';
  if (user.emailAddress && user.phoneNumber) {
    userContact = `${user.emailAddress} // ${user.phoneNumber}`;
  } else {
    userContact = user.emailAddress || user.phoneNumber;
  }

  return <div className="user-with-balance">
    <div className="user-info">
      <img className="user-image" src={userIcon} alt="user"/>
      <div className="user-name">
        <div className="user-name-text">{user.fullName}</div>
        <div className="user-start-date">User since {user.formattedStartDate}, contact: {userContact}</div>
      </div>
    </div>
    <div className="user-balance">
      <div className="balance-label">Settled jupiter balance</div>
      <div className="balance-value">{user.userBalance.balanceStartDayOrLastSettled.amountMoney}</div>
    </div>
  </div>;
};

export default UserWithBalance;