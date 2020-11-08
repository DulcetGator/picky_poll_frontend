import React, { Component } from 'react'
import { Button, Card, FormControl, InputGroup } from 'react-bootstrap'
import Ranker from '../Ranker'
import { Poll, Ballot} from '../../api'
import { postBallot } from '../../api'
import shuffle from '../../util/shuffle'

import './CreateBallot.css'

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
      <Card className="CreateBallot">
        <Card.Header>
          <InputGroup>
            <FormControl
              placeholder="Name or alias"
              onChange={e => this.onUpdateVoterName(e.target.value)} />
          </InputGroup>
        </Card.Header>
        <Ranker
          candidates={this.state.ballot.rankings}
          onUpdateCandidates={e => this.onUpdateCandidates(e)}
          />
        <p>
          Your ballot, including your name, will be visible to all viewers of this poll.
        </p>
        <Button
          onClick={e => this.handleSubmit(e)}
          className="submit-button">
            Submit
        </Button>
      </Card>
    );
  }

  onUpdateCandidates(candidates: string[]) {
    this.setState({
      ballot: Object.assign({}, this.state.ballot, {rankings: candidates})
    });
  }

  onUpdateVoterName(name: string) {
    this.setState({
      ballot: Object.assign({}, this.state.ballot, {name: name})
    });
  }

  async handleSubmit(event: React.MouseEvent) {

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
