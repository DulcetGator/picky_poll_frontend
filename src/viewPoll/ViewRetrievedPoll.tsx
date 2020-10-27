import React, { Component, Context } from "react";
import { Card } from 'react-bootstrap'
import { Ballot, Poll } from "../api";
import CreateBallot from "./ballot/CreateBallot";
import BallotPreview from './ballot/BallotPreview'
import MyBallotPreview from './ballot/MyBallotPreview'
import { IdentityContext, IdentityService } from "../userIdentity";
import './ViewRetrievedPoll.css'

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
      <li className="my-ballot-item" key={b.id}>
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
      <li className="their-ballot-item" key={b.id}>
        <BallotPreview ballot={b} />
      </li>
    );

    const myBallotsList = myBallots.length > 0
    ? <ul className="my-ballots-list">{myBallots}</ul>
    : <></>

    const theirBallotsList = theirBallots.length > 0
    ? <ul className="their-ballots-list">{theirBallots}</ul>
    : <></>

    return (
      <>
        {myBallotsList}
        {theirBallotsList}
      </>
    );
  }

  render() {
    return (
      <div>
        <h1>{this.props.poll.description}</h1>
        <h2>Already voted:</h2>
        {this.ballots()}
        <h2>Cast your vote:</h2>
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
