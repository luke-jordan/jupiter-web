import React from 'react';

import { inject, unmountDecorator, capitalize } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';

class SnippetsEdit extends React.Component {

    constructor(props) {
        super(props);

        this.snippetsService = inject('SnippetsService');
        this.clientService = inject('ClientsService');
        this.modalService = inject('ModalService');

        this.state = {
            loading: true,
            mode: props.match.params.mode,
            snippet: null,
            clients: []
        };

        unmountDecorator(this);
    }

    renderSnippetForm() {

    }

    render() {
        const title = capitalize(`${this.state.mode} snippet`);

        return <div className="snippet-edit">
            <PageBreadcrumb title={title} link={{ to: '/snippets', text: 'Snippets' }}/>
            {this.state.loading && <Spinner overlay/>}
            {this.renderSnippetForm}
        </div>
    }
}

export default SnippetsEdit;
