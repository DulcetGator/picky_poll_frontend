import React, { Component, Context } from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import { createPoll } from "../api";
import IdentityContext, {IdentityService} from "../userIdentity"
import './CreatePollForm.css'

type Props = {
  onCreatePoll: ({ id } : {id: string}) => void
};

type WriteInCandidate = {
  value: string,
  key: number
};

type State = {
  description: string,
  candidates: WriteInCandidate[]
};

class CreatePollForm extends Component<Props, State> {
  lastCandidate: number = 0;

  static contextType: Context<IdentityService> = IdentityContext;
  context!: IdentityService;

  constructor(props: Props) {
    super(props);

    this.state = {
      description: "",
      candidates: [{ value: "", key: 0 }]
    };
  }

  render() {
    let answers = this.state.candidates.map((candidate, index) => (
      <li key={candidate.key}>
          <InputGroup>
            <FormControl
              onChange={e => this.handleCandidateChange(index, e.currentTarget.value)}
              placeholder={"Choice #" + (index + 1)}
            />
          <InputGroup.Append>
            <Button
              variant="secondary"
              type="button"
              onClick={e => this.handleDeleteCandidate(index)} >
              Remove
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </li>
    ));

    return (
      <div className="CreatePollForm" >
        <form onSubmit={e => this.handleSubmit(e)}>
          <Form.Group as={Row} controlId="DescriptionInput">
            <Form.Label column sm="auto">
              Question
            </Form.Label>
            <Col>
              <FormControl
                as="textarea"
                placeholder="What is your preference among the following choices?"
                value={this.state.description}
                onChange={e => this.handleDescriptionChange(e.currentTarget.value)}
              />
            </Col>
          </Form.Group>
          <ul>{answers}</ul>
          <div className="form-controls">
            <div>
              <Button
                variant="secondary"
                type="button"
                onClick={e => this.handleCreateCandidate()} >
                New Choice
              </Button>
            </div>
            <div>
              <Button
                variant="primary"
                type="submit">
                Create
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  handleDescriptionChange(newDescription: string) {
    this.setState({
      description: newDescription
    });
  };

  async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let poll = await createPoll(
      this.context.getKey(),
      this.state.description,
      this.state.candidates.map(c => c.value),
    );

    this.context.addKnownPoll(poll, true);
    
    this.props.onCreatePoll(poll);
  };

  handleCandidateChange (index: number, newName: string): void {
    let changedCandidate = {
      key: this.state.candidates[index].key,
      value: newName
    };
    let newCandidates = this.state.candidates
      .slice(0, index)
      .concat(changedCandidate)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  };

  handleCreateCandidate() {
    this.setState({
      candidates: this.state.candidates.concat([
        {
          key: ++this.lastCandidate,
          value: ""
        }
      ])
    });
  };

  handleDeleteCandidate(index: number): void {
    let newCandidates = this.state.candidates
      .slice(0, index)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  };
}

export default CreatePollForm;
