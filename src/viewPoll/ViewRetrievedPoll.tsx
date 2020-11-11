import React, { Component, Context } from "react";
import { Button } from 'react-bootstrap'
import { Ballot, Poll } from "../api";
import CreateBallot from "./ballot/CreateBallot";
import BallotPreview from './ballot/BallotPreview'
import MyBallotPreview from './ballot/MyBallotPreview'
import { InstantRunoffExplainer } from './explanation/InstantRunoffExplainer'
import { IdentityContext, IdentityService } from "../userIdentity";
import './ViewRetrievedPoll.css'

type Props = {
  poll: Poll,
  ballots: Ballot[],
  onSubmitNewBallot: (b: Ballot) => void
};

type State = {
  expandRedundantBallot: boolean
};

class ViewRetrievedPoll extends Component<Props, State> {

  static contextType: Context<IdentityService>  = IdentityContext;
  context!: IdentityService

  constructor(props: Props) {
    super(props);

    this.state = {
      expandRedundantBallot: false
    };
  }

  ownedBallots() {
    const knownBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    return this.props.ballots.filter(b =>
      knownBallotIds.indexOf(b.id) > -1
    )
  }

  unownedBallots() {
    const knownBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    return this.props.ballots.filter(b =>
      knownBallotIds.indexOf(b.id) <= -1
    )
  }

  ownedBallotSection() {
    const ballots = this.ownedBallots().map(b =>
      <li className="my-ballot-item" key={b.id}>
        <MyBallotPreview
          poll = {this.props.poll}
          ballotKey = {this.context.getKey()}
          ballot = {b}
        />
      </li>
    );
    return <div>
      <h2>Your ballot</h2>
      {
        ballots.length > 0
        ? <ul className="my-ballots-list">
            {ballots}
          </ul>
        : <CreateBallot
            poll={this.props.poll}
            ballotKey={this.context.getKey()}
            isNew={true}
            onSubmitBallot={b=>this.handleSubmitNewBallot(b)}
          />
      }
    </div>
  }

  unownedBallotsSection() {
    const ballots = this.unownedBallots().map((b: Ballot) =>
      <li className="their-ballot-item" key={b.id}>
        <BallotPreview ballot={b} />
      </li>
    );

    const theirBallotsList = ballots.length > 0
    ? <ul className="their-ballots-list">{ballots}</ul>
    : <p>Nobody else has submitted a ballot yet.</p>

    return <>
      <h2>Other ballots</h2>
      {theirBallotsList}
    </>
  }

  redundantBallotSection() {
  
    if (this.ownedBallots().length === 0) {
      return null;
    }

    if (!this.state.expandRedundantBallot) {
      return <div>
        <p className="desribe-redundant-ballot">
          You already submitted a ballot, but Picky Poll does not prevent you from submitting
          another. Others can see each ballot that is submitted.
          <p>
            <Button variant="secondary" onClick={_ => this.handleEnableRedundantBallot()}>
              New ballot
            </Button>
          </p>
        </p>
      </div>
    }

    return <CreateBallot
      poll={this.props.poll}
      ballotKey={this.context.getKey()}
      isNew={true}
      onSubmitBallot={b=>this.handleSubmitNewBallot(b)}
    />
  }

  handleEnableRedundantBallot() {
    this.setState(Object.assign({}, this.state, {expandRedundantBallot: true}))
  }

  render() {
    return (
      <div>
        <h1>{this.props.poll.description}</h1>
        {
          this.props.ballots.length > 0
          ? <InstantRunoffExplainer
              isClosed={!!this.props.poll.close}
              ballots={this.props.ballots} />
          : null
        }
        {this.ownedBallotSection()}
        {this.unownedBallotsSection()}
        {this.redundantBallotSection()}
      </div>
    );
  }

  handleSubmitNewBallot(ballot: Ballot) {
    this.context.addKnownBallot(
      this.props.poll.id,
      ballot.id
    );
    this.props.onSubmitNewBallot(ballot)
    this.setState(Object.assign({}, this.state, {expandRedundantBallot: false}))
  }
}

export default ViewRetrievedPoll;
