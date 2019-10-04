import React from 'react';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';

import './MessageEdit.scss';

class MessageEdit extends React.Component {
  render() {
    const { mode } = this.props.match.params;
    return <div className="message-edit">
      <PageBreadcrumb title={`${mode} message`} link={{ to: '/messages', text: 'Messages' }}/>
    </div>;
  }
}

export default MessageEdit;