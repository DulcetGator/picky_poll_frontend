import React, { Component } from "react";
import type { Poll } from "../api";
import Ranker from "./Ranker";

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
        <Ranker candidates={this.props.poll.candidates} />
      </div>
    );
  }
}

export default ViewRetrievedPoll;
