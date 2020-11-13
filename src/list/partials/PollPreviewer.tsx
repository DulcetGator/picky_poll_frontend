import React, { Component, MouseEvent, ReactNode } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GetPollResponse, getPoll } from '../../api';
import { KnownPoll } from '../../userIdentity';
import { PollPreview } from './PollPreview';
import { RemoveModal } from './RemoveModal';
import './PollPreviewer.css';

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
    super(props);
    this.state = {
      pollState: {
        status: 'fetching',
      },
      removeModal: false,
    };
  }

  async componentDidMount(): Promise<void> {
    const poll = await getPoll(this.props.knownPoll.poll.id);
    if (poll) {
      this.setState({
        ...this.state,
        pollState: { status: 'ok', poll },
      });
    } else {
      this.setState({
        ...this.state,
        pollState: { status: 'notfound' },
      });
    }
  }

  wrapInLink(contents: ReactNode): ReactNode {
    switch (this.state.pollState.status) {
      case 'ok':
        return (
          <Link to={`/polls/${this.state.pollState.poll.poll.id}`}>
            {contents}
          </Link>
        );
      default:
        return (
          <div className="null-link">
            {contents}
          </div>
        );
    }
  }

  cardContents(): ReactNode {
    switch (this.state.pollState.status) {
      case 'ok':
        return (
          <PollPreview
            poll={this.state.pollState.poll}
            knownPoll={this.props.knownPoll}
          />
        );
      case 'fetching':
        return (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        );
      case 'notfound':
        return (
          <p>Failed to fetch this poll.</p>
        );
    }
  }

  handleRemoveButton(e: MouseEvent): void {
    e.preventDefault();
    this.setState({ ...this.state, removeModal: true });
  }

  handleCancelRemove(): void {
    this.setState({ ...this.state, removeModal: false });
  }

  handleConfirmRemove(): void {
    this.props.onRemove(this.props.knownPoll);
  }

  removeModal(): ReactNode {
    return this.state.removeModal
      ? (
        <RemoveModal
          poll={this.props.knownPoll}
          onHide={() => this.handleCancelRemove()}
          onOk={() => this.handleConfirmRemove()}
        />
      )
      : null;
  }

  render(): ReactNode {
    const card = (
      <Card className="PollPreviewer">
        {this.removeModal()}
        <Card.Title>
          <div className="title">
            {this.wrapInLink(
              <div className="padder poll-description">
                {this.props.knownPoll.poll.description}
              </div>,
            )}
            <div className="padder remove-poll-button">
              <Button size="sm" variant="secondary" onClick={(e) => this.handleRemoveButton(e)}>
                Remove
              </Button>
            </div>
          </div>
        </Card.Title>
        {this.wrapInLink(
          <Card.Body>
            {this.cardContents()}
          </Card.Body>,
        )}
      </Card>
    );
    return card;
  }
}
