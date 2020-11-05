import React from 'react'
import { Table } from 'react-bootstrap'
import { Ballot } from '../../api'
import { ExplainStvRound, explainStv } from './explainUtil'
import { PhaseControls } from './partials/PhaseControls'

import './StvExplainer.css'

type Props = {
  ballots: Ballot[]
}

type State = {
  explanation: ExplainStvRound[]
  phase: number
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

export class StvExplainer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const explanation = explainStv(this.props.ballots.map(b => b.rankings))
    this.state = {
      explanation: explanation,
      phase: 0
    }
  }

  makePhaseMutator(mutator: (old: number) => number) {
    return () => {
      const nextPhase = mutator(this.state.phase)
      this.setState({phase: nextPhase})
    }
  }

  phaseControls() {
    return (
      <PhaseControls 
        isFirst={this.state.phase === 0}
        isLast={this.state.phase === this.state.explanation.length - 1}
        onFirst={this.makePhaseMutator(i => 0)}
        onPrev={this.makePhaseMutator(i => i-1)}
        onNext={this.makePhaseMutator(i => i+1)}
        onLast={this.makePhaseMutator(i => this.state.explanation.length-1)}
      />
    )
  }

  render() {
    return (
      <div className="StvExplainer" >
        <PhaseExplainer round={this.state.explanation[this.state.phase]} />
        {this.phaseControls()}
      </div>
    )
  }
}