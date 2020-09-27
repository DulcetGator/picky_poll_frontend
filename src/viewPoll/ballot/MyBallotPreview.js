import React, { Component } from "react";
import type { Poll, Ballot} from "../../api"
import EditBallot from './EditBallot'

type MyBallotReadOnlyProps = {
  ballot: Ballot,
  onEdit: () => void
}

function MyBallotReadOnly(props: MyBallotReadOnlyProps) {
  const rankings = props.ballot.rankings.map(candidate =>
    <li key={candidate}>{candidate}</li>
  );

  return (
    <div>
      <h1>{props.ballot.name}</h1>
      <ol>
        {rankings}
      </ol>
      <button onClick={() => props.onEdit()}>Edit</button>
    </div>
  );
}

type Props = {
  poll: Poll,
  ballotKey: string,
  ballot: Ballot,
}

type State = {
  isEditing: bool
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