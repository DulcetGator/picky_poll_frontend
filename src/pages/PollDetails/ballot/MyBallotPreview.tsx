import React, { Component } from 'react';
import { Alert, Button, Card } from 'react-bootstrap';
import { Ballot, Poll } from '../../../api';
import EditBallot from './EditBallot';

import './MyBallotPreview.css';

type MyBallotReadOnlyProps = {
  poll: Poll,
  ballot: Ballot,
  onEdit: () => void
}

function MyBallotReadOnly(props: MyBallotReadOnlyProps) {
  const rankings = props.ballot.rankings.map((candidate) => <li key={candidate}>{candidate}</li>);
  const warning = props.ballot.rankings.length < props.poll.candidates.length
    ? <Alert variant="info">New candidates available</Alert>
    : null;

  return (
    <Card className="MyBallotPreview">
      <Card.Header>
        {props.ballot.name}
      </Card.Header>
      <Card.Body>
        {warning}
        <ol>
          {rankings}
        </ol>
        <Button variant="outline-primary" onClick={() => props.onEdit()}>
          Edit
        </Button>
      </Card.Body>
    </Card>
  );
}

type Props = {
  poll: Poll,
  ballotKey: string,
  ballot: Ballot,
  onUpdateBallot: (b: Ballot) => void
}

type State = {
  ballot: Ballot,
  isEditing: boolean
}

export default class MyBallotPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ballot: props.ballot,
      isEditing: false,
    };
  }

  handleSubmitBallot(ballot: Ballot) {
    this.setState({
      ballot,
      isEditing: false,
    });
    this.props.onUpdateBallot(ballot);
  }

  handleEdit() {
    this.setState({ isEditing: true });
  }

  render() {
    if (this.state.isEditing) {
      return (
        <EditBallot
          poll={this.props.poll}
          ballotKey={this.props.ballotKey}
          ballot={this.state.ballot}
          onSubmitBallot={(ballot) => this.handleSubmitBallot(ballot)}
        />
      );
    }
    return (
      <MyBallotReadOnly
        poll={this.props.poll}
        ballot={this.state.ballot}
        onEdit={() => this.handleEdit()}
      />
    );
  }
}
