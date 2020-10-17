import React, { Component, Context } from 'react'
import { Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GetPollResponse, getPoll } from '../api'
import { KnownPoll } from '../userIdentity'
import './PollPreview.css'

type Props = {
  knownPoll: KnownPoll
}

type State = {
  poll: GetPollResponse | null
}

export class PollPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {poll: null}
  }

  async componentDidMount() {
    let poll = await getPoll(this.props.knownPoll.poll.id)
    this.setState({poll: poll})
  }

  render() {
    if (this.state.poll) {

      const isClosed = !!this.state.poll.poll.close
      const voted = (!isClosed) && this.props.knownPoll.knownBallots.length > 0
      let voteStatus = "You haven't voted yet."
      if (isClosed) {
        voteStatus = 'Poll is closed.'
      } else if (voted) {
        voteStatus = ''
      }

      return (
        <Link to={`/view/${this.state.poll.poll.id}`}>
          <Card className="PollPreview">
            <p className="poll-description">{this.state.poll.poll.description}</p>
            <p className="poll-vote-status">{voteStatus}</p>
          </Card>
        </Link>
      );
    } else {
      return (
        <Card className="PollPreview">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Card>
      )
    }
  }
}
