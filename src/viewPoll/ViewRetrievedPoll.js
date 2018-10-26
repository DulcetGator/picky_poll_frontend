import React, { Component } from "react";
import type { Poll } from "../api";

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
      </div>
    );
  }
}

export default ViewRetrievedPoll;
