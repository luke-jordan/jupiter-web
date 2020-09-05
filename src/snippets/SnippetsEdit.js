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
      this.modalService = inject('ModalService');
      this.historyService = inject('HistoryService');
      
      this.state = {
        loading: false,
        mode: props.match.params.mode,
        
        snippet: {
          snippetType: 'NORMAL',
          title: '',
          body: '',
          priority: 'NORMAL',
          countryCode: 'ZAF',
          previewMode: false,
        },
        clients: [],

        quizAnswers: ['', '', ''],
        correctAnswer: -1,

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

    componentDidMount() {
      this.loadData();
    }  

    loadData() {
      const snippetId = this.props.match.params.id;
      if (snippetId) {
        this.setState({ loading: true });
        this.snippetService.fetchSnippet(snippetId).pipe(
          takeUntil(this.unmount)
        ).subscribe((snippet) => this.loadSnippetForView(snippet), (err) => {
          this.setState({ loading: false });
          this.modalService.openCommonError();
          console.log(err);
        });
      }
    }

    loadSnippetForView(snippet) {
      const stateSnippet = { ...snippet };
      
      const isQuiz = snippet.responseOptions && snippet.responseOptions.correctAnswerText;
      stateSnippet.snippetType = isQuiz ? 'QUIZ' : 'NORMAL';
      const newState = { snippet: stateSnippet, loading: false };
      if (isQuiz) {
        newState.quizAnswers = snippet.responseOptions.responseTexts;
        newState.correctAnswer = snippet.responseOptions.responseTexts.indexOf(snippet.responseOptions.correctAnswerText);
      }

      this.setState(newState);
    }

    isView() {
      return this.state.mode === 'view';
    }

    isValid() {
      const { snippet } = this.state;
      
      const errors = {};
  
      if (!snippet.title || snippet.title.trim().length === 0) {
        errors.title = 'Remember to set a title';
      }

      if (snippet.snippetType === 'NORMAL' && (!snippet.body || snippet.body.trim().length === 0)) {
        errors.body = 'Remember to add a body'
      }

      if (snippet.snippetType === 'QUIZ' && !this.areAllAnswersFilled()) {
        errors.quiz = 'Remember to add all answers';
      }

      if (snippet.snippetType ==='QUIZ' && this.areAllAnswersFilled() && this.state.correctAnswer < 0){
        errors.quiz = 'Please remember to select an answer';
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

    quizAnswerChange = event => {
      const { name, value } = event.target;
      const answerIndex = name.split('::')[1];
      const { quizAnswers } = this.state;
      quizAnswers[answerIndex] = value;
      this.setState({ quizAnswers });
    }

    submit = event => {
      event.preventDefault();
      if (!this.isValid()) {
        return;
      }
    
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

      if (snippet.snippetType === 'QUIZ') {
        console.log('Snippet body, correct answer currently: ', this.state.correctAnswer);
        const responseTexts = this.state.quizAnswers.map((answer) => answer.trim());
        snippetBody.responseOptions = { responseTexts, correctAnswerText: responseTexts[this.state.correctAnswer] } 
      }

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
      console.log('Submitting snippet: ', snippetBody);
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

    areAllAnswersFilled = () => this.state.quizAnswers.every((answer) => answer.trim().length > 0);

    renderQuestionAnswerForm() {
      const { quizAnswers, correctAnswer } = this.state;
      return (
        <>
          <div className="form-group">
            <div className="form-label">Enter answers below. The snippet body will form the question. The question order will be 
              randomized for each user, and an option "D", "don't know" will be added</div>
          </div>
          {quizAnswers.map((_, index) => (
            <div className="form-group">
              <Input placeholder="Enter possible answer" name={`answer::${index}`} maxLength="40" disabled={this.isView()}
                value={quizAnswers[index]} onChange={this.quizAnswerChange}/>
            </div>
          ))}
          {this.areAllAnswersFilled() && (
            <div className="form-group">
              <div className="form-label">Please select the correct answer:</div>
              <Select name="snippetAnswer" disabled={this.isView()} value={correctAnswer} 
                onChange={(event) => this.setState({ correctAnswer: event.target.value })}>
                  <option value="-1">(select)</option>
                  {quizAnswers.map((answer, index) => <option value={index}>{answer}</option>)}
              </Select>
            </div>
          )}
          {this.state.hasErrors && this.state.errors.quiz && 
            (<p className="input-error">{this.state.errors.quiz}</p>)}
        </>)
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
              <div className="form-label">Snippet type</div>
              <Select name="snippetType" disabled={this.isView()} value={snippet.snippetType} onChange={this.inputChange}>
                <option value="NORMAL">Normal (text only) snippet</option>
                <option value="QUIZ">Quiz (question-answer) snipper</option>
              </Select>
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

            {/* Answer options (if quiz) :: for the moment, fixed at 3, may be flexible in the future */}
            {snippet.snippetType === 'QUIZ' && this.renderQuestionAnswerForm(snippet)}

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

    renderSnippetCounts() {
      // const { userCount, totalViewCount, totalFetchCount } = this.state.snippet;
      const keys = ['userCount', 'totalFetchCount', 'totalViewCount'];
      const titles = ['Users', 'Fetches', 'Views'];
      return <div className="boost-user-count">
        <div className="count-inner">
          <div className="grid-row">
            {keys.map((key, index) => <div className="grid-col"  key={key}>
              <div className="count-value">{this.state.snippet[key]}</div>
              <div className="count-title">{titles[index]}</div>
            </div>)}
          </div>
        </div>
      </div>
    }
      
    render() {
      const title = capitalize(`${this.state.mode} snippet`);
      
      return <div className="snippet-edit">
      <PageBreadcrumb title={title} link={{ to: '/snippets', text: 'Snippets' }}/>
        <div className="page-content">
          {this.state.loading && <Spinner overlay/>}
          {typeof this.state.snippet.userCount === 'number' && this.renderSnippetCounts()}
          {this.renderSnippetForm()}
        </div>
      </div>
    }
}
  
export default SnippetsEdit;
  