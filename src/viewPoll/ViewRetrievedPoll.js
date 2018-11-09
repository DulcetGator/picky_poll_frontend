import React, { Component } from "react";
import type { Poll } from "../api";
import VoteForm from "./VoteForm";

type Props = {
  poll: Poll
};

type State = {};

class ViewRetrievedPoll extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <p>{this.props.poll.description}</p>
        <VoteForm
          candidates={this.props.poll.candidates}
          pollId={this.props.poll.id}
        />
      </div>
    );
  }
}

export default ViewRetrievedPoll;
