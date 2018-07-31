import React, { Component } from "react";
import { createPoll } from "../api";

type Props = {
  onCreatePoll: ({}) => void
};

type WriteInCandidate = {
  value: string,
  key: number
};

type State = {
  description: string,
  options: WriteInCandidate[]
};

class CreatePollForm extends Component<Props, State> {
  lastCandidate = 0;

  constructor(props: Props) {
    super(props);

    this.state = {
      description: "",
      options: [{ value: "", key: 0 }]
    };
  }

  render() {
    let answers = this.state.options.map((candidate, index) => (
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
          <button onClick={this.handleCreateCandidate}>New Choice</button>
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
      this.state.description,
      this.state.options.map(c => c.value)
    ).then(this.props.onCreatePoll);
  };

  handleCandidateChange = (index: number) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    let changedCandidate = {
      key: this.state.options[index].key,
      value: event.currentTarget.value
    };
    let newCandidates = this.state.options
      .slice(0, index)
      .concat(changedCandidate)
      .concat(this.state.options.slice(index + 1));
    this.setState({ options: newCandidates });
  };

  handleCreateCandidate = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      options: this.state.options.concat([
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
    let newCandidates = this.state.options
      .slice(0, index)
      .concat(this.state.options.slice(index + 1));
    this.setState({ options: newCandidates });
  };
}

export default CreatePollForm;
