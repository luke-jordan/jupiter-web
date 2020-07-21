import React from 'react';
import { NavLink } from 'react-router-dom';
import { takeUntil } from 'rxjs/operators';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';

import { unmountDecorator, inject } from 'src/core/utils';

import './SnippetsList.scss';
import addIcon from 'src/assets/images/add.svg';

class SnippetsList extends React.Component {
    
    constructor() {
        super();

        this.state = {
            loading: true,
            snippets: []
        }

        this.snippetsService = inject('SnippetsService');

        unmountDecorator(this);
    };

    componentDidMount() {
        this.snippetsService.getSnippets().pipe(
            takeUntil(this.unmount)
        ).subscribe(snippets => {
            this.setState({
                loading: false,
                snippets: snippets || [],
            })
        }, error => {
            console.log('Error fetching snippets: ', error);
        });
        
    }

    renderSnippetRow = (snippet) => (
        <tr key={snippet.snippetId}>
            <td></td>
            <td>{snippet.title}</td>
            <td>{snippet.body.substring(0, 60)}</td>
            <td>{snippet.previewMode ? 'Preview' : 'Live'}</td>
            <td>
                <DropdownMenu items={[
                    { text: 'View', link: `/snippets/view/${snippet.snippetId}` },
                    { text: 'Edit', link: `/snippets/edit/${snippet.snippetId}` }
                ]}/>
            </td>
        </tr>
    );

    renderTable() {
        const { snippets } = this.state;
        return <table className="table">
            <thead>
                <tr>
                    <th style={{ width: 40 }}/>
                    <th>Title</th>
                    <th>Snippet</th>
                    <th>Last updated</th>
                    <th style={{ width: 40 }}/>
                </tr>
            </thead>
            <tbody>
                {snippets.length > 0 
                    ? snippets.map(this.renderSnippetRow) 
                    :  <tr><td className="no-data" colSpan="9">No snippets</td></tr>
                }
            </tbody>
        </table>
    }

    renderActions() {
        return (
            <div className="page-actions">
                <div className="action-buttons">
                    <NavLink to="/snippets/new" className="button">
                        New snippet <img className="button-icon" src={addIcon} alt="add"/>
                    </NavLink>
                </div>
            </div>
        )
    }

    render() {
        return <div className="snippets-list">
            <PageBreadcrumb title="Snippets" link={{ to: '/', text: 'Home' }}/>
            <div className="page-content">
                {this.state.loading && <Spinner overlay/>}
                {this.renderActions()}
                {this.renderTable()}
            </div>
        </div>

    }
}

export default SnippetsList;
