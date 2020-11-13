import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import Ranker from '../Ranker';
import { Poll, Ballot, postBallot } from '../../api';

import shuffle from '../../util/shuffle';

type Props = {
  poll: Poll,
  ballotKey: string,
  ballot: Ballot,

  onSubmitBallot: (b: Ballot) => void
};

type State = {
  rankings: string[]
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let newChoices = props.poll.candidates.filter((c) => props.ballot.rankings.indexOf(c) < 0);
    newChoices = shuffle(newChoices);
    this.state = {
      rankings: props.ballot.rankings.concat(newChoices),
    };
  }

  render() {
    return (
      <Card>
        <Card.Header>
          {this.props.ballot.name}
        </Card.Header>
        <Card.Body>
          <Ranker
            candidates={this.state.rankings}
            onUpdateCandidates={(e) => this.handleUpdateCandidates(e)}
          />
          <Button
            variant="primary"
            onClick={(e) => this.handleSubmit(e)}
          >
            Submit Changes
          </Button>
        </Card.Body>
      </Card>
    );
  }

  handleUpdateCandidates(candidates: string[]) {
    this.setState({ rankings: candidates });
  }

  async handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();

    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.props.ballot.id,
      this.props.ballot.name,
      this.state.rankings,
    );

    const newBallot = { ...this.props.ballot, rankings: this.state.rankings };

    this.props.onSubmitBallot(newBallot);
  }
}

export default CreateBallot;
