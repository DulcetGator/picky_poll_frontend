import React, { Component, Context, ReactNode } from 'react';
import {
  Button, Col, Form, FormControl, InputGroup, Row,
} from 'react-bootstrap';
import { createPoll } from '../../api';
import ExampleCreator from './ExampleCreator'
import IdentityContext, { IdentityService } from '../../userIdentity';
import './CreatePoll.css';
import FadeToggle from '../../partials/FadeToggle';

type Props = {
  onCreatePoll: ({ id } : {id: string}) => void
};

type State = {
  description: string,
  candidates: {
    key: number,
    name: string,
  }[],
  offerExample: boolean,
};

export default class CreatePoll extends Component<Props, State> {
  lastCandidate = 1;

  static contextType: Context<IdentityService> = IdentityContext;

  context!: IdentityService;

  constructor(props: Props) {
    super(props);

    this.state = {
      description: '',
      candidates: [{ key: 0, name: '' }, { key: 1, name: '' }],
      offerExample: true,
    };
  }

  isValid(): boolean {
    const candidateNames = this.state.candidates
      .map((c) => c.name)
      .filter((c) => c.length > 0);
    const hasDuplicates = new Set(candidateNames).size
      < candidateNames.length;

    return this.state.description.length > 0
      && candidateNames.length >= 2
      && !hasDuplicates;
  }

  render(): ReactNode {
    const answers = this.state.candidates.map((candidate, index) => (
      <li key={candidate.key}>
        <InputGroup>
          <InputGroup.Prepend>
            <Button
              variant="secondary"
              type="button"
              onClick={() => this.handleDeleteCandidate(index)}
            >
              Remove
            </Button>
          </InputGroup.Prepend>
          <FormControl
            onChange={(e) => this.handleCandidateChange(index, e.currentTarget.value)}
            placeholder={`Choice #${index + 1}`}
          />
        </InputGroup>
      </li>
    ));

    return (
      <div className="CreatePollForm">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group as={Row} controlId="DescriptionInput">
            <Form.Label column sm="auto">
              Question
            </Form.Label>
            <Col>
              <FormControl
                as="textarea"
                placeholder="What is your preference among the following choices?"
                value={this.state.description}
                onChange={(e) => this.handleDescriptionChange(e.currentTarget.value)}
              />
            </Col>
          </Form.Group>
          <ul>{answers}</ul>
          <div className="form-controls">
            <div>
              <Button
                variant="secondary"
                type="button"
                onClick={() => this.handleCreateCandidate()}
              >
                New Choice
              </Button>
            </div>
            <div>
              <Button
                variant="primary"
                type="submit"
                disabled={!this.isValid()}
              >
                Create
              </Button>
            </div>
            <div>
            </div>
          </div>
        </form>
        <FadeToggle show={this.state.offerExample}>
          Just testing it out? An example poll can be generated for you.
          {' '}
          <ExampleCreator identity={this.context}>
            <Button
              variant="link"
              >Create example.
            </Button>
          </ExampleCreator>
        </FadeToggle>
      </div>
    );
  }

  private handleDescriptionChange(newDescription: string): void {
    this.setState({
      description: newDescription,
    });
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const poll = await createPoll(
      this.context.getKey(),
      this.state.description,
      this.state.candidates
        .map((c) => c.name)
        .filter((n) => n.length > 0),
    );

    this.context.addKnownPoll(poll, true);

    this.props.onCreatePoll(poll);
  }

  handleCandidateChange(index: number, newName: string): void {
    const changedCandidate = {
      key: this.state.candidates[index].key,
      name: newName,
    };
    const newCandidates = this.state.candidates
      .slice(0, index)
      .concat(changedCandidate)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({
      candidates: newCandidates,
      offerExample: false,
    });
  }

  private handleCreateCandidate(): void {
    this.setState({
      candidates: this.state.candidates.concat([
        {
          key: ++this.lastCandidate,
          name: '',
        },
      ]),
    });
  }

  private handleDeleteCandidate(index: number): void {
    const newCandidates = this.state.candidates
      .slice(0, index)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  }
}
