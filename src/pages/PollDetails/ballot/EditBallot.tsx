import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import Ranker from './Ranker';
import { Candidate, Poll, Ballot, postBallot } from '../../../api';

import shuffle from '../../../util/shuffle';
import promiseTimeout from '../../../util/promiseTimeout'
import BasicSpinner from '../../../partials/BasicSpinner';

type Props = {
  poll: Poll,
  candidates: Map<string, Candidate>,
  ballotKey: string,
  ballot: Ballot,

  onSubmitBallot: (b: Ballot) => void
};

type State = {
  rankedCandidates: Candidate[],
  isBusy: boolean,
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const newChoices = Array.from(props.candidates.keys())
      .filter((c) => props.ballot.rankings.indexOf(c) < 0);
    shuffle(newChoices);

    const rankings = props.ballot.rankings.concat(newChoices)
      .flatMap(name =>
        [props.candidates.get(name)].filter(value => !!value) as Candidate[]
      );

    this.state = {
      isBusy: false,
      rankedCandidates: rankings,
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
            candidates={this.state.rankedCandidates}
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

  handleUpdateCandidates(candidates: Candidate[]) {
    this.setState({ rankedCandidates: candidates });
  }

  async handleSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    this.setState({ isBusy: true});

    const minWaitPromise = promiseTimeout(300);

    const rankings = this.state.rankedCandidates.map(c => c.name);
    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.props.ballot.id,
      this.props.ballot.name,
      rankings,
    );
    await minWaitPromise;

    const newBallot = { ...this.props.ballot, rankings };

    this.props.onSubmitBallot(newBallot);
  }
}

export default CreateBallot;
