import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator, capitalize } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';

import Input from 'src/components/input/Input';
import TextArea from 'src/components/textArea/TextArea';
import Select from 'src/components/select/Select';
import Checkbox from 'src/components/checkbox/Checkbox';

import Spinner from 'src/components/spinner/Spinner';

class SnippetsEdit extends React.Component {
  
    constructor(props) {
      super(props);
      
      this.snippetService = inject('SnippetsService');
      // this.clientService = inject('ClientsService');
      this.modalService = inject('ModalService');
      this.historyService = inject('HistoryService');
      
      this.state = {
        loading: false,
        mode: props.match.params.mode,
        
        snippet: {
          title: '',
          body: '',
          priority: 'NORMAL',
          countryCode: 'ZAF',
          previewMode: false,
        },
        clients: [],

        hasErrors: false,
        errors: {}
      };
      
      unmountDecorator(this);
    }

    submitButtonText = {
      new: 'Submit',
      view: 'Edit',
      edit: 'Update',
      duplicate: 'Submit'
    };  

    isView() {
      return this.state.mode === 'view';
    }

    isValid() {
      const { snippet } = this.state;
      
      const errors = {};
  
      if (!snippet.title || snippet.title.trim().length === 0) {
        errors.title = 'Remember to set a title';
      }

      if (!snippet.body || snippet.body.trim().length === 0) {
        errors.body = 'Remember to add a body'
      }
  
      if (Object.keys(errors).length === 0) {
        this.setState({ hasErrors: false });
        return true;
      }
  
      this.setState({ errors, hasErrors: true });
    }

    inputChange = event => {
      const { name, value } = event.target;
      const newState = {
        snippet: { ...this.state.snippet, [name]: value }
      };
      this.setState(newState);
    }

    submit = event => {
      event.preventDefault();
      if (!this.isValid()) {
        return;
      }
    
      // this.props.onSubmit(this.getMessageReqBody(), this.getAudienceReqBody());
      const mode = this.state.mode;

      if (mode === 'view') {
        this.setState({ mode: 'edit' });
        return;
      }

      this.setState({ loading: true });

      const { snippet } = this.state;
      const snippetBody = {
        title: snippet.title,
        body: snippet.body,
        countryCode: snippet.countryCode,
        snippetPriority: snippet.priority === 'HIGH' ? 10 : 1,
        previewMode: snippet.previewMode
      };

      if (mode === 'edit') {
        const snippetId = this.props.match.params.id;
        this.snippetService.updateSnippet(snippetId, snippetBody).pipe(
          takeUntil(this.unmount)
        ).subscribe(() => {
          this.historyService.push('/snippets');
        }, () => {
          this.setState({ loading: false });
          this.modalService.openCommonError();
        });
        return;
      }

      // new or duplicate
      this.snippetService.createSnippet(snippetBody).pipe(
        takeUntil(this.unmount)
      ).subscribe(() => {
        this.setState({ loading: false, sentResult: { success: true } });
        this.modalService.openInfo('Done!', 'The snippet was successfully submitted', this.historyService.push('/snippets'));
      }, () => {
        this.setState({ loading: false, sentResult: { success: false } });
        this.modalService.openInfo('Error!', 'Sorry, there was an error submitting');
      });
    }
      
    renderSnippetForm() {
      const { snippet } = this.state;
      return (
        <>
          <form className="snippet-form" onSubmit={this.submit}>
            
            <div className="form-section">
              <div className="section-num">1</div>
              <div className="section-text">Snippet content</div>
            </div>

            {/* Title */}
            <div className="form-group">
              <div className="form-label">Title</div>
              <Input placeholder="Enter title" name="title" maxLength="20" disabled={this.isView()}
                value={snippet.title} onChange={this.inputChange}/>
              {this.state.hasErrors && this.state.errors.title && 
                (<p className="input-error">{this.state.errors.title}</p>)}
            </div>
            
            {/* Body */}
            <div className="form-group">
              <div className="form-label">Body</div>
              <TextArea placeholder="Enter snippet body" name="body" value={snippet.body} onChange={this.inputChange} 
                rows="2" disabled={this.isView()} maxLength="140" />
              {this.state.hasErrors && this.state.errors.body && 
                (<p className="input-error">{this.state.errors.body}</p>)}
            </div>

            <div className="form-section">
              <div className="section-num">2</div>
              <div className="section-text">Snippet options</div>
            </div>

            <div className="grid-row">

              <div className="grid-col-4">
                <div className="form-group">
                  <div className="form-label">Preview mode</div>
                  <Checkbox name="previewMode" checked={snippet.previewMode} className="preview-checkbox" 
                      onChange={event => this.inputChange({ target: { name: 'previewMode', value: event.target.checked }})}>
                      Enabled</Checkbox>
                </div>
              </div>

              <div className="grid-col-4">
                <div className="form-group">
                  <div className="form-label">Priority</div>
                    <Select name="priority" disabled={this.isView()}
                      value={snippet.priority} onChange={this.inputChange}>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                    </Select>
                </div>
              </div>

              <div className="grid-col-4">
                <div className="form-group">
                  <div className="form-label">Country</div>
                  <Select name="countryCode" disabled value={snippet.countryCode} onChange={this.inputChange}>
                      <option value="ZAF">South Africa</option>
                  </Select>
                </div>
              </div>

            </div>

            <div className="form-group text-right">
              <button className="button">{this.submitButtonText[this.state.mode]}</button>
            </div>

          </form>
        </>
        )
    }
      
    render() {
      const title = capitalize(`${this.state.mode} snippet`);
      
      return <div className="snippet-edit">
      <PageBreadcrumb title={title} link={{ to: '/snippets', text: 'Snippets' }}/>
        <div className="page-content">
          {this.state.loading && <Spinner overlay/>}
          {this.renderSnippetForm()}
        </div>
      </div>
    }
}
  
export default SnippetsEdit;
  