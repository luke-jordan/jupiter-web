import React from 'react';

import Modal from '../modal/Modal';

import './EventsModal.scss';

const events = [
    ['SAVING_PAYMENT_SUCCESSFUL', 'Save completed'], 
    ['ADMIN_SETTLED_WITHDRAWAL', 'Withdrawal finished'],
    ['USER_CREATED_ACCOUNT', 'Account opened'],
    ['BOOST_REDEEMED', 'Boost redeemed'],
    ['SAVING_EVENT_CANCELLED', 'Save cancelled'],
    ['WITHDRAWAL_EVENT_INITIATED', 'Withdrawal initiated'],
    ['WITHDRAWAL_EVENT_CONFIRMED', 'Withdrawal confirmed'],
    ['BOOST_TOURNAMENT_WON', 'Boost tournament won'],
    ['FRIEND_REQUEST_RECEIVED', 'Friend request received'],
    ['FRIEND_REQUEST_INITIATED_ACCEPTED', 'Friend request completed'],
    ['ADDED_TO_FRIEND_SAVING_POOL', 'Added to a saving pot'],
    ['SAVING_POOL_DEACTIVATED_BY_CREATOR', 'Saving pot deactivated'],
    ['INVITED_TO_FRIEND_TOURNAMENT', 'Invited to a buddy tournament'],
    ['REFERRAL_CODE_USED', 'Someone used the user referral, boost pending'],
    ['REFERRAL_BOOST_REVOKED', 'A referred user withdrew early, revoking boost']
];

const renderTableLines = (systemName, humanName) => (<tr key={systemName}><td>{systemName}</td><td>{humanName}</td></tr>);

const EventsListModal = ({ showEventsModal, onClose }) => 
    <Modal open={showEventsModal} header="Available message events"
        className="system-events-list" onClose={onClose}>
    <table className="table">
        <thead><tr><th>System name</th><th>Human name</th></tr></thead>
        <tbody>
            {events.map((eventPair) => renderTableLines(...eventPair))}
        </tbody>
    </table>
</Modal>;

export default EventsListModal;
