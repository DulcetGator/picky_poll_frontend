import React, { Component } from 'react';
import {
  Button, Card, FormControl, InputGroup,
} from 'react-bootstrap';
import Ranker from './Ranker';
import { Ballot, Candidate, Poll, postBallot } from '../../../api';
import crypto from 'crypto';
import shuffle from '../../../util/shuffle';

import './CreateBallot.css';
import BasicSpinner from '../../../partials/BasicSpinner';
import promiseTimeout from '../../../util/promiseTimeout';


type Props = {
  poll: Poll,
  candidates: Map<string, Candidate>,
  ballotKey: string,
  onSubmitBallot: (ballot: Ballot) => void
};

type State = {
  ballot: Ballot,
  isBusy: boolean,
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ballot: this.makeNewBallot(),
      isBusy: false,
    };
  }

  render() {
    const rankedCandidates = this
    .state
    .ballot
    .rankings
    .map(n => this.props.candidates.get(n) as Candidate);

    return (
      <Card className="CreateBallot">
        <Card.Header>
          <InputGroup>
            <FormControl
              placeholder="Name or alias"
              onChange={(e) => this.onUpdateVoterName(e.target.value)}
            />
          </InputGroup>
        </Card.Header>
        <Ranker
          candidates={rankedCandidates}
          onUpdateCandidates={(e) => this.onUpdateCandidates(e)}
        />
        <p>
          Your ballot, including your name, will be visible to all viewers of this poll.
        </p>
        {this.state.isBusy
          ? <BasicSpinner>Submitting ballot</BasicSpinner>
          : <Button
              onClick={() => this.handleSubmit()}
              className="submit-button"
            >
              Submit
          </Button>
        }
      </Card>
    );
  }

  onUpdateCandidates(candidates: Candidate[]) {
    const rankedNames = candidates.map(c => c.name);
    this.setState({
      ballot: { ...this.state.ballot, rankings: rankedNames },
    });
  }

  onUpdateVoterName(name: string) {
    this.setState({
      ballot: { ...this.state.ballot, name },
    });
  }

  async handleSubmit() {
    this.setState({isBusy: true})
    const minWaitPromise = promiseTimeout(300)
    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.state.ballot.id,
      this.state.ballot.name,
      this.state.ballot.rankings,
    );
    await minWaitPromise;

    this.props.onSubmitBallot(this.state.ballot);
  }

  makeNewBallot(): Ballot {
    const ballot: Ballot = {
      name: '',
      id: crypto.randomBytes(32).toString('hex'),
      rankings: shuffle(Array.from(this.props.candidates.keys())),
      timestamp: Date.now(),
    };
    return ballot;
  }
}

export default CreateBallot;
