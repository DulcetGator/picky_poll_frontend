import React from 'react';
import { Pagination } from 'react-bootstrap';
import './PhaseControls.css';

type Props = {
  isFirst: boolean,
  isLast: boolean,
  onFirst: () => void
  onPrev: () => void,
  onNext: () => void,
  onLast: () => void,
}

export function PhaseControls(props: Props) {
  return (
    <div className="PhaseControls">
      <Pagination>
        <Pagination.First
          disabled={props.isFirst}
          onClick={() => props.onFirst()}
        />
        <Pagination.Prev
          disabled={props.isFirst}
          onClick={() => props.onPrev()}
        />
        <Pagination.Next
          disabled={props.isLast}
          onClick={() => props.onNext()}
        />
        <Pagination.Last
          disabled={props.isLast}
          onClick={() => props.onLast()}
        />
      </Pagination>
    </div>
  );
}
