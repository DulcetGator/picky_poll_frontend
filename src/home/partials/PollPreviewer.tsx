import React, { Component, MouseEvent, ReactNode } from 'react'
import { Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { GetPollResponse, getPoll } from '../../api'
import { KnownPoll } from '../../userIdentity'
import { PollPreview } from './PollPreview'
import { RemoveModal } from './RemoveModal'
import './PollPreviewer.css'

type Props = {
  knownPoll: KnownPoll,
  onRemove: (kp: KnownPoll) => void
}

type State = {

  pollState: {
    status: 'ok'
    poll: GetPollResponse
  } | {status: 'notfound'} | {status: 'fetching'},

  removeModal: boolean
}

export class PollPreviewer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      pollState: {
        status: 'fetching'
      },
      removeModal: false
    }
  }

  async componentDidMount() {
    let poll = await getPoll(this.props.knownPoll.poll.id)
    if (poll) {
      this.setState(Object.assign({}, this.state,
        {pollState: {status: 'ok', poll: poll}
      }))
    } else {
      this.setState(Object.assign({}, this.state,
        {pollState: {status: 'notfound'}}))
    }
  }

  wrapInLink(contents: ReactNode) {
    switch(this.state.pollState.status) {
      case 'ok':
        return (
          <Link to={`/view/${this.state.pollState.poll.poll.id}`}>
            {contents}
          </Link>
        )
      default:
        return contents;
    }
  }

  cardContents() {
    switch(this.state.pollState.status) {
      case 'ok':
        return <PollPreview
          poll={this.state.pollState.poll}
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

  handleRemoveButton(e: MouseEvent) {
    e.preventDefault()
    this.setState(Object.assign({}, this.state, {removeModal: true}))
  }

  handleCancelRemove() {
    this.setState(Object.assign({}, this.state, {removeModal: false}))
  }

  handleConfirmRemove() {
    this.props.onRemove(this.props.knownPoll)
  }

  removeModal() {
    return this.state.removeModal
      ? <RemoveModal poll={this.props.knownPoll}
          onHide={() => this.handleCancelRemove()}
          onOk={() => this.handleConfirmRemove()}
        />
      : null
  }

  render() {
    const card = (
      <Card className="PollPreviewer">
        {this.removeModal()}
        <Card.Title>
          <div className="title">
            <div className="poll-description">
              {this.wrapInLink(this.props.knownPoll.poll.description)}
            </div>
            <div className="remove-poll-button">
              <Button size="sm" variant="secondary" onClick={e => this.handleRemoveButton(e)}>
                Remove
              </Button>
            </div>
          </div>
        </Card.Title>
        <div>
          {this.wrapInLink(this.cardContents())}
        </div>
      </Card>
    )
    return card;
  }
}
