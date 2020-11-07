import React, { Component, Context } from 'react'
import { IdentityContext, IdentityService, KnownPoll } from '../userIdentity'
import { PollPreviewer } from './partials/PollPreviewer'
import './ListPolls.css'

type Props = { }
type State = { 
  myPolls: KnownPoll[],
  seenPolls: KnownPoll[]
}

export class ListPolls extends Component<Props, State> {
  static contextType: Context<IdentityService> = IdentityContext;
  context!: React.ContextType<typeof IdentityContext>

  constructor(props: Props) {
    super(props)
    this.state = {
      myPolls: [],
      seenPolls: [],
    }
  }

  componentDidMount() {
    const allKnownPolls = this.context.getKnownPolls()
    const sorted = allKnownPolls
      .sort((a, b) => a.poll.expires.localeCompare(b.poll.expires))
      .reverse()
    const myPolls = sorted.filter(kp => kp.isMine)
    const seenPolls = sorted.filter(kp => !kp.isMine)

    this.setState({
      myPolls: myPolls,
      seenPolls: seenPolls
    })
  }

  pollsSublist(title: string, knownPollsSubset: KnownPoll[]) {
    if (knownPollsSubset.length === 0) {
      return null
    } else {
      return <>
        <h2>{title}</h2>
        <ul>
          {knownPollsSubset.map(kp =>
            <li key={kp.poll.id}>
              <PollPreviewer knownPoll={kp} />
            </li>
          )}
        </ul>
      </>
    }
  }

  render() {
    return (
      <div className="ListPolls">
        {this.pollsSublist("Polls you've created", this.state.myPolls)}
        {this.pollsSublist("Polls you've viewed", this.state.seenPolls)}
      </div>
    )
  }
}