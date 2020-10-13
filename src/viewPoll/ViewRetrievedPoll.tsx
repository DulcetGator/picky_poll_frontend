import React, { Component, Context } from "react";
import { Ballot, Poll } from "../api";
import CreateBallot from "./ballot/CreateBallot";
import BallotPreview from './ballot/BallotPreview'
import MyBallotPreview from './ballot/MyBallotPreview'
import { IdentityContext, IdentityService } from "../userIdentity";

type Props = {
  poll: Poll,
  ballots: Ballot[]
};

type State = {};

class ViewRetrievedPoll extends Component<Props, State> {

  static contextType: Context<IdentityService>  = IdentityContext;
  context!: IdentityService

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  ballots() {
    const myBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    const myBallots = this.props.ballots.filter(b =>
      myBallotIds.indexOf(b.id) > -1
    ).map(b => 
      <li key={b.id}>
        <MyBallotPreview
          poll = {this.props.poll}
          ballotKey = {this.context.getKey()}
          ballot = {b}
        />
      </li>
    );

    const theirBallots = this.props.ballots.filter(b=> 
      myBallotIds.indexOf(b.id) <= -1
    ).map((b: Ballot) => 
      <li key={b.id}><BallotPreview ballot={b} /></li>
    );

    return <ul>
      {myBallots}
      {theirBallots}
    </ul>
  }

  render() {
    return (
      <div>
        <p>{this.props.poll.description}</p>
        <h1>Already voted:</h1>
        {this.ballots()}
        <h1>Cast your vote:</h1>
        <CreateBallot
          poll={this.props.poll}
          ballotKey={this.context.getKey()}
          isNew={true}
          onSubmitBallot={b=>this.onSubmitNewBallot(b)}
        />
      </div>
    );
  }

  onSubmitNewBallot(ballot: Ballot) {
    this.context.addKnownBallot(
      this.props.poll.id,
      ballot.id
    );
  }
}

export default ViewRetrievedPoll;
