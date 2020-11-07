import React from 'react'
import { Ballot } from '../../api'
import { InstantRunoffResult, instantRunoff } from '../../util/instantRunoff'
import { PhaseControls } from './partials/PhaseControls'
import { PhaseExplainer } from './partials/PhaseExplainer'

import './InstantRunoffExplainer.css'

type Props = {
  ballots: Ballot[]
}

type State = {
  result: InstantRunoffResult,
  phaseIndex: number
}

export class InstantRunoffExplainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const result = instantRunoff(this.props.ballots.map(b => b.rankings))
    if (result.rounds.length > 1) {
      //drop the last round, which has only the winners.
      result.rounds.splice(result.rounds.length - 1, 1)
    }
    this.state = {
      result: result,
      phaseIndex: 0
    }
  }

  makePhaseMutator(mutator: (old: number) => number) {
    return () => {
      const nextPhase = mutator(this.state.phaseIndex)
      this.setState({phaseIndex: nextPhase})
    }
  }

  phaseControls() {
    return (
      <PhaseControls 
        isFirst={this.state.phaseIndex === 0}
        isLast={this.state.phaseIndex === this.state.result.rounds.length - 1}
        onFirst={this.makePhaseMutator(_ => 0)}
        onPrev={this.makePhaseMutator(i => i-1)}
        onNext={this.makePhaseMutator(i => i+1)}
        onLast={this.makePhaseMutator(_ => this.state.result.rounds.length-1)}
      />
    )
  }

  render() {
    const phase = this.state.result.rounds[this.state.phaseIndex]
    return (
      <div className="StvExplainer" >
        { phase
          ? 
            <>
              <div className="stv-explainer-header">
                <div className="round-indicator">
                  Round {this.state.phaseIndex + 1}
                </div>
                <div>
                  {this.phaseControls()}
                </div>
              </div>
              <PhaseExplainer round={phase} />
            </>
          : null
        }
      </div>
    )
  }
}