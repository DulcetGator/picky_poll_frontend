import React, { Component, Context } from 'react';
import { Card } from 'react-bootstrap';
import { IdentityContext, IdentityService } from '../../../userIdentity';
import { Ballot } from '../../../api';

import './BallotPreview.css';

type Props = {
  ballot: Ballot
}

type State = {
}

export default class BallotPreview extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;

  context!: IdentityService

  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const rankedItems = this.props.ballot.rankings.map((r) => (
      <li key={r}>
        {r}
      </li>
    ));
    return (
      <Card className="BallotPreview">
        <Card.Header>
          {this.props.ballot.name}
        </Card.Header>
        <Card.Body>
          <ol className="ranked-items">
            {rankedItems}
          </ol>
        </Card.Body>
      </Card>
    );
  }
}
