import React, { Component, Context } from 'react';
import { getPoll, Ballot, Candidate, Poll } from '../../api';
import PollDetailsView from './PollDetailsView';
import IdentityContext, { IdentityService } from '../../userIdentity';
import BasicSpinner from '../../partials/BasicSpinner';

type Props = {
  pollId: string
};

type OkState = {
  status: "OK",
  poll: Poll,
  ballots: Ballot[]
}

type State =  OkState | {
  status: "Failed"
} | {
  status: "Fetching"
};

class PollDetails extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;

  context!: IdentityService

  constructor(props: Props) {
    super(props);
    this.state = { status: "Fetching" };
  }

  componentDidMount() {
    this.getPoll();
  }

  private renderPoll(okState: OkState) {
    const handleSubmitNewBallot = (b: Ballot) => {
      const ballots = [...okState.ballots, b];
      this.setState({ ...okState, ballots });
    }

    const handleUpdateBallot = (updated: Ballot) => {
      const updatedPosition = okState.ballots.findIndex(item => item.id === updated.id);
      const ballots = [...okState.ballots];
      ballots[updatedPosition] = updated;
      this.setState({ ...okState, ballots});
    }

    const handleSubmitNewCandidate = (c: Candidate) => {
      const candidates = [...okState.poll.candidates, c];
      okState.poll.candidates = candidates;
      this.setState({...okState, poll: okState.poll})
    }

    return (
      <PollDetailsView
        poll={okState.poll}
        ballots={okState.ballots}
        onSubmitNewBallot={handleSubmitNewBallot}
        onSubmitNewCandidate={handleSubmitNewCandidate}
        onUpdateBallot={handleUpdateBallot}
      />
    );
  }

  render() {
    switch(this.state.status) {
      case "OK":
        return this.renderPoll(this.state)
      case "Failed":
        return (
          <span>
            No poll with id {this.props.pollId}
          </span>
        )
      case "Fetching":
        return (
          <BasicSpinner>
            Fetching poll {this.props.pollId}
          </BasicSpinner>
        )
    }
  }

  async getPoll() {
    const response = await getPoll(this.props.pollId);
    if (response) {
      this.context.addKnownPoll(response.poll, false);
      this.setState({ status: "OK", poll: response.poll, ballots: response.ballots });
    } else {
      this.setState({ status: "Failed"});
    }
  }
}

export default PollDetails;
