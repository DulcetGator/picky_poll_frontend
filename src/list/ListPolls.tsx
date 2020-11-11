import React, { Component, Context } from 'react'
import { Link } from 'react-router-dom'
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
    const knownPolls = this.context.getKnownPolls().filter(p => !p.isHidden)
    const sorted = knownPolls
      .sort((a, b) => a.poll.expires.localeCompare(b.poll.expires))
      .reverse()
    const myPolls = sorted.filter(kp => kp.isMine)
    const seenPolls = sorted.filter(kp => !kp.isMine)

    this.setState({
      myPolls: myPolls,
      seenPolls: seenPolls
    })
  }

  handleRemove(kp: KnownPoll) {
    this.context.hidePoll(kp.poll.id)
    const [myPolls, seenPolls] = [this.state.myPolls, this.state.seenPolls].map(pollList => {
      const index = pollList.indexOf(kp)
      if (index >= 0) {
        return [...pollList.slice(0, index), ...pollList.slice(index + 1)].flat(1)
      } else {
        return pollList
      }
    })
    this.setState({myPolls: myPolls, seenPolls: seenPolls})
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
              <PollPreviewer knownPoll={kp} onRemove={kp => this.handleRemove(kp)} />
            </li>
          )}
        </ul>
      </>
    }
  }

  nilExplanation() {
    if (this.state.myPolls.length + this.state.seenPolls.length > 0) {
      return null
    }
    return <div>
      Polls you've 
      {' '}<Link to="/create">created</Link>{' '}
      or seen will be listed here.
    </div>
  }

  render() {
    const owned = this.pollsSublist("Polls you've created", this.state.myPolls)
    const unowned = this.pollsSublist("Polls you've viewed", this.state.seenPolls)
    return (
      <div className="ListPolls">
        {owned}
        {unowned}
        {this.nilExplanation()}
      </div>
    )
  }
}