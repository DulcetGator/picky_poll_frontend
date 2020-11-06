import React from 'react'
import { Ballot } from '../../api'
import { ExplainStvRound, explainStv } from './explainUtil'
import { PhaseControls } from './partials/PhaseControls'
import { PhaseExplainer } from './partials/PhaseExplainer'

import './InstantRunoffExplainer.css'

type Props = {
  ballots: Ballot[]
}

type State = {
  explanation: ExplainStvRound[]
  phaseIndex: number
}

export class InstantRunoffExplainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const explanation = explainStv(this.props.ballots.map(b => b.rankings))
    this.state = {
      explanation: explanation,
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
        isLast={this.state.phaseIndex === this.state.explanation.length - 1}
        onFirst={this.makePhaseMutator(_ => 0)}
        onPrev={this.makePhaseMutator(i => i-1)}
        onNext={this.makePhaseMutator(i => i+1)}
        onLast={this.makePhaseMutator(_ => this.state.explanation.length-1)}
      />
    )
  }

  render() {
    const phase = this.state.explanation[this.state.phaseIndex]
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