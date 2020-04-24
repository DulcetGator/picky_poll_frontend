import React, { Component } from "react";
import { createPoll } from "../api";
import IdentityContext, {IdentityService, LocalStoreIdentityService} from "../userIdentity.js"

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
  lastCandidate = 0;

  static contextType = IdentityContext;
  context: IdentityService;

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
        <input
          onChange={this.handleCandidateChange(index)}
          type="text"
          placeholder={"Candidate " + (index + 1)}
        />
        <button type="button" onClick={this.handleDeleteCandidate(index)}>
          Delete
        </button>
      </li>
    ));
    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <label>
            Question:
            <textarea
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </label>
        </p>
        <ul>{answers}</ul>
        <p>
          <button type="button" onClick={this.handleCreateCandidate}>
            New Choice
          </button>
        </p>
        <button type="submit">Create</button>
      </form>
    );
  }

  handleDescriptionChange = (
    event: SyntheticInputEvent<HTMLTextAreaElement>
  ) => {
    event.preventDefault();
    this.setState({
      description: event.currentTarget.value
    });
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    createPoll(
      this.context.getIdentity(),
      this.state.description,
      this.state.candidates.map(c => c.value),
    ).then(this.props.onCreatePoll);
  };

  handleCandidateChange = (index: number) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
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

  handleCreateCandidate = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      candidates: this.state.candidates.concat([
        {
          key: ++this.lastCandidate,
          value: ""
        }
      ])
    });
  };

  handleDeleteCandidate = (index: number) => (
    event: SyntheticEvent<HTMLButtonElement>
  ) => {
    let newCandidates = this.state.candidates
      .slice(0, index)
      .concat(this.state.candidates.slice(index + 1));
    this.setState({ candidates: newCandidates });
  };
}

export default CreatePollForm;
