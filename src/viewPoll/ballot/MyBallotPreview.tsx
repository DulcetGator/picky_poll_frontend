import React, { Component } from "react";
import { Button, Card } from 'react-bootstrap'
import { Poll, Ballot} from "../../api"
import EditBallot from './EditBallot'

import './MyBallotPreview.css'

type MyBallotReadOnlyProps = {
  ballot: Ballot,
  onEdit: () => void
}

function MyBallotReadOnly(props: MyBallotReadOnlyProps) {
  const rankings = props.ballot.rankings.map(candidate =>
    <li key={candidate}>{candidate}</li>
  );

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
  ballotKey: string,
  ballot: Ballot,
}

type State = {
  isEditing: boolean
}

export default class MyBallotPreview extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {isEditing: false};
  }

  handleSubmitBallot() {
    this.setState({
      isEditing: false
    });
  }

  handleEdit() {
    this.setState({isEditing: true});
  }

  render() {
    if (this.state.isEditing) {
      return <EditBallot
        poll={this.props.poll}
        ballotKey={this.props.ballotKey}
        ballot={this.props.ballot} 
        onSubmitBallot={ballot => this.handleSubmitBallot()}
      />;
    } else {
      return <MyBallotReadOnly 
        ballot={this.props.ballot}
        onEdit={() => this.handleEdit()}
      />
    }
  }
}