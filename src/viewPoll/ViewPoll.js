import React, { Component } from "react";
import { getPoll } from "../api";
import ViewRetrievedPoll from "./ViewRetrievedPoll";
import type { Poll } from "../api";

type Props = {
  pollId: string
};

type State = {
  poll: ?Poll
};

class ViewPoll extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { poll: null };
  }

  componentWillMount() {
    this.getPoll();
  }

  render() {
    if (this.state.poll != null) {
      return <ViewRetrievedPoll poll={this.state.poll} />;
    } else {
      return <span>No poll with id {this.props.pollId}</span>;
    }
  }

  async getPoll() {
    let poll = await getPoll(this.props.pollId);
    this.setState({ poll: poll });
  }
}

export default ViewPoll;
