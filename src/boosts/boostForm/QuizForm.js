// BoostForm is getting way overdone. To grandfather in a refactor, am adding this here

import React from 'react';
import { inject, unmountDecorator } from 'src/core/utils';
import { takeUntil } from 'rxjs/operators';

import Select from 'src/components/select/Select';
import closeImg from 'src/assets/images/close.svg';
import addImg from 'src/assets/images/add-purple.svg';

import './BoostForm.scss';

const PLACEHOLDER = 'SELECT';

class QuizForm extends React.Component {
    constructor(props) {
        super(props);

        this.snippetService = inject('SnippetsService');

        this.state = {
            allSnippets: [],
            selectedSnippets: [],
            numberQuestons: 1,
        };

        unmountDecorator(this);
    }

    componentDidMount() {
        this.snippetService.getSnippets({ onlyQuizSnippets: true }).pipe(
            takeUntil(this.unmount)
        ).subscribe(snippets => {
            this.setState({ allSnippets: snippets, selectedSnippets: [PLACEHOLDER] });
        }, error => {
            console.log('Error fetching quiz snippets: ', error);
        });
    }

    addBlankQuestion = (afterIndex = null) => {
        const newSnippets = [...this.state.selectedSnippets];
        console.log('Adding question after index: ', afterIndex, ' current length: ', newSnippets.length);
        if (typeof afterIndex === 'number' && ((afterIndex + 1) < newSnippets.length)) {
            console.log('Okay, splicing this thing in, at: ', afterIndex + 1);
            newSnippets.splice(afterIndex + 1, 0, PLACEHOLDER);
        } else {
            newSnippets.push(PLACEHOLDER);
        }
        this.setState({ selectedSnippets: newSnippets }); 
    }

    removeQuestion = (index) => {
        const newSnippets = [...this.state.selectedSnippets];
        newSnippets.splice(index, 1);
        this.setState({ selectedSnippets: newSnippets });
    }

    // eventually we can / will remove taken snippets from other selectors, but for now this is fine
    selectQuestion = (snippetId, index) => {
        const { selectedSnippets } = this.state;
        selectedSnippets[index] = snippetId;
        this.setState({ selectedSnippets });

        if (this.props.updateSelectedSnippets) {
            this.props.updateSelectedSnippets(selectedSnippets.filter((snippetId) => snippetId !== PLACEHOLDER));
        }
    
        // if this is the last question, add space for another one
        if (selectedSnippets.length === index + 1) {
            this.addBlankQuestion();
        }
    }

    renderSelect = (index) => (
        <div className="grid-row">
            <div className="grid-col-8">
                <Select key={`question::${index}`} name={`question::${index}`} value={this.state.selectedSnippets[index]}
                    onChange={(event) => this.selectQuestion(event.target.value, index)}>
                    <option value={PLACEHOLDER}>Select question...</option>
                    {this.state.allSnippets.map(({ snippetId, title }) => 
                        <option key={`${index}::${snippetId}`} value={snippetId}>{title}</option>)}
                </Select>
            </div>
            <div className="grid-col-1">
                <img src={addImg} alt="add" onClick={() => this.addBlankQuestion(index)} />
            </div>
            <div className="grid-col-1">
                <div className="delete-quesiton" onClick={() => this.removeQuestion(index)}>
                    <img src={closeImg} alt="delete" />
                </div>
            </div>
        </div>
    )

    render() {
        // we need to add quiz options as we go
        return (<>
            <div className="form-group"><div className="form-label">Select quiz questions:</div></div>
            {this.state.selectedSnippets.map((_, index) => this.renderSelect(index))}
        </>)
    }
};

export default QuizForm;
