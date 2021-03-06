import React, { Component } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Ballot, Candidate, Poll } from '../../../api';
import EditBallot from './EditBallot';

import './MyBallotPreview.css';

type MyBallotReadOnlyProps = {
  ballot: Ballot,
  onEdit: () => void
}

function MyBallotReadOnly(props: MyBallotReadOnlyProps) {
  const rankings = props.ballot.rankings.map((candidate) => <li key={candidate}>{candidate}</li>);

  return (
    <Card className="MyBallotPreview">
      <Card.Header>
        {props.ballot.name}
      </Card.Header>
      <Card.Body>
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
  candidates: Map<string, Candidate>,
  ballotKey: string,
  ballot: Ballot,
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
  }

  handleEdit() {
    this.setState({ isEditing: true });
  }

  render() {
    if (this.state.isEditing) {
      return (
        <EditBallot
          poll={this.props.poll}
          candidates={this.props.candidates}
          ballotKey={this.props.ballotKey}
          ballot={this.state.ballot}
          onSubmitBallot={(ballot) => this.handleSubmitBallot(ballot)}
        />
      );
    }
    return (
      <MyBallotReadOnly
        ballot={this.state.ballot}
        onEdit={() => this.handleEdit()}
      />
    );
  }
}
