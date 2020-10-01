import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { type GetPollResponse, type Poll, getPoll } from '../api'
import { IdentityContext, IdentityService } from '../userIdentity'

type Props = { }
type State = {
  polls: Poll[]
}

function PollPreview(props: {poll: Poll}) {
  return (
    <Link to={`/view/${props.poll.id}`} >
      <p>
        {props.poll.description}
      </p>
    </Link>
  );
}

export class ListPolls extends Component<Props, State> {
  static contextType = IdentityContext;
  context: IdentityService

  constructor(props: Props) {
    super(props)
    this.state = {
      polls: []
    }
  }

  async confirmPoll(pollId: string) {
    const response = await getPoll(pollId);
    if (response) {
      const polls = [response.poll].concat(this.state.polls)//.sort(p => p.poll.id);
      await this.setState(Object.assign({}, this.state, {polls: polls}));
    }
  }

  componentDidMount() {
    this.context.getKnownPolls().forEach(p => this.confirmPoll(p.id));
  }

  render() {
    return (
      <ul>
        {this.state.polls.map(p =>
          <li key={p.id}><PollPreview poll={p} /></li>
        )}
      </ul>
    )
  }
}