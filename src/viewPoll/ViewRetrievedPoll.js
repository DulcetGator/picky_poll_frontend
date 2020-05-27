import React, { Component } from "react";
import type { Ballot, Poll } from "../api";
import EditBallot from "./EditBallot";
import BallotPreview from './BallotPreview'
import { IdentityContext, IdentityService } from "../userIdentity";

let crypto = require('crypto')

type Props = {
  poll: Poll,
  ballots: Ballot[]
};

type State = {};

class ViewRetrievedPoll extends Component<Props, State> {

  static contextType = IdentityContext;
  context: IdentityService

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
        <h1>Already voted:</h1>
        {this.ballots()}
        <h1>Cast your vote:</h1>
        <EditBallot
          poll={this.props.poll}
          ballotKey={this.context.getKey()}
          isNew={true}
          onSubmitBallot={()=>{}}
        />
      </div>
    );
  }

  onSubmitNewBallot() {

  }
}

export default ViewRetrievedPoll;
