import React from 'react';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import './MessageCreate.scss';

const MessageCreate = props => {
  return <div className="message-create">
    <PageBreadcrumb title="New message" link={{ to: '/messages', text: 'Messages' }}/>
  </div>;
}

export default MessageCreate;