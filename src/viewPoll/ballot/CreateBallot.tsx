import React, { Component } from "react";
import Ranker from "../Ranker";
import { Poll, Ballot} from "../../api"
import { postBallot } from "../../api"
import shuffle from '../../util/shuffle'

let crypto = require("crypto")

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
      ballot: this.makeNewBallot()
    };
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <Ranker
          candidates={this.state.ballot.rankings}
          onUpdateCandidates={e => this.onUpdateCandidates(e)}
        />
        <label>
          Your name:{" "}
          <input
            type="text"
            onChange={n => this.onUpdateVoterName(n)}
            disabled={!this.props.isNew} />
        </label>
        <button type="submit">Submit Ballot</button>
      </form>
    );
  }

  onUpdateCandidates(candidates: string[]) {
    this.setState({
      ballot: Object.assign({}, this.state.ballot, {rankings: candidates})
    });
  }

  onUpdateVoterName(event: React.FormEvent<HTMLInputElement>) {
    let name = event.currentTarget.value;
    this.setState({
      ballot: Object.assign({}, this.state.ballot, {name: name})
    });
  }

  async onSubmit(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();

    await postBallot(
      this.props.ballotKey,
      this.props.poll.id,
      this.state.ballot.id,
      this.state.ballot.name,
      this.state.ballot.rankings
    );

    this.props.onSubmitBallot(this.state.ballot)
  }

  makeNewBallot(): Ballot {
    let ballot: Ballot = {
      name: '',
      id: crypto.randomBytes(32).toString('hex'),
      rankings: shuffle(this.props.poll.candidates.slice(0)),
      timestamp: Date.now()
    }
    return ballot;
  }


}

export default CreateBallot;
