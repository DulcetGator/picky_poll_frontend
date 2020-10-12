import React, { Component, type Context, type Node } from "react";
import { createPoll } from "../api";
import IdentityContext, {IdentityService} from "../userIdentity.js"

type Props = {
  onCreatePoll: ({ id: string }) => void
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
  context: IdentityService;

  constructor(props: Props) {
    super(props);

    this.state = {
      description: "",
      candidates: [{ value: "", key: 0 }]
    };
  }

  render(): Node {
    let answers = this.state.candidates.map((candidate, index) => (
      <li key={candidate.key}>
        <input
          onChange={e => this.handleCandidateChange(index, e)}
          type="text"
          placeholder={"Candidate " + (index + 1)}
        />
        <button type="button" onClick={e => this.handleDeleteCandidate(index, e)}>
          Delete
        </button>
      </li>
    ));
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <p>
          <label>
            Question:
            <textarea
              value={this.state.description}
              onChange={e => this.handleDescriptionChange(e)}
            />
          </label>
        </p>
        <ul>{answers}</ul>
        <p>
          <button type="button" onClick={e => this.handleCreateCandidate(e)}>
            New Choice
          </button>
        </p>
        <button type="submit">Create</button>
      </form>
    );
  }

  handleDescriptionChange(event: SyntheticInputEvent<HTMLTextAreaElement>) {
    event.preventDefault();
    this.setState({
      description: event.currentTarget.value
    });
  };

  handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    createPoll(
      this.context.getKey(),
      this.state.description,
      this.state.candidates.map(c => c.value),
    ).then(this.props.onCreatePoll);
  };

  handleCandidateChange (index: number, event: SyntheticEvent<HTMLInputElement>): void {
    let changedCandidate = {
      key: this.state.candidates[index].key,
      value: event.currentTarget.value
    };
    let newCandidates = this.state.candidates
      .slice(0, index)
      .concat(changedCandidate)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  };

  handleCreateCandidate(event: SyntheticEvent<HTMLButtonElement>) {
    this.setState({
      candidates: this.state.candidates.concat([
        {
          key: ++this.lastCandidate,
          value: ""
        }
      ])
    });
  };

  handleDeleteCandidate(index: number, event: SyntheticEvent<HTMLButtonElement>): void {
    let newCandidates = this.state.candidates
      .slice(0, index)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  };
}

export default CreatePollForm;
