import React, { Component } from "react";
import type { Ballot, Poll } from "../api";
import VoteForm from "./VoteForm";
import BallotPreview from './BallotPreview'

type Props = {
  poll: Poll,
  ballots: Ballot[]
};

type State = {};

class ViewRetrievedPoll extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  ballots() {
    let ballotPreviews = this.props.ballots.map(function(b: Ballot) {
      return <li><BallotPreview ballot={b} /></li>
    })
    return <ul>
      {ballotPreviews}
    </ul>
  }

  render() {
    return (
      <div>
        <p>{this.props.poll.description}</p>
        {this.ballots()}
        <VoteForm
          candidates={this.props.poll.candidates}
          pollId={this.props.poll.id}
        />
      </div>
    );
  }
}

export default ViewRetrievedPoll;
