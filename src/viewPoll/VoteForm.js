import React, { Component } from "react";
import type { Ref } from "react";
import Ranker from "./Ranker";
import { postBallot } from "../api";
import { IdentityContext, IdentityService } from "../userIdentity";
let crypto = require('crypto')

type Props = {
  candidates: string[],
  pollId: string
};

type State = {
  voterName: string,
  rankedCandidates: string[]
};

class VoteForm extends Component<Props, State> {

  static contextType = IdentityContext;
  context: IdentityService

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

  onUpdateVoterName(event: SyntheticEvent<HTMLTextAreaElement>) {
    let name = event.currentTarget.value;
    this.setState({
      voterName: name
    });
  }

  onSubmit(event: SyntheticEvent<HTMLElement>) {
    event.preventDefault();
    let ballotId = crypto.randomBytes(32).toString('hex')
    postBallot(
      this.context.getIdentity(),
      this.props.pollId,
      ballotId,
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
