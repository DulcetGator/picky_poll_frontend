import React, { Component } from "react";
import type { Ref } from "react";
import Ranker from "./Ranker";
import { postBallot } from "../api";

type Props = {
  candidates: string[],
  pollId: string
};

type State = {
  voterName: string,
  rankedCandidates: string[]
};

class VoteForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      voterName: "",
      rankedCandidates: this.shuffle(this.props.candidates.slice(0))
    };
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <Ranker
          candidates={this.state.rankedCandidates}
          onUpdateCandidates={e => this.onUpdateCandidates(e)}
        />
        <label>
          Your name:{" "}
          <input type="text" onChange={n => this.onUpdateVoterName(n)} />
        </label>
        <button type="Submit">Submit Ballot</button>
      </form>
    );
  }

  onUpdateCandidates(candidates: string[]) {
    this.setState({
      rankedCandidates: candidates
    });
  }

  onUpdateVoterName(event: ChangeEvent<TextInput>) {
    let name = event.target.value;
    this.setState({
      voterName: name
    });
  }

  onSubmit(event: FormEvent) {
    event.preventDefault();
    postBallot(
      this.props.pollId,
      this.state.voterName,
      this.state.rankedCandidates
    );
  }

  shuffle<A>(a: A[]): A[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      let tmp = a[j];
      a[j] = a[i];
      a[i] = tmp;
    }
    return a;
  }
}

export default VoteForm;
