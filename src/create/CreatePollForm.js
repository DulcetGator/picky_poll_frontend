import React, { Component } from "react";

type State = {
  description: string,
  options: string[]
};

class CreatePollForm extends Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      description: "",
      options: ["", "", ""]
    };
  }

  render() {
    let answers = this.state.options.map((option, index) => (
      <li>
        <input
          onChange={this.handleCandidateChange(index)}
          type="text"
          placeholder={"Candidate " + (index + 1)}
        />
        <button>Delete</button>
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
      description: "changed"
    });
  };

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(this.state);
  };

  handleCandidateChange = (index: number) => (
    event: SyntheticEvent<HTMLInputElement>
  ) => {
    let newCandidates = this.state.options
      .slice(0, index)
      .concat([event.currentTarget.value])
      .concat(this.state.options.slice(index + 1));
    this.setState({ options: newCandidates });
  };

  handleCreateCandidate = (event: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({ options: this.state.options.concat([""]) });
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
