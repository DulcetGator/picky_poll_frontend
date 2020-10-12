import React, { Component, type Context, type Node } from "react";
import { getPoll } from "../api";
import ViewRetrievedPoll from "./ViewRetrievedPoll";
import type { Ballot, Poll } from "../api";

import IdentityContext, {IdentityService} from "../userIdentity.js"

type Props = {
  pollId: string
};

type State = {
  poll: ?Poll,
  ballots: Ballot[]
};

class ViewPoll extends Component<Props, State> {

  static contextType: Context<IdentityService> = IdentityContext;
  context: IdentityService

  constructor(props: Props) {
    super(props);
    this.state = { poll: null, ballots: [] };
  }

  componentWillMount() {
    this.getPoll();
  }

  render(): Node {
    if (this.state.poll != null) {
      return <ViewRetrievedPoll poll={this.state.poll} ballots={this.state.ballots}/>;
    } else {
      return <span>No poll with id {this.props.pollId}</span>;
    }
  }

  async getPoll() {
    let response = await getPoll(this.props.pollId);
    if (response) {
      this.context.addKnownPoll(response.poll)
      this.setState({ poll: response.poll, ballots: response.ballots });
    }
  }
}

export default ViewPoll;
