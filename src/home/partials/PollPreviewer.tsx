import React, { Component, ReactNode } from 'react'
import { Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GetPollResponse, getPoll } from '../../api'
import { KnownPoll } from '../../userIdentity'
import { PollPreview } from './PollPreview'
import './PollPreviewer.css'

type Props = {
  knownPoll: KnownPoll
}

type State = {
  status: 'ok'
  poll: GetPollResponse
} | {status: 'notfound'} | {status: 'fetching'}

export class PollPreviewer extends Component<Props, State> {
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

  linkCard(contents: ReactNode) {
    switch(this.state.status) {
      case 'ok':
        return (
          <Link to={`/view/${this.state.poll.poll.id}`}>
            {contents}
          </Link>
        )
      default:
        return contents;
    }
  }

  cardContents() {
    switch(this.state.status) {
      case 'ok':
        return <PollPreview
          poll={this.state.poll}
          knownPoll={this.props.knownPoll} />
      case 'fetching':
        return (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        )
      case 'notfound':
        return (
          <p>Failed to fetch this poll.</p>
        )
    }
  }

  render() {
    const card = (
      <Card className="PollPreview">
        <Card.Title className="poll-description">
          {this.props.knownPoll.poll.description}
        </Card.Title>
        {this.cardContents()}
      </Card>
    )
    return this.linkCard(card)
  }
}
