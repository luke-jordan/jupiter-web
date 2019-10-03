import React from 'react';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import './MessagesList.scss';

const MessagesList = props => {
  return <div className="messages-list">
    <PageBreadcrumb title="Messages" link={{ to: '/', text: 'Home' }}/>
  </div>;
}

export default MessagesList;