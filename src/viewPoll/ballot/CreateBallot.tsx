import React, { Component } from 'react';
import {
  Button, Card, FormControl, InputGroup,
} from 'react-bootstrap';
import Ranker from '../Ranker';
import { Poll, Ballot, postBallot } from '../../api';
import crypto from 'crypto';
import shuffle from '../../util/shuffle';

import './CreateBallot.css';


type Props = {
  poll: Poll,
  ballotKey: string,
  isNew: boolean,

  onSubmitBallot: (ballot: Ballot) => void
};

type State = {
  ballot: Ballot
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ballot: this.makeNewBallot(),
    };
  }

  render() {
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
          candidates={this.state.ballot.rankings}
          onUpdateCandidates={(e) => this.onUpdateCandidates(e)}
        />
        <p>
          Your ballot, including your name, will be visible to all viewers of this poll.
        </p>
        <Button
          onClick={() => this.handleSubmit()}
          className="submit-button"
        >
          Submit
        </Button>
      </Card>
    );
  }

  onUpdateCandidates(candidates: string[]) {
    this.setState({
      ballot: { ...this.state.ballot, rankings: candidates },
    });
  }

  onUpdateVoterName(name: string) {
    this.setState({
      ballot: { ...this.state.ballot, name },
    });
  }

  async handleSubmit() {
    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.state.ballot.id,
      this.state.ballot.name,
      this.state.ballot.rankings,
    );

    this.props.onSubmitBallot(this.state.ballot);
  }

  makeNewBallot(): Ballot {
    const ballot: Ballot = {
      name: '',
      id: crypto.randomBytes(32).toString('hex'),
      rankings: shuffle(this.props.poll.candidates.slice(0)),
      timestamp: Date.now(),
    };
    return ballot;
  }
}

export default CreateBallot;
