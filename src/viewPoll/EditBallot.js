import React, { Component } from "react";
import type { Ref } from "react";
import Ranker from "./Ranker";
import type { Poll, Ballot} from "../api"
import { postBallot } from "../api";
import shuffle from '../util/shuffle'

type Props = {
  poll: Poll,
  ballotKey: string,
  ballot: Ballot,

  onSubmitBallot: (Ballot => void)
};

type State = {
  rankings: string[]
};

class CreateBallot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let newChoices = props.poll.candidates.filter(c => props.ballot.rankings.indexOf(c) < 0);
    newChoices = shuffle(newChoices)
    this.state = {
      rankings: props.ballot.rankings.concat(newChoices)
    };
  }

  render() {
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <p>{this.props.ballot.name}</p>
        <Ranker
          candidates={this.state.rankings}
          onUpdateCandidates={e => this.handleUpdateCandidates(e)}
        />
        <button type="Submit">Submit Changes</button>
      </form>
    );
  }

  handleUpdateCandidates(candidates: string[]) {
    this.setState(Object.assign({}, {rankings: candidates}));
  }

  async handleSubmit(event: SyntheticEvent<HTMLElement>) {
    event.preventDefault();

    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.props.ballot.id,
      this.props.ballot.name,
      this.state.rankings
    );

    let newBallot = Object.assign({}, this.props.ballot, {rankings: this.state.rankings});

    this.props.onSubmitBallot(newBallot);
  }
}

export default CreateBallot;
