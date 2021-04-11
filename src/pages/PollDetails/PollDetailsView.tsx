import React, { Component, Context } from 'react';
import { Button } from 'react-bootstrap';
import mapByField from '../../util/mapByField'
import { Ballot, Candidate, Poll } from '../../api';
import CreateBallot from './ballot/CreateBallot';
import BallotPreview from './ballot/BallotPreview';
import MyBallotPreview from './ballot/MyBallotPreview';
import ListCandidates from './candidates/ListCandidates'
import WriteInSubmitter from './WriteInSubmitter';
import { CopelandExplainer } from './explainers';
import { IdentityContext, IdentityService } from '../../userIdentity';
import './PollDetailsView.css';

type Props = {
  poll: Poll,
  ballots: Ballot[],
  onSubmitNewBallot: (b: Ballot) => void,
};

type State = {
  expandRedundantBallot: boolean,
};

class PollDetailsView extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;

  context!: IdentityService

  namesToCandidates: Map<string, Candidate>

  constructor(props: Props) {
    super(props);

    this.namesToCandidates = mapByField(
      props.poll.candidates,
      c => c.name
    );

    this.state = {
      expandRedundantBallot: false,
    };
  }

  ownedBallots() {
    const knownBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    return this.props.ballots.filter((b) => knownBallotIds.indexOf(b.id) > -1);
  }

  unownedBallots() {
    const knownBallotIds = this.context.getKnownBallots(this.props.poll.id) || [];
    return this.props.ballots.filter((b) => knownBallotIds.indexOf(b.id) <= -1);
  }

  ownedBallotSection() {
    const ballots = this.ownedBallots().map((b) => (
      <li className="my-ballot-item" key={b.id}>
        <MyBallotPreview
          poll={this.props.poll}
          candidates={this.namesToCandidates}
          ballotKey={this.context.getKey()}
          ballot={b}
        />
      </li>
    ));
    return (
      <div>
        <h2>Your ballot</h2>
        {
        ballots.length > 0
          ? (
            <ul className="my-ballots-list">
              {ballots}
            </ul>
          )
          : (
            <CreateBallot
              poll={this.props.poll}
              candidates={this.namesToCandidates}
              ballotKey={this.context.getKey()}
              onSubmitBallot={(b) => this.handleSubmitNewBallot(b)}
            />
          )
      }
      </div>
    );
  }

  unownedBallotsSection() {
    const ballots = this.unownedBallots().map((b: Ballot) => (
      <li className="their-ballot-item" key={b.id}>
        <BallotPreview ballot={b} />
      </li>
    ));

    const theirBallotsList = ballots.length > 0
      ? <ul className="their-ballots-list">{ballots}</ul>
      : <p>Nobody else has submitted a ballot yet.</p>;

    return (
      <>
        <h2>Other ballots</h2>
        {theirBallotsList}
      </>
    );
  }

  redundantBallotSection() {
    if (this.ownedBallots().length === 0) {
      return null;
    }

    if (!this.state.expandRedundantBallot) {
      return (
        <div>
          <p className="desribe-redundant-ballot">
            You already submitted a ballot, but Picky Poll does not prevent you from submitting
            another. Others can see each ballot that is submitted.
          </p>
          <p>
            <Button variant="secondary" onClick={() => this.handleEnableRedundantBallot()}>
              New ballot
            </Button>
          </p>
        </div>
      );
    }

    return (
      <CreateBallot
        poll={this.props.poll}
        candidates={this.namesToCandidates}
        ballotKey={this.context.getKey()}
        onSubmitBallot={(b) => this.handleSubmitNewBallot(b)}
      />
    );
  }

  handleEnableRedundantBallot() {
    this.setState({ ...this.state, expandRedundantBallot: true });
  }

  render() {
    return (
      <div>
        <h1>{this.props.poll.name}</h1>
        {
          this.props.poll.description
          ? <p>{this.props.poll.description}</p>
          : null
        }
        {
          this.props.ballots.length > 0
            ? (
              <CopelandExplainer
                isClosed={!!this.props.poll.close}
                ballots={this.props.ballots}
              />
            )
            : null
        }
        <ListCandidates candidates={this.props.poll.candidates} />
        {
          this.props.poll.configuration.writeIns
          ? <WriteInSubmitter
            poll = {this.props.poll}
            candidates = {this.namesToCandidates}
            onNewCandidate = {(c: Candidate) => {}}
            />
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
      ballot.id,
    );
    this.props.onSubmitNewBallot(ballot);
    this.setState({ ...this.state, expandRedundantBallot: false });
  }
}

export default PollDetailsView;
