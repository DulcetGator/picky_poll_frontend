import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import Ranker from '../Ranker';
import { Poll, Ballot, postBallot } from '../../api';

import shuffle from '../../util/shuffle';
import promiseTimeout from '../../util/promiseTimeout'
import BasicSpinner from '../../partials/BasicSpinner';

type Props = {
  poll: Poll,
  ballotKey: string,
  ballot: Ballot,

  onSubmitBallot: (b: Ballot) => void
};

type State = {
  rankings: string[],
  isBusy: boolean,
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let newChoices = props.poll.candidates.filter((c) => props.ballot.rankings.indexOf(c) < 0);
    newChoices = shuffle(newChoices);
    this.state = {
      isBusy: false,
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
          {this.state.isBusy
            ? <BasicSpinner>Submitting changes</BasicSpinner>
            : <Button
                variant="primary"
                onClick={(e) => this.handleSubmit(e)}
              >
                Submit Changes
              </Button>
          }
        </Card.Body>
      </Card>
    );
  }

  handleUpdateCandidates(candidates: string[]) {
    this.setState({ rankings: candidates });
  }

  async handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    this.setState({ isBusy: true});

    const minWaitPromise = promiseTimeout(300)
    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.props.ballot.id,
      this.props.ballot.name,
      this.state.rankings,
    );
    await minWaitPromise;

    const newBallot = { ...this.props.ballot, rankings: this.state.rankings };

    this.props.onSubmitBallot(newBallot);
  }
}

export default CreateBallot;
