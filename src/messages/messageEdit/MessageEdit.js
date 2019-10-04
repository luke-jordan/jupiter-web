import React from 'react';

import { capitalize } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';

import './MessageEdit.scss';

class MessageEdit extends React.Component {
  render() {
    const { mode } = this.props.match.params;
    const title = capitalize(`${mode} message`);
    return <div className="message-edit">
      <PageBreadcrumb title={title} link={{ to: '/messages', text: 'Messages' }}/>
    </div>;
  }
}

export default MessageEdit;