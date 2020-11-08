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
  ballots: Ballot[]
};

type State = {
  ownedBallots: Ballot[],
  unownedBallots: Ballot[],
  expandRedundantBallot: boolean
};

class ViewRetrievedPoll extends Component<Props, State> {

  static contextType: Context<IdentityService>  = IdentityContext;
  context!: IdentityService

  constructor(props: Props) {
    super(props);

    this.state = {
      ownedBallots: [],
      unownedBallots: [],
      expandRedundantBallot: false
    };
  }

  componentDidMount() {
    const knownBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    const ownedBallots = this.props.ballots.filter(b =>
      knownBallotIds.indexOf(b.id) > -1
    )
    const unownedBallots = this.props.ballots.filter(b=> 
      knownBallotIds.indexOf(b.id) <= -1
    )
    this.setState(Object.assign({}, this.state, {
      ownedBallots,
      unownedBallots,
    }))
  }

  ownedBallotSection() {
    const ballots = this.state.ownedBallots.map(b => 
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
            onSubmitBallot={b=>this.onSubmitNewBallot(b)}
          />
      }
    </div>
  }

  unownedBallotsSection() {

    const ballots = this.state.unownedBallots.map((b: Ballot) => 
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
  
    if (this.state.ownedBallots.length === 0) {
      return null;
    }

    if (!this.state.expandRedundantBallot) {
      return <div>
        <p className="desribe-redundant-ballot">
          You already submitted a ballot, but {' '}
          <a
            role="button" tabIndex={0}
            // size="sm"
            onClick={_ => this.handleEnableRedundantBallot()}
            // variant="link"
            >
            you can submit another
          </a>
          . Others can see each ballot that is submitted.
        </p>
      </div>
    }

    return <CreateBallot
      poll={this.props.poll}
      ballotKey={this.context.getKey()}
      isNew={true}
      onSubmitBallot={b=>this.onSubmitNewBallot(b)}
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
          ? <InstantRunoffExplainer ballots={this.props.ballots} />
          : null
        }
        {this.ownedBallotSection()}
        {this.unownedBallotsSection()}
        {this.redundantBallotSection()}
      </div>
    );
  }

  onSubmitNewBallot(ballot: Ballot) {
    this.context.addKnownBallot(
      this.props.poll.id,
      ballot.id
    );
    const newBallots = [...this.state.ownedBallots, ballot]
    this.setState(Object.assign({}, this.state, {
      expandRedundantBallot: false,
      ownedBallots: newBallots,
    }))
  }
}

export default ViewRetrievedPoll;
