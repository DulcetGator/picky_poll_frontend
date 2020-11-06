import React, { Component } from 'react'
import { Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GetPollResponse, getPoll } from '../api'
import { KnownPoll } from '../userIdentity'
import './PollPreview.css'

type Props = {
  knownPoll: KnownPoll
}


type State = {
  status: 'ok'
  poll: GetPollResponse
} | {status: 'notfound'} | {status: 'fetching'}

export class PollPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {status: 'fetching'}
  }

  async componentDidMount() {
    let poll = await getPoll(this.props.knownPoll.poll.id)
    if (poll) {
      this.setState({status: 'ok', poll: poll})
    } else {
      this.setState({status: 'notfound'})
    }
  }

  renderPoll(poll: GetPollResponse) {

    const isClosed = !!poll.poll.close
    const voted = (!isClosed) && this.props.knownPoll.knownBallots.length > 0
    let voteStatus = "You haven't voted yet."
    if (isClosed) {
      voteStatus = 'Poll is closed.'
    } else if (voted) {
      voteStatus = ''
    }

    return (
      <Link to={`/view/${poll.poll.id}`}>
        <Card className="PollPreview">
          <p className="poll-description">{poll.poll.description}</p>
          <p className="poll-vote-status">{voteStatus}</p>
        </Card>
      </Link>
    );
  }

  render() {
    const [cardContents, cardLink] = [null, null]
    switch(this.state.status) {
      case 'ok':
        return this.renderPoll(this.state.poll)
      case 'fetching':
        return (
          <Card className="PollPreview">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Card>
        )
      case 'notfound':
        return (
          <Card className="PollPreview">
            <p className="poll-description">{this.props.knownPoll.poll.description}</p>
            <p>Failed to fetch this poll.</p>
          </Card>
        )
    }
  }
}
