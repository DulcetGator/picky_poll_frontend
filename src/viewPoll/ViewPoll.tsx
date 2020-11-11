import React, { Component, Context } from "react";
import { getPoll } from "../api";
import ViewRetrievedPoll from "./ViewRetrievedPoll";
import { Ballot, Poll } from "../api";

import IdentityContext, {IdentityService} from "../userIdentity"

type Props = {
  pollId: string
};

type State = {
  poll: Poll | null,
  ballots: Ballot[]
};

class ViewPoll extends Component<Props, State> {

  static contextType: Context<IdentityService> = IdentityContext;
  context!: IdentityService

  constructor(props: Props) {
    super(props);
    this.state = { poll: null, ballots: [] };
  }

  componentDidMount() {
    this.getPoll();
  }

  render() {
    if (this.state.poll != null) {
      return <ViewRetrievedPoll
        poll={this.state.poll}
        ballots={this.state.ballots}
        onSubmitNewBallot={b => this.handleSubmitNewBallot(b)}/>;
    } else {
      return <span>No poll with id {this.props.pollId}</span>;
    }
  }

  async getPoll() {
    let response = await getPoll(this.props.pollId);
    if (response) {
      this.context.addKnownPoll(response.poll, false)
      this.setState({ poll: response.poll, ballots: response.ballots });
    }
  }

  handleSubmitNewBallot(b: Ballot) {
    const ballots = [...this.state.ballots, b]
    this.setState(Object.assign({}, this.state, {ballots: ballots}))
  }
}

export default ViewPoll;
