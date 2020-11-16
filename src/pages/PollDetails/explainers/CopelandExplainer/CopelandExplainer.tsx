import React from 'react'
import { Ballot } from '../../../../api'
import { copeland } from '../../../../util/copeland'
import WinnerDisplay from './WinnerDisplay'

import './CopelandExplainer.css'
import PairwiseTable from './PairwiseTable'

type Props = {
  ballots: Ballot[],
  isClosed: boolean,
}

export default function CopelandExplainer(props: Props) {

  const result = copeland(props.ballots.map(b => b.rankings))
  const winners = result[0]
    ? result[0].candidates.map(c => c.candidate)
    : []

  return (
    <div className="CopelandExplainer">
      <WinnerDisplay winners={winners} isClosed={props.isClosed}/>
      <PairwiseTable result={result} />
    </div>
  )
}