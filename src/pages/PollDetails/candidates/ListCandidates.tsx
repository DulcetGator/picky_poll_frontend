import React from 'react'
import { Table } from 'react-bootstrap'
import { Candidate } from '../../../api'

import './ListCandidates.css'

function candidateRow(c: Candidate) {
    return (
        <tr key={c.name}>
            <td>
                {c.name}
            </td>
            <td>
                {c.description}
            </td>
        </tr>
    )
}

type Props = {
    candidates: Candidate[]
}

export default function ListCandidates(props: Props) {
    const candidateRows = props.candidates.map(c =>
        candidateRow(c)
    )
    return (
        <div className="ListCandidates">
            <Table>
                <tbody>
                    {candidateRows}
                </tbody>
            </Table>
        </div>
    )
}