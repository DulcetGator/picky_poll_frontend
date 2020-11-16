import React from 'react';

import './WinnerDisplay.css';

type Props = {
  isClosed: boolean
  winners: string[]
}

export default function WinnerDisplay(props: Props) {
  const tie = props.winners.length > 1;

  let label;
  if (props.isClosed && tie) {
    label = 'Winners (tie)';
  } else if (props.isClosed) {
    label = 'Winner';
  } else if (tie) {
    label = 'Current winners (tie)';
  } else {
    label = 'Current winner';
  }

  return (
    <div className="WinnerDisplay">
      <div className="winner-label">
        {label}
        :
      </div>
      <ul>
        {props.winners.map((c) => <li key={c} className="winner">{c}</li>)}
      </ul>
    </div>
  );
}
