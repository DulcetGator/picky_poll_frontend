import React from 'react'
import { Table } from 'react-bootstrap'
import { Ballot } from '../../api'
import { ExplainStvRound, explainStv } from './explainUtil'
import { PhaseControls } from './partials/PhaseControls'

import './InstantRunoffExplainer.css'

type Props = {
  ballots: Ballot[]
}

type State = {
  explanation: ExplainStvRound[]
  phaseIndex: number
}

function PhaseExplainer(props: {round: ExplainStvRound}) {

  const candidateCounts = [...props.round.candidateCounts].reverse()
  function rowMarkers(index: number) {
    
    const isWinner = candidateCounts.length === 1
    const isLoser = !isWinner && index === candidateCounts.length - 1

    if (isWinner) {
      return <div className='result-row-marker result-row-marker-winner'>
        {
          (Array.from(candidateCounts[0].candidates).length === 1)
            ? 'Winner'
            : 'Winner (tie)'
        }
      </div>
    } else if (isLoser) {
      return <div className='result-row-marker result-row-marker-eliminated'>
        Eliminated
      </div>
    } else {
      return null
    }
  }

  function rows(cc: {candidates: Set<string>, count: number}, index: number) {
    const markers = rowMarkers(index)
    return Array
      .from(cc.candidates)
      .map( candidate => (
        <tr key={candidate}>
          <td className="td-marker">
            {markers}
          </td>
          <td className="td-count">
            {cc.count}
          </td>
          <td className="td-candidate">
            {candidate}
          </td>
        </tr>
      ))
  }

  return (
    <div className="PhaseExplainer">
      <Table size="sm" striped>
        <tbody>
          {
            candidateCounts.flatMap((cc, i) => rows(cc, i))
          }
        </tbody>
      </Table>
    </div>
  )
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