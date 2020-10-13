import React, { Component, Context } from "react";
import { IdentityContext, IdentityService } from '../../userIdentity';
import { Ballot } from "../../api";

type Props = {
  ballot: Ballot
}

type State = {
  editing: boolean;
}

export default class BallotPreview extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;
  context!: IdentityService

  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false
    };
  }

  render() {
    return (
      <div>
        {this.props.ballot.name}
      </div>
    );
  }
}