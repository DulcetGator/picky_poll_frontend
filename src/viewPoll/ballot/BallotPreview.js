import React, { Component, type Context, type Node } from "react";
import { IdentityContext, IdentityService } from '../../userIdentity';
import type { Ballot } from "../../api";

type Props = {
  ballot: Ballot
}

type State = {
  editing: bool;
}

export default class BallotPreview extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;
  context: IdentityService

  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false
    };
  }

  render(): Node {
    return (
      <div>
        {this.props.ballot.name}
      </div>
    );
  }
}