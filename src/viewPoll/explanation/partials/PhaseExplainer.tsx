import React from 'react'
import { Table } from 'react-bootstrap'
import { ExplainStvRound } from '../explainUtil'

export function PhaseExplainer(props: {round: ExplainStvRound}) {

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