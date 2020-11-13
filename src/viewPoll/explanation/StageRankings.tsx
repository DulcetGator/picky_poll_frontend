import React from 'react';

type Props = {
  rankings: string[][]
}

function StageRankings(props: Props) {
  function place(candidates: string[]) {
    if (candidates.length === 1) {
      return (
        <li>
          {candidates[0]}
        </li>
      );
    }
    return (
      <li>
        Tie!
        {' '}
        {candidates.join(', ')}
      </li>
    );
  }

  return (
    <ol>
      {props.rankings.map((r) => place(r))}
    </ol>
  );
}
